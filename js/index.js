import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import customScroll from "./scroll";
import Menu from "./menu";
import { preloader } from "./preloader";
import gsap from "gsap";
import customCursor from "./cursor";

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const menuEl = select(".menu");

window.addEventListener("load", function () {
  // preload the images set as data attrs in the menu items
  preloader(".scroll__container").then(() => {
    init();
    // loader animation
  });
});

function init() {
  Splitting();
  customCursor();
  customScroll();
  menu();
  contact();
}

function menu() {
  new Menu(menuEl);
}

// smooth scroll

function contact() {
  const tl = gsap.timeline();
  const contact = select(".contact");
  const openBtn = select(".contact-btn");
  const closeBtn = select(".close-btn");
  const wrapper = select(".wrapper");

  openBtn.addEventListener("click", function () {
    tl.to(wrapper, 1, {
      opacity: 0,
    });
    tl.to(contact, 1.6, {
      y: "0",
      opacity: 1,
      ease: "power3",
    });
  });
  closeBtn.addEventListener("click", function () {
    tl.to(contact, 1.6, {
      y: "100%",
      opacity: 0,
      ease: "power3",
    });
    tl.to(
      wrapper,
      1,
      {
        opacity: 1,
      },
      "-=0.4"
    );
  });
}
