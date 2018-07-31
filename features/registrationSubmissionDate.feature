@registrationSubmissionDate_SDB-236
Feature: As Dani I need to be able to see the date Catelyn submitted her registration so I know how long she has been uninspected for

    Scenario:
        Given I have a new registration with all valid required fields
        When I submit it to the backend
        Then I get a success response