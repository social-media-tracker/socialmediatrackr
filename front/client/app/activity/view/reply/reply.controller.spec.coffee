'use strict'

describe 'Controller: ReplyCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ReplyCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ReplyCtrl = $controller 'ReplyCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
