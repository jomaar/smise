import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';

import {
  setCheckedStatus,
  updateUnlimitedValue,
  remove,
} from '../../api/todos/methods.js';

export default class DurationItem extends BaseComponent {
  constructor(props) {
    super(props);

    this.throttledUpdate = _.throttle((value) => {
      // ja if blocks the update of the last character in the input field
      updateUnlimitedValue.call({
        todoId: this.props.todo._id,
        measuredValue: value,
      }, displayError); // displays client error
    }, 300);

    this.setTodoCheckStatus = this.setTodoCheckStatus.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  // onEditingChange is a state of parent component ListPage
  onFocus() {
    this.props.onEditingChange(this.props.todo._id, true);
    // console.log('onChange: ' + Session.get('validateInputOnChange'));
  }

  // no event parameter with onChange
  // solution for calliper input
  onBlur(event) {
    this.throttledUpdate(event.target.value);
    this.props.onEditingChange(this.props.todo._id, false);
  }

  setTodoCheckStatus(event) {
    setCheckedStatus.call({
      todoId: this.props.todo._id,
      newCheckedStatus: event.target.checked,
    });
  }

  updateTodo(event) {
    // this.setState({measuredValue: event.target.value});
    this.throttledUpdate(event.target.value);
    // console.log('value: '+ event.target.value);
  }

  deleteTodo() {
    remove.call({ todoId: this.props.todo._id }, displayError);
  }

  render() {
    const { todo, editing } = this.props;
    const itemRelevance = 'relevance' + todo.relevance;

    //console.log(itemRelevance);

    let todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing,
    });

    //todoClass = todoClass + ' relevance' + todo.relevance;
    //console.log(todoClass);

    let Input;
      Input = (
        <input
          id={this.props.todo._id}
          className={"measured-value " + todo.measuredValueState}
          type="text"
          value={todo.measuredValue}
          placeholder={i18n.__('components.todoItem.measuredValue')}
          onChange={this.updateTodo}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      );

    function escapeHTML(data) {
      return {__html: data}
    }

    return (
      <div className={todoClass}>
        <div className="item-no">{todo.itemNo.toString()} </div>
        <div className={itemRelevance}>
          <p dangerouslySetInnerHTML={escapeHTML(todo.description)} />
        </div>
        {Input}
      </div>
    );
  }
}

DurationItem.propTypes = {
  todo: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};

