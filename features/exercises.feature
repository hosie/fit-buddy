Feature: Exercise Tracking
    Users should be able to keep track of achievable targets for various exercises. Whenever performing an exercise, they can view the current target and after completing the exercise they can enter what they achieved.

    Scenario Outline: Searching for an exercise
        Given The following exercises exist
            | name              |
            | bench press       |
            | shoulder press    |
        And I navigate to exercises page
        When I search for <searchString>
        Then the filtered list is <filtered>

        Examples:
            | searchString  | filtered                       |
            | bench press   | bench press                    |
            | press         | bench press,shoulder press     |

    Scenario: Smashing it
        Given The following exercises exist
            | name              |
            | bench press       |
        And I navigate to exercises page
        And I click on exercise bench press
        And I click on finish button Smashed it
        When I enter a new target of 3*8@60kg
        Then Current target for bench press is 3*8@60kg
        And  After page reload, current target for bench press is 3*8@60kg


