// data processing functions
const addTileDimensions = (tile)  => {
        tile.width = tile.image.width;
        tile.height = tile.image.height;
        return tile;
}

// const sortGrid = (tileA, tileB) => {
//     if 
// }



const Puzzle = ({ data }) => {
    console.log(data)
    const processedTiles = data.tiles.map(addTileDimensions).sort((a,b) => {return a.x - b.x || a.y - b.y});
    console.log(processedTiles);

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
            <ul>
                {displayData()}
            </ul>
        </div>
        </div>;
};

export default Puzzle;