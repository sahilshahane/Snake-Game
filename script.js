new p5()

// Canvas Width and Height Configure
let winWidth = window.innerWidth - 30
let winHeight = window.innerHeight - 30

// NAVIGATION SETTINGS
const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3

//COLORS
color_GREEN = color(0, 255, 0)
color_RED = color(255, 0, 0)
color_BLUE = color(0, 0, 255)
color_YELLOW = color('yellow')
color_ORANGE = color('orange')

// SETTINGS
let fps = 120
let snakeWidth = 4 // snakeWidth's min value should be 2, Value is in Pixel
let snakeSpeed = 1 // Value is in Pixel
let snakeSizeIncreament = 4 // Value is in Pixel
let snakeColor = color_GREEN // Green Color Code, HEX VALUE hai
let foodRadius = 7 //Value is in Pixel
let foodColor = color_YELLOW
let foodColorInner = color_RED
let sound_SNAKE_DIE = loadSound('assets/sounds/smb_mariodie.wav')
let sound_SNAKE_FOOD_EAT = loadSound('assets/sounds/smb_coin.wav')
let defaultSnakeSize = 50 // Value is in Pixel

let SNAKE = initSnake()

// Do not Change these values!
let snakeDied = false
let screenPause = true
const HEAD = 0

function setup() {
  createCanvas(winWidth, winHeight)
  background(0)
  frameRate(fps)

  generateFood()
  updateSnake()
}

function draw() {
  if (!screenPause) {
    if (!snakeDied) {
      background(0)

      // Check if any Key is Pressed for Snake Direction Change
      checkKeyPressed()

      // Update Snake's Appreance
      updateSnake()

      // Check if Snake has Eaten the Food
      checkFoodEaten()

      // Check if Snake Hit's its Own Body
      checkHeadHitBody()

      // Check if Snake's Head Hits the Wall / Boundary, if yes, then Snake Should Die
      checkBoundary()
    } else if (keyIsPressed & snakeDied) {
      SNAKE = initSnake()
      snakeDied = false
    }
  } else if (screenPause & keyIsPressed) {
    // console.log('Game Started')
    screenPause = false
  }
}

function initSnake() {
  let snakeHeadX = null
  let snakeHeadY = null
  let snakeDirection = null

  snakeColor = color_GREEN

  screenGapX = (10 * winWidth) / 100 // 10% of Canvas Width
  screenGapY = (10 * winHeight) / 100 // 10% of Canvas Height

  RandomDirectionChoose = floor(random(0, 3))

  switch (RandomDirectionChoose) {
    case UP:
      snakeDirection = UP

      snakeHeadX = floor(random(screenGapX, winWidth - screenGapX))
      snakeHeadY = floor(
        random(screenGapY, winHeight - (defaultSnakeSize + screenGapY))
      )

      break
    case DOWN:
      snakeDirection = DOWN

      snakeHeadX = floor(random(screenGapX, winWidth - screenGapX))
      snakeHeadY = floor(
        random(screenGapY + defaultSnakeSize, winHeight - screenGapY)
      )

      break
    case LEFT:
      snakeDirection = LEFT

      snakeHeadX = floor(
        random(screenGapX, winWidth - (defaultSnakeSize + screenGapX))
      )
      snakeHeadY = floor(random(screenGapY, winHeight - screenGapY))

      break
    case RIGHT:
      snakeDirection = RIGHT

      snakeHeadX = floor(
        random(defaultSnakeSize + screenGapX, winWidth - screenGapX)
      )
      snakeHeadY = floor(random(screenGapY, winHeight - screenGapY))

      break
  }

  return [[[snakeHeadX, snakeHeadY], snakeDirection, defaultSnakeSize]]
}

function pressedUP(sHX, sHY, headDirection, initiaLength) {
  if ((headDirection != UP) & (headDirection != DOWN)) {
    // console.log("Pressed Up");

    SNAKE.unshift([[sHX, sHY], UP, initiaLength])
  }
}

function pressedDown(sHX, sHY, headDirection, initiaLength) {
  if ((headDirection != DOWN) & (headDirection != UP)) {
    // console.log("Pressed Down");
    SNAKE.unshift([[sHX, sHY], DOWN, initiaLength])
  }
}

