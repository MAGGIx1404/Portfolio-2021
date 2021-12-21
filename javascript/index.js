// import libraries
import { gsap, Expo, Back } from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { Curtains, Plane, Vec2 } from "curtainsjs/src/index.mjs";

//init all events and function on page load
window.addEventListener("load", function () {
  init(); // init all events
});

// init all events
function init() {
  customCursor(); // init custom cursor
  smoothScroll(); // init smooth scroll
}

// smooth scroll
function smoothScroll() {
  // scroller
  const scroll__container = document.getElementById("scroll__container");
  //smooth scroll crate
  const scroller = new LocomotiveScroll({
    el: scroll__container, //scroll element (scroll container)
    smooth: true, // smooth scroll enabled
    getDirection: true, // display scoll direction (up & down)
    lerp: 0.1, //scroll smoothness
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
  // flexible nav bar
  scroller.on("scroll", (instance) => {
    document
      .getElementById("nav")
      .setAttribute("data-direction", instance.direction);
  });
}

// custom cursor
function customCursor() {
  const cursor = document.getElementById("cursor");
  const shape = document.querySelector(".shape");
  const btns = document.querySelectorAll(".btn");
  document.addEventListener("mousemove", (evt) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    gsap.set(cursor, {
      x: mouseX,
      y: mouseY,
      stagger: -0.1,
    });

    gsap.to(shape, {
      x: mouseX,
      y: mouseY,
      stagger: -0.2,
      transformOrigin: "50% 50%",
    });
  });
  document.addEventListener("mouseout", function () {
    cursor.style.display = "none";
  });
  document.addEventListener("mouseover", function () {
    cursor.style.display = "flex";
  });
  btns.forEach((ele) => {
    ele.addEventListener("mouseover", function () {
      gsap.to(cursor, 0.3, {
        width: "5rem",
        height: "5rem",
        background: "#fff",
        margin: "-2.5rem 0 0 -2.5rem",
        ease: "back.out(2)",
      });
      cursor.innerHTML = "<p>ENTER</p>";
    });
    ele.addEventListener("mouseleave", function () {
      gsap.to(cursor, 0.3, {
        width: "2rem",
        height: "2rem",
        background: "#00a200",
        margin: "-1rem 0 0 -1rem",
        ease: "back.in(2)",
      });
      cursor.innerHTML = "";
    });
  });
}
