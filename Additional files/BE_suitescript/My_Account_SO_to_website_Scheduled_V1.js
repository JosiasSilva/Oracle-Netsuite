/** 
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Scheduled
 * Script Name   : My_Account_SO_to_website_Scheduled.js
 * Created Date  : Jun 17, 2016
 * Last Modified Date : Sep 8, 2016
 **/

function MyAccount_Data_to_Portal(type)
{
	try
	{
		var mySearch = nlapiLoadSearch(null,4733);
		var searchresult = [];
		var resultset = mySearch.runSearch();
		var searchid = 0;
		do {
		    var resultslice = resultset.getResults( searchid, searchid+1000 );
		    if (resultslice !=null && resultslice !='') {	
		    for (var rs in resultslice) {
		    	searchresult.push( resultslice[rs] );
		        searchid++;
		    } 
		    }
		} while (resultslice.length >= 1000);
		 var cnt=0;
		 if (searchresult)
		    {
				nlapiLogExecution('debug','no of sales orders are ',searchresult.length);
				for ( var z = 0; z < searchresult.length; z++)
				{
					var Results = searchresult[z].getAllColumns();
					var recId= searchresult[z].getId();
					if(recId != null && recId != '')
					{
						var soObj=nlapiLoadRecord("salesorder",recId);
						var orderType=soObj.getFieldValue("custbody87");
						var soStatus=soObj.getFieldValue("status");
						var MyAccount_WebInfo=soObj.getFieldValue("custbody_my_account_info_on_web");
						//var MyAccount_LastUpdated=soObj.getFieldValue("custbody_my_account_info_last_updated");  
						try
						{
							if((orderType==1 || orderType==5) && soStatus!="Pending Approval"  && MyAccount_WebInfo=="T")
							{
								PushSODataNStoPortal(recId);
								nlapiLogExecution("debug","SO Data Successfully Pushed to Website",+recId,recId);
								/*MyAccount_WebInfo="F";
								 nlapiSubmitField("salesorder",recId,"custbody_my_account_info_on_web",MyAccount_WebInfo);							
								nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
								var currentDate = sysDate(); // returns the date
								var currentTime = timestamp(); // returns the time stamp in HH:MM:SS
								MyAccount_lastUpdated=currentDate + ' ' + currentTime;
								nlapiSubmitField("salesorder",recId,"custbody_my_account_info_last_updated",MyAccount_lastUpdated);
								nlapiLogExecution("debug","Current Date and Time is:",MyAccount_lastUpdated);*/							

							}
							else
							{
								nlapiLogExecution("Debug","Condition not Match for SO ID "+recId,'');
							}
						}
						catch(er)
						{
							nlapiLogExecution("Debug","Error for SO ID is "+recId,er.massage);
						}
					}	
				}		
			}		
	}	
	catch(err)
	{
		nlapiLogExecution("Debug","Exception Search Id 4733:", err.message);
	}
}



