Feature: Application should start from open a new position screen

  Background: There is no open positions


    Scenario: John opens the application
      Given He hasn't open positions
      When He opens application
      Then He should see "Open a Leveraged ETH position" screen



