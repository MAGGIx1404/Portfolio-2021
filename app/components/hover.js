import {ogl, Vec2,Vec3,Vec4,Geometry,Flowmap,Transform,Texture,Renderer,Program,Mesh} from "ogl"
import imageOne from "../../shared/grid.jpg"
import gsap from "gsap";

const images = {
    imageOne
}

const imgSize = [1250, 833];

const vertex = `
                attribute vec2 uv;
                attribute vec2 position;
                varying vec2 vUv;
                void main() {
                        vUv = uv;
                        gl_Position = vec4(position, 0, 1);
                }
        `;
const fragment = `
                precision highp float;
                precision highp int;
                uniform sampler2D tWater;
                uniform sampler2D tFlow;
                uniform float uTime;
                varying vec2 vUv;
                uniform vec4 res;
                void main() {
                        // R and G values are velocity in the x and y direction
                        // B value is the velocity length
                        vec3 flow = texture2D(tFlow, vUv).rgb;
                        vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
                        vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
                        myUV -= flow.xy * (0.15 * 0.7);
                        vec3 tex = texture2D(tWater, myUV).rgb;
                        gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
                }
        `;


      export default function hoverEffect(){
            const renderer = new Renderer({ dpr: 2 });
            const gl = renderer.gl;
            const container = document.querySelector(".about__gallery__wrapper");
            container.appendChild(gl.canvas)
            gl.canvas.classList.add("hover-container")
            // document.body.appendChild(gl.canvas);

            // Variable inputs to control flowmap
            let aspect = 1;
            const mouse = new Vec2(-1);
            const velocity = new Vec2();
            function resize() {
              let a1, a2;
              var imageAspect = imgSize[1] / imgSize[0];
              if (window.innerHeight / window.innerWidth < imageAspect) {
                a1 = 1;
                a2 = window.innerHeight / window.innerWidth / imageAspect;
              } else {
                a1 = (window.innerWidth / window.innerHeight) * imageAspect;
                a2 = 1;
              }
              mesh.program.uniforms.res.value = new Vec4(
                window.innerWidth,
                window.innerHeight,
                a1,
                a2
              );

              renderer.setSize(window.innerWidth, window.innerHeight);
              aspect = window.innerWidth / window.innerHeight;
            }
            const flowmap = new Flowmap(gl);
            // Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
            const geometry = new Geometry(gl, {
              position: {
                size: 2,
                data: new Float32Array([-1, -1, 3, -1, -1, 3])
              },
              uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
            });
            const texture = new Texture(gl, {
              minFilter: gl.LINEAR,
              magFilter: gl.LINEAR
            });
            const img = new Image();
            img.onload = () => (texture.image = img);
            img.crossOrigin = "Anonymous";
            img.src = images.imageOne;

            let a1, a2;
            var imageAspect = imgSize[1] / imgSize[0];
            if (window.innerHeight / window.innerWidth < imageAspect) {
              a1 = 1;
              a2 = window.innerHeight / window.innerWidth / imageAspect;
            } else {
              a1 = (window.innerWidth / window.innerHeight) * imageAspect;
              a2 = 1;
            }

            const program = new Program(gl, {
              vertex,
              fragment,
              uniforms: {
                uTime: { value: 0 },
                tWater: { value: texture },
                res: {
                  value: new Vec4(window.innerWidth, window.innerHeight, a1, a2)
                },
                img: { value: new Vec2(imgSize[0], imgSize[1]) },
                // Note that the uniform is applied without using an object and value property
                // This is because the class alternates this texture between two render targets
                // and updates the value property after each render.
                tFlow: flowmap.uniform
              }
            });
            const mesh = new Mesh(gl, { geometry, program });

            window.addEventListener("resize", resize, false);
            resize();

            // Create handlers to get mouse position and velocity
            const isTouchCapable = "ontouchstart" in window;
            if (isTouchCapable) {
              window.addEventListener("touchstart", updateMouse, false);
              window.addEventListener("touchmove", updateMouse, { passive: false });
            } else {
              window.addEventListener("mousemove", updateMouse, false);
            }
            let lastTime;
            const lastMouse = new Vec2();
            function updateMouse(e) {
              e.preventDefault();
              let mouseX,mouseY;
              if (e.changedTouches && e.changedTouches.length) {
                document.body.addEventListener("mousemove", evt => {
                   mouseX = evt.clientX;
                   mouseY = evt.clientY;
                });
                e.x = mouseX;
                e.y = mouseY;
                // e.x = e.changedTouches[0].pageX;
                // e.y = e.changedTouches[0].pageY;
              }
              if (e.x === undefined) {
                e.x = mouseX;
                e.y = mouseY;
              }

              // Get mouse value in 0 to 1 range, with y flipped
              mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
              // Calculate velocity
              if (!lastTime) {
                // First frame
                lastTime = performance.now();
                lastMouse.set(e.x, e.y);
              }

              const deltaX = e.x - lastMouse.x;
              const deltaY = e.y - lastMouse.y;

              lastMouse.set(e.x, e.y);

              let time = performance.now();

              // Avoid dividing by 0
              let delta = Math.max(10.4, time - lastTime);
              lastTime = time;
              velocity.x = deltaX / delta;
              velocity.y = deltaY / delta;
              // Flag update to prevent hanging velocity values when not moving
              velocity.needsUpdate = true;
            }
            requestAnimationFrame(update);
            function update(t) {
              requestAnimationFrame(update);
              // Reset velocity when mouse not moving
              if (!velocity.needsUpdate) {
                mouse.set(-1);
                velocity.set(0);
              }
              velocity.needsUpdate = false;
              // Update flowmap inputs
              flowmap.aspect = aspect;
              flowmap.mouse.copy(mouse);
              // Ease velocity input, slower when fading out
              flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
              flowmap.update();
              program.uniforms.uTime.value = t * 0.01;
              renderer.render({ scene: mesh });
            }
          }
