import data from "../test-data/test-data.json";

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
  console.log("all images loaded")
  console.log(images)

  // update tiles array with images, set this value in the data object, and return that
  for (let i = 0; i < testData.tiles.length; i++) { testData.tiles[i].image = images[i]; }
  console.log(testData.tiles);
  return images;
}

const Homepage = ({ startPuzzle, setPuzzleData }) => {
    const levels = data.levels;
    const currentTestLevel = levels.find((level) => {
      return level.name === "z4";
    });

    // setPuzzleData(currentTestLevel);
    fetchImages(currentTestLevel);

    return (
      <div>
        <div>Homepage</div>
        <button onClick={() => startPuzzle()}>Start puzzle</button>
      </div>
    );
}

export default Homepage;
