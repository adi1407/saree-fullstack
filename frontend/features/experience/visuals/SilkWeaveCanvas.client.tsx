"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle, type OGLRenderingContext } from "ogl";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// Ambient effect — cap well below display refresh to save GPU/battery.
const TARGET_FPS = 50;
const FRAME_MS = 1000 / TARGET_FPS;

// Under prefers-reduced-motion: drift gently and slowly instead of freezing.
const REDUCED_TIME_SCALE = 0.35;
const REDUCED_FPS = 30;

/**
 * Flowing handloom-silk backdrop rendered with OGL (minimal WebGL).
 * Domain-warped drape folds with a gold "zari" sheen over the brand palette,
 * plus a faint woven micro-grid and a subtle pointer ripple.
 *
 * Under reduced motion it drifts slowly with no interactive ripple/pointer;
 * otherwise it runs the full effect. Pauses while offscreen or tab-hidden.
 */

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColorInk;
  uniform vec3 uColorSilk;
  uniform vec3 uColorGold;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    // Correct aspect so folds don't stretch on wide screens.
    vec2 uv = vUv;
    vec2 auv = uv;
    auv.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.06;

    // Aspect-corrected pointer so the hotspot stays circular and matches folds.
    vec2 amouse = uMouse;
    amouse.x *= uResolution.x / uResolution.y;
    float md = distance(auv, amouse);

    // Pointer ripple through the fabric — wider and stronger so it reads.
    float ripple = 0.18 * exp(-md * 2.5) * sin(md * 22.0 - uTime * 3.0);

    // Domain warp -> soft silk folds.
    vec2 q = vec2(fbm(auv * 3.0 + t), fbm(auv * 3.0 - t + 5.2));
    vec2 warp = auv * 2.5 + q * 0.9 + ripple;

    // Anisotropic drape bands flowing across the weave.
    float bands = sin(warp.y * 6.0 + warp.x * 1.5 + fbm(warp * 1.5) * 3.0 + t * 4.0);
    float folds = smoothstep(-1.0, 1.0, bands);
    float sheen = pow(folds, 3.0);

    // Woven micro-grid (warp + weft threads).
    float weave = 0.5 + 0.5 * sin(uv.x * 900.0) * sin(uv.y * 900.0);
    weave = mix(1.0, weave, 0.05);

    vec3 col = mix(uColorInk, uColorSilk, folds);
    col = mix(col, uColorGold, sheen * 0.55);
    col += uColorGold * sheen * 0.22;
    col *= weave;

    // Cursor-following gold "zari" glow — the visible hover response.
    float glow = exp(-md * 3.0);
    col += uColorGold * glow * 0.35;
    col = mix(col, uColorGold, sheen * glow * 0.4);

    // Gentle vignette to keep edges rich and center readable.
    float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
    col *= mix(0.6, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function srgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

interface SilkWeaveCanvasProps {
  className?: string;
}

export function SilkWeaveCanvas({ className }: SilkWeaveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Bumped to force a full re-init after the GPU restores a lost context.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el: HTMLDivElement = containerRef.current;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
      });
    } catch {
      // WebGL unavailable — the static CSS fallback behind this canvas remains.
      return;
    }

    const gl: OGLRenderingContext = renderer.gl;
    gl.clearColor(0.101, 0.078, 0.063, 1);

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    el.appendChild(canvas);

    // Context-loss recovery: stop cleanly on loss, rebuild on restore.
    function onContextLost(e: Event) {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function onContextRestored() {
      setReloadKey((k) => k + 1);
    }
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uColorInk: { value: srgb("#1a1410") },
        uColorSilk: { value: srgb("#6b2d3c") },
        uColorGold: { value: srgb("#c9a962") },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(el.clientWidth, el.clientHeight);
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Smoothed pointer influence.
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    function onPointerMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    }
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!reduced && finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    let raf = 0;
    let lastFrame = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const shouldRun = () => onScreen && pageVisible;

    function ensureLoop() {
      if (shouldRun() && !raf) raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        ensureLoop();
      },
      { threshold: 0 }
    );
    io.observe(el);

    function onVisibility() {
      pageVisible = !document.hidden;
      ensureLoop();
    }
    document.addEventListener("visibilitychange", onVisibility);

    const timeScale = reduced ? REDUCED_TIME_SCALE : 1;
    const frameBudget = reduced ? 1000 / REDUCED_FPS : FRAME_MS;

    function render(time: number) {
      mouse.x += (target.x - mouse.x) * 0.09;
      mouse.y += (target.y - mouse.y) * 0.09;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uTime.value = time * 0.001 * timeScale;
      renderer.render({ scene: mesh });
    }

    function loop(time: number) {
      if (!shouldRun()) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
      // Throttle to the active frame budget regardless of display refresh rate.
      if (time - lastFrame < frameBudget) return;
      lastFrame = time;
      render(time);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.remove();
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, [reduced, reloadKey]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    />
  );
}
