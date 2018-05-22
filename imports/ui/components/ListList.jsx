/* global alert */

import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { insert } from '../../api/lists/methods.js';
import { Session } from 'meteor/session'; // XXX: SESSION


export default class ListList extends BaseComponent {
  constructor(props) {
    super(props);
    this.createNewList = this.createNewList.bind(this);
  }

  createNewList() {
    const { router } = this.context;
    const listId = insert.call({ locale: i18n.getLocale() }, (err) => {
      if (err) {
        router.push('/');
        /* eslint-disable no-alert */
        alert(i18n.__('components.listList.newListError'));
      }
    });
    router.push(`/lists/${listId}`);
  }

  // ja close menu when clicking on list
  onLinkClick() {
    // ja console.log("List link clicked");
    Session.set("menuOpen", false);
  }

  render() {
    const { lists } = this.props;
    return (
      <div className="list-todos">
        {lists.map(list => (
          <Link
            to={`/lists/${list._id}`}
            key={list._id}
            title={list.name}
            className="list-todo"
            activeClassName="active"
            onClick={this.onLinkClick}
          >
            {list.incompleteCount
              ? <span className="count-list">{list.incompleteCount}</span>
              : null}
            {list.name}
          </Link>
        ))}
      </div>
    );
  }
}

ListList.propTypes = {
  lists: React.PropTypes.array,
};

ListList.contextTypes = {
  router: React.PropTypes.object,
};