function pressedLeft(sHX, sHY, headDirection, initiaLength) {
  if ((headDirection != LEFT) & (headDirection != RIGHT)) {
    // console.log("Pressed Left");
    SNAKE.unshift([[sHX, sHY], LEFT, initiaLength])
  }
}

function pressedRight(sHX, sHY, headDirection, initiaLength) {
  if ((headDirection != RIGHT) & (headDirection != LEFT)) {
    // console.log("Pressed Right");
    SNAKE.unshift([[sHX, sHY], RIGHT, initiaLength])
  }
}

function getInitialSize(DIRECTION, HEAD, TAIL) {
  let size = 0
  if ((DIRECTION === UP) | (DIRECTION === DOWN))
    size = Math.abs(TAIL[1] - HEAD[1])
  else size = Math.abs(TAIL[0] - HEAD[0])

  return size
}

function pressed(callingFunction) {
  callingFunction(SNAKE[HEAD][0][0], SNAKE[HEAD][0][1], SNAKE[HEAD][1], 0)
}

function updateSnake() {
  stroke(snakeColor)
  strokeWeight(snakeWidth)

  // Pre-process some Snake Data
  preProcess()

  // Update Snake's Head Line
  updateSnake_Head()

  // Update the Snake's Remaining Body
  updateSnake_Body()
}

function updateSnake_Body() {
  for (let LINE = 1; LINE < SNAKE.length; LINE++) {
    snakeDirection = SNAKE[LINE][1]
    snakeTailSize = SNAKE[LINE][2]

    Tail = getTailLocation(snakeDirection, LINE, snakeTailSize)
    snakeTailX = Tail[0]
    snakeTailY = Tail[1]

    line(SNAKE[LINE][0][0], SNAKE[LINE][0][1], snakeTailX, snakeTailY)
  }

  // Check if Snake should Loose its Tail or Last Line
  checkLoseTail()
}

function updateSnake_Head() {
  snakeDirection = SNAKE[HEAD][1]
  snakeTailSize = SNAKE[HEAD][2]

  const LINE = 0

  // Pre-process Head Location
  switch (snakeDirection) {
    case UP:
      SNAKE[LINE][0][1] -= snakeSpeed
      break
    case DOWN:
      SNAKE[LINE][0][1] += snakeSpeed
      break
    case LEFT:
      SNAKE[LINE][0][0] -= snakeSpeed
      break
    case RIGHT:
      SNAKE[LINE][0][0] += snakeSpeed
      break
  }

  Tail = getTailLocation(snakeDirection, LINE, snakeTailSize)

  snakeTailX = Tail[0]
  snakeTailY = Tail[1]

  line(SNAKE[HEAD][0][0], SNAKE[HEAD][0][1], snakeTailX, snakeTailY)
}

function getTailLocation(snakeDirection, LINE, snakeTailSize) {
  snakeTailX = SNAKE[LINE][0][0]
  snakeTailY = SNAKE[LINE][0][1]

  switch (snakeDirection) {
    case UP:
      // console.log("Going Up");
      snakeTailY = SNAKE[LINE][0][1] + snakeTailSize

      break
    case DOWN:
      // console.log("Going Down");
      snakeTailY = SNAKE[LINE][0][1] - snakeTailSize

      break
    case LEFT:
      // console.log("Going Left");
      snakeTailX = SNAKE[LINE][0][0] + snakeTailSize

      break
    case RIGHT:
      // console.log("Going Right");
      snakeTailX = SNAKE[LINE][0][0] - snakeTailSize

      break
  }

  return [snakeTailX, snakeTailY]
}

function checkBoundary() {
  snakeHeadX = SNAKE[0][0][0]
  snakeHeadY = SNAKE[0][0][1]
  if (
    (snakeHeadX > winWidth) |
    (snakeHeadY > winHeight) |
    (snakeHeadX < 0) |
    (snakeHeadY < 0)
  ) {
    // SNAKE OUT OF BOUNDS, HE SHOULD DIE!
    DieMF()
  }
}

function checkLoseTail() {
  if (SNAKE[SNAKE.length - 1][2] < 1) {
    SNAKE.pop()
    // console.log("Loosing a Empty Tail");
  }
}

