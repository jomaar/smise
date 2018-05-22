import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js'
import { Lists } from '../lists/lists.js'

class TodosCollection extends Mongo.Collection {
  insert (doc, callback) {
    const ourDoc = doc
    ourDoc.createdAt = ourDoc.createdAt || new Date()
    //ja ourDoc.measuredValue = 99;
    // console.log("ourDoc");
    // console.log(ourDoc);
    const result = super.insert(ourDoc, callback)
    incompleteCountDenormalizer.afterInsertTodo(ourDoc)
    return result
  }

  update (selector, modifier) {
    const result = super.update(selector, modifier)
    incompleteCountDenormalizer.afterUpdateTodo(selector, modifier)
    return result
  }

  remove (selector) {
    const todos = this.find(selector).fetch()
    const result = super.remove(selector)
    incompleteCountDenormalizer.afterRemoveTodos(todos)
    return result
  }
}

export const Todos = new TodosCollection('Todos')

// Deny all client-side updates since we will be using methods to manage this collection
Todos.deny({
  insert () { return true },
  update () { return true },
  remove () { return true },
})

Todos.schema = new SimpleSchema({
  listId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  itemNo: {
    type: Number,
    max: 100,
    denyUpdate: true, // ja
  },
  itemType: {
    type: String,
    max: 100,
    denyUpdate: true, // ja
  },
  description: {
    type: String,
    max: 2000,
    denyUpdate: true, // ja
  },
  nominalSize: {  // ja
    type: Number,
    min: 0,
    denyUpdate: true, // ja
    optional: true,
    defaultValue: 0,
  },
  upperDeviation: {  // ja
    type: Number,
    denyUpdate: true, //ja
    optional: true,
    defaultValue: 0,
  },
  lowerDeviation: {  // ja
    type: Number,
    denyUpdate: true, // ja
    optional: true,
    defaultValue: 0,
  },
  measuredValue: {  // ja
    type: String,
    defaultValue: '>',
    optional: true,
  },
  measuredValueState: {
    type: String,
    max: 40,
    optional: true,
    allowedValues: ['not_yet_measured', 'good', 'rejected'],
  },
  measuredValue2: {  // ja
    type: String,
    optional: true,
    defaultValue: '>',
  },
  measuredValueState2: {
    type: String,
    max: 40,
    optional: true,
    allowedValues: ['not_yet_measured', 'good', 'rejected'],
  },
  relevance: {  // ja
    type: Number,
    denyUpdate: true, // ja
    defaultValue: 5,
  },
  url: {  // ja
    type: String,
    denyUpdate: true, // ja
    optional: true,
  },
  text: {  // ja
    type: String,
    denyUpdate: true, // ja
    optional: true,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  checked: {
    type: Boolean,
    defaultValue: false,
  },
});

Todos.attachSchema(Todos.schema)

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
//ja If you find yourself repeating the fields often, it makes sense
// to factor out a dictionary of public fields that you can always filter by,
// like so:  (guide.meteor.com/security.html)
Todos.publicFields = {
  listId: 1,
  itemNo: 1,
  itemType: 1,
  description: 1,
  text: 1,
  nominalSize: 1,
  upperDeviation: 1,
  lowerDeviation: 1,
  measuredValue: 1,
  measuredValueState: 1,
  measuredValue2: 1,
  measuredValueState2: 1,
  relevance: 1,
  url: 1,
  createdAt: 1,
  checked: 1,
};

Todos.helpers({
  list() {
    return Lists.findOne(this.listId)
  },
  editableBy (userId) {
    return this.list().editableBy(userId)
  },
});
