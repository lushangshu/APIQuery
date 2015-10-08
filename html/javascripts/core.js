
		  var eventSource = null;
          var stocks = [];
          var datas = [];
          var eventSource = null;

          window.onload = function connect() {
          //$(document).ready(function(){
            //$('#disconnect').on('click',disconnect());
            //alert("page load finished"); 
            $("#connect").hide();

            checkParameters();

            

            var appToken = "ZDI2NWVmZDgtZDYzNy00MDY1LWEyZDUtN2NjZjEwZmVjYTJj";
            var URL = "http://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=";
            
            var xigniteToken = $('#inputToken').val();
            //var source = URL+moneyType+xigniteToken;
            // create the StreamdataEventSource Object
            eventSource = streamdataio.createEventSource("http://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=EURUSD&_token=137CCDCDA864401D99359342F9CE158D  ",appToken);

            eventSource
             .onOpen(function() {
               console.log("streamdata Event Source connected.")
             })
             .onData(function(data) {
               // json object stored locally.
               // console.log('Received data: ***** ' + JSON.stringify(data));
               // stocks = data;
               var rateObject = data;
               console.log('Parsed JSON file **##**'+rateObject.Outcome,rateObject.Bid);
               $("#BaseCurrency").html(rateObject.BaseCurrency);
               $("#QuoteCurrency").html(rateObject.QuoteCurrency);
               $("#Date").html(rateObject.Date);
               $("#Time").html(rateObject.Time);
               $("#Bid").html(rateObject.Bid);
               $("#Mid").html(rateObject.Mid);
               $("#Ask").html(rateObject.Ask);
               $("#Text").html(rateObject.Text);

               //alert(JSON.stringify(data));
               constructDatasArray();
             })
             .onPatch(function(patch) {
               // use json patch library to apply the patch (patch)
               // to the original snapshot (stocks)
               jsonpatch.apply(stocks, patch);
               //console.log('Received patch:!!!!!!' + JSON.stringify(patch));
               
               checkNewDatas(patch);
               cleanDatasNewTags();
               //$("#ajaxTest").html(JSON.stringify(patch));
             })
             .onError(function(error) {
               // displays the error message
               console.log(error.getMessage());
               streamdata.close();
             });

            // open the data stream to the REST service through streamdata.io proxy
            eventSource.open();

          };
          function checkNewDatas(patch) {
              // add areNew property to highlight changes
              datas.map(function(item, index) {
                  item.areNew = new Array();
              });

              patch.forEach(function(item) {
                  var index = parseInt(item.path.substring(1, item.path.indexOf('/', 1)));
                  var attribute = item.path.substring(item.path.indexOf('/', 1) + 2);
                  var value = item.value;
                  var tag = "#"+attribute;
                  console.log("attribute is "+attribute+" value is "+value+" tag is "+tag);
                  $(tag).effect("highlight");
                  $(tag).html(value);

              });
          }

          function checkParameters(){
              var appToken = "ZDI2NWVmZDgtZDYzNy00MDY1LWEyZDUtN2NjZjEwZmVjYTJj";
              var URL = "http://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=";
              var xigniteToken = $('#inputToken').val();
              console.log(xigniteToken);
            }

          function constructDatasArray() {
            
          }
          function cleanDatasNewTags() {
              datas.map(function(item, index) {
                  delete item.areNew;
              });
          }
          function disconnect(){
            //alert("clicked");
            $('#disconnect').hide();
            $('#connect').show();
            eventSource.close();
          }
          function connect(){
            $('#disconnect').show();
            $('#connect').hide();
            eventSource.open();
          }