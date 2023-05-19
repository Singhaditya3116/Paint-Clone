const activeToolText = document.querySelector("#active-tool");
const brushIcon = document.querySelector("#brush");
const brushColorBtn = document.querySelector("#brush-color");
const brushSizeEl = document.querySelector("#brush-size");
const brushSlider = document.querySelector("#brush-slider");
const bucketColorBtn = document.querySelector("#bucket-color");
const eraser = document.querySelector("#eraser");
const clearCanvasBtn = document.querySelector("#clear-canvas");
const saveStorageBtn = document.querySelector("#save-storage");
const loadStorageBtn = document.querySelector("#load-storage");
const clearStorageBtn = document.querySelector("#clear-storage");
const downloadBtn = document.querySelector("#download");
const {body} = document;

//Global Variables
let currentSize=10;
let bucketColor= "#ffffff";
let brushColor = "#a51dab";
let isBrush = true;
let isMouseDown= false;
let drawnArray = [];

//Setting Canvas.
const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.setAttribute("alt","Drawing Board");
const context = canvas.getContext("2d");


//formatting brush size
function displayBrushSize(){
  let size = currentSize;
  if(size < 10)
  {
    size = `0${size}`;
  }
  brushSizeEl.innerText = size;
}

//Setting Brush Color
brushColorBtn.addEventListener("change",()=>{
  isBrush=true;
  brushColor = `#${brushColorBtn.value}`;
})


//Setting Brush Size
brushSlider.addEventListener("change",()=>{
  currentSize = brushSlider.value;
  displayBrushSize(); 
})

//Setting Background Color
bucketColorBtn.addEventListener("change",()=>{
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
})

// Eraser
eraser.addEventListener("click",() => {
  isBrush=false;
  activeToolText.innerText="Eraser";
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  brushColor = bucketColor;
  currentSize = 50;
})

// Switch to Brush
function switchToBrush(){
  isBrush = true;
  activeToolText.innerText = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  brushColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

function createCanvas(){
  canvas.height = window.innerHeight - 50;
  canvas.width = window.innerWidth;
  context.fillStyle = bucketColor;
  context.fillRect(0,0,canvas.width,canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Get Mouse position.
function getMousePosition(event){
  const boundaries = canvas.getBoundingClientRect();
  return {
    x : event.clientX - boundaries.x,
    y : event.clientY - boundaries.y
  }
}

//Clear Canvas
clearCanvasBtn.addEventListener("click",() => {
  createCanvas();
  drawnArray = [];
  activeToolText.innerText = "Canvas Cleared";

  setTimeout(switchToBrush,1500);
})

//Draw What is stored in draw array
function restoreCanvas(){
  for(let i = 1; i<drawnArray.length; i++){
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x,drawnArray[i - 1].y)
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";

    if(drawnArray[i].brush){  //If it is a brush
      context.strokeStyle = drawnArray[i].color;
    }else{ //If it is eraser
      context.strokeStyle = bucketColor;
    }
    context.lineTo(drawnArray[i].x,drawnArray[i].y);
    context.stroke();
  }
}

// Store drawn lines in drawn array
function storeDrawn(x,y,size,color,brush){
  const line = {
    x,y,size,color,brush
  }
  drawnArray.push(line);
}

//Mouse down
canvas.addEventListener("mousedown",(event) => {
  isMouseDown= true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x,currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = brushColor;
})

//Mouse Move
canvas.addEventListener("mousemove",() => {
  if(isMouseDown){
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x,currentPosition.y);
    context.stroke();
    storeDrawn(currentPosition.x,currentPosition.y,currentSize,brushColor,isBrush);
  }
  else
  {
    storeDrawn(undefined);
  }
})

//Mouse Up
canvas.addEventListener("mouseup",() => {
  isMouseDown = false
})

// Save to LocalStorage
saveStorageBtn.addEventListener("click",() => {
  localStorage.setItem("savedCanvas",JSON.stringify(drawnArray));

  //setting active tool text
  activeToolText.innerText = "Canvas Saved";
  setTimeout(switchToBrush,1500);
})

//load from localStorage
loadStorageBtn.addEventListener("click",() => {
  if(localStorage.getItem("savedCanvas")){
    drawnArray = JSON.parse(localStorage.getItem("savedCanvas"));
    restoreCanvas();

    //setting active tool text
    activeToolText.innerText = "Canvas Loaded";
    setTimeout(switchToBrush,1500);
  }
  else{
    activeToolText.innerText = "No Canvas Found";
    setTimeout(switchToBrush,1500);
  }
})

//clear localStorage
clearStorageBtn.addEventListener("click",() => {
  if(localStorage.getItem("savedCanvas")){
    localStorage.removeItem("savedCanvas");

    //setting active tool text
    activeToolText.innerText = "Local Storage Cleared";
    setTimeout(switchToBrush,1500);
  }
})

//Download Image
downloadBtn.addEventListener("click",() => {
  downloadBtn.href = canvas.toDataURL("image/jpeg",1);
  downloadBtn.download = "paint-example.jpeg";
  //setting active tool text
  activeToolText.innerText = "Image File Saved";
  setTimeout(switchToBrush,1500);
})


createCanvas();

brushIcon.addEventListener("click",switchToBrush);
