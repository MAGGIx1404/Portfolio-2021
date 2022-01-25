import "utils/polyfill";
import "utils/scroll";
import "utils/sw";

import AutoBind from "auto-bind";
import Stats from "stats.js";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

import { gsap, Expo } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import each from "lodash/each";

import Detection from "classes/Detection";

import About from "pages/About";
import Case from "pages/Case";
import Home from "pages/Home";

import Canvas from "components/Canvas";
import Navigation from "components/Navigation";
import loader from "sass-loader";

import {
  Polyline,
  Renderer,
  Transform,
  Geometry,
  Program,
  Mesh,
  Vec3,
  Vec2,
  Color,
} from "ogl/dist/ogl.umd";

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    if (IS_DEVELOPMENT && window.location.search.indexOf("fps") > -1) {
      this.createStats();
    }

    this.url = window.location.pathname;

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    AutoBind(this);

    if (!Detection.isMobile()) {
      this.createCanvas();
    }

    this.createNavigation();
    this.createCase();
    this.createHome();
    this.createAbout();

    this.pages = {
      "/": this.home,
      "/about": this.about,
      "/case": this.case,
    };

    if (this.url.indexOf("/case") > -1) {
      this.page = this.case;
      this.page.onResize();
    } else {
      this.page = this.pages[this.url];
    }

    this.page.show(this.url);

    this.addEventListeners();
    this.addLinksEventsListeners();

    this.onResize();
  }

  createCanvas() {
    this.canvas = new Canvas({
      url: this.url,
    });
  }

  createNavigation() {
    this.navigation = new Navigation({
      canvas: this.canvas,
      url: this.url,
    });
  }

  createStats() {
    this.stats = new Stats();

    document.body.appendChild(this.stats.dom);
  }

  createAbout() {
    this.about = new About();
  }

  createHome() {
    this.home = new Home();
  }

  createCase() {
    this.case = new Case();
  }

  /**
   * Change.
   */
  async onChange({ push = !IS_DEVELOPMENT, url = null }) {
    url = url.replace(window.location.origin, "");

    if (this.isFetching || this.url === url) return;

    this.isFetching = true;

    this.url = url;

    if (this.canvas) {
      this.canvas.onChange(this.url);
    }

    await this.page.hide();

    if (push) {
      window.history.pushState({}, document.title, url);
    }

    this.navigation.onChange(this.url);

    if (this.url.indexOf("/case") > -1) {
      this.page = this.case;
    } else {
      this.page = this.pages[this.url];
    }

    await this.page.show(this.url);

    this.isFetching = false;
  }

  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    if (this.page) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.case.scroll ? this.case.scroll.current : 0);
    }

    if (this.stats) {
      this.stats.end();
    }

    window.requestAnimationFrame(this.update);
  }

  /**
   * Events.
   */
  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  onResize() {
    if (this.about) {
      this.about.onResize();
    }

    if (this.home) {
      this.home.onResize();
    }

    if (this.case) {
      this.case.onResize();
    }

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onTouchDown(event) {
    event.stopPropagation();

    if (!Detection.isMobile() && event.target.tagName === "A") return;

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }

    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(this.mouse);
    }
  }

  onTouchMove(event) {
    event.stopPropagation();

    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }

    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(this.mouse);
    }
  }

  onTouchUp(event) {
    event.stopPropagation();

    this.mouse.x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;
    this.mouse.y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }

    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(this.mouse);
    }
  }

  onWheel(event) {
    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(event);
    }
  }

  onInteract() {
    window.removeEventListener("mousemove", this.onInteract);
    window.removeEventListener("touchstart", this.onInteract);

    this.update();
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("mousemove", this.onInteract, { passive: true });
    window.addEventListener("touchstart", this.onInteract, { passive: true });

    window.addEventListener("popstate", this.onPopState, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    window.addEventListener("mousedown", this.onTouchDown, { passive: true });
    window.addEventListener("mousemove", this.onTouchMove, { passive: true });
    window.addEventListener("mouseup", this.onTouchUp, { passive: true });

    window.addEventListener("touchstart", this.onTouchDown, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: true });
    window.addEventListener("touchend", this.onTouchUp, { passive: true });

    window.addEventListener("mousewheel", this.onWheel, { passive: true });
    window.addEventListener("wheel", this.onWheel, { passive: true });

    window.oncontextmenu = this.onContextMenu;
  }

  addLinksEventsListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;

      if (isLocal) {
        link.onclick = (event) => {
          event.preventDefault();

          this.onChange({
            url: link.href,
          });
        };
      } else if (
        link.href.indexOf("mailto") === -1 &&
        link.href.indexOf("tel") === -1
      ) {
        link.rel = "noopener";
        link.target = "_blank";
      }
    });

    console.log(`
🅳🅴🆂🅸🅶🅽 🅰🅽🅳 🅲🆁🅰🅵🆃🅴🅳 🅱🆈:
MMMMMMMM               MMMMMMMM                                                           iiii
M:::::::M             M:::::::M                                                          i::::i
M::::::::M           M::::::::M                                                           iiii
M:::::::::M         M:::::::::M
M::::::::::M       M::::::::::M  aaaaaaaaaaaaa     ggggggggg   ggggg   ggggggggg   gggggiiiiiii
M:::::::::::M     M:::::::::::M  a::::::::::::a   g:::::::::ggg::::g  g:::::::::ggg::::gi:::::i
M:::::::M::::M   M::::M:::::::M  aaaaaaaaa:::::a g:::::::::::::::::g g:::::::::::::::::g i::::i
M::::::M M::::M M::::M M::::::M           a::::ag::::::ggggg::::::ggg::::::ggggg::::::gg i::::i
M::::::M  M::::M::::M  M::::::M    aaaaaaa:::::ag:::::g     g:::::g g:::::g     g:::::g  i::::i
M::::::M   M:::::::M   M::::::M  aa::::::::::::ag:::::g     g:::::g g:::::g     g:::::g  i::::i
M::::::M    M:::::M    M::::::M a::::aaaa::::::ag:::::g     g:::::g g:::::g     g:::::g  i::::i
M::::::M     MMMMM     M::::::Ma::::a    a:::::ag::::::g    g:::::g g::::::g    g:::::g  i::::i
M::::::M               M::::::Ma::::a    a:::::ag:::::::ggggg:::::g g:::::::ggggg:::::g i::::::i
M::::::M               M::::::Ma:::::aaaa::::::a g::::::::::::::::g  g::::::::::::::::g i::::::i
M::::::M               M::::::M a::::::::::aa:::a gg::::::::::::::g   gg::::::::::::::g i::::::i
MMMMMMMM               MMMMMMMM  aaaaaaaaaa  aaaa   gggggggg::::::g     gggggggg::::::g iiiiiiii
                                                            g:::::g             g:::::g
                                                gggggg      g:::::g gggggg      g:::::g
                                                g:::::gg   gg:::::g g:::::gg   gg:::::g
                                                 g::::::ggg:::::::g  g::::::ggg:::::::g
                                                  gg:::::::::::::g    gg:::::::::::::g
                                                    ggg::::::ggg        ggg::::::ggg
                                                       gggggg              gggggg
https://github.com/MAGGIx1404
`);
  }
}

