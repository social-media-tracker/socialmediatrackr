'use strict'

describe 'Controller: UsersCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  UsersCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UsersCtrl = $controller 'UsersCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
