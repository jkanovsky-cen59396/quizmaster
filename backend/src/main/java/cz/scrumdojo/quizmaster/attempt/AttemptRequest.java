package cz.scrumdojo.quizmaster.attempt;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AttemptRequest(
        Integer quizId,
        LocalDateTime startedAt
) {
    public Attempt toEntity() {
        return Attempt.builder()
                .quizId(quizId)
                .durationSeconds(0)
                .points(BigDecimal.ZERO)
                .score(BigDecimal.ZERO)
                .status(AttemptStatus.IN_PROGRESS)
                .maxScore(0)
                .startedAt(startedAt)
                .correctAnswers(0)
                .incorrectAnswers(0)
                .build();
    }
}
