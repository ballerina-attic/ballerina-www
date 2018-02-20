import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'

class RunButton extends React.Component {
    render() {
        return (
            <Button onClick={this.props.onClick}>
                Run
            </Button>
        );
    }
}

RunButton.propTypes = {
    onClick: PropTypes.func,
};

RunButton.defaultProps = {
    onClick: () => {},
};
  
export default RunButton;