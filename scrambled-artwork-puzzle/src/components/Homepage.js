import data from "../test-data/test-data.json";

const levels = data.levels;
const currentTestLevel = levels.find(level => { return level.name === "z4"});

const Homepage = ({ startPuzzle }) => {


    return (
      <div>
        <div>Homepage</div>
        <button onClick={() => startPuzzle()}>Start puzzle</button>
      </div>
    );
}

export default Homepage;
