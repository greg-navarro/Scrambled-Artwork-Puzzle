import React from "react";
// import data from "../test-data/test-data.json";

// Utility function fetching image tiles
const fetchImages = async function (levelData) {
  let images = [];
  // use batch of Promises to load images and add an image key/value pair to the 'tiles' array
  // picked up this particular technique from Kimbatt @ https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
  let imageRequestPromises = [];
  for (let tile of levelData.tiles) {
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
  for (let i = 0; i < levelData.tiles.length; i++) { levelData.tiles[i].image = images[i]; }
  return levelData;
}

// Fetch list of object records when no search has been performed.
const fetchRecords = async function (query, pageNo) {
  let url = "";
  if (query.length > 0) {
    url = `https://www.rijksmuseum.nl/api/nl/collection?q=${encodeURI(query)}&imgonly=true&p=${pageNo}&key=geRR5dZh`;
    console.log(url)
  } else {
    url = `https://www.rijksmuseum.nl/api/nl/collection?imgonly=true&p=${pageNo}&key=geRR5dZh`;
  }
  let objectRecords = [];
  await fetch(url)
  .then(response => response.json())
  .then(response => objectRecords = response.artObjects);

  return objectRecords;
}

// Fetch data about a single object given it's objectNumber.
const fetchObjectData = async function (objectNumber) {
  let data = null;
  const url = `https://www.rijksmuseum.nl/api/nl/collection/${objectNumber}/tiles?key=geRR5dZh`;
  data = await fetch(url).then(response => response.json());
  return data;
}



// React component
const Homepage = ({ startPuzzle, setPuzzleData }) => {
    const [page, setPage] = React.useState(1);
    const [artObjectList, setArtObjectList] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const [query, setQuery] = React.useState("Rembrandt");
    const [difficulty, setDifficulty] = React.useState("z3");

    React.useEffect(() => {
      fetchRecords(query, page).then(response => setArtObjectList(response))
      console.log("useEffectFired")
    }, []);

    const nextPage = () => {
      console.log(`what up ${page+1}`)
      fetchRecords(query, page+1).then((response) => {
        console.log(response)
        setArtObjectList(response);
        
      });    
      setPage(page+1);
      setSelectedOption(null);
    }

    const previousPage = () => {
      if (page > 1) {
        console.log(`what up ${page - 1}`);
        fetchRecords(query, page - 1).then((response) => {
          console.log(response);
          setArtObjectList(response);
        });
        setPage(page - 1);
        setSelectedOption(null);
      }
    };

    const performSearchQuery = (q) => {
      // perform search and populate art object list
      fetchRecords(q, page).then((response) => setArtObjectList(response));
      setQuery(q);
      // sets page to zero
      setPage(0);
      // sets selected option to null
      setSelectedOption(null);
    }
    // setArtObjectList(fetchRecords()) // initial call to fetch records
    let objectNumber = 'SK-C-5'; //null;

    // This function will handle everything thats needs to happen before the App can switch to puzzle view.
    // First we obtain data for the selected object, then after picking a level (determines # of tiles in puzzle)
    // we fetch the images for that level, before finally informing App to change state to Puzzle-mode.
    const fetchDataStartPuzzle = async function (objectNumber) {
      // fetch tiles
      let objectData = await fetchObjectData(objectNumber);
      // extract our chosen difficultly level
      // currently hardcoded at z3 for demos (this is 9 tiles), but selecting z2 or z1 will increase # of tiles in puzzle.
      let levelData = objectData.levels.find((level) => {
        return level.name === difficulty;
      });
      // fetch image for each tile
      const levelDataWithImages = await fetchImages(levelData);
      // send this data to App so that it can pass is to <Puzzle />
      setPuzzleData(levelDataWithImages);
      // initiate change in state to Puzzle-mode
      startPuzzle();
    };

    // This function simply checks that an object has been selected by the user when the 'Start Puzzle' button has been pressed.
    // If it hasn't we alert the user that they must select an image before proceeding.
    const startPuzzleClickHandler = () => {
      if (selectedOption === null) {
        alert("pick a result, then press the button")
      } else {
        fetchDataStartPuzzle(selectedOption.objectNumber)
      }
    }

    // Sub component to render 
    const option = (artObject) => {
      return (
        <li
          key={artObject.objectNumber}
          onClick={() => {
            // alert(artObject.objectNumber);
            setSelectedOption(artObject);
            objectNumber = artObject.objectNumber;
          }}
          className={`${artObject === selectedOption ? "active": ""}`}
        >
          <div>{artObject.title}</div>
        </li>
      );
    }

    return (
      <div>
        <div>Homepage</div>
        <label htmlfor="search-query">Search query:</label>

        <input
          type="text"
          name="search-query"
          value={query}
          onChange={(e) => performSearchQuery(e.target.value)}
        ></input>
        <ul className="results-container">
          {artObjectList.map((object) => option(object))}
        </ul>
        <button onClick={() => previousPage()}>Previous page</button>
        <button onClick={() => nextPage()}>Next page</button>
        <br />
        <button onClick={() => startPuzzleClickHandler()}> Start puzzle</button>
        <br/>
        <label>
          {"select difficulty(if you are getting too few OR too many tiles adjust this):"}
          <select value={difficulty} onChange={(e) => {setDifficulty(e.target.value)}}>
            <option value="z4">Fewest tiles</option>
            <option value="z3">A few tiles</option>
            <option value="z2">More than a few tiles</option>
            <option value="z1">Most tiles</option>
          </select>
        </label>
      </div>
    );
}

export default Homepage;
