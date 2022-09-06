const Puzzle = ({ data }) => {
    
    
    // console.log(data)
    // let puzzleData = null;
    // data.then(value => puzzleData = value);

    const displayData = () => {
        // let lis = [];
        // let key = 0;
        // for (const tile of puzzleData.tiles) {
        //     lis.push(<li key={key}>{tile.url}</li>)
        // }
        // return lis;
        console.log(data);
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