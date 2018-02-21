import React, { Component } from 'react';
import {
  Container, Segment, Grid, Header
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import CodeEditor from './components/editor/CodeEditor';
import SamplesList from './components/navigation/SamplesList'
import './BallerinaWidget.css';
import { fetchSamples, fetchSample } from './samples/provider'
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
        this.consoleRef.append('Samples Loaded.');
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
  }

  onCurrentSampleContentChange(newContent) {
    const sample = this.state.samples[this.state.selectedIndex];
    sample.content = newContent;
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
      {sample &&
        <Segment.Group>
          <Segment>
              <Grid container stackable>
                <Grid.Column width={10}>
                  <div className="ballerina-widget-sample-name">
                    <Header as='h3'>{sample.name}</Header>
                  </div>
                </Grid.Column>
                <Grid.Column width={6}>
                  <div className="ballerina-samples-navigator">
                    <SamplesList samples={samples} onSelect={this.onSampleSelect} />
                  </div>
                </Grid.Column>
              </Grid>  
          </Segment>
          <Segment>
            <div className="ballerina-code-editor">
              <CodeEditor
                content={sample.content || ''}
                onChange={this.onCurrentSampleContentChange}
              />
            </div>
          </Segment>
          <Segment>
            <Grid container stackable>
              <Grid.Column width={13}>
                <div className="ballerina-widget-console">
                  <Console
                    ref={(consoleRef) => {
                      this.consoleRef = consoleRef;
                    }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={3}>
                  <div className="ballerina-widget-controls">
                    <RunButton />
                  </div>
              </Grid.Column>
            </Grid>
          </Segment> 
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
