class Vector {
  constructor(x, y) {
    if (x instanceof Vector) {
      this.x = x.x;
      this.y = x.y;
    } else if (typeof x === "object") {
      if (x.x !== undefined && x.y !== undefined) {
        this.x = x.x;
        this.y = x.y;
      } else {
        console.error("wrong object to make a vector");
      }
    } else if (typeof x === "number" || x === undefined) {
      this.x = x || 0;
      this.y = y || 0;
    } else {
      throw "Unable to make a vector with this input: " + x;
    }
  }

  static fromAngle(r, rads) {
    if (!rads) {
      r /= 180;
      r *= Math.PI;
      r -= Math.PI / 2;
      //console.log(r)
    }
    return new Vector(Math.cos(r), Math.sin(r));
  }

  add(v) {
    if (v instanceof Vector) {
      this.x += v.x;
      this.y += v.y;
    } else if (typeof v === "number") {
      this.x += v;
      this.y += v;
    } else if (typeof v === "object" && typeof v.x === "number" && typeof v.y === "number") {
      this.x += v.x;
      this.y += v.y;
    }
    return this;
  }

  sub(vector) {
    return this.subtract(vector);
  }

  subtract(v) {
    if (v instanceof Vector) {
      this.x -= v.x;
      this.y -= v.y;
    } else if (typeof v === "number") {
      this.x -= v;
      this.y -= v;
    } else if (typeof v === "object" && typeof v.x === "number" && typeof v.y === "number") {
      this.x -= v.x;
      this.y -= v.y;
    }
    return this;
  }

  getAngle(rads) {
    if (!rads) {
      return (Math.atan2(this.y, this.x) * 180) / Math.PI + 90;
    } else {
      return Math.atan2(this.y, this.x) + Math.PI / 2;
    }
  }

  clear() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  div(scalar) {
    return this.divide(scalar);
  }

  divide(scalar) {
    return this.multiply(1 / scalar);
  }

