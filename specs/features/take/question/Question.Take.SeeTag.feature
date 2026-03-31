Feature: Take a question - tag is hidden from taker
  Questions can have a tag at the start of the title enclosed in square brackets,
  e.g. "[geografie] Which countries are in Europe?".
  The quizmaker uses tags for filtering, but the taker must not see the tag.

  Scenario: Taker does not see the tag in the question title
    Given a question "[geografie] Which countries are in Europe?"
    * with answers:
      | Italy   | * |
      | Morocco |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see question title "Which countries are in Europe?"

  Scenario: Brackets not at the start are not treated as a tag
    Given a question "Which [geografie] countries are in Europe?"
    * with answers:
      | Italy   | * |
      | Morocco |   |
    * saved and bookmarked as "Europe"

    When I take question "Europe"
    Then I see question title "Which [geografie] countries are in Europe?"
