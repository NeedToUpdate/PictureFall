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

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static random(x, y) {
    //creates a random vector from 0 to limits given
    if (typeof x === "number" && typeof y === "number") {
      return new Vector(Math.random() * x, Math.random() * y);
    } else if (typeof x === "number" && !y) {
      return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).set(x);
    } else {
      return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).set(1);
    }
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

  map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    return this;
  }

  get mag() {
    return this.magnitude;
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  log() {
    console.log(JSON.stringify(this));
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

  d2r(r) {
    return (r / 180) * Math.PI;
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

  dot(v) {
    return this.x * v.x + this.y * v.y;
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



let MAINLOOP = 0; //id of the mainloop interval
let FPS = 60; //the per second interval set for mainloop
let LOCAL = true;
let width = window.innerWidth;
let height = window.innerHeight;
let LAST_TIME = 0;
let alphabet = "abcdefghijklmnopqrstuvwxyz";
let superlongalpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^<>+|&*()=-:_.,[]{}";
let extended_alphabet = (z = "0123456789" + alphabet);

async function loadFileFromServer(name, url, callback) {
  let localhost = "http://localhost:3000";
  if (!LOCAL) {
    localhost = "";
  }
  let response = await fetch(url || localhost + "/test/" + name);
  console.log("file " + name + " recieved");
  callback();
  let blob = await response.blob();
  callback();
  let r = new FileReader();
  return new Promise((resolve) => {
    r.onload = (x) => {
      console.log("file " + name + " processed");
      resolve(r.result);
    };
    r.readAsText(blob);
  });
}
function r(num) {
  return num | 0;
}

//IMPORTANT TO USE EACH TIME
function setupBody(object) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        DOMObjectGlobals.body = object;
        width = object.clientWidth;
        height = object.clientHeight;
        resolve(object);
      });
    });
  });
}

let IS_LOADING = false;
function setLoading(bool) {
  if (IS_LOADING == bool) return;
  if (bool) {
    let div = document.createElement("div");
    let style = {
      position: "absolute",
      zIndex: "99999999",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: r(width / 7) + "px",
      height: r(width / 7) + "px",
      left: r(width / 2 - width / 14) + "px",
      top: r(height / 2 - height / 14) + "px",
    };
    Object.assign(div.style, style);
    div.innerHTML =
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path fill="white" d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z">    <animateTransform attributeName="transform" type="rotate" dur="0.6s" values="0 12 12;360 12 12" repeatCount="indefinite" />  </path></svg>';
    div.setAttribute("id", "loading_spinner");
    DOMObjectGlobals.body.appendChild(div);
  } else {
    id("loading_spinner").remove();
  }
  IS_LOADING = bool;
}

function id(string) {
  return document.getElementById(string);
}
function jlog(obj) {
  console.log(JSON.stringify(obj));
}
function clog(obj) {
  console.log(JSON.parse(JSON.stringify(obj)));
}
function l(thing) {
  console.log(thing);
}

function dloop(fn, n) {
  for (let i = 0; i < n; i++) {
    requestAnimationFrame(() => requestAnimationFrame(() => fn()));
  }
}

function start_old() {
  MAINLOOP = setInterval(loop, 1000 / FPS);
  LOOPING = true;
}

//creates a download popup of a text file with the json put into content
function download(content, fileName) {
  let data = JSON.stringify(content);
  let url = URL.createObjectURL(new Blob([data], { type: "text/json" }));
  let dlAnchorElem = document.createElement("a");
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.setAttribute("href", url);
  dlAnchorElem.setAttribute("download", fileName);
  dlAnchorElem.click();
  document.body.removeChild(dlAnchorElem);
}
function drawImage(ctx, data, w, h, pixelsize, isRGBA) {
  let upscale = pixelsize || 4;
  let width = (w || 28) * upscale;
  let height = (h || 28) * upscale;
  let pixels = ctx.createImageData(width, height);
  let count = 0 - width * 4 * (upscale - 1);
  if (!isRGBA) {
    data.forEach((pixel, i) => {
      if (i % (width / upscale) === 0) count += width * 4 * (upscale - 1);
      let pixel_index_array = [];
      for (let k = 0; k < upscale; k++) {
        pixel_index_array.push(width * 4 * k + i * 4 * upscale + count);
      }
      for (let j = 0; j < 4 * upscale; j++) {
        pixel_index_array.forEach((index) => {
          pixels.data[index + j] = pixel;
          if ((j + 1) % 4 === 0) {
            pixels.data[index + j] = 255;
          }
        });
      }
    });
  } else {
    data.forEach((pixel, i) => {
      if (i % width === 0) count += width * 4 * (upscale - 1);
      let pixel_index_array = [];
      for (let k = 0; k < upscale; k++) {
        pixel_index_array.push(width * 4 * k + i * upscale + count);
      }
      for (let j = 0; j < upscale; j++) {
        pixel_index_array.forEach((index) => {
          pixels.data[index + j * upscale] = pixel;
        });
      }
    });
  }

  ctx.putImageData(pixels, 0, 0);
}
function drawImageRGB(ctx, r, g, b, w, h, pixelsize) {
  let upscale = pixelsize || 4;
  let width = (w || 28) * upscale;
  let height = (h || 28) * upscale;
  let pixels = ctx.createImageData(width, height);
  let count = 0 - width * 4 * (upscale - 1);

  r.forEach((pixel, i) => {
    if (i % (width / upscale) === 0) count += width * 4 * (upscale - 1);
    let pixel_index_array = [];
    for (let k = 0; k < upscale; k++) {
      pixel_index_array.push(width * 4 * k + i * 4 * upscale + count);
    }
    for (let j = 0; j < upscale; j++) {
      pixel_index_array.forEach((index) => {
        pixels.data[index + j * 4] = r[i];
        pixels.data[index + 1 + j * 4] = g[i];
        pixels.data[index + 2 + j * 4] = b[i];
        pixels.data[index + 3 + j * 4] = 255;
      });
    }
  });

  ctx.putImageData(pixels, 0, 0);
}
function loadCSV(csv) {
  let lines = csv.split("\n");
  let arrays = lines.map((x) => {
    return x.split(",");
  });
  let nums = [];
  arrays.forEach((arr) => {
    let n = {};
    n.label = arr.splice(0, 1)[0];
    n.pixels = arr;
    nums.push(n);
  });
  return nums;
}
// returns an array with ${max} values, all 0, with value n being 1
// used for machine learning, aka one-hot vector
function enumerate(n, max) {
  n = parseInt(n);
  if (n < 0 || n > max - 1) {
    return 0;
  }
  return Array(max)
    .fill(0)
    .map((x, i) => {
      if (n === i) {
        return 1;
      } else {
        return 0;
      }
    });
}

//does the opposite of enumerate
function denumerate(arr) {
  if (arr instanceof Array) {
    return argMax(arr);
  }
}

//returns the index of the largest value in an array
function argMax(arr) {
  return arr.indexOf(arr.reduce((a, b) => Math.max(a, b)));
}

