import React from "react";
import data from "../test-data/test-data.json";

// Utility function get images for test data
const fetchImages = async function (testData) {
  let images = [];

  // use batch of Promises to load images and add an image key/value pair to the 'tiles' array
  // picked up this particular technique from Kimbatt @ https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
  let imageRequestPromises = [];
  for (let tile of testData.tiles) {
    imageRequestPromises.push(new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
        resolve();
        };
        img.src = tile.url;
        images.push(img);   
    })); 
  } // end for-loop
  await Promise.all(imageRequestPromises);
//   console.log("all images loaded")
  console.log(images)

  // update tiles array with images, set this value in the data object, and return that
  for (let i = 0; i < testData.tiles.length; i++) { testData.tiles[i].image = images[i]; }
//   console.log(testData.tiles);
  return testData;
}

// React component
const Homepage = ({ startPuzzle, setPuzzleData }) => {
    const levels = data.levels;
    const currentTestLevel = levels.find((level) => {
      return level.name === "z4";
    });
    let dataWithImages = null;

    // setPuzzleData(currentTestLevel);
    fetchImages(currentTestLevel).then(value => console.log(value));
    React.useEffect(() => {
        // dataWithImages = fetchImages(currentTestLevel);
        // console.log(dataWithImages);
        // console.log("images loaded! go ahead with next test!") 
    }, []);

    return (
      <div>
        <div>Homepage</div>
        {<button onClick={() => { setPuzzleData(dataWithImages); startPuzzle(); }}>Start puzzle</button>}
      </div>
    );
}

export default Homepage;