function PushSODataNStoPortal(recId)
{
	try
	{	
		nlapiLogExecution("DEBUG", "SO initiated to Push To Portal for recId:"+recId,recId);
		
		if(recId!='' && recId!=null)
		{
			var soObj=nlapiLoadRecord("salesorder",recId);
			
			var MyAccount_WebInfo=soObj.getFieldValue("custbody_my_account_info_on_web");  // My Account Web Information
			var MyAccount_lastUpdated=soObj.getFieldValue("custbody_my_account_info_last_updated");  // My Account Last Updated 
			
			var documentno=soObj.getFieldValue('tranid');
			var Weborderno= soObj.getFieldValue('custbody71');   //Website Order No.
			if(Weborderno=='' || Weborderno==null)
			{
				Weborderno=0;
			}
			else
			{
				Weborderno = parseInt(Weborderno);
			}
			
			var deliverydate=soObj.getFieldValue('custbody6');   // Delivery Date
			if(deliverydate=='' || deliverydate==null)
			{
				deliverydate=nlapiDateToString(new Date());
			}
			
			var shipto=soObj.getFieldValue('shipaddress');   // ship address
			 if(shipto=='' || shipto==null)
			 {
				 shipto=null;
			 }
			 
			 var billto=soObj.getFieldValue('billaddress');    // Bill address
			 if(billto=='' || billto==null)
			 {
				 billto=null;
			 }
			  var PickupatBE=soObj.getFieldValue('custbody53');    // Pick up at BE
			  if(PickupatBE=='F')
			  {
				  PickupatBE=false;
			  }
			  else
			  {
				  PickupatBE=true;
			  }
			  
			  var Pickuplocation= soObj.getFieldValue('custbody_pickup_location');   // Pick up location
			  if (Pickuplocation=='' || Pickuplocation==null)
			  {
				  Pickuplocation=1;
			  }
			  else
			  {
					  Pickuplocation = parseInt(Pickuplocation);
			  }
			  
			  var tax=parseInt(soObj.getFieldValue('taxitem'));        // Tax added
			  var taxpercent=soObj.getFieldValue('taxrate');    // Tax Percentage
			  if(taxpercent=='')
			  {
				  taxpercent=0.00;
			  }
			  
			  var taxamount=soObj.getFieldValue('taxtotal');    // Tax Total
			  if (taxamount=='' || taxamount==null)
			  {
				  taxamount=0.00;
			  }
			  else
			  {
				  taxamount = parseFloat(taxamount).toFixed(2);
			  }
			  var discount=soObj.getFieldValue('discounttotal');   // Discount
			  if(discount=='' || discount==null)
			  {
				  discount=0.00;
			  }
			  
			  var shippingcost=soObj.getFieldValue('shippingcost');   // Shipping Cost
			  if(shippingcost == '' || shippingcost == null)
			  {
				  shippingcost = 0.00;
			  }
			  
			  var subtotal_without_tax=soObj.getFieldValue('subtotal');           // Subtotal Without Tax
			  if(subtotal_without_tax=='' || subtotal_without_tax==null)
			  {
				  subtotal_without_tax=0.00;
			  }
			  else
			  {
				  subtotal_without_tax=parseFloat(subtotal_without_tax).toFixed(2);
			  }
			  
			 // var websiteBalance=soObj.getFieldValue('custbody_truebalanceamount');    // True Balance Amount    
                          var websiteBalance=soObj.getFieldValue('custbody_website_truebalance_amt'); 
			  if(websiteBalance=='' ||websiteBalance==null)
			  {		 
				  websiteBalance = 0;
			  }
			  var status=soObj.getFieldValue('status');    // Sales Order status
			  var APOtracking=soObj.getFieldValue('custbody310');      //APO Tracking #
			    if(APOtracking=='' || APOtracking== null )
				{
					APOtracking=null;
				}
			  var Fedextracking=soObj.getFieldValue('custbody69');     // Fedextracking#
                 if (Fedextracking=='' || Fedextracking==null)
                 {
					 Fedextracking=null;
				 }
                      var type_of_order=soObj.getFieldText('custbody87');
			  if( type_of_order=='Matched Wedding Band')
			  {
			    var order_type=type_of_order;
			  }
				 
				 var itemCount=soObj.getLineItemCount("item");  //Items
				 var IteArray = new Array();
                                 var descArray=new Array();
				 for ( var i = 1 ; i<= itemCount  ; i++)
				 {
					 var itemId=soObj.getLineItemValue('item','item',i);
					 var itemType=soObj.getLineItemValue('item','itemtype',i);
                     var itemname=soObj.getLineItemValue('item','item_display',i);
					  var itemcat=soObj.getLineItemValue('item','custcol_category',i);
					 if((itemType=='OthCharge' && itemId=='2158514') || (itemType=='Service' && itemId=='782') || (itemType=='Service' && itemId=='350') || (itemType=='Service' && itemId=='14772') || (itemType=='Discount' && itemId=='1762') || (itemType=='Discount' && itemId=='15037') || (itemType=='OthCharge' && itemId=='15918'))
					{	
						var V1,V2,V3,V4,V5,V6,V7;
						var itemDescription=soObj.getLineItemValue('item','description',i);
						if(itemDescription!=null)
						{						
							 var itemname=soObj.getLineItemValue('item','item_display',i);							 
							 var itemPrice=soObj.getLineItemValue('item','rate',i);
							if (itemname=='Modifications')
							{
							  V1= [itemDescription,itemPrice]							   
							}
							else if (itemname=='Mid-Production Order Change')
							{
							  V2= [itemDescription,itemPrice]							   
							}
							else if (itemname=='Expedite fee')
							{
							  V3= [itemDescription,itemPrice] 						   
							}
							else if (itemname=='Saturday Delivery')
							{
							  V4= [itemDescription,itemPrice] 						   
							}
							else if (itemname=='Bank Wire Discount')
							{
							  V5= [itemDescription,itemPrice]  						  
							}
							else if (itemname=='Discount')
							{
							 V6= [itemDescription,itemPrice]  						   
							}
							else if(itemname=='Service Fee')       // Added on 29/08/2016 By Rahul Panchal
							{
							 V7=[itemDescription,itemPrice]
							}
						   descArray={
						   "Modifications" : V1,
						   "Mid-Production Order Change" : V2,
						   "Expedite fee" :V3,
						   "Saturday Delivery" :V4,
						   "Bank Wire Discount" :V5, 
						   "Discount" :V6,
						   "Service Fee" :V7      // Added on 29/08/2016
					    };	
					}
                 }
                                        // Added on 19/08/2016 by Rahul Panchal

                        else if((itemType=="InvtPart" && (itemname.indexOf("DNU")!=-1)) || ((itemname.indexOf("Repair Ring")!=-1) && (itemId=='1087131')))
					 {
					    nlapiLogExecution("debug","item will not pushed to website",itemname);
					 }

                                     // Ended on 19/08/2016

                    else if(itemType == "InvtPart" || itemType=="Assembly")
                    {							 
							var itemname=soObj.getLineItemValue('item','item_display',i);							
							    itemname=getItemNameFormat(itemname,itemType,itemcat);
				
							// var itemcat=soObj.getLineItemValue('item','custcol_category',i);
							 if(itemcat=='' || itemcat==null)
							 {
								 itemcat='';   // Not accepting Null
							 }
							 else
							 {
								 itemcat= parseInt(itemcat);
							 }
							 var itemrate=soObj.getLineItemValue('item','rate',i);
							 if(itemrate=='' || itemrate==null)
							 {
								 itemrate=0;
							 }
							 var itemquan=soObj.getLineItemValue('item','quantity',i);
							 if(itemquan=='' || itemquan==null)
							 {
								 itemquan=0;
							 }
							 else
							 {
								 itemquan= parseInt(itemquan);
							 }
							 var itemamt=soObj.getLineItemValue('item','amount',i);
							 if(itemamt=='' || itemamt==null)
							 {
								 itemamt=0;
							 }
							 var itemInsVal=soObj.getLineItemValue('item','custcol_full_insurance_value',i);
							 if(itemInsVal=='' || itemInsVal==null)
							 {
								 itemInsVal=0;
							 }
							 var istaxable=soObj.getLineItemValue('item','istaxable',i);
							 if(istaxable=='' || istaxable==null)
							 {
								 istaxable=false;
							 }
							 else
							 {
								 istaxable=true;
							 }
							 var taxableamt=soObj.getLineItemValue('item','taxableamt',i);
							 if(taxableamt=='' || taxableamt==null)
							 {
								 taxableamt=0;
							 }
							 var itemcomment=soObj.getLineItemValue('item','custcol5',i);
							 if(itemcomment=='' || itemcomment==null)
							 {
								 itemcomment='';
							 }
							 var itemdesc=soObj.getLineItemValue('item','description',i);
							 if(itemdesc=='' || itemdesc==null)
							 {
								 itemdesc='';    // Not accepting Null
							 }
							 var gemstone_shape=nlapiLookupField('inventoryitem',itemId,'custitem5');
							 if(gemstone_shape=='' || gemstone_shape==null)
							 {
								 gemstone_shape='';
							 }
                               // Added by Rahul Panchal on 08 Sep 2016 
						      var gift_item=soObj.getLineItemValue('item','custcol_gift_item',i);													   
						        if(gift_item=='T')
							    {
							     Objitem= {
									 "Comments" : itemcomment,
									 "Item_category" : itemcat,
									 "Amount" : itemamt,							  
									 "Item_name" :  itemname,
									 "Quantity" : itemquan,
									 "Item_id" :(itemId),
									 "Description" : itemdesc,
									 "TaxableAmount" : taxableamt,
									 "Rate " : itemrate,
									 "Insurance_value" : itemInsVal,
									 "IsTaxable" : istaxable,
									  "Gemstone Shape" : gemstone_shape,
                                     "Gift Item" : gift_item
									  };
									 IteArray.push(Objitem);
							    }
							 else
							    {						
								   Objitem= {
									 "Comments" : itemcomment,
									 "Item_category" : itemcat,
									 "Amount" : itemamt,							  
									 "Item_name" :  itemname,
									 "Quantity" : itemquan,
									 "Item_id" :(itemId),
									 "Description" : itemdesc,
									 "TaxableAmount" : taxableamt,
									 "Rate " : itemrate,
									 "Insurance_value" : itemInsVal,
									 "IsTaxable" : istaxable,
									  "Gemstone Shape" : gemstone_shape											 
									  };
									 IteArray.push(Objitem);
						        }
					}

                             // Added on 19/08/2016 by Rahul Panchal
					  //(itemType=='OthCharge && itemId=='51823') added for Gift card as per NS-372 on dated 22/09/2016 by Rahul Panchal
				   else if(itemType=='NonInvtPart' || itemType=='OthCharge')
					 {
					   if(itemId=='34115' || itemId=='34114' || itemId=='34113' || itemId=='34112' || itemId=='34110' || itemId=='34108' || itemId=='34107' || itemId=='34079' || itemId=='34104' || itemId=='34105' || itemId=='34106' || itemId=='51823')
					   {
					     //var itemname=soObj.getLineItemValue('item','item_display',i);							
							  //  itemname=getItemNameFormat(itemname,itemType);
				
							// var itemcat=soObj.getLineItemValue('item','custcol_category',i);
							 if(itemcat=='' || itemcat==null)
							 {
								 itemcat='';   // Not accepting Null
							 }
							 else
							 {
								 itemcat= parseInt(itemcat);
							 }
							 var itemrate=soObj.getLineItemValue('item','rate',i);
							 if(itemrate=='' || itemrate==null)
							 {
								 itemrate=0;
							 }
							 var itemquan=soObj.getLineItemValue('item','quantity',i);
							 if(itemquan=='' || itemquan==null)
							 {
								 itemquan=0;
							 }
							 else
							 {
								 itemquan= parseInt(itemquan);
							 }
							 var itemamt=soObj.getLineItemValue('item','amount',i);
							 if(itemamt=='' || itemamt==null)
							 {
								 itemamt=0;
							 }
							 var itemInsVal=soObj.getLineItemValue('item','custcol_full_insurance_value',i);
							 if(itemInsVal=='' || itemInsVal==null)
							 {
								 itemInsVal=0;
							 }
							 var istaxable=soObj.getLineItemValue('item','istaxable',i);
							 if(istaxable=='' || istaxable==null)
							 {
								 istaxable=false;
							 }
							 else
							 {
								 istaxable=true;
							 }
							 var taxableamt=soObj.getLineItemValue('item','taxableamt',i);
							 if(taxableamt=='' || taxableamt==null)
							 {
								 taxableamt=0;
							 }
							 var itemcomment=soObj.getLineItemValue('item','custcol5',i);
							 if(itemcomment=='' || itemcomment==null)
							 {
								 itemcomment='';
							 }
							 var itemdesc=soObj.getLineItemValue('item','description',i);
							 if(itemdesc=='' || itemdesc==null)
							 {
								 itemdesc='';    // Not accepting Null
							 }
                            // Added by Rahul Panchal on 08 Sep 2016
							var gift_item=soObj.getLineItemValue('item','custcol_gift_item',i);													   
							if(gift_item=='T')
							{
							 Objitem= {
								 "Comments" : itemcomment,
								 "Item_category" : itemcat,
								 "Amount" : itemamt,							  
								 "Item_name" :  itemname,
								 "Quantity" : itemquan,
								 "Item_id" :(itemId),
								 "Description" : itemdesc,
								 "TaxableAmount" : taxableamt,
								 "Rate " : itemrate,
								 "Insurance_value" : itemInsVal,
								 "IsTaxable" : istaxable,
								 "Gift Item" : gift_item
								  };
								 IteArray.push(Objitem);
							}
						   else
							{						
							   Objitem= {
								 "Comments" : itemcomment,
								 "Item_category" : itemcat,
								 "Amount" : itemamt,							  
								 "Item_name" :  itemname,
								 "Quantity" : itemquan,
								 "Item_id" :(itemId),
								 "Description" : itemdesc,
								 "TaxableAmount" : taxableamt,
								 "Rate " : itemrate,
								 "Insurance_value" : itemInsVal,
								 "IsTaxable" : istaxable,
								  };
								 IteArray.push(Objitem);
							}
						   
					    }
					     }
                // ended on 19/08/2016
						else
						{
							nlapiLogExecution("debug","item will not pushed to array :");
						}
				 }
				 //Customer Deposit
					var customerDepositArr = new Array();
					var ifArr = [];
					var filters = [];
					var searchResult=[];
					var searchid = 0;
						filters[0] = nlobjSearchFilter("salesorder",null,"is",recId);

					var searchRecords = nlapiSearchRecord("customerdeposit",null,filters,[]);
					if(searchRecords != null && searchRecords!='')
					{   
					    for (var sr in searchRecords)
						{
							searchResult.push( searchRecords[sr] );
							searchid++;
						}
					      
					}
					if (searchResult)
					{
						nlapiLogExecution('debug','no of Customer Deposits  are ',searchResult.length);
						for ( var z = 0; z < searchResult.length; z++)
						{
							var Results = searchResult[z].getAllColumns();
							var custDepId=searchResult[z].getId();
							nlapiLogExecution('debug','Customer Deposit Id is ',custDepId);
							if(custDepId != null && custDepId != '')
							{
								var custDep=nlapiLoadRecord("customerdeposit",custDepId);
								var currency=parseInt(custDep.getFieldValue("currency"));
								var paymentAmt=custDep.getFieldValue("payment");
								//var paymentMethod=custDep.getFieldValue("paymentmethod");
								var pmtmethod = nlapiLookupField("customerdeposit",custDepId,'paymentmethod'); 
								nlapiLogExecution("debug","Payment Method is :"+pmtmethod);
								var paymentMethod;
								if(pmtmethod == null || String(pmtmethod).length == 0)
								{					
									paymentMethod = '[]';
									nlapiLogExecution("debug","Payment Method value is :",paymentMethod);
								}					
								else
								{
									paymentMethod = '[' +  pmtmethod + ']';
								}
					   
								var objCD = {
									"Currency" : currency,
									"Payment Amount" : paymentAmt,
									"Payment Method" : paymentMethod
									};
								customerDepositArr.push(objCD); 
							}
						}
					}

					//Item Fulfillment
					var filters = [];
					filters[0] = nlobjSearchFilter("createdfrom",null,"is",recId);									
					var searchRecords = nlapiSearchRecord("itemfulfillment",null,filters,[]);
					if(searchRecords != null)
					{
						var ifObj = nlapiLoadRecord("itemfulfillment",searchRecords[0].getId());
						var IFstatus = ifObj.getFieldText("shipstatus");
						var emailConfStatus = ifObj.getFieldText("custbody89");
						if(IFstatus == "Packed" && emailConfStatus == "Emailed")
						{
							var objIF = {
								"Status" : IFstatus,
								"Email Confirmation Status" : emailConfStatus	   
							};
							ifArr.push(objIF);
						}
					}
				 
				 var objJSON =				 
					 {  "True Balance": websiteBalance,
						"Status" : status,
						"Bill To": billto,
						"Ship To": shipto,
						"Subtotal_WithoutTax": subtotal_without_tax,
						"FedEx Tracking #": Fedextracking,
						"Items" : IteArray,						
						"Tax": tax,
						"Tax Amount": taxamount,
						"Pick Up at BE": PickupatBE,
						"Shipping Cost": parseFloat(shippingcost),
						"Discount": parseFloat(discount),
						"MyAccountSync": true,
						"Sales Order Id" : parseInt(recId),						
						"Document Number": documentno,
						"Pick Up Location":Pickuplocation,
						"Delivery Date": deliverydate ,
						"Website Order Number": Weborderno ,
						"Tax Percent": taxpercent,
						"APO Tracking #":APOtracking,
						"Customer Deposit" : customerDepositArr,
						"Item Fulfillment" : ifArr,
					    "Description" : descArray,
                                             "Type Of Order" : order_type
				    };
        }          				
		
		            // Setting of URL
		                     //var url="https://staging2015.brilliantearth.com/netsuite-api/import-ns-order/";          // for SandBox
                                          var url="https://www.brilliantearth.com/netsuite-api/import-ns-order/";                    // for Production

				 
				 // Setting of Headres
				    var headers = new Array(); 
					headers['https'] = '1.1';    
					headers['Accept'] = 'application/json';       
					//headers['Authorization']= 'Basic YmV0ZWFtOmIzNjM0YQ==';
					headers['auth-token']='YnJpbGxpYW50ZWFydGggYmViZTEz';
					headers['Content-Type'] = 'application/json'; 
					headers['User-Agent-x'] = 'SuiteScript-Call'; 
					
					var myJSONText = JSON.stringify(objJSON, replacer); 
					nlapiLogExecution('debug','SO Response Body as NS Input:', myJSONText);					   
					var response1 = nlapiRequestURL(url, myJSONText, headers); 
					nlapiLogExecution('debug','SO Response Body as Portal Output:', response1.body);
					
					if(response1.code==200)
					{
						var responsebody = JSON.parse(response1.getBody());
						nlapiLogExecution("debug", "SO successfully pushed to Portal.", +recId,recId);
						/*try
						{
							nlapiSubmitField('salesorder',recId,['custbody_my_account_info_on_web','custbody_my_account_info_last_updated'],['F']);
							response.sendRedirect("RECORD","salesorder",recId);
						}
						catch(err){							
						}*/
											
						// My Account Web Info Field updated after Pushed to website
						MyAccount_WebInfo="F";
						nlapiSubmitField("salesorder",recId,"custbody_my_account_info_on_web",MyAccount_WebInfo);							
						nlapiLogExecution("debug","Current value og My Account Web Information is :",MyAccount_WebInfo);
						
						var currentDate = sysDate(); // returns the date
						var currentTime = timestamp(); // returns the time stamp in HH:MM:SS
						MyAccount_lastUpdated=currentDate + ' ' + currentTime;
						nlapiSubmitField("salesorder",recId,"custbody_my_account_info_last_updated",MyAccount_lastUpdated);
						nlapiLogExecution("debug","Current Date and Time is when pushed:",MyAccount_lastUpdated);
						
					}
					else if(response1.code==400)
					{
						//response.write(response1.body);
						nlapiLogExecution("debug","data NS pushed is invalid : ",response1.body);	
					}
					else if(response1.code==401)
					{
						//response.write(response1.body);
						nlapiLogExecution("debug","Invalid Token and Authentication in header is :",response1.body);
					}
					else
					{
						//response.write(response1.body);
                        nlapiLogExecution("debug","Portal response is : ",response1.body);
					}
	}
	catch(err)
	{             
	     nlapiLogExecution("debug","Error occur during Salesorder Push from NS to portal is : ",err.message); 
            // response.sendRedirect("RECORD","salesorder",recId);          
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

function sysDate()
 {
	var date = new Date();
	var tdate = date.getDate();
	var month = date.getMonth() + 1; // jan = 0
	var year = date.getFullYear();
	return currentDate = month + '/' + tdate + '/' + year;
 }
 function timestamp() {
var str = "";

var currentTime = new Date();
var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();
var seconds = currentTime.getSeconds();
var meridian = "";
if (hours > 12) {
    meridian += "pm";
} else {
    meridian += "am";
}
if (hours > 12) {

    hours = hours - 12;
}
if (minutes < 10) {
    minutes = "0" + minutes;
}
if (seconds < 10) {
    seconds = "0" + seconds;
}
str += hours + ":" + minutes + ":" + seconds + " ";

return str + meridian;
}

function getItemNameFormat(itemStockNameArr, itemType,itemcat)
{
	var itemStockName = '';
	if (itemStockNameArr != '' && itemType != '')
	{
		var itemStockName = '';
		if (itemStockNameArr != '' && itemStockNameArr != null)
		{
			if (itemStockNameArr.indexOf(":") != -1)
			{
				var BE_pattern = /^be./im;
				var BE_result = BE_pattern.test(itemStockNameArr);
				if (BE_result)
				{
					itemStockName = itemStockNameArr.split(':')[1];
					if (itemStockName != '')
					{
					itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1];
					}
				}
				else
				{
				  itemStockName= itemStockNameArr.split(':')[1];
					if (itemStockName != '')
					{
						if(itemStockName.indexOf("J")!=-1)
						{
							return itemStockName;							
						}
						else
						{
						   if(itemStockName.indexOf("-S")!=-1)
							{
							   if(itemcat=='4' || itemcat=='5' || itemcat=='34')
							   {
							  		return itemStockName;
							   }
							}
						}
					}
				}
			}
			else if (itemStockNameArr.indexOf("S") != -1)
			{
				var BE_pattern = /^be./im;
				var BE_result = BE_pattern.test(itemStockNameArr);
				if (BE_result)
				{
					itemStockName = itemStockNameArr;
					var arrtest = itemStockName.split('-');
					if (itemStockName != '')
					{
						if (arrtest.length == 4)
						{
						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1] + '-' + itemStockName.split('-')[2];
						}
						else if (arrtest.length == 3)
						{
						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1];
						}
						else if (arrtest.length == 2)
						{
						  if(itemcat=='4' || itemcat=='5' || itemcat=='34')
							{
							   return itemStockName;
							}
						   else
							{
							  itemStockName = itemStockName.split('-')[0]; 
							}
						}
						else
						{
						 itemStockName = itemStockNameArr;
						}
					}
				}
				else
				{
				   itemStockName = itemStockNameArr;
				}
			}
			else if(itemStockNameArr!='')
			{
				var BE_pattern = /^be.*/im;
				var BE_result = BE_pattern.test(itemStockNameArr);
				if (BE_result)
				{
					itemStockName = itemStockNameArr;
					/*var arrtest = itemStockName.split('-');
					if (itemStockName != '')
					{
						if (arrtest.length == 4)
						{
						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1] + '-' + itemStockName.split('-')[2];
						}
						else if (arrtest.length == 3)
						{
						itemStockName = itemStockName.split('-')[0] + '-' + itemStockName.split('-')[1];
						}
						else if (arrtest.length == 2)
						{
						itemStockName = itemStockName.split('-')[0];
						}
						else
						{
						itemStockName = itemStockName;
						}
					}*/
				}
				else
				{
				  itemStockName = itemStockNameArr;
				}
			}
			else
			{
			itemStockName = itemStockNameArr;
			}

		}
	    }
		return itemStockName;

}
