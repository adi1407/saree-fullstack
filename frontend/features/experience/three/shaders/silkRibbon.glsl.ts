export const silkRibbonVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 3.0 + uTime * 0.4) * 0.15;
    wave += sin(pos.y * 5.0 + uTime * 0.3) * 0.08;
    pos.z += wave;
    vElevation = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const silkRibbonFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    vec3 wine = vec3(0.42, 0.18, 0.24);
    vec3 gold = vec3(0.79, 0.66, 0.38);
    vec3 ink = vec3(0.10, 0.08, 0.06);

    float shimmer = sin(vUv.x * 40.0 + uTime) * 0.5 + 0.5;
    float fold = sin(vUv.y * 12.0 + uTime * 0.5) * 0.5 + 0.5;
    vec3 color = mix(wine, gold, shimmer * 0.35 + fold * 0.2);
    color = mix(color, ink, vElevation * 2.0 + 0.1);
    color += vec3(0.04) * shimmer;

    gl_FragColor = vec4(color, 0.92);
  }
`;
