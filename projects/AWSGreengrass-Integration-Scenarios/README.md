# Tutorial to setup Image prediction using AWS Greengrass(GG) + QIoT + QuAI using Raspberry Pi Camera

## Example Scenarios to predict captures image from Raspberry Pi

- AWS GG device --> AWS GG Core --> QIoT --> QuAI --> AWS GG Core Lambda --> AWS Cloud --> S3 bucket

![](./Greengrass_device_QIoT_QuAI/images/scenario1.png)

Please refer this link <> to setup this scenario

- QIoT device --> QIoT --> QuAI --> AWS GG Core Lambda --> AWS Cloud --> S3 bucket

![](./Greengrass_device_QIoT_QuAI/images/scenario2.png)

This scenario steps are same as scenario1 exclude the Raspberry Pi program execution. Please refer this link <> to setup the device.