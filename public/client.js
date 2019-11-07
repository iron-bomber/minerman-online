let socket = io.connect();
let players = [];

// let bomberData = {
//     moveDown: false,
//     moveLeft: false,
//     moveUp: false,
//     moveRight: false,
//     lastPressed: false,
//     bombDropped: false,
//     playerID: socket.id,
// }

// Start screen stuff
let s;
socket.on('startScreen', (start) => {
    s = start;
    startLoop();
})
socket.on('startControls', (data) => {
    if (!startScreenControls) {
        commands();
        startScreenControls = data;
    }
})

// Server tells client they are host
socket.on('youHost', () => {
    console.log('you are the host')
    youHost = true;
});


socket.on('playerArray', (playerArray) => {
    players = playerArray;
});

// Loop gets started when startScreen is emitted by server
function startLoop(){
    ctx.clearRect(0, 0, 850, 850);
    ctx.drawImage(desertBG, 0, 0, 750, 992, 0, 0, 850, 850);

    //Draw Icons
    drawIcons();

    //Draw player borders
    for(let i = 0; i < 4; i++){
        drawBorder(s[`p${i+1}`], i);
        // s.drawBorder(s.p4)
        
    }    
    //Draw start button
    ctx.drawImage(startBtn, 0, 0, 380, 170, 270, 550, 300, 130);
}
function drawBorder(player, i){    
    if(player.exists == true){
        if(player.position == 1){
            ctx.drawImage(allTheBorders[`p${i}0`], 0, 0, 560, 939, 170, 125, 190, 180);//Top Left
        }
        if(player.position == 2){
            ctx.drawImage(allTheBorders[`p${i}0`], 0, 0, 560, 939, 468, 125, 190, 180);//Top Right
        }
        if(player.position == 3){
            ctx.drawImage(allTheBorders[`p${i}0`], 0, 0, 560, 939, 170, 325, 190, 180);//Bottom Left
        }
        if(player.position == 4){
            ctx.drawImage(allTheBorders[`p${i}0`], 0, 0, 560, 939, 468, 325, 190, 180);//Bottom Right
        }
        if(player.position == 5){
            ctx.drawImage(allTheBorders[`p${i}1`], 0, 0, 940, 560, 268, 545, 320, 140);//Ready button
        }
        if(player.position == 6){
            ctx.drawImage(allTheBorders[`p${i}1`], 0, 0, 940, 560, 268, 545, 320, 140);//Ready button
        }
    }
}

function drawIcons(){
    if(s.sprite1){
        ctx.drawImage(p1Icon, 0, 0, iconWidth, spriteHeight1, 200, 150, 150, 130);
    }else{
        ctx.globalAlpha = .5;
        ctx.drawImage(p1Icon, 0, 0, iconWidth, spriteHeight1, 200, 150, 150, 130);
        ctx.globalAlpha = 1;
    }
    if(s.sprite2){
        ctx.drawImage(p2Icon, 0, 0, iconWidth, spriteHeight2, 505, 150, 150, 130);
    }else{
        ctx.globalAlpha = .5;
        ctx.drawImage(p2Icon, 0, 0, iconWidth, spriteHeight2, 505, 150, 150, 130);
        ctx.globalAlpha = 1;
    }
    if(s.sprite3){
        ctx.drawImage(p3Icon, 0, 0, iconWidth, spriteHeight1, 205, 350, 150, 130);
    }else{
        ctx.globalAlpha = .5;
        ctx.drawImage(p3Icon, 0, 0, iconWidth, spriteHeight1, 205, 350, 150, 130);
        ctx.globalAlpha = 1;
    }
    if(s.sprite4){
        ctx.drawImage(p4Icon, 0, 0, iconWidth, spriteHeight1, 500, 350, 150, 130);
    }else{
        ctx.globalAlpha = .5;
        ctx.drawImage(p4Icon, 0, 0, iconWidth, spriteHeight1, 500, 350, 150, 130);
        ctx.globalAlpha = 1;
    }
}
// ​class Sprite {
//     constructor(left, right, up, down, death, lastPressed, bomberID, height) {
//         this.deathDone = false;
//         this.left = left;
//         this.right = right;
//         this.up = up;
//         this.down = down;
//         this.death = death;
//         this.lastPressed = lastPressed;
//         this.bomberID = bomberID;
//         this.ssNum = 0;
//         this.idleDecider;
//         this.frameCounter = 0;
//         this.width = 64;
//         this.height = height;
//         this.scale = 1.3;
//         this.frameRate = (-playerArr[this.bomberID].speed * 1.5) + 10;
//         this.totalFrames = this.frameRate*8;
//     }

