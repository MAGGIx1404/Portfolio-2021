import { gsap } from "gsap";

function customCursor() {
  const cursor = document.querySelector(".cursor");
  document.body.addEventListener("mousemove", (evt) => {
    const mouseX = evt.clientX;
    const mouseY = evt.clientY;

    gsap.set(cursor, {
      x: mouseX,
      y: mouseY,
    });

    gsap.to(".shape", {
      x: mouseX,
      y: mouseY,
      stagger: -0.1,
    });
  });

  const btnOne = document.querySelectorAll(".btn");
  const tl = gsap.timeline();

  btnOne.forEach((ele) => {
    ele.addEventListener("mousemove", function () {
      gsap.to(cursor, 0.5, {
        scale: 3,
      });
    });
    ele.addEventListener("mouseleave", function () {
      gsap.to(cursor, 0.5, {
        scale: 1,
      });
    });
  });

  const chat = document.querySelector(".chatbtn");
  chat.addEventListener("mousemove", function () {
    gsap.to(chat, {
      zIndex: 100000,
    });
    gsap.to(".shape", 0.6, {
      opacity: 1,
    });
  });
  chat.addEventListener("mouseleave", function () {
    gsap.to(chat, {
      zIndex: 1,
    });
    gsap.to(".shape", 0.6, {
      opacity: 0,
    });
  });
}

export default customCursor;
