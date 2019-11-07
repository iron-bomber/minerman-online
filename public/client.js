let socket = io.connect();
let players = [];

let bomberData = {
    moveDown: false,
    moveLeft: false,
    moveUp: false,
    moveRight: false,
    lastPressed: 'down',
    bombDropped: false,
    playerID: socket.id,
}

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

socket.on('bomberDataRequest', () => {
    console.log('sending bomber data');
    bomberData.playerID = players.indexOf(socket.id);
    gameRunning = true;
    commands();
    setInterval(() => {
        socket.emit('bomberData', bomberData);
    }, 1000/60);
})

// Server sends updated player array
socket.on('playerArray', playerArray => {
    players = playerArray;
});

// Loop gets started when startScreen is emitted by server
function startLoop(){
    ctx.clearRect(0, 0, 850, 850);
    ctx.drawImage(desertBG, 0, 0, 750, 992, 0, 0, 850, 850);

    //Draw Icons
    drawIcons();

    //Draw player borders
    for(let i = 3; i >= 0; i--){
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
class Sprite {
    constructor(left, right, up, down, death, lastPressed, bomberID, height) {
        this.deathDone = false;
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
        this.death = death;
        this.lastPressed = lastPressed;
        this.bomberID = bomberID;
        this.ssNum = 0;
        this.idleDecider;
        this.frameCounter = 0;
        this.width = 64;
        this.height = height;
        this.scale = 1.3;
        this.frameRate = 7;
        // this.frameRate = (-playerArr[this.bomberID].speed * 1.5) + 10 ;
        this.totalFrames = this.frameRate*8;
    }

    drawImgIdle(){
        switch(this.lastPressed){
            case "up":
                this.idleDecider = this.up;
                break;
            case "down":
                this.idleDecider = this.down;
                break;
            case "left":
                this.idleDecider = this.left;
                break;
            case "right":
                this.idleDecider = this.right;
                break;
        }
        if(this.frameCounter < this.totalFrames){
            ctx.drawImage(this.idleDecider, 0, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
        }
        if(this.frameCounter === this.totalFrames - 1){
            this.ssNum=0;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }
    //WALK RIGHT
    drawImgRight(){
        if(this.frameCounter < this.totalFrames){
            ctx.drawImage(this.right, this.width*this.ssNum, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
        }
        if(this.frameCounter % this.frameRate === 0){
            this.ssNum++;
        }
        if(this.frameCounter == this.totalFrames - 1){
            this.ssNum=0;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }
    //WALK LEFT
    drawImgLeft(){
        if(this.frameCounter < this.totalFrames){
            ctx.drawImage(this.left, this.width*this.ssNum, 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);

        }
        if(this.frameCounter % this.frameRate == 0){
            this.ssNum++;
        }
        if(this.frameCounter == this.totalFrames - 1){
            this.ssNum=0;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }
    //WALK UP
    drawImgUp(){
        if(this.frameCounter < this.totalFrames){
            ctx.drawImage(this.up, this.width*(this.ssNum+1), 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
        }
        if(this.frameCounter % this.frameRate == 0){
            this.ssNum++;
        }
        if(this.frameCounter == this.totalFrames - 1){
            this.ssNum=0;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }
    //WALK DOWN
    drawImgDown(){
        if(this.frameCounter < this.totalFrames){
            ctx.drawImage(this.down, this.width*(this.ssNum+1), 0, this.width, this.height, playerArr[this.bomberID].x - 22, playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
        }
        if(this.frameCounter % this.frameRate == 0){
            this.ssNum++;
        }
        if(this.frameCounter == this.totalFrames - 1){
            this.ssNum=0;
            this.frameCounter = 0;
        }
        this.frameCounter++;
    }

    drawDeath(playerX, playerY){
        this.totalFrames = this.frameRate*12;
        if(!this.deathDone){
            if(this.ssNum < 6){
                if(this.frameCounter < this.totalFrames){
                    ctx.drawImage(this.death, this.width*this.ssNum, 0, this.width, this.height, playerX - 22, playerY - 34, this.width*this.scale, this.height*this.scale);
                }
                }else{
                    ctx.drawImage(this.death, this.width*5, 0, this.width, this.height, playerX - 22, playerY - 34, this.width*this.scale, this.height*this.scale);
                }
        }
        if(this.frameCounter % this.frameRate == 0){
            this.ssNum++;
        }
        if(this.frameCounter == this.totalFrames - 1){
            this.deathDone = true;
        }
        this.frameCounter++;
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
function commands() {
    if (gameRunning) {
        console.log('now emitting game movements')
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
function drawMap() {
    let xCoord = 0;
    let yCoord = 0;
    for(let i = 0; i < m.bombMap.length; i++) {
        for (let j = 0; j < m.bombMap.length; j++) {
            if (m.bombMap[i][j] === 'wall') {
                ctx.drawImage(rock, 256, 128, 64, 64, xCoord, yCoord, 50, 50);
                xCoord += 50;
            } else if (m.bombMap[i][j] === 'rock') {
                ctx.drawImage(rock, 0, 128, 64, 64, xCoord, yCoord, 50, 50);
                xCoord += 50;
            }else if (typeof m.bombMap[i][j] === 'object') {
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                //bomb Gray
                ctx.fillStyle = '#C0C0C0';
                ctx.beginPath();
                ctx.arc(xCoord + 25, yCoord + 25, 12, 0, 2 * Math.PI);
                ctx.fill();
                xCoord += 50;
            } else if (typeof m.bombMap[i][j] === 'number') {
                // ctx.fillStyle = 'green';
                // ctx.fillRect(xCoord, yCoord, 50, 50);
                //explosion orange
                ctx.fillStyle = '#FF9900';
                ctx.fillRect(xCoord, yCoord, 50, 50);
                xCoord += 50;
            } else if(m.bombMap[i][j] === 'bombpower'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.fillStyle = 'red';
                ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                xCoord += 50;
            }
            else if(m.bombMap[i][j] === 'extrabomb'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.fillStyle = 'cyan';
                ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                xCoord += 50;
            }
            else if(m.bombMap[i][j] === 'speed'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.fillStyle = 'yellow';
                ctx.fillRect(xCoord+15, yCoord+15, 20, 20);
                xCoord += 50;    
            }
            else {
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                xCoord += 50;
            }
        }
        yCoord += 50;
        xCoord = 0;
    }
}

// Sprite stuff
function spriteChooser(){
    console.log('choosing sprites')
    switch (s.p1.position){
        case 1:
            p11 = p1Left;
            p12 = p1Right;
            p13 = p1Up;
            p14 = p1Down;
            p15 = p1Death;
            break;
        case 2:
            p11 = p2Left;
            p12 = p2Right;
            p13 = p2Up;
            p14 = p2Down;
            p15 = p2Death;
            break;
        case 3:
            p11 = p3Left;
            p12 = p3Right;
            p13 = p3Up;
            p14 = p3Down;
            p15 = p3Death;
            break;
        case 4:
            p11 = p4Left;
            p12 = p4Right;
            p13 = p4Up;
            p14 = p4Down;
            p15 = p4Death;
            break;
    }
    switch (s.p2.position){
        case 1:
            p21 = p1Left;
            p22 = p1Right;
            p23 = p1Up;
            p24 = p1Down;
            p25 = p1Death;
            break;
        case 2:
            p21 = p2Left;
            p22 = p2Right;
            p23 = p2Up;
            p24 = p2Down;
            p25 = p2Death;
            break;
        case 3:
            p21 = p3Left;
            p22 = p3Right;
            p23 = p3Up;
            p24 = p3Down;
            p25 = p3Death;
            break;
        case 4:
            p21 = p4Left;
            p22 = p4Right;
            p23 = p4Up;
            p24 = p4Down;
            p25 = p4Death;
            break;
    }
    switch (s.p3.position){
        case 1:
            p31 = p1Left;
            p32 = p1Right;
            p33 = p1Up;
            p34 = p1Down;
            p35 = p1Death;
            break;
        case 2:
            p31 = p2Left;
            p32 = p2Right;
            p33 = p2Up;
            p34 = p2Down;
            p35 = p2Death;
            break;
        case 3:
            p31 = p3Left;
            p32 = p3Right;
            p33 = p3Up;
            p34 = p3Down;
            p35 = p3Death;
            break;
        case 4:
            p31 = p4Left;
            p32 = p4Right;
            p33 = p4Up;
            p34 = p4Down;
            p35 = p4Death;
            break;
    }
    switch (s.p4.position){
        case 1:
            p41 = p1Left;
            p42 = p1Right;
            p43 = p1Up;
            p44 = p1Down;
            p45 = p1Death;
            break;
        case 2:
            p41 = p2Left;
            p42 = p2Right;
            p43 = p2Up;
            p44 = p2Down;
            p45 = p2Death;
            break;
        case 3:
            p41 = p3Left;
            p42 = p3Right;
            p43 = p3Up;
            p44 = p3Down;
            p45 = p3Death;
            break;
        case 4:
            p41 = p4Left;
            p42 = p4Right;
            p43 = p4Up;
            p44 = p4Down;
            p45 = p4Death;
            break;
    }
}

let m;
let playerArr;
let spriteArr = [];
socket.on('chooseSprites', () => {
    spriteChooser();
    createSprites();
})
function createSprites() {
    let player1 = {
        left: p11,
        right: p12,
        up: p13,
        down: p14,
        death: p15,
        playerID: 0
    }
    let player2 = {
        left: p21,
        right: p22,
        up: p23,
        down: p24,
        death: p25,
        playerID: 1
    }
    let player3 = {
        left: p31,
        right: p32,
        up: p33,
        down: p34,
        death: p35,
        playerID: 2
    }
    let player4 = {
        left: p41,
        right: p42,
        up: p43,
        down: p44,
        death: p45,
        playerID: 3
    }
    switch(playerArr.length) {
        case 2:
            spriteArr.push(new Sprite(player1.left, player1.right, player1.up, player1.down, player1.death, 'down', player1.playerID, 53));
            spriteArr.push(new Sprite(player2.left, player2.right, player2.up, player2.down, player2.death, 'down', player2.playerID, 53));
            break;
        case 3:
            spriteArr.push(new Sprite(player1.left, player1.right, player1.up, player1.down, player1.death, 'down', player1.playerID, 53));
            spriteArr.push(new Sprite(player2.left, player2.right, player2.up, player2.down, player2.death, 'down', player2.playerID, 53));
            spriteArr.push(new Sprite(player3.left, player3.right, player3.up, player3.down, player3.death, 'down', player3.playerID, 53));
            break;
        case 4:
            spriteArr.push(new Sprite(player1.left, player1.right, player1.up, player1.down, player1.death, 'down', player1.playerID, 53));
            spriteArr.push(new Sprite(player2.left, player2.right, player2.up, player2.down, player2.death, 'down', player2.playerID, 53));
            spriteArr.push(new Sprite(player3.left, player3.right, player3.up, player3.down, player3.death, 'down', player3.playerID, 53));
            spriteArr.push(new Sprite(player4.left, player4.right, player4.up, player4.down, player4.death, 'down', player4.playerID, 53));
            break;
    }
}

socket.on('allData', (data) => {
    m = data.map;
    playerArr = data.players;
})

socket.on('serverFrame', () => {
    mainLoop();
})
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
function mainLoop(){
    //RESETTING THE GAME
        if (gameComplete){
            commands();
        }
    //END RESETTING
    //Clear canvas
    ctx.clearRect(0, 0, 750, 750);
    drawMap();

    //Death check
    // if (playerOneDead) {
    //     spriteArr[0].drawDeath(playerOneX, playerOneY);
    // }
    // if (playerTwoDead) {
    //     spriteArr[1].drawDeath(playerTwoX, playerTwoY);
    // }
    // if (playerThreeDead) {
    //     spriteArr[2].drawDeath(playerThreeX, playerThreeY);
    // }
    // if (playerFourDead) {
    //     spriteArr[3].drawDeath(playerFourX, playerFourY);
    // }

    //PLAYER SPRITES
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < playerArr.length; i++) {
        if (playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true){
            spriteArr[i].drawImgUp();
        }
        else if (playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveDown == true){
            spriteArr[i].drawImgDown()
        }else if  
            (  playerArr[i].moveLeft == true && playerArr[i].moveRight == true
            || playerArr[i].moveUp == true && playerArr[i].moveDown == true
            || playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true && playerArr[i].moveDown == true
            || playerArr[i].moveLeft == true && playerArr[i].moveRight == true && playerArr[i].moveUp == true && playerArr[i].moveDown == true
            || playerArr[i].moveLeft == false && playerArr[i].moveRight == false && playerArr[i].moveUp == false && playerArr[i].moveDown == false
        ){
            spriteArr[i].drawImgIdle()
        }
        else if(playerArr[i].moveLeft == true){
            spriteArr[i].drawImgLeft()
        }else if(playerArr[i].moveRight == true){
            spriteArr[i].drawImgRight()
        }else if(playerArr[i].moveUp == true){
            spriteArr[i].drawImgUp()
        }else if(playerArr[i].moveDown == true){
            spriteArr[i].drawImgDown()
        }
    }
    // if(gameComplete == true){
    //     //EVENTUALLY GO TO SCORE SCREEN
    //     ctx.font = "30px Arial";
    //     ctx.fillText(`Space to restart :)`, 350, 400);
    //     //////
    // }

    //Loop this function 60fps
}
