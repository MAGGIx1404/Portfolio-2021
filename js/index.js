import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import customScroll from "./scroll";
import Menu from "./menu";
import { preloader } from "./preloader";

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const menuEl = select(".menu");

window.addEventListener("load", function () {
  init();
  // preload the images set as data attrs in the menu items
  preloader(".menu__item").then(() => {
    // initialize menu
    new Menu(menuEl);
  });
});

function init() {
  Splitting();
  customScroll();
}

// smooth scroll
