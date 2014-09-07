'use strict'

describe 'Service: SharedData', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  SharedData = undefined
  beforeEach inject (_SharedData_) ->
    SharedData = _SharedData_

  it 'should do something', ->
    expect(!!SharedData).toBe true