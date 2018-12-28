class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext("2d");

        this.ball = new Ball(canvas.width/2, canvas.height-20, 10, "red");
        this.paddle = new Paddle(10, 75, 7, canvas);
        this.brickField = new BrickField(5, 3, 75, 20, 10, 30, 30);

        this.physics = {
            inertia : 0.25
        }

    }

    //Canvas methods
    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    draw() {
        clearCanvas();

        //Draw the current state
        this.ball.draw();
        this.paddle.draw();
        this.brickField.collisionDetection(this.ball);
        this.brickField.draw()

        //drawScore();

        //Calculate next state
        navigateBall();
        navigatePaddle();

        //Continue game
        requestAnimationFrame(draw);
    }
}

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Paddle {
    constructor(height, width, speed, canvas) {
        this.height  = height;
        this.width = width;
        this.speed = speed;
        this.x = (canvas.width - this.width)/2;
        this.y - (canvas.height - this.height);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

class BrickField {

    constructor(rowCount, columnCount, brickWidth, brickHeight, brickPpadding, offsetTop, offsetLeft) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.brickWidth = brickWidth;
        this.brickHeight = brickHeight;
        this.brickPadding = brickPadding;
        this.offsetTop = offsetTop;
        this.offsetLeft = offsetLeft;

        this.bricks = [];

        for(var c = 0; c < this.columnCount; c++) {
            bricks[c] = [];
            for(var r = 0; r < this.rowCount; r++) {
                bricks[c][r] = { x : 0, y : 0, status : true};
            }
        }
    }

    draw(ctx) {
        for(var c = 0 ; c < this.columnCount; c++) {
            for(var r = 0; r < this.rowCount; r++) {
                b = this.bricks[c][r]
                if(b.status) {
                    b.x = (c*(this.brickWidth +this.brickPadding)) + this.brickOffsetLeft;
                    b.y = (r*(this.brickHeight + this.brickPadding))+ this.brickOffsetLeft;
                    ctx.beginPath();
                    ctx.rect(b.x, b.y, brickWidth, brickHeight);
                    ctx.fillStyle = color;
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
                var b = bricks[c][r];
                if(b.status) {
                    if(ball.x > b.x && ball.x < b.x + this.brickWidth && ball.y > b.y && ball.y < b.y + this.brickHeight) {
                        b.status = 0;
                        return true;
                    }
                }
            }
        }
    return false;
    }
}

score++;
if(score == brickRowCount*brickColumnCount) {
    alert("YOU WIN, CONGRATULATIONS!");
    document.location.reload();
}


        function navigateBall() {
            if(x <= ballRadius || x >= canvas.width - ballRadius) {
                dx *= -1
                generateRandomColor()
            }
            if(y <= ballRadius) {
                dy *= -1
                generateRandomColor()
            } else if (y+dy > canvas.height - ballRadius) {
                //Is coliding with the paddle?
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy *= -1;
                    speedModule += 0.25
                    dx = (dx/Math.abs(dx))*speedModule;
                    dy = -speedModule
                } else {
                    alert("GAME OVER");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                }
            }
            x += dx;
            y += dy;
        }

        function generateRandomColor() {
            rgb = []
            for(var i = 0; i < 3; i++) {
                rgb.push(Math.floor((Math.random()*255 +1)));
            }
            color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        }

        //Controler methods
        var rightPressed = false;
        var leftPressed = false;

        function addListeners() {
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
        }

        function keyDownHandler(e) {
            var key = e.key || e.keyIdentifier
            if(key == "Right" || key == "ArrowRight") {
                rightPressed = true;
            }
            else if(key == "Left" || key == "ArrowLeft") {
                leftPressed = true;
            }
        }

        function keyUpHandler(e) {
            var key = e.key || e.keyIdentifier
            if(key == "Right" || key == "ArrowRight") {
                rightPressed = false;
            }
            else if(key == "Left" || key == "ArrowLeft") {
                leftPressed = false;
            }   
        }

        function navigatePaddle() {
            if(rightPressed && paddleX < canvas.width-paddleWidth) { 
                paddleX += paddleSpeed; 
            }
            if(leftPressed && paddleX > 0) { 
                paddleX -= paddleSpeed;
            }
        }

        //Game methods
        var score = 0;

        function initGame() {
            score = 0;
            buildBricks();
            draw();
        }

        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = color;
            ctx.fillText("Score: "+score, 8, 20);
        }



        addListeners();
        initGame();
        //var interval = setInterval(draw, tickRate);