  mult(scalar) {
    return this.multiply(scalar);
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  copy() {
    return new Vector(this);
  }

  get mag() {
    return this.magnitude;
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  rotate(r, rads) {
    if (!rads) {
      r = this.d2r(r);
      //r -= Math.PI/2;
    }
    let dx = this.x * Math.cos(r) - this.y * Math.sin(r);
    let dy = this.x * Math.sin(r) + this.y * Math.cos(r);
    this.x = dx;
    this.y = dy;
    return this;
  }

  limit(n) {
    let m = this.mag;
    if (m > n) {
      this.mult(n / m);
      return this;
    } else {
      return this;
    }
  }

  perp() {
    return this.perpendicular();
  }

  perpendicular() {
    let dx = this.y;
    let dy = this.x * -1;
    this.y = dy;
    this.x = dx;
    return this;
  }

  rotateAround(p, angle, rads) {
    if (!rads) {
      angle *= Math.PI / 180;
    }
    let c = Math.cos(-angle);
    let s = Math.sin(-angle);
    let nx = c * (this.x - p.x) + s * (this.y - p.y) + p.x;
    let ny = c * (this.y - p.y) - s * (this.x - p.x) + p.y;
    this.x = nx;
    this.y = ny;
    return this;
  }

  distance(v) {
    let x = this.x - v.x;
    let y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
  }

  dist(v) {
    return this.distance(v);
  }

  set(n) {
    let m = this.mag;
    if (m === 0) {
      this.mult(n);
      return this;
    }
    this.mult(n / m);
    return this;
  }

  floor() {
    this.x = this.x | 0;
    this.y = this.y | 0;
  }
  normalize() {
    return this.set(1);
  }
  round() {
    this.x = this.x | 0;
    this.y = this.y | 0;
    return this;
  }
  get zeroY() {
    let copy = this.copy();
    copy.y = 0;
    return copy;
  }
  get zeroX() {
    let copy = this.copy();
    copy.x = 0;
    return copy;
  }
}

let width = window.innerWidth;
let height = window.innerHeight;
let alphabet = "abcdefghijklmnopqrstuvwxyz";

function r(num) {
  return num | 0;
}

function id(string) {
  return document.getElementById(string);
}

function getRandom(item) {
  //returns random stuff
  //1 arg means return random int between 0 and arg-1
  //2 args means return float in range ar1,arg2
  //array means return random value in array
  //-1 means return a 1 or -1
  if (arguments.length === 0) {
    return Math.random();
  }
  if (arguments.length === 1) {
    if (item instanceof Array) {
      return item[(Math.random() * item.length) | 0];
    }
    if (typeof item === "number") {
      if (item === -1) {
        return Math.random() < 0.5 ? -1 : 1;
      }
      return (Math.random() * item) | 0;
    }
  } else if (arguments.length === 2) {
    return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
  }
}

function shuffle(input) {
  let array = Array.from(input);
  let ind = array.length;
  while (ind !== 0) {
    let rand = (Math.random() * ind) | 0;
    ind--;
    let temp = array[ind];
    array[ind] = array[rand];
    array[rand] = temp;
  }
  return array;
}

function checkObj(obj) {
  if (obj == undefined) {
    return false;
  }
  return Object.keys(obj).length > 0;
}

function fadeScreen(color, zIndex) {
  zIndex = zIndex || 100;
  return new Promise((resolve) => {
    let white = new Rectangle(0, 0, width, height);
    white.color = "transparent";
    white.addClass("slowsmoothed");
    white.zIndex = zIndex;
    setTimeout(() => {
      white.color = color || "black";
      setTimeout(() => {
        resolve(function () {
          white.remove();
        });
      }, 3100);
    }, 100);
  });
}

class Helper {
  static Deg2Rad(deg) {
    return (deg * 180) / Math.PI;
  }
  static Rad2Deg(rad) {
    return (rad * Math.PI) / 180;
  }
}

let DOMObjectGlobals = {
  body: document.body,
};

class DomObject {
  constructor(x, y) {
    this.p = new Vector(x, y);
    this.shape = {};
    this.isRectangle = false;
    this.isLine = false;
    this.removed = false;
    this.radius = 1;
    this.type = "DomObject";
    this.DEFAULT_COLOR = "black";
    this.attachments = {};
    this.isfromCenter = false;
    this.USING_NEW_TRANSFORM = false;
    this.isFlipped = false;
    this.theta = 0;
  }

  init() {
    console.error("DomObject " + this.type + " doesnt have an init function");
  }
  get vector() {
    return new Vector(this.x, this.y);
  }

  get x() {
    let val = 0;
    if (!this.USING_NEW_TRANSFORM) {
      val = this.shape.style.left || this.p.x;
    } else {
      val = this.shape.style.transform.match(/translateX\(-?\d+.*d*px\)/);
      if (val) {
        val = val[0].match(/-?\d+.*\d*/)[0];
      }
      if (this.isFlipped && this.USING_NEW_TRANSFORM && val !== null) {
        val = parseInt(val) * 3 + this.width;
      }
    }
    return val !== null ? parseInt(val) + (this.isfromCenter ? this.width / 2 : 0) : this.p.x; //* (this.isFlipped && this.USING_NEW_TRANSFORM? 2 :1)
  }
  get realX() {
    return this.shape.offsetLeft;
  }
  get realY() {
    return this.shape.offsetTop;
  }

  set x(val) {
    this.p.x = val;
    val = val - (this.isRectangle && !this.isfromCenter ? 0 : this.width / 2);
    if (!this.USING_NEW_TRANSFORM) {
      this.set("left", val + "px");
    } else {
      let value = this.shape.style.transform;
      if (this.isFlipped) val = (val + this.width) / 3;
      value.match(/translateX\(-?\d+\.?\d*px\)/g) !== null ? (this.shape.style.transform = value.replace(/translateX\(-?\d+\.?\d*px\)/g, "translateX(" + val + "px)")) : (this.shape.style.transform += " translateX(" + val + "px)");
      this.shape.style.transformOrigin = val + (this.isfromCenter && !this.isFlipped ? this.width / 2 : 0) + "px " + this.y + "px";
    }
  }

  get y() {
    let val = 0;
    if (!this.USING_NEW_TRANSFORM) {
      val = this.shape.style.top || this.p.y;
    } else {
      val = this.shape.style.transform.match(/translateY\(-?\d+.*d*px\)/g);
      if (val) {
        val = val[0].match(/-?\d+.*\d*/)[0];
      }
    }
    return val !== null ? parseInt(val) + (this.isfromCenter ? this.height / 2 : 0) : this.p.y;
  }

  set y(val) {
    this.p.y = val;
    val = val - (this.isRectangle && !this.isfromCenter ? 0 : this.height / 2);
    if (!this.USING_NEW_TRANSFORM) {
      this.set("top", val + "px");
    } else {
      let value = this.shape.style.transform;
      value.match(/translateY\(-?\d+\.?\d*px\)/g) !== null ? (this.shape.style.transform = value.replace(/translateY\(-?\d+\.?\d*px\)/g, "translateY(" + val + "px)")) : (this.shape.style.transform += " translateY(" + val + "px)");
      this.shape.style.transformOrigin = this.x + "px " + val + "px";
    }
  }

  rotateTo(num) {
    let tran = this.shape.style.transform;
    this.shape.style.transform.match(/rotate\(-?\d+\.?\d*deg\)/g) !== null ? (this.shape.style.transform = tran.replace(/rotate\(-?\d+\.?\d*deg\)/g, "rotate(" + num + "deg)")) : (this.shape.style.transform += " rotate(" + num + "deg)");
  }

  set color(string) {
    this.shape.style.backgroundColor = string.toString();
  }
  get color() {
    return this.shape.style.backgroundColor;
  }
  set border(string) {
    this.shape.style.border = string.toString();
  }
  get border() {
    return this.shape.style.border;
  }
  get width() {
    return this.shape.offsetWidth;
  }
  get height() {
    return this.shape.offsetHeight;
  }
  set width(val) {
    this.set("width", val);
  }
  set height(val) {
    this.set("height", val);
  }
  get angle() {
    return this.theta;
  }
  set angle(val) {
    if (parseInt(val) === this.theta) return;
    this.rotateTo(val);
    this.theta = parseInt(val);
  }

  get zIndex() {
    return parseInt(this.shape.style.zIndex);
  }
  set zIndex(val) {
    if (typeof val === "number") val = val.toString();
    this.shape.style.zIndex = val;
  }

  get(attr) {
    return this.shape.style[attr];
  }

  getVal(attr) {
    return parseInt(this.shape.style[attr]);
  }

  set(attr, val) {
    if (this.removed) return;
    if (typeof val === "number") {
      val += "px";
    }
    this.shape.style[attr] = val;
  }

  mod(attr, val) {
    if (this.removed) return;
    let attribute = this.shape.style[attr];
    let value = parseInt(attribute);
    if (isNaN(value)) {
      let e = new ErrorHandler("attr is not a value");
      return;
    }
    //probably is a beter way for this
    let suffix = attribute.split(value)[1];
    value += val;
    this.shape.style[attr] = value + suffix;
  }

  moveTo(p) {
    if (arguments.length === 2) {
      this.y = arguments[1];
      this.x = arguments[0];
    } else {
      this.y = p.y;
      this.x = p.x;
    }
  }

  attach(div) {
    if (div instanceof DomObject) {
      this.shape.appendChild(div.shape);
      if (!Object.keys(this.attachments).includes(div.type + "s")) {
        this.attachments[div.type + "s"] = [];
      }
      this.attachments[div.type + "s"].push(div);
    } else {
      this.shape.appendChild(div);
    }
  }

  asOutline(color, thickness) {
    color = color || this.color;
    thickness = thickness || 1;
    this.border = color + " solid " + thickness + "px";
    this.color = "transparent";
    switch (this.type) {
      case "line":
        //this.b.sub(new Vector(-thickness,-thickness));
        this.width -= thickness * 2;
        break;
      case "rectangle":
      case "circle":
        this.width -= thickness * 2;
        this.height -= thickness * 2;
        break;
    }
    return this;
  }
  setColor(color) {
    this.color = color;
    return this;
  }

  usingNewTransform() {
    // let [x,y] = [this.x,this.y];
    // this.x = (this.isfromCenter ? this.width / 2 : 0);
    // this.y = (this.isfromCenter ? this.height / 2 : 0);
    // this.USING_NEW_TRANSFORM = true;
    // this.x = x;
    // this.y = y;
    //TODO FIX THIS ASAP
    return this;
  }

  withNoCss() {
    let empty = {
      width: "",
      height: "",
      fontSize: "",
      border: "",
      borderRadius: "",
      position: "",
      top: "",
      left: "",
      transform: "",
      transformOrigin: "",
      color: "",
      backgroundColor: "",
      margin: "",
      padding: "",
    };
    Object.assign(this.shape.style, empty);
    return this;
  }

  withId(string) {
    this.shape.id = string;
    return this;
  }

  addClass(string) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.shape.classList.add(arguments[i]);
      }
      return this;
    }
    this.shape.classList.add(string);
    return this;
  }
  removeClass(string) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) {
        this.shape.classList.remove(arguments[i]);
      }
      return this;
    }
    this.shape.classList.remove(string);
    return this;
  }

  remove() {
    if (this.removed) return;
    this.removed = true;
    try {
      //TODO
      this.shape.parentNode.removeChild(this.shape);
    } catch (e) {
      console.error(e);
    }
    //this removes all the children, but they still need to be marked if their objects still exist
    Object.keys(this.attachments).forEach((key) => {
      this.attachments[key].forEach((x) => {
        x.remove();
      });
    });
  }

  detach(obj) {
    this.attachments[obj.type + "s"].splice(this.attachments[obj.type + "s"].indexOf(obj), 1);
  }

  detachSelf() {
    return this.shape.parentNode.removeChild(this.shape);
  }

  fromCenter() {
    this.x = this.x - this.width / 2;
    this.y = this.y - this.height / 2;
    this.isfromCenter = true;
    return this;
  }

  static attach(node) {
    DOMObjectGlobals.body.appendChild(node);
    return node;
  }

  flip(dir) {
    let current_dir = "";
    let flipped = this.get("transform");
    let x = this.p.x;
    if (this.isFlipped || flipped.includes("scaleX(-1)")) {
      current_dir = "left";
      this.isFlipped = true;
    } else {
      current_dir = "right";
      this.isFlipped = false;
    }
    if (dir === current_dir) return;
    if (current_dir === "right") {
      this.isFlipped = true;
      this.shape.style.transform += " scaleX(-1)";
    } else {
      this.isFlipped = false;
      this.shape.style.transform = this.shape.style.transform.replace("scaleX(-1)", "");
    }
    this.x = x;
  }

  setFlexCentered() {
    this.set("display", "flex");
    this.set("justifyContent", "center");
    this.set("alignItems", "center");
    return this;
  }
}

