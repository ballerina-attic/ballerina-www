import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import BallerinaWidget from './BallerinaWidget';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BallerinaWidget />, document.getElementById('root'));
registerServiceWorker();
