import * as PIXI from 'pixi.js'
import gsap from "gsap"

import imageOne from "../../shared/grid.jpg"

const images = {
    imageOne
}


export default function particle(){

const app = new PIXI.Application({ width: innerWidth, height: innerHeight, transparent: true });
const cursor = document.querySelector(".cursor");
const pointer = document.querySelector(".pointer");
const container = new PIXI.ParticleContainer(100000);
const content = document.querySelector(".content-canvas");
const loader = new PIXI.Loader();

let mouse = { x: undefined, y: undefined };
let { width: pw, height: ph } = pointer.getBoundingClientRect();

let particles = [];

content.appendChild(app.view);
app.stage.addChild(container);

loader.add("img", "https://i.ibb.co/jJ4s8sx/7915290878-13f6879a54-c.jpg");

// loader.add("img",images.imageOne)

class Particle {
  constructor(x, y, size, texture) {
    this.sprite = new PIXI.Sprite(
      new PIXI.Texture(texture, new PIXI.Rectangle(x, y, size, size))
    );

    this.sprite.x = x;
    this.sprite.y = y;

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.ox = x;
    this.oy = y;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.7;
    this.K = 0.3;
    this.radius = 50;
    this.size = size;

    container.addChild(this.sprite);
  }

  calculatePosition(mouse) {
    const distance = dist(this.sprite, mouse);

    if (distance < this.radius) {
      const [x, y] = sub(this.sprite, mouse);
      const angle = Math.atan2(y, x);

      const radius = this.radius - distance;

      this.vx += Math.cos(angle) * radius;
      this.vy += Math.sin(angle) * radius;
    }

    const fx = this.K * (this.ox - this.sprite.x);
    const fy = this.K * (this.oy - this.sprite.y);

    this.vx += fx;
    this.vy += fy;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.sprite.x += this.vx;
    this.sprite.y += this.vy;
  }
}

const sub = (p1, p2) => {
  return [p1.x - p2.x, p1.y - p2.y];
};

const dist = (p1, p2) => {
  const [x, y] = sub(p1, p2);

  return Math.sqrt(x * x + y * y);
};

const isEmpty = (img, w, h) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h);

  return data.data;
};

loader.load((loader, resources) => {
  const { texture } = resources.img;
  const { width, height } = texture.baseTexture;
  const src = texture.baseTexture.resource.source;

  const size = 2;
  const offset = 2;
  const arrayData = isEmpty(src, width, height);

  container.x = innerWidth / 2 - width / 2;
  container.y = innerHeight / 2 - height / 2;

  for (let i = 0, length = arrayData.length; i < length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);

    if (x % (size * offset) != 0) continue;
    if (y % (size * offset) != 0) continue;
    if (x + size > width) continue;
    if (y + size > height) continue;

    particles.push(new Particle(x, y, size, texture));
  }

  container.interactive = true;
  container.on("mousemove", mousemove);
});

const mousemove = e => {
  let { x: lx, y: ly } = e.data.getLocalPosition(container);
  //lx = lx < -100 ? undefined : lx
  //ly = ly < -100 ? undefined : ly

  const { x: gx, y: gy } = e.data.global;

  gsap.to(mouse, {
    duration: 0.5,
    x: lx,
    y: ly
  });

  gsap.to(cursor, {
    duration: 0.5,
    "--mouse-x": gx + "px",
    "--mouse-y": gy + "px"
  });
};

app.ticker.add(() => {
  particles.forEach(particle => {
    particle.calculatePosition(mouse);
  });
});


}
