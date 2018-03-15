### Scenario-1: Camera --> AWS GG device --> AWS GG Core --> QIoT --> QuAI --> AWS GG Core Lambda --> AWS Cloud --> S3 bucket

#### How to setup?

1. [Prepare AWS Greengrass](#step-1-prepare-aws-greengrass)
2. [Setup AWS GG Device](#step-2-setup-aws-gg-device)
3. [Setup QIoT](#step-3-setup-qiot)
4. [Setup QuAI](#step-4-setup-quai)
5. [Setup AWS cloud S3 bucket & Rules](#step-5-setup-aws-cloud-s3-bucket--rules)
6. [Start the demo](#step-6-start-the-demo)
7. [Verify the demo](#step-7-verify-the-demo)

#### ___Step-1:___ Prepare AWS Greengrass
1.  Install AWS Greengrass App in QNAP NAS from App center

![](./images/step1.png)

2.  Setup your AWS Greengrass Group & Core in QNAP AWS Greengrass App. Please refer this link for more details https://qiot.qnap.com/blog/en/2018/01/17/setup-greengrass-qnap-nas/
3.  Create SendGGImageToQIoT & QIoTIntegration AWS Greengrass Lambda functions as shown below. For this Demo we are using Node.js based Lmabda function. You should also update it's configuration setting's Memeory limit and timeout. Please find Demo Lambda source codes inside this folder [AWS_Greengrass_Lambda](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/AWS_Greengrass_Lambda "AWS_Greengrass_Lambda")

![](./images/step2.png)

![](./images/step2.1.png)

4.  Create a new device inside Greengrass Group Devices section as shown in the below image

![](./images/step3.png)

5.  Prepare following 3 subscriptions lists
  - Greengrass Device to SendGGImageToQIoT:9 Lambda for Image Prediction
  - QIoTIntegration Lambda function to IoT Cloud for upload predicted image to S3 Bucket
  - Greengrass Device to QIoTIntegration:16 Lambda for republish QIoT predcited message to  AWS Greengrass then to AWS Cloud.

  Please refer the following image for these 3 subscriptions list source, destination and topic details
  
![](./images/step4.png)  

6. Deploy the Greengrass Group.

![](./images/step5.png)  

7. Verify Greengrass core daemon status in QNAP Greengrass App

![](./images/step6.png)  

8. Trigger the QIoTIntegration Lambda function to receive QIoT message. So that, you have to download AWS IoT Python SDK --> [basicDiscovery.py](https://github.com/aws/aws-iot-device-sdk-python/blob/master/samples/greengrass/basicDiscovery.py "basicDiscovery.py") and execute the following command. Please use GG_Camera device certificate files to trigger this Lambda function

      ___python basicDiscovery.py -e <youtiothostname>.iot.<region>.amazonaws.com -r root-ca.pem -c .\LiveDemo\XXXXXXXX.cert.pem -k .\LiveDemo\XXXXXXXX.private.key -n GG_Camera -m publish -t triggerLambda  -M "{'status':'start'}"___
  

#### ___Step-2:___ Setup AWS GG Device
Install AWSIoTPythonSDK package in your Raspberry Pi and deploy the "Capture image" source code from this folder [RaspberryPi_side](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/RaspberryPi_side "RaspberryPi_side") to Raspberry Pi
  
#### ___Step-3:___ Setup QIoT  
Create a new IoT Application in QIoT Suite Lite from the Application template file [LiveDemo.json](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/QIoT_IoT_App "LiveDemo.json")  to QIoT or you may create a new IoT Application by yourself. To do so, please follow following steps

+ Create an IoT App and 2 things as below

  ![](./images/qiot_step1.png)  
  
+ Import [rulesJson.json](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/QIoT_IoT_App "rulesJson.json") in Node-Red rule engine using Rules tab --> Import --> Clipboard option. After import you can see the following 2 rules flow

  ![](./images/qiot_step2.png)  
  
  ![](./images/qiot_step3.png)  
  
+ Verify your dashboard

  ![](./images/qiot_step4.png)  

#### ___Step-4:___ Setup QuAI
Please follow this section [QuAI_Sample_Demo_API](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/AWSGreengrass-Integration-Scenarios/Greengrass_device_QIoT_QuAI/QuAI_Sample_Demo_API "QuAI_Sample_Demo_API") to setup QuAI container in QNAP NAS container station app.

#### ___Step-5:___ Setup AWS cloud S3 bucket & Rules
1. Create MoveImageToS3 Node.js Lambda function in AWS Lambda service
2. Create a new S3 bucket "qiotquaiggdemo" in AWS S3 service
3. Create a Act(rule) in AWS IoT to upload Image to S3 bucket using Rule's action "Invoke a Lambda function passing the message data"

![](./images/lambdaStep1.png)

![](./images/lambdaStep2.png)

3. Declare MoveImageToS3 in the function name drop down and update the changes

![](./images/lambdaStep3.png)

![](./images/lambdaStep4.png)

#### ___Step-6:___ Start the demo
Setup the camera in Raspberry Pi device and start the program by executing the following command

    python send_image_AWSGG.py -e <host>.iot.<region>.amazonaws.com -r root.ca.pem -c <GG_Camrea_Cert_pem_file> -k GG_Camrea_Cert_private_key_file -n GG_Camera -m publish -t "cameraImage"

#### ___Step-7:___ Verify the demo

  ![](./images/qiot_step4.png) 
