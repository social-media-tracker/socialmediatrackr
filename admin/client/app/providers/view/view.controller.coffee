'use strict'

angular.module 'meanApp'
.controller 'ViewProviderCtrl', [
  '$scope'
  '$state'
  '$stateParams'
  'user' # resolved by route
  'ProviderStor' #special "provider selected" service
  'Task' # Tasks API 
  'Cat' # Categories API 
  'Template' # Templates API 
  'User' # User API 
  ($scope, $state, $stateParams, user, ProviderStor, Task, Cat, Template, User) ->

    $scope.id = $stateParams.id
    console.log 'ViewProviderCtrl'
    console.log 'user', user
    $scope.user = user
    ProviderStor.provider = user
    $scope.$state = $state

    $scope.clients = User.ids({ids:ProviderStor.provider.provider_clients.join(',')})

    $scope.$watch 'user.provider_clients.length', (cc) ->
      console.log '$watch fired: user.provider_clients', cc
      $scope.clients = User.ids({ids:ProviderStor.provider.provider_clients.join(',')})

    $scope.filters = {
      client: {_id: 0},
      cat: 0
    }

    getTasks = ->
      console.log 'getTasks', $scope.filters
      q = {provider: ProviderStor.provider._id}
      q.client = $scope.filters.client if $scope.filters.client
      q.cat = $scope.filters.cat if $scope.filters.cat
      console.log q
      $scope.tasks = Task.query(q)

    $scope.$watch 'filters', (f) ->
      getTasks()

    $scope.setFilter = (filter, val) ->
      console.log 'setFilter', filter, val
      if (filter == 'client._id')
        $scope.filters.client._id = val
        $scope.ctrl.isOpen.client = false
      else
        $scope.filters[filter] = val
        $scope.ctrl.isOpen[filter] = false
      getTasks();

    $scope.cats = Cat.tasks()
    # Cat.tasks (res) ->
    #   d = []
    #   for r in res
    #     d.push {id:r._id,name:r.name}

    #   console.log res
    #   $scope.cats = res
    
    $scope.templates = Template.tasks()
    $scope.ctrl = 
      showTaskForm: false
      editing: false
      usingTemplateTask: false
      selectedCatId: 0
      isOpen: {cat: false, client: false}

    resetTaskForm = ->
      $scope.task = {
        cat: '',
        message: '',
        client: 0,
        saveAsTemplate: false
      }

    resetTaskForm()

    $scope.isActive = (subView) ->
      path = 'providers.view';
      path += '.' + subView unless subView == ''
      $state.is(path)

    $scope.showTasks = ->
      $state.is('providers.view')

    $scope.formHeading = ->
      if $scope.ctrl.editing then 'Edit Task' else 'Add Task'

    $scope.addTaskClick = ->
      if $scope.ctrl.editing
        $scope.ctrl.editing = false
        resetTaskForm()
      else if $scope.ctrl.showTaskForm 
        return $scope.ctrl.showTaskForm = false
      $scope.ctrl.showTaskForm = true

    $scope.submitTask = (task) ->
      console.log 'Creating Task'
      t = angular.copy(task)
      t.client = t.client._id
      t.provider = ProviderStor.provider._id
      if $scope.ctrl.selectedCatId
        t.cat = $scope.ctrl.selectedCatId
      Task.save t, (res) ->
        $scope.tasks.push(res)
        $scope.ctrl.showTaskForm = false
        resetTaskForm()

    $scope.taskSelected = ($item) ->
      console.log 'taskSelected', arguments
      $scope.ctrl.usingTemplateTask = true
      $scope.ctrl.selectedCatId = $item.cat._id
      $scope.task.cat = $item.cat.name
      $scope.task.saveAsTemplate = false

    $scope.unsetTemplateTask = ->
      $scope.ctrl.usingTemplateTask = false

    $scope.catSelected = ($item) ->
      $scope.ctrl.selectedCatId = $item._id

    $scope.completedTask = (t) ->
      t.savingCompleted = true
      if t.isCompleted
        Task.uncompleted {id:t._id}, (res) ->
          t.completedAt = 0
          t.isCompleted = false
          t.savingCompleted = false
      else
        Task.completed {id:t._id}, (res) ->
          t.completedAt = res.completedAt
          t.isCompleted = true
          t.savingCompleted = false

    $scope.deleteTask = (task) ->
      if confirm 'Are you sure you want to delete this task?  All replies will be delete with it.\n\nThis operation can not be undone.'
        Task.delete {id:task._id}, (res) ->
          tt = $scope.tasks.filter (t) ->
            return if t._id == task._id then false else t
          $scope.tasks = tt




]