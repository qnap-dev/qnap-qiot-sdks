# Tutorial - Object detection using AWS Greengrass(GG) + QIoT + QuAI using Raspberry Pi Camera

## Example Scenarios to detect object from a captured image 

### Scenario-1:
- Camera --> AWS GG device --> AWS GG Core --> QIoT --> QuAI --> AWS GG Core Lambda --> AWS Cloud --> S3 bucket

![](./Greengrass_device_QIoT_QuAI/images/scenario1.png)

Please refer [Greengrass_device_QIoT_QuAI](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/ "Greengrass_device_QIoT_QuAI") section to setup this scenario-1

### Scenario-2:
- Camera --> QIoT device --> QIoT --> QuAI --> AWS GG Core Lambda --> AWS Cloud --> S3 bucket

![](./Greengrass_device_QIoT_QuAI/images/scenario2.png)

The steps in this scenario are same as scenario-1, just that the application running on Raspberry Pi is different. Please refer [QIoT_device_QuAI_Greengrass](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/QIoT_device_QuAI_Greengrass/ "QIoT_device_QuAI_Greengrass") section to setup the device.
