'use strict'

describe 'Controller: UserCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  UserCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UserCtrl = $controller 'UserCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
