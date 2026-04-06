package cz.scrumdojo.quizmaster.attempt;

import cz.scrumdojo.quizmaster.common.ResponseHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attempt")
public class AttemptController {

    private final AttemptRepository attemptRepository;

    public AttemptController(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttemptResponse> getAttempt(@PathVariable Integer id) {
        return ResponseHelper.okOrNotFound(
                attemptRepository.findById(id).map(AttemptResponse::from)
        );
    }

    @PostMapping
    public ResponseEntity<AttemptResponse> createAttempt(@RequestBody AttemptRequest request) {
        Attempt attempt = attemptRepository.save(request.toEntity());
        return ResponseEntity.ok(AttemptResponse.from(attempt));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AttemptResponse> patchAttempt(@PathVariable Integer id, @RequestBody AttemptPatchRequest request) {
        return attemptRepository.findById(id)
                .map(attempt -> {
                    if (request.correctAnswers() != null) attempt.setCorrectAnswers(request.correctAnswers());
                    if (request.incorrectAnswers() != null) attempt.setIncorrectAnswers(request.incorrectAnswers());
                    if (request.timedOutAt() != null) attempt.setTimedOutAt(request.timedOutAt());
                    if (request.finishedAt() != null) attempt.setFinishedAt(request.finishedAt());
                    return ResponseEntity.ok(AttemptResponse.from(attemptRepository.save(attempt)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
