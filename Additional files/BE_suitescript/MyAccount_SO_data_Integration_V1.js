nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : User Event
 * Script Name   : MyAccount_SO_data_Integration.js
 * Last Modified Date : Jul 18, 2016
 **/

function My_Account_SO_Data_Integration(type)
{
    	nlapiLogExecution("Debug","Event type on Updation of SO :"+type,type);
			if(type=='create' || type=='edit' ||type=='approve'|| type=='cancel')
	{
	   try  
	  {	
			var soId=nlapiGetRecordId();                       
		        nlapiLogExecution("Debug","soId is :"+soId,soId);
			var soObj=nlapiLoadRecord("salesorder",soId);
			var orderType=soObj.getFieldValue("custbody87");                       
			var soStatus=soObj.getFieldValue("status");
                         nlapiLogExecution("Debug","SO Status is :",soStatus);
			var MyAccount_WebInfo=soObj.getFieldValue("custbody_my_account_info_on_web");                             
			var MyAccount_LastUpdated=soObj.getFieldValue("custbody_my_account_info_last_updated"); 	                        
				
			if((orderType==1 || orderType==5) && soStatus=="Pending Approval")
			{
				MyAccount_WebInfo="F";				
				nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);
				nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
			}
			else if(type=='approve')
			{
			        MyAccount_WebInfo="T";				
				nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);
				nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
			}
		    else if(type=='cancel')
			{
			        MyAccount_WebInfo="T";				
				nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);
				nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
			}
		
				else if(type=='edit')
				{
				  if((orderType==1 || orderType==5) && soStatus=="Pending Approval")	
					{                                          
						       MyAccount_WebInfo="F";
						       nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);
						       nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
                                                    
					}
					else if((orderType==1 || orderType==5) && soStatus!="Pending Approval")
					{
                                                var k=0;
						var old_docno = IsEmpty(nlapiGetOldRecord().getFieldValue("tranid")); 
						var new_docno = IsEmpty(nlapiGetNewRecord().getFieldValue("tranid"));
						nlapiLogExecution("debug","old document number is : ",old_docno);
						 nlapiLogExecution("debug","new document number is : ",new_docno);

						var old_WebsiteNo = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody71")); 
						var new_WebsiteNo = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody71"));
						nlapiLogExecution("debug","old Website Order number is : ",old_WebsiteNo);
						nlapiLogExecution("debug","new Website Order number is : ",new_WebsiteNo);

						var old_deldate = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody6")); 
						var new_deldate = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody6"));
						nlapiLogExecution("debug","old delivery date is : ",old_deldate);
						nlapiLogExecution("debug","old delivery date is : ",new_deldate);

						/*var old_shiptoAdd = IsEmpty(nlapiGetOldRecord().getFieldValue("shipaddress")); 
						var new_shiptoAdd = IsEmpty(nlapiGetNewRecord().getFieldValue("shipaddress"));
						nlapiLogExecution("debug","old Ship Address is : ",old_shiptoAdd);
						nlapiLogExecution("debug","New Ship Address is : ",new_shiptoAdd);

						var old_billtoAdd = IsEmpty(nlapiGetOldRecord().getFieldValue("billaddress")); 
						var new_billtoAdd = IsEmpty(nlapiGetNewRecord().getFieldValue("billaddress"));
						nlapiLogExecution("debug","old Bill Address is : ",old_billtoAdd);
						nlapiLogExecution("debug","New Bill Address is : ",new_billtoAdd);*/

						var old_pickupBE = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody53")); 
						var new_pickupBE = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody53"));
						nlapiLogExecution("debug","old Pick Up At BE Value is : ",old_pickupBE);
						nlapiLogExecution("debug","New Pick Up At BE Value is : ",new_pickupBE);

						var old_pickupLoc = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody_pickup_location")); 
						var new_pickupLoc = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody_pickup_location"));
						nlapiLogExecution("debug","old Pick Up Location is : ",old_pickupLoc);
						nlapiLogExecution("debug","New Pick Up Location is : ",new_pickupLoc);

						var old_taxfield = IsEmpty(nlapiGetOldRecord().getFieldValue("taxitem")); 
						var new_taxfield = IsEmpty(nlapiGetNewRecord().getFieldValue("taxitem"));
						nlapiLogExecution("debug","old Tax Value is : ",old_taxfield);
						nlapiLogExecution("debug","New Tax Value is : ",new_taxfield);

						var old_taxPer = IsEmpty(nlapiGetOldRecord().getFieldValue("taxrate")); 
						var new_taxPer = IsEmpty(nlapiGetNewRecord().getFieldValue("taxrate"));
						nlapiLogExecution("debug","old Tax Percent Value is : ",old_taxPer);
						nlapiLogExecution("debug","New Tax Percent Value is : ",new_taxPer);

						var old_taxAmt = IsEmpty(nlapiGetOldRecord().getFieldValue("taxtotal")); 
						var new_taxAmt = IsEmpty(nlapiGetNewRecord().getFieldValue("taxtotal"));
						nlapiLogExecution("debug","old Tax Amount is : ",old_taxAmt);
						nlapiLogExecution("debug","New Tax Amount is : ",new_taxAmt);

						var old_Disc = IsEmpty(nlapiGetOldRecord().getFieldValue("discounttotal")); 
						var new_Disc = IsEmpty(nlapiGetNewRecord().getFieldValue("discounttotal"));
						nlapiLogExecution("debug","old Discount Value is : ",old_Disc);
						nlapiLogExecution("debug","New Discount Value is : ",new_Disc);

						var old_shippingCost = IsEmpty(nlapiGetOldRecord().getFieldValue("shippingcost")); 
						var new_shippingCost = IsEmpty(nlapiGetNewRecord().getFieldValue("shippingcost"));
						nlapiLogExecution("debug","old Shipping Cost Value is : ",old_shippingCost);
						nlapiLogExecution("debug","New Shipping Cost Value is : ",new_shippingCost);


						var old_subtotal = IsEmpty(nlapiGetOldRecord().getFieldValue("subtotal")); 
						var new_subtotal = IsEmpty(nlapiGetNewRecord().getFieldValue("subtotal"));
						nlapiLogExecution("debug","old subtotal Value is : ",old_subtotal);
						nlapiLogExecution("debug","New subtotal Value is : ",new_subtotal);

						var old_webBal = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody_truebalanceamount")); 
						var new_webBal = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody_truebalanceamount"));
						nlapiLogExecution("debug","old True Balance Value is : ",old_webBal);
						nlapiLogExecution("debug","New True Balance Value is : ",new_webBal);

						var old_status = IsEmpty(nlapiGetOldRecord().getFieldValue("orderstatus")); 
						var new_status = IsEmpty(nlapiGetNewRecord().getFieldValue("orderstatus"));
						nlapiLogExecution("debug","old Status is : ",old_status);
						nlapiLogExecution("debug","New Status is : ",new_status);

						var old_APOtracking = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody310")); 
						var new_APOtracking = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody310"));
						nlapiLogExecution("debug","old APOtracking Status is : ",old_APOtracking);
						nlapiLogExecution("debug","New APOtracking Status is : ",new_APOtracking);

						var old_Fedextracking = IsEmpty(nlapiGetOldRecord().getFieldValue("custbody69")); 
						var new_Fedextracking = IsEmpty(nlapiGetNewRecord().getFieldValue("custbody69"));
						nlapiLogExecution("debug","old Fedextracking Status is : ",old_Fedextracking);
						nlapiLogExecution("debug","New Fedextracking Status is : ",new_Fedextracking);

						for(var i=1; i<= nlapiGetNewRecord().getLineItemCount("item"); i++)
						{
							var itemType = nlapiGetNewRecord().getLineItemValue("item","item",i);
							var itemType = nlapiGetNewRecord().getLineItemValue("item","itemtype",i);
							if(itemType == "InvtPart")
							{
								var old_itemDesc = IsEmpty(nlapiGetOldRecord().getLineItemValue("item","description",i));
								var new_itemDesc = IsEmpty(nlapiGetNewRecord().getLineItemValue("item","description",i));

								var old_itemAmt = IsEmpty(nlapiGetOldRecord().getLineItemValue("item","amount",i));
								var new_itemAmt = IsEmpty(nlapiGetNewRecord().getLineItemValue("item","amount",i));
								if(old_itemDesc!=new_itemDesc || old_itemAmt!=new_itemAmt)
								{
								   k=1;
								}

							}
						}
						if(old_docno!=new_docno || old_WebsiteNo != new_WebsiteNo || old_deldate != new_deldate || 
						   old_pickupBE != new_pickupBE || old_pickupLoc != new_pickupLoc || old_taxfield != new_taxfield || old_taxPer != new_taxPer ||
						   old_taxAmt != new_taxAmt || old_Disc != new_Disc || old_shippingCost != new_shippingCost || old_subtotal != new_subtotal ||
						   old_webBal != new_webBal || old_status != new_status || old_APOtracking != new_APOtracking || old_Fedextracking != new_Fedextracking || k==1)
							{	
                                                               							   
								 MyAccount_WebInfo="T";
								 nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);
								 nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);   
                                                                 nlapiLogExecution("debug","field value changed for soId:", soId);                                                              
							}
							else
							{
							  nlapiLogExecution("Debug","Old & new Value did not changed:",soId);
							}
					}
					else
				     {
					    nlapiLogExecution("debug","error occuring in the condition:",soId);
					 }
	         }
		}	 
	catch(err)
	{
		nlapiLogExecution("Debug","Sales Order Data not submitted on website :",err.message);
	}
}
}
//old_shiptoAdd != new_shiptoAdd || old_billtoAdd != new_billtoAdd || 

function IsEmpty(val)
{
	if(val == null || val == "")
		return "";
	else
		return val;
}