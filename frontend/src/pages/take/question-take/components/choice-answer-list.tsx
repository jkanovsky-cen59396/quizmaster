import type { AnswerIdxs } from '#model/question.ts'

import { Answer } from './answer.tsx'
import { useQuestionKeyboardShortcuts } from '../use-keyboard-shortcuts.ts'

interface ChoiceAnswerListProps {
    readonly questionId: number
    readonly answers: string[]
    readonly explanations: string[]
    readonly correctAnswers: AnswerIdxs
    readonly isMultipleChoice: boolean
    readonly showFeedback: (idx: number) => boolean
    readonly onSelectedAnswerChange: (idx: number, selected: boolean) => void
    readonly isAnswerChecked: (idx: number) => boolean
    readonly submitAndNotify: (overrideAnswers?: AnswerIdxs) => void
    readonly hasAnswer: boolean
}

export const ChoiceAnswerList = (props: ChoiceAnswerListProps) => {
    useQuestionKeyboardShortcuts({
        enabled: true,
        onDigitPressed: idx => {
            if (idx >= 0 && idx < props.answers.length) {
                props.onSelectedAnswerChange(idx, true)
                if (!props.isMultipleChoice) props.submitAndNotify([idx])
            }
        },
        onEnterPressed: () => {
            if (props.hasAnswer) props.submitAndNotify()
        },
    })

    return (
        <ul className="answers">
            {props.answers.map((answer, idx) => (
                <Answer
                    key={answer}
                    isMultipleChoice={props.isMultipleChoice}
                    idx={idx}
                    questionId={props.questionId}
                    answer={answer}
                    isCorrect={props.correctAnswers.includes(idx)}
                    explanation={props.explanations ? props.explanations[idx] : 'not defined'}
                    showFeedback={props.showFeedback(idx)}
                    onAnswerChange={props.onSelectedAnswerChange}
                    isAnswerChecked={props.isAnswerChecked}
                />
            ))}
        </ul>
    )
}
