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
  console.log(processedTiles);
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
    // update currentXCoordinate
    currentXSolution += tile.width;
    // update lastHeight just in case this is the last element in the row (no lookahead)
    lastHeight = tile.height;
  }
  return processedTiles;
};

const Puzzle = ({ data }) => {
  let ref = React.useRef();
  // this variable will house all data about our puzzle (tiles: images, solution, current positions, widths, heights, etc.)
  let solutionTiles = null;
  let selectedTile = null;

  // calculates the current position of the pointer on the canvas
  const pointerLocation = (e) => {
    const rect = document.getElementById("canvas").getBoundingClientRect();
    let coordinates = {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    };
    return coordinates;
  };

  // once the canvas is loaded re-size the canvas via JS api (for resolution), attach event handlers, and render images.
  React.useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");
    let width = data.width;
    let height = data.height;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // calculate solutionX and solutionY as we loop through processedTiles (and update processedTiles)
    solutionTiles = calculateSolutionPositions(data.tiles);

    // render solution tiles TODO render shuffled tiles, write shuffle function!
    for (let solutionTile of solutionTiles) {
      context.drawImage(
        solutionTile.image,
        solutionTile.xSolution,
        solutionTile.ySolution
      );
      context.strokeRect(solutionTile.xSolution, solutionTile.ySolution, solutionTile.width, solutionTile.height);
    }

    // add pointer down event handler
    canvas.onpointerdown = (e) => {
        const coordinates = pointerLocation(e);
        console.log(coordinates)
        for (let tile of solutionTiles) {
            // console.log(`${tile.x} ${tile.y}`)
            if (
                coordinates.x < tile.xSolution ||
                coordinates.x > tile.xSolution + tile.width ||
                coordinates.y < tile.ySolution ||
                coordinates.y > tile.ySolution + tile.height
            ) {
                // do nothing, this tile is not located under pointer
                console.log("you didn't get me!")
            } else { 
                console.log("you got me!");
                selectedTile = tile;
            }
        }
    }

    // onpointermove event handler
    canvas.onpointermove = (e) => {
         context.clearRect(0, 0, solutionTiles.width, solutionTiles.height);
      if (selectedTile !== null) {
        const coordinates = pointerLocation(e);
        // clear canvas
        context.clearRect(0, 0, solutionTiles.width, solutionTiles.height);
        // render each tile except the selected on
        for (let tile of solutionTiles) {
          if (tile !== selectedTile) {
            context.drawImage(tile.image, tile.xSolution, tile.ySolution);
            context.strokeRect(
              tile.xSolution,
              tile.ySolution,
              tile.width,
              tile.height
            );
          }
        }
        // render the moving tile
        context.drawImage(
          selectedTile.image,
          coordinates.x - selectedTile.width / 2,
          coordinates.y - selectedTile.height / 2
        );
        // identify the current 'drop' position
        let dropPosition = null;
        for (let tile of solutionTiles) {
          if (
            coordinates.x < tile.xSolution ||
            coordinates.x > tile.xSolution + tile.width ||
            coordinates.y < tile.ySolution ||
            coordinates.y > tile.ySolution + tile.height
          ) {
            // do nothing, this tile is not located under pointer
            //   console.log("you didn't get me!");
          } else {
            //   console.log("you got me!");
            dropPosition = tile;
          }
        }

        // draw drop indicator
        context.save();
        context.globalAlpha = 0.4;
        if (
          dropPosition.height === selectedTile.height &&
          dropPosition.width === selectedTile.width
        ) {
          context.fillStyle = "#00ff00"; // valid move: apply green indicator tile
        } else {
          context.fillStyle = "#ff0000"; // invalid move: apply red indicator tile
        } 
        context.fillRect(
          dropPosition.xSolution,
          dropPosition.ySolution,
          dropPosition.width,
          dropPosition.height
        );
        context.restore();
      }
    }

    canvas.onpointerup = (e) => {
        selectedTile = null;
    };
  });

  return (
    <div>
      Puzzle
      <div>
        {/* TODO add <canvas> */}
        <canvas
          ref={ref}
          id="canvas"
          style={{
            width: "500px",
            height: "500px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            backgroundColor: "blue",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Puzzle;
