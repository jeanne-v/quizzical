import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import QuizItem from "./QuizItem";

export default function App() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [quizItems, setQuizItems] = useState("");
  const [formData, setFormData] = useState({});
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [userScore, setUserScore] = useState([]);
  const [fetchError, setFetchError] = useState("");

  function startGame() {
    setIsGameOn(true);
    if (userScore.length !== 0) {
      setUserScore([]);
    }
  }

  // fetch questions (and prepare formData object) when the game starts
  useEffect(() => {
    if (isGameOn) {
      fetch("https://opentdb.com/api.php?amount=5&category=23")
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.status);
          }
          setFetchError("");
          return res.json();
        })
        .then((data) => {
          const resultsArray = data.results;

          function shuffleArray(array) {
            // FISHER YATES ALGORITHM
            for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              const k = array[i];
              array[i] = array[j];
              array[j] = k;
            }

            return array;
          }

          const quizArray = resultsArray.map((result) => {
            const wrongAnswersArray = result.incorrect_answers.map((answer) => {
              return {
                answer: decode(answer),
                isCorrect: false,
              };
            });

            const allAnswersArray = [
              ...wrongAnswersArray,
              {
                answer: decode(result.correct_answer),
                isCorrect: true,
              },
            ];

            return {
              question: decode(result.question),
              answers: shuffleArray(allAnswersArray),
              id: nanoid(),
            };
          });
          setQuizItems(quizArray);

          const formFields = {};
          quizArray.forEach((quizItem) => {
            formFields[quizItem.id] = "";
          });
          setFormData(formFields);
        })
        .catch((error) => {
          setFetchError(error.message);
        });
    }
  }, [isGameOn]);

  function handleChange(e) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [e.target.name]: e.target.value,
      };
    });
    setUserErrorMessage("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (userScore.length !== 0) {
      startGame();
    } else {
      const areAllQuestionsAnswered = Object.values(formData).every((field) => {
        return field !== "";
      });
      if (areAllQuestionsAnswered) {
        checkAnswers();
      } else {
        setUserErrorMessage("Please answer all questions !");
      }
    }
  }

  function checkAnswers() {
    setIsGameOn(false);

    const results = quizItems.map((item) => {
      const userAnswer = item.answers.find(
        (answer) => answer.answer === formData[item.id]
      );
      return userAnswer.isCorrect;
    });
    setUserScore(results);
  }

  // render start
  if (isGameOn === false && userScore.length === 0) {
    return (
      <main>
        <div className="start-content">
          <h1 className="start-content__heading">Quizzical</h1>
          <p className="start-content__des">
            Test your history knowledge with questions from the Open Trivia
            Database !
          </p>
          <button onClick={startGame} className="start-content__btn">
            Start quiz
          </button>
        </div>
      </main>
    );
  }

  // render fetch error
  if (fetchError) {
    if (fetchError === "429") {
      return (
        <main>
          <div className="error-content">
            <h1 className="error-content__heading">
              Sorry, something went wrong
            </h1>
            <p className="error-content__code">
              Error {fetchError}: Too Many Requests
            </p>
            <p className="error-content__des">
              It seems you sent too many requests in a short amount of time. The
              Open Trivia Database API can be accessed only once every 5
              seconds.
            </p>
          </div>
        </main>
      );
    }
    return (
      <main>
        <div className="error-content">
          <h1 className="error-content__heading">
            Sorry, something went wrong
          </h1>
          <p className="error-content__code">Error {fetchError}</p>
        </div>
      </main>
    );
  }

  // render quiz

  const quizEls = quizItems
    ? quizItems.map((item) => {
        const itemFormData = formData[item.id];
        return (
          <QuizItem
            question={item.question}
            answers={item.answers}
            key={item.id}
            id={item.id}
            handleChange={handleChange}
            formData={itemFormData}
            userScore={userScore}
          />
        );
      })
    : "";

  let quizBottomSection = "";

  if (userScore.length === 0) {
    quizBottomSection = (
      <div className="quiz__submit">
        {userErrorMessage && <p className="quiz__error">{userErrorMessage}</p>}
        <button className="quiz__btn">Check answers</button>
      </div>
    );
  } else {
    let total = 0;
    userScore.forEach((correction) => {
      if (correction) {
        total++;
      }
    });
    quizBottomSection = (
      <div className="quiz__results">
        <p className="quiz__total">You scored {total}/5 correct answers</p>
        <button className="quiz__new-game-btn">Play again</button>
      </div>
    );
  }

  return (
    <main>
      <form className="quiz" onSubmit={handleSubmit} noValidate>
        <div className="quiz__main-content">{quizEls}</div>
        {quizBottomSection}
      </form>
    </main>
  );
}
