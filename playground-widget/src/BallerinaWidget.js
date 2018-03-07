import React, { Component } from 'react';
import {
  Container, Segment, Grid, Header
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import CodeEditor from './components/editor/CodeEditor';
import SamplesList from './components/navigation/SamplesList'
import './BallerinaWidget.css';
import { fetchSamples, fetchSample } from './samples/provider'
import CURLEditor from './components/curl/CURLEditor';
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
    this.onCurrentSampleContentChange = this.onCurrentSampleContentChange.bind(this);
  }

  componentDidMount() {
    fetchSamples()
      .then((samples) => {
        this.setState({ 
          samples
        });
        this.onSampleSelect(0);
      })
  }

  onSampleSelect(selectedIndex) {
    const sample = this.state.samples[selectedIndex];
    if (sample.content) {
      this.setState({
        selectedIndex
      });
    } else {
      const { source } = sample;
      fetchSample(source)
        .then((data) => {
           sample.content = data;
           this.setState({
            selectedIndex
          });
        })
    }
    this.consoleRef.clear();
  }

  onCurrentSampleContentChange(newContent) {
    const sample = this.state.samples[this.state.selectedIndex];
    sample.content = newContent;
    this.forceUpdate();
  }

  render() {
    const { samples, selectedIndex } = this.state;
    const sample = samples && (samples.length > 0) 
                        && (selectedIndex >= 0)
                        && (samples.length - 1 >= selectedIndex)
                    ? samples[selectedIndex]
                    : undefined;
    return (
    <Container className="ballerina-playground" text>
      {sample &&
        <Segment.Group>
          <div className="ballerina-widget-sample-name">
            <span>Example : &lt;{sample.source}&gt;</span>
          </div>
          <div className="ballerina-widget-diagram">
              <img src="resources/samples/images/sample-diagram.png" />
          </div>
          <Segment>
            <div className="ballerina-code-editor">
              <CodeEditor
                content={sample.content || ''}
                onChange={this.onCurrentSampleContentChange}
              />
            </div>
            <div className="ballerina-curl-editor">
              <CURLEditor />
            </div>
            <div className="ballerina-widget-console">
              <Console
                ref={(consoleRef) => {
                  this.consoleRef = consoleRef;
                }}
              />
            </div>
          </Segment>
          <Grid container stackable>
            <Grid.Column width={13}>
              <div className="ballerina-samples-navigator">
                <SamplesList samples={samples} onSelect={this.onSampleSelect} />
              </div>
            </Grid.Column>
            <Grid.Column width={3}>
                <div className="ballerina-widget-controls">
                  <RunButton sample={sample} consoleRef={this.consoleRef} />
                </div>
            </Grid.Column>    
          </Grid>  
      </Segment.Group>
      }
        {!sample &&
          <p>No samples are available to display.</p>
        }
    </Container>
    
    );
  }
}

export default BallerinaWidget;
