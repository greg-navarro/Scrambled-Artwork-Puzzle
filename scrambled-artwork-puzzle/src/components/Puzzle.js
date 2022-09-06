const Puzzle = ({ data }) => {
    
    
    // console.log(data)
    // let puzzleData = null;
    // data.then(value => puzzleData = value);

    const displayData = () => {
        let lis = [];
        let key = 0;
        for (const tile of data.tiles) {
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