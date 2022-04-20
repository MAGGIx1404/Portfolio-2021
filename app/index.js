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

import Preloader from "components/Preloader";

import Detection from "classes/Detection";

import About from "pages/About";
import Case from "pages/Case";
import Home from "pages/Home";

import Canvas from "components/Canvas";
import Navigation from "components/Navigation";
import loader from "sass-loader";

import hambGl from "components/hamb";

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

    this.text();
    this.createPreloader();
    this.createNavigation();
    this.createCase();
    this.createHome();
    this.createAbout();
    this.createHamb();
    this.hambAnimation()

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


    // this.page.show(this.url);

    this.addEventListeners();
    this.addLinksEventsListeners();

    this.onResize();

  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", () => this.onPreloaded());
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

  createHamb(){
    this.hamb = new hambGl()
  }


  onPreloaded() {

    this.preloader.destroy();
    this.onResize();
    this.page.show(this.url);
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

  text(){
      const target = document.querySelectorAll(".splitter");
      const result = Splitting({
        target: target,
      });
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
  }

  hambAnimation(){
    const hamb__btn = document.querySelector(".hamb__btn")
    const hamb__menu = document.querySelector(".hamb__menu")
    const hamb__links = [...document.querySelectorAll("a")]
    const hamb__btns = document.querySelectorAll(".hamb__inner__btn .word")
    const tl = gsap.timeline({paused: true})

    tl.to(hamb__menu,1,{
      opacity:1,
      autoAlpha: 1,
      ease: "Power4.easeInOut"
    })
    tl.to(hamb__btns,1,{
      y:"0%",
      stagger:0.2,
      ease:"Power4.easeInOut"
    },"-=0.5")

    hamb__btn.addEventListener("click", function(){
      if(hamb__btn.classList.contains("active")){
        hamb__menu.classList.remove("active")
        hamb__btn.classList.remove("active")
        tl.reverse()
      }else{
        tl.play()
        hamb__menu.classList.add("active")
        hamb__btn.classList.add("active")
      }
    })

    hamb__links.forEach((el) => {
      el.addEventListener("click", function(){
        if(hamb__btn.classList.contains("active")){
          hamb__menu.classList.remove("active")
          hamb__btn.classList.remove("active")
          tl.reverse()
        }
      })
    })

  }

}

new App();




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
