import React, { Component } from 'react';
import {
  Container, Segment
} from 'semantic-ui-react'
import CodeEditor from './components/editor/CodeEditor';
import './BallerinaWidget.css';

class BallerinaWidget extends Component {
  render() {
    return (
    <Container text>
      <Segment.Group>
        <Segment>
          <div className="ballerina-code-editor">
            <CodeEditor />
          </div>
        </Segment>
      </Segment.Group>
    </Container>
    );
  }
}

export default BallerinaWidget;