new App();

// ogl cursor

const vertex = `
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;

      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;

      vec4 getPosition() {
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;

          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= 1.0 - pow(abs(uv.y - 0.5) * 1.9, 2.0);

          float pixelWidth = 1.0 / (uResolution.y / uDPR);
          normal *= pixelWidth * uThickness;

          // When the points are on top of each other, shrink the line to avoid artifacts.
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);

          vec4 current = vec4(position, 1);
          current.xy -= normal * side;
          return current;
      }

      void main() {
          gl_Position = getPosition();
      }
  `;

{
  const renderer = new Renderer({
    dpr: 2,
  });
  const gl = renderer.gl;
  document.body.appendChild(gl.canvas);
  const value = random(0, 360, 0.01);
  const background = `hsl(${value}deg 19% 9%)`;
  gl.clearColor(244 / 255, 216 / 255, 204 / 255, 0 / 0);

  const scene = new Transform();

  const lines = [];

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    // We call resize on the polylines to update their resolution uniforms
    lines.forEach((line) => line.polyline.resize());
  }
  window.addEventListener("resize", resize, false);

  // If you're interested in learning about drawing lines with geometry,
  // go through this detailed article by Matt DesLauriers
  // https://mattdesl.svbtle.com/drawing-lines-is-hard
  // It's an excellent breakdown of the approaches and their pitfalls.

  // In this example, we're making screen-space polylines. Basically it
  // involves creating a geometry of vertices along a path - with two vertices
  // at each point. Then in the vertex shader, we push each pair apart to
  // give the line some width.

  // Just a helper function to make the code neater
  function random(a, b) {
    const alpha = Math.random();
    return a * (1.0 - alpha) + b * alpha;
  }

  // We're going to make a number of different coloured lines for fun.
  ["#e09f7d", "#ef5d60", "#ec4067", "#a01a7d", "#311847"].forEach(
    (color, i) => {
      // Store a few values for each lines' randomised spring movement
      const line = {
        spring: random(0.02, 0.1),
        friction: random(0.7, 0.95),
        mouseVelocity: new Vec3(),
        mouseOffset: new Vec3(random(-1, 1) * 0.02),
      };

      // Create an array of Vec3s (eg [[0, 0, 0], ...])
      const count = 20;
      const points = (line.points = []);
      for (let i = 0; i < count; i++) points.push(new Vec3());

      line.polyline = new Polyline(gl, {
        points,
        vertex,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: random(20, 50) },
        },
      });

      line.polyline.mesh.setParent(scene);

      lines.push(line);
    }
  );

  // Call initial resize after creating the polylines
  resize();

  // Add handlers to get mouse position
  const mouse = new Vec3();
  if ("ontouchstart" in window) {
    window.addEventListener("touchstart", updateMouse, false);
    window.addEventListener("touchmove", updateMouse, false);
  } else {
    window.addEventListener("mousemove", updateMouse, false);
  }

  function updateMouse(e) {
    if (e.changedTouches && e.changedTouches.length) {
      e.x = e.changedTouches[0].pageX;
      e.y = e.changedTouches[0].pageY;
    }
    if (e.x === undefined) {
      e.x = e.pageX;
      e.y = e.pageY;
    }

    // Get mouse value in -1 to 1 range, with y flipped
    mouse.set(
      (e.x / gl.renderer.width) * 2 - 1,
      (e.y / gl.renderer.height) * -2 + 1,
      0
    );
  }

  const tmp = new Vec3();

  requestAnimationFrame(update);
  function update(t) {
    requestAnimationFrame(update);

    lines.forEach((line) => {
      // Update polyline input points
      for (let i = line.points.length - 1; i >= 0; i--) {
        if (!i) {
          // For the first point, spring ease it to the mouse position
          tmp
            .copy(mouse)
            .add(line.mouseOffset)
            .sub(line.points[i])
            .multiply(line.spring);
          line.mouseVelocity.add(tmp).multiply(line.friction);
          line.points[i].add(line.mouseVelocity);
        } else {
          // The rest of the points ease to the point in front of them, making a line
          line.points[i].lerp(line.points[i - 1], 0.9);
        }
      }
      line.polyline.updateGeometry();
    });

    renderer.render({ scene });
  }
}

