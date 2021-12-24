import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function customScroll() {
  const scroll__container = document.getElementById("scroll__container");

  const scroller = new LocomotiveScroll({
    el: scroll__container, //scroll element (scroll container)
    smooth: true, // smooth scroll enabled
    getDirection: true, // display scoll direction (up & down)
    lerp: 0.05, //scroll smoothness
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
    clamp = gsap.utils.clamp(-3, 3); // don't let the skew go beyond 20 degrees.

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
          ease: "back",
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());
  ScrollTrigger.refresh();
}

export default customScroll;
