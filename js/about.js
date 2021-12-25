import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import customScroll from "./scroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import customCursor from "./cursor";

gsap.registerPlugin(ScrollTrigger);

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

window.addEventListener("load", function () {
  init();
});

function init() {
  customCursor();
  loadAnimation();
  Splitting();
  customScroll();
  skills();
  awwwards();
  hoverEffect();
}

function skills() {
  const skillBtn = select("#skill");
  const skillList = selectAll(".skill-para .word");

  skillList.forEach((el) => {
    el = el.querySelectorAll(".char");
    gsap.set(el, {
      y: "100%",
      rotation: 90,
      opacity: 0,
      ease: "back",
    });
    skillBtn.addEventListener("mouseover", function () {
      gsap.to(el, 0.2, {
        opacity: 1,
        y: "0",
        rotation: "0",
        stagger: 0.08,
      });
    });
    skillBtn.addEventListener("mouseleave", function () {
      gsap.to(el, 0.2, {
        y: "100%",
        rotation: "90",
        opacity: 0,
        stagger: {
          each: 0.05,
          from: "end",
        },
      });
    });
  });
}

function awwwards() {
  const awwwardBtn = select("#awwward");
  const awwwardList = selectAll(".awwward-para .word");

  awwwardList.forEach((el) => {
    el = el.querySelectorAll(".char");
    gsap.set(el, {
      y: "100%",
      rotation: 90,
      opacity: 0,
      ease: "back",
    });
    awwwardBtn.addEventListener("mouseover", function () {
      gsap.to(el, 0.2, {
        opacity: 1,
        y: "0",
        rotation: "0",
        stagger: 0.03,
      });
    });
    awwwardBtn.addEventListener("mouseleave", function () {
      gsap.to(el, 0.2, {
        y: "100%",
        rotation: "90",
        opacity: 0,
        stagger: {
          each: 0.05,
          from: "end",
        },
      });
    });
  });
}

function loadAnimation() {
  const wrapper = select(".wrapper");
  const nav = selectAll(".extra");
  const heading = selectAll("h1");
  const tl = gsap.timeline();
  gsap.set(heading, {
    y: "100%",
    ease: "back",
  });
  tl.to(wrapper, 1, {
    opacity: 1,
  });
  tl.to(
    nav,
    1,
    {
      opacity: 1,
    },
    "-=0.2"
  );
  tl.to(
    heading,
    1,
    {
      y: "0",
      ease: "back",
    },
    "-=0.2"
  );
}

// hover

function hoverEffect() {
  const itemThree = select(".web");
  const itemTwo = selectAll(".hover-two");
  const itemOne = document.querySelector(".item-hover");
  const shape = select(".shape");
  itemOne.addEventListener("mousemove", function () {
    shape.classList.add("active");
  });
  itemOne.addEventListener("mouseleave", function () {
    shape.classList.remove("active");
  });
  itemTwo.forEach((ele) => {
    ele.addEventListener("mousemove", function () {
      shape.classList.add("open");
    });
    ele.addEventListener("mouseleave", function () {
      shape.classList.remove("open");
    });
  });
  itemThree.addEventListener("mouseover", function () {
    shape.classList.add("web");
  });
  itemThree.addEventListener("mouseleave", function () {
    shape.classList.remove("web");
  });
}
