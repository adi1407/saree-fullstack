export const aboutSilkVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * 2.8 + uTime * 0.55) * 0.22;
    float wave2 = sin(pos.y * 4.2 + uTime * 0.4) * 0.14;
    float wave3 = sin((pos.x + pos.y) * 3.5 + uTime * 0.7) * 0.08;
    float ripple = sin(length(pos.xy - uMouse * 2.0) * 6.0 - uTime * 2.0) * 0.06;

    float elevation = wave1 + wave2 + wave3 + ripple;
    pos.z += elevation;
    vElevation = elevation;

    vec3 transformed = pos;
    vNormal = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const aboutSilkFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 wine = vec3(0.42, 0.18, 0.24);
    vec3 gold = vec3(0.79, 0.66, 0.38);
    vec3 rose = vec3(0.85, 0.45, 0.52);
    vec3 ink = vec3(0.06, 0.05, 0.04);

    float shimmer = sin(vUv.x * 55.0 + uTime * 1.2) * 0.5 + 0.5;
    float fold = sin(vUv.y * 18.0 + uTime * 0.65) * 0.5 + 0.5;
    float grain = hash(vUv * 400.0 + uTime * 0.05) * 0.08;

    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(vec3(0.4, 0.8, 1.0));
    float spec = pow(max(dot(reflect(-lightDir, vNormal), viewDir), 0.0), 32.0);

    vec3 color = mix(wine, gold, shimmer * 0.45 + fold * 0.25);
    color = mix(color, rose, sin(uTime * 0.3 + vUv.x * 8.0) * 0.08 + 0.08);
    color = mix(color, ink, clamp(vElevation * 1.8 + 0.12, 0.0, 0.5));
    color += gold * spec * 0.6;
    color += grain;

    float vignette = smoothstep(1.2, 0.2, length(vUv - 0.5) * 1.4);
    color *= 0.75 + vignette * 0.25;

    gl_FragColor = vec4(color, 0.96);
  }
`;
