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
  // update tiles array with images, set this value in the data object, and return that
  for (let i = 0; i < testData.tiles.length; i++) { testData.tiles[i].image = images[i]; }
  return testData;
}

// Fetch records to fill 'finder' when no search has been performed
const fetchRecords = async function () {
  let objectRecords = [];
  await fetch("https://www.rijksmuseum.nl/api/nl/collection?imgonly=true&key=geRR5dZh")
  .then(response => response.json())
  .then(response => objectRecords = response.artObjects);
  console.log(objectRecords);
  return objectRecords;
}

// React component
const Homepage = ({ startPuzzle, setPuzzleData }) => {
    const levels = data.levels;
    const currentTestLevel = levels.find((level) => {
      return level.name === "z1";
    });
    let dataWithImages = null;
    fetchImages(currentTestLevel).then(value => dataWithImages = value);

    fetchRecords()

    return (
      <div>
        <div>Homepage</div>
        {<button onClick={() => { setPuzzleData(dataWithImages); startPuzzle(); }}>Start puzzle</button>}
      </div>
    );
}

export default Homepage;
