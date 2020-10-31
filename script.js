
// Canvas Width and Height Configure
let winWidth = window.innerWidth - 50
let winHeight = window.innerHeight - 50

let fps = 60
let snakeSizeIncreament = 5
let defaultSnakeSize = 200
let snakeHeadX = 90
let snakeHeadY = 30



let UP = 0
let DOWN = 1
let LEFT = 2
let RIGHT = 3

let currentHeadDirection = RIGHT

let SNAKE = [
    [[snakeHeadX,snakeHeadY],currentHeadDirection,defaultSnakeSize]
]

function setup() {
    createCanvas(winWidth, winHeight);
    background(0);
    frameRate(fps);

}
  
  function draw() {
    background(0);
    stroke(0,205,0);
    strokeWeight(5);

    if (keyIsPressed){
        switch(keyCode){
            case UP_ARROW: pressed(pressedUP); break;
            case DOWN_ARROW: pressed(pressedDown); break;
            case LEFT_ARROW: pressed(pressedLeft); break;
            case RIGHT_ARROW: pressed(pressedRight); break;
        }
    }

    // Increase Head Snake Size for Movement
    SNAKE[0][2] = SNAKE[0][2] + snakeSizeIncreament
    
    // Last Tail Size always Decreases
    SNAKE[SNAKE.length-1][2] = SNAKE[SNAKE.length-1][2] - snakeSizeIncreament

    for(let LINE=0;LINE<SNAKE.length;LINE++){

        snakeDirection = SNAKE[LINE][1]
        snakeTailSize = SNAKE[LINE][2]
        snakeTailX = null
        snakeTailY = null
        
        // if(snakeHeadX>winWidth | snakeHeadY>winHeight | snakeHeadX < 0 | snakeHeadY < 0){
            //SNAKE OUT OF BOUNDS EXCEPTION, HE SHOULD DIE!
        // }
        
        if(snakeTailSize<1){
            SNAKE.pop();
            // console.log("Loosing a Empty Tail");
            break;
        }

        switch(snakeDirection){
            case UP: 
                // console.log("Going Up");

                if(LINE==0){
                    SNAKE[LINE][0][1] = SNAKE[LINE][0][1] - snakeSizeIncreament
                }

                snakeTailY = SNAKE[LINE][0][1] + snakeTailSize

                // X-Axis remains Constant in Vertical Movement
                snakeTailX = SNAKE[LINE][0][0]
            break;
            case DOWN: 
                // console.log("Going Down");
               
                if(LINE==0){
                    SNAKE[LINE][0][1] = SNAKE[LINE][0][1] + snakeSizeIncreament
                }

                snakeTailY = SNAKE[LINE][0][1] - snakeTailSize 

                // X-Axis remains Constant in Vertical Movement
                snakeTailX = SNAKE[LINE][0][0]

            break;
            case LEFT: 
                // console.log("Going Left");

                if(LINE==0){
                    SNAKE[LINE][0][0] = SNAKE[LINE][0][0] - snakeSizeIncreament
                }
                snakeTailX = SNAKE[LINE][0][0] + snakeTailSize

                // Y-Axis remains Constant in Horizontal Movement
                snakeTailY = SNAKE[LINE][0][1]
            break;
            case RIGHT:
                // console.log("Going Right");

                if(LINE==0){
                    SNAKE[LINE][0][0] = SNAKE[LINE][0][0] + snakeSizeIncreament
                }
                snakeTailX = SNAKE[LINE][0][0] - snakeTailSize
                
                // Y-Axis remains Constant in Horizontal Movement
                snakeTailY = SNAKE[LINE][0][1]
            break;
        }

    
        line(SNAKE[LINE][0][0], SNAKE[LINE][0][1],snakeTailX, snakeTailY);
        


    }
    currentHeadDirection = SNAKE[0][1]
    stroke(0);
  }


    function pressedUP(sHX,sHY){
        if(currentHeadDirection!=UP & currentHeadDirection!=DOWN){
            // console.log("Pressed Up");

            SNAKE.unshift([[sHX,sHY],UP,0]);
        }
    }

    function pressedDown(sHX,sHY){
        if(currentHeadDirection!=DOWN & currentHeadDirection!=UP){
            // console.log("Pressed Down");
            SNAKE.unshift([[sHX,sHY],DOWN,0]);
        }
    }

    function pressedLeft(sHX,sHY){
        if(currentHeadDirection!=LEFT & currentHeadDirection!=RIGHT){
            // console.log("Pressed Left");
            SNAKE.unshift([[sHX,sHY],LEFT,0]);
        }
    }

    function pressedRight(sHX,sHY){
        if(currentHeadDirection!=RIGHT & currentHeadDirection!=LEFT){
            // console.log("Pressed Right");
            SNAKE.unshift([[sHX,sHY],RIGHT,0]);
        }
    }

    function getInitialSize(DIRECTION,HEAD,TAIL){
        let size = 0;
        if(DIRECTION===UP | DIRECTION===DOWN)
            size = Math.abs(TAIL[1] - HEAD[1]);
        else
            size = Math.abs(TAIL[0] - HEAD[0]);
    
        return size;
    }
    
    function getPreviousTailDirection(tailnum){
        try {
            return SNAKE[tailnum+1][2];
        } catch (error) {
            return SNAKE[tailnum][2];
        }
    }
    
    function pressed(callingFunction){
        callingFunction(SNAKE[0][0][0],SNAKE[0][0][1]);
    }