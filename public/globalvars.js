let host = false;
// Checks what screen you are on
let gameRunning = false;
let spriteSelectScreen = false;
let selectNumOfPlayers = true;
let gameComplete = false;
let stopMainLoop = false;
let playerOneDead = false;
let playerTwoDead = false;
let playerThreeDead = false;
let playerFourDead = false;
let playerOneX;
let playerOneY;
let playerTwoX;
let playerTwoY;
let playerThreeX;
let playerThreeY;
let playerFourX;
let playerFourY;
let numOfPlayers;
let playersLeft;
let playerScores = {p1: 0, p2: 0, p3: 0, p4: 0};
let gameReset = false;
let startScreenControls = false;
let serverFrameInterval;
// SPRITE VARS
let lastPressed = 'down';
let lastPressed2 = 'ArrowDown';
const ctx = document.getElementById('main-game-board').getContext('2d');
ctx.imageSmoothingEnabled = false;

// Map walls and rocks
var leftWall = new Image();
leftWall.src="./Images/leftWall.png";
var rock = new Image();
rock.src="./Images/rock.png";
var explosion = new Image();
explosion.src="./Images/bombsetc/explosions/bomb2.png"

//Bomb Sprites & vars
let bomb1 = new Image();
let bomb2 = new Image();
let bomb3= new Image();
let bomb4 = new Image();

bomb1.src="./Images/bombsetc/bomb/bomb1.png";
bomb2.src="./Images/bombsetc/bomb/bomb2.png";
bomb3.src="./Images/bombsetc/bomb/bomb3.png";
bomb4.src="./Images/bombsetc/bomb/bomb4.png";


let bombSprites = [bomb1, bomb2, bomb3, bomb4];

//Powerup sprites
let powerUp = new Image();
let speedUp = new Image();
let bombUp = new Image();

powerUp.src="./Images/pups/powerUp.png"
bombUp.src="./Images/pups/bombUp.png"
speedUp.src="./Images/pups/speedUp.png"


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
borderBlue.src="./Images/borders/border-blue.png"
border2Blue.src="./Images/borders/border2-blue.png"
borderRed.src="./Images/borders/border-red.png"
border2Red.src="./Images/borders/border2-red.png"
borderGreen.src="./Images/borders/border-green.png"
border2Green.src="./Images/borders/border2-green.png"

let allTheBorders = {
    p00: border,
    p01: border2,
    p10: borderBlue,
    p11: border2Blue,
    p20: borderRed,
    p21: border2Red,
    p30: borderGreen,
    p31: border2Green
}

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

//Explosion Sprites
let exp1 = new Image();
let exp2 = new Image();
let exp3 = new Image();
let exp4 = new Image();
let exp5 = new Image();

exp1.src="/Images/bombsetc/explosions/bomb1.png"
exp2.src="/Images/bombsetc/explosions/bomb2.png"
exp3.src="/Images/bombsetc/explosions/bomb3.png"
exp4.src="/Images/bombsetc/explosions/bomb4.png"
exp5.src="/Images/bombsetc/explosions/bomb5.png"

//Mineman logo & #player imgs
let minerman = new Image();
let players2 = new Image();
let players3 = new Image();
let players4 = new Image();

minerman.src="/Images/minerman.png"
players2.src="/Images/2p.png"
players3.src="/Images/3p.png"
players4.src="/Images/4p.png"
