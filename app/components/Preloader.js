import Component from "classes/Component";
import each from "lodash/each";
import gsap from "gsap";
import { split } from "utils/text";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
        numberText: ".preloader__number__text",
      }
    });

    this.length = 0;

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
      this.animateOut.to(
        this.elements.numberText,
        {
          y: "100%",
          duration: 1,
          ease: "expo.out"
        }
      );

      this.animateOut.to(
        this.element,
        1,
        {
          delay: 1,
          opacity: 0,
          alpha: 0,
          ease:"expo.out"
        }
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