class Div extends DomObject {
  constructor(x, y, r, h, theta) {
    super(x, y);
    this.type = "div";
    if (r < 0 || h < 0) {
      console.error("radius/width/height is negative, might cause issues with this", this);
    }
    this.isLine = h === 1;
    this.isRectangle = (!!r && !!h) || this.isLine; //if r and h are given, then it must be a square
    this.radius = r || 1; //if isRect then this is w
    this.w = this.isRectangle ? r : r * 2;
    this.h = h || 0;
    this.shape = document.createElement("div");
    this.angle = theta || 0;
    this.init();
  }

  init() {
    Object.assign(this.shape.style, {
      height: (this.isRectangle ? this.h : this.radius * 2) + "px",
      width: (this.isRectangle ? this.w : this.radius * 2) + "px",
      transformOrigin: this.isLine ? "0% 50%" : "center center",
      borderRadius: this.isRectangle ? "" : "50%",
      position: "absolute",
    });
    this.y = this.p.y - (this.isRectangle ? 0 : this.radius);
    this.x = this.p.x - (this.isRectangle ? 0 : this.radius);
    this.color = this.DEFAULT_COLOR;
    DOMObjectGlobals.body.appendChild(this.shape);
  }
}

class LineFromPoints extends Div {
  constructor(x1, y1, x2, y2, thickness) {
    let length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    let theta = new Vector(x2, y2).sub(new Vector(x1, y1)).perp().getAngle();
    super(x1, y1, length, 1, theta);
    this.type = "line";
    this.a = new Vector(x1, y1);
    this.b = new Vector(x2, y2);
    this.length = length;
    this.angle = theta;
    this.thickness = thickness || 1;
  }
  set thickness(val) {
    this.set("height", val);
  }
  get thickness() {
    return parseInt(this.shape.style.height);
  }
}

class LineFromAngle extends Div {
  constructor(x, y, length, theta, thickness) {
    super(x, y, length, 1, theta);
    this.type = "line";
    this.a = new Vector(x, y);
    this.b = new Vector(this.length * Math.sin(Helper.Deg2Rad(this.theta)), this.length * Math.cos(Helper.Deg2Rad(this.theta)));
    this.length = length;
    this.thickness = thickness || 1;
  }
  set thickness(val) {
    this.set("height", val);
  }
  get thickness() {
    return parseInt(this.shape.style.height);
  }
}

