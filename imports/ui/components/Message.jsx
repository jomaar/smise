import React from 'react';

const Message = ({ imageUrl, title, subtitle, details, imageBottomUrl }) => (
  <div className="wrapper-message">
    {imageUrl ? <img className="image-message" src={imageUrl} alt={'Message-Icon'} /> : null}
    {title ? <div className="title-message">{title}</div> : null}
    {subtitle ? <div className="subtitle-message">{subtitle}</div> : null}
    {details ? <div className="details-message">{details}</div> : null}
    {imageBottomUrl ? <img className="image-bottom-message" src={imageBottomUrl} alt={'Message-Icon'} /> : null}
  </div>
);

Message.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  details: React.PropTypes.string,
};

export default Message;
