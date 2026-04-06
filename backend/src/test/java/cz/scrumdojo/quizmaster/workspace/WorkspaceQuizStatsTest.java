package cz.scrumdojo.quizmaster.workspace;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.question.Question;
import cz.scrumdojo.quizmaster.quiz.Quiz;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkspaceQuizStatsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void emptyStatsForQuizWithNoAttempts() throws Exception {
        Workspace workspace = fixtures.save(fixtures.workspace());
        Question q1 = fixtures.save(fixtures.questionIn(workspace));
        Question q2 = fixtures.save(fixtures.questionIn(workspace));
        Quiz quiz = fixtures.save(fixtures.quiz(q1, q2).workspaceGuid(workspace.getGuid()).randomQuestionCount(null).build());

        mockMvc.perform(get("/api/workspaces/{guid}/quizzes/{id}/stats", workspace.getGuid(), quiz.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                    {
                        "summary": { "started": 0, "finished": 0, "unfinished": 0, "timeout": 0 },
                        "attempts": []
                    }
                """));
    }

    @Test
    public void derivesSummaryAndAttemptFields() throws Exception {
        Workspace workspace = fixtures.save(fixtures.workspace());
        Question q1 = fixtures.save(fixtures.questionIn(workspace));
        Question q2 = fixtures.save(fixtures.questionIn(workspace));
        Quiz quiz = fixtures.save(fixtures.quiz(q1, q2).workspaceGuid(workspace.getGuid()).randomQuestionCount(null).build());
        fixtures.save(fixtures.attempt(quiz).correctAnswers(1).incorrectAnswers(1));

        mockMvc.perform(get("/api/workspaces/{guid}/quizzes/{id}/stats", workspace.getGuid(), quiz.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attempts[0].totalQuestions").value(2))
                .andExpect(jsonPath("$.attempts[0].correctAnswers").value(1))
                .andExpect(jsonPath("$.attempts[0].incorrectAnswers").value(1))
                .andExpect(jsonPath("$.attempts[0].score").value(50))
                .andExpect(jsonPath("$.summary.started").value(1))
                .andExpect(jsonPath("$.summary.finished").value(1));
    }

    @Test
    public void nonExistentQuizReturns404() throws Exception {
        Workspace workspace = fixtures.save(fixtures.workspace());

        mockMvc.perform(get("/api/workspaces/{guid}/quizzes/{id}/stats", workspace.getGuid(), -1))
                .andExpect(status().isNotFound());
    }
}
