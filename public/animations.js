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
        this.frameRate = (-g.playerArr[this.bomberID].speed * 1.5) + 10;
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
            ctx.drawImage(this.idleObject, 0, 0, this.width, this.height, g.playerArr[this.bomberID].x - 22, g.playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
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
            ctx.drawImage(this.right, this.width*this.ssNum, 0, this.width, this.height, g.playerArr[this.bomberID].x - 22, g.playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
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
            ctx.drawImage(this.left, this.width*this.ssNum, 0, this.width, this.height, g.playerArr[this.bomberID].x - 22, g.playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);

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
            ctx.drawImage(this.up, this.width*(this.ssNum+1), 0, this.width, this.height, g.playerArr[this.bomberID].x - 22, g.playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
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
            ctx.drawImage(this.down, this.width*(this.ssNum+1), 0, this.width, this.height, g.playerArr[this.bomberID].x - 22, g.playerArr[this.bomberID].y - 34, this.width*this.scale, this.height*this.scale);
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