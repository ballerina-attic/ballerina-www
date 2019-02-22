# The IntelliJ IDEA Ballerina Plugin

The IntelliJ Ballerina plugin provides the Ballerina development capabilities in IntelliJ IDEA. Click on the below links for instructions on how to download, install and use the features of the IntelliJ plugin.

- [Downloading IntelliJ IDEA](#downloading-intellij-idea)
- [Installing the plugin](#installing-the-plugin)
- [Setting up Ballerina SDK](#setting-up-Ballerina-sdk) 
- [Using the plugin](#using-the-plugin)
- [Using the features of the plugin](#using-the-features-of-the-plugin)

## Downloading IntelliJ IDEA 

Download the [IntelliJ IDEA editor](https://www.jetbrains.com/idea/download/).

## Installing the plugin

Use either of the below approaches to install the IntelliJ Ballerina plugin.

- [Installing via the IntelliJ IDEA editor](#installing-via-the-intellij-idea-editor)
- [Installing by downloading the plugin](#installing-by-downloading-the-plugin)

### Installing via the IntelliJ IDEA editor

1. Open the editor, click **IntelliJ IDEA** in the top menu, click **Preferences**, and then click **Plugins**. 

> **Tip:** If you are using Windows, click **File**, click **Settings**, and then click **Plugins**.

2. In the search bar, type "Ballerina", press the **Enter** key, 
3. Click **Install**, and then click **Accept**.
4. Click **Restart IDE**, and then click **Restart**.

![Install the plugin via IntelliJ IDEA](images/install-plugin-via-intellij.gif)

This downloads the plugin and installs it.

### Installing by downloading the plugin

1. Download the [IntelliJ Ballerina plugin](https://plugins.jetbrains.com/plugin/9520-ballerina).
2. Follow either of the below approaches to install the plugin.
- [Using the IntelliJ IDEA editor](#using-the-intellij-idea-editor)
- [Using the Command Line](#using-the-command-line)

#### Using the IntelliJ IDEA editor

1. Open the editor, click **IntelliJ IDEA** in the top menu, click **Preferences**, and then click **Plugins**. 

> **Tip:** If you are using Windows, click **File**, click **Settings**, and then click **Plugins**.

2. Click the cogwheel icon, and then click **Install plugin from disk...**.
3. Browse and select the ZIP file of the plugin you downloaded.

> **Important:** Make sure you install the ZIP file and not the extracted JAR files. This is because the ZIP file contains of an additional library that is required by the plugin to function as expected.

4. Click the **Installed** tab, click **Restart IDE**, and then click **Restart**.

![Install using the Preferences option of the editor.](images/install-via-editor-preferences.gif)

#### Using the Command Line

In a new Command Line tab, navigate to the `<BALLERINA_PLUGIN-HOME>` directory, and execute the below command.

> **Tip:** You need to install [Gradle Build Tool](£https://gradle.org/) to execute the below command.

> **Info**: In the command below, `<BALLERINA_PLUGIN-HOME>` refers to the path of the Ballerina plugin directory (i.e., the ZIP file) you downloaded.

```bash
./gradlew buildPlugin
```
> **Tip:** If you are using Windows, execute the below command:
```bash
gradlew buildPlugin
```

> **Info**: This creates the `/build/distributions/ballerina-intellij-idea-plugin-[VERSION].zip` file locally in the `ballerina-platform/ballerina-lang/tree/master/tool-plugins/intellij/tree/master/tool-plugins/intellij` directory.

## Setting up Ballerina SDK

After installing the IntelliJ Ballerina plugin, you need to [set up Ballerina SDK](set-up-ballerina-sdk.md) for your ballerina projects to activate all capabilities of the plugin. 

## Using the plugin

For information on using the IntelliJ Ballerina plugin to write Ballerina programs, see [Using the IntelliJ Ballerina plugin](#using-intellij-plugin.md)

## Using the features of the plugin

Click on the below links to find information on the various capabilities that are fascilitated by the IntelliJ Ballerina plugin for the development process.

- [Running Ballerina programs](using-intellij-plugin-features.md#running-ballerina-programs)
- [Debugging Ballerina programs](#debugging-ballerina-programs)
- [Importing modules on the fly](#importing-modules-on-the-fly)
- [Importing unambiguous modules automatically](#importing-unambiguous-modules-automatically)
- [Finding usage](#finding-usage)
- [Formatting Ballerina codes](#formatting-ballerina-codes)
- [Viewing details of parameters](viewing-details-of-parametyers)
- [Viewing documentation](#viewing-documentation)
- [Adding annotation fields via suggestions](#adding-annotation-fields-via-suggestions)
- [Using file templates](#using-file-templates)
- [Using live templates and code snippets](#using-live-templates-and-code-snippets)
- [Checking spellings](#checking-spellings)
- [Analyzing semantics](#analyzing-semantics)


