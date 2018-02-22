import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import Console from '../console/Console';
import LaunchManager from 'launch-manager';

// TODO: Read this from an env config
const LAUNCHER_URL = 'ws://127.0.0.1:9091/composer/ballerina/launcher';

class RunButton extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            runInProgress: false,
        }
        this.onRun = this.onRun.bind(this);
        LaunchManager.init(LAUNCHER_URL)
        LaunchManager.on('print-message', (data) => {
            this.setConsoleText(data.message);
        });
        LaunchManager.on('execution-ended', () => {
            this.setState({
                runInProgress: false,
            });
        });
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
            consoleRef.append(messsage);
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

    render() {
        const { sample } = this.props;
        return (
            <Button
                onClick={this.onRun}
                disabled={this.state.runInProgress || !(sample && sample.content)} >
                Run
            </Button>
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