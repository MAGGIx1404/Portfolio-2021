import Page from "components/Page";
import Scrolling from "components/Scrolling";
import gsap from "gsap";

import { delay } from "utils/math";

export default class extends Page {
  constructor() {
    super({
      classes: {
        active: "home--active",
        activeTwo: "active"
      },
      element: ".home",
      elements: {
        list: ".home__list",
        items: ".home__item",
        links: "[data-word]"
      },
      isScrollable: false,
    });

    this.create();
  }

  /**
   * Animations.
   */
  show() {
    this.list.enable();

    this.element.classList.add(this.classes.active);
    this.elements.links.forEach(ele => {
      ele.classList.add(this.classes.activeTwo)
    });
    // const tl = gsap.timeline();

    return super.show();
  }

  async hide() {
    this.list.disable();

    this.elements.links.forEach(ele => {
      ele.classList.remove(this.classes.activeTwo);
    });
    this.element.classList.remove(this.classes.active);

    await delay(2000);


    return super.hide();
  }

  /**
   * Create.
   */
  create() {
    super.create();

    this.createList();
  }

  createList() {
    this.list = new Scrolling({
      element: document.body,
      elements: {
        list: this.elements.list,
        items: this.elements.items,
      },
    });
  }

  /**
   * Events.
   */
  onResize() {
    super.onResize();

    this.list.onResize();
  }

  onTouchDown(event) {
    this.list.onTouchDown(event);
  }

  onTouchMove(event) {
    this.list.onTouchMove(event);
  }

  onTouchUp(event) {
    this.list.onTouchUp(event);
  }

  onWheel(event) {
    this.list.onWheel(event);
  }

  /**
   * Loop.
   */
  update() {
    super.update();

    this.list.update();
  }
}
