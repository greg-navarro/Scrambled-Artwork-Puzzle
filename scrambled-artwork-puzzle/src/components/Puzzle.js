import React from "react";

// data processing functions
const addTileDimensions = (tile) => {
  tile.width = tile.image.width;
  tile.height = tile.image.height;
  return tile;
};

//using each tile's x & y coordinates and respective heights & widths, calculate xSolution and ySolution for each tile.
const calculateSolutionPositions = (tiles) => {
  // add width and height dimension to each tile, then sort into row/column order
  const processedTiles = tiles.map(addTileDimensions).sort((tileA, tileB) => {
    return tileA.y - tileB.y || tileA.x - tileB.x;
  });
  // calculate solution positions
  let currentXSolution = 0;
  let currentYSolution = 0;
  let lastXCoordinate = 0;
  let lastYCoordinate = 0;
  let lastHeight = 0;
  for (let tile of processedTiles) {
    // set currentXSolution to zero when we hit a new row
    if (tile.x < lastXCoordinate) currentXSolution = 0;
    // set currentYSolution to height of the previous row whenever we hit a new row
    if (tile.y > lastYCoordinate) currentYSolution += lastHeight;
    // update lastXCoordinate and lastYCoordinate
    lastXCoordinate = tile.x;
    lastYCoordinate = tile.y;
    // set X/Y solution properties
    tile.xSolution = currentXSolution;
    tile.ySolution = currentYSolution;
    // declare properties for the x/y positions of the tiles while they are moved around the puzzle
    // these will allow for shuffling and temporary reordering
    tile.xCurrent = tile.xSolution;
    tile.yCurrent = tile.ySolution;
    // update currentXCoordinate
    currentXSolution += tile.width;
    // update lastHeight just in case this is the last element in the row (no lookahead)
    lastHeight = tile.height;
  }
  return processedTiles;
};

const shuffleTiles = (tiles) => {
  let sizes = [] // holds width/height pairs
  // populate sizes by iterating through tiles array
  for (let tile of tiles) {
    // check if we have this size recorderd, if so don't add another
    let lookup = sizes.some((size) => size.height === tile.height && size.width === size.width);
    if (!lookup) {
      sizes.push({width: tile.width, height: tile.height});
    }
  }

  // for each size, get a list of tiles with those size, shuffle their xCurrent and yCurrent values, and add them the shuffledTiles array
  for (let size of sizes) {
    // filter
    let validTiles = tiles.filter(
      (tile) => tile.height === size.height && tile.width === size.width
    );
    // make a separate array of xCurrent yCurrent values (as objects)
    // shuffle xyPositions
    let xyPositions = validTiles.map((validTile) => {
      return {
        xCurrent: validTile.xCurrent,
        yCurrent: validTile.yCurrent,
        sort: Math.random(),
      };
    }).sort((tileA, tileB) => tileA.sort - tileB.sort);

    // iterate through values to shuffle the positions of the tiles
    for (let i = 0; i < validTiles.length; i++) {
      validTiles[i].xCurrent = xyPositions[i].xCurrent;
      validTiles[i].yCurrent = xyPositions[i].yCurrent;
    }
    // add the now shuffled tiles to the shuffled tiles array
  }
  return tiles;
}

const evaluateSolution = (tiles) => {
  for (let tile of tiles) {
    if (tile.xCurrent !== tile.xSolution || tile.yCurrent !== tile.ySolution)
      return false
  }
  return true;
}

const evaluatePercentageCorrect = (tiles) => {
  let total = 0
  let correct = 0
  for (let tile of tiles) {
    total = total + 1
    if (tile.xCurrent === tile.xSolution || tile.yCurrent === tile.ySolution)
      correct = correct + 1
  }
  return {total: total, correct: correct};
}

const calculateCanvasElementWidth = (height, tiles) => {
  let aspectRatio = tiles.width / tiles.height;
  console.log(aspectRatio)
  let updatedWidth = height * aspectRatio;
  console.log(height)
  return updatedWidth
}