class Line {
  //aliases for the above classes
  static fromPoints(x1, y1, x2, y2, thickness) {
    return new LineFromPoints(x1, y1, x2, y2, thickness);
  }
  static fromAngle(x, y, length, theta, thickness) {
    return new LineFromAngle(x, y, length, theta, thickness);
  }
  static random(length) {
    return new LineFromAngle(0, 0, length || 1, (Math.random() * 360) | 0);
  }
}

class Rectangle extends Div {
  constructor(x, y, width, height, theta) {
    super(x, y, width, height, theta);
    this.type = "rectangle";
  }
}
class Square extends Div {
  constructor(x, y, width, theta) {
    super(x, y, width, width, theta);
    this.type = "rectangle";
  }
}

class P extends DomObject {
  constructor(string, x, y, fontSize, theta) {
    super(x, y);
    this.stringVal = string;
    this.type = "text";
    this.shape = document.createElement("p");
    this.text = {};
    this.theta = theta || 0;
    this.isRectangle = true;
    this.fontSize = fontSize;
    this.init();
  }

  get string() {
    return this.text.data;
  }

  set string(string) {
    this.text.data = string;
  }

  set color(string) {
    this.set("color", string.toString());
  }
  get color() {
    return this.shape.style.color;
  }
  get size() {
    return this.shape.style.fontSize;
  }
  set size(string) {
    this.set("fontSize", string);
  }

  init() {
    Object.assign(this.shape.style, {
      position: "absolute",
      fontFamily: "sans-serif",
      color: "white",
      margin: "0",
      padding: "0",
    });
    this.text = document.createTextNode(this.stringVal);
    this.shape.appendChild(this.text);
    this.size = this.fontSize;
    this.y = this.p.y;
    this.x = this.p.x;
    this.angle = this.theta;
    DOMObjectGlobals.body.appendChild(this.shape);
  }
}

class Img extends DomObject {
  constructor(image, x, y, width, height, theta) {
    super(x, y);
    this.type = "img";
    this.isRectangle = true;
    this.radius = width;
    this.w = width;
    this.h = height || 1;
    this.theta = theta;
    this.shape = new Image();
    this.src = image;
    this.onLoadCallback = {};
    this.loaded = false;
    this.isUsingDumbPermanance = false;
    this.init();
  }

  init() {
    if (this.src instanceof HTMLElement) {
      this.shape = this.src;
    } else {
      this.shape.src = this.src;
    }
    Object.assign(this.shape.style, {
      height: this.h > 1 ? this.h + "px" : "",
      width: this.w + "px",
      transformOrigin: "center center",
      position: "absolute",
    });
    this.y = this.p.y;
    this.x = this.p.x;
    let temp = this.theta;
    this.theta = null;
    this.angle = temp;
    if (!this.shape.complete) {
      this.shape.onload = () => {
        this.h = parseInt(this.shape.offsetHeight);
        this.loaded = true;
        if (typeof this.onLoadCallback === "function") this.onLoadCallback();
      };
    } else {
      this.h = parseInt(this.shape.offsetHeight);
      this.loaded = true;
      if (typeof this.onLoadCallback === "function") this.onLoadCallback();
    }

    DOMObjectGlobals.body.appendChild(this.shape);
  }

  onLoad(fn) {
    this.onLoadCallback = fn;
    if (this.loaded) {
      setTimeout(fn, 1);
    }
    return this;
  }

  usingDumbPermanance() {
    this.isUsingDumbPermanance = true;
    return this;
  }
  remove() {
    if (this.removed) return;
    this.removed = true;
    if (this.isUsingDumbPermanance) {
      this.removed = false;
      this.width = 50;
      this.x = 0;
      this.y = 0;
    } else {
      try {
        this.shape.parentNode.removeChild(this.shape);
      } catch (e) {
        console.error(e);
      }
      //this removes all the children, but they still need to be marked if their objects still exist
      Object.keys(this.attachments).forEach((key) => {
        this.attachments[key].forEach((x) => {
          x.remove();
        });
      });
    }
  }

  asSquare() {
    let tempFromCenter = this.isfromCenter;
    let div = new Square(this.x, this.y, this.width);
    this.isfromCenter = false;
    if (tempFromCenter) {
      div.fromCenter();
    }
    this.detachSelf();
    div.attach(this);
    div.set("backgroundColor", "");
    let style = {
      maxWidth: this.width + "px",
      maxHeight: this.width + "px",
      height: "min-content",
      width: "auto",
      position: "relative",
      left: "",
      top: "",
    };
    this.withNoCss();
    Object.assign(this.shape.style, style);
    div.shape.style.display = "grid";
    div.shape.style.alignContent = "center";
    div.shape.style.justifyContent = "center";
    return div;
  }
}

class ImageLoader {
  constructor(path, array_of_names) {
    this.imagepaths = array_of_names.map((x) => {
      if (typeof x == "object") {
        return x;
      } else {
        return { name: x, image: path + x + ".png" };
      }
    });
    this.load();
    this.array_of_names = array_of_names;
    this.path = path;
  }

  get names() {
    return this.array_of_names;
  }

  static createImg(path) {
    let img = new Image();
    img.src = path;
    Object.assign(img.style, new StyleMaker("small").genStyle());
    if (DOMObjectGlobals.body == null) {
      throw "Did you try to use ImageLoader without setting up the DOMObjectGlobals?";
    }
    DOMObjectGlobals.body.appendChild(img);
    return img;
  }

  load() {
    this.imagepaths.forEach((obj) => {
      this[obj.name] = ImageLoader.createImg(obj.image);
    });
  }

