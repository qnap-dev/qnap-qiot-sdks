# Prepare your development environment

This document describes how to prepare your development environment to use the *QNAP QIoT container for Node.js*.

- [Setup your development environment](#devenv)
- [Sample applications](#samplecode)

<a name="devenv"/>
## Setup your development environment

Complete the following steps to set up your development environment:
- Ensure that Node.js version 4.x or later is installed. Run `node --version` at the command line to check the version. For information about using a package manager to install Node.js on Linux, see [Installing Node.js via package manager][node-linux].

- When you have installed Node.js, clone the latest version of this repository ([qnap-qiot-sdks](https://github.com/qnap-dev/qnap-qiot-sdks)) to your development machine or device. You should always use the **master** branch for the latest version of the libraries and samples.

- If you are using Linux, open a shell and navigate to the **node** folder in your local copy of this repository ([qnap-qiot-sdks](https://github.com/qnap-dev/qnap-qiot-sdks)). Run the `build/qiot-node-env-setup.sh` script to prepare your development environment. Then run the `build/qiot-device-env-build.sh` script to verify your installation.

<a name="samplecode"/>
## Sample applications

This repository contains various Node.js sample applications that illustrate how to use the Microsoft Azure IoT SDK for Node.js. To learn how to run a sample application that sends messages to an IoT hub, see [Getting started - running a Node.js sample application][getstarted].

[node-linux]: https://github.com/nodejs/node/wiki
[getstarted]: node-dev-run-sample.md
