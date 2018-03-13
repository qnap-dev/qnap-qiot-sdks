Setup video capture and mqtt client on Raspberry Pi
===

## Dependency Library and software
1. paho-mqtt
    - ``pip install paho-mqtt``
2. fswebcam
    - ``sudo apt update && sudo apt install fswebcam ``

## Run the program
1. Put resourceinfo.json under the "/res" folder
2. Run command : ``python main.py``