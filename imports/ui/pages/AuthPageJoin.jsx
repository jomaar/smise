import React from 'react';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';

import AuthPage from './AuthPage.jsx';

export default class JoinPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { errors: {} });
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const password = this.password.value;
    const confirm = this.confirm.value;
    const username = this.username.value;  //ja
    const projectId = this.projectId.value;
    const errors = {};
    const profile = {"organization": "M1IM1", "timeFrame": "2016/17", "projectId": projectId};

    // console.log(profile);

    if (!password) {
      errors.password = i18n.__('pages.authPageJoin.passwordRequired');
    }
    if (confirm !== password) {
      errors.confirm = i18n.__('pages.authPageJoin.passwordConfirm');
    }
    if (!username) {
      errors.username = i18n.__('pages.authPageJoin.usernameRequired');
    }
    if (!projectId) {
      errors.projectId = i18n.__('pages.authPageJoin.projectIdRequired');
    }    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }


    Accounts.createUser({
      // email,
      username,
      password,
      profile,
    }, (err) => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">
          {i18n.__('pages.authPageJoin.join')}
        </h1>
        <p className="subtitle-auth">
          {i18n.__('pages.authPageJoin.joinReason')}
        </p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('username')}`}>
            <input
              type="text"
              name="username"
              ref={(c) => { this.username = c; }}
              placeholder={i18n.__('pages.authPageJoin.yourUsername')}
            />
            <span
              className="icon-edit"
              title={i18n.__('pages.authPageJoin.yourUsername')}
            />
          </div>

          <div className={`input-symbol ${errorClass('projectId')}`}>
            <input
              type="text"
              name="projectId"
              ref={(c) => { this.projectId = c; }}
              placeholder={i18n.__('pages.authPageJoin.yourProjectId')}
            />
            <span
              className="icon-edit"
              title={i18n.__('pages.authPageJoin.yourUsername')}
            />
          </div>          <div className={`input-symbol ${errorClass('password')}`}>
            <input
              type="password"
              name="password"
              /* Use the `ref` callback to store a reference to the text input DOM element in this.password */
              ref={(c) => { this.password = c; }}
              placeholder={i18n.__('pages.authPageJoin.password')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.password')}
            />
          </div>
          <div className={`input-symbol ${errorClass('confirm')}`}>
            <input
              type="password"
              name="confirm"
              ref={(c) => { this.confirm = c; }}
              placeholder={i18n.__('pages.authPageJoin.confirmPassword')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.confirmPassword')}
            />
          </div>
          <button type="submit" className="btn-primary">
            {i18n.__('pages.authPageJoin.joinNow')}
          </button>
        </form>
      </div>
    );

    const link = (
      <Link to="/signin" className="link-auth-alt">
        {i18n.__('pages.authPageJoin.haveAccountSignIn')}
      </Link>
    );

    return <AuthPage content={content} link={link} />;
  }
}

JoinPage.contextTypes = {
  router: React.PropTypes.object,
};
