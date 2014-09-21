'use strict'

describe 'Controller: TasksCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  TasksCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    TasksCtrl = $controller 'TasksCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
