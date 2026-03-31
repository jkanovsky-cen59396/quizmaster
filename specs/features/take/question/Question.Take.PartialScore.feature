Feature: Take a question with partial score
  Partial scoring for multiple choice questions rewards partially correct answers.
  - All correct answers selected: 1 point
  - One error (wrong selected or correct missing): 0.5 points
  - More than one error: 0 points

  Background:
    Given a question "Which of the following are planets?"
    * with answers:
      | Mars    | * |
      | Pluto   |   |
      | Titan   |   |
      | Venus   | * |
      | Earth   | * |
    * mark question as partially scored
    * saved and bookmarked as "Planets"

  Scenario Outline: Multiple choice question with score
    Question is scored as follows:
    - all correct answers gives 1 point
    - one incorrect answer selected gives 0.5 point
    - more than one incorrect answer selected gives 0 point

    When I take question "Planets"
    And I answer "<answer>"
    Then I see score "Score: <score>"
    And I see feedback "<feedback>"
    Examples:
      | answer                    | score | feedback                      | description                       |
      | Mars, Venus, Earth        | 1     | Correct!                      | all correct answers               |
      | Mars, Venus, Titan, Earth | 0.5   | Partially correct! (1 error)  | one incorrect answer              |
      | Mars, Venus               | 0.5   | Partially correct! (1 error)  | one correct answer missing        |
      | Mars, Pluto               | 0     | Incorrect!                    | two missing, one incorrect answer |
      | Mars, Pluto, Venus, Titan | 0     | Incorrect!                    | two incorrect answers             |
      | Pluto, Titan              | 0     | Incorrect!                    | two incorrect answers             |
