Feature: Numerical question result on quiz score page
  After evaluating a quiz, each numerical question is displayed with a green
  bar showing the correct answer. When the user's value differs from it, a
  second bar is shown below: yellow when the value falls within the tolerance
  band, red when it lies outside.

  Background:
    Given workspace "Numerical Result" with questions
      | bookmark | question                | answers |
      | Regions  | How many regions of CZ? | 5 ±2    |
    And quiz "Numerical Result Quiz" with all questions
      | pass score | 100 |

  Scenario: Exact answer shows only the correct bar
    When I start the quiz
    * I answer "5"
    * I evaluate the quiz
    Then I see the correct answer bar "5" for question "How many regions of CZ?"
    And I do not see my answer bar for question "How many regions of CZ?"

  Scenario: Answer within tolerance shows correct bar and yellow user bar
    When I start the quiz
    * I answer "6"
    * I evaluate the quiz
    Then I see the correct answer bar "5" for question "How many regions of CZ?"
    And I see my answer bar "6" within tolerance for question "How many regions of CZ?"

  Scenario: Answer outside tolerance shows correct bar and red user bar
    When I start the quiz
    * I answer "9"
    * I evaluate the quiz
    Then I see the correct answer bar "5" for question "How many regions of CZ?"
    And I see my answer bar "9" as incorrect for question "How many regions of CZ?"
