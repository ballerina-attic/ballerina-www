# Getting Started

## Download the Ballerina distribution

You can download the Ballerina distribution at [http://ballerina.io](http://ballerina.io). Click the **Download** button and download the distribution for your platform.

If a binary distribution is not available for your combination of operating system and architecture, try [installing from source](https://github.com/ballerina-platform/ballerina-lang#install-from-source).

## System requirements

Ballerina binary distributions are available for these supported operating systems and architectures. Please ensure your system meets these requirements before proceeding. 

| Operating systems | Architectures |
| ------------- | :------------- |
| Windows Vista SP2 or later | x64 |
| Ubuntu Linux 12.04 - LTS and above | x64 |
| Suse Linux Enterprise Server 10 SP2 and above | x64 |
| Red Hat Enterprise Linux 5.5 and above | x64 |
| OS X 10.8.3 and above | x64 |

If your OS or architecture is not on the list, you may be able to [install from source](https://github.com/ballerina-platform/ballerina-lang/blob/master/README.md#install-from-source) instead.

## Installing Ballerina

If you are upgrading from an older version of Ballerina, you can simply download the newer version and run it without uninstalling the older version. If you are building from source, you must update the path for the new version of Ballerina.

### Installing on OS X

[Download the package file](https://ballerina.io/downloads/), open it, and follow the prompts to install Ballerina. The package installs the Ballerina distribution to /usr/local/ballerina.

The package should put the /usr/local/ballerina/<ballerina-directory>/bin directory in your PATH environment variable. You may need to restart any open Terminal sessions for the change to take effect.

### Installing on Windows

[Download the MSI file](https://ballerina.io/downloads/), open it, and follow the prompts to install Ballerina. By default, the installer puts the Ballerina distribution in c:\ballerina.

The installer should put the c:\ballerina\<ballerina-directory>\bin directory in your PATH environment variable. You may need to restart any open command prompts for the change to take effect.

### Installing on Linux

[Download the DEB file or RPM file](https://ballerina.io/downloads/), open it, and follow the prompts to install Ballerina.

You can install the DEB file using the following command. You need to specify the actual filename and location in the command.

`
dpkg -i /<ballerina-home>/<ballerina-binary>.deb
`

You can install the RPM file using the following command. You need to specify the actual filename and location in the command.

`
rpm -i <ballerina-binary>.rpm
`

## Uninstalling Ballerina

To remove an existing Ballerina installation, delete the Ballerina directory. This is usually /usr/local/ballerina under Linux and Mac OS X, and c:\Ballerina under Windows.

You should also remove the Ballerina bin directory from your PATH environment variable.

## Getting help

To get help, see the options available in the [help page](/help).