  add(nameorarray, newPath) {
    let path = newPath || this.path;
    if (nameorarray instanceof Array) {
      nameorarray.forEach((name) => {
        this[name] = ImageLoader.createImg(path + "/" + name + ".png");
      });
    } else if (typeof nameorarray === "string") {
      this[nameorarray] = ImageLoader.createImg(path + "/" + nameorarray + ".png");
    } else {
      console.error("unexpected format to add to ImageLoader");
    }
  }
  add_obj(nameorarray) {
    if (nameorarray instanceof Array) {
      nameorarray.forEach((obj) => {
        this[obj.name] = ImageLoader.createImg(obj.image);
      });
    } else if (typeof nameorarray === "object") {
      this[nameorarray.name] = ImageLoader.createImg(nameorarray.image);
    } else {
      console.error("unexpected format to add to ImageLoader");
    }
  }
}

class Blank {
  constructor(x, y, w, h, mass) {
    this.origin_x = x;
    this.origin_y = y;
    this.w = w;
    this.h = h || w;
    this.mass = mass || 1;
    this.name = "blank";
    this.p = new Vector(x, y);
    this.old_p = new Vector(x, y);
    this.old_v = new Vector(0, 0);
    this.v = new Vector(0, 0);
    this.a = new Vector(0, 0);
    this.theta = 0;

    //forces should be of class vector. if the force should be constant, add a .constant = true property to the vector.
    this.forces = [];
    this.isDrawn = true;
    this.sprite = {};
    this.hitbox = {};

    this.maxbounds = {
      x: width || window.innerWidth,
      y: height || window.innerHeight,
    };
    this.minbounds = {
      x: 0,
      y: 0,
    };
    this.MAX_V = 200;
    this.MAX_F = 100;
    this.V_FLOOR_LIMIT = 2.1;
    this.dead = false;
    this.isFragile = false;
    this.cache = {};

    this._DEFAULT_MAX_V = 40;
    this._DEFAULT_MAX_F = 30;

    //handler for dealing with objects attached to this object
    this.attachments = {};
    this.attachment_offset = null;

    this.health = 100;
    this.dead = false;
    this.hasAntiGrav = false;
    this.hasNoSkyBox = false;
    this.hasNoBounds = false;

    //cache is used for the subroutines to store
    //values like speed and target distance

    this.cache = {};

    this.subroutines = ["Spin", "MoveTo", "SlowedMoveTo"];

    //subroutine will call a method that is
    // named .do${name}() and check with
    // .isDoing${name}
    //the subroutine should be also acticated with that same function
    //subroutimes can callback as well, stored in cache
    this.isDoingSpin = false;
    this.isDoingMoveTo = false;
    this.isDoinSlowedMoveTo = false;

    this.isAffectedByForces = true;

    this.deltaTaccumulator = 0;
    this.maxDeltaT = 1000 / 60;
  }

  get x() {
    return this.p.x;
  }

  set x(val) {
    if (typeof val !== "number") return;
    this.p.x = val;
    if (this.hasSprite) this.sprite.x = val;
  }

  get y() {
    return this.p.y;
  }

  set y(val) {
    if (typeof val !== "number") return;
    this.p.y = val;
    if (this.hasSprite) this.sprite.y = val;
  }

  get height() {
    return this.hasSprite ? this.sprite.height : this.h;
  }
  set height(val) {
    if (this.hasHitbox && val !== "") {
      this.hitbox.modHeight(val - this.height);
    }
    if (this.hasSprite) {
      this.sprite.height = val;
    } else {
      this.h = val;
    }
  }
  get width() {
    return this.hasSprite ? this.sprite.width : this.w;
  }
  set width(val) {
    if (this.hasHitbox && val !== "") {
      this.hitbox.modHeight(this.height - this.hitbox.h);
      this.hitbox.modWidth(val - this.width);
    }
    if (this.hasSprite) {
      this.sprite.width = val;
    } else {
      this.w = val;
    }
  }

  get angle() {
    return this.theta;
  }

  set angle(val) {
    this.theta = parseInt(val);
    //if(this.hasSprite) this.sprite.rotateTo(val)
  }

  get hasSprite() {
    return Object.keys(this.sprite).length > 0;
  }

  get hasHitbox() {
    return Object.keys(this.hitbox).length > 0;
  }

  addSprite(image) {
    if (this.hasSprite) return this.replaceSprite(image);
    if (image instanceof DomObject) {
      this.sprite = image;
      this.sprite.moveTo(this.p);
      this.createHitbox();
      this.h = this.sprite.height;
      this.w = this.sprite.width;
      if (this.sprite.USING_NEW_TRANSFORM) {
        this.sprite.set("will-change", "transform");
      } else {
        this.sprite.set("will-change", "left, top");
      }
    } else {
      console.error("Unsupported Format");
    }
    return this;
  }

  createHitbox() {
    if (!this.hasSprite) return;
    if (this.sprite.isRectangle) {
      this.hitbox = new Hitbox(this.p.x, this.p.y, this.sprite.width, this.sprite.height).fromCenter();
    } else {
      this.hitbox = new Hitbox(this.p.x, this.p.y, this.sprite.width / 2, true);
    }
    return this.hitbox;
  }

  replaceSprite(sprite) {
    this.sprite.remove();
    this.hitbox.destroy();
    this.sprite = {};
    this.hitbox = {};
    return this.addSprite(sprite);
  }

  addAttachment(thing, offset = new Vector(0, 0)) {
    if (!(thing instanceof Blank)) {
      console.error(`${this.name} cant attach a ${typeof thing}`);
      return;
    }
    if (this.attachmentList.includes(thing.name)) {
      thing.name +=
        "#" +
        this.attachmentList.reduce((sum, next) => {
          let num = next.split("#")[1];
          if (num) {
            return sum + 1;
          }
          return sum;
        }, 1);
    }
    thing.p = this.p.copy().add(offset);
    thing.attachment_offset = offset.copy();
    if (this.hasSprite && thing.hasSprite && this.sprite.type !== "img") {
      thing.sprite.moveTo(offset.copy().add(new Vector(this.w / 2, this.h / 2)));
      this.sprite.attach(thing.sprite);
      thing.isDrawn = false;
    } else if (this.hasSprite && thing.hasSprite && this.sprite.type === "img") {
      thing.sprite.moveTo(offset.copy().add(new Vector(this.w / 2, this.h / 2)));
    }
    this.attachments[thing.name] = thing;
    return thing;
  }

