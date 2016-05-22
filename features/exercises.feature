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
