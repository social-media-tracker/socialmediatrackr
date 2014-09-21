'use strict'

describe 'Controller: TaskCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  TaskCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    TaskCtrl = $controller 'TaskCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
