// import libraries
import { preloader } from "./preloader";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import CircleType from "circletype";
import Glide, { Controls } from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import VanillaTilt from "vanilla-tilt";

// register gsap plugins
gsap.registerPlugin(ScrollTrigger);

// preload the images set as data attrs in the menu items
preloader(".scroll__container").then(() => {
  init();
});

// init all function
function init() {
  loader(); // init
  smoothScroll(); // init smoothscroll
  customCursor(); // init custom cursor
  roundText(); // init round-text
  splitContent(); // init spliting text
  slider(); // init slider
  tiltBox(); // init fake 3d effect
}
// smooth scroll
function smoothScroll() {
  // scroll init
  const scroll__container = document.getElementById("scroll__container");

  const scroller = new LocomotiveScroll({
    el: scroll__container, //scroll element (scroll container)
    smooth: true, // smooth scroll enabled
    getDirection: true, // display scoll direction (up & down)
    lerp: 0.15, //scroll smoothness
    smartphone: {
      lerp: 0.5,
      smooth: true, //smooth scroll enabled for mobile
    },
    tablet: {
      lerp: 0.5,
      smooth: true, //smooth scroll enabled for tablet & ipad
    },
    offset: [0, 0],
    useKeyboard: true,
    getSpeed: true,
    class: "is-inview",
    scrollbarClass: "c-scrollbar",
    scrollingClass: "has-scroll-scrolling",
    draggingClass: "has-scroll-dragging",
    smoothClass: "has-scroll-smooth",
    initClass: "has-scroll-init",
    multiplier: 1,
    firefoxMultiplier: 50,
    touchMultiplier: 2,
    scrollFromAnywhere: false,
  });

  // skew effect on scroll
  scroller.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#scroll__container", {
    scrollTop(value) {
      return arguments.length
        ? scroller.scrollTo(value, 0, 0)
        : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  /* ADD LOCOSCROLL */

  /* ADD SKEW SECTION */

  let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(".skew-el", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-20, 20); // don't let the skew go beyond 20 degrees.

  ScrollTrigger.create({
    scroller: "#scroll__container",
    trigger: ".scroll__container",

    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -300);
      // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.4,
          ease: "power3",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());
  ScrollTrigger.refresh();
}

//roundtext
function roundText() {
  const circleType = new CircleType(document.getElementById("round"));
  circleType.radius(45);
}

// slider
function slider() {
  var slider = new Glide(".slider", {
    type: "slider",
    perView: 1,
    focusAt: "center",
    rewind: false,
    dragThreshold: "100",
    swipeThreshold: "50",
    animationDuration: "700",
    animationTimingFunc: "linear",
    disabledArrow: false,
    classes: {
      direction: {
        ltr: "glide--ltr",
        rtl: "glide--rtl",
      },
      slider: "glide--slider",
      carousel: "glide--carousel",
      swipeable: "glide--swipeable",
      dragging: "glide--dragging",
      cloneSlide: "glide__slide--clone",
      activeNav: "glide__bullet--active",
      activeSlide: "glide__slide--active",
      disabledArrow: "glide__arrow--disabled",
    },
  });
  slider.mount();
}

// spliting texts
function splitContent() {
  Splitting();
}

// custom cursor
function customCursor() {
  const cursor = document.querySelector("#cursor");
  const buttons = document.querySelectorAll(".glide__arrow");
  const footerBtns = document.querySelectorAll(".footer-btn");

  document.body.addEventListener("mousemove", (evt) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    gsap.set(cursor, {
      x: mouseX,
      y: mouseY,
      stagger: -0.1,
      transformOrigin: "50% 50%",
    });

    // gsap.set(".shape", {
    //   x: mouseX,
    //   y: mouseY,
    //   stagger: -0.1,
    // });
  });

  const slideImages = document.querySelectorAll(".slide-img");
  slideImages.forEach((ele) => {
    ele.addEventListener("mousemove", function () {
      cursor.classList.add("active");
      gsap.to(cursor, 0.2, {
        scale: 6,
      });
      ele.classList.add("active");
    });
    ele.addEventListener("mouseleave", function () {
      cursor.classList.remove("active");
      ele.classList.remove("active");
      gsap.to(cursor, 0.2, {
        scale: 1,
      });
    });
  });

  buttons.forEach((ele) => {
    ele.addEventListener("mousemove", function () {
      gsap.to(cursor, 0.3, {
        background: "rgba(255, 225, 0,0.7)",
        scale: 4,
      });
    });
    ele.addEventListener("mouseleave", function () {
      gsap.to(cursor, 0.3, {
        background: "transparent",
        scale: 1,
      });
    });
  });

  footerBtns.forEach((ele) => {
    ele.addEventListener("mouseover", function () {
      gsap.to(cursor, 0.2, {
        scale: 2.5,
      });
    });
    ele.addEventListener("mouseleave", function () {
      gsap.to(cursor, 0.2, {
        scale: 1,
      });
    });
  });
}

// fake 3d effect
function tiltBox() {
  VanillaTilt.init(document.querySelectorAll(".slide-img"), {
    reverse: true, // reverse the tilt direction
    max: 2, // max tilt rotation (degrees)
    startX: 0, // the starting tilt on the X axis, in degrees.
    startY: 0, // the starting tilt on the Y axis, in degrees.
    perspective: 1000,
    glare: true,
    maxGlare: 0.5,
    "max-glare": 1,
    "glare-prerender": false,
    easing: "cubic-bezier(.03,.98,.52,.99)",
    speed: 1000,
    gyroscope: true, // Boolean to enable/disable device orientation detection,
    gyroscopeMinAngleX: -45, // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
    gyroscopeMaxAngleX: 45, // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
    gyroscopeMinAngleY: -45, // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
    gyroscopeMaxAngleY: 45, // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
    gyroscopeSamples: 10,
  });
}

// loader
function loader() {
  const loaderBox = document.querySelector(".loader");
  if (document.body.classList.contains("loading")) {
    console.log("loading");
  } else {
    loaderBox.style.display = "none";
    console.log("loaded successfully");
  }
}
