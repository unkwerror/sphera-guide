import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
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

const fragmentShader = `
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
    this.renderer.setSize(width, height, false);
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

    const s = this.pre.style;
    s.fontFamily = this.fontFamily;
    s.fontSize = `${this.fontSize}px`;
    s.margin = '0';
    s.padding = '0';
    s.lineHeight = '1em';
    s.position = 'absolute';
    s.left = '0';
    s.top = '0';
    s.zIndex = '9';
    s.backgroundAttachment = 'fixed';
    s.mixBlendMode = 'difference';
    s.border = 'none';
    s.overflow = 'hidden';
    s.userSelect = 'none';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }
    this._asciify(w, h);
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

  _asciify(w, h) {
    if (!w || !h) return;
    const imgData = this.context.getImageData(0, 0, w, h).data;
    let str = '';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (x + y * w) * 4;
        const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
        if (a === 0) { str += ' '; continue; }
        let gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += '\n';
    }
    this.pre.textContent = str;
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
    const m = this.context.measureText(this.txt);
    this.canvas.width = Math.ceil(m.width) + 20;
    this.canvas.height = Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + 20;
  }
  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const m = this.context.measureText(this.txt);
    this.context.fillText(this.txt, 10, 10 + m.actualBoundingBoxAscent);
  }
  get texture() { return this.canvas; }
}

class CanvAscii {
  constructor({ text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves }, container, width, height) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = container;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: width / 2, y: height / 2 };
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
    const aspect = this.textCanvas.canvas.width / this.textCanvas.canvas.height;
    const h = this.planeBaseHeight;
    this.geometry = new THREE.PlaneGeometry(h * aspect, h, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
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
    const b = this.container.getBoundingClientRect();
    this.mouse = { x: e.clientX - b.left, y: e.clientY - b.top };
  }

  _animate() {
    const frame = () => {
      this.rafId = requestAnimationFrame(frame);
      this._render();
    };
    frame();
  }

  _render() {
    const t = new Date().getTime() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.material.uniforms.uTime.value = Math.sin(t);
    const rx = mapRange(this.mouse.y, 0, this.height, 0.5, -0.5);
    const ry = mapRange(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (rx - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (ry - this.mesh.rotation.y) * 0.05;
    this.filter.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode) {
        this.container.removeChild(this.filter.domElement);
      }
    }
    this.container.removeEventListener('mousemove', this._onMouseMove);
    this.container.removeEventListener('touchmove', this._onMouseMove);
    if (this.texture) this.texture.dispose();
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    this.scene.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
  }
}

export default function ASCIIText({
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let io = null;
    let ro = null;

    const create = async (el, w, h) => {
      const inst = new CanvAscii(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        el, w, h,
      );
      await inst.init();
      return inst;
    };

    const attachRO = () => {
      ro = new ResizeObserver((entries) => {
        if (!entries[0] || !asciiRef.current) return;
        const { width: w, height: h } = entries[0].contentRect;
        if (w > 0 && h > 0) asciiRef.current.setSize(w, h);
      });
      ro.observe(containerRef.current);
    };

    const setup = async () => {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width === 0 || height === 0) {
        io = new IntersectionObserver(async ([entry]) => {
          if (cancelled) return;
          if (entry.isIntersecting && entry.boundingClientRect.width > 0) {
            const { width: w, height: h } = entry.boundingClientRect;
            io.disconnect(); io = null;
            if (cancelled) return;
            const inst = await create(containerRef.current, w, h);
            if (cancelled) { inst.dispose(); return; }
            asciiRef.current = inst;
            inst.load();
            attachRO();
          }
        }, { threshold: 0.1 });
        io.observe(containerRef.current);
        return;
      }
      const inst = await create(containerRef.current, width, height);
      if (cancelled) { inst.dispose(); return; }
      asciiRef.current = inst;
      inst.load();
      attachRO();
    };

    setup();
    return () => {
      cancelled = true;
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      if (asciiRef.current) { asciiRef.current.dispose(); asciiRef.current = null; }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <>
      <style>{`
        .ascii-text-container canvas {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          image-rendering: pixelated;
          visibility: hidden;
        }
        .ascii-text-container pre {
          margin: 0; user-select: none; padding: 0;
          line-height: 1em; text-align: left;
          position: absolute; left: 0; top: 0;
          border: none; background: none;
          background-image: radial-gradient(circle, #ff6188 0%, #fc9867 50%, #ffd866 100%);
          background-attachment: fixed;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          z-index: 9;
          mix-blend-mode: difference;
        }
      `}</style>
      <div
        ref={containerRef}
        className="ascii-text-container"
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
    </>
  );
}
