import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  default as Thing,
  other
} from '../thing';

class View extends React.Component {
  render () {
    let { isClosable } = this.props;
    if (foo && bar) { doSomething(); }
    if (bar !== '3') { doSomethingElse(); }
    return (
      <div className="WhatTheHell" val={4 + 'wat'}>
        {isClosable && <Button onClose={onClose} />}
        <div className={`huh }{}} huh`}>foo</div>
      </div>
    );
  }
}

function OtherView ({ text }) {
  return <div>{text}</div>
}

export default View;

function InfoWindow () {
  return (
    <InfoWindow onCloseClick={onClose} willOpen={true} width={100} handler={s => s.state} {...otherProps}>
      <section className="ActivePointInfoWindow">
        <header className="ActivePointInfoWindow__point-name">{shortName}</header>
        {includeFoo && <Foo className="troz" />}

        <InfoWindowDirections directions={directions} />
        <InfoWindowShops shops={shops} />
        <InfoWindowWalkScore walkscore={walkscore} />
      </section>
    </InfoWindow>
  );
}
