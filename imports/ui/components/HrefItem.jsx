import React from 'react'
import classnames from 'classnames'
import BaseComponent from './BaseComponent.jsx'

export default class HrefItem extends BaseComponent {

  render() {
    const { title, url } = this.props

    const HrefItemClass = classnames({
      'list-item': true,
      'href-item': true,
    })
    return (
      <div className={'list-item'}>
        <a className={HrefItemClass} href={url} target="_blank">
          {title}
        </a>
      </div>
    )
  }
}

