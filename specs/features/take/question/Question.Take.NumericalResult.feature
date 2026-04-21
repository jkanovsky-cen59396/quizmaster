Feature: Numerical question result display
  After submitting a numerical answer, the user sees a visual breakdown of
  the result. The correct answer is always shown in a green bar. When the
  user's value differs from the correct one, a second bar appears below it:
  yellow when the value is within the tolerance band, red when it is outside.

  Scenario: Exact correct answer shows only the correct bar
    Given question "How many regions does Czechia have?"
      * with numerical answer "5"
      * with tolerance "2"
      * saved and bookmarked as "regions"
    When I take question "regions"
    And I enter "5"
    Then I see the correct answer bar "5"
    And I do not see my answer bar

  Scenario: Answer within tolerance shows correct bar and yellow user bar
    Given question "How many regions does Czechia have?"
      * with numerical answer "5"
      * with tolerance "2"
      * saved and bookmarked as "regions"
    When I take question "regions"
    And I enter "6"
    Then I see the correct answer bar "5"
    And I see my answer bar "6" within tolerance

  Scenario: Answer outside tolerance shows correct bar and red user bar
    Given question "How many regions does Czechia have?"
      * with numerical answer "5"
      * with tolerance "2"
      * saved and bookmarked as "regions"
    When I take question "regions"
    And I enter "9"
    Then I see the correct answer bar "5"
    And I see my answer bar "9" as incorrect
