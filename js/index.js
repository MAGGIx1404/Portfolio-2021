import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import customScroll from "./scroll";
import Menu from "./menu";
import { preloader } from "./preloader";
import gsap from "gsap";

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
  customScroll();
  menu();
}

function menu() {
  new Menu(menuEl);
}

// smooth scroll
