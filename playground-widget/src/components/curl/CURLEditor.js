import React from 'react';
import PropTypes from 'prop-types';
import './CURLEditor.css';
/**
 * CURL editor
 */
class Console extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
          content: ''
        }
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div className='curl-editor'>
                arguements, e.g. val 1, val 2 
            </div>
        );
    }
}

Console.propTypes = {
    onChange: PropTypes.func,
};

Console.defaultProps = {
    onChange: () => {},
};

export default Console;
