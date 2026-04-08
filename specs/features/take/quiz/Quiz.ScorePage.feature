Feature: Quiz score page display
  After completing a quiz, the score page displays each question with its
  answer options, the user's selection, and explanations.

  Scenario Outline: Show question on score page
    Given workspace "Score Display" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And quiz "Display Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Display Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see the question "<question>"

    Examples:
      | question                            |
      | What is the standard colour of sky? |
      | What is capital of France?          |

  Scenario: Show options of question on score page
    Given workspace "Score Options" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And quiz "Options Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Options Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see all options for question "Sky"

  Scenario: Show question explanation of question on score page
    Given workspace "Score Explanation" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And quiz "Explanation Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Explanation Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see question explanation "Rayleigh" for question "Sky"

  Scenario: Show user select
    Given workspace "Score Select" with questions
      | bookmark | question                            | answers                              | explanation |
      | Sky      | What is the standard colour of sky? | Red, Blue (*), Green, Black          | Rayleigh    |
      | France   | What is capital of France?          | Marseille, Lyon, Paris (*), Toulouse |             |
    And quiz "Select Quiz" with all questions
      | pass score | 85 |
    Given I start quiz "Select Quiz"
    When I answer "Blue"
    * I answer "Marseille"
    * I evaluate the quiz
    Then I see user select "Blue" for question "Sky"
