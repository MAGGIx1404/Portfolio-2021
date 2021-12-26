import gsap from "gsap";

// transition

const anchors = document.querySelectorAll(".transition-btn");
const wrapper = document.querySelector("#wrapper");
const nav = document.querySelectorAll(".extra");

function loading() {
  const tl = gsap.timeline();

  tl.to(wrapper, 0.4, {
    opacity: 0,
  });
  tl.to(
    nav,
    1,
    {
      opacity: 0,
    },
    "<"
  );
}

for (let i = 0; i < anchors.length; i++) {
  const anchor = anchors[i];

  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target;

    if (target.nodeName === "SPAN") {
      target = target.parentElement.href;
    }

    loading();

    setTimeout(() => {
      window.location.href = target;
    }, 700);
  });
}

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
