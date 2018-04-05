import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import Console from '../console/Console';
import { RUN_API_URL } from '../../utils';
import RunSession from '../../run-session';
import './RunButton.scss';

const MSG_CODES = {
    BUILD_STARTED: "BUILD_STARTED",
    CURL_EXEC_STARTED: "CURL_EXEC_STARTED",
    CURL_EXEC_STOPPED: "CURL_EXEC_STOPPED",
    BUILD_ERROR: "BUILD_ERROR",
    BUILD_STOPPED: "BUILD_STOPPED",
    BUILD_STOPPED_WITH_ERRORS: "BUILD_STOPPED_WITH_ERRORS",
    EXECUTION_STARTED: "EXECUTION_STARTED",
    EXECUTION_STOPPED: "EXECUTION_STOPPED",
    PROGRAM_TERMINATED: "PROGRAM_TERMINATED",
    DEP_SERVICE_EXECUTION_STARTED: "DEP_SERVICE_EXECUTION_STARTED",
    DEP_SERVICE_EXECUTION_ERROR: "DEP_SERVICE_EXECUTION_ERROR",
    DEP_SERVICE_EXECUTION_STOPPED: "DEP_SERVICE_EXECUTION_STOPPED",
    RUN_ABORTED: "RUN_ABORTED",
};

class RunButton extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            runInProgress: false,
        }
        this.onStop = this.onStop.bind(this);
        this.onRun = this.onRun.bind(this);
        this.runSession = undefined;
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
            const { content, source, curl, noOfCurlExecutions = 1, dependantService = '' } = sample;
            this.clearConsole();
            this.setConsoleText('waiting on remote server...');
            this.setState({
                runInProgress: true,
            });
            try {
                this.runSession = new RunSession(RUN_API_URL);
                this.runSession.init({ 
                    onMessage: ({ type, message, code }) => {
                        switch (code) {
                            case MSG_CODES.DEP_SERVICE_EXECUTION_STARTED:
                            case MSG_CODES.DEP_SERVICE_EXECUTION_STOPPED:
                            case MSG_CODES.EXECUTION_STARTED:
                                    break;
                            case MSG_CODES.EXECUTION_STOPPED:
                                    this.setState({
                                        runInProgress: false,
                                    });
                                    break;
                            case MSG_CODES.PROGRAM_TERMINATED:
                                    this.setState({
                                        runInProgress: false,
                                    });
                                    break;
                            case MSG_CODES.BUILD_ERROR:
                                    this.appendToConsole(message)
                                    this.setState({
                                        runInProgress: false,
                                    });
                                    break;
                            case MSG_CODES.RUN_ABORTED:
                                    this.appendToConsole(message)
                                    this.setState({
                                        runInProgress: false,
                                    });
                                    this.runSession.close();
                                    break;
                            default: this.appendToConsole(message);
                        }
                    }, 
                    onOpen: () => {
                        this.runSession.run(source, content, curl, noOfCurlExecutions, dependantService);
                        onRun(sample);
                    },
                    onClose: () => {
                        this.setState({
                            runInProgress: false,
                        });
                        this.runSession = undefined;
                    }, 
                    onError: (err) => {
                        this.setConsoleText('error connecting to remote server ');
                        this.setState({
                            runInProgress: false,
                        });
                        this.onError(err);
                        this.runSession = undefined;
                    },
                });
            } catch (err) {
                this.onError(err);
            }
        }
    }

    onStop() {
        const { sample, onStop } = this.props;
        try {
            if (this.runSession) {
                this.runSession.stop();
            }
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