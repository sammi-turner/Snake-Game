import p5 from 'p5';
import './style.css';

let score = 0;

new p5(sketch => {
    let snake;
    let food;
    let scale;
    let canvasSize;

    function setCanvasSize() {
        if (window.innerWidth >= 1200) {
            canvasSize = Math.min(500, window.innerWidth - 50);
            scale = 20;
        } else if (window.innerWidth >= 992) {
            canvasSize = Math.min(450, window.innerWidth - 50);
            scale = 20;
        } else if (window.innerWidth >= 768) {
            canvasSize = Math.min(350, window.innerWidth - 50);
            scale = 15;
        } else {
            canvasSize = Math.min(300, window.innerWidth - 50);
            scale = 10;
        }
    }

    function setupControls() {
      const upBtn = document.getElementById('up-btn');
      const downBtn = document.getElementById('down-btn');
      const leftBtn = document.getElementById('left-btn');
      const rightBtn = document.getElementById('right-btn');
  
      const handleButton = (direction) => {
          switch(direction) {
              case 'up':
                  if (snake.ydir !== 1) snake.dir(0, -1);
                  break;
              case 'down':
                  if (snake.ydir !== -1) snake.dir(0, 1);
                  break;
              case 'left':
                  if (snake.xdir !== 1) snake.dir(-1, 0);
                  break;
              case 'right':
                  if (snake.xdir !== -1) snake.dir(1, 0);
                  break;
          }
      };
  
      const addButtonListeners = (btn, direction) => {
          // Handle both touch and click events
          ['click', 'touchstart'].forEach(eventType => {
              btn.addEventListener(eventType, (e) => {
                  e.preventDefault(); // Prevent default behavior
                  handleButton(direction);
              });
          });
      };
  
      // Add listeners to all buttons
      addButtonListeners(upBtn, 'up');
      addButtonListeners(downBtn, 'down');
      addButtonListeners(leftBtn, 'left');
      addButtonListeners(rightBtn, 'right');
    }

    sketch.setup = () => {
        setCanvasSize();
        let canvas = sketch.createCanvas(canvasSize, canvasSize);
        canvas.parent('game-container');
        snake = new Snake();
        foodLocation();
        sketch.frameRate(10);
        setupControls();
    };

    sketch.windowResized = () => {
        setCanvasSize();
        sketch.resizeCanvas(canvasSize, canvasSize);
        snake = new Snake();
        foodLocation();
    };

    sketch.draw = () => {
        sketch.background(51);
        snake.update();
        snake.show();
        
        if (snake.eat(food)) {
            foodLocation();
            score++;
            updateScoreDisplay();
        }
        
        sketch.fill(255, 0, 100);
        sketch.rect(food.x, food.y, scale, scale);

        if (snake.checkCollision()) {
            sketch.background(255, 0, 0);
            sketch.fill(255);
            sketch.textSize(32);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            sketch.text('Game Over', canvasSize/2, canvasSize/2);
            sketch.noLoop();
        }
    };

    sketch.keyPressed = () => {
        if (sketch.keyCode === sketch.UP_ARROW && snake.ydir !== 1) snake.dir(0, -1);
        else if (sketch.keyCode === sketch.DOWN_ARROW && snake.ydir !== -1) snake.dir(0, 1);
        else if (sketch.keyCode === sketch.RIGHT_ARROW && snake.xdir !== -1) snake.dir(1, 0);
        else if (sketch.keyCode === sketch.LEFT_ARROW && snake.xdir !== 1) snake.dir(-1, 0);
    };

    function foodLocation() {
        let cols = sketch.floor(canvasSize / scale);
        let rows = sketch.floor(canvasSize / scale);
        food = sketch.createVector(sketch.floor(sketch.random(cols)), sketch.floor(sketch.random(rows)));
        food.mult(scale);
    }

    function updateScoreDisplay() {
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    class Snake {
        constructor() {
            this.body = [];
            this.body[0] = sketch.createVector(0, 0);
            this.xdir = 1;
            this.ydir = 0;
            this.len = 1;
        }

        update() {
            let head = this.body[0].copy();
            head.x += this.xdir * scale;
            head.y += this.ydir * scale;
            
            head.x = (head.x + canvasSize) % canvasSize;
            head.y = (head.y + canvasSize) % canvasSize;
            
            this.body.unshift(head);
            
            if (this.body.length > this.len) {
                this.body.pop();
            }
        }

        show() {
            sketch.fill(255);
            for (let i = 0; i < this.body.length; i++) {
                sketch.rect(this.body[i].x, this.body[i].y, scale, scale);
            }
        }

        dir(x, y) {
            this.xdir = x;
            this.ydir = y;
        }

        eat(pos) {
            let x = this.body[0].x;
            let y = this.body[0].y;
            if (x === pos.x && y === pos.y) {
                this.len++;
                return true;
            }
            return false;
        }

        checkCollision() {
            let head = this.body[0];
            for (let i = 1; i < this.body.length; i++) {
                if (head.x === this.body[i].x && head.y === this.body[i].y) {
                    return true;
                }
            }
            return false;
        }
    }
});