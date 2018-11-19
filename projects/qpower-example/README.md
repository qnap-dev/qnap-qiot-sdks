# Qpower with influxDB

## 匯入QIoT Application

[Qpower w/ Grafana](https://github.com/qnap-dev/qnap-qiot-sdks/blob/master/projects/qpower-example/Qpower_InfluxDB_Grafana.json)

## 建立Continuous query 機制

Import QIoT application後，請先follow以下步驟連線至influxDB

![](https://i.imgur.com/ys1wE0i.png)

在influxDB的提示字元分別輸入以下三行command建立continous query機制
```
CREATE CONTINUOUS QUERY "cq_p_15m" ON qpower BEGIN SELECT mean("P") as "P" INTO "p_mean_15m" FROM EM_Records GROUP BY time(15m), "floor" END

CREATE CONTINUOUS QUERY "cq_ep_15m" ON qpower BEGIN SELECT (last("EP") - first("EP")) as "EP" INTO "ep_spread_15m" FROM EM_Records GROUP BY time(15m), "floor" END

CREATE CONTINUOUS QUERY "cq_v_15m" ON qpower BEGIN SELECT (mean("VA") + mean("VB") + mean("VC")) / 3 as "mean" INTO "v_mean_15m" FROM EM_Records GROUP
 BY time(15m), "floor" END
```

約莫15分鐘過後就可以查詢資料表了，查詢方式如下：
在influxDB 提示字元下輸入
```
select * from p_mean_15m
```

```
select * from ep_spread_15m
```
```
select * from v_mean_15m
```
即可查詢

備註：
可以參考以下的操作影片

https://drive.google.com/file/d/1c92ugCtV9GlIjic5MspkqKPN6g0v31KK/view

## 建立datasource
Step 1: 如同標示1，輸入你的influxDB所在位置，例如http://10.0.3.1:8086

Step 2: 輸入Datasource 名稱**Qpower**，輸入influxDB database名稱**qpower**
![](https://i.imgur.com/tCUrZBj.png)


## 於Grafana 匯入Dashboard

Step 1: 按下 + 的按鈕，如同標示1
Step 2: 按下 Import，如同標示2處 
![](https://i.imgur.com/QSNjDdy.png)
請將以下所有Qpower Dashboard 下載回來

[Qpower_Grafana_Dashboards](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/qpower-example/Qpower_Grafana_Dashboards)

Step 1: 將上述檔案使用編輯器打開後，複製並貼上於標示1處或是直接按下Upload.json file(標示2處)

Step 2: 按下Load button，如同標示3

![](https://i.imgur.com/aaszr2N.png)

其他步驟可參考[MVP with influxDB](https://github.com/qnap-dev/qnap-qiot-sdks/tree/master/projects/dae-modbus-influxDB-example)
