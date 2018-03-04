/* global locale */
import React, { Component } from 'react';

import t from '../../../translations';

export default class Investigations extends Component {

  render() {
    return (
      <div className="container">
        <h1>{t('REACT BOILERPLATE')}{locale}</h1>
      </div>
    );
  }
}
