import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { Session } from 'meteor/session'; // XXX: SESSION

export default class UserMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { open: false });
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

  // ja close menu when clicking on list
  onLinkClick() {
    Session.set("menuOpen", false);
  }


  renderLoggedIn() {
    const { open } = this.state;
    const { user, logout } = this.props;
    // ja const email = user.emails[0].address;
    // ja const emailLocalPart = email.substring(0, email.indexOf('@'));
    // ja const userLable = user.username;

    return (
      <div className="user-menu vertical">
        <a href="#toggle" className="btn-secondary" onClick={this.toggle}>
          {open
            ? <span className="icon-arrow-up" />
            : <span className="icon-arrow-down" />}
            {/* ja {emailLocalPart} */}
            {user.username}, {user.profile.projectId}
        </a>
        {open
          ? <a className="btn-secondary" onClick={logout}>
            {i18n.__('components.userMenu.logout')}
          </a>
          : null}
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <div className="user-menu">
        <Link to="/signin" className="btn-secondary" onClick={this.onLinkClick}>
          {i18n.__('components.userMenu.login')}
        </Link>
        <Link to="/join" className="btn-secondary" onClick={this.onLinkClick}>
          {i18n.__('components.userMenu.join')}
        </Link>
      </div>
    );
  }

  render() {
    return this.props.user
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

UserMenu.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};
