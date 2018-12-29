class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.ball = new Ball(this.canvas.width/2, this.canvas.height-20, 10, "red");
        this.paddle = new Paddle(10, 75, 7, this.canvas, "green");
        this.brickField = new BrickField(6, 8, 75, 20, 10, 30, 30, "blue");

        this.controller = {
            "right": false,
            "left": false
        }

        this.score = {
            'value': 0,
            'font': "16px Arial",
            'color': 'red'
        }

        this.gameState = {
            'win' : 1,
            'lose' : -1,
            'playing' : 0
        }

        this.addListeners();

    }

    //Canvas methods
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    play() {
        this.interval = setInterval(this.loop, 10)
    }

    loop() {
        var state = game.draw()

        switch(state) {
            case game.gameState.win:
                game.win();
                break;
            case game.gameState.lose:
                game.lose();
                break;
            case game.gameState.playing:
                break;
        }
    }

    win() {
        alert("YOU WIN");
        document.location.reload();
        clearInterval(game.interval); // Needed for Chrome to end game
    }

    lose() {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(game.interval); // Needed for Chrome to end game
    }

    draw() {
        this.clearCanvas();
        //Draw the current state
        this.ball.draw(this.ctx);
        this.paddle.draw(this.ctx);

        if(this.brickField.collisionDetection(this.ball)) {
            this.ball.collide();
            this.score.value++;
        }
        this.brickField.draw(this.ctx);

        this.drawScore();

        //Calculate next state
        this.paddle.navigate(this.controller);
        var BallState = this.ball.navigate(this.canvas, this.paddle);

        //Check victory/loss conditions
        if(this.score.value == this.brickField.rowCount*this.brickField.columnCount) {
            return this.gameState.win;
        }


        if(!BallState) {
            return this.gameState.lose;
        } else {
            return this.gameState.playing;
        }
    }

    drawScore() {
        this.ctx.font = this.score.font;
        this.ctx.fillStyle = this.score.color;
        this.ctx.fillText("Score: " + this.score.value, 8, 20);
    }

    //Controller Methods
    addListeners() {
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
    }

    keyDownHandler(e) {
        var key = e.key || e.keyIdentifier
        if(key == "Right" || key == "ArrowRight") {
            game.controller.right = true;
        }
        else if(key == "Left" || key == "ArrowLeft") {
            game.controller.left = true;
        }
    }

    keyUpHandler(e) {
        var key = e.key || e.keyIdentifier
        if(key == "Right" || key == "ArrowRight") {
            game.controller.right = false;
        }
        else if(key == "Left" || key == "ArrowLeft") {
            game.controller.left = false;
        }   
    }
}

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.dx = 2;
        this.dy = -2;

        this.inertia = 0.15;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }


    navigate(canvas, paddle) {
        if(this.x <= this.radius || this.x >= canvas.width - this.radius) {
            this.dx *= -1
        }
        if(this.y <= this.radius) {
            this.dy *= -1
        } else if (this.y + this.dy >= canvas.height - this.radius) {
            //Is coliding with the paddle?
            if(this.x > paddle.x && this.x < paddle.x + paddle.width) {
                //Accelerate ball
                this.dx = this.accelerate(this.dx)
                this.dy = this.accelerate(this.dy)
                console.log(this.dy)
                this.collide();
            } else {
                return false;
            }
        }
        this.x += this.dx;
        this.y += this.dy;
        return true;
    }

    accelerate(speed) {
        return (speed/Math.abs(speed))*((Math.abs(speed)) + this.inertia)
    }

    //TO DO make better collision
    collide() {
        this.dy *= -1;
        this.y+= this.dy;
    }
}

class Paddle {
    constructor(height, width, speed, canvas, color) {
        this.height  = height;
        this.width = width;
        this.speed = speed;
        this.canvas = canvas;
        this.x = (canvas.width - this.width)/2;
        this.y = (canvas.height - this.height);
        this.color = color
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    navigate(controller) {
        if(controller.right && this.x < this.canvas.width-this.width) { 
            this.x += this.speed; 
        }
        if(controller.left && this.x > 0) { 
            this.x -= this.speed;
        }
    }
}

class BrickField {

    constructor(rowCount, columnCount, brickWidth, brickHeight, brickPadding, offsetTop, offsetLeft, color) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.offsetTop = offsetTop;
        this.offsetLeft = offsetLeft;
        this.color = color;

        this.bricks = [];

        for(var c = 0; c < this.columnCount; c++) {
            this.bricks[c] = [];
            for(var r = 0; r < this.rowCount; r++) {
                this.bricks[c][r] = { x : 0, y : 0, status : true};
            }
        }
    }

    draw(ctx) {
        for(var c = 0 ; c < this.columnCount; c++) {
            for(var r = 0; r < this.rowCount; r++) {
                var b = this.bricks[c][r]
                if(b.status) {
                    b.x = (c*(this.brickWidth +this.brickPadding)) + this.offsetTop;
                    b.y = (r*(this.brickHeight + this.brickPadding))+ this.offsetLeft;
                    ctx.beginPath();
                    ctx.rect(b.x, b.y, this.brickWidth, this.brickHeight);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    /**
     * Returns true if ball has colided with the brick
     * @param {Ball} ball
     */
    collisionDetection(ball) {
        for(var c = 0; c < this.columnCount; c++) {
            for(var r = 0; r< this.rowCount; r++) {
                var b = this.bricks[c][r];
                if(b.status) {
                    if(ball.x > b.x && ball.x < b.x + this.brickWidth && ball.y >= b.y && ball.y <= b.y + this.brickHeight) {
                        b.status = 0;
                        return true;
                    }
                }
            }
        }
    return false;
    }
}

var game = new Game("game");
game.play();