function checkKeyPressed() {
  // if (keyIsPressed){
  //     switch(keyCode){
  //         case UP_ARROW: pressed(pressedUP); break;
  //         case DOWN_ARROW: pressed(pressedDown); break;
  //         case LEFT_ARROW: pressed(pressedLeft); break;
  //         case RIGHT_ARROW: pressed(pressedRight); break;
  //     }
  // }

  if (keyIsDown(UP_ARROW)) pressed(pressedUP)
  else if (keyIsDown(DOWN_ARROW)) pressed(pressedDown)
  else if (keyIsDown(LEFT_ARROW)) pressed(pressedLeft)
  else if (keyIsDown(RIGHT_ARROW)) pressed(pressedRight)
}

function preProcess() {
  // Increase Head Snake Size for Movement
  SNAKE[0][2] = SNAKE[0][2] + snakeSpeed

  // Last Tail Size always Decreases
  SNAKE[SNAKE.length - 1][2] = SNAKE[SNAKE.length - 1][2] - snakeSpeed
}

function DieMF() {
  // console.log('Snake Died')

  snakeColor = color_RED
  if (sound_SNAKE_DIE.isPlaying()) {
    sound_SNAKE_DIE.stop()
  }
  sound_SNAKE_DIE.play()
  snakeDied = true
  updateSnake()
}

function checkHeadHitBody() {
  snakeHeadX = SNAKE[HEAD][0][0]
  snakeHeadY = SNAKE[HEAD][0][1]
  snakeDirection = SNAKE[HEAD][1]

  next_snakeHeadX = snakeHeadX
  next_snakeHeadY = snakeHeadY

  lookupSteps = 3

  switch (snakeDirection) {
    case UP:
      next_snakeHeadY -= lookupSteps
      break
    case DOWN:
      next_snakeHeadY += lookupSteps
      break
    case LEFT:
      next_snakeHeadX -= lookupSteps
      break
    case RIGHT:
      next_snakeHeadX += lookupSteps
      break
  }

  // RGBA Color Values for Current Snake's Head Pixel
  sR = snakeColor.levels[0]
  sG = snakeColor.levels[1]
  sB = snakeColor.levels[2]
  sA = snakeColor.levels[3]

  next_Pixel = get(next_snakeHeadX, next_snakeHeadY)

  // RGBA Color Values for Next Snake's Predicted Head Pixel
  nR = next_Pixel[0]
  nG = next_Pixel[1]
  nB = next_Pixel[2]
  nA = next_Pixel[3]

  // DEBUG
  // console.log(
  //   next_snakeHeadX,
  //   next_snakeHeadY,
  //   snakeHeadX,
  //   snakeHeadY,
  //   snakeDirection
  // )

  // Triggers when snake hit's its own body
  if ((sR == nR) & (sG == nG) & (sB == nB) & (sA == nA)) {
    DieMF()
  }
}

function generateFood() {
  foodX = floor(random(this.width - foodRadius))
  foodY = floor(random(this.height - foodRadius))

  drawFood()
}

function drawFood() {
  stroke(foodColor)
  // strokeWeight(foodSize);
  fill(foodColorInner)
  circle(foodX, foodY, foodRadius * 2)
}

function increaseSnakeTail() {
  // console.log("Snake's Size Increased");
  SNAKE[SNAKE.length - 1][2] += snakeSizeIncreament
}

function checkFoodEaten() {
  snakeHeadX = SNAKE[HEAD][0][0]
  snakeHeadY = SNAKE[HEAD][0][1]

  // DEBUG
  // console.log(`sX = ${snakeHeadX}\nsY = ${snakeHeadY}\nfX = [${foodX-foodRadius}-${foodX+foodRadius}]\nfY = [${foodY-foodRadius}-${foodY+foodRadius}]`);

  areaException = 3
  newFoodRadius = foodRadius + areaException

  if (
    (snakeHeadX >= foodX - newFoodRadius) &
    (snakeHeadX <= foodX + newFoodRadius) &
    (snakeHeadY >= foodY - newFoodRadius) &
    (snakeHeadY <= foodY + newFoodRadius)
  ) {
    // console.log("Food Eaten");

    if (sound_SNAKE_FOOD_EAT.isPlaying()) {
      sound_SNAKE_FOOD_EAT.stop()
    }

    sound_SNAKE_FOOD_EAT.play()

    increaseSnakeTail()
    generateFood()
  } else {
    drawFood()
  }
}
