import React, { Component } from 'react';
import {
  Container, Segment
} from 'semantic-ui-react'
import CodeEditor from './components/editor/CodeEditor';
import SamplesList from './components/navigation/SamplesList'
import './BallerinaWidget.css';
import { fetchSamples } from './samples/provider'
import Console from './components/console/Console'
import RunButton from './components/controls/RunButton';

class BallerinaWidget extends Component {

  constructor(...args) {
    super(...args);
    this.state = {
      samples: [],
      selectedIndex: 0,
    }
    this.consoleRef = undefined;
    this.onSampleSelect = this.onSampleSelect.bind(this);
  }

  componentDidMount() {
    fetchSamples()
      .then((samples) => {
        this.setState({ 
          samples
        });
        this.consoleRef.append('Samples Loaded.');
      })
  }

  onSampleSelect(selectedIndex) {
    this.setState({
      selectedIndex
    });
  }

  render() {
    const { samples, selectedIndex } = this.state;
    const sample = samples && (samples.length > 0) 
                        && (selectedIndex >= 0)
                        && (samples.length - 1 >= selectedIndex)
                    ? samples[selectedIndex]
                    : undefined;
    return (
    <Container text>
      <Segment.Group>
        <Segment>
            <div className="ballerina-samples-navigator">
              <SamplesList samples={samples} onSelect={this.onSampleSelect} />
            </div>
        </Segment>
        {sample &&
          <Segment>
            <div className="ballerina-code-editor">
              <CodeEditor content={sample.source} />
            </div>
          </Segment>
        }
        {sample &&
          <Segment>
            <div className="ballerina-widget-console">
              <Console
                ref={(consoleRef) => {
                  this.consoleRef = consoleRef;
                }}
              />
            </div>
            <div className="ballerina-widget-controls">
              <RunButton />
            </div>
          </Segment>
        }
        {!sample &&
          <p>No samples are available to display.</p>
        }
      </Segment.Group>
    </Container>
    );
  }
}

export default BallerinaWidget;
