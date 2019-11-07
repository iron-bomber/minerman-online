let youHost = false;
let gameRunning = false;
let gameComplete = false;
let stopMainLoop = false;
let playerOneDead = false;
let playerTwoDead = false;
let playerOneX;
let playerOneY;
let playerTwoX;
let playerTwoY;
let numOfPlayers;
let playersLeft;
let playerScores = {p1: 0, p2: 0, p3: 0, p4: 0};
let gameReset = false;
let startScreenControls = false;
// SPRITE VARS
let lastPressed = 'down';
let lastPressed2 = 'ArrowDown';
const ctxTest = document.createElement('canvas');
ctxTest.setAttribute('width', '850');
ctxTest.setAttribute('height', '850');
ctxTest.getContext('2d');
ctxTest.imageSmoothingEnabled = false;
const ctx = document.getElementById('main-game-board').getContext('2d');
ctx.imageSmoothingEnabled = false;

let bombIDs = 0;


//Borders
let border = new Image();
let border2 = new Image();
let borderBlue = new Image();
let border2Blue = new Image();
let borderRed = new Image();
let border2Red = new Image();
let borderGreen = new Image();
let border2Green = new Image();

border.src="./Images/borders/border.png"
border2.src="./Images/borders/border2.png"
borderBlue.src="./Images/borders/borderBlue.png"
border2Blue.src="./Images/borders/border2Blue.png"
borderRed.src="./Images/borders/borderRed.png"
border2Red.src="./Images/borders/border2Red.png"
borderGreen.src="./Images/borders/borderGreen.png"
border2Green.src="./Images/borders/border2Green.png"

//Player one

const p1Left = new Image();
const p1Right = new Image();
const p1Up = new Image();
const p1Down = new Image();
const p1Death = new Image();
let p1Icon = new Image();
let p2Icon = new Image();
let p3Icon = new Image();
let p4Icon = new Image();
let desertBG = new Image();
let startBtn = new Image();



const spriteHeight1 = 50;
const iconWidth = 63;
startBtn.src="./Images/start.png"
desertBG.src="./Images/desert-bg.jpg"
p1Icon.src="./Images/p1/p1Icon.png"
p2Icon.src="./Images/p2/p2Icon.png"
p3Icon.src="./Images/p3/p3WalkDown.png"
p4Icon.src="./Images/p4/p4WalkDown.png"
p1Left.src ="./Images/p1/p1WalkLeft.png";
p1Right.src="./Images/p1/p1WalkRight.png";
p1Up.src="./Images/p1/p1WalkUp.png";
p1Down.src="./Images/p1/p1WalkDown.png";
p1Death.src="./Images/p1/p1Death.png";



//Player two

const spriteHeight2 = 53;
const p2Left = new Image();
const p2Right = new Image();
const p2Up = new Image();
const p2Down = new Image();
const p2Death = new Image();

p2Death.src="./Images/p2/p2Death.png";
p2Left.src ="./Images/p2/p2WalkLeft.png";
p2Right.src="./Images/p2/p2WalkRight.png";
p2Up.src="./Images/p2/p2WalkUp.png";
p2Down.src="./Images/p2/p2WalkDown.png";

//p3
const p3Left = new Image();
const p3Right = new Image();
const p3Up = new Image();
const p3Down = new Image();
const p3Death = new Image();

p3Death.src="./Images/p3/p3Death.png";
p3Left.src ="./Images/p3/p3WalkLeft.png";
p3Right.src="./Images/p3/p3WalkRight.png";
p3Up.src="./Images/p3/p3WalkUp.png";
p3Down.src="./Images/p3/p3WalkDown.png";

//p4
const p4Left = new Image();
const p4Right = new Image();
const p4Up = new Image();
const p4Down = new Image();
const p4Death = new Image();

p4Death.src="./Images/p4/p4Death.png";
p4Left.src ="./Images/p4/p4WalkLeft.png";
p4Right.src="./Images/p4/p4WalkRight.png";
p4Up.src="./Images/p4/p4WalkUp.png";
p4Down.src="./Images/p4/p4WalkDown.png";

let p11
let p12;
let p13;
let p14;
let p15;
let p21;
let p22;
let p23;
let p24;
let p25;
let p31;
let p32;
let p33;
let p34;
let p35;
let p41;
let p42;
let p43;
let p44;
let p45;