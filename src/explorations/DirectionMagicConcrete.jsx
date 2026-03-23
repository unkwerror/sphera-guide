import { useState, useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';

/* ═══════════════════════════════════════════════════════════════
   VISUAL DIRECTION: MAGIC INSIDE CONCRETE
   ─────────────────────────────────────────────────────────────
   cool dark palette · dithered wave bg · ASCII 3D text
   brutalism + neo-sigilism · restrained contrast accents
   ═══════════════════════════════════════════════════════════════ */

// ═══════════════ DITHER BACKGROUND ═══════════════

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz, iy = Pi.yyww;
  vec4 fx = Pf.xzxz, fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x), g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z), g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x)), n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z)), n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0, amp = 1.0, freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq; amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0,48.0/64.0,12.0/64.0,60.0/64.0, 3.0/64.0,51.0/64.0,15.0/64.0,63.0/64.0,
  32.0/64.0,16.0/64.0,44.0/64.0,28.0/64.0,35.0/64.0,19.0/64.0,47.0/64.0,31.0/64.0,
  8.0/64.0,56.0/64.0, 4.0/64.0,52.0/64.0,11.0/64.0,59.0/64.0, 7.0/64.0,55.0/64.0,
  40.0/64.0,24.0/64.0,36.0/64.0,20.0/64.0,43.0/64.0,27.0/64.0,39.0/64.0,23.0/64.0,
  2.0/64.0,50.0/64.0,14.0/64.0,62.0/64.0, 1.0/64.0,49.0/64.0,13.0/64.0,61.0/64.0,
  34.0/64.0,18.0/64.0,46.0/64.0,30.0/64.0,33.0/64.0,17.0/64.0,45.0/64.0,29.0/64.0,
  10.0/64.0,58.0/64.0, 6.0/64.0,54.0/64.0, 9.0/64.0,57.0/64.0, 5.0/64.0,53.0/64.0,
  42.0/64.0,26.0/64.0,38.0/64.0,22.0/64.0,41.0/64.0,25.0/64.0,37.0/64.0,21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  constructor() {
    const uniforms = new Map([
      ['colorNum', new THREE.Uniform(4.0)],
      ['pixelSize', new THREE.Uniform(2.0)],
    ]);
    super('RetroEffect', ditherFragmentShader, { uniforms });
  }
  set colorNum(v) { this.uniforms.get('colorNum').value = v; }
  get colorNum() { return this.uniforms.get('colorNum').value; }
  set pixelSize(v) { this.uniforms.get('pixelSize').value = v; }
  get pixelSize() { return this.uniforms.get('pixelSize').value; }
}

const WrappedRetro = wrapEffect(RetroEffectImpl);

const RetroEffect = forwardRef((props, ref) => {
  const { colorNum, pixelSize } = props;
  return <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />;
});
RetroEffect.displayName = 'RetroEffect';

function DitheredWaves({
  waveSpeed, waveFrequency, waveAmplitude, waveColor,
  colorNum, pixelSize, disableAnimation,
  enableMouseInteraction, mouseRadius,
}) {
  const mesh = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) res.set(w, h);
  }, [size, gl]);

  const prevColor = useRef([...waveColor]);
  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;
    if (!disableAnimation) u.time.value = clock.getElapsedTime();
    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
    if (u.waveFrequency.value !== waveFrequency) u.waveFrequency.value = waveFrequency;
    if (u.waveAmplitude.value !== waveAmplitude) u.waveAmplitude.value = waveAmplitude;
    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.set(...waveColor);
      prevColor.current = [...waveColor];
    }
    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    if (enableMouseInteraction) u.mousePos.value.copy(mouseRef.current);
  });

  const handlePointerMove = (e) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>
      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>
      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

function Dither({
  waveSpeed = 0.05, waveFrequency = 3, waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5], colorNum = 4, pixelSize = 2,
  disableAnimation = false, enableMouseInteraction = true, mouseRadius = 1,
}) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed} waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude} waveColor={waveColor}
        colorNum={colorNum} pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  );
}


// ═══════════════ ASCII 3D TEXT ═══════════════

const asciiVertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;
void main() {
  vUv = uv;
  float time = uTime * 5.0;
  float waveFactor = uEnableWaves;
  vec3 transformed = position;
  transformed.x += sin(time + position.y) * 0.5 * waveFactor;
  transformed.y += cos(time + position.z) * 0.15 * waveFactor;
  transformed.z += sin(time + position.x) * waveFactor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const asciiFragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;
void main() {
  float time = uTime;
  vec2 pos = vUv;
  float r = texture2D(uTexture, pos + cos(time * 2.0 - time + pos.x) * 0.01).r;
  float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
  float b = texture2D(uTexture, pos - cos(time * 2.0 + time + pos.y) * 0.01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

function mapRange(n, start, stop, start2, stop2) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
}

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset = charset ?? " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.context.imageSmoothingEnabled = false;
    this.center = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this._onMouseMove = this._onMouseMove.bind(this);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this._reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  _reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width;
    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '0';
    this.pre.style.top = '0';
    this.pre.style.zIndex = '9';
    this.pre.style.backgroundAttachment = 'fixed';
    this.pre.style.mixBlendMode = 'difference';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }
    this._asciify(this.context, w, h);
    this._hue();
  }

  _onMouseMove(e) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  _hue() {
    const dx = this.mouse.x - this.center.x;
    const dy = this.mouse.y - this.center.y;
    const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  _asciify(ctx, w, h) {
    if (w && h) {
      const imgData = ctx.getImageData(0, 0, w, h).data;
      let str = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = x * 4 + y * 4 * w;
          const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
          if (a === 0) { str += ' '; continue; }
          let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
          let idx = Math.floor((1 - gray) * (this.charset.length - 1));
          if (this.invert) idx = this.charset.length - idx - 1;
          str += this.charset[idx];
        }
        str += '\n';
      }
      this.pre.innerHTML = str;
    }
  }

  dispose() {
    document.removeEventListener('mousemove', this._onMouseMove);
  }
}

class CanvasTxt {
  constructor(txt, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }
  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.canvas.width = Math.ceil(metrics.width) + 20;
    this.canvas.height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
  }
  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.context.fillText(this.txt, 10, 10 + metrics.actualBoundingBoxAscent);
  }
  get texture() { return this.canvas; }
}

class CanvAscii {
  constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, containerElem, width, height) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: this.width / 2, y: this.height / 2 };
    this._onMouseMove = this._onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load('600 200px "JetBrains Mono"');
      await document.fonts.load('500 12px "JetBrains Mono"');
    } catch { /* fallback */ }
    await document.fonts.ready;
    this._setMesh();
    this._setRenderer();
  }

  _setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'JetBrains Mono',
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();
    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;
    const textAspect = this.textCanvas.canvas.width / this.textCanvas.canvas.height;
    const baseH = this.planeBaseHeight;
    this.geometry = new THREE.PlaneGeometry(baseH * textAspect, baseH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader: asciiVertexShader,
      fragmentShader: asciiFragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'JetBrains Mono',
      fontSize: this.asciiFontSize,
      invert: true,
    });
    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
    this.container.addEventListener('mousemove', this._onMouseMove);
    this.container.addEventListener('touchmove', this._onMouseMove);
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  load() { this._animate(); }

  _onMouseMove(evt) {
    const e = evt.touches ? evt.touches[0] : evt;
    const bounds = this.container.getBoundingClientRect();
    this.mouse = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  }

  _animate() {
    const frame = () => {
      this.animationFrameId = requestAnimationFrame(frame);
      this._render();
    };
    frame();
  }

  _render() {
    const time = new Date().getTime() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.material.uniforms.uTime.value = Math.sin(time);
    const x = mapRange(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = mapRange(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (x - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (y - this.mesh.rotation.y) * 0.05;
    this.filter.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode) {
        this.container.removeChild(this.filter.domElement);
      }
    }
    this.container.removeEventListener('mousemove', this._onMouseMove);
    this.container.removeEventListener('touchmove', this._onMouseMove);
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        if (obj.material) {
          Object.keys(obj.material).forEach((key) => {
            const p = obj.material[key];
            if (p && typeof p === 'object' && typeof p.dispose === 'function') p.dispose();
          });
          obj.material.dispose();
        }
        if (obj.geometry) obj.geometry.dispose();
      }
    });
    this.scene.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