// text animation
const items = document.querySelectorAll(".home__link");

if (window.innerWidth > 1000) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("show", entry.isIntersecting);
    });
  });

  items.forEach((item) => {
    observer.observe(item);
  });
}

if (window.innerWidth < 1000) {
  items.classList.add("show");
}

const imagesLoaded = require("imagesloaded");
const target = document.querySelectorAll(".home__link__wrapper");

window.addEventListener("load", function () {
  imagesLoaded(document.querySelectorAll(".img"), { background: true }, () => {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    const result = Splitting({
      target: target,
    });
  });
});

window.addEventListener("DOMContentLoaded", function () {
  load_animation();
  console.log("page load sucessfully");
});

function load_animation() {
  const loader_text = document.querySelector(".loader-text");
  const loader = document.querySelector(".loader");
  const loader_img = document.querySelector(".loader__img");
  const loader_text_one = document.querySelector(".loader-text .text");
  const loader_text_two = document.querySelector(".loader-text .text-2");

  let tl = gsap.timeline({ defaults: { duration: 1, ease: "back" } });

  tl.to(loader_text_one, { y: "-3vw" });
  tl.to(loader_text_one, { y: "-9vw" });
  tl.to(loader_text_one, { y: "-18vw" });
  tl.to(loader_text_one, { y: "-24vw" });
  tl.to(loader_text_one, { y: "-27vw" });
  tl.to(loader_text_two, { y: "-3vw" }, "-=1");
  tl.to(loader_text_two, { y: "-9vw" });
  tl.to(loader_text_two, { y: "-12vw" });
  tl.to(loader_text_two, { y: "-18vw" });
  tl.to(loader_text_two, { y: "-21vw" });
  tl.to(loader_text_two, { y: "-24vw" });
  tl.to(loader_text_two, { y: "-27vw" });
  tl.to(loader_text, { y: "-50%", opacity: 0 });
  tl.to(loader_img, { y: "-50%", opacity: 0 }, "-=1");
  tl.to(loader, { opacity: "0" });
}
