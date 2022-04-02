import FontFaceObserver from 'fontfaceobserver'

import each from 'lodash/each'

import Detection from 'classes/Detection'

import Page from 'components/Page'

import { BREAKPOINT_PHONE } from 'utils/breakpoints'
import { getOffset } from 'utils/dom'
import { clamp, delay } from 'utils/math'

import THREEScene from "../../components/flower"
import hoverEffect from "../../components/hover"
// import particle from '../../components/particle'


export default class extends Page {
  constructor () {
    super({
      classes: {
        active: 'about--active',
        galleryActive: 'about__gallery--active'
      },
      element: '.about',
      elements: {
        wrapper: '.about__content',
        title: '.about__header__title',
        titles: '.about__header__title__text span',
        gallery: '.about__gallery',
        sections: '.about__section',
        sectionsTitles: '.about__section__title'
      },
      isScrollable: true
    })

    this.create()
  }

  /**
   * Create.
   */
  create () {
    super.create()
    const scene = new THREEScene();
    // particle()
    // hoverEffect()

    const font = new FontFaceObserver('Neue Montreal', 10000)

    font.load().then(_ => {
      this.onResize()
    }).catch(_ => {
      this.onResize()
    })


  }

  /**
   * Animations.
   */
  show () {
    this.element.classList.add(this.classes.active)

    return super.show()
  }

  async hide () {
    this.element.classList.remove(this.classes.active)

    await delay(400)



    this.scroll.position = 0
    this.scroll.current = 0
    this.scroll.target = 0

    this.transform(this.elements.wrapper, this.scroll.current)

    return super.hide()
  }

  /**
   * Create.
   */
  onResize () {
    super.onResize()
  }

  /**
   * Loop.
   */
  update () {
    super.update()

    if (window.innerWidth > BREAKPOINT_PHONE) {
      each(this.elements.sectionsTitles, title => {
        const y = clamp(0, title.limit, Math.floor(this.scroll.current - title.start))

        title.style.transform = `translateY(${y}px)`
      })
    }
  }
}
