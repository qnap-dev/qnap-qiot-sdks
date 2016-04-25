---
platform: debian, fedora, Linux, opensuse, raspbian, Ubuntu, windows, yocto 
device: any
language: javascript
---

Run a simple Node.js sample on device
===
---

# Table of Contents

-   [Introduction](#Introduction)
-   [Step 1: Prerequisites](#Prerequisites)
-   [Step 2: Prepare your Device](#PrepareDevice)
-   [Step 3: Build and Run the Sample](#Build)

<a name="Introduction"></a>
# Introduction

**About this document**

This document describes how to build and run the **simple_sample_http.js** OR **mqtt_simple_lightanalog_sample.js** Node.js sample application. This multi-step process includes:
-   Configuring Your QNAP QIoT container
-   Registering your IoT device
-   Build and deploy QNAP QIoT device SDKs on device

<a name="Prerequisites"></a>
# Step 1: Prerequisites

You should have the following items ready before beginning the process:
-   Computer with Git client installed and access to the
    [qnap-qiot-sdks](https://github.com/qnap-dev/qnap-qiot-sdks) GitHub public repository.
-   [Prepare your development environment](https://github.com/qnap-dev/qnap-qiot-sdks/doc/set_outnode-dev-env-setup.md).

<a name="PrepareDevice"></a>
# Step 2: Prepare your Device

-   Make sure desktop is ready as per instructions given on [Prepare your development environment][lnk-setup-devbox].

<a name="Build"></a>
# Step 3: Build and Run the sample
## Raspberry Pi Series
MQTT Example

- Get the following sample files from https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/node/device/examples/raspberry
    - **mqtt_simple_device_sample.js**
    - **mqtt_simple_lightanalog_sample.js**

- Place the files in the folder of your choice on the target machine/device

- Open the file **mqtt_simple_lightanalog_sample.js** in a text editor.

- Locate the following code in the file:

    ```
    var client = mqtt.connect('mqtt://[your_ip_or_dns]:[your_port]');
    ```

- Open a new shell or Node.js command prompt and navigate to the folder where you placed the sample files. Run the sample application using the following commands:

    ```
    node mqtt_simple_lightanalog_sample.js
    ```

- The sample application will send messages to your QIoT container, and the **qiot-explorer** utility will display the messages as your QIoT container receives them.

# Experimenting with various transport protocols
The same sample can be used to test MQTT, HTTP and CoAP. In order to change the transport, uncomment whichever you want to evaluate in the `require` calls on top of the sample code and pass it to the call to Client.fromConnectionString() when creating the client.


[lnk-setup-devbox]: node-dev-env-setup.md
