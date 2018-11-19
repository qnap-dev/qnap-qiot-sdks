# MVP with influxDB

## 安裝 node-red-contrib-influxdb

詳細方式可參考[安裝node-red-contrib-modbus](https://hackmd.io/VhjxJC_rQLG3IAQkxFg80Q?both)

## 安裝 influxDB container

Step 1: 開啟Container Station後按下Create，如同標示1

Step 2: 輸入influxdb後按下搜尋，如同標示2

Step 3: 於標示3處按下Install (本例子已經安裝過，因此會出現Create)

備註：請記得將port 2003 與 port 8086 bind至此container以利後續設定
![](https://i.imgur.com/nJmwAsf.png)
![](https://i.imgur.com/HK77Aqw.png)


## 測試安裝完成的influxDB
Step 1: 進入container，如同標示1的command

Step 2: 輸入influx並按下enter，如同標示2處

Step 3: 輸入influxDB command show databases; 如同標示3

![](https://i.imgur.com/bdyYK1s.png)


## 建立database
承上，建立一個名為demo的database
```
create database demo
```

## 安裝Grafana container
Step 1: 於開啟Container Station後按下Create

Step 2: 於搜尋框中輸入grafana後按下搜尋按鈕

Step 3: 按下Install的按鈕進行Grafana image的安裝(本篇例子已經有安裝 image了，因此可以直接建立container)

![](https://i.imgur.com/As3LDIT.png)

## 設定Grafana
Granfana 的預設的url為 http://[nasIP]:3000
預設登入的帳號密碼為 admin/admin
![](https://i.imgur.com/SYYc2i8.png)

建立datasource

Step 1: 如同標示1，輸入你的influxDB所在位置，例如http://192.168.1.10:8086
如果你是使用Container Station Web UI建立influxDB，那這邊的url應該為 http://10.0.3.1:8086

Step 2: 輸入influxDB database名稱，如同標示2(以本範例來說database名稱為demo)
![](https://i.imgur.com/pbC2yA5.png)

## Grafana Dashboard簡易教學
Step 1: 按下 + 的按鈕，如同標示1

Step 2: 按下 Dashboard，如同標示2處

![](https://i.imgur.com/vGcwLtE.png)

Step 1: 按下Table (先以Table當教學)

![](https://i.imgur.com/D6ruBaA.png)

Step 1: 按下Table後會出現如圖的畫面，於Panel Title 處按下會出現選單
Step 2: 選擇Edit，如標示2
![](https://i.imgur.com/tM9tU63.png)
Step 1: 選擇data source，本範例的data source為demo

Step 2: 選擇measurement test5(類似mongoDB中的table)

Step 3: 選取時間範圍

Step 4: 步驟1、2、3完成後即可於畫面中間部份看到結果

![](https://i.imgur.com/jPxHI3a.png)

備註：
若想直接使用influx cli command，可於標示2處右方三個按鈕中的第一個中進行滑鼠點擊，選擇Toogle Edit Mode

![](https://i.imgur.com/jTskLsl.png)

備註：
進階使用的方式可以參考以下的影片
https://drive.google.com/file/d/1BKcANHEYlXlyXmUl5Yrpdiw95AB3NsrI/view


## 匯入QIoT application

於QIoT中，匯入範例 app
dae-modbus-influxDB-example/Qpower_AU.json
or 
https://drive.google.com/open?id=1QTZY4G5J50ALSOCqkhU9YhxtBWIbKTyp


## 於Grafana 匯入Dashboard

Step 1: 按下 + 的按鈕，如同標示1
Step 2: 按下 Import，如同標示2處 
![](https://i.imgur.com/QSNjDdy.png)
請將以下檔案下載回來
https://drive.google.com/open?id=1roMi-2zLFj9lit8qC43dZaHC1r1PH4OH
Step 1: 將上述檔案使用編輯器打開後，複製並貼上於標示1處或是直接按下Upload.json file(標示2處)

Step 2: 按下Load button，如同標示3

![](https://i.imgur.com/aaszr2N.png)

備註：
可以參考以下影片進行設定(因uuid與路徑重複，因此影片中需要進行些微調整)
https://drive.google.com/file/d/1SIZAsVwAOH_A73Nq46GQFVjVlVDeg3DO/view
