const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

/**
 * @typedef {{p: number[][], c: string, w: number}} Line
 * @type {Line[]}
 */
var data = [];
/** @type {Line} */
var currLine = null;
var lastEdit = Date.now();
var state = {
  sw: 1,
  c: "#000000"
};

canvas.addEventListener("mousedown", function(ev) {
  currLine = {
    c: state.c,
    w: state.sw,
    p: [[ev.clientX, ev.clientY]]
  };
  data.push(currLine);
});
canvas.addEventListener("mousemove", function(ev) {
  if (currLine) {
    currLine.p.push([ev.clientX, ev.clientY]);
    lastEdit = Date.now();
  }
});

on(canvas, "mouseup mouseleave", function() {
  currLine = null;
});

function render() {
  if (lastEdit < Date.now() - 3000) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var line of data) {
    if (line.p.length == 0) continue;

    ctx.beginPath();
    ctx.moveTo(line.p[0][0], line.p[0][1]);
    ctx.strokeStyle = line.c;
    ctx.lineWidth = line.w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (var i = 1; i < line.p.length; i++) {
      ctx.lineTo(line.p[i][0], line.p[i][1]);
    }

    ctx.stroke();
  }
}

function _r() {
  render();
  requestAnimationFrame(_r);
}
_r();

function _w() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  lastEdit = Date.now();
}
on(window, "resize", _w);
_w();

function updateValues() {
  document.querySelectorAll("[valueof]").forEach(function(el) {
    el.textContent = state[el.getAttribute("valueof")].toString();
  });
}

document.addEventListener("keypress", function(ev) {
  switch (ev.keyCode) {
    // plus
    case 61:
      state.sw += 1;
      break;

    // minus
    case 45:
      state.sw = Math.max(1, state.sw - 1);
      break;

    // c
    case 99:
    case 67:
      var c = document.createElement("input");
      c.type = "color";
      c.value = state.c;
      c.onchange = function(ev) {
        state.c = c.value;
        updateValues();
      };
      c.click();
      c.remove();

    default:
      return;
  }

  updateValues();
});
