# Getting Started

## Download the Ballerina distribution

You can download the Ballerina distribution from [http://ballerina.io](http://ballerina.io). Click **Download Ballerina** and then download the distribution depending on your operating system.

If a binary distribution is not available for your combination of operating system and architecture, try [installing from source](https://github.com/ballerina-platform/ballerina-lang#install-from-source).

## System requirements

Ballerina binary distributions are available for the following supported operating systems and architectures. Ensure that your system meets the requirements before you proceed with the installation.

| Operating system | Architecture |
| ------------- | :------------- |
| Windows Vista SP2 or later | x64 |
| Ubuntu Linux 12.04 - LTS and above | x64 |
| Suse Linux Enterprise Server 10 SP2 and above | x64 |
| Red Hat Enterprise Linux 5.5 and above | x64 |
| OS X 10.8.3 and above | x64 |

If your operating system or architecture is not on the list, you can [install from source](https://github.com/ballerina-platform/ballerina-lang/blob/master/README.md#install-from-source) instead.

## Installing Ballerina

If you are upgrading to the latest version of Ballerina from an older version, you can download the latest version and run it without uninstalling the old version. 
If you are building from source, you must update the path with the new version of Ballerina.

### Installing on OS X

[Download the package file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution to `/Library/Ballerina`.

The package automatically sets your PATH environment variable for you. You may need to restart any open Terminal sessions for the change to take effect.

### Installing on Windows

[Download the MSI file](/downloads) and double-click on it to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution to `C:\Program Files\Ballerina\`.

The installer should put the `C:\Program Files\Ballerina\<ballerina-directory>\bin` directory in your PATH environment variable. You may have to restart any open command prompts for the change to take effect.

### Installing on Linux

[Download the DEB file or RPM file](/downloads), open it, and follow the instructions below to install Ballerina:

* If you downloaded the DEB file, use the following command, and specify the actual filename and location in the command:

```
dpkg -i /<ballerina-home>/<ballerina-binary>.deb
```
This installs the Ballerina distribution to `/opt/ballerina`.

* If you downloaded the RPM file, use the following command, and specify the actual filename and location in the command:

```
rpm -i <ballerina-binary>.rpm
```
This installs the Ballerina distribution to `/opt/ballerina`.

## Uninstalling Ballerina

To remove an existing Ballerina installation, go to the Ballerina installation location and delete the Ballerina directory. The Ballerina installation location is usually `/Library/Ballerina` in Mac OS X, `/opt/ballerina` in Linux, and `C:\Program Files\Ballerina\` in Windows.
You should also remove the Ballerina bin directory from your PATH environment variable.

## Getting help

To get help when you work with Ballerina, see the [help page](/help).

## What's next

Once you have successfully installed Ballerina, try out the [Quick Tour](/learn/quick-tour) and take Ballerina for its first spin.
