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
            if (this.scrollBar) {
                setTimeout(() => {
                    this.scrollBar.scrollToBottom();
                }, 200);
            }
        },
        400);
        this.onTryItClick = this.onTryItClick.bind(this);
        this.scrollBar = undefined;
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
        const consoleAreaHeight = this.props.curlVisible ? 106 : 132;
        return (
            <div className='console-area'>
                <Scrollbars 
                    style={{ width: 460, height: consoleAreaHeight }}
                    ref={(scrollBar) => {
                        this.scrollBar = scrollBar;
                    }}
                >
                    {this.state.messages.map((msg, index, msgs) => {
                        if (msg === 'building...' && msgs.length > (index + 1)
                                && msgs[index + 1].startsWith('build completed in')) {
                            return (<span/>);
                        }
                        if (msg.startsWith('build completed in')) {
                            return (<div className="console-line">{'building...   ' 
                            + msg.replace('build completed in', 'deployed to kubernetes in')}</div>)
                        }
                        if (msg.startsWith('executing curl completed in')) {
                            return (
                            <div>
                                <div className="console-line">{msg.replace('executing', '')}</div>
                                <div className="console-line">{'you can edit the code or curl and try again'}</div>
                            </div>);
                        }
                        if (msg.startsWith('CURL-OUTPUT:')) {
                            return (<div className="console-line curl-output">{msg.replace('CURL-OUTPUT:', '')}</div>)
                        }
                        if (msg.startsWith('BVM-OUTPUT:')) {
                            return (<div className="console-line bvm-output">{msg.replace('BVM-OUTPUT:', '')}</div>)
                        }
                        if (msg.includes('CircuitBreaker failure threshold exceeded')) {
                            return (<div className="console-line">{'Circuit tripped : CLOSE -> OPEN'}</div>)
                        }
                        if (msg.includes('CircuitBreaker reset timeout reached')) {
                            return (<div className="console-line">{'Max circuit open timeout reached : OPEN -> HALF-OPEN'}</div>)
                        }
                        if (msg.includes('CircuitBreaker trial run  was successful')) {
                            return (<div className="console-line">{'Circuit closed : HALF-OPEN -> CLOSE'}</div>)
                        }
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
