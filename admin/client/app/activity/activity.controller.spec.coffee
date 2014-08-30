'use strict'

describe 'Controller: AdminActivityCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  AdminActivityCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    AdminActivityCtrl = $controller 'AdminActivityCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
