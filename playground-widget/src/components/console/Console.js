import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import './Console.css';


/**
 * Console component
 */
class Console extends React.Component {

    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.messageCache = [];
        this.appendDebounced =  _.debounce(() => {
            this.setState({ messages: this.messageCache });
        },
        400);
        this.onTryItClick = this.onTryItClick.bind(this);
    }

    /**
     * set
     */
    clearAndPrint(msg) {
        this.messageCache = [];
        this.messageCache.push(msg)
        this.appendDebounced();
    }

    /**
     * append to console
     */
    append(msg) {
        this.messageCache.push(msg);
        this.appendDebounced();
    }

    /**
     * clear console
     */
    clear() {
        this.messageCache = [];
        this.setState({
            messages: [],
        });
    }

    onTryItClick() {
        this.props.onTryItClick();
    }

    /**
     * @inheritDoc
     */
    render() {
        const consoleAreaHeight = this.props.curlVisible ? 104 : 132;
        return (
            <div className='console-area'>
                <Scrollbars style={{ width: 448, height: consoleAreaHeight }}>
                    {this.state.messages.map((msg) => {
                        // if (msg.startsWith('started services at')) {
                        //     return (
                        //         <div>{msg}
                        //             <span>
                        //                 <a className="try-it-btn" onClick={this.onTryItClick}>try-it</a>
                        //             </span>
                        //         </div>);
                        // }
                        return (<div className="console-line">{msg}</div>)
                    })}
                </Scrollbars>
            </div>
        );
    }
}

Console.propTypes = {
    onChange: PropTypes.func,
    onTryItClick: PropTypes.func,
    curlVisible: PropTypes.bool,
};
export default Console;
