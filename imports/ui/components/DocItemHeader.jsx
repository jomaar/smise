import React from 'react';
import classnames from 'classnames';
import BaseComponent from './BaseComponent.jsx';

export default class DocItemHeader1 extends BaseComponent {

  render() {
    const { title, level } = this.props;

    const docItemHeader1Class = classnames({
      'list-item': false,
      [`level${level}`]: true,
    });

    function escapeHTML(data) {
      return { __html: data };
    }

    return (
      <h1 className={docItemHeader1Class}>
        <p dangerouslySetInnerHTML={escapeHTML(title)} />
      </h1>
    );
  }
}