//     drawImgIdle(){
//         switch(this.lastPressed){
//             case "up":
//                 this.idleDecider = this.up;
//                 break;
//             case "down":
//                 this.idleDecider = this.down;
//                 break;
//             case "left":
//                 this.idleDecider = this.left;
//                 break;
//             case "right":
//                 this.idleDecider = this.right;
//                 break;
//         }
//         if(this.frameCounter < this.totalFrames){
//             ctx.drawImage(this.idleDecider, 0, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
//         }
//         if(this.frameCounter === this.totalFrames - 1){
//             this.ssNum=0;
//             this.frameCounter = 0;
//         }
//         this.frameCounter++;
//     }
//     //WALK RIGHT
//     drawImgRight(){
//         if(this.frameCounter < this.totalFrames){
//             ctx.drawImage(this.right, this.width*this.ssNum, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
//         }
//         if(this.frameCounter % this.frameRate === 0){
//             this.ssNum++;
//         }
//         if(this.frameCounter == this.totalFrames - 1){
//             this.ssNum=0;
//             this.frameCounter = 0;
//         }
//         this.frameCounter++;
//     }
//     //WALK LEFT
//     drawImgLeft(){
//         if(this.frameCounter < this.totalFrames){
//             ctx.drawImage(this.left, this.width*this.ssNum, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);

//         }
//         if(this.frameCounter % this.frameRate == 0){
//             this.ssNum++;
//         }
//         if(this.frameCounter == this.totalFrames - 1){
//             this.ssNum=0;
//             this.frameCounter = 0;
//         }
//         this.frameCounter++;
//     }
//     //WALK UP
//     drawImgUp(){
//         if(this.frameCounter < this.totalFrames){
//             ctx.drawImage(this.up, this.width*(this.ssNum+1), 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
//         }
//         if(this.frameCounter % this.frameRate == 0){
//             this.ssNum++;
//         }
//         if(this.frameCounter == this.totalFrames - 1){
//             this.ssNum=0;
//             this.frameCounter = 0;
//         }
//         this.frameCounter++;
//     }
//     //WALK DOWN
//     drawImgDown(){
//         if(this.frameCounter < this.totalFrames){
//             ctx.drawImage(this.down, this.width*(this.ssNum+1), 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
//         }
//         if(this.frameCounter % this.frameRate == 0){
//             this.ssNum++;
//         }
//         if(this.frameCounter == this.totalFrames - 1){
//             this.ssNum=0;
//             this.frameCounter = 0;
//         }
//         this.frameCounter++;
//     }

//     drawDeath(playerX, playerY){
//         this.totalFrames = this.frameRate*12;
//         if(!this.deathDone){
//             if(this.ssNum < 6){
//                 if(this.frameCounter < this.totalFrames){
//                     ctx.drawImage(this.death, this.width*this.ssNum, 0, this.width, this.height, playerX - 22, playerY - 34, this.width*this.scale, this.height*this.scale);
//                 }
//                 }else{
//                     ctx.drawImage(this.death, this.width*5, 0, this.width, this.height, playerX - 22, playerY - 34, this.width*this.scale, this.height*this.scale);
//                 }
//         }
//         if(this.frameCounter % this.frameRate == 0){
//             this.ssNum++;
//         }
//         if(this.frameCounter == this.totalFrames - 1){
//             this.deathDone = true;
//         }
//         this.frameCounter++;
//     }

