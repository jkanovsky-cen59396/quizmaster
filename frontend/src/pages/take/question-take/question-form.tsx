import './question-form.scss'
import React from 'react'

import { isNumericalQuestion, type AnswerIdxs, type Question, compareAnswers, calculateScore } from '#model/question.ts'
import type { QuizMode, Difficulty } from '#model/quiz.ts'
import { Form } from '#pages/components'
import { useQuestionTakeState, QuestionCorrectness, QuestionExplanation } from '#pages/take/question-take'

import { ChoiceAnswerList } from './components/choice-answer-list.tsx'
import { NumericalAnswerInput } from './components/numerical-answer-input.tsx'
import { QuestionScore } from './components/question-score.tsx'
import { shouldShowAnswerCount, stripTag } from './question-display.ts'

export interface QuestionFormProps {
    readonly question: Question
    readonly selectedAnswerIdxs?: AnswerIdxs
    readonly onSubmitted?: (selectedAnswerIdxs: AnswerIdxs) => void
    readonly onAnswerSelected?: (selectedAnswerIdxs: AnswerIdxs) => void
    readonly mode: QuizMode
    readonly quizDifficulty?: Difficulty
}

export const QuestionForm = (props: QuestionFormProps) => {
    const { correctAnswers, isEasy, answers, questionExplanation } = props.question
    const { onSubmitted, onAnswerSelected } = props
    const isNumerical = isNumericalQuestion(props.question)

    const state = useQuestionTakeState(props)
    const score = calculateScore(compareAnswers(state.selectedAnswerIdxs, correctAnswers))
    const showFeedback = (idx: number) => state.isMultipleChoice || state.selectedAnswerIdxs[0] === idx

    const submitAndNotify = React.useCallback(
        (overrideAnswers?: AnswerIdxs) => {
            state.submit()
            onSubmitted?.(overrideAnswers ?? state.selectedAnswerIdxs)
        },
        [state, onSubmitted],
    )

    React.useEffect(() => {
        onAnswerSelected?.(state.selectedAnswerIdxs)
    }, [state.selectedAnswerIdxs, onAnswerSelected])

    const handleSubmit = () => {
        if (state.hasAnswer) submitAndNotify()
    }

    const isAnswerChecked = state.hasAnswer

    const showCorrectAnswersCount = shouldShowAnswerCount(state.isMultipleChoice, isEasy, props.quizDifficulty)

    return (
        <Form onSubmit={handleSubmit} id="question-form">
            <fieldset className="question-fieldset" name={`question-${props.question.id}`}>
                <legend>
                    <h1 id="question">{stripTag(props.question.question)}</h1>
                </legend>

                {showCorrectAnswersCount && (
                    <div>
                        Correct answers count is{' '}
                        <strong className="correct-answers-count">{correctAnswers.length}</strong>
                    </div>
                )}

                {!!props.question.imageUrl && (
                    <img src={props.question.imageUrl} alt="question" className="question-image" />
                )}

                {isNumerical ? (
                    <NumericalAnswerInput value={state.numericalAnswer} onChange={state.onNumericalAnswerChange} />
                ) : (
                    <ChoiceAnswerList
                        questionId={props.question.id}
                        answers={answers}
                        explanations={props.question.explanations}
                        correctAnswers={correctAnswers}
                        isMultipleChoice={state.isMultipleChoice}
                        showFeedback={idx => state.submitted && showFeedback(idx) && props.mode === 'learn'}
                        onSelectedAnswerChange={state.onSelectedAnswerChange}
                        isAnswerChecked={state.isAnswerChecked}
                        submitAndNotify={submitAndNotify}
                        hasAnswer={state.hasAnswer}
                    />
                )}

                {!state.submitted && (
                    <input type="submit" value="Submit" className="submit-btn" disabled={!isAnswerChecked} />
                )}
                {state.submitted && props.mode === 'learn' && (
                    <>
                        <QuestionCorrectness score={score} />
                        <QuestionScore score={score} />
                        <QuestionExplanation text={questionExplanation} />
                    </>
                )}
            </fieldset>
        </Form>
    )
}
