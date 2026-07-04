'use client';

import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

vec3 colorBg = vec3(0.01, 0.02, 0.04);
vec3 colorGold = vec3(0.83, 0.68, 0.45);
vec3 colorCyan = vec3(0.17, 0.83, 0.75);
vec3 colorGlow = vec3(0.1, 0.15, 0.25);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float map(vec3 p) {
  vec2 gridPos = floor(p.xz / 2.5);
  vec3 localP = p;
  localP.xz = mod(p.xz, 2.5) - 1.25;

  float h = 2.0 + 8.0 * hash(gridPos);
  float w = 0.5 + 0.3 * hash(gridPos + 0.5);
  float d = sdBox(localP - vec3(0.0, h, 0.0), vec3(w, h, w));
  return min(d, p.y + 0.5);
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.01, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

void main() {
  vec2 uv = (v_texCoord - 0.5) * 2.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float speed = u_time * 0.12;
  vec3 ro = vec3(0.0, 1.0 + speed, 5.0);
  vec3 lookAt = vec3(0.0, 5.0 + speed, 0.0);

  vec3 f = normalize(lookAt - ro);
  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));
  vec3 u = cross(f, r);
  vec3 rd = normalize(uv.x * r + uv.y * u + 1.5 * f);

  float t = 0.0;
  float d = 0.0;
  for(int i = 0; i < 80; i++) {
    d = map(ro + rd * t);
    if(d < 0.001 || t > 40.0) break;
    t += d;
  }

  vec3 col = colorBg;
  if(t < 40.0) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);

    float diff = max(dot(n, normalize(vec3(1.0, 2.0, 1.0))), 0.0);
    float spec = pow(max(dot(reflect(-normalize(vec3(1.0, 2.0, 1.0)), n), -rd), 0.0), 32.0);
    float windows = step(0.9, fract(p.y * 5.0)) * step(0.8, fract(atan(p.z, p.x) * 4.0));
    vec3 windowCol = mix(colorGold, colorCyan, hash(floor(p.yy * 5.0)));

    col = mix(colorBg, colorGlow, diff);
    col += spec * colorGold * 0.5;
    col += windows * windowCol * 1.5 * exp(-t * 0.1);
    col += pow(1.0 - max(dot(n, -rd), 0.0), 3.0) * colorCyan * 0.5;
  }

  col = mix(col, colorBg, 1.0 - exp(-0.02 * t));
  col *= 1.2;

  float leftMask = smoothstep(0.78, 0.08, v_texCoord.x);
  float bottomMask = smoothstep(0.0, 0.42, v_texCoord.y);
  col = mix(col, col * 0.18, leftMask);
  col = mix(colorBg, col, bottomMask);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function StitchHighRiseShader({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: true }) ?? canvas.getContext('experimental-webgl');
    if (!(gl instanceof WebGLRenderingContext)) return;

    let animationFrame = 0;
    const mouse = { x: 0, y: 0 };

    const syncSize = () => {
      const width = canvas.clientWidth || 1280;
      const height = canvas.clientHeight || 720;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.floor(width * ratio);
      const nextHeight = Math.floor(height * ratio);
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
    };

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
      mouse.y = (1 - (event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
    };

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    window.addEventListener('mousemove', onMouseMove);
    syncSize();

    const render = (time: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrame = requestAnimationFrame(render);
    };
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
