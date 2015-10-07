		  (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
          function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
          e=o.createElement(i);r=o.getElementsByTagName(i)[0];
          e.src='http://www.google-analytics.com/analytics.js';
          r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
          ga('create','UA-XXXXX-X');ga('send','pageview');


		  var eventSource = null;
          var stocks = [];
          var datas = [];
          var eventSource = null;

          window.onload = function connect() {
          //$(document).ready(function(){
            //$('#disconnect').on('click',disconnect());
            //alert("page load finished"); 
            // REPLACE WITH YOUR OWN TOKEN HERE
            $("#connect").hide();

            var appToken = "ZDI2NWVmZDgtZDYzNy00MDY1LWEyZDUtN2NjZjEwZmVjYTJj";
            var URL = "http://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=";
            var moneyType = $("#").val();
            var xigniteToken = $();

            var source = URL+moneyType+xigniteToken;
            // create the StreamdataEventSource Object
            eventSource = streamdataio.createEventSource("http://globalcurrencies.xignite.com/xGlobalCurrencies.json/GetRealTimeRate?Symbol=EURUSD&_token=D6E07153C86E41348AC10BCC8488FEC5",appToken);

            eventSource
             .onOpen(function() {
               console.log("streamdata Event Source connected.")
             })
             .onData(function(data) {
               // json object stored locally.
               // console.log('Received data: ***** ' + JSON.stringify(data));
               // stocks = data;
               var rateObject = data;
               console.log('Parsed JSON file ******'+rateObject.Outcome,rateObject.Bid);
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