const Puzzle = ({ data, canvasHeight, changeState }) => {
  console.log(data)
  let ref = React.useRef();
  const [dataIn, setDataIn] = React.useState(data)
  const [totalTiles, setTotalTiles] = React.useState(0)
  const [correctTiles, setCorrectTiles] = React.useState(0)
  // this variable will house all data about our puzzle (tiles: images, solution, current positions, widths, heights, etc.)
  let puzzleTiles = null;
  let selectedTile = null;
  let swapTile = null;
  // width and height ratios for calculating pointer position on a resized canvas
  let widthRatio = 1;
  let heightRatio = 1;

  // calculates the current position of the pointer on the canvas
  const pointerLocation = (e) => {
    const rect = document.getElementById("canvas").getBoundingClientRect();
    let coordinates = {
      x: (e.clientX - rect.x)*widthRatio,
      y: (e.clientY - rect.y)*heightRatio,
    };
    return coordinates;
  };

  // once the canvas is loaded re-size the canvas via JS api (for resolution), attach event handlers, and render images.
  React.useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    let width = data.width;
    let height = data.height;
    
    const updatedWidth = calculateCanvasElementWidth(canvasHeight, data)
    widthRatio = width / updatedWidth;
    heightRatio = height / canvasHeight;
    console.log(updatedWidth)
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${updatedWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    // calculate solutionX and solutionY as we loop through processedTiles (and update processedTiles)
    let solutionTiles = calculateSolutionPositions(data.tiles);

    // render solution tiles TODO render shuffled tiles, write shuffle function!
    puzzleTiles = shuffleTiles(solutionTiles);
    const correctRatio = evaluatePercentageCorrect(puzzleTiles)
    console.log(correctRatio)
    setCorrectTiles(correctRatio.correct)
    setTotalTiles(correctRatio.total) 
    for (let tile of puzzleTiles) {
      context.drawImage(
        tile.image,
        tile.xCurrent,
        tile.yCurrent
      );
      context.strokeRect(tile.xCurrent, tile.yCurrent, tile.width, tile.height);
    }

    // add pointer down event handler
    canvas.onpointerdown = (e) => {
        const coordinates = pointerLocation(e);
        for (let tile of puzzleTiles) {
            if (
                coordinates.x < tile.xCurrent ||
                coordinates.x > tile.xCurrent + tile.width ||
                coordinates.y < tile.yCurrent ||
                coordinates.y > tile.yCurrent + tile.height
            ) {
                // do nothing, this tile is not located under pointer
            } else { 
                selectedTile = tile;
            }
        }
    }

    // onpointermove event handler
    canvas.onpointermove = (e) => {
      // only perform if a tile is selected
      if (selectedTile !== null) {
        // get pointer location
        const coordinates = pointerLocation(e);
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height); // TODO examine why clearing is not occuring
        // render each tile except the selected one
        for (let tile of puzzleTiles) {
          if (tile !== selectedTile) {
            context.drawImage(tile.image, tile.xCurrent, tile.yCurrent);
            context.strokeRect(
              tile.xCurrent,
              tile.yCurrent,
              tile.width,
              tile.height
            );
          }
        }
        // render the selected tile centered on the pointer location
        context.save(); // push state onto stack
        context.globalAlpha = 0.4; // moving image and swap indicator should have a transparent quality
        context.drawImage(
          selectedTile.image,
          coordinates.x - selectedTile.width / 2,
          coordinates.y - selectedTile.height / 2
        );
        // identify the current 'drop' position
        let swapPosition = null;
        for (let tile of puzzleTiles) {
          if (
            coordinates.x < tile.xCurrent ||
            coordinates.x > tile.xCurrent + tile.width ||
            coordinates.y < tile.yCurrent ||
            coordinates.y > tile.yCurrent + tile.height
          ) {
            // do nothing, this tile is not located under pointer
          } else {
            swapPosition = tile;
          }
        }

        // Draw colored indicator to communicate to user whether a swap may occur or not.
        if (swapPosition !== null && swapPosition !== selectedTile) {
          // check that the swap position has the same dimensions as the selected tile, this determines further behavious
          if (
            swapPosition.height === selectedTile.height &&
            swapPosition.width === selectedTile.width
          ) {
            context.fillStyle = "#00ff00"; // valid move: apply green indicator tile
            swapTile = swapPosition; // if pointer is released, this tile will be swapped
          } else {
            context.fillStyle = "#ff0000"; // invalid move: apply red indicator tile
          }
          // proceeds to draw indicator
          context.fillRect(
            swapPosition.xCurrent,
            swapPosition.yCurrent,
            swapPosition.width,
            swapPosition.height
          );
        }
        context.restore(); // restore previous state (resets alpha channel and fill color)
      }
    } // end onpointermove handler

    canvas.onpointerup = (e) => {
        // perform a swap, if it is available
        if (selectedTile !== null && swapTile !== null) {
          const tempTile = {xCurrent:swapTile.xCurrent, yCurrent: swapTile.yCurrent};
          swapTile.xCurrent = selectedTile.xCurrent;
          swapTile.yCurrent = selectedTile.yCurrent;
          selectedTile.xCurrent = tempTile.xCurrent;
          selectedTile.yCurrent = tempTile.yCurrent;
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        // render tiles
        for (let solutionTile of puzzleTiles) {
          context.drawImage(
            solutionTile.image,
            solutionTile.xCurrent,
            solutionTile.yCurrent
          );
          context.strokeRect(
            solutionTile.xCurrent,
            solutionTile.yCurrent,
            solutionTile.width,
            solutionTile.height
          );
        }
        selectedTile = null;
        swapTile = null;

        // check if solution has been reached and update correct tiles out of total
        const solutionReacted = evaluateSolution(puzzleTiles);
        const correctRatio = evaluatePercentageCorrect(puzzleTiles)
        setCorrectTiles(correctRatio.correct)
        setTotalTiles(correctRatio.total)
        // if it has, fire success indicator and deactivate event handlers on the canvas
        if (solutionReacted) {
          canvas.onpointerdown = null;
          canvas.onpointermove = null;
          canvas.onpointerup = null;
          
          context.save();
          context.font = "48px serif";
          context.fillStyle = "#ffffff";
          context.fillText("SUCCESS", width / 3, height / 2);
          context.restore();
          // alert("solution reached");
        }
    }; // end onpointerup handler

    // check if we are at a success state (if the puzzle has too few tiles this can happen)
    if (evaluateSolution(puzzleTiles)) {
      context.save();
      context.font = "48px serif";
      context.fillStyle= "#ffffff";
      context.fillText("SUCCESS", width/3, height/2);
      context.restore();
    }

  }); // end useEffect

  return (
    <div className="full-height">
      <div className="header">
          <div className="header-logo-container">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/67/Rijks_museum_logo.png"
              alt="Rijks Museum Logo"
              className="header-logo"
            />
            <h1>Scrambled Artwork Puzzle Game</h1>
          </div>
          
        </div>
      <div className="grid-container">
        <div className="controls-container">
          <div className="info">
            <h2><strong>Title:</strong> {data.objectName}</h2>
            <h3><strong>Artist:</strong> {data.artistName}</h3>
            <p><strong>Correctly placed tiles:</strong> {correctTiles} / {totalTiles}</p>
          </div>
          <div className="home-button">
            <button onClick={() => changeState()}>Homepage</button>
          </div>
        </div>
        <div className="puzzle-container">
          {/* TODO add <canvas> */}
          <canvas
            ref={ref}
            id="canvas"
            style={{
              width: "500px",
              height: "500px",
              border: "3px solid rgba(0, 0, 0, 1)",
            }}
          ></canvas>
        </div>
      
      </div>
    </div>
  );
};

export default Puzzle;
