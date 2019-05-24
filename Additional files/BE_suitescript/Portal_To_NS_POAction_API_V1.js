//var datain = {"po_id":"14460352","portal_status":[4,12],"user":"Oscar Ocoro","is_unset":true,"action":"Confirm New Order","date_created":"2017-07-24 13:19:33"};
//var ss = POActionAPI(datain);
//var d = 0;
//---------------------------------------------------New script code-----------------------

function POActionAPI(datain)
{
	var PID = '';
	var receiveGem = 0; //Added by ajay 15May 2017
	var resObj = null;
    var err = new Object();
	var poId = 0;
    var startDate = '';
    var stTime = '';
	var action = '';
    var portalArr = new Array();
	nlapiLogExecution("debug","Portal Data is :",JSON.stringify(datain));
	try
	{
		// Validate if mandatory record type is set in the request		
		if (datain.po_id == "")
		{
			err.status = "failed";
			err.message= "missing po_id";
			return err;
		}
		if (datain.user == "")
		{
			err.status = "failed";
			err.message= "missing user";
			return err;
		}
		if(datain.action == "")
		{
			err.status = "failed";
			err.message= "missing action";
			return err;
		}
		if(datain.date_created == "")
		{
			err.status = "failed";
			err.message= "missing date_created";
			return err;
		}
		if(String(datain.is_unset) == "")
		{
			err.status = "failed";
			err.message= "missing is_unset";
			return err;
		}
        //Added new code by ajay 14Sept 2016
		if(datain.portal_status != null)
		{			
			for(var i=0; i < datain.portal_status.length; i++)
			{
				if(datain.portal_status[i] =="")
				{
					err.status = "failed";
					err.message= "missing portal status value to be update";
                    nlapiLogExecution("debug","portal_status is :",err.message);
					return err;
				}
				portalArr.push(datain.portal_status[i]);
			}
		}
        //Ended
        //For getting date_created format
		if(datain.date_created != null && datain.date_created != "")
		{
			var stDate =datain.date_created.split('-');				 
			startDate =stDate[1]+'/'+stDate[2].split(' ')[0]+'/'+stDate[0];				 
			stTime = stDate[2].split(' ')[1];			 
			var sstTime =stTime.split(':')[0];                                 
			 
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
		}

		//For field syncing from portal to ns
		if(datain.po_id != null && datain.po_id != "undefined")
		{
			PID= datain.po_id;
			var poObj = nlapiLoadRecord("purchaseorder",datain.po_id);
			if(datain.user != null && datain.user != 'undefined')
			{   					
				poObj.setFieldValue("custbody_portal_user",datain.user);
				nlapiLogExecution('DEBUG',"User name is : "+ datain.user,PID);				
			}
			if (datain.date_created != null && datain.date_created != "" && datain.date_created != "undefined") 
			{
              	var strDate = startDate +" "+stTime;			 
             	poObj.setFieldValue("custbody_portal_po_datetime",strDate); 
												
				nlapiLogExecution('DEBUG',"Date_Created value is : "+ datain.date_created);
				nlapiLogExecution('DEBUG',"Date value is : "+ startDate);
				nlapiLogExecution('DEBUG',"Time value is : "+ stTime);				
			}
			if (datain.action != null && datain.action != "undefined") 
			{					
				nlapiLogExecution('DEBUG',"Action value is : "+ datain.action,PID);
				action =  startDate +" "+stTime.replace(" am","").replace(" pm","") +" "+datain.user;
				nlapiLogExecution('DEBUG',"Action date time value is : "+ action,PID);
				
				switch (datain.action)
				{
					case "Confirm New Order":
						poObj.setFieldValue("custbody_new_order_button",action);
						break;
					case "Confirm Revised Order":
						poObj.setFieldValue("custbody_revised_order_button",action);
						break;
					case "Confirm Cancellation":
						poObj.setFieldValue("custbody_confirm_cancellation",action);
						break;
					case "Confirm Diamond Delay":
						poObj.setFieldValue("custbody_diamond_delay_button",action);
						break;
					case "Attach CAD":
						poObj.setFieldValue("custbody_cad_approval_needed",action);
                        poObj.setFieldValue("custbody41",37);
                        poObj.setFieldValue("custbody_portal_status",9); // CAD Approval Needed                                                
						break;
					case "Approved to Grow Confirmation":
						poObj.setFieldValue("custbody_grow_confirmation",action);
						break;
					case "Other":
						poObj.setFieldValue("custbody_receive_gem_button",action);
						receiveGem = 1; //Added by ajay 15May 2017
						break;					
					case "Attach Drop ship photo":
						poObj.setFieldValue("custbody_drop_ship_approval",action);
						break;
					default:
						break;
				}
			}
			
			if (datain.is_unset) 
			{					
				poObj.setFieldValue("custbody_is_unset",'T');
				nlapiLogExecution('DEBUG',"Is Unset value is : "+ datain.is_unset,PID);				
			}
            else if (!datain.is_unset) 
			{					
				poObj.setFieldValue("custbody_is_unset",'F');
				nlapiLogExecution('DEBUG',"Is Unset value is : "+ datain.is_unset,PID);				
			}
            poObj.setFieldValue("custbody_portal_status",portalArr);
            poObj.setFieldValue("custbody363",JSON.stringify(datain));
            poObj.setFieldValue("custbody369","937");
			poId = nlapiSubmitRecord(poObj,true,true);
			nlapiLogExecution("debug","Updated PO Id is : ",poId);
		}		
		if(poId > 0)
		{
			//Added by ajay 15May 2017
			if(receiveGem == 1)
			{
				CheckDiamondPO(poId);
			}
			//Ended by ajay 15May 2017
			
			err.status = "OK";
			err.message= "Successfully Updated Purchase Order for Action API.";
			return err;
		} 
		else
		{
			return null;
		}
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Raise error during portal to ns sync is : "+PID,ex.message);
		resObj = {
			"status" : "failed",
			"message": ex.message
		}
		return resObj;
	}
}

