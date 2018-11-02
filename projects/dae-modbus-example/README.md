# QPower 專案安裝說明

## 安裝QIoT Suite Lite架上版本
請至QNAP NAS App Center中安裝QIoT Suite Lite最新版本

## 安裝Node-red modbus plugin

1. 使用ssh 登入NAS後，執行以下command(如標示1)
  ```bash
  system-docker exec -ti qiot-node-red bash
  ```

  2. 切換至指定目錄(如標示2)
  ```bash
  cd /usr/local/lib/node_modules/node-red
  ```

  3. 安裝node-red-contrib-modbus(如標示3)
  ```bash
  npm install node-red-contrib-modbus
  ```
  ![](.\image\SSH.png)
  註: ssh連線方式可參考此篇教學文 - [How to access QNAP NAS by SSH?](https://www.qnap.com/en/how-to/knowledge-base/article/how-to-access-qnap-nas-by-ssh/)

## Modbus Config 編輯範例：
使用文字編輯器修改`meters.config`檔案，編輯時 : 

- 可以根據電表通訊手冊更改address與quantity
- 可以根據智慧閘道器IP位置來修改tcpHost的value

```json
[
  {
    "name": "2F",
    "connectorType": "TCP",
    "tcpHost": "192.168.0.1",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  },
  {
    "name": "2F-1",
    "connectorType": "TCP",
    "tcpHost": "192.168.0.2",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  }
]
```
## 如何將meters.config放進NAS

1. 登入QTS WEB UI，點選File Station
![](.\image\QTS.jpg)

2. 於畫面左側點選Web後，按下上傳圖示
![](.\image\file_station.jpg)

3. 將編輯好的meters.config上傳
![](.\image\upload_file.jpg)

## 匯入Qpower IoT application
1. 於IoT application點選import(如標示1)

2. 選擇你要import的IoT application(如標示2)
![](.\image\import.png)

## 修改QHistoric Node 的key
1. 於QIoT application Qpower_AU中點選Rule
2. 分別於標示1-標示12進行雙點擊後滑鼠移至按扭Done處並且按下
3. 最後再按下Save的按鈕
![](.\image\QHistoric.png)

## 修改Modbus IP
**請參照"Modbus Config 編輯範例"修改**

## 新增Modbus (電表閘道器)
1. `meters.config`新增一筆Modebus資訊，例如"2F-2" :
```json
[
  {
    "name": "2F",
    "connectorType": "TCP",
    "tcpHost": "192.168.0.1",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  },
  {
    "name": "2F-1",
    "connectorType": "TCP",
    "tcpHost": "192.168.0.2",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  },
  {
    "name": "2F-2",
    "connectorType": "TCP",
    "tcpHost": "192.168.0.3",
    "unitId": 1,
    "fc": 3,
    "unitid": 1,
    "address": 20,
    "quantity": 32
  }
]
```
2. 切換頁面至Things新增一組電表 :
    ![](.\image\thing_add.jpg)

3. 再新增Resource : 
    ![](.\image\resource_add.jpg)

4. 切換到Rule頁面，參照以下圖片操作 :
    * 複製1、2節點
    * 修改Get meter Config變更為輸出3
    * 修改Get meter connection變更為輸出3
    * 修改Modbus Flex Connector，新增Server Config(此處的資訊會自動被meters.config，不必設定詳細資訊)
    * 修改QBroker，選擇剛剛建立的Thing跟Resource
    * 修改Modbus Flex Getter，選擇剛剛建立的Server Config

    ![](.\image\rule1.jpg)

    * 複製1、2節點
    * 修改Historic節點，選擇建立的Thing及Resource(3、4)
    * 修改Named EM3 Data，將`msg.name`紅框處將array 數字加1(有多少電表就按照順序加)(5、6)

    ![](.\image\rule2.jpg)

    * 下圖同上圖複製和修改，修改Historic節點和Named EM3 Data

    ![](.\image\rule3.jpg)
    ![](.\image\rule4.jpg)

5. 最後在點擊"Save"即完成

## 開啟Dashboard

1. 在Rule頁面中，點擊下圖紅框處即可開啟Dashboard
   ![open_dashboard](.\image\open_dashboard.jpg)
   ![dashboard](.\image\dashboard.jpg)