// data processing functions
const addTileDimensions = (tile)  => {
        tile.width = tile.image.width;
        tile.height = tile.image.height;
        return tile;
}





const Puzzle = ({ data }) => {
    console.log(data)
    const processedTiles = data.tiles.map(addTileDimensions).sort((tileA,tileB) => {return tileA.x - tileB.x || tileA.y - tileB.y});
    console.log(processedTiles);

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



    return <div>
        Puzzle
        <div>
            {/* TODO add <canvas> */}
            <ul>
                {displayData()}
            </ul>
        </div>
        </div>;
};

export default Puzzle;