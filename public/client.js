
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
let sel;

socket.on('selectYourSprite', () => {
    selectNumOfPlayers = false;
    spriteSelectScreen = true;
    commands();
})
socket.on('spriteSelectScreen', (start) => {
    s = start;
    startLoop();
})

// Server tells client they are host
socket.on('youHost', () => {
    console.log('you are the host')
    host = true;
    commands();
});
let sendDataInterval;
socket.on('bomberDataRequest', () => {
    if (players.indexOf(socket.id) < sel.numOfPlayers){
        bomberData.playerID = players.indexOf(socket.id);
        gameRunning = true;
        commands();
        sendDataInterval = setInterval(() => {
            socket.emit('bomberData', bomberData);
        }, 1000/60);
    }
})

// Server sends updated player array
socket.on('playerArray', playerArray => {
    players = playerArray;
});


socket.on('selectNumOfPlayers', (data) => {
    sel = data;
    selectLoop();
})
// Loop gets started when spriteSelectScreen is emitted by server
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
function drawBorderSelect(player){
        
    if(player.exists == true){
        if(player.position == 1){
            ctx.drawImage(borderBlue, 0, 0, 560, 939, 170, 290, 500, 70);//Top Left
        }
        if(player.position == 2){
            ctx.drawImage(borderBlue, 0, 0, 560, 939, 170, 440, 500, 70);//Top Right
        }
        if(player.position == 3){
            ctx.drawImage(borderBlue, 0, 0, 560, 939, 170, 590, 500, 70);//Bottom Left
        }
    }
}


function selectLoop(){
    ctx.clearRect(0, 0, 850, 850);
    ctx.drawImage(desertBG, 0, 0, 750, 992, 0, 0, 850, 850);

    //Minerman Logo
        ctx.drawImage(minerman, 0, 0, 180, 36, 115, 100, 600, 100);

    //Draw Player# options

        if(players.length >= 2){
            ctx.drawImage(players2, 0, 0, 374, 50, 240, 300, 374, 50)
        }else{
            ctx.globalAlpha = .5;
            ctx.drawImage(players2, 0, 0, 374, 50, 240, 300, 374, 50)
            ctx.globalAlpha = 1;
        }

        if(players.length >= 3){
            ctx.drawImage(players3, 0, 0, 374, 50, 240, 450, 374, 50)
        }else{
            ctx.globalAlpha = .5;
            ctx.drawImage(players3, 0, 0, 374, 50, 240, 450, 374, 50)
            ctx.globalAlpha = 1;
        }

        if(players.length >= 4){
            ctx.drawImage(players4, 0, 0, 374, 50, 240, 600, 374, 50)
        }else{
            ctx.globalAlpha = .5;
            ctx.drawImage(players4, 0, 0, 374, 50, 240, 600, 374, 50)
            ctx.globalAlpha = 1;
        }
    
        //Draw player borders
            drawBorderSelect(sel.p1);

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
        this.idleDecider = 'down';
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
                socket.emit('dropABomb', bomberData.playerID);
            }
        }
        document.onkeyup = function(e){
            if(e.key === "s" || e.key === "S"){
                bomberData.moveDown = false;
                bomberData.lastPressed = 'down'
            }
            if(e.key === "w" || e.key === "W"){
                bomberData.moveUp = false;
                bomberData.lastPressed = 'up';
            }
            if(e.key === "a" || e.key === "A"){
                bomberData.moveLeft = false;
                bomberData.lastPressed = 'left';
            }
            if(e.key === "d" || e.key === "D"){
                bomberData.moveRight = false;
                bomberData.lastPressed = 'right';
            }
        }
    } else if (selectNumOfPlayers) {
        console.log(host)
        if (host) {
            //Sending select character controls to server
            document.onkeypress = function(e){
                if(e.key === "s" || e.key === "S"){
                    console.log('emit s')
                    socket.emit('selectCommands',
                    {
                        key: 's'
                    });
                }
                if(e.key === "w" || e.key === "W"){
                    socket.emit('selectCommands',
                    {
                        key: 'w'
                    });
                }
                if(e.key === "a" || e.key === "A"){
                    socket.emit('selectCommands',
                    {
                        key: 'a'
                    });
                }
                if(e.key === "d" || e.key === "D"){
                    socket.emit('selectCommands',
                    {
                        key: 'd'
                    });
                }
                if(e.keyCode === 32) {
                    socket.emit('selectCommands',
                    {
                        key: 'spacebar',
                    });
                }
            }
        }

    } else if (spriteSelectScreen) {
        if (players.indexOf(socket.id) < sel.numOfPlayers){
            console.log('startscreen input')
            //Sending select character controls to server
            document.onkeypress = function(e){
                if(e.key === "s" || e.key === "S"){
                    console.log('startscreen s')
                    socket.emit('selectingSprite',
                    {
                        key: 's',
                        socketID: socket.id
                    });
                }
                if(e.key === "w" || e.key === "W"){
                    socket.emit('selectingSprite',
                    {
                        key: 'w',
                        socketID: socket.id
                    });
                }
                if(e.key === "a" || e.key === "A"){
                    socket.emit('selectingSprite',
                    {
                        key: 'a',
                        socketID: socket.id
                    });
                }
                if(e.key === "d" || e.key === "D"){
                    socket.emit('selectingSprite',
                    {
                        key: 'd',
                        socketID: socket.id
                    });
                }
                if(e.keyCode === 32) {
                    socket.emit('selectingSprite',
                    {
                        key: 'spacebar',
                        socketID: socket.id
                    });
                }
            }
        }
    }
}