function ASCIIText({
  text = 'SFERA',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true,
}) {
  const containerRef = useRef(null);
  const asciiRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let observer = null;
    let ro = null;

    const create = async (container, w, h) => {
      const instance = new CanvAscii(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        container, w, h,
      );
      await instance.init();
      return instance;
    };

    const setup = async () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width === 0 || height === 0) {
        observer = new IntersectionObserver(async ([entry]) => {
          if (cancelled) return;
          if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
            const { width: w, height: h } = entry.boundingClientRect;
            observer.disconnect();
            observer = null;
            if (!cancelled) {
              asciiRef.current = await create(containerRef.current, w, h);
              if (!cancelled && asciiRef.current) asciiRef.current.load();
            }
          }
        }, { threshold: 0.1 });
        observer.observe(containerRef.current);
        return;
      }
      asciiRef.current = await create(containerRef.current, width, height);
      if (!cancelled && asciiRef.current) {
        asciiRef.current.load();
        ro = new ResizeObserver((entries) => {
          if (!entries[0] || !asciiRef.current) return;
          const { width: w, height: h } = entries[0].contentRect;
          if (w > 0 && h > 0) asciiRef.current.setSize(w, h);
        });
        ro.observe(containerRef.current);
      }
    };

    setup();
    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (ro) ro.disconnect();
      if (asciiRef.current) { asciiRef.current.dispose(); asciiRef.current = null; }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div ref={containerRef} className="mc-ascii-container"
      style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}
    />
  );
}


// ═══════════════ MAIN COMPONENT ═══════════════

const TASKS = [
  {
    title: 'ROBOCAR · ROS2',
    description: 'Интеграция PX4 с ROS2 для управления приводами. Навигация, телеметрия, автономное управление мобильным роботом с дифференциальным приводом.',
    status: 'В работе',
    tags: ['ROS2', 'PX4', 'Navigation'],
  },
  {
    title: 'YOLO · NPU DETECTOR',
    description: 'Оптимизация и деплой детектора объектов YOLO на Orange Pi с аппаратным ускорением. Квантование, профилирование, снижение задержек.',
    status: 'Ревью',
    tags: ['YOLO', 'Edge AI', 'NPU'],
  },
  {
    title: 'СПЕРАНСКИЙ · LLM',
    description: 'Мультиагентная система конспектирования: транскрибация аудиопотока, структуризация через LLM, экспорт в Markdown и LaTeX.',
    status: 'Планирование',
    tags: ['LLM', 'NLP', 'Agents'],
  },
];