let RANDOM_INTS = null;
let RANDOM_INTS_TO_CREATE = 100000;
let FAKE_RANDOM_ACTIVATED = false;
let FAKE_RANDOM_BITS = 1;
function activateFakeRandom(bits = 16) {
  switch (bits) {
    case 8:
      RANDOM_INTS = new Uint8Array(RANDOM_INTS_TO_CREATE);
      break;
    case 16:
      RANDOM_INTS = new Uint16Array(RANDOM_INTS_TO_CREATE);
      break;
    case 32:
      RANDOM_INTS = new Uint32Array(RANDOM_INTS_TO_CREATE);
      break;
  }
  for (let i = 0; i < RANDOM_INTS_TO_CREATE; i++) {
    RANDOM_INTS[i] = (Math.random() * 2 ** bits) | 0;
  }
  FAKE_RANDOM_ACTIVATED = true;
  FAKE_RANDOM_BITS = bits;
}
let RANDOM_INT_COUNT = 0;
function getFakeRandomInt() {
  if (RANDOM_INT_COUNT >= RANDOM_INTS_TO_CREATE) RANDOM_INT_COUNT = 0;
  return RANDOM_INTS[RANDOM_INT_COUNT++];
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

function diff2word(num) {
  switch (num) {
    case 0:
      return "easy";
    case 1:
      return "med";
    case 2:
      return "hard";
    case 3:
      return "crazy";
    default:
      return "ezpz";
  }
}

class ErrorHandler {
  constructor(error) {
    this.err = [];
    if (arguments.length > 1) {
      for (let arg of arguments) {
        this.err.push(arg);
      }
    } else {
      this.err = [error];
    }
    this.error = this.err;
    this.log();
    this.stopLoop();
  }
  log() {
    console.error(...this.err);
  }
  stopLoop() {
    stop();
  }
}

//degub functions

function crd(lim1, lim2) {
  //create random dot
  return new Div(getRandom(lim1, lim2), getRandom(lim1, lim2), "white");
}

function cao(fn) {
  //create alphabet object, eg obj = {a:thing, b:thing,c:thing}
  //funtion needs to return the value

  let obj = {};
  Array.from(alphabet).forEach((letter) => {
    if (typeof fn === "function") {
      obj[letter] = fn();
    } else {
      obj[letter] = null;
    }
  });
  return obj;
}

function setBackground(color) {
  document.body.style.backgroundColor = color;
}

let VECTORS = {
  gravity: Object.assign(new Vector(0, 1), { constant: true }),
  slowGravity: Object.assign(new Vector(0, 0.1), { constant: true }),
};

function checkObj(obj) {
  if (obj == undefined) {
    return false;
  }
  return Object.keys(obj).length > 0;
}

function mapNum(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

///===== draw function for slow computers =====
let FALLBACK_USE_SET_TIMEOUT_ON_SLOWDOWN = false;
let FALLBACK_ALREADY_SWITCHED = false;
let FALLBACK_GLOBAL_TIME = 0;
let FALLBACK_ARRAY_OF_TIMES = [];
function switchToFallbackMode() {
  //nothing here
}
function createFallbackLoopFunction(fn) {
  //function provided is the loop() function
  //on work computers, the requestAnimationFrame() loop seems to be very slow, but only sometimes
  //so this function will record the fps of the loop, and if it falls below a set threshold,
  //it will revert to using an interval for loops. will cause more bugs, but speed over stabilty here
  loop = fn;
  FALLBACK_GLOBAL_TIME = 0;
  let frame_total = 40;
  let fps_limit = 20;
  let threshold = (1000 / fps_limit) * frame_total;
  switchToFallbackMode = function () {
    FALLBACK_ALREADY_SWITCHED = true;
    FALLBACK_USE_SET_TIMEOUT_ON_SLOWDOWN = true;
    if (LOOPING) MAINLOOP = setInterval(loop, 1000 / FPS);
    start = function () {
      LOOPING = true;
      MAINLOOP = setInterval(loop, 1000 / FPS);
    };
    stop = function (resetFallback) {
      LOOPING = false;
      clearInterval(MAINLOOP);
      FALLBACK_USE_SET_TIMEOUT_ON_SLOWDOWN = !resetFallback;
    };
  };
  function fancyLoop(time) {
    let delta_t = time - FALLBACK_GLOBAL_TIME;
    FALLBACK_GLOBAL_TIME = time;
    FALLBACK_ARRAY_OF_TIMES.push(delta_t);
    if (FALLBACK_ARRAY_OF_TIMES.length >= frame_total) FALLBACK_ARRAY_OF_TIMES.splice(0, 1);
    if (FALLBACK_ARRAY_OF_TIMES.reduce((a, b) => a + b) > threshold) {
      //if it falls below 30fps for 40 frames, switch to the old method.
      switchToFallbackMode();
    }
    if (LOOPING && !FALLBACK_USE_SET_TIMEOUT_ON_SLOWDOWN) {
      loop();
      requestAnimationFrame(fancyLoop);
    } else if (LOOPING && FALLBACK_USE_SET_TIMEOUT_ON_SLOWDOWN && !FALLBACK_ALREADY_SWITCHED) {
      switchToFallbackMode();
    }
  }
  start = function () {
    LOOPING = true;
    FALLBACK_GLOBAL_TIME = window.performance.now();
    fancyLoop(window.performance.now());
  };

  return {
    start: function () {
      start();
    },
  };
}

function shakeScreen() {
  let transition = id("MAIN_SCREEN").style.transition;
  id("MAIN_SCREEN").style.transition = "";
  id("MAIN_SCREEN").style.left = "-5px";
  setTimeout(() => {
    id("MAIN_SCREEN").style.left = "5px";
    setTimeout(() => {
      id("MAIN_SCREEN").style.left = "-5px";
      setTimeout(() => {
        id("MAIN_SCREEN").style.left = "5px";
        setTimeout(() => {
          id("MAIN_SCREEN").style.left = "-5px";
          setTimeout(() => {
            id("MAIN_SCREEN").style.left = "";
            id("MAIN_SCREEN").style.transition = transition;
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  }, 50);
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

//gets the words out of the url, like ?words=["this","is","a","word"]
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//============== EXTERNAL =================
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
  let r, g, b;
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}



class Matrix {
    constructor(rows, cols) {
        if (rows instanceof Array) {
            this.label = '';
            this.rows = rows.length;
            if (typeof rows[0] === 'number') {
                //console.log(rows);
                this.cols = 1;
                this.values = rows.map(x => [x]);
            } else {
                this.cols = rows[0].length;
                this.values = [];

                //deep copy the values
                Array(this.rows)
                    .fill()
                    .forEach((x, i) => {
                        this.values[i] = [];
                        Array(this.cols)
                            .fill()
                            .forEach((x, j) => {
                                this.values[i][j] = rows[i][j];
                            });
                    });
            }

            //console.log(`Made new matrix with ${this.rows} rows and ${this.cols} columns`)
        } else {
            this.cols = cols;
            this.rows = rows;
            this.values = [];
            this.label = '';
            Array(rows)
                .fill()
                .forEach((x, i) => {
                    this.values[i] = [];
                    Array(cols)
                        .fill()
                        .forEach((x, j) => {
                            this.values[i][j] = 0;
                        });
                });
        }
    }

    log() {
        //nicely prints to console
        console.table(this.values);
    }

    map(func) {
        //applies a function to each value in the matrix
        //not sure if i can do softmax here so need exception
        if (func instanceof SomethingElse) {
            //dont want it to check too many things
            switch (func.name) {
                case 'softmax':
                    return this.softmax();
                case 'dsoftmax':
                    return this.d_softmax();
                default:
                    console.error(`no handler for this exception: ${func.name}`);
                    return this;
            }
        }
        this.values.forEach((arr, i) => {
            arr.forEach((x, j) => {
                this.values[i][j] = func(x, i, j);
            });
        });
        return this;
    }

    softmax() {
        let sumArr = this.flatten();
        let max = sumArr.reduce((a, b) => Math.max(a, b));
        let sum = sumArr.reduce((tot, x) => (tot += Math.exp(x - max)), 0);
        this.values.forEach((arr, i) => {
            arr.forEach((x, j) => {
                this.values[i][j] = Math.exp(this.values[i][j] - max) / sum;
            });
        });
        return this;
        // return arr.map(x=>(Math.exp(x-max)/sum));
    }
    static softmax(arr) {
        let sumArr = arr;
        let max = sumArr.reduce((a, b) => Math.max(a, b));
        let sum = sumArr.reduce((tot, x) => (tot += Math.exp(x - max)), 0);
        return arr.map(x => Math.exp(x - max) / sum);
    }
    static d_softmax(arr) {
        let sumArr = arr;
        let max = sumArr.reduce((a, b) => Math.max(a, b));
        let sum = sumArr.reduce((tot, x) => (tot += Math.exp(x - max)), 0);
        return arr.map(x => {
            let e0 = Math.exp(x - max);
            return (e0 * (sum - e0)) / (sum * sum);
        });
    }
    d_softmax() {
        let sumArr = this.flatten();
        let max = sumArr.reduce((a, b) => Math.max(a, b));
        let e_sum = sumArr.reduce((tot, x) => (tot += Math.exp(x - max)), 0);
        this.values.forEach((arr, i) => {
            arr.forEach((x, j) => {
                let e0 = Math.exp(this.values[i][j] - max);
                this.values[i][j] = (e0 * (e_sum - e0)) / (e_sum * e_sum);
            });
        });
        return this;
    }

    flatten() {
        let sumArr = [];
        this.values.forEach(arr => {
            sumArr = sumArr.concat(arr);
        });
        return sumArr;
    }

    sum() {
        return this.flatten().reduce((a, b) => a + b);
    }

    mapOne(func, i, j) {
        //applies function to one value in the matrix
        //function must take in one value and return one value
        this.values[i][j] = func(this.values[i][j]);
        return this;
    }

    add(n) {
        //elemntwise add
        if (n instanceof Matrix) {
            if (this.cols !== n.cols || this.rows !== n.rows) {
                console.error('Matrices must have same number of rows and columns to add pointwise');
                return undefined;
            }
            this.values.forEach((col, i) => {
                col.forEach((x, j) => {
                    this.values[i][j] += n.values[i][j];
                });
            });
            return this;
        } else {
            return this.map(x => x + n);
        }
    }

    static add(matrixA, matrixB) {
        //matrix add
        if (matrixA.cols !== matrixB.cols || matrixA.rows !== matrixB.rows) {
            console.error('Matrices must have same number of rows and columns');
            return undefined;
        }

        let a = matrixA.values;
        let b = matrixB.values;
        let c = [];
        a.forEach((arr, i) => {
            c[i] = [];
            arr.forEach((x, j) => {
                c[i][j] = a[i][j] + b[i][j];
            });
        });

        return new Matrix(c);
    }

    randomize(min, max) {
        //generates random numbers for each value wiht gaussian distribution
        //if none is set, then just random values from -1 to 1
        //if min-max is set then its bound to those
        //if only one number then limit to that number
        //if number is set plus true, then the number is the squish factor and produces more squished values
        function getRandomInt(min_, max_) {
            min_ = Math.ceil(min_);
            max_ = Math.floor(max_);
            return Math.floor(Matrix.gaussRand() * (max_ + 1 - min_)) + min_;
        }

        if (!arguments.length) {
            this.map(x => 1 - Matrix.gaussRand() * 2);
        } else if (arguments.length === 1 && typeof arguments[0] === 'number') {
            this.map(x => Math.floor(Matrix.gaussRand() * (min + 1)));
        } else if (arguments.length === 2 && typeof arguments[0] !== 'boolean') {
            this.map(x => getRandomInt(min, max));
        } else if (typeof arguments[1] !== 'boolean') {
            this.map(x => 1 - Matrix.gaussRand(arguments[1]) * 2);
        }
        return this;
    }
    static gaussRand(constraint) {
        constraint = constraint || 6;
        let rand = 0;
        for (let i = 0; i < constraint; i += 1) {
            rand += Math.random();
        }
        return rand / constraint;
    }

    //elementwise functions
    mult(n) {
        return this.multiply(n);
    }

    multiply(n) {
        if (n instanceof Matrix) {
            if (this.cols !== n.cols || this.rows !== n.rows) {
                console.error('Matrices must have same number of rows and columns to multiply pointwise');
                return undefined;
            }
            this.values.forEach((col, i) => {
                col.forEach((x, j) => {
                    this.values[i][j] *= n.values[i][j];
                });
            });
            return this;
        } else {
            return this.map(x => x * n);
        }
    }

    sub(n) {
        return this.subtract(n);
    }

    subtract(n) {
        if (n instanceof Matrix) {
            if (this.cols !== n.cols || this.rows !== n.rows) {
                console.error('Matrices must have same number of rows and columns to subtract pointwise');
                return undefined;
            }
            this.values.forEach((col, i) => {
                col.forEach((x, j) => {
                    this.values[i][j] -= n.values[i][j];
                });
            });
            return this;
        } else {
            return this.map(x => x - n);
        }
    }

    static subtract(matrixA, matrixB) {
        return this.add(matrixA, matrixB.copy().mult(-1));
    }
    div(n) {
        return this.divide(n);
    }
    divide(n) {
        if (n === 0) {
            return undefined;
        }
        return this.multiply(1 / n);
    }

    transpose(copy) {
        let tmp = new Matrix(this.cols, this.rows);

        tmp.values.forEach((row, i) => {
            row.forEach((x, j) => {
                tmp.values[i][j] = this.values[j][i];
            });
        });

        if (copy) {
            return tmp;
        } else {
            this.cols = tmp.cols;
            this.rows = tmp.rows;
            this.values = tmp.values;
            return this;
        }
    }

    static multiply(matrixA, matrixB) {
        if (matrixA.cols !== matrixB.rows) {
            console.error("matrix A's cols must match matrix B's rows");
            return undefined;
        }
        let result = new Array(matrixA.rows).fill(0).map(row => new Array(matrixB.cols).fill(0));
        let multd = result.map((row, i) => {
            return row.map((val, j) => {
                return matrixA.values[i].reduce((tot, a, k) => tot + a * matrixB.values[k][j], 0);
            });
        });
        return new Matrix(multd);
    }

    static dot(a, b) {
        let c = [];
        a.forEach((x, i) => {
            c[i] = x * b[i];
        });
        return c.reduce((t, x) => t + x);
    }

    copy() {
        //return an new copy
        let m = new Matrix(this.values);
        m.label = this.label;
        if (this.maxpoolhack) {
            m.maxpoolhack = this.maxpoolhack;
        }
        return m;
    }
    //todo add broadcasting (expand aray to fit size)

    static fromArray(arr, rows, cols) {
        arr = Array.from(arr);
        rows = rows || arr.length;
        cols = cols || 1;
        let rowsize = arr.length / rows;
        let newarr = [];
        for (let i = 0; i < rows; i++) {
            let row = arr.splice(0, cols);
            if (row.length < rowsize) {
                console.error('array doesnt fit this size');
            }
            newarr.push(row);
        }
        return new Matrix(newarr);
    }

    slice(x1, y1, x2, y2) {
        let colslice = x2 - x1;
        let rowslice = y2 - y1;
        let newarr = [];
        for (let i = y1; i < y2 + 1; i++) {
            newarr.push(this.values[i].slice(x1, x2 + 1));
        }
        return new Matrix(newarr);
    }

    static convolute(matrix, kernel, stepsize) {
        let fn = '';
        if (matrix.rows < kernel.rows) {
            console.error('kerner is bigger than the field');
            return undefined;
        }
        let newmat;
        if (stepsize instanceof SomethingElse) {
            fn = stepsize.name;
            stepsize = kernel.cols;
            newmat = new Matrix(matrix.rows / kernel.rows, matrix.cols / kernel.cols);
            newmat.maxpoolhack = [];
            if (newmat.rows !== Math.floor(newmat.rows)) {
                console.error('you cant maxpool this with this kernel');
                return undefined;
            }
        } else {
            stepsize = stepsize || 1;
            newmat = new Matrix(matrix.rows - kernel.rows + 1, matrix.cols - kernel.cols + 1);
        }
        let h = kernel.rows - 1;
        let w = kernel.cols - 1;
        let rows = [];

        for (let i = 0; i < matrix.rows - h; i += stepsize) {
            let row = [];
            for (let j = 0; j < matrix.cols - w; j += stepsize) {
                let sum;
                let slice = matrix.slice(j, i, h + j, w + i);
                let index = [];
                if (fn === 'maxpool') {
                    let temp = slice.flatten();
                    sum = temp.reduce((a, b) => Math.max(a, b));
                    let ii = temp.indexOf(sum);
                    index = [Math.floor(ii / slice.cols) + i, (ii % slice.rows) + j];
                    newmat.maxpoolhack.push(index);
                } else {
                    sum = slice.mult(kernel).sum();
                }
                row.push(sum);
            }
            rows.push(row);
        }
        newmat.values = rows;
        return newmat;
    }

    max() {
        return this.flatten().reduce((a, b) => Math.max(a, b));
    }
    min() {
        return this.flatten().reduce((a, b) => Math.min(a, b));
    }
    absmax() {
        //absolute of largest value in array
        return Math.max(Math.abs(this.max()), Math.abs(this.min()));
    }
    normalize(setmin, setmax) {
        //if no values then its just betwen 0 and 1
        let max = this.flatten().reduce((a, b) => Math.max(a, b));
        let min = this.flatten().reduce((a, b) => Math.min(a, b));
        if (!arguments[0]) {
            if (max === min) {
                return this;
            }
            return this.map(x => (x - min) / (max - min));
        } else {
            if (max === min) {
                return this.map(x => (x < 0 ? -setmin : x === 0 ? 0 : setmax));
            }
            return this.map(x => ((x - min) / (max - min)) * (setmax - setmin) + setmin);
        }
    }
    norm(setmin, setmax) {
        return this.normalize(setmin, setmax);
    }
    pad(num, val) {
        val = val || 0;
        for (let i = 0; i < num; i++) {
            this.rows += 2;
            this.cols += 2;
            this.values.forEach(row => {
                row.unshift(val);
                row.push(val);
            });
            this.values.push(Array(this.cols).fill(val));
            this.values.unshift(Array(this.cols).fill(val));
        }
        return this;
    }
    padTop(num, val) {
        val = val || 0;
        for (let i = 0; i < num; i++) {
            this.rows += 1;
            this.values.unshift(Array(this.cols).fill(val));
        }
        return this;
    }
    padLeft(num, val) {
        val = val || 0;
        for (let i = 0; i < num; i++) {
            this.cols += 1;
            this.values.forEach(row => {
                row.unshift(val);
            });
        }
        return this;
    }
    name(val) {
        this.label = val;
        return this;
    }
    flipX() {
        this.values.reverse();
        return this;
    }
    flipY() {
        this.values.forEach(row => {
            row.reverse();
        });
        return this;
    }
}

class SomethingElse {
    //used for functions that cant be solved by Matrix.map()
    //currently just softmax and dsoftmax
    //also used in maxpool
    constructor(string) {
        this.name = string;
    }
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

class Arrow extends LineFromPoints {
  constructor(x1, y1, x2, y2, thickness) {
    super(x1, y1, x2, y2, thickness);
    this.leftSide = {};
    this.rightSide = {};
    this.point = {};
    this.createArrow();
  }
  createArrow() {
    let l = this.length > this.thickness * 5 ? this.thickness * 5 : this.length / 2;
    this.leftSide = new LineFromAngle(0, 0, l, -30, this.thickness);
    this.leftSide.shape.style.borderRadius = "0 " + this.thickness + "px " + this.thickness + "px 0";
    this.attach(this.leftSide);
    this.rightSide = new LineFromAngle(0, 0, l, 30, this.thickness);
    this.rightSide.shape.style.borderRadius = "0 " + this.thickness + "px " + this.thickness + "px 0";
    this.attach(this.rightSide);
    this.point = new Circle(0, this.thickness / 2, this.thickness / 2);
    this.attach(this.point);
    this.shape.style.borderRadius = this.thickness / 2 + "px";
  }
  set color(string) {
    this.shape.style.backgroundColor = string.toString();
    if (this.leftSide && Object.keys(this.leftSide).length > 0) this.leftSide.shape.style.backgroundColor = string;
    if (this.rightSide && Object.keys(this.rightSide).length > 0) this.rightSide.shape.style.backgroundColor = string;
    if (this.point && Object.keys(this.point).length > 0) this.point.shape.style.backgroundColor = string;
  }
}

class Circle extends Div {
  constructor(x, y, r) {
    super(x, y, r);
    this.type = "circle";
    this.diameter = r * 2;
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

class LoadingBar extends DomObject {
  constructor(x, y, w, h, start, stop, val) {
    super(x, y);
    this.w = w || 100;
    this.h = h || 10;
    this.startVal = start || 0;
    this.stopVal = stop || 100;
    this.currVal = typeof val == "number" ? val : 100;
    this.type = "health";
    this.barShape = document.createElement("div");
    this.shape = document.createElement("div");
    this.isRectangle = true;
    this.callbacks = {};
    this.init();
  }
  init() {
    Object.assign(this.shape.style, {
      position: "absolute",
      height: this.h - 4 + "px",
      width: this.w - 4 + "px",
      border: "solid black 2px",
      top: this.y + "px",
      left: this.x + "px",
    });
    Object.assign(this.barShape.style, {
      position: "absolute",
      height: this.h - 4 + "px",
      width: "0px",
      backgroundColor: "green",
    });
    this.value = this.currVal;
    DOMObjectGlobals.body.appendChild(this.shape);
    this.shape.appendChild(this.barShape);
  }
  set(attr, val) {
    if (this.removed) return;
    this.shape.style[attr] = val;
  }
  setBar(attr, val) {
    if (this.removed) return;
    this.barShape.style[attr] = val;
  }
  set value(val) {
    let oldVal = this.currVal;
    this.currVal = val;
    let percent = (this.currVal - this.startVal) / (this.stopVal === 0 ? 1 : this.stopVal);
    this.setBar("width", (this.w - 4) * percent + "px");
    if (this.type === "health") {
      if (percent > 0.5) {
        this.setBar("backgroundColor", "green");
      } else if (percent > 0.1) {
        this.setBar("backgroundColor", "yellow");
      } else if (percent >= 0) {
        this.setBar("backgroundColor", "red");
      }
    }
    val = Math.floor(val);
    oldVal = Math.floor(oldVal);
    for (let i = 0; i < val - oldVal; i++) {
      if (this.callbacks[oldVal + i]) {
        this.callbacks[oldVal + i]();
      }
    }
  }
  get value() {
    return this.currVal;
  }
  on(val, callback) {
    //if(val<this.startVal || val>this.stopVal) console.error(val + ' is outside this bar\'s scope');
    this.callbacks[val] = callback;
  }
}

class Light extends Circle {
  constructor(x, y, r, rgb) {
    super(x, y, r);
    if (!(rgb instanceof Array)) throw "Light color must be an Array, received" + typeof rgb;
    this.rgb = rgb;
    this.color = "rgb(" + rgb.join(",") + ")";
    this.border = "solid " + "rgb(" + rgb.join(",") + ")" + " 1px";
    this.set("boxShadow", "0 0 5px 5px " + "rgba(" + rgb.join(",") + ",0.7)");
    this.isOn = true;
  }
  toggle(bool) {
    if (typeof bool === "boolean") {
      if (bool) {
        this.turnOn();
      } else {
        this.turnOff();
      }
    } else {
      if (this.isOn) {
        this.turnOff();
      } else {
        this.turnOn();
      }
    }
  }
  turnOn() {
    this.isOn = true;
    this.color = "rgb(" + this.rgb.join(",") + ")";
    this.set("boxShadow", "0 0 5px 5px " + "rgb(" + this.rgb.join(",") + ",0.7)");
  }
  turnOff() {
    this.isOn = false;
    this.color = "rgb(" + darken(this.rgb, 150).join(",") + ")";
    this.set("boxShadow", "");
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

class StyleMaker {
  constructor(type) {
    this.type = type;
    this.default = {
      position: "absolute",
      top: "0px",
      left: "0px",
    };
    this.genStyle();
  }

  genStyle() {
    if (!this.type) return this.default;
    if (this.type === "small") {
      this.default.width = r(width / 19.22) + "px";
      return this.default;
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

    this.friction_coeff = 0.1;
    this.friction_force = {};
    this.hasFriction = false;
    this.hasBounce = false;
    //TODO change to has
    this.bounce_coeff = 0.8;

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
      if (this.dynamicFrictionCheck()) {
        this.friction_force = this.v.copy().mult(this.mass).mult(-this.friction_coeff);
        this.v.add(this.friction_force);
      }
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
          if (thing.isDoingHover) {
            //special case
            thing.cache.doHover.origXY.add(delta_p);
          }
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

  dynamicFrictionCheck() {
    //can be changed to only apply friction in some areas of the place;
    return this.hasFriction;
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
      this.v.x = this.hasBounce ? this.v.x * -1 * this.bounce_coeff : 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.y + paddingy > this.maxbounds.y) {
      this.p.y = this.maxbounds.y - paddingy;
      this.v.y = this.hasBounce ? this.v.y * -1 * this.bounce_coeff : 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.x - paddingx < this.minbounds.x) {
      this.p.x = this.minbounds.x + paddingx;
      this.v.x = this.hasBounce ? this.v.x * -1 * this.bounce_coeff : 0;
      if (this.isFragile) this.kill();
    }
    if (this.p.y - paddingy < (this.hasNoSkyBox ? -3000 : this.minbounds.y)) {
      this.p.y = this.minbounds.y + paddingy - (this.hasNoSkyBox ? 3000 : 0);
      this.v.y = this.hasBounce ? this.v.y * -1 * this.bounce_coeff : 0;
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

  doMoveTo(vector, force = this.MAX_F) {
    if (!this.isDoingMoveTo) {
      if (!(vector instanceof Vector)) {
        console.error(`${this.name} expects a vector for .doMoveTo(), recieved ${typeof vector}`);
        return;
      }
      this.cache.doMoveTo = {};
      let checkTarget = vector.copy();
      if (!this.hasNoBounds) {
        //if the target is further out than the bounds allow, this subroutine will never end.
        let paddingx = 0;
        let paddingy = 0;
        if (this.hasSprite) {
          paddingx = Math.ceil(this.sprite.width / 2);
          paddingy = Math.ceil(this.sprite.height / 2);
          if (paddingy === undefined || paddingx === undefined) console.error("issue with " + this.name + "'s sprite");
        }
        if (checkTarget.x + paddingx > this.maxbounds.x) {
          checkTarget.x = this.maxbounds.x - paddingx;
        }
        if (checkTarget.y + paddingy > this.maxbounds.y) {
          checkTarget.y = this.maxbounds.y - paddingy;
        }
        if (checkTarget.x - paddingx < this.minbounds.x) {
          checkTarget.x = this.minbounds.x + paddingx;
        }
        if (checkTarget.y - paddingy < (this.hasNoSkyBox ? -3000 : this.minbounds.y)) {
          checkTarget.y = this.minbounds.y + paddingy;
        }
      }
      this.cache.doMoveTo.target = checkTarget;
      this.cache.doMoveTo.force = force;
      this.isDoingMoveTo = true;
      return {
        then: (fn) => {
          this.cache.doMoveTo.callback = fn;
        },
      };
    }
    let config = this.cache.doMoveTo;
    let dist = this.p.dist(config.target);
    if (dist > Math.max(this.width, 20)) {
      let targetVec = config.target.copy().sub(this.p);
      let steer = targetVec.sub(this.v).normalize().mult(config.force);
      this.forces.push(steer);
    } else if (dist > 2) {
      let targetVec = config.target.copy().sub(this.p);
      this.v = targetVec;
    } else {
      //so theres no bouncing, the last few pixels can be skipped
      this.p = config.target.copy();
      this.v.clear();
      this.isDoingMoveTo = false;
      let callback = undefined;
      if (typeof config.callback === "function") callback = config.callback;
      delete this.cache.doMoveTo;
      if (callback) callback();
    }
  }
  stopMoveTo() {
    if (this.isDoingMoveTo) {
      let config = this.cache.doMoveTo;
      this.v.clear();
      this.isDoingMoveTo = false;
      let callback = undefined;
      if (typeof config.callback === "function") callback = config.callback;
      delete this.cache.doMoveTo;
      if (callback) callback();
    }
  }
  doSlowedMoveTo(vector, force) {
    //similar to moveto, but slows down to a stop rathen than just abruplty stops
    //is more coomputationally expensive tho.
    if (!this.isDoingSlowedMoveTo) {
      if (!(vector instanceof Vector)) {
        console.error(`${this.name} expects a vector for .doSlowedMoveTo(), recieved ${typeof vector}`);
        return;
      }
      this.cache.doSlowedMoveTo = {};
      let checkTarget = vector.copy();
      if (!this.hasNoBounds) {
        //if the target is further out than the bounds allow, this subroutine will never end.
        let paddingx = 0;
        let paddingy = 0;
        if (this.hasSprite) {
          paddingx = Math.ceil(this.sprite.width / 2); //some issues happen if it hits exactly on the padding and its rounded down
          paddingy = Math.ceil(this.sprite.height / 2);
          if (paddingy === undefined || paddingx === undefined) console.error("issue with " + this.name + "'s sprite");
        }
        if (checkTarget.x + paddingx > this.maxbounds.x) {
          checkTarget.x = this.maxbounds.x - paddingx;
        }
        if (checkTarget.y + paddingy > this.maxbounds.y) {
          checkTarget.y = this.maxbounds.y - paddingy;
        }
        if (checkTarget.x - paddingx < this.minbounds.x) {
          checkTarget.x = this.minbounds.x + paddingx;
        }
        if (checkTarget.y - paddingy < (this.hasNoSkyBox ? -3000 : this.minbounds.y)) {
          checkTarget.y = this.minbounds.y + paddingy;
        }
      }
      this.cache.doSlowedMoveTo.target = checkTarget;
      this.cache.doSlowedMoveTo.distance = this.p.dist(checkTarget);
      this.cache.doSlowedMoveTo.force = this.cache.doSlowedMoveTo.force = force || this.MAX_F;
      this.isDoingSlowedMoveTo = true;
      return {
        then: (fn) => {
          this.cache.doSlowedMoveTo.callback = fn;
        },
      };
    }
    let config = this.cache.doSlowedMoveTo;
    let dist = this.p.dist(config.target);
    if (dist > config.distance / 1.5) {
      let targetVec = config.target.copy().sub(this.p);
      let steer = targetVec.sub(this.v).normalize().mult(config.force);
      this.forces.push(steer);
    } else if (dist >= this.MAX_V / 2) {
      let targetVec = config.target.copy().sub(this.p);
      let t = (dist * 2) / this.v.mag;
      let force = 2 * (dist / t ** 3 - this.v.mag / t);
      let steer = targetVec.normalize().mult(force);
      this.forces.push(steer);
    } else if (dist > 2) {
      let targetVec = config.target.copy().sub(this.p);
      targetVec.normalize();
      this.v = targetVec.copy();
    } else {
      //so theres no bouncing, the last few pixels can be skipped
      this.p = config.target.copy();
      this.v.clear();
      this.isDoingSlowedMoveTo = false;
      let callback = undefined;
      if (typeof config.callback === "function") callback = config.callback;
      delete this.cache.doSlowedMoveTo;
      if (callback) callback();
    }
  }
  stopSlowedMoveTo() {
    if (this.isDoingSlowedMoveTo) {
      let config = this.cache.doSlowedMoveTo;
      this.v.clear();
      this.isDoingSlowedMoveTo = false;
      let callback = undefined;
      if (typeof config.callback === "function") callback = config.callback;
      delete this.cache.doSlowedMoveTo;
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

    this.isPoweringUp = false;
    this.power = 0;
    this.jumpMult = 30;
    this.isFacingRight = true;
    this.isShielded = false;
    this.isCurrentlyJumping = false;
    this.powerType = "explosion";
    this.name = name;
    this.subroutines = this.subroutines.concat(["Land", "Jump"]);

    this.interruptSparHop = false;
    this.isDoingLand = true;
    this.isDoingJump = false;
    this.jumpQueue = [];
    //jump queue should contain a value that is a object, with a value property descripbing the jump amount, and an event property describing who sent the queue
    this.isDoingSparHop = false;

    this.landing_emitter = new EventEmitter();
    this.unsub_landing_emmitter = this.landing_emitter.subscribe("land", this.emitLanding.bind(this));

    this.shieldTime = 8000;

    this.deathImage = {};
    this.deathImageTime = 800;
    this.shieldImage = {};
    this.projectileOffsetHeight = 0;

    this.scale = 1; //TODO add scaling as a method
    this.attackScale = 1;
  }
  addDeathImage(image) {
    if (image instanceof HTMLElement) this.deathImage = image;
  }
  get hasDeathImage() {
    return this.deathImage instanceof HTMLElement;
  }
  addShieldImage(image) {
    if (image instanceof HTMLElement) {
      this.shieldImage = image;
      this.shieldImage.style.zIndex = this.sprite.zIndex + 1;
    } else if (image instanceof DomObject) {
      this.shieldImage = image.shape;
      this.shieldImage.style.zIndex = this.sprite.zIndex + 1;
    }
  }
  get hasShieldImage() {
    return this.shieldImage instanceof HTMLElement;
  }
  faceRight() {
    if (!this.isFacingRight) {
      this.isFacingRight = true;
      if (this.hasSprite) this.sprite.flip("right");
    }
  }
  faceLeft() {
    if (this.isFacingRight) {
      this.isFacingRight = false;
      if (this.hasSprite) this.sprite.flip("left");
    }
  }
  turnAround() {
    if (this.isFacingRight) {
      this.faceLeft();
    } else {
      this.faceRight();
    }
  }

  async sparHop(val) {
    if (this.isDoingSparHop || this.isDoingJump) return;
    if (this.dead) return;
    val = val || 1;
    return new Promise((resolve) => {
      this.doJump(val);
      this.isDoingSparHop = true;
      let unsub = this.landing_emitter.subscribe("land", () => {
        unsub();
        if (this.interruptSparHop) {
          //needed to interrupt it
          //sparhop interupted, dont jump back
          resolve();
          this.interruptSparHop = false;
          this.isDoingSparHop = false;
        } else {
          //sparhop continues to jump back
          //oh no we're still jumping tho cause of something else
          this.jumpQueue.push({ event: "sparhopjumpback", value: -1 * val });
          let jumpBackUnsub = this.landing_emitter.subscribe("sparhopjumpback", () => {
            jumpBackUnsub();
            // console.log('JUMP BACK')
            let jumpBackLandUnsub = this.landing_emitter.subscribe("land", () => {
              this.isDoingSparHop = false;
              jumpBackLandUnsub();
              resolve();
            });
          });
        }
      });
    });
  }

  hop() {
    if (this.dead) return;
    this.jumpUp(0.5);
  }
  jumpUp(val) {
    if (this.dead) return;
    if (!val) val = 1;
    if (!this.isDoingJump) {
      this.doJump(val, 0);
    }
  }

  doJump(val, angle) {
    if (this.dead) return;
    if (this.isCurrentlyJumping) return;
    if (this.isDoingJump) {
      this.isCurrentlyJumping = true;
      let yval = this.jumpMult * -0.8;
      let xval = this.isFacingRight ? 10 : -10;
      // console.log('commiting the jump',this.cache.doJump)
      let config = this.cache.doJump;
      if (config.val) {
        if (config.angle === undefined) {
          yval *= Math.abs(config.val);
          xval *= config.val / 2;
          this.forces.push(new Vector(xval, yval));
        } else {
          this.forces.push(Vector.fromAngle(config.angle).mult(config.val));
        }
      }
      // console.log(this.forces[1])
      let unsub = this.landing_emitter.subscribe("land", () => {
        if (this.jumpQueue.length) {
          let lastVal = this.jumpQueue.shift();
          // console.log('landed and have a jump in the queue', lastVal)
          this.doJump(lastVal.value, lastVal.angle);
          this.landing_emitter.emit(lastVal.event);
        }
        unsub();
      });
      delete this.cache.doJump;
      this.isDoingJump = false;
      return;
    } else {
      if (!val) val = 1;
      // console.log('jump scheduled')
      this.isDoingJump = true;
      this.cache.doJump = {};
      this.cache.doJump.val = val;
      this.cache.doJump.angle = angle;
    }
  }
  jumpWithAngle(theta, force) {
    if (!force) force = 1;
    if (this.dead) return;
    this.doJump(force, theta);
  }

  jumpRight(val) {
    if (this.dead) return;
    this.faceRight();
    this.doJump(val);
  }

  jumpLeft(val) {
    if (this.dead) return;
    this.faceLeft();
    this.doJump(val);
  }

  emitLanding() {
    this.isCurrentlyJumping = false;
    this.v.x = 0;
  }

  shield(shieldTime = 8000, isStatic = true, offset = new Vector((this.width * this.scale) / 4, this.p.y), overrideScale = 1) {
    if (this.isShielded) return;
    if (!this.hasShieldImage) return;
    this.isShielded = true;
    this.shieldTime = shieldTime;
    let shield = new Img(this.shieldImage.cloneNode(), this.p.x + (this.isFacingRight ? offset.x : -offset.x), this.p.y, this.width * this.scale * overrideScale).fromCenter();
    if (!isStatic) {
      let shieldObj = new Flyer(this.p.x, this.p.y, "shield");
      shieldObj.hasNoBounds = true;
      shield.onLoad(() => {
        shieldObj.addSprite(shield);
        this.addAttachment(shieldObj, offset);
      });
    }
    if (this.hasSprite) shield.zIndex = this.sprite.zIndex + 1;
    setTimeout(() => {
      this.isShielded = false;
      if (!isStatic) {
        this.detachAttachment("shield");
      }
      shield.remove();
    }, this.shieldTime);
  }

  powerUp(num, power = this.powerType, customOffset) {
    if (this.dead) return;
    if (typeof num !== "number") {
      num = 1;
    }
    if (!this.isPoweringUp) {
      if (!customOffset) {
        let offsetHeight = this.projectileOffsetHeight || (this.height / 5 + this.height / -2) * this.scale;
        customOffset = this.isFacingRight ? new Vector((this.width * this.scale) / 3, offsetHeight) : new Vector((this.width * this.scale) / -3, offsetHeight);
      }
      this.isPoweringUp = true;
      if (this.attachments[power] !== undefined) {
        this.attachments[power].kill();
        delete this.attachments[power];
      }
      let sprite_width = (width / 19.22) * this.scale * this.attackScale;
      let attack = new Flyer(this.p.x + (this.isFacingRight ? this.width / 4 : this.width / -4), this.p.y - sprite_width + this.height / 2, power);
      attack.power = num;
      attack.hasNoBounds = true;
      let atkname = power;
      let attack_sprite = new Img(getImage(atkname).cloneNode(), attack.x < 0 ? 0 : attack.x, attack.y, sprite_width).fromCenter().onLoad(() => {
        attack.addSprite(attack_sprite);
        attack_sprite.set("will-change", "top,width,left");
        attack_sprite.zIndex = this.sprite.zIndex + 2;
        if (this.isFacingRight) {
          attack.faceRight();
        } else {
          attack.faceLeft();
        }
        this.addAttachment(attack, customOffset);
        attack.doHover();
      });
    } else {
      if (checkObj(this.attachments[power])) {
        let atk = this.attachments[power];
        atk.width += (this.width * this.scale) / 10;
        // atk.x -= (this.width * this.scale) / 50;
        atk.y -= (this.width * this.scale) / 15;
        atk.power += num;
      }
    }
  }

  shoot(power) {
    power = power || this.powerType;
    if (!this.attachments[power]) {
      power = this.attachmentList[0];
    }
    if (this.isPoweringUp && this.attachments[power]) {
      this.isPoweringUp = false;
      let atk = this.detachAttachment(power);
      if (atk) {
        atk.stopHover();
        atk.forces.push(new Vector(this.isFacingRight ? atk.width / 4 : -atk.width / 4, 0));
        return atk;
      } else {
        return undefined;
      }
    }
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

class Flyer extends Character {
  constructor(x, y, name) {
    super(x, y, name);
    this.maxbounds = { x: width, y: height };
    this.forces = [];

    this.subroutines = this.subroutines.concat(["Oscillate", "Hover", "Orbit", "FlyTo"]);
    this.isDoingHover = false;
    this.isDoingOscillate = false;
    this.isDoingOrbit = false;
    this.isDoingFlyTo = false;
    this.isDoingLand = false;
  }

  doHover(force = 0.8, limit = this.h / 4) {
    if (this.dead) return;
    if (!this.isDoingHover) {
      this.isDoingHover = true;
      this.cache.doHover = {};
      this.cache.doHover.forces = this.forces;
      this.cache.doHover.origXY = this.p.copy();
      this.forces = [];
      this.cache.doHover.hoverForce = force;
      this.cache.doHover.hoverLimit = limit;
      this.forces.push(new Vector(0, -force));
      return {
        then: (fn) => {
          this.cache.doHover.callback = fn;
        },
      };
    }
    let config = this.cache.doHover;
    if (this.p.y - config.origXY.y < -config.hoverLimit) {
      this.y = config.origXY.y - config.hoverLimit;
      this.forces.push(new Vector(0, config.hoverForce));
    } else if (this.p.y - config.origXY.y > config.hoverLimit) {
      this.y = config.origXY.y + config.hoverLimit;
      this.forces.push(new Vector(0, -config.hoverForce));
    }
  }
  stopHover() {
    if (!this.isDoingHover) return;
    let config = this.cache.doHover;
    this.forces = config.forces;
    this.v.clear();
    this.p = config.origXY;
    this.isDoingHover = false;
    let callback = undefined;
    if (typeof config.callback === "function") callback = config.callback;
    delete this.cache.doHover;
    if (callback) callback();
  }
  doOscillate(target) {}
  stopOscillate() {}
  doOrbit(target, speed) {
    if (!this.isDoingOrbit) {
      this.cache.doOrbit = {};
      this.cache.doOrbit.forces = this.forces;
      this.cache.doOrbit.origXY = this.p.copy();
      this.cache.doOrbit.target = target.copy();
      this.cache.doOrbit.origDist = this.p.dist(target.copy());
      this.cache.doOrbit.speed = speed;
      this.forces = [];
      let force = target.copy().sub(this.p).perp().set(speed);
      this.v = force;
      this.isDoingOrbit = true;
    } else {
      let config = this.cache.doOrbit;
      let target = config.target;
      let dir = target.copy().sub(this.p);
      // this.p = target.copy().add(dir).set(config.origDist);
      let force = dir
        .copy()
        .perp()
        .sub(dir.copy().mult((config.origDist - dir.mag) / config.origDist))
        .set(config.speed)
        .mult(0.95);
      this.v = force;
    }
  }
  stopOrbit() {
    if (!this.isDoingOrbit) return;
    this.isDoingOrbit = false;
    delete this.cache.doOrbit;
  }
  doFlyTo(target, max_v) {
    if (!this.isDoingFlyTo) {
      if (target instanceof Vector) {
        this.cache.doFlyTo = {};
        this.cache.doFlyTo.target = target.copy();
        this.cache.doFlyTo.max_v = max_v || this.MAX_V;
      } else {
        console.error(this.name + " cant .doFlyTo() to a", target);
      }
      this.isDoingFlyTo = true;
      return {
        then: (fn) => {
          this.cache.doFlyTo.callback = fn;
        },
      };
    } else {
      let config = this.cache.doFlyTo;
      let dir = config.target.copy().sub(this.p);
      let distX = Math.abs(dir.x);
      let dist = config.target.dist(this.p);
      if (dist > 120 && distX > 20) {
        let target = {};
        if (FAKE_RANDOM_ACTIVATED) {
          target = new Vector(dir.x, dir.y - (128 - getFakeRandomInt()) * 4);
        } else {
          target = new Vector(dir.x, dir.y - getRandom(-1) * 500);
        }
        let steer = target.copy().sub(this.v).set(config.max_v);
        this.addForce(steer);
      } else if (dist <= 120 && dist > 5 && distX > 20) {
        let target = new Vector(dir.x, dir.y);
        let steer = target.copy().sub(this.v);
        this.addForce(steer);
      } else if (dist <= 5 && dist > 2 && distX > 20) {
        this.v = new Vector(dir.x, dir.y);
      } else if (distX <= 20 && dist > 5) {
        let target = {};
        if (FAKE_RANDOM_ACTIVATED) {
          target = new Vector(dir.x, dir.y - (128 - getFakeRandomInt()) / 4);
        } else {
          target = new Vector(dir.x + getRandom(-1) * 40, dir.y);
        }
        let steer = target.copy().sub(this.v).set(config.max_v);
        this.addForce(steer);
      } else {
        this.v.clear();
        this.isDoingFlyTo = false;
        let callback = undefined;
        this.x = this.cache.doFlyTo.target.x;
        this.y = this.cache.doFlyTo.target.y;
        if (typeof config.callback === "function") callback = config.callback;
        delete this.cache.doFlyTo;
        if (callback) callback();
      }
    }
  }
  steerTo(vector) {
    let target = vector.copy().sub(this.p);
    target.add(new Vector(Math.random() / 10, Math.random() / 10));
    target.set(this.MAX_F);
    let steer = target.copy().sub(this.v);
    if (target.x >= 0) {
      this.faceRight();
    } else {
      this.faceLeft();
    }
    this.forces.push(steer);
  }
  pathTo(vector) {
    let target = vector.copy().sub(this.p);
    target.limit(this.MAX_F);
    if (target.x >= 0) {
      this.faceRight();
    } else {
      this.faceLeft();
    }
    this.forces.push(target);
  }
}



class EventEmitter{
    constructor(){
        this.events = {}
    }
    subscribe(eventName, fn){
        if(!this.events[eventName]){
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
        return ()=>{
            this.events[eventName] = this.events[eventName].filter(eventFn=>fn!== eventFn)
        }
    }
    done(fn){
        if(!this.events.done){
            this.events.done = {};
        }
        this.events.done = fn;
    }
    emit(eventName, data){
        const event = this.events[eventName];
        if(event){
            event.forEach(fn=>{
                fn.call(null, data);
            })
        }
    }
    emitDone(data){
        const event = this.events.done;
        if(event){
                event.call(null,data);
        }
        delete this.events.done;
    }
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

  drawPoints() {
    this.drawn = true;
    if (this.isRectangle) {
      this.points = [
        new Div(this.a.x, this.a.y).asOutline("aqua").fromCenter(),
        new Div(this.b.x, this.b.y).asOutline("blue").fromCenter(),
        new Div(this.c.x, this.c.y).asOutline("cyan").fromCenter(),
        new Div(this.d.x, this.d.y).asOutline("darkred").fromCenter(),
      ];
      this.points[0].label = "a";
      this.points[1].label = "b";
      this.points[2].label = "c";
      this.points[3].label = "d";
    } else {
      this.points = [new Div(this.a.x, this.a.y).asOutline("aqua"), new Circle(this.a.x, this.a.y, this.radius).asOutline("red")];
      this.points[0].label = "a";
      this.points[1].label = "radius";
    }
  }

  hidePoints() {
    if (this.points.length) {
      this.points.forEach((point) => {
        point.remove();
      });
      this.points = [];
    }
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
    this.draw();
  }

  modWidth(val) {
    this.w += val;
    this.c.x += val;
    this.d.x += val;
    this.draw();
  }

  get vMiddle() {
    //returns a much thinner hitbox that has the same height, but a tiny width,
    // making it easier to check when something hits the middle of an object
    return new Hitbox((this.x + this.x2) / 2 - 3, this.y, 6, this.h);
  }
  get vMiddleTall() {
    //returns a much thinner hitbox that has the same height, but a tiny width,
    // making it easier to check when something hits the middle of an object
    // this one returns a hitbox that is essentially an x check
    return new Hitbox((this.x + this.x2) / 2 - 3, 0, 6, window.innerHeight);
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
    if (this.points) {
      this.draw();
    }
    return this;
  }

  draw() {
    this.points.forEach((p) => {
      let l = p.label;
      p.moveTo(this[l]);
    });
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
    if (this.isDrawn) {
      this.draw();
    }
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
    if (this.isDrawn) this.draw();
    return this;
  }
}



class FallingImg extends Character{
    constructor(x,y,name,fallSpeed,killOnFall){
        super(x,y,name)
        this.fallSpeed = fallSpeed || 1;
        this.subroutines = this.subroutines.concat('Fall')
        this.isDoingFall = false;
        if(killOnFall){
            let unsub = this.landing_emitter.subscribe('land',()=>{
                this.kill();
                unsub()
            });
        }else{
            let unsub = this.landing_emitter.subscribe('land',()=>{
                this.isDoingFall = false;
                unsub()
            });
        }
    }
    doFall(){
        if(this.isDoingFall){
            this.v = new Vector(0,this.fallSpeed)
        }else{
            this.isDoingFall = true;
            this.isCurrentlyJumping = true;
        }
    }
    static createIcon(image,shapeWidth,shapeHeight,color){
        let img = {}
        return new Promise(resolve=>{
            if(typeof image == 'string'){
                img = new Img(image,-width,-height,width)
                img.width = shapeWidth
                img.onLoad(()=>{
                    img = img.asSquare()
                    img.set('borderRadius',r(width/180)+'px')
                    img.set('backgroundColor','white')
                    img.set('border','solid ' + (color || 'lightblue') + ' ' + r(width/300) + 'px')
                    resolve(img)
                })
            }else if(image instanceof DomObject){
                image.width = shapeWidth
                image.onLoad(()=>{
                    img = img.asSquare()
                    img.set('borderRadius',r(width/180)+'px')
                    img.set('backgroundColor','white')
                    img.set('border','solid ' + (color || 'lightblue') + ' ' + r(width/300) + 'px')
                    resolve(img)
                })
            }else if(image instanceof Node){
                img = new Img(image,-width,-height,width)
                img.width = shapeWidth
                img.onLoad(()=>{
                    img = img.asSquare()
                    img.set('borderRadius',r(width/180)+'px')
                    img.set('backgroundColor','white')
                    img.set('border','solid ' + (color || 'lightblue') + ' ' + r(width/300) + 'px')
                    resolve(img)
                })
            }else{
                console.error(typeof image + ' is not a valid image');
            }
        });
    }
}


