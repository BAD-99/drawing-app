const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    clearCanvas();
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    ctx.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

const draw = (x, y) => {
  if (!isPainting) {
    return;
  }

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.lineTo(x - canvasOffsetX, y);
  ctx.stroke();
};

const startPainting = (x, y) => {
  isPainting = true;
  startX = x;
  startY = y;
};

const endPainting = () => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
};

function handleClick(e, cb) {
  cb(e.clientX, e.clientY);
}

function handleTouch(e, cb) {
  //get average coords
  console.log(typeof e.touches);
  let x = 0;
  let y = 0;
  for (let i = 0; i < e.touches.length; i++) {
    x += e.touches[i].clientX;
    y += e.touches[i].clientY;
  }
  x = parseInt(x / e.touches.length);
  y = parseInt(y / e.touches.length);
  console.log([x, y]);
  cb(x, y);
}

canvas.addEventListener("mousedown", (e) => {
  handleClick(e, startPainting);
});

canvas.addEventListener("mouseup", endPainting);

canvas.addEventListener("mousemove", (e) => {
  handleClick(e, draw);
});

canvas.addEventListener("touchstart", (e) => {
  handleTouch(e, startPainting);
});

canvas.addEventListener("touchend", endPainting);

canvas.addEventListener("touchmove", (e) => {
  handleTouch(e, draw);
});