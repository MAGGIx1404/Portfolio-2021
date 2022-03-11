import Component from "classes/Component";
import each from "lodash/each";
import gsap from "gsap";
import { split } from "utils/text";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
        numberText: ".preloader__number__text"
      }
    });

    this.length = 0;
    split({
      element: this.elements.title,
      expression: "<br/>"
    });
    split({
      element: this.elements.title,
      expression: "<br/>"
    });
    this.elements.titleSpans =
      this.elements.title.querySelectorAll("span span");
    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.src = element.getAttribute("data-src");
      element.onload = () => {
        element.classList.add("loaded");
        this.onAssetLoaded();
      };
    });
  }

  onAssetLoaded() {
    this.length += 1;
    const percent = this.length / this.elements.images.length;

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = gsap.timeline({
        delay: 1
      });
      this.animateOut.to(this.elements.titleSpans, {
        y: "-100%",
        stagger: "0.1",
        duration: 1.5,
        ease: "expo.out"
      });
      this.animateOut.to(
        this.elements.numberText,
        {
          y: "100%",
          stagger: "0.1",
          duration: 1.5,
          ease: "expo.out"
        },
        "-=1.4"
      );

      this.animateOut.to(
        this.element,
        1.4,
        {
          delay: 1,
          opacity: 0,
          alpha: 0
        },
        "-=1"
      );

      this.animateOut.call(() => {
        this.emit("completed");
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}