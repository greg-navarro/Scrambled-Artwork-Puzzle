import data from "../test-data/test-data.json";

const levels = data.levels;
const currentTestLevel = levels.find(level => { return level.name === "z4"});

const Homepage = () => {


    return <div>Homepage</div>;
}

export default Homepage;
