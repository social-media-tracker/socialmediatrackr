'use strict'

describe 'Service: activity', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  activity = undefined
  beforeEach inject (_activity_) ->
    activity = _activity_

  it 'should do something', ->
    expect(!!activity).toBe true
