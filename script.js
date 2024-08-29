const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const palette = document.getElementById("palette");
const getColor = () => {
  return _color;
};
const getWidth = () => {
  let w = document.getElementById("lineWidth").value;
  return w;
};
const setColor = (color) => {
  _color = color;
};
let _color = "black";

const ctx = canvas.getContext("2d", { alpha: false });

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let currentStroke;
let prevStrokes = [];
let nextStrokes = [];

function newStroke(x, y) {
  nextStrokes = [];
  return { vectors: [x, y], color: getColor(), width: getWidth() };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    prevStrokes = [];
    clearCanvas();
  }
  if (e.target.id === "save") {
    save();
  }
  if (e.target.id === "load") {
    load();
  }
});

palette.addEventListener("click", (e) => {
  if (e.target.id === "palette") {
    return;
  }
  setColor(e.target.id);
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "lineWidth") {
    currentStroke.width = e.target.value;
  }
});

const draw = (x, y) => {
  if (!isPainting) {
    return;
  }

  x = x - canvasOffsetX;
  ctx.lineTo(x, y);
  currentStroke.vectors.push(x, y);
  ctx.stroke();
};

const startPainting = (x, y) => {
  currentStroke = newStroke(x - canvasOffsetX, y);
  ctx.lineCap = "round";
  ctx.strokeStyle = currentStroke.color;
  ctx.lineWidth = currentStroke.width;
  ctx.lineTo(x - canvasOffsetX, y);
  ctx.stroke();
  isPainting = true;
};

const endPainting = () => {
  isPainting = false;
  prevStrokes.push(currentStroke);
  ctx.stroke();
  ctx.beginPath();
};

function save() {
  localStorage.removeItem("strokes");
  localStorage.setItem("strokes", JSON.stringify(prevStrokes));
}

function load() {
  clearCanvas();
  prevStrokes = JSON.parse(localStorage.getItem("strokes"));
  drawArray(prevStrokes);
}

function drawArray(strokes) {
  strokes.forEach((stroke) => {
    ctx.lineCap = "round";
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    for (let i = 0; i < stroke.vectors.length; i += 2) {
      ctx.lineTo(stroke.vectors[i], stroke.vectors[i + 1]);
    }
    ctx.stroke();
    ctx.beginPath();
  });
}

function handleClick(e, cb) {
  cb(e.clientX, e.clientY);
}

function handleTouch(e, cb) {
  //get average coords
  let x = 0;
  let y = 0;
  for (let i = 0; i < e.touches.length; i++) {
    x += e.touches[i].clientX;
    y += e.touches[i].clientY;
  }
  x = parseInt(x / e.touches.length);
  y = parseInt(y / e.touches.length);
  cb(x, y);
}

canvas.addEventListener("mousedown", (e) => {
  handleClick(e, startPainting);
});

canvas.addEventListener("mousemove", (e) => {
  handleClick(e, draw);
});

canvas.addEventListener("mouseup", endPainting);

canvas.addEventListener("touchstart", (e) => {
  handleTouch(e, startPainting);
});

canvas.addEventListener("touchmove", (e) => {
  handleTouch(e, draw);
});

canvas.addEventListener("touchend", endPainting);
