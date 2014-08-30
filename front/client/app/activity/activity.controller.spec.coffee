'use strict'

describe 'Controller: ActivityCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ActivityCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ActivityCtrl = $controller 'ActivityCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
