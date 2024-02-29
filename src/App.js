import { useState } from "react";
import { useEffect } from "react";

export default function App() {
  const [hasGameStarted, setHasGameStarted] = useState(false);

  function startGame() {
    setHasGameStarted(true);
  }

  if (!hasGameStarted) {
    return (
      <main>
        <div className="start-content">
          <h1 className="start-content__heading">Quizzical</h1>
          <p className="start-content__des">
            Test questions from Open Trivia Database{" "}
          </p>
          <button onClick={startGame} className="start-content__btn">
            Start quiz
          </button>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div className="quizz"></div>
    </main>
  );
}
