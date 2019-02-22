# Using the IntelliJ Ballerina Plugin

Click the links below to start using the IntelliJ Ballerina plugin after [installing it](#intellij-plugin-doc.md).

- [Creating a new Ballerina project](#creating-a-new-ballerina-project)
- [Creating a new Ballerina file](#creating-a-new-ballerina-file)
- [Running Ballerina files](#running-ballerina-files)
- [What's next?](#what's-next)

## Creating a new Ballerina project

Follow the steps below to create a new Ballerina project.

1. Open the editor, click **File** in the top menu, click **New**, and then click **Project**.

2. Select **Ballerina** as the type of the project, and click **Next**.
![Install the plugin via IntelliJ IDEA](images/select-project-type.png)

3. Select a Ballerina SDK for the project, and click **Next**.

    > **Tip:** If you do not have an already-configured Ballerina SDK to select, [configfure a new Ballerina SDK](#set-up-ballerina-sdk.md).

    ![Select a Ballerina SDK](images/select-sdk.png)

4. Enter a name for the project, a location to save it, and click **Finish**.

    ![Enter project name and location](images/enter-project-name-and-location.png)

Now, you have successfully created a new Ballerina project.

![New Ballerina project](images/new-ballerina-project.png)

## Creating a new Ballerina file

Follow the steps below to create a new Ballerina file within a Ballerina project.

1. Right-click on the name of the project, click **New**, and then click **Ballerina File**.

    ![Create a new Ballerina file](images/create-new-ballerina-file.png)

2. Enter a name for the file, and click **OK**. 

    > **Tip:** In this example, since the default **Main** template is selected as the **Kind**, it creates a new file with a main function.

    ![Select the type of the file template](images/select-file-kind.png)

Now, you have successfully created a new Ballerina file with a **main** function.

![New Ballerina file with a main function](images/new-ballerina-file-with-main-function.png)


## Running Ballerina files

Click on the below links for instructions on how to run different elements of a Ballerina file.

- [Running the main method](#running-the-main-method)
- [Running Ballerina services](#running-ballerina-services)

### Running the main method

Follow the steps below to run the main function of a Ballerina file.

1. Click the green color icon located near the main function.

    ![Click the Run Application icon](images/run-application-icon.png)

2. Click the corresponding **Run *<FILE_NAME>*** command.

    ![Click the Run command](images/select-run-command.png)

This executes the main function of the Ballerina file and displays the output in the **Run** window.

![Output of running the main function](images/output-of-main-function.png)

> **Tip:** Alternatively, you can right click on the name of the file and run the main method of it.

### Running Ballerina services

Follow the steps below to run a service of a Ballerina file.

1. Click the green color icon located near the definition of the service.

2. Click the corresponding **Run *<FILE_NAME>*** command.

This starts the service and displays the output in the **Run** window. If you have multiple services in the Ballerina file, this starts all of them.

![Output of running a service](images/output-of-ballerina-service.png)

> **Tip:** Alternatively, you can right click on the name of the file and run the service(s) of it.

## What's next?

Next, for information on using the features of the IntelliJ Ballerina plugin, see [Using the IntelliJ plugin features](#using-interllij-plugin-features).