// }
function commands() {
    if (gameRunning) {
        document.onkeypress = function(e){
            if(e.key === "s" || e.key === "S"){
                bomberData.moveDown = true;
            }
            if(e.key === "w" || e.key === "W"){
                bomberData.moveUp = true;
            }
            if(e.key === "a" || e.key === "A"){
                bomberData.moveLeft = true;
            }
            if(e.key === "d" || e.key === "D"){
                bomberData.moveRight = true;
            }
            // Drop bomb
            if(e.keyCode === 32){
                e.preventDefault();
                bomberData.bombDropped = true;
            }
        }
        document.onkeyup = function(e){
            if(e.key === "s" || e.key === "S"){
                bomberData.moveDown = false;
            }
            if(e.key === "w" || e.key === "W"){
                bomberData.moveUp = false;
            }
            if(e.key === "a" || e.key === "A"){
                bomberData.moveLeft = false;
            }
            if(e.key === "d" || e.key === "D"){
                bomberData.moveRight = false;
            }
        }
    } else {
        document.onkeypress = function(e){
            if(e.key === "s" || e.key === "S"){
                socket.emit('select',
                {
                    key: 's',
                    socketID: socket.id
                });
            }
            if(e.key === "w" || e.key === "W"){
                socket.emit('select',
                {
                    key: 'w',
                    socketID: socket.id
                });
            }
            if(e.key === "a" || e.key === "A"){
                socket.emit('select',
                {
                    key: 'a',
                    socketID: socket.id
                });
            }
            if(e.key === "d" || e.key === "D"){
                socket.emit('select',
                {
                    key: 'd',
                    socketID: socket.id
                });
            }
            if(e.keyCode === 32) {
                socket.emit('select',
                {
                    key: 'spacebar',
                    socketID: socket.id
                });
            }
        }
    }
}
// }

//Draws each bomb
function drawBomb(bomb){
    if(bomb.bombframeCounter < bomb.bombtotalFrames){
        // console.log(bomb.bombSprites[bomb.bombssNum], bomb.bombssNum)
        ctx.drawImage(bomb.bombSprites[bomb.bombssNum], 0, 0, 16, 16, bomb.jGrid*50, bomb.iGrid*50,  50, 50);
    }
    if(bomb.bombframeCounter % bomb.bombframeRate === 0){
        if(bomb.bombssNum < 3){
            bomb.bombssNum++;
        }
    }
    if(bomb.bombframeCounter == bomb.bombtotalFrames - 1){
        bomb.bombssNum=0;
        bomb.bombframeCounter = 0;
    }
    bomb.bombframeCounter++;
}

//Draw explosion

// function drawMap() {

//     var leftWall = new Image();
//     leftWall.src="./Images/leftWall.png";
//     var rock = new Image();
//     rock.src="./Images/rock.png";
//     let xCoord = 0;
//     let yCoord = 0;
//     for(let i = 0; i < m.bombMap.length; i++) {
//         for (let j = 0; j < m.bombMap.length; j++) {
//             if (m.bombMap[i][j] === 'wall') {
//                 ctx.drawImage(rock, 256, 128, 64, 64, xCoord, yCoord, 50, 50);
//                 xCoord += 50;
//             } else if (m.bombMap[i][j] === 'rock') {
//                 ctx.drawImage(rock, 0, 128, 64, 64, xCoord, yCoord, 50, 50);
//                 xCoord += 50;
//             }else if (typeof m.bombMap[i][j] === 'object') {
//                 ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
//                 //bomb Gray
//                 this.drawBomb(m.bombMap[i][j])
//                 xCoord += 50;
//             } else if (typeof m.bombMap[i][j] === 'number') {
//                 // ctx.fillStyle = 'green';
//                 // ctx.fillRect(xCoord, yCoord, 50, 50);
//                 //explosion orange
//                 ctx.fillStyle = '#FF9900';
//                 ctx.fillRect(xCoord, yCoord, 50, 50);
//                 xCoord += 50;
//             } else if(m.bombMap[i][j] === 'bombpower'){
//                 ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
//                 ctx.drawImage(powerUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
                
