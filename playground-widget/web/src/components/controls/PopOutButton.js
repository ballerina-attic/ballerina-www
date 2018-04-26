import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import './PopOutButton.scss';
import btnPopOut from './btn-popout.svg';

class PopOutButton extends React.Component {
    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <div
                className="btn-popout"
            >
                <img src={btnPopOut} />
                <span>pop-out</span>
            </div>
        );
    }
}

export default PopOutButton;