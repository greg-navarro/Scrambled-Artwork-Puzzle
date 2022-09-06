import React from 'react';
import Homepage from './components/Homepage';
import Puzzle from './components/Puzzle';
import './App.css';

function App() {
  // State constants to control conditional component rendering
  const INTIALSTATE = 1;
  const PUZZLESTATE = 2;
  const SUCCESSSTATE = 3;
  //Size of canvas onscreen in px
  const puzzleHeight = 500;

  // Controls current state 
  const [currentState, setCurrentState] = React.useState(INTIALSTATE);
  // Houses data used to run puzzle i.e. images, dimensions, coordinates, etc.
  const [puzzleData, setPuzzleData] = React.useState(null);

  // Functions for other components to access/modify state elements
  // Switches to PUZZLESTATE
  const setPuzzleState = () => { setCurrentState(2); };


  return (
    <div className="App">
      {currentState === INTIALSTATE && <Homepage startPuzzle={setPuzzleState} setPuzzleData={setPuzzleData} canvasHeight={puzzleHeight} />}
      {currentState === PUZZLESTATE && <Puzzle data={puzzleData} />}
    </div>
  );
}

export default App;