//New Added by ajay 15May 2017
function CheckDiamondPO(poId)
{    
	var soId = nlapiLookupField("purchaseorder",poId,"createdfrom");
	if(soId != "")
	{
		var soObj = nlapiLoadRecord("salesorder",soId);
		var itemCount = soObj.getLineItemCount("item");
		for(var x=1; x <= itemCount; x++)
		{
			var pId = soObj.getLineItemValue("item","createdpo",x);
			if(pId != null)
			{
				var pObj = nlapiLookupField("purchaseorder",pId,["entity","status"]);
				var type_of_contact = nlapiLookupField("vendor",pObj.entity,"custentity4");
				if(type_of_contact == 1 && pObj.status == "pendingReceipt") //Diamond Supplier & Pending Receipt
				{
					CreateItemReceipt(pId);
				}
			}
		}
	}
}

function CreateItemReceipt(pId)
{	
	var obj = nlapiLookupField("purchaseorder",pId,["custbody39","entity"]);
	var dropShip = obj.custbody39;
	nlapiLogExecution("debug","dropShip is  : "+dropShip);
	var vendorId = obj.entity;
	//var vendorLoc = nlapiLookupField("vendor",vendorId,"custentity136");//Sandbox
  var vendorLoc = nlapiLookupField("vendor",vendorId,"custentity138");// Live  Yagya 14 July 17

	var receipt = nlapiTransformRecord("purchaseorder",pId,"itemreceipt");
	if(dropShip != "" )
	{
		for(var x=0; x < receipt.getLineItemCount("item"); x++)
		{
			nlapiLogExecution("debug","vendor location is  : "+vendorLoc);
			receipt.setLineItemValue("item","itemreceive",x+1,"T");
			receipt.setLineItemValue('item','location',x+1,vendorLoc); //vendor location
		}
	}
	else
	{
		for(var x=0; x < receipt.getLineItemCount("item"); x++)
		{
			receipt.setLineItemValue("item","itemreceive",x+1,"T");
			receipt.setLineItemValue('item','location',x+1,2); //San Francisco
		}
	}
	var irId = nlapiSubmitRecord(receipt,true,true);
	nlapiLogExecution("debug","PO is received successfully and created item receipt id is : "+irId);
	irId = Update_ItemReceipt(irId,dropShip,vendorLoc);    
}

function Update_ItemReceipt(irId,dropShip,vendorLoc)
{
    var receipt = nlapiLoadRecord("itemreceipt",irId);
    for(var x=0; x < receipt.getLineItemCount("item"); x++)
    {
        if(dropShip != "")
        {
	        receipt.setLineItemValue("item","itemreceive",x+1,"T");                
	        receipt.setLineItemValue('item','location',x+1,vendorLoc); //vendor location
        }
        else
        {
	        receipt.setLineItemValue("item","itemreceive",x+1,"T");                
	        receipt.setLineItemValue('item','location',x+1,2); //San Francisco
        }                
    } 
    irId = nlapiSubmitRecord(receipt);
	return irId;
}
//Ended by ajay 15May 2017