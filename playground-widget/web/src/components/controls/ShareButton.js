import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import './ShareButton.scss';

class ShareButton extends React.Component {
    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <Button
                className="share-button"
                fluid
                basic
            >
                { 'Share' }
            </Button>
        );
    }
}

export default ShareButton;