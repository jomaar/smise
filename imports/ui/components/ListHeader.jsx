/* global confirm */

import React from 'react';
import i18n from 'meteor/universe:i18n';
import { Session } from 'meteor/session';
import BaseComponent from './BaseComponent.jsx';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';
import { Document, Page } from 'react-pdf';


export default class ListHeader extends BaseComponent {
  constructor(props) {
    super(props);

    this.toggleOnChangeOnBlur = this.toggleOnChangeOnBlur.bind(this);
  }

  toggleOnChangeOnBlur() {
    Session.set('validateInputOnChange', !Session.get('validateInputOnChange'));
    // das ist Mist!!!!!
    this.forceUpdate();
    // console.log(Session.get('validateInputOnChange'));
  }


  renderDefaultHeader() {
    const { list } = this.props;
    const calliperMode = Session.get('validateInputOnChange') ?
      i18n.__('components.listHeader.keyboardInput') :
      i18n.__('components.listHeader.usbInput');

    return (
      <div>
        <MobileMenu />
        <h1 className="title-page">
          <span className="title-wrapper">{list.name}</span>
          <span className="count-list">{list.incompleteCount}</span>
          <span className="calliper-mode" onClick={this.toggleOnChangeOnBlur}>{calliperMode}</span>
          { /* <span className="link-wrapper"><a href="Zeichnungssatz_Schiebeeinheit_v163o.pdf">Zeichnungssatz</a></span> */}
        </h1>
      </div>
    );
  }


  render() {
    return (
      <nav className="list-header">
        {this.renderDefaultHeader()}
      </nav>
    );
  }
}

ListHeader.propTypes = {
  list: React.PropTypes.object,
  onToggleOnChangeOnBlurChange: React.PropTypes.bool,
};

ListHeader.contextTypes = {
  router: React.PropTypes.object,
};
