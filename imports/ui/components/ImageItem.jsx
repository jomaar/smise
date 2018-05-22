import React from 'react'
import classnames from 'classnames'
import BaseComponent from './BaseComponent.jsx'

export default class ImageItem extends BaseComponent {

  render() {
    const { title, url } = this.props;

    const ImageItemClass = classnames({
      'list-item': true,
      'image-item': true,
    })
    return (
        <img className={ImageItemClass} src={url}/>
    )
  }
}

