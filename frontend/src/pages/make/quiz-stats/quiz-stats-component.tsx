import type { Quiz } from '#model/quiz.ts'
import type { AttemptStatsRecord, QuizStatsResponse } from '#model/stats.ts'
import './quiz-stats-component.scss'

export interface QuizStatsProps {
    readonly quiz: Quiz
    readonly stats: QuizStatsResponse
}

const formatDuration = (durationSeconds: number): string => {
    if (durationSeconds < 60) {
        return `${durationSeconds} second${durationSeconds !== 1 ? 's' : ''}`
    }

    const minutes = Math.floor(durationSeconds / 60)
    const seconds = durationSeconds % 60

    if (minutes < 60) {
        if (seconds === 0) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`
        }
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0 && seconds === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`
    }
    if (seconds === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
    }
    if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} ${seconds} second${seconds !== 1 ? 's' : ''}`
}

const statusLabels: Record<string, string> = {
    FINISHED: 'Finished',
    IN_PROGRESS: 'In Progress',
    TIMEOUT: 'Timeout',
    ABANDONED: 'Abandoned',
}

const formatStatus = (status: string): string => statusLabels[status] ?? status

const formatWithPercentage = (value: number, total: number): string => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0
    return `${value} (${percentage}%)`
}

export const QuizStats = ({ quiz, stats }: QuizStatsProps) => {
    const { summary, attempts } = stats

    return (
        <div className="quiz-stats">
            <h2>Statistics for quiz: {quiz.title}</h2>
            <table data-testid="summary-stats-table">
                <caption>Summary</caption>
                <thead>
                    <tr>
                        <th>Started</th>
                        <th>Finished</th>
                        <th>Unfinished</th>
                        <th>Timeout</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{summary.started}</td>
                        <td>{summary.finished}</td>
                        <td>{summary.unfinished}</td>
                        <td>{summary.timeout}</td>
                    </tr>
                </tbody>
            </table>
            <table data-testid="attempt-stats-table">
                <caption>Attempts</caption>
                <thead>
                    <tr>
                        <th>Duration</th>
                        <th>Points</th>
                        <th>Correct Answers</th>
                        <th>Incorrect Answers</th>
                        <th>Score</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attempts.map((attempt: AttemptStatsRecord) => (
                        <tr key={attempt.id}>
                            <td>{attempt.durationSeconds != null ? formatDuration(attempt.durationSeconds) : ''}</td>
                            <td>{`${attempt.correctAnswers}/${attempt.totalQuestions}`}</td>
                            <td>{formatWithPercentage(attempt.correctAnswers, attempt.totalQuestions)}</td>
                            <td>{formatWithPercentage(attempt.incorrectAnswers, attempt.totalQuestions)}</td>
                            <td>{attempt.score}</td>
                            <td>{formatStatus(attempt.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
