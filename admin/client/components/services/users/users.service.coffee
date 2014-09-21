'use strict'

angular.module 'meanApp'
.factory 'Users', (User) ->

  userMap = {}
  loaded = false

  # Public API here
  loadUsers: ->
    return if loaded
    User.getAll {}, (res) ->
      for u in res
        userMap[u._id] = u
      loaded = true

  user: (id) ->
    userMap[id]

  name: (id) ->
    userMap[id]?.name

  getUserMap: ->
    userMap