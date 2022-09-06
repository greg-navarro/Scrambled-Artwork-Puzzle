// data processing functions
const addTileDimensions = (tile)  => {
        tile.width = tile.image.width;
        tile.height = tile.image.height;
        return tile;
}

//using each tile's x & y coordinates and respective heights & widths, calculate xSolution and ySolution for each tile.
const calculateSolutionPositions = (tiles) => {
    // add width and height dimension to each tile, then sort into row/column order
    const processedTiles = tiles.map(addTileDimensions).sort((tileA,tileB) => {return  tileA.y - tileB.y || tileA.x - tileB.x });
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
}





const Puzzle = ({ data }) => {
    console.log(data)
    // const processedTiles = data.tiles.map(addTileDimensions).sort((tileA,tileB) => {return tileA.x - tileB.x || tileA.y - tileB.y});
    // console.log(processedTiles);
    const solutionTiles = calculateSolutionPositions(data.tiles);
    console.log(solutionTiles);
    // TODO calculate solutionX and solutionY as we loop through processedTiles (and update processedTiles)

    // TODO write a render function

    // TODO render images onto our canvas

    const displayData = () => {
        let lis = [];
        let key = 0;
        for (const tile of data.tiles) {
            // console.log(tile.image)
            lis.push(<li key={key++}>{tile.url}</li>)
        }
        return lis;
    }



    return (
      <div>
        Puzzle
        <div>
          {/* TODO add <canvas> */}
          <canvas
            id="canvas"
            style={{
              width: "500px",
              height: "500px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              backgroundColor: "blue"
            }}
          ></canvas>
        </div>
      </div>
    );
};

export default Puzzle;