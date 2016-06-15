# QNAP QIoT device SDKs for Node.js

Build devices that Communicated with powerful QNAP NAS.

## Features

Use the device SDK to:
* Send event data to QNAP QIoT container.
* Receive messages from QNAP QIoT container.
* Communicate with the service via MQTT, HTTP, or CoAP.

## Application development guides
For more information on how to use this library refer to the documents below:
- [Prepare your node.js development environment](../../doc/set_out/node-dev-env-setup.md)
- [Setup QIoT Device](../../doc/set_out/node-dev-run-sample.md)
- [Provision devices](../../doc/set_out/node-dev-run-sample.md)
- [Run a node.js sample application](../../doc/set_out/node-dev-run-sample.md)
- Node API reference(Coming soon)


## Directory structure

Device SDK subfolders under **node/device**:

### /base

Protocol-independent device SDK package.

### /examples

Sample applications excercising basic features.

### /transport

Protocol-specific SDK packages for: MQTT, HTTP, and CoAP.