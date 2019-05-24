nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : User Event
 * Script Name   : upd_myAccInfo_on_EmailConf.js
 * Created Date  : July 26, 2016
 * Last Modified Date : July 27, 2016
 * Comments : Script will update My Account Web Info on SO page when a user manually change Email Confirmation Status to "Emailed" in  Item fulfillment.
 * SB URL: /app/common/scripting/script.nl?id=1027
 
 */

function myAccInfo_upd_On_EmailConStatus(type)
{
   nlapiLogExecution("Debug","Event type on Updation of Item Fulfillment:"+type,type);
   if(type=='edit' ||type=='view')
   {
	  try
	  {
		var Id=nlapiGetRecordId();  
		var recordType = nlapiGetRecordType();
		//nlapiLogExecution("debug", "record Type :" + recordType +" , Record  Id:"+Id,Id);		
		if(recordType == "itemfulfillment")
		{
            var emailConf_status=nlapiLookupField('itemfulfillment',Id,'custbody89');
			var pickUpatBE=nlapiLookupField('itemfulfillment',Id,'custbody53');
			var IFstatus=nlapiLookupField('itemfulfillment',Id,'status');
			var soId=nlapiLookupField('itemfulfillment',Id,'createdfrom');
			var soArrVal = nlapiLookupField('salesorder',soId,['custbody53','custbody140']);
			var soPickUpAtBE = soArrVal.custbody53;
			var csFulfillmentStatus = soArrVal.custbody140;
			//nlapiLogExecution('DEBUG', '---IF status --- : ' + IFstatus);
			//nlapiLogExecution('DEBUG', '---IF mail status --- : ' + emailConf_status);
			//nlapiLogExecution('DEBUG', '---IF pick up at BE --- : ' + pickUpatBE);
		
			if(pickUpatBE=='T' || soPickUpAtBE=='T')
			{
			  if(IFstatus=='packed')
			  {
					if(emailConf_status==2)
					{
						var soObj=nlapiLoadRecord('salesorder',soId);
						var soStatus=soObj.getFieldValue("status");
						var orderType=soObj.getFieldValue("custbody87");
						var MyAccount_WebInfo=soObj.getFieldValue("custbody_my_account_info_on_web");
						if((orderType==1 || orderType==5) && soStatus!="Pending Approval")
						{
							var count = 0;
							var arr = new Array();
							var fulfillArr = new Array();										
							if(csFulfillmentStatus != null && csFulfillmentStatus != '')
							{
							   fulfillArr = csFulfillmentStatus.split(',');               
							}
							for(var p=0; p<fulfillArr.length; p++)
							{
								if(fulfillArr[p]!= 21 )
								{    
								   arr[count] = fulfillArr[p];
								   count = count + 1;
								}
							}
							arr[arr.length] = 21; 		// Ready for pick up				 
							nlapiSubmitField("salesorder",soId,"custbody140",arr); //21 added
							nlapiLogExecution("debug","Submit Sales Order Id :",soId);
							if(arr.length>0)
							{
								for(var j=0; j<arr.length; j++)
								{
									if(arr[j]== 21 )
									{    
									   MyAccount_WebInfo="T";
									   nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);							
									   nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
									}
								}
							}
						}
						else
						{
						   nlapiLogExecution("debug","Sales Order Condition Not matched",soId);p
						}
					}
					else
					{
					  nlapiLogExecution("debug","Email Confirmation Status is:",emailConf_status);
					}
				}
		    }
		}
	  }
	  catch(err)
	  {

	  }
  }
}