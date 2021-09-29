var Width =  600,
// window.innerWidth,
    Height = 600;
var Rows = 8,
    Cols = 8;
var squareSize = Math.floor(Width / Rows);
var Crown, Glow_Crown;

// rgb
var DarkColor = "#000",
    LightColor = "#fff",
		BoardDarkColor = "#000",
		BoardLightColor = "purple",
    Blue = "#85FFBB",
    Grey = "#808080";

function preload() {
  // Crown = loadImage('assets/crown.png');
  // Crown.scale = Crown.width / squareSize;
  // Crown.w = Crown.width / Crown.scale;
  // Crown.h = Crown.height / Crown.scale;
}

Array.prototype.update = function(info, k = false) {
  if (Array.isArray(info)) {
    if (k) console.log(info);
    for (var u = 0; u < info.length; u++) {
      var v = info[u];
      let presentItem = this.find(item => item.m === v.m);
      if (presentItem !== undefined) {
        let index = this.indexOf(presentItem);
        this[index].j = v.j;
      } else {
        this.push(v);
      }
    }
  } else {
    let presentItem = this.find(item => item.m === info.m);
    if (presentItem !== undefined) {
      let index = this.indexOf(presentItem);
      this[index].j = info.j;
    } else {
      this.push(info);
    }
  }
}

Array.prototype.mustJump = function() {
  var jumps = this.map(x => x.m);
  // console.log(jumps)
}

Array.prototype.spot = function(row, col) {
  return this.find(item => item.m.equalsArray([row, col]));
}

Array.prototype.equalsArray = function(array) {
  if (!Array.isArray(array)) return false;
  if (this === array) return true;
  if (this.length !== array.length) return false;
  for (let i = 0; i < array.length; i++) {
    if (this[i] !== array[i]) return false;
  }
  return true;
}

Array.prototype.includesArray = function(array) {
  for (let i = 0; i < this.length; i++) {
    if (this[i].equalsArray(array)) return true;
  }
}

// Object.prototype.clone = function() {
//   var newObj = (this instanceof Array) ? [] : {};
//   for (let i in this) {
//     if (i == 'clone') continue;
//     if (this[i] && typeof this[i] == "object") {
//       newObj[i] = this[i].clone();
//     } else newObj[i] = this[i]
//   } return newObj;
// };

// let clone = Object.assign(Object.create(Object.getPrototypeOf(orig)), orig)