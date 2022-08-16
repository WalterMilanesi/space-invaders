const state = {
  numCells: (600 / 40) * (600 / 40),
  cells: [],
  shipPosition: 217,
  aliensPosition: [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 18, 19, 20, 21, 22, 23, 24, 25, 26, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56,
  ],
  gameover: false,
  score: 0,
};

const setupGame = (element) => {
  state.element = element;
  // do all the needed to draw the game
  // draw the grid
  drawGrid();
  // draw the spaceship
  drawSpaceship();
  // draw the aliens
  drawAliens();
  // add the instructions and the score
  drawScoreboard();
};

const drawGrid = () => {
  // create the containing element
  const gridEl = document.createElement("div");
  gridEl.classList.add("grid");
  // create a LOT of cells: 15x15 (225)
  for (i = 0; i < state.numCells; i++) {
    // create a cell
    const cell = document.createElement("div");
    // append the cell to the grid
    gridEl.append(cell);
    //store the cell in game state
    state.cells.push(cell);
  }
  // append the cells to the containing element and the containing element to the app
  state.element.append(gridEl);
};

const drawSpaceship = () => {
  // find the botton row, middle cell (from game state), add an image
  state.cells[state.shipPosition].classList.add("spaceship");
};

const controlShip = (event) => {
  if(state.gameover) return;  
  // if the key is left do something
  if (event.code === "ArrowLeft") {
    moveShip("left");

    // if the key is right do something
  } else if (event.code === "ArrowRight") {
    moveShip("right");

    // if the key is space do something
  } else if (event.code === "Space") {
    fire();
  }
};

const moveShip = (direction) => {
  // remove image from current position
  state.cells[state.shipPosition].classList.remove("spaceship");

  // figure out the delta (difference between the first position and the last)
  // Otra opción es && state.shipPosition %15 !== 0 (Significa que al dividirlo por 15 el resultado es 0)
  if (direction === "left" && state.shipPosition > 210) {
    state.shipPosition--;
    // Otra opción es && state.shipPosition %15 !== 14 (Significa que al dividirlo por 15 el resultado es 14)
  } else if (direction === "right" && state.shipPosition < 224) {
    state.shipPosition++;
  }
  // add image to new position
  state.cells[state.shipPosition].classList.add("spaceship");
};

const fire = () => {
  // use an interval: run some code repeatedly each time after specified time
  let interval;
  // laser star at the ship position
  let laserPosition = state.shipPosition;
  interval = setInterval(() => {
    // remove the laser image
    state.cells[laserPosition].classList.remove("laser");
    // decrease (move up a row) the last position
    laserPosition -= 15;
    // check we are still in bounds!
    if (laserPosition < 0) {
      clearInterval(interval);
      return;
    }

    // if there's an alien BOOM!
    // clear the interva, remove the alien image, remove the alien from the alien position, add the BOOM image, set a time out to remove the explosion

    if (state.aliensPosition.includes(laserPosition)) {
      clearInterval(interval);
      state.aliensPosition.splice(
        state.aliensPosition.indexOf(laserPosition),
        1
      );
      state.cells[laserPosition].classList.remove("alien", "laser");
      state.cells[laserPosition].classList.add("hit");

      state.score= state.score+10;
      state.scoreEl.innerText = state.score
      setTimeout(() => {
        state.cells[laserPosition].classList.remove("hit");
      }, 200);
      return;
    }

    // add the last image
    state.cells[laserPosition].classList.add("laser");
  }, 100);
};

const drawAliens = () => {
  // adding the aliens to the grid => we need to store the position of the aliens in our game state
  state.cells.forEach((cell, index) => {
    // remove any aliens image

    if(cell.classList.contains('alien')){
      cell.classList.remove("alien");
    }

    // state.aliensPosition.remove('alien');

    // Add the image to the cell if the index is in the set of alien positions
    if (state.aliensPosition.includes(index)) {
      cell.classList.add("alien");
    }
  });
};

const play = () => {
  // start the march of the aliens!
  let interval;
  // starting direction
  let direction = "right";
  interval = setInterval(() => {
    let movement
    if (direction === "right") {
      // if we are going right and at the edge, increase position by 15, decrease 1
      if (atEdge("right")) {
        movement= 15-1;
        direction = 'left';
      } else {
        // if going right, increase the position by 1
        movement = 1
      }
    } else if (direction === "left") {
      // if we are going left and at the edge, increase position by 15, increase 1
      if (atEdge("left")) {
        movement = 15+1;
        direction= 'right';
      } else {
        // if going left, decrease the position by 1
        movement= -1;
      }
    }

    // update aliens positions
    state.aliensPosition = state.aliensPosition.map((position) => position + movement);

    // redraw aliens on the page
    drawAliens();
    chekGameState(interval);
  }, 400);
  // Set up the ship controls
  window.addEventListener("keydown", controlShip);
};

const atEdge=(side)=>{
  if(side==='left'){
    // are any aliens in the left hand column?
    return state.aliensPosition.some(position=>position%15===0)
    // are any aliens in the right hand column?
  } else if(side==='right'){
    return state.aliensPosition.some(position=>position%15===14)
  }
}

const chekGameState=(interval)=>{
  // has the aliens got to the bottom?
  // Are the aliens all DEAD??
  if(state.aliensPosition.length===0){
      // stop everything
      
      // stop the interval
      clearInterval(interval);
      drawMessage("HUMANS WINS");
    } else if(state.aliensPosition.some(position=> position>= state.shipPosition)){
      clearInterval(interval);
      state.gameover = true;
      // make ship go  boom!!
      // remove the ship, add the explosion image
      state.cells[state.shipPosition].classList.remove('spaceship');
      state.cells[state.shipPosition].classList.add('hit');
      drawMessage("GAME OVER");


  }
}

const drawMessage=(message)=>{
  // create a message
  const messageEl= document.createElement('div');
  messageEl.classList.add('message');
  // create the heading
  const h1= document.createElement('h1');
  h1.innerText= message;
  messageEl.append(h1);
  // append it to the app
state.element.append(messageEl)
}

const drawScoreboard= ()=>{
  const heading = document.createElement('h1');
  heading.innerText= 'Space Invaders';
  const paragraph1 = document.createElement('p');
  paragraph1.innerText= 'Press SPACE to shoot';
  const paragraph2 = document.createElement('p');
  paragraph2.innerText= 'Press ⇐ and ⇒ to move';
  const scoreBoard = document.createElement('div');
  scoreBoard.classList.add('scoreBoard');
  const scoreEl= document.createElement('span');
  scoreEl.innerText= state.score;
  const heading3 = document.createElement('h3');
  heading3.innerText= 'Score ';
  heading3.append(scoreEl);
  scoreBoard.append(heading, paragraph1, paragraph2, heading3);

  state.scoreEl = scoreEl;
  state.element.append(scoreBoard)
}

//  query the page for the place to insert my game
const appEl = document.querySelector(".app");
// do all the needed to draw the game
setupGame(appEl);
// Play the game => Start being able to move the ship, move aliens

play();
