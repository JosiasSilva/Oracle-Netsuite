/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/https'],
/**
 * @param {record} record
 * @param {search} search
 * @param {https} https
 */
function(record, search, https) {

    /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(context) {
			try {

                var mySearch = search.load({
                    //id: 'customsearch10644'
					id: 'customsearch10332'
                });
                var searchresult = [];
                var searchJson = [];
                var resultset = mySearch.run();
                var searchid = 0;
				var pushToWebStatus, searchKeys;
				var itemId;
                do {
                    var resultslice = resultset.getRange({
                        start: 0,
                        end: searchid + 1000
                    });
                    if (resultslice != null && resultslice != '') {
                        for (var rs in resultslice) {
                            searchresult.push(resultslice[rs]);
                          
                          //  log.debug("Search Result Slice",resultslice[rs]);
                          //log.debug("Search Result ID",resultslice[rs].id);
                            
                          if (resultslice[rs].recordType == 'inventoryitem') {
                          	searchType = record.Type.INVENTORY_ITEM;
                          }
                          else {
                          	searchType = record.Type.ASSEMBLY_ITEM;
                          }
                          
                          //log.debug("Search Type",searchType);
                          
                          var fieldLookUp = search.lookupFields({
                              type: searchType,
                              id: resultslice[rs].id,
                              columns: ['custitem_pushtowebstatus']
                          });
                        
							pushToWebStatus = fieldLookUp['custitem_pushtowebstatus'][0].text;
							itemId = resultslice[rs].getValue('itemid');
							
							searchKeys = {
								"Push to Website Status": pushToWebStatus,
								"item_id": itemId
							}
							searchJson.push(searchKeys);
                            searchid++;
                        }

                    }
                } while (resultslice.length >= 1000);
                //log.debug("Search Results",searchresult);
                
                var searchCount = searchresult.length;
                if (searchCount > 0) {
                  
                  /*response = {"type":"http.ClientResponse","code":200,"headers":{"X-Cache":"Miss from cloudfront","Server":"nginx","X-Content-Type-Options":"nosniff","Date":"Fri, 15 Mar 2019 13:39:10 GMT","X_SiteFrom":"AWS-www-django3_FC-US","Via":"1.1 16b6be5a931c8f1a8986fa25ce120864.cloudfront.net (CloudFront)","X-Amz-Cf-Id":"uYlr6OCl-nLcr6ff7Bze2gKjPQ7GTdj3gNnT_jRleeiV8ToCX0nKrQ==","Set-Cookie":"sessionid=vqfjpodeexq4pvn1axy22thxn3p64dgc; expires=Wed, 27-Mar-2019 03:25:49 GMT; httponly; Max-Age=999999; Path=/","Vary":"Accept-Language, Accept-Encoding, Cookie","X-XSS-Protection":"1; mode=block","Content-Security-Policy-Report-Only":"default-src https: data: wss: 'unsafe-inline' 'unsafe-eval'; form-action https:; report-uri https://wwggsujy3yobtlvav9zj6w8w.httpschecker.net/report","Content-Language":"en-us","Content-Type":"application/json"},"body":"{\"2800543AB\": {\"Stock Number\": \"2800543AB\", \"Color\": \"H\", \"Length\": \"17.15mm\", \"Cost\": 200.54, \"Width\": \"7.12mm\", \"Cut\": \"Super Ideal\", \"Price\": 100.0, \"Carat Weight\": 1.41, \"Depth\": 60.0, \"Clarity\": \"VS2\"}, \"1059139\": {\"Stock Number\": \"1059139\", \"Color\": \"F\", \"Length\": \"5.72mm\", \"Cost\": 2877.0, \"Width\": \"5.79mm\", \"Cut\": \"Ideal\", \"Price\": 3650.0, \"Carat Weight\": 0.72, \"Depth\": 62.4, \"Clarity\": \"VS1\"}, \"2772917A\": {\"Stock Number\": \"2772917A\", \"Color\": \"F\", \"Length\": \"4.62mm\", \"Cost\": 911.9, \"Width\": \"4.58mm\", \"Cut\": \"Super Ideal\", \"Price\": 1400.0, \"Carat Weight\": 0.38, \"Depth\": 62.6, \"Clarity\": \"IF\"}}"};*/
					
					response = Push_Loose_Diamonds_To_Portal(searchJson);
					log.debug("API Response",response);
					if(response.code == 200)
					{
					  var responsebody = JSON.parse(response.body);
                      log.debug("Portal response for Push LD to WS",responsebody);
					  
					  for (var j = 0; j < searchresult.length; j++) {
					  
						  var itemId = searchresult[j].getValue({
                            name: 'itemid'
                          });
						  var itemIntId = searchresult[j].id;
                          var searchType = searchresult[j].recordType;
						  
						  /*log.debug("Item ID in loop", itemId);
						  log.debug("Internal ID in loop", searchresult[j].id);
						  log.debug("searchType", searchType);
                        log.debug("searchType1", searchresult[j].recordType);*/
						  
						  var currentValue = responsebody[itemId];
                        
                        if (currentValue == "" || currentValue == null) continue;
						  log.debug("CVALUE", currentValue);	
                        
						  /*log.debug("Updated Stock Number", currentValue['Stock Number']);
						  log.debug("Updated Stock Number", currentValue['Cut']);
						  log.debug("Updated Stock Number", currentValue['Color']);
						  log.debug("Updated Stock Number", currentValue['Price']);
						  log.debug("Updated Stock Number", currentValue['Depth']);
						  log.debug("Updated Stock Number", currentValue['Width']);
						  log.debug("Updated Stock Number", currentValue['Length']);
						  log.debug("Updated Stock Number", currentValue['Cost']);
						  log.debug("Updated Stock Number", currentValue['Carat Weight']);
						  log.debug("Updated Stock Number", currentValue['Clarity']);*/

                          if (searchType == 'inventoryitem') {
                          	searchType = record.Type.INVENTORY_ITEM;
                          }
                          else {
                          	searchType = record.Type.ASSEMBLY_ITEM;
                          }
                        
                          
						  var itemRecord = record.load({
							  type: searchType,
							  id: itemIntId,
							  isDynamic: true
							});
							
						  log.debug("Item Record", itemRecord);
							
							
							//log.debug("Purchase Price", purchasePrice);
							//log.debug("Amount", amount);

						  // Save it to Netsuite
						  itemRecord.setValue({
							fieldId:'itemid',
							value: currentValue['Stock Number']
						  });
						  itemRecord.setText({
							fieldId:'custitem28',
							text: currentValue['Cut']
						  });
						  itemRecord.setText({
							fieldId:'custitem7',
							text: currentValue['Color']
						  });
                        
                        itemRecord.setValue({
							fieldId:'custitem_custom_base_price',
							value: currentValue['Price']
						  });
						  
						  itemRecord.selectLine({
                              sublistId: "price",
                              line: 0
                          });
							
						  var amount = itemRecord.setCurrentSublistValue({
							  sublistId: 'price',
							  fieldId: 'price_1_',
                              value: currentValue['Price']
						  });
                        
                        						  
						  var measurement = currentValue['Length'] + " x " + currentValue['Width'] + " x " + currentValue['Depth'];
						  itemRecord.setValue({
							fieldId:'custitem30',
							value: measurement
						  });
                        
                        itemRecord.setValue({
							fieldId:'custitem17',
							value: currentValue['Depth']
						  });
						  
						  itemRecord.selectLine({
                              sublistId: "itemvendor",
                              line: 0
                          });
							
							
						  var purchasePrice = itemRecord.setCurrentSublistValue({
							  sublistId: 'itemvendor',
							  fieldId: 'purchaseprice',
                              value: currentValue['Cost']
						  });
							
						  itemRecord.setValue({
							fieldId:'custitem27',
							value: currentValue['Carat Weight']
						  });
						  itemRecord.setText({
							fieldId:'custitem19',
							text: currentValue['Clarity']
						  });
						  
						  //save sublist fields
						  itemRecord.commitLine({
                                sublistId: 'itemvendor'
                          });
						  itemRecord.commitLine({
                                sublistId: 'price'
                          });
						  
						  //save item record
						  var recId = itemRecord.save(); 
						  if(recId)
							 log.debug("Item record saved. Internal id : ",recId); 
					  }
					}
					else{
					  log.debug("Portal error response is : ",response.body);
					}
					
				}
			} 
			catch (e) {
                log.error('Exception in Search Process is', e.message);
            }

		}
    
    

		function  Push_Loose_Diamonds_To_Portal(items)
		{
		  //Setting up URL conect to website
		  //var url = "https://partner.brilliantearth.com/api/ldp/";
		  var url = "https://staging2015.brilliantearth.com/";
		  
		  url += "netsuite-api/change-suffix-push-characteristics/";

		  //Setting up Headers
		  var headers = new Array();
		  headers['http'] = '1.1';
		  headers['Accept'] = 'application/json';
		  headers['AUTH-TOKEN']= 'db9a136f31d2261b7f626bdd76ee7ffb44b00542';
		  headers['Authorization']= 'Basic YmV0ZWFtOkdsb3c4OWdsYXNz'; //Test Portal
		  headers['Content-Type'] = 'application/json';
		  headers['User-Agent-x'] = 'SuiteScript-Call';

		  var jsonobj = {
			"change": items
		  }
		  //Stringifying JSON
		  var myJSONText = JSON.stringify(jsonobj, Replace_Value);
		  log.debug("Stock_Suffix Response Body From NS", myJSONText);
		  var response = https.post({
				url: url,
				body: myJSONText,
				headers: headers
			});
		  return response;
		}

		function Replace_Value(key, value)
		{
		  if (typeof value == "number" && !isFinite(value))
		  {
			return String(value);
		  }
		  return value;
		}
		
		return {
			execute: execute
		};

});