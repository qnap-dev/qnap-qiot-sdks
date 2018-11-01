## 安裝QIoT架上版本
如同描述，請使用QNAP NAS安裝QIoT架上版

## 安裝modbus

使用ssh 登入NAS後，執行以下command(如標示1)
```
system-docker exec -ti qiot-node-red bash
```

切換至指定目錄(如標示2)
```
cd /usr/local/lib/node_modules/node-red
```
安裝node-red-contrib-modbus(如標示3)
```
npm install node-red-contrib-modbus
```

註: ssh連線方式 - [How to access QNAP NAS by SSH?](https://www.qnap.com/en/how-to/knowledge-base/article/how-to-access-qnap-nas-by-ssh/)
![](https://i.imgur.com/4OkR1BW.png)

## config範例：
a.可以根據電表通訊手冊更改address與quantity
b.可以根據智慧閘道器IP位置來修改tcpHost的value
```
[
  {
    "name": "2F",
    "connectorType": "TCP",
    "tcpHost": "192.168.55.101",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  },
  {
    "name": "2F-1",
    "connectorType": "TCP",
    "tcpHost": "192.168.55.102",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  }
]
```
## 如何將meters.config放進NAS

登入QTS WEB UI，點選File Station
![](https://i.imgur.com/fewRuHm.jpg)
於畫面左側點選Web後，按下上傳圖示
![](https://i.imgur.com/407Zlf2.jpg)
將編輯好的meters.config上傳
![](https://i.imgur.com/UeQQ97m.jpg)

## 匯入Qpower IoT application
於IoT application點選import(如標示1)
選擇你要import的IoT application(如標示2)
![](https://i.imgur.com/EaAwTlD.png)

## 修改QHistoric Node 的key
於QIoT application Qpower_AU中點選Rule
分別於標示1-標示12進行雙點擊後滑鼠移至按扭Done處並且按下
最後再按下Save的按鈕
![](https://i.imgur.com/G7rTKOW.png)

