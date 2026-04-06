package cz.scrumdojo.quizmaster.question;

import jakarta.validation.constraints.NotBlank;

public record QuestionRequest(
    @NotBlank String question,
    String[] answers,
    int[] correctAnswers,
    String[] explanations,
    String questionExplanation,
    boolean isEasy,
    String imageUrl,
    Double tolerance
) {
    public Question toEntity(String workspaceGuid) {
        return Question.builder()
            .question(question)
            .answers(answers)
            .correctAnswers(correctAnswers)
            .explanations(explanations)
            .questionExplanation(questionExplanation)
            .isEasy(isEasy)
            .workspaceGuid(workspaceGuid)
            .imageUrl(imageUrl)
            .tolerance(tolerance)
            .build();
    }
}