  get attachmentList() {
    return Object.keys(this.attachments);
  }

  findAttachement(name) {
    if (this.attachmentList.includes(name)) {
      return this.attachments[name];
    } else {
      return undefined;
    }
  }

  detachAttachment(name) {
    if (this.attachmentList.includes(name)) {
      let thing = this.attachments[name];
      thing.isDrawn = this.isDrawn;
      thing.p = this.p.copy();
      thing.attachment_offset = null;
      let sprite = thing.sprite.detachSelf();
      if (this.sprite.type !== "img") this.sprite.detach(thing.sprite);
      DomObject.attach(sprite);
      delete this.attachments[name];
      return thing;
    } else {
      console.error(this.name + " can't detach a " + name);
      return undefined;
    }
  }

  changeAttachementOffset(name, offset) {
    if (this.attachmentList.includes(name)) {
      this.attachments[name].attachment_offset = offset.copy();
      return this.attachments[name];
    } else {
      return undefined;
    }
  }

  update(time) {
    if (this.health <= 0) this.kill();
    if (this.dead) return;
    if (time === undefined) time = this.maxDeltaT;
    this.deltaTaccumulator += time;
    while (this.deltaTaccumulator >= this.maxDeltaT) {
      if (this.dead) break;
      //position calcs
      this.old_p = this.p.copy();
      this.subroutines.forEach((name) => {
        if (this["isDoing" + name]) {
          this["do" + name]();
        }
      });
      if (this.isAffectedByForces) {
        for (let i = this.forces.length - 1; i >= 0; i--) {
          this.a.add(this.forces[i]);
          if (!this.forces[i].constant) {
            this.forces.splice(i, 1);
          }
        }
      }
      this.a.limit(this.MAX_F);
      this.old_v = this.v.copy();
      this.v.add(this.a.copy());
      this.v.limit(this.MAX_V);
      this.p.add(this.v.copy().add(this.old_v).mult(0.5));
      this.a.clear();

      if (this.hasHitbox) {
        this.hitbox.moveTo(this.p.copy());
        this.hitbox.angle = this.angle;
      }
      this.handleBounds();

      if (this.attachmentList.length) {
        let delta_p = this.p.copy().sub(this.old_p);
        this.attachmentList.forEach((name) => {
          let thing = this.attachments[name];
          thing.p.add(delta_p);
          thing.angle = this.angle;
          thing.update();
        });
      }
      this.deltaTaccumulator = this.deltaTaccumulator - this.maxDeltaT;
    }
    if (this.isDrawn) this.draw();
  }

  draw() {
    if (!this.hasSprite) return;
    this.sprite.moveTo(this.p);
    this.sprite.rotateTo(this.theta);
  }

  addForce(force) {
    if (force instanceof Vector) {
      if (!force.constant) force.constant = false;
      this.forces.push(force);
    } else {
      console.error("must be a vector to add force");
    }
  }

  handleBounds() {
    if (this.hasNoBounds) return;
    let paddingx = 0;
    let paddingy = 0;
    if (this.hasSprite) {
      paddingx = this.sprite.width / 2;
      paddingy = this.sprite.height / 2;
      if (paddingy === undefined || paddingx === undefined) console.error("issue with " + this.name + "'s sprite");
    }
    if (this.p.x + paddingx > this.maxbounds.x) {
      this.p.x = this.maxbounds.x - paddingx;
      this.v.x = 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.y + paddingy > this.maxbounds.y) {
      this.p.y = this.maxbounds.y - paddingy;
      this.v.y = 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.x - paddingx < this.minbounds.x) {
      this.p.x = this.minbounds.x + paddingx;
      this.v.x = 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.y - paddingy < (this.hasNoSkyBox ? -3000 : this.minbounds.y)) {
      this.p.y = this.minbounds.y + paddingy - (this.hasNoSkyBox ? 3000 : 0);
      this.v.y = 0;
      if (this.isFragile) this.kill();
    }
  }

  kill() {
    this.health = 0;
    this.dead = true;
    if (this.hasSprite) {
      this.sprite.remove();
    }
    if (this.hasHitbox) {
      this.hitbox.destroy();
    }
    if (this.attachmentList.length) {
      this.attachmentList.forEach((name) => {
        this.attachments[name].kill();
      });
    }
    this.sprite = {};
  }

  doSpin(theta, speed) {
    if (!this.isDoingSpin) {
      this.cache.doSpin = {};
      if (speed < 0) {
        speed = Math.abs(speed);
        theta = -theta;
      }
      this.cache.doSpin.speed = speed || 1;
      this.cache.doSpin.target = this.theta + theta;
      this.cache.doSpin.clockwise = theta > 0;
      this.cache.doSpin.callback = {};
      this.isDoingSpin = true;
      return {
        then: (fn) => {
          this.cache.doSpin.callback = fn;
        },
      };
    }
    let config = this.cache.doSpin;
    let hasdiff = () => {
      return config.clockwise ? config.target > this.theta : config.target < this.theta;
    };
    if (hasdiff()) {
      //TODO can be rearanged
      this.angle = this.angle + config.speed * (config.clockwise ? 1 : -1);
      if (!hasdiff()) this.angle = config.target;
    } else {
      this.isDoingSpin = false;
      this.theta = this.theta % 360;
      let callback = undefined;
      if (typeof config.callback === "function") callback = config.callback;
      delete this.cache.doSpin;
      if (callback) callback();
    }
  }
}

