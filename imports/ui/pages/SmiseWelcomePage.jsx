import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import MobileMenu from '../components/MobileMenu.jsx';
import Message from '../components/Message.jsx';

class WelcomePage extends BaseComponent {
  render() {

    return (
      <div className="page welcome">
        <nav>
          <MobileMenu />
        </nav>
        <div className="content-scrollable">
          <Message
            imageUrl={'/smise-gsso.svg'}
            title={i18n.__('pages.welcomePage.welcome')}
            subtitle={i18n.__('pages.welcomePage.welcomeSubtitle')}
            details={'Für Interessierte gibt es einen Demo-Zugang mit dem Benutzername "Demo" und dem Passwort "willkommen" (jeweils ohne die Anführungzeichen). Wenn Sie Interesse daran haben diese Anwendung für Ihre Erforderisse zu konfigurieren, dürfen Sie sich gerne unter joerg.arnold@smise.net an mich wenden.'}
            imageBottomUrl={'/Schiebeeinheit.png'}
          />
        </div>
      </div>
    );
  }
}

export default WelcomePage;
