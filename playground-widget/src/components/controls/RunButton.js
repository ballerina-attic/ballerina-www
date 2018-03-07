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
        LaunchManager.on(EVENTS.CONSOLE_MESSAGE_RECEIVED, ({ type, message }) => {
            if (message === 'running program completed' || message === 'program terminated'
                    || message === 'running program') {
            } else if (type === 'ERROR' || type === 'DATA') {
                this.appendToConsole(message);
            } else if (type === 'INFO') {
                this.setConsoleText(message);
            } else if (type === 'BUILD_ERROR') {
                this.appendToConsole(message);
                this.setState({
                    runInProgress: false,
                });
            }
        });
        LaunchManager.on(EVENTS.SESSION_ERROR, (err) => {
            this.setConsoleText('Error connecting to remote server ');
            this.setState({
                runInProgress: false,
            });
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

    onError(err) {
        this.setConsoleText(err);
    }

    onRun() {
        const { sample } = this.props;
        if (sample && sample.content) {
            const { content, source } = sample;
            this.setConsoleText('Waiting on remote server...');
            this.setState({
                runInProgress: true,
            });
            try {
                LaunchManager.sendRunSourceMessage('samples', source, content);
            } catch (err) {
                this.onError(err);
            }
        }
    }

    onStop() {
        try {
            LaunchManager.stop();
        } catch (err) {
            this.onError(err);
        }
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
                    fluid
                    basic
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