//Updates sprite array
socket.on('lastPressed', (data)=>{
    spriteArr[data.id].lastPressed = data.lp;
})

// socket.on('newBombSprite', (data)=>{
//     let done = 0;
//     let ssNum = 0;
//     let frameRate = 20;
//     let totalFrames = frameRate*5;
//     let frameCounter = 0;
//     let thisInterval = setInterval(()=>{
//         if(done == 13){
//             clearInterval(thisInterval);
//         }
//         if(frameCounter < totalFrames){
//             // console.log(Sprites[ssNum], ssNum)
//             ctx.drawImage(bombSprites[ssNum], 0, 0, 16, 16, data.jGrid*50, data.iGrid*50,  50, 50);
//         }
//         if(frameCounter % frameRate === 0){
//             if(ssNum < 3){
//                 ssNum++;
//             }
//         }
//         if(frameCounter == totalFrames - 1){
//             ssNum=0;
//             frameCounter = 0;
//         }
//         done++;
//         frameCounter++;
//     },230)
// })

//Draws each bomb
function drawBomb(bomb){
    let newBombSprites = [...bombSprites];
    if(bomb.bombframeCounter < bomb.bombtotalFrames){
        ctx.drawImage(newBombSprites[bomb.bombssNum], 0, 0, 16, 16, bomb.jGrid*50, bomb.iGrid*50,  50, 50);
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
                drawBomb(m.bombMap[i][j])
                // ctx.drawImage(bombSprites[3], 0, 0, 16, 16, xCoord, yCoord, 50, 50);
                xCoord += 50;
            } else if (typeof m.bombMap[i][j] === 'number') {
                // ctx.fillStyle = 'green';
                // ctx.fillRect(xCoord, yCoord, 50, 50);
                //explosion orange
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.drawImage(explosion, 0, 0, 16, 16, xCoord, yCoord, 50, 50);
                xCoord += 50;
            } else if(m.bombMap[i][j] === 'bombpower'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.drawImage(powerUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
                xCoord += 50;
            }
            else if(m.bombMap[i][j] === 'extrabomb'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.drawImage(bombUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
                xCoord += 50;
            }
            else if(m.bombMap[i][j] === 'speed'){
                ctx.drawImage(rock, 128, 64, 64, 64, xCoord, yCoord, 50, 50);
                ctx.drawImage(speedUp, 0, 0, 32, 32, xCoord+5, yCoord+5, 40, 40);
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
    m = null;
    playerArr = null;
    m = data.map;
    playerArr = data.players;
})

socket.on('serverFrame', () => {
    mainLoop();
})
socket.on('clearInterval', () => {
    clearInterval(sendDataInterval);
})

socket.on('playerOneDead', (data) => {
    playerOneDead = true;
    playerOneX = data.x;
    playerOneY = data.y;
})
socket.on('playerTwoDead', (data) => {
    playerTwoDead = true;
    playerTwoX = data.x;
    playerTwoY = data.y;
})
socket.on('playerThreeDead', (data) => {
    playerThreeDead = true;
    playerThreeX = data.x;
    playerThreeY = data.y;
})
socket.on('playerFourDead', (data) => {
    playerFourDead = true;
    playerFourX = data.x;
    playerFourY = data.y;
})
socket.on('resetLives', () => {
    for (let i = 0; i < spriteArr.length; i++) {
        spriteArr[i].deathDone = false;
        spriteArr[i].frameCounter = 0;
        spriteArr[i].ssNum = 0;
        spriteArr[i].totalFrames = spriteArr[i].frameRate*8;
    }
    playerOneDead = false;
    playerTwoDead = false;
    playerThreeDead = false;
    playerFourDead = false;
})
socket.on('playerScores', (data) => {
    console.log(
        `Scores:
        Player 1 : ${data.p1} 
        Player 2 : ${data.p2}
        Player 3 : ${data.p3}
        Player 4 : ${data.p4}
         `
        );
})
function mainLoop(){
    if(!sound.songPlaying){
        sound.playGameMusic();
    }

    //Clear canvas
    ctx.clearRect(0, 0, 750, 750);
    drawMap();

    //Death check
    if (playerOneDead) {
        spriteArr[0].drawDeath(playerOneX, playerOneY);
    }
    if (playerTwoDead) {
        spriteArr[1].drawDeath(playerTwoX, playerTwoY);
    }
    if (playerThreeDead) {
        spriteArr[2].drawDeath(playerThreeX, playerThreeY);
    }
    if (playerFourDead) {
        spriteArr[3].drawDeath(playerFourX, playerFourY);
    }

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


class Sound{
    constructor(){
        this.menuMove = new Audio('/public/Sound/menuMove.mp3')
        this.menuMusic = new Audio('/public/Sound/menuMusic.mp3')
        this.gameMusic = new Audio('/public/Sound/gameMusic.mp3')
        this.powerUp = new Audio('/public/Sound/powerUp.mp3')
        this.bombUp = new Audio('/public/Sound/bombUpmp3')
        this.speedUp = new Audio('/public/Sound/speedUp.mp3')
        this.explode = new Audio('/public/Sound/explode.mp3')
        this.songPlaying = false;
    }

    //Menu movement sound
    playMove(){
        this.menuMove.play()
    }

    //Menu Music control
    playMenuMusic(){
        this.menuMusic.play()
    }
    pauseMenuMusic(){
        this.menuMusic.pause()
    }

    //In game music control
    playGameMusic(){

    // this.gameMusic.crossOrigin = 'anonymous';
    let gm = document.getElementById('gameMusic').play();
    gm.volume = .4;
    }
    pauseGameMusic(){
        this.gameMusic.pause()
        this.songPlaying = false;
    }

    //Sound effect control
    playBombUp(){
        this.bombUp.play()
    }
    playPowerUp(){
        this.powerUp.play()
    }
    playSpeedUp(){
        this.speedUp.play()
    }
    playExplode(){
        this.explode.play()
    }
}

let sound = new Sound();

//Sound effect socket.ons
socket.on('explode', ()=>{
    let exp = document.getElementById('explode').play();
    exp.volume = ".8"
})

socket.on('bombUp', ()=>{
    let bomb = document.getElementById('bombUp').play()
    bomb.volume = ".5"
})
socket.on('speedUp', ()=>{
    let speed = document.getElementById('speedUp').play()
    speed.volume = ".5"
})
socket.on('powerUp', ()=>{
    let power = document.getElementById('powerUp').play()
    power.volume = ".5"
})


//Player score socket updates
socket.on('playerScores', (data)=>{
    document.getElementById('p1score').innerHtml = data.p1
    document.getElementById('p2score').innerHtml = data.p2
    document.getElementById('p3score').innerHtml = data.p3
    document.getElementById('p4score').innerHtml = data.p4
})

function pushMe(){
    socket.emit('playerID', socket.id)
}