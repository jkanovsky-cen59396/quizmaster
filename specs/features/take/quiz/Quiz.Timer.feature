Feature: Run timer
  Quizzes with a time limit display a countdown timer. When time expires,
  a "Game over" dialog appears and the quiz is automatically evaluated
  with whatever answers have been submitted so far.


  Scenario Outline: Countdown timer counts down and shows timeout message
    Given a quiz "Quiz" with 2 questions
      | time limit | <time limit> |

    When I start the quiz
    Then I see the countdown timer "<start>"

    When <x> seconds pass
    Then I see the countdown timer "<after x>"

    When <y> seconds pass
    Then I see the countdown timer "<after y>"

    When <remaining> seconds pass
    Then I should see the text "Game over time"

    Examples:
      | time limit | start | x  | after x | y  | after y | remaining |
      | 60s        | 01:00 | 10 | 00:50   | 20 | 00:30   | 30        |
      | 120s       | 02:00 | 30 | 01:30   | 45 | 00:45   | 45        |


  Scenario: Display score 0 when no answers were given
    Given workspace "Timer" with questions
      | bookmark  | question                                 | answers              |
      | Planet    | Which planet is known as the Red Planet? | Mars (*), Venus      |
      | Australia | What's the capital city of Australia?     | Sydney, Canberra (*) |
    And a quiz "Quiz A" with questions "Planet, Australia"
      | pass score | 85   |
      | time limit | 120s |
    Given I start quiz "Quiz A"
    When I will wait for "02:00"
    And I should see the text "Game over time"
    Then I see the "Game over" dialog
    And I confirm the "Game over" dialog
    Then I should see the results table
    Then I see the result 0 correct out of 2, 0%, failed, required passScore 85%

  Scenario: Display score 1/2 when answered one correctly and timed out
    Given workspace "Timer" with questions
      | bookmark  | question                                 | answers              |
      | Planet    | Which planet is known as the Red Planet? | Mars (*), Venus      |
      | Australia | What's the capital city of Australia?     | Sydney, Canberra (*) |
    And a quiz "Quiz A" with questions "Planet, Australia"
      | pass score | 85   |
      | time limit | 120s |
    Given I start quiz "Quiz A"
    When I answer "Mars"
    Then I will wait for "02:00"
    And I should see the text "Game over time"
    Then I see the "Game over" dialog
    And I confirm the "Game over" dialog
    Then I should see the results table
    Then I see the result 1 correct out of 2, 50%, failed, required passScore 85%
