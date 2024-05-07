import { nanoid } from "nanoid";
import "./QuizItem.css";

export default function QuizItem(props) {
  const answersEls = props.answers.map((answer) => {
    const answerId = nanoid();

    const isOnCorrectionMode = props.userScore.length === 0 ? false : true;

    let classes = "quiz__answer";

    if (isOnCorrectionMode) {
      if (answer.isCorrect) {
        classes += " quiz__answer--correct";
      } else if (!answer.isCorrect && props.formData === answer.answer) {
        classes += " quiz__answer--wrong";
      } else {
        classes += " quiz__answer--other-answers";
      }
    } else {
      if (props.formData === answer.answer) {
        classes += " quiz__answer--checked";
      }
    }

    function handleKeyUp(e) {
      if (!isOnCorrectionMode) {
        if (e.code === "Enter" || e.code === "Space") {
          props.handleChange(props.id, answer.answer);
        }
      }
    }

    return (
      <label
        htmlFor={answerId}
        className={classes}
        key={answerId}
        tabIndex="0"
        role="radio"
        aria-label={
          isOnCorrectionMode
            ? `${answer.answer}, ${
                answer.isCorrect ? "correct" : "incorrect"
              } answer`
            : answer.answer
        }
        aria-checked={props.formData === answer.answer}
        aria-disabled={isOnCorrectionMode}
        onKeyUp={handleKeyUp}
      >
        <input
          type="radio"
          name={props.id}
          value={answer.answer}
          id={answerId}
          required
          onChange={() => props.handleChange(props.id, answer.answer)}
          checked={props.formData === answer.answer}
          disabled={isOnCorrectionMode}
        />
        <span id={`${answerId}-text`} className="quiz__answer-text">
          {answer.answer}
        </span>
      </label>
    );
  });
  return (
    <fieldset className="quiz__item">
      <legend className="quiz__question">{props.question}</legend>
      <div className="quiz__answers" role="radiogroup">
        {answersEls}
      </div>
    </fieldset>
  );
}
