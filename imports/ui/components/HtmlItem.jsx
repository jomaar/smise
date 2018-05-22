import React from 'react';
import classnames from 'classnames';
import BaseComponent from './BaseComponent.jsx';

export default class HtmlItem extends BaseComponent {

  render() {
    const { text } = this.props;

    const HtmlItemClass = classnames({
      'list-item': true,
      'html-item': true,
    });

    function escapeHTML(data) {
      return { __html: data };
    }

    return (
      <div className={HtmlItemClass}>
        <p dangerouslySetInnerHTML={escapeHTML(text)} />
      </div>
    );
  }
}

