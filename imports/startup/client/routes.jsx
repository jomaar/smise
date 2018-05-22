import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Session } from 'meteor/session';

// import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import ListPageContainer from '../../ui/containers/ListPageContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';
import WelcomePage from '../../ui/pages/SmiseWelcomePage.jsx';

// i18n.setLocale('de'); // ja

Session.set('validateInputOnChange', true);

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      { /* ja these are all route-children of */}
      <Route path="lists/:id" component={ListPageContainer} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route path="join" component={AuthPageJoin} />
      <Route path="welcome" component={WelcomePage} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
