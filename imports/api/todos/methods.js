import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

import { Todos } from './todos.js'
import { Lists } from '../lists/lists.js'

export const insert = new ValidatedMethod({
  name: 'todos.insert',
  validate: new SimpleSchema({
    listId: {type: String},
    description: {type: String},
  }).validator(),
  run ({listId, description}) {
    const list = Lists.findOne(listId)

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('api.todos.insert.accessDenied',
        'Cannot add todos to a private list that is not yours')
    }

    const todo = {
      listId,
      description,
      checked: false,
      createdAt: new Date(),
    }

    Todos.insert(todo)
  },
})

export const setCheckedStatus = new ValidatedMethod({
  name: 'todos.makeChecked',
  validate: new SimpleSchema({
    todoId: {type: String},
    newCheckedStatus: {type: Boolean},
  }).validator(),
  run ({todoId, newCheckedStatus}) {
    const todo = Todos.findOne(todoId)

    if (todo.checked === newCheckedStatus) {
      // The status is already what we want, let's not do any extra work
      return
    }

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('api.todos.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private list that is not yours')
    }

    Todos.update(todoId, {
      $set: {checked: newCheckedStatus},
    })
  },
})

export const updateMeasuredValue = new ValidatedMethod({
  // called by TodoItem.jsx
  name: 'todos.updateMeasuredValue',
  validate () {},
  run ({todoId, measuredValue}) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId)

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('api.todos.updateMeasuredValue.accessDenied',
        'Cannot edit todos in a private list that is not yours')
    }

    if (measuredValue) {
      function clean (string) {
        return string.replace(/[^0-9]/g, '')
      }

      measuredValue = measuredValue.replace(',', '.')
      var pos = measuredValue.indexOf('.')
      var result
      if (pos !== -1) {
        var part1 = measuredValue.substr(0, pos)
        var part2 = measuredValue.substr(pos + 1)
        measuredValue = clean(part1) + '.' + clean(part2)
      } else {
        measuredValue = clean(measuredValue)
      }
    }

    // nochmal neu fragen, falls clean das Feld leer gemacht hat
    if (!measuredValue) {
      measuredValue = '>';
    }

    let newCheckedState = false;
    let newMeasuredValueState = 'not_yet_measured';

    // '>'
    if (measuredValue === '>') {
      newMeasuredValueState = 'not_yet_measured';
      newCheckedState = false;
    }
    else {
      if (
        (parseFloat(measuredValue) >= (todo.nominalSize + todo.lowerDeviation)) &&
        (parseFloat(measuredValue) <= (todo.nominalSize + todo.upperDeviation))) {
        newMeasuredValueState = 'good'
      }
      else {
        newMeasuredValueState = 'rejected'
      }
      newCheckedState = true;
    }

    Todos.update(todoId, {
      $set: {measuredValueState: newMeasuredValueState},
    })

    Todos.update(todoId, {
      $set: {measuredValue: measuredValue || '>'},
    })

    Todos.update(todoId, {
      $set: {checked: newCheckedState},
    })

  },
})

export const updateUnlimitedValue = new ValidatedMethod({
  // called by TodoItem.jsx
  name: 'todos.updateUnlimitedValue',
  validate () {},
  run ({todoId, measuredValue}) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId)

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('api.todos.updateMeasuredValue.accessDenied',
        'Cannot edit todos in a private list that is not yours')
    }

    if (measuredValue) {
      function clean (string) {
        return string.replace(/[^0-9]/g, '')
      }

      measuredValue = measuredValue.replace(',', '.')
      var pos = measuredValue.indexOf('.')
      var result
      if (pos !== -1) {
        var part1 = measuredValue.substr(0, pos)
        var part2 = measuredValue.substr(pos + 1)
        measuredValue = clean(part1) + '.' + clean(part2)
      } else {
        measuredValue = clean(measuredValue)
      }
    }
    // nochmal neu fragen, falls clean das Feld leer gemacht hat
    if (!measuredValue) {
      measuredValue = '>';
    }

    let newCheckedState = true
    let newMeasuredValueState = 'not_yet_measured'

    // '>'
    if (measuredValue === '>') {
      newMeasuredValueState = 'not_yet_measured'
      newCheckedState = false
    }
    else {
      newMeasuredValueState = 'good'
    }

    Todos.update(todoId, {
      $set: {measuredValueState: newMeasuredValueState},
    })

    Todos.update(todoId, {
      $set: {measuredValue: measuredValue || '>'},
    })

    Todos.update(todoId, {
      $set: {checked: newCheckedState},
    })

  },
})

export const remove = new ValidatedMethod({
  name: 'todos.remove',
  validate: new SimpleSchema({
    todoId: {type: String},
  }).validator(),
  run ({todoId}) {
    const todo = Todos.findOne(todoId)

    if (!todo.editableBy(this.userId)) {
      throw new Meteor.Error('api.todos.remove.accessDenied',
        'Cannot remove todos in a private list that is not yours')
    }

    Todos.remove(todoId)
  },
})

/* Get list of all method names on Todos
   pluck_.pluck(list, propertyName)
   A convenient version of what is perhaps the most common use-case for map:
   extracting a list of property values.
   var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
   _.pluck(stooges, 'name');
   => ['moe', 'larry', 'curly']
   */
const TODOS_METHODS = _.pluck([
  insert,
  setCheckedStatus,
  updateMeasuredValue,
  updateUnlimitedValue,
  remove,
], 'name')

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name (name) {
      return _.contains(TODOS_METHODS, name)
    },

    // Rate limit per connection ID
    connectionId () { return true },
  }, 5, 1000)
}
