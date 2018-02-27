import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import Console from '../console/Console';
import LaunchManager, { COMMANDS, EVENTS, MSG_TYPES } from 'launch-manager';

// TODO: Read this from an env config
const LAUNCHER_URL = 'ws://127.0.0.1:9091/composer/ballerina/launcher';

class RunButton extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            runInProgress: false,
        }
        this.onStop = this.onStop.bind(this);
        this.onRun = this.onRun.bind(this);
        LaunchManager.init(LAUNCHER_URL)
        LaunchManager.on(EVENTS.CONSOLE_MESSAGE_RECEIVED, (data) => {
            this.appendToConsole(data.message);
        });
        LaunchManager.on(EVENTS.EXECUTION_ENDED, () => {
            this.setState({
                runInProgress: false,
            });
        });
    }

    clearConsole() {
        const { consoleRef } = this.props;
        if (consoleRef) {
            consoleRef.clear();
        }
    }

    appendToConsole(messsage, type = 'INFO') {
        const { consoleRef } = this.props;
        if (consoleRef) {
            consoleRef.append(messsage);
        }
    }

    setConsoleText(messsage, type = 'INFO') {
        const { consoleRef } = this.props;
        if (consoleRef) {
            consoleRef.clearAndPrint(messsage);
        }
    }

    onRun() {
        const { sample } = this.props;
        if (sample && sample.content) {
            this.setConsoleText('Waiting on remote server...');
            this.setState({
                runInProgress: true,
            });
            LaunchManager.sendRunSourceMessage(sample.content);
        }
    }

    onStop() {
        LaunchManager.stop();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sample !== nextProps.sample
            && this.state.runInProgress) {
            this.onStop();
        }
    }

    render() {
        const { sample } = this.props;
        const { runInProgress } = this.state;
        return (
            <div>
                <Button
                    onClick={runInProgress ? this.onStop : this.onRun}
                    disabled={!(sample && sample.content)} >
                    { runInProgress ? 'Stop' : 'Run' }
                </Button>
            </div>
        );
    }
}

RunButton.propTypes = {
    sample: PropTypes.shape({
        name: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired
    }),
    consoleRef: PropTypes.instanceOf(Console)
};

RunButton.defaultProps = {
    sample: undefined,
    consoleRef: undefined,
};
  
export default RunButton;