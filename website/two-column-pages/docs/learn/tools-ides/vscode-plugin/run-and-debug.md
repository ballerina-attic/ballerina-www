# Run and debug

The VS Code Ballerina plugin gives you the  same debugging experience as the conventional VS Code Debugger.

Thus, you can run or debug your Ballerina programs easily via the VS Code Ballerina plugin by launching its debugger. 

Follow the steps below to start a 
debug session. 

1. Click the **Debug** icon in the left menu or press the **Control + Shift + D** keys, to launch the Debugger view.
2. Add the debug points you require by clicking on the respective line numbers of the file.
3. Click **No Configurations** and select **Add Configuration...**. 
4. Click **Ballerina Debug**. This opens the *launch.json* file. You can edit this file to change the debug configuration options as required.
5. Click on the name of the file that you want to debug.
6. Click the **Start Debugging** icon.

You view the output in the **DEBUG CONSOLE**.

![Run and debug](/learn/images/run-and-debug.gif)

For more information on debugging your code using VS Code, go to [VS Code Documentation](https://code.visualstudio.com/docs/editor/debugging).

## Troubleshooting
- Stepping over code lines in non-blocking paths (eg: action invocations) will not pause VM on next line
    - workaround: manually put a breakpoint to next line
- There are some cases where stepping over gives unexpected behavior
    - Eg: When there are multiple workers and a wait expression waiting for them, even though step over hit and pass wait line in source, workers are not yet finished execution.

## What's next?

 - For information on the next capability of the VS Code Ballerina plugin, see [Graphical View](/learn/tools-ides//vscode-plugin/graphical-editor).
 - For information on the VS Code Ballerina plugin, see [The Visual Studio Code Plugin](/learn/tools-ides/vscode-plugin).
 - For information on the tools and IDEs that are supported by the VS Code Ballerina plugin, see [Tools and IDEs](/learn/tools-ides).

