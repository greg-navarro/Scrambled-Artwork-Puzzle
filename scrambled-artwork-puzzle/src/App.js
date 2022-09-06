import React from 'react';
import Homepage from './components/Homepage';
import Puzzle from './components/Puzzle';
import './App.css';

function App() {
  // State constants to control conditional component rendering
  const INTIALSTATE = 1;
  const PUZZLESTATE = 2;
  const SUCCESSSTATE = 3;

  const [currentState, setCurrentState] = React.useState(INTIALSTATE);

  const setPuzzleState = () => { setCurrentState(2); };


  return (
    <div className="App">
      {currentState === INTIALSTATE && <Homepage startPuzzle={setPuzzleState} />}
      {currentState === PUZZLESTATE && <Puzzle />}
    </div>
  );
}

export default App;
