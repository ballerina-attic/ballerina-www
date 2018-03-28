import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import Console from '../console/Console';
import LaunchManager, { COMMANDS, EVENTS, MSG_TYPES } from 'launch-manager';
import { getLauncherURL } from '../../utils';
import './RunButton.scss';


class RunButton extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            runInProgress: false,
        }
        this.onStop = this.onStop.bind(this);
        this.onRun = this.onRun.bind(this);
        LaunchManager.init(getLauncherURL());
        LaunchManager.on(EVENTS.CONSOLE_MESSAGE_RECEIVED, ({ type, message }) => {
            if (message === 'running program completed' || message === 'program terminated'
                    || message === 'running program'
                    ) {
            } else if (type === 'ERROR' || type === 'DATA') {
                this.appendToConsole(message);
            } else if (type === 'INFO') {
                this.appendToConsole(message);
            } else if (type === 'BUILD_ERROR') {
                this.appendToConsole(message);
                this.setState({
                    runInProgress: false,
                });
            }
        });
        LaunchManager.on(EVENTS.SESSION_ERROR, (err) => {
            this.setConsoleText('error connecting to remote server ');
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
        const { onError } = this.props;
        this.setConsoleText(err);
        onError(err);
    }

    onRun() {
        const { sample, onRun } = this.props;
        if (sample && sample.content) {
            const { content, source, curl, noOfCurlExecutions = 1 } = sample;
            this.clearConsole();
            this.setConsoleText('waiting on remote server...');
            this.setState({
                runInProgress: true,
            });
            try {
                LaunchManager.sendRunSourceMessage('samples', source, content, curl, noOfCurlExecutions);
                onRun(sample);
            } catch (err) {
                this.onError(err);
            }
        }
    }

    onStop() {
        const { sample, onStop } = this.props;
        try {
            LaunchManager.stop();
            onStop(sample);
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
            <Button
                className="run-button"
                onClick={runInProgress ? this.onStop : this.onRun}
                fluid
                basic
                disabled={!(sample && sample.content)} >
                <span>{ runInProgress ? 'Stop' : 'Run' }</span>
            </Button>
        );
    }
}

RunButton.propTypes = {
    sample: PropTypes.shape({
        name: PropTypes.string.isRequired,
        source: PropTypes.string.isRequired
    }),
    consoleRef: PropTypes.instanceOf(Console),
    onStop: PropTypes.func,
    onRun: PropTypes.func,
    onError: PropTypes.func
};

RunButton.defaultProps = {
    sample: undefined,
    consoleRef: undefined,
    onStop: () => {},
    onRun: () => {},
    onError: () => {},
};
  
export default RunButton;