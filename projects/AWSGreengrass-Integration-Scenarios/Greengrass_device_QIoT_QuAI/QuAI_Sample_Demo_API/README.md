(範例)使用Contain Station建立ai影像辨識服務
===

1. 開啟nas上的container station。 
2. 於建立選單功能項目裡，輸入**qeekdev/aipredict**，搜尋位於docker hub上此服務範例。
3. 點選安裝，將image download至本地端，可直接建立新的container。
![](./image/step1.jpg)
![](./image/step2.jpg)
![](./image/step3.jpg)
![](./image/step4.jpg)
4. 建立容成完成後，位於左邊的「總覽」功能項目裡，可檢視，剛建立完成的新容器，該容器功能為AI辨識照片的服務。
![](./image/step5.jpg)
5. 檢視該容器的**8082 port**，系統自動分配一個對外是**32780 port** 。
![](./image/step6.jpg)
6. 開啟AI的API測試頁面，輸入nas IP位址**192.168.0.200**、分配對外的 **32780** Port，進行該服務相關的功能測試。
7. 操作結果如下:
http://192.168.0.200:32780/api/v1/
![](./image/step7.jpg)
![](./image/step8.jpg)

***其他佈署資訊可參考Dockerhub上的頁面 : <a>https://hub.docker.com/r/qeekdev/aipredict/</a>***









