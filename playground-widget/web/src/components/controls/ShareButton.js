import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button/Button';
import 'semantic-ui-css/components/button.min.css';
import './ShareButton.scss';

class ShareButton extends React.Component {

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