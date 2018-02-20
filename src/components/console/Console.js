import React from 'react';
import {} from 'semantic-ui-react'

class Console extends React.Component {
    render() {
      return (
      <Container text>
        <Segment.Group>
          <Segment>
            <div className="ballerina-code-editor">
              <CodeEditor />
            </div>
          </Segment>
          <Segment>Content</Segment>
        </Segment.Group>
      </Container>
      );
    }
  }
  
  export default Console;