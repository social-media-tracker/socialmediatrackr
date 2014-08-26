'use strict'

describe 'Controller: ChecklistCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ChecklistCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ChecklistCtrl = $controller 'ChecklistCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