export default function DirectionMagicConcrete() {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;700;900&display=swap');

        .mc-root *, .mc-root *::before, .mc-root *::after {
          margin: 0; padding: 0; box-sizing: border-box;
        }
        .mc-root {
          min-height: 100vh;
          background: #0a0c10;
          color: #e0e4ec;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* scanline Y2K overlay */
        .mc-scanline {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px);
          opacity: 0.4;
        }

        /* nav */
        .mc-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(18, 21, 27, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #252a35;
        }
        .mc-nav-inner {
          max-width: 1600px; margin: 0 auto;
          padding: 1.5rem 3rem;
          display: flex; justify-content: space-between; align-items: center;
        }
        .mc-nav-logo {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.25rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #e0e4ec;
          display: flex; align-items: center; gap: 1rem;
        }
        .mc-space-badge {
          background: #5b8fb9; color: #0a0c10;
          padding: 0.4rem 1rem; font-size: 0.75rem;
          font-weight: 700; letter-spacing: 0.1em;
          text-shadow: 0 0 8px rgba(91,143,185,0.6);
        }
        .mc-nav-tabs { display: flex; gap: 2.5rem; }
        .mc-nav-tab {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: #8892a4;
          cursor: pointer; border: none; background: none;
          padding: 0.5rem 0; position: relative; font-weight: 600;
          transition: color 0.2s ease;
        }
        .mc-nav-tab:hover { color: #e0e4ec; }
        .mc-nav-tab[data-active="true"] {
          color: #5b8fb9;
          text-shadow: 0 0 8px rgba(91,143,185,0.4);
        }
        .mc-nav-tab[data-active="true"]::after {
          content: ''; position: absolute;
          bottom: -1.5rem; left: 0; right: 0;
          height: 1px; background: #5b8fb9;
          box-shadow: 0 0 8px rgba(91,143,185,0.6);
        }

        /* hero */
        .mc-hero {
          max-width: 1600px; margin: 0 auto; padding: 0 3rem;
          position: relative; height: 50vh;
          display: flex; align-items: center; justify-content: center;
        }
        .mc-ascii-wrapper {
          position: relative; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }
        .mc-hero-overlay {
          position: absolute; bottom: 2rem;
          left: 0; right: 0; z-index: 20; text-align: center;
        }
        .mc-hero-subtitle {
          font-size: 1rem; color: #8892a4;
          margin-bottom: 0.5rem; font-weight: 500;
        }
        .mc-hero-institute {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.15em;
          color: #5b8fb9; text-transform: uppercase;
          font-weight: 600;
          text-shadow: 0 0 8px rgba(91,143,185,0.4);
        }

        /* ASCII text gradient fill */
        .mc-ascii-container canvas {
          position: absolute; left: 0; top: 0; width: 100%; height: 100%;
          image-rendering: pixelated;
        }
        .mc-ascii-container pre {
          margin: 0; user-select: none; padding: 0;
          line-height: 1em; text-align: left;
          position: absolute; left: 0; top: 0;
          background-image: linear-gradient(135deg, #5b8fb9 0%, #c4a882 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          z-index: 9; mix-blend-mode: difference;
        }

        /* sections */
        .mc-section {
          max-width: 1600px; margin: 0 auto; padding: 0 3rem 6rem;
        }
        .mc-section-header {
          display: flex; align-items: center; gap: 2rem;
          margin-bottom: 3rem; padding-top: 4rem;
        }
        .mc-section-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.5rem; font-weight: 700;
          color: #252a35; line-height: 1;
        }
        .mc-section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.25rem; font-weight: 900;
          text-transform: uppercase; color: #e0e4ec;
          letter-spacing: 0.05em;
        }

        /* manifesto */
        .mc-manifesto-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #252a35; border: 1px solid #252a35;
        }
        .mc-manifesto-block {
          background: #12151b; padding: 2.5rem;
          position: relative; min-height: 280px;
          transition: background-color 0.3s ease;
        }
        .mc-manifesto-block:hover { background: #181c24; }
        .mc-manifesto-block:first-child::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 40px; height: 1px; background: #c4a882;
          box-shadow: 0 0 8px rgba(196,168,130,0.6);
        }
        .mc-manifesto-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem; color: #8892a4;
          margin-bottom: 1.5rem; font-weight: 600;
        }
        .mc-manifesto-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem; font-weight: 900;
          text-transform: uppercase; color: #e0e4ec;
          margin-bottom: 1.25rem; letter-spacing: 0.03em;
        }
        .mc-manifesto-text {
          font-size: 0.95rem; color: #8892a4;
          line-height: 1.7; font-weight: 400;
        }

        /* task cards */
        .mc-task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 1px; background: #252a35; border: 1px solid #252a35;
        }
        .mc-task-card {
          background: rgba(18,21,27,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37,42,53,0.8);
          padding: 2rem; position: relative;
          transition: all 0.3s ease; cursor: pointer;
        }
        .mc-task-card:hover {
          background: #181c24;
          border-left: 1px solid #5b8fb9;
        }
        .mc-task-status {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; padding: 0.4rem 0.9rem;
          background: #5b8fb9; color: #0a0c10;
          margin-bottom: 1.25rem; font-weight: 700;
          letter-spacing: 0.1em;
          text-shadow: 0 0 8px rgba(91,143,185,0.4);
        }
        .mc-task-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.125rem; font-weight: 700;
          color: #e0e4ec; margin-bottom: 0.875rem;
          letter-spacing: 0.05em;
        }
        .mc-task-desc {
          font-size: 0.9rem; color: #8892a4;
          line-height: 1.7; margin-bottom: 1.5rem;
        }
        .mc-task-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .mc-task-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; padding: 0.35rem 0.75rem;
          background: transparent; color: #8892a4;
          border: 1px solid #252a35; font-weight: 600;
          transition: all 0.2s ease;
        }
        .mc-task-tag:hover { border-color: #5b8fb9; color: #5b8fb9; }

        /* kanban */
        .mc-kanban {
          border: 1px solid #252a35;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #252a35;
        }
        .mc-kanban-col { background: #12151b; padding: 2rem; min-height: 380px; }
        .mc-kanban-col-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem; font-weight: 900;
          text-transform: uppercase; color: #e0e4ec;
          margin-bottom: 1.5rem; padding-bottom: 0.875rem;
          border-bottom: 1px solid #252a35; letter-spacing: 0.03em;
        }
        .mc-kanban-item {
          background: #181c24; border: 1px solid #252a35;
          padding: 1rem; margin-bottom: 0.875rem;
          font-size: 0.85rem; color: #8892a4; font-weight: 500;
          transition: all 0.2s ease;
        }
        .mc-kanban-item:hover { border-color: #5b8fb9; background: #1a1e26; }

        /* divider */
        .mc-divider {
          height: 1px; background: #252a35;
          margin: 5rem auto; max-width: 1600px;
        }

        /* CTA */
        .mc-cta-section { max-width: 1600px; margin: 6rem auto; padding: 0 3rem; }
        .mc-cta-panel {
          background: rgba(18,21,27,0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(37,42,53,0.8);
          padding: 4rem 3rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .mc-cta-panel::before {
          content: ''; position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 120px; height: 1px;
          background: linear-gradient(90deg, transparent, #c4a882, transparent);
          box-shadow: 0 0 12px rgba(196,168,130,0.8);
        }
        .mc-cta-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem; font-weight: 900;
          text-transform: uppercase; color: #e0e4ec;
          margin-bottom: 1.5rem; letter-spacing: 0.02em;
        }
        .mc-cta-text {
          font-size: 1.125rem; color: #8892a4;
          max-width: 700px; margin: 0 auto 2.5rem;
          line-height: 1.7; font-weight: 500;
        }
        .mc-cta-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 1.25rem 3rem;
          background: #5b8fb9; color: #0a0c10;
          border: 1px solid #5b8fb9; cursor: pointer;
          transition: all 0.3s ease;
          text-shadow: 0 0 8px rgba(91,143,185,0.4);
        }
        .mc-cta-btn:hover {
          background: transparent; color: #5b8fb9;
          box-shadow: 0 0 20px rgba(91,143,185,0.3);
        }
        .mc-cta-btn:active { transform: scale(0.98); }

        @media (max-width: 1200px) {
          .mc-manifesto-grid { grid-template-columns: 1fr; }
          .mc-kanban { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .mc-nav-inner {
            padding: 1.25rem; flex-direction: column;
            gap: 1.25rem; align-items: flex-start;
          }
          .mc-nav-tabs { gap: 1.5rem; }
          .mc-hero { height: 45vh; padding: 0 1.5rem; }
          .mc-section-title { font-size: 1.5rem; }
          .mc-cta-title { font-size: 1.75rem; }
          .mc-task-grid { grid-template-columns: 1fr; }
          .mc-section { padding: 0 1.5rem 4rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mc-root *, .mc-root *::before, .mc-root *::after {
            animation: none !important; transition: none !important;
          }
        }
      `}</style>

      <div className="mc-root">
        <div className="mc-scanline" />

        {/* dithered wave background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3 }}>
          <Dither
            waveColor={[0.2, 0.25, 0.35]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.4}
            colorNum={8}
            waveAmplitude={0.2}
            waveFrequency={2.5}
            waveSpeed={0.03}
            pixelSize={3}
          />
        </div>

        {/* ══ NAV ══ */}
        <nav className="mc-nav">
          <div className="mc-nav-inner">
            <div className="mc-nav-logo">
              <span>ИИР</span>
              <span className="mc-space-badge">SFERA.TASKS</span>
            </div>
            <div className="mc-nav-tabs">
              {['tasks', 'projects', 'team'].map((tab) => (
                <button key={tab} className="mc-nav-tab"
                  data-active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {{ tasks: 'Задачи', projects: 'Проекты', team: 'Команда' }[tab]}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <section className="mc-hero">
          <div className="mc-ascii-wrapper">
            <ASCIIText
              text="SFERA"
              asciiFontSize={5}
              textFontSize={180}
              textColor="#e0e4ec"
              planeBaseHeight={6}
              enableWaves={true}
            />
            <div className="mc-hero-overlay">
              <p className="mc-hero-subtitle">
                Система управления проектами для инженеров
              </p>
              <div className="mc-hero-institute">
                Институт Интеллектуальной Робототехники · Мехатроника и робототехника
              </div>
            </div>
          </div>
        </section>

        <div className="mc-divider" />

        {/* ══ MANIFESTO ══ */}
        <div className="mc-section">
          <div className="mc-section-header">
            <span className="mc-section-num">01</span>
            <h2 className="mc-section-title">Манифест</h2>
          </div>

          <div className="mc-manifesto-grid">
            <div className="mc-manifesto-block">
              <div className="mc-manifesto-num">[01]</div>
              <h3 className="mc-manifesto-title">Хаос видим</h3>
              <p className="mc-manifesto-text">
                Команда из трёх человек. Один пишет код, второй «ищет информацию», третий молчит.
                Через месяц — один выгорел, двое не знают что происходит. Бэклог, спринт, статус —
                это не бюрократия. Это единственный способ сделать хаос видимым до того, как проект сгорит.
              </p>
            </div>
            <div className="mc-manifesto-block">
              <div className="mc-manifesto-num">[02]</div>
              <h3 className="mc-manifesto-title">Один ≠ все</h3>
              <p className="mc-manifesto-text">
                Если один человек тащит весь проект — это не героизм, это сломанный процесс.
                Задача → Исполнитель → Срок → Статус. Каждый видит, кто что делает.
                Прозрачность — не контроль. Это уважение к команде и к себе.
              </p>
            </div>
            <div className="mc-manifesto-block">
              <div className="mc-manifesto-num">[03]</div>
              <h3 className="mc-manifesto-title">SMART или ничего</h3>
              <p className="mc-manifesto-text">
                «Сделать бэкенд» — это не задача. «Поднять REST API для модуля авторизации, endpoint /auth,
                JWT-токены, дедлайн пятница» — это задача. Конкретный результат лучше, чем «работал над проектом».
                Два часа фокуса лучше, чем неделя прокрастинации.
              </p>
            </div>
          </div>
        </div>

        <div className="mc-divider" />

        {/* ══ PROJECTS ══ */}
        <div className="mc-section">
          <div className="mc-section-header">
            <span className="mc-section-num">02</span>
            <h2 className="mc-section-title">Проекты ИИР</h2>
          </div>

          <div className="mc-task-grid">
            {TASKS.map((task, i) => (
              <div key={i} className="mc-task-card">
                <div className="mc-task-status">{task.status}</div>
                <h3 className="mc-task-title">{task.title}</h3>
                <p className="mc-task-desc">{task.description}</p>
                <div className="mc-task-tags">
                  {task.tags.map((tag, j) => (
                    <span key={j} className="mc-task-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mc-divider" />

        {/* ══ KANBAN ══ */}
        <div className="mc-section">
          <div className="mc-section-header">
            <span className="mc-section-num">03</span>
            <h2 className="mc-section-title">Канбан</h2>
          </div>

          <div className="mc-kanban">
            <div className="mc-kanban-col">
              <div className="mc-kanban-col-title">Бэклог</div>
              <div className="mc-kanban-item">Настройка ROS2 окружения на Jetson</div>
              <div className="mc-kanban-item">Сбор датасета для детектора огня</div>
            </div>
            <div className="mc-kanban-col">
              <div className="mc-kanban-col-title">В работе</div>
              <div className="mc-kanban-item">Калибровка LiDAR + IMU fusion</div>
              <div className="mc-kanban-item">Квантование YOLO для NPU</div>
            </div>
            <div className="mc-kanban-col">
              <div className="mc-kanban-col-title">Готово</div>
              <div className="mc-kanban-item">Базовая навигация ROBOCAR</div>
              <div className="mc-kanban-item">Детекция препятствий v1</div>
            </div>
          </div>
        </div>

        {/* ══ CTA ══ */}
        <section className="mc-cta-section">
          <div className="mc-cta-panel">
            <h2 className="mc-cta-title">Начни сейчас</h2>
            <p className="mc-cta-text">
              Первый шаг — создать задачу. Второй — сделать её.
              Сфера не спасёт от плохого проекта, но покажет,
              где именно он разваливается — пока ещё не поздно.
            </p>
            <button className="mc-cta-btn">Создать задачу</button>
          </div>
        </section>
      </div>
    </>
  );
}