//                 xCoord += 50;
//             }
//             else if(m.bombMap[i][j] === 'extrabomb'){
//                 ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
//                 ctx.drawImage(bombUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
//                 xCoord += 50;
//             }
//             else if(m.bombMap[i][j] === 'speed'){
//                 ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
//                 ctx.drawImage(speedUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
//                 xCoord += 50;    
//             }
//             else {
//                 ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
//                 xCoord += 50;
//             }
//         }
//         yCoord += 50;
//         xCoord = 0;
//     }
// }
// function createSprite(left, right, up, down, death, lastPressed, bomberID, height) {
//     let theSprite = new Sprite(left, right, up, down, death, lastPressed, bomberID, height);
//     return theSprite
// }

// socket.on('createSprite', (data) => {
//     spriteArr.push(createSprite(data[0], data[1], data[2], data[3], data[4], data[5], data[6], 53));
// })



// let m;
// let playerArr;
// let spriteArr;
// socket.on('createSprite', (data) => {
//     spriteArr.push(createSprite(data[0], data[1], data[2], data[3], data[4], data[5], data[6], 53));
// })
// socket.on('allData', (data) => {
//     m = data[0];
//     playerArr = data[1];
// })
// socket.on('playerOneDead', (data) => {
//     playerOneDead = true;
//     playerOneX = data[0];
//     playerOneY = data[1];
// })
// socket.on('playerTwoDead', (data) => {
//     playerTwoDead = true;
//     playerTwoX = data[0];
//     playerTwoY = data[1];
// })
// socket.on('playerThreeDead', (data) => {
//     playerThreeDead = true;
//     playerThreeX = data[0];
//     playerThreeY = data[1];
// })
// socket.on('playerFourDead', (data) => {
//     playerFourDead = true;
//     playerFourX = data[0];
//     playerFourY = data[1];
// })
// function mainLoop(){
//     //RESETTING THE GAME
//         if (gameComplete === true){
//             commands();
//         }
//     }//END RESETTING
//     //Clear canvas
//     ctx.clearRect(0, 0, 750, 750);
//     drawMap();

//     //Death check
//     if (playerOneDead) {
//         spriteArr[0].drawDeath(playerOneX, playerOneY);
//     }
//     if (playerTwoDead) {
//         spriteArr[1].drawDeath(playerTwoX, playerTwoY);
//     }
//     if (playerThreeDead) {
//         spriteArr[2].drawDeath(playerThreeX, playerThreeY);
//     }
//     if (playerFourDead) {
//         spriteArr[3].drawDeath(playerFourX, playerFourY);
//     }

//     //PLAYER SPRITES
//     ////////////////////////////////////////////////////////////////////////////////////////////
//     ////////////////////////////////////////////////////////////////////////////////////////////
//     ////////////////////////////////////////////////////////////////////////////////////////////

//     for (let i = 0; i < playerArr.length; i++) {
//         if (playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true){
//             spriteArr[i].drawImgUp();
//         }
//         else if (playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveDown == true){
//             spriteArr[i].drawImgDown()
//         }else if  
//             (  playerArr[i].moveLeft == true && playerArr[i].moveRight == true
//             || playerArr[i].moveUp == true && playerArr[i].moveDown == true
//             || playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true && playerArr[i].moveDown == true
//             || playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true && playerArr[i].moveDown == true
//             || playerArr[i].moveLeft == false && playerArr[i].moveRight == false && playerArr[i].moveUp == false && playerArr[i].moveDown == false
//         ){
//             spriteArr[i].drawImgIdle()
//         }
//         else if(playerArr[i].moveLeft == true){
//             spriteArr[i].drawImgLeft()
//         }else if(playerArr[i].moveRight == true){
//             spriteArr[i].drawImgRight()
//         }else if(playerArr[i].moveUp == true){
//             spriteArr[i].drawImgUp()
//         }else if(playerArr[i].moveDown == true){
//             spriteArr[i].drawImgDown()
//         }
//     }
//     if(gameComplete == true){
//         //EVENTUALLY GO TO SCORE SCREEN
//         console.log('happ')
//         ctx.font = "30px Arial";
//         ctx.fillText(`Space to restart :)`, 350, 400);
//         //////
//     }

//     //Loop this function 60fps
//     if(!stopMainLoop){
//         requestAnimationFrame(mainLoop);
//     }
// }// END OF MAIN LOOP
