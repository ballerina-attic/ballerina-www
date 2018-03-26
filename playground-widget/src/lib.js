import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import BallerinaWidget from './BallerinaWidget';

module.exports = function(divId) {
    ReactDOM.render(<BallerinaWidget />, document.getElementById(divId));
}