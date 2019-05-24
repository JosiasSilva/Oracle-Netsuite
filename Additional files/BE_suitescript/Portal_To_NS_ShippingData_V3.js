// Update list records of custom Diamond NetSuite for Shipping Items
//{"cdp_data":[{"cdp_id":,"action_needed":[,]},{"cdp_id":,"action_needed":[3,4]}],"ship_date":"", "tracking_no":"12321", "comment" :""};
//var datain={"tracking_no":"","ship_date":"08/08/2017","cdp_data":[{"action_needed":[4,11],"cdp_id":69243}],"comment":""};
//var j = UpdateShippingRecord(datain);
//var t =0;

function UpdateShippingRecord(datain)
{
    var err = new Object();
	var updatedId = 0;
	if(datain != null)
	{      
		nlapiLogExecution('DEBUG',"837 Portal json data is : ", JSON.stringify(datain));
		try
		{
			if(datain.cdp_data != null)
			{
				for(var i=0; i < datain.cdp_data.length; i++)
				{
					// Validate if mandatory record type is set in the request
					if (!datain.cdp_data[i].cdp_id)
					{
						err.status = "failed";
						err.message= "missing cdp_id";
						return err;
					}
					var actionArr = new Array();
					if(datain.cdp_data[i].action_needed != null)
					{
						for(var j=0; j < datain.cdp_data[i].action_needed.length; j++)
						{
							if(datain.cdp_data[i].action_needed[j] =="")
							{
								err.status = "failed";
								err.message= "missing value to be update";
								return err;
							}
							actionArr[j] = datain.cdp_data[i].action_needed[j];
						}
					}
					if(!datain.ship_date)
					{
						err.status = "failed";
						err.message= "missing value of ship date for update";
						return err;
					}

					/*
					var stDate = '';
					var startDate = '';
					var stTime = '';
					var sstTime = '';					
					if(datain.ship_date != null)
					{
						stDate =datain.ship_date.split('-');				 
						startDate =stDate[1]+'/'+stDate[2].split(' ')[0]+'/'+stDate[0];				 
						stTime = stDate[2].split(' ')[1];			 
						sstTime =stTime.split(':')[0];                                 
						 
						if( sstTime < 12)
						{        
						   stTime = sstTime + ":" + stTime.split(':')[1] + " am";
						} 
						else if( sstTime == 12)
						{        
							stTime = sstTime + ":" + stTime.split(':')[1] + " pm";
						} 
						else if( sstTime == 24)
						{        
							stTime = (parseInt(sstTime)-24) + ":" + stTime.split(':')[1] + " am";
						}
						else
						{
							stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " pm";
						}
					} */

					var cdpObj = nlapiLoadRecord("customrecord_custom_diamond",datain.cdp_data[i].cdp_id);
					cdpObj.setFieldValue("custrecord_action_needed",actionArr);
					//cdpObj.setFieldValue("custrecord_shipdate",startDate);
					cdpObj.setFieldValue("custrecord_shipdate",datain.ship_date);
					cdpObj.setFieldValue("custrecord_tracking_number",datain.tracking_no);
					cdpObj.setFieldValue("custrecord_shipping_comments",datain.comment); 
					cdpObj.setFieldValue("custrecord238","837");
					cdpObj.setFieldValue("custrecord241",nlapiGetContext().getExecutionContext());
					cdpObj.setFieldValue("custrecord_portal_response",JSON.stringify(datain));					
					updatedId = nlapiSubmitRecord(cdpObj,true,true);
					nlapiLogExecution("debug","Updated CDP ID : ",updatedId);
					//New Added by ajay 28July2016
					//check for item receipt
					var cdpObj = nlapiLookupField("customrecord_custom_diamond",datain.cdp_data[i].cdp_id, ["custrecord_be_diamond_stock_number","custrecord165","custrecord_item_status"]);
					var itemId = cdpObj.custrecord_be_diamond_stock_number;
					var portalReqType = cdpObj.custrecord165;
					var itemStatus = cdpObj.custrecord_item_status;

					var filters = new Array();
					filters[0] = nlobjSearchFilter("type","transaction","anyOf","ItemRcpt");
					filters[1] = nlobjSearchFilter("internalid",null,"anyOf",itemId);
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid","transaction"));
					var searchRecord = nlapiSearchRecord('item',null,filters ,cols);
					if(searchRecord != null)
					{
						   var id = searchRecord[0].getValue(cols[0]); 
						   if(id > 0 && itemStatus == 2 && (portalReqType == '3' || portalReqType == '4')) //portal request type sold/memo 
						   {
								  PushPaymentToPortal(datain.cdp_data[i].cdp_id);
						   }
					}
					//Ended new logic by ajay					

				}//ended for loop condition	
				err.status = "OK";
				err.message= "CDP records sync with shipping data and CDP Id is :"+updatedId;
				return err;
			}
		}
		catch(err)
		{
            nlapiLogExecution("debug","Error occur during getting shipping record from portal is : ",err.message);
			err.status = "Failed";
			err.message= err.message;
			return err;
		}
	}
}

//Start function of ns payment to portal
function PushPaymentToPortal(cdpId)
{
	var url = "https://partner.brilliantearth.com/api/order-notify/"; // for Production
	//Setting up Headers
	var headers = new Array();
	headers['http'] = '1.1';
	headers['Accept'] = 'application/json';
	headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // for Production
	headers['Content-Type'] = 'application/json';
	headers['User-Agent-x'] = 'SuiteScript-Call';
				
	//Setting up Datainput
	var jsonobj = {"cdp_id": cdpId}
			
	//Stringifying JSON
	var myJSONText = JSON.stringify(jsonobj, replacer); 
	var response = nlapiRequestURL(url, myJSONText, headers, "POST");    
	
	//Below is being used to put a breakpoint in the debugger		  
	if(response.code=='200')
	{
		var responsebody = JSON.parse(response.getBody()) ;
		var retData = responsebody['action_needed'];
		nlapiSubmitField('customrecord_custom_diamond',cdpId,'custrecord_action_needed', retData); 		
		nlapiLogExecution('debug','Successfully Push On Vendor Portal for CDP and get action_needed value is :'+retData);		
	}
	else 
	{
		//var responsebody = JSON.parse(response.getBody()) ;
		//var retData = responsebody['action_needed'];
		nlapiLogExecution('debug','Payment detail not exists to push on portal for CdpId:'+cdpId, cdpId);        
	}		
}  

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
		return String(value);
   }
   return value;
}


