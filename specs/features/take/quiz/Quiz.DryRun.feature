Feature: Quiz dry run
  A quiz maker can dry-run their own quiz to preview it as a taker would.
  Dry-run attempts are excluded from statistics and bypass the quiz's scheduled
  availability window. Time limit and all other quiz rules still apply.


  Scenario: Maker starts a dry run from the workspace
    Given workspace "Preview" with questions
      | bookmark | question  | answers   |
      | Q1       | 1 + 1 = ? | 2 (*), 3  |
      | Q2       | 2 + 2 = ? | 4 (*), 5  |
    And quiz "Quiz" with questions "Q1, Q2"
    When I start a dry run of quiz "Quiz"
    Then I see the welcome page
    * I see a dry-run indicator
    * I can start the quiz


  Scenario: Dry run ignores scheduling before the availability window
    Given workspace "Preview" with questions
      | bookmark | question  | answers   |
      | Q1       | 1 + 1 = ? | 2 (*), 3  |
      | Q2       | 2 + 2 = ? | 4 (*), 5  |
    And quiz "Quiz" with questions "Q1, Q2"
      | start date | today + 1 |
      | end date   | today + 2 |
    When I start a dry run of quiz "Quiz"
    Then I see the welcome page
    * I see a dry-run indicator
    * I can start the quiz
