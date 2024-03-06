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

    return (
      <label htmlFor={answerId} className={classes} key={answerId}>
        <input
          type="radio"
          name={props.id}
          value={answer.answer}
          id={answerId}
          required
          onChange={props.handleChange}
          checked={props.formData === answer.answer}
          disabled={isOnCorrectionMode}
        />
        <span className="quiz__answer-text">{answer.answer}</span>
      </label>
    );
  });
  return (
    <fieldset className="quiz__item">
      <legend className="quiz__question">{props.question}</legend>
      <div className="quiz__answers">{answersEls}</div>
    </fieldset>
  );
}
