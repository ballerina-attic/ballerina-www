import React from 'react';
import PropTypes from 'prop-types';
import './CURLEditor.css';
import tryItRefreshBtn from './try-it-refresh.svg';

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
                <div className="curl-string">{`curl -X POST --data "Hello" http://0.0.0.0:9090/echo`}</div>
                {/* <div className="curl-btn"><img className="try-it-refresh-btn" src={tryItRefreshBtn} /></div> */}
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
