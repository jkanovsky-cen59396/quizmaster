package cz.scrumdojo.quizmaster.quiz;

import java.time.LocalDateTime;

public final class QuizAvailability {

    private QuizAvailability() {
    }

    public static boolean isAvailable(Quiz quiz, LocalDateTime now) {
        return isAvailable(quiz.getStartAt(), quiz.getEndAt(), now);
    }

    public static boolean isAvailable(LocalDateTime startAt, LocalDateTime endAt, LocalDateTime now) {
        if (startAt != null && now.isBefore(startAt)) return false;
        if (endAt != null && now.isAfter(endAt)) return false;
        return true;
    }
}