function getImage(name) {
  //used primarily for testgames
  if (LOADED_IMAGES !== undefined) {
    let img = LOADED_IMAGES[name];
    if (!img) console.log("cant find " + name);
    return img;
  } else {
    return name;
  }
}

class Character extends Blank {
  constructor(x, y, name) {
    super(x, y, 50, 50, 1);
    this.maxbounds = { x: width, y: height - 100 };

    this.jumpMult = 30;
    this.name = name;
    this.subroutines = this.subroutines.concat(["Land"]);

    this.interruptSparHop = false;
    this.isDoingLand = true;

    this.landing_emitter = new EventEmitter();
    this.unsub_landing_emmitter = this.landing_emitter.subscribe("land", this.emitLanding.bind(this));

    this.deathImage = {};
    this.deathImageTime = 800;
    this.projectileOffsetHeight = 0;

    this.attackScale = 1;
  }
  addDeathImage(image) {
    if (image instanceof HTMLElement) this.deathImage = image;
  }
  get hasDeathImage() {
    return this.deathImage instanceof HTMLElement;
  }

  emitLanding() {
    this.isCurrentlyJumping = false;
    this.v.x = 0;
  }

  kill() {
    if (this.dead) return;
    let rememberZindex = this.sprite.zIndex + 1;
    let explode = () => {
      let explosion = new Img(this.deathImage, this.p.x, this.p.y, this.width * this.scale).fromCenter().usingNewTransform();
      explosion.zIndex = rememberZindex;
      let loop = setInterval(() => {
        explosion.mod("width", ((this.width * this.scale) / 30) | 0);
        explosion.mod("left", ((this.width * this.scale) / -60) | 0);
        explosion.mod("top", ((this.width * this.scale) / -60) | 0);
      }, 16);
      setTimeout(() => {
        clearInterval(loop);
        explosion.remove();
      }, this.deathImageTime);
    };
    this.health = 0;
    this.dead = true;
    this.unsub_landing_emmitter();
    if (this.hasSprite) {
      this.sprite.remove();
    }
    if (this.hasHitbox) {
      this.hitbox.destroy();
    }
    if (this.attachmentList.length) {
      this.attachmentList.forEach((name) => {
        this.attachments[name].kill();
      });
    }
    this.sprite = {};

    if (this.hasDeathImage) {
      explode.apply(this);
    }
  }

  doLand() {
    if (this.isCurrentlyJumping && this.p.y + this.height / 2 >= this.maxbounds.y) {
      this.landing_emitter.emit("land");
    }
  }
}

class EventEmitter {
  constructor() {
    this.events = {};
  }
  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
    return () => {
      this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
    };
  }
  done(fn) {
    if (!this.events.done) {
      this.events.done = {};
    }
    this.events.done = fn;
  }
  emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }
  emitDone(data) {
    const event = this.events.done;
    if (event) {
      event.call(null, data);
    }
    delete this.events.done;
  }
}
//IMPORTANT TO USE EACH TIME
function setupBody(object) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        DOMObjectGlobals.body = object;
        width = object.clientWidth;
        height = object.clientHeight;
        let a = new Img("../important_files/logo.png", width * 0.75, 0, width / 4);
        a.shape.style.cursor = "pointer";
        a.shape.addEventListener("click", () => {
          window.location.assign("https://whatstheword.io");
        });
        resolve(object);
      });
    });
  });
}
class Hitbox {
  constructor(x, y, WidthorRadius, height, drawBounds) {
    this.x = x;
    this.y = y;
    this.x2 = x + WidthorRadius;
    this.y2 = y + height;
    this.w = WidthorRadius;
    this.h = height || WidthorRadius;
    this.isRectangle = !!WidthorRadius && !!height;
    this.isfromCenter = false;
    //is a rectangle or a circle
    this.radius = this.isRectangle ? WidthorRadius / 2 : WidthorRadius;
    this.a = new Vector(x, y);
    this.b = new Vector(x, this.y2);
    this.c = new Vector(this.x2, this.y2);
    this.d = new Vector(this.x2, y);
    this.theta = 0;
    this.config = {
      rotation: "custom",
      //can be bottom, left, right, xy, center
    };
    this.points = [];
    if (drawBounds) {
      this.drawPoints();
    }
    this.isDrawn = drawBounds; //draw||false;
  }

  get angle() {
    return this.theta;
  }
  set angle(val) {
    this.rotateTo(val);
    this.theta = val;
  }

  modHeight(val) {
    this.h += val;
    this.c.y += val;
    this.b.y += val;
  }

  modWidth(val) {
    this.w += val;
    this.c.x += val;
    this.d.x += val;
  }

  contains(target) {
    if (this.isRectangle) {
      //if this is a rectangle
      if (target instanceof Hitbox) {
        //and the target is a Hitbox class, deal with the target being a cicrle or a rectabgle
        //if both are at 0 rotation
        if (this.angle === 0 && target.angle === 0) {
          if (target.isRectangle) {
            //console.log(this.a.x>target.d.x , this.d.x<target.a.x , this.b.y < target.a.y , this.a.y>target.b.y);
            return !(this.a.x > target.d.x || this.d.x < target.a.x || this.b.y < target.a.y || this.a.y > target.b.y);
          }
          return this.a.y - target.radius <= target.a.y || this.a.x - target.radius <= target.a.x || this.c.y + target.radius >= target.a.y || this.c.x + target.radius >= target.a.x;
        } else {
          //TODO probably can be optimized
          let labels = "abcd".split("");
          //check if any of the target's points are inside of this hitbox
          for (let i = 0; i < 4; i++) {
            if (this.contains(target[labels[i]])) return true;
          } //check if any of this hitbox's points are inside target's hitbox
          for (let i = 0; i < 4; i++) {
            if (target.contains(this[labels[i]])) return true;
          }
          return false;
        }
      } else {
        //if target is a point or object with an x.y
        let p = target;
        if (!(p instanceof Vector)) p = new Vector(target.x, target.y);
        let AB = this.b.copy().sub(this.a);
        let AP = p.copy().sub(this.a);
        let BC = this.c.copy().sub(this.b);
        let BP = p.copy().sub(this.b);
        let dotABAP = AB.dot(AP);
        let dotABAB = AB.dot(AB);
        let dotBCBP = BC.dot(BP);
        let dotBCBC = BC.dot(BC);
        return 0 <= dotABAP && dotABAP <= dotABAB && 0 <= dotBCBP && dotBCBP <= dotBCBC;
      }
    } else {
      //but if this is a circle
      if (target instanceof Hitbox) {
        // and target is a hitbox
        if (target.isRectangle) return target.contains(this); //just do the other one
        return this.a.dist(target.a) < this.radius + target.radius;
      } else {
        let p = new Vector(target.x, target.y);
        return this.a.dist(p) < this.radius;
      }
    }
  }

