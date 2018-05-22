import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import ListHeader from '../components/ListHeader.jsx';
import TodoItem from '../components/TodoItem.jsx';
import DurationItem from '../components/DurationItem.jsx';
import DocItemHeader1 from '../components/DocItemHeader.jsx';
import HrefItem from '../components/HrefItem.jsx';
import HtmlItem from '../components/HtmlItem.jsx';
import ImageItem from '../components/ImageItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

export default class ListPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingTodo: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null,
    });
  }

  render() {
    const {list, listExists, loading, todos} = this.props
    const {editingTodo} = this.state

    if (!listExists) {
      return <NotFoundPage/>
    }

    let Todos
    if (!todos || !todos.length) {
      Todos = (
        <Message
          title={i18n.__('pages.listPage.noTasks')}
          subtitle={i18n.__('pages.listPage.addAbove')}
        />
      )
    } else {
      // ja console todo-items
      // Todos=todos.map(todo => (console.log(todo.measuredValue)));
      Todos = todos.map(todo => {
        switch (true) {
          case (todo.itemType[0] === 'L'): {
            return (<DocItemHeader1
              key={todo._id}
              level={todo.itemType[1]}
              title={todo.description}
            />);
          }
          case (todo.itemType === 'href'): {
            return (<HrefItem
              key={todo._id}
              url={todo.url}
              title={todo.description}
            />);
          }
          case (todo.itemType === 'html'): {
            return (<HtmlItem
              key={todo._id}
              text={todo.text}
            />);
          }
          case (todo.itemType === 'image'): {
            return (<ImageItem
              key={todo._id}
              url={todo.url}
              title={todo.description}
            />);
          }
          case (todo.itemType === 'production time in minutes'): {
            return (<DurationItem
              todo={todo}
              key={todo._id}
              editing={todo._id === editingTodo}
              onEditingChange={this.onEditingChange}
              relevance={todo.relevance}
            />);
          }
          default: {
            return (<TodoItem
              todo={todo}
              key={todo._id}
              editing={todo._id === editingTodo}
              onEditingChange={this.onEditingChange}
              relevance={todo.relevance}
            />)
          }
        }
      })
    }

    return (
      <div className="page lists-show">
        <ListHeader list={list}/>
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.listPage.loading')}/>
            : Todos}
          {/*
          <div><img src="/pdf/Zeichnungssatz_Schiebeeinheit_v163o.svg"/></div>
          <a href="/pdf/Zeichnungssatz_Schiebeeinheit_v163o.pdf" target="_blank">Zichnungssatz der Schiebeeinheit</a>
          <div><object data="/pdf/Zeichnungssatz_Schiebeeinheit_v163o.pdf"></object>/></div>
          */}
        </div>
      </div>
    )
  }
}

ListPage.propTypes = {
  list: React.PropTypes.object,
  todos: React.PropTypes.array,
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
}
