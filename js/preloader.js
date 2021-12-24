import gsap from "gsap";
const imagesLoaded = require("imagesloaded");

const body = document.body;
export const preloader = (selector) => {
  return new Promise((resolve) => {
    const imgwrap = document.createElement("div");
    imgwrap.style.visibility = "hidden";
    body.appendChild(imgwrap);

    [...document.querySelectorAll(selector)].forEach((el) => {
      const imgEl = document.createElement("img");
      imgEl.style.width = 0;
      imgEl.src = el.dataset.img;
      imgEl.className = "preload";
      imgwrap.appendChild(imgEl);
    });

    imagesLoaded(document.querySelectorAll(".preload"), () => {
      imgwrap.parentNode.removeChild(imgwrap);
      body.classList.remove("loading");
      body.classList.add("loaded");
      const tl = gsap.timeline();
      tl.to(".loader", 2, {
        delay: 1,
        background: "#ff7045",
      });
      tl.to(".loader", 2, {
        y: "100%",
        ease: "back",
      });
      resolve();
    });
  });
};
