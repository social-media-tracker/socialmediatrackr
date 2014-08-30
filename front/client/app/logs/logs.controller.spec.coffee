'use strict'

describe 'Controller: LogsCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  LogsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    LogsCtrl = $controller 'LogsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
