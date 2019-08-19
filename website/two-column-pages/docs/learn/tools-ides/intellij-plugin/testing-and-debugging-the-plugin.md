# Testing and debugging the plugin using IntelliJ IDEA

Follow the steps below to test/debug the plugin using IntelliJ IDEA.

- [Importing the project](#importing-the-project)
- [Testing and debugging the plugin](#testing-and-debugging-the-plugin)

## Importing the project

Follow the steps below to import and open the project of the plugin.

1. Clone the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) Git repository to a preferred location.

2. Open IntelliJ, click **File**, click **New**, and then click **Project from Existing Sources...**.

![select menu](../images/select-menu.png)

3. Browse and select the **<CLONED_BALLERINA_DIRECTORY>/tool-plugins/intellij/build.gradle** file and click **Open**.

4. Select **Use default gradle wrapper (recommended)** and then click **OK**.

![select Gradle home](../images/select-gradle-home.png)

## Testing and debugging the plugin

Follow the steps below to test and debug the plugin using IntelliJ.

1. In the IntelliJ top menu, click **View**, click **Tool Windows**, and then click **Gradle** to launch the **Gradle projects** window.

2. In the **Gradle projects** window, navigate to **Tasks** **->** **intellij** **->** **runIde**. 

3. Right-click on the **runIde** Task and select **Run 'intellij [runIde]'**.

![run the task](../images/run-the-runIde-task.png)

This builds the plugin and starts a new IDEA instance with the installed plugin.

>***Tip:*** Similarly, in the **Gradle projects** window, select the **runIde** Task, right-click on it and select **Debug 'intellij [runIde]'** to debug it.

## What's next?

 - For more information on the IntelliJ Ballerina plugin, see [The IntelliJ Plugin](/learn/tools-ides/intellij-plugin).
 - For information on the other tools and IDEs that are supported by Ballerina, see [Tools and IDEs](../tools-ides).