package cz.scrumdojo.quizmaster.question;

import cz.scrumdojo.quizmaster.TestFixtures;
import cz.scrumdojo.quizmaster.workspace.Workspace;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class QuestionTakeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestFixtures fixtures;

    @Test
    public void getQuestion() throws Exception {
        Workspace workspace = fixtures.save(fixtures.workspace());
        Question question = fixtures.save(fixtures.questionIn(workspace));

        mockMvc.perform(get("/api/question/{id}", question.getId()))
            .andExpect(status().isOk())
            .andExpect(content().json("""
                {
                    "question": "What is the capital of Italy?",
                    "answers": ["Naples", "Rome", "Florence", "Palermo"],
                    "correctAnswers": [1],
                    "explanations": ["No", "Correct!", "No", "No"],
                    "isEasy": false
                }
                """));
    }

    @Test
    public void nonExistingQuestionReturnsNotFound() throws Exception {
        mockMvc.perform(get("/api/question/{id}", -1))
            .andExpect(status().isNotFound());
    }
}