  rotateTo(r, rx, ry) {
    let nr = r - this.angle;
    return this.rotate(nr, rx, ry);
  }

  rotate(r, rx, ry) {
    if (r === 0) return this;
    let cx = 0;
    let cy = 0;
    //deal with rads
    switch (this.config.rotation) {
      case "center":
        cx = (this.x + this.x2) / 2;
        cy = (this.y + this.y2) / 2;
        break;
      case "xy":
        cx = this.a.x;
        cy = this.a.y;
        break;
      case "bottom":
        cx = (this.x + this.x2) / 2;
        cy = this.y2;
        break;
      case "left":
        cx = this.x;
        cy = (this.y + this.y2) / 2;
        break;
      case "right":
        cx = this.x2;
        cy = (this.y + this.y2) / 2;
        break;
      case "top":
        cx = (this.x + this.x2) / 2;
        cy = this.y;
        break;
      case "custom":
        cx = rx || this.x;
        cy = ry || this.y;
        break;
      default:
        break;
    }
    let p = { x: cx, y: cy };
    this.a.rotateAround(p, r);
    this.b.rotateAround(p, r);
    this.c.rotateAround(p, r);
    this.d.rotateAround(p, r);
    this.x = this.a.x;
    this.y = this.a.y;
    this.x2 = this.c.x;
    this.y2 = this.c.y;
    return this;
  }

  add(v) {
    this.a.add(v);
    this.b.add(v);
    this.c.add(v);
    this.d.add(v);
    this.x = this.a.x;
    this.y = this.a.y;
    this.x2 = this.c.x;
    this.y2 = this.c.y;
    return this;
  }

  moveTo(p) {
    if (!(p instanceof Vector)) {
      console.error(this, ".moveTo() expects Vector");
      return;
    }
    p = p.copy();
    if (this.isfromCenter && this.isRectangle) {
      let offset = new Vector(this.w / -2, this.h / -2);
      p.add(offset);
    }
    if (!this.lastp) this.lastp = this.a.copy();
    let move = p.copy().sub(this.lastp);
    this.add(move);
    this.lastp = p.copy();
    return this;
  }

  destroy() {
    if (this.isDrawn) {
      this.points.forEach((point) => {
        point.remove();
      });
    }
  }

  fromCenter() {
    let v = new Vector(this.w / -2, this.h / -2);
    this.a.add(v);
    this.b.add(v);
    this.c.add(v);
    this.d.add(v);
    this.x = this.a.x;
    this.y = this.a.y;
    this.x2 = this.c.x;
    this.y2 = this.c.y;
    this.isfromCenter = true;
    this.config.rotation = "center";
    return this;
  }
}

class FallingImg extends Character {
  constructor(x, y, name, fallSpeed, killOnFall) {
    super(x, y, name);
    this.fallSpeed = fallSpeed || 1;
    this.subroutines = this.subroutines.concat("Fall");
    this.isDoingFall = false;
    if (killOnFall) {
      let unsub = this.landing_emitter.subscribe("land", () => {
        this.kill();
        unsub();
      });
    } else {
      let unsub = this.landing_emitter.subscribe("land", () => {
        this.isDoingFall = false;
        unsub();
      });
    }
  }
  doFall() {
    if (this.isDoingFall) {
      this.v = new Vector(0, this.fallSpeed);
    } else {
      this.isDoingFall = true;
      this.isCurrentlyJumping = true;
    }
  }
  static createIcon(image, shapeWidth, shapeHeight, color) {
    let img = {};
    return new Promise((resolve) => {
      if (typeof image == "string") {
        img = new Img(image, -width, -height, width);
        img.width = shapeWidth;
        img.onLoad(() => {
          img = img.asSquare();
          img.set("borderRadius", r(width / 180) + "px");
          img.set("backgroundColor", "white");
          img.set("border", "solid " + (color || "lightblue") + " " + r(width / 300) + "px");
          resolve(img);
        });
      } else if (image instanceof DomObject) {
        image.width = shapeWidth;
        image.onLoad(() => {
          img = img.asSquare();
          img.set("borderRadius", r(width / 180) + "px");
          img.set("backgroundColor", "white");
          img.set("border", "solid " + (color || "lightblue") + " " + r(width / 300) + "px");
          resolve(img);
        });
      } else if (image instanceof Node) {
        img = new Img(image, -width, -height, width);
        img.width = shapeWidth;
        img.onLoad(() => {
          img = img.asSquare();
          img.set("borderRadius", r(width / 180) + "px");
          img.set("backgroundColor", "white");
          img.set("border", "solid " + (color || "lightblue") + " " + r(width / 300) + "px");
          resolve(img);
        });
      } else {
        console.error(typeof image + " is not a valid image");
      }
    });
  }
}
