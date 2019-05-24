/** 
 * Script Author : 	Nikhil Bhutani (nikhil.bhutani@inoday.com)
 * Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : 	UserEvent
 * Created Date  : 	July 9, 2018
 * Last Modified Date : July 11, 2018
 * Comments :Auto-update shipping address
 * Sandbox scriptURL: https://system.netsuite.com/app/common/scripting/script.nl?id=2322&whence=
 * Production scriptURL: https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2323&whence=
 */

function acr_after_submit(type)
{
	try
	{
		var acr = nlapiGetNewRecord();
		
		var customform = acr.getFieldText('customform');
		var add_change_status = acr.getFieldText('custrecord_status_of_reroute_acr');
		var so_id = acr.getFieldValue('custrecord_transaction_acr');
		
		if(customform == 'Custom Address Change Request Form' && add_change_status == 'FC Approved')
		{
			if(type=='create' || type=='edit' && nlapiGetOldRecord().getFieldText('custrecord_status_of_reroute_acr')!='FC Approved')
			{
				var so_load_record = nlapiLoadRecord('salesorder',so_id,{recordmode:'dynamic'});
		
				//var shippingaddress_createrecord = so_load_record.createSubrecord('shippingaddress');
				
				nlapiLogExecution('Debug', 'SO_ID: '+ so_id + 'add_change_status: ' + add_change_status + 'customform: ' + customform);
		
				if(customform == 'Custom Address Change Request Form' && add_change_status == 'FC Approved')
				{
					//var custrecord_country_acr_value = nlapiGetFieldValue('custrecord_country_acr');
		          	var custrecord_country_acr = nlapiGetFieldText('custrecord_country_acr');
					var custrecord_attnetion_acr = nlapiGetFieldValue('custrecord_attnetion_acr');
					var custrecord_addressee_acr = nlapiGetFieldValue('custrecord_addressee_acr');
					var custrecord_phone_acr = nlapiGetFieldValue('custrecord_phone_acr');
					var custrecord_address_1_acr = nlapiGetFieldValue('custrecord_address_1_acr');
					var custrecord_address_2_acr = nlapiGetFieldValue('custrecord_address_2_acr');
					var custrecord_city_acr = nlapiGetFieldValue('custrecord_city_acr');
					var custrecord_state_acr = nlapiGetFieldValue('custrecord_state_acr');
					var custrecord_zip_acr = nlapiGetFieldValue('custrecord_zip_acr');
					
					//Create new address on customer record
					var customer = nlapiLoadRecord("customer",so_load_record.getFieldValue("entity"));
					
					customer.selectNewLineItem("addressbook");
					
					var addrRecord = customer.createCurrentLineItemSubrecord("addressbook","addressbookaddress");
					
					addrRecord.setFieldText('country', custrecord_country_acr);
					addrRecord.setFieldValue('attention', custrecord_attnetion_acr);
					addrRecord.setFieldValue('addressee', custrecord_addressee_acr);
					addrRecord.setFieldValue('phone',custrecord_phone_acr);
					addrRecord.setFieldValue('addr1',custrecord_address_1_acr);
					addrRecord.setFieldValue('addr2',custrecord_address_2_acr);
					addrRecord.setFieldValue('city',custrecord_city_acr);
					addrRecord.setFieldValue('state',custrecord_state_acr);
					addrRecord.setFieldValue('zip',custrecord_zip_acr);
					addrRecord.commit();
					
					customer.commitLineItem("addressbook");
					
					var customerId = nlapiSubmitRecord(customer,true,true);
					
					nlapiLogExecution("debug","Customer record updated");
					
					customer = nlapiLoadRecord("customer",customerId);
					
					var newestId = 0;
					
					for(var x=0; x < customer.getLineItemCount("addressbook"); x++)
					{
						nlapiLogExecution("debug","Addressbook Line " + (x+1),"Internalid: " + customer.getLineItemValue("addressbook","internalid",x+1) + " | Label: " + customer.getLineItemValue("addressbook","label",x+1));
						
						if(customer.getLineItemValue("addressbook","internalid",x+1) > newestId)
							newestId = customer.getLineItemValue("addressbook","internalid",x+1);
					}
					
					nlapiLogExecution("debug","Address Internal ID to Apply to SO",newestId);
					
					so_load_record.setFieldValue('shipaddresslist', newestId);
					
					//Check to see if Delivery Instructions = Confirm Address Before Shipping
					//If they do, unselect that option
					var deliveryInstructions = so_load_record.getFieldValues("custbody194");
					if(deliveryInstructions!=null && deliveryInstructions!="")
					{
						var removeConfirm = false;
						
						for(var x=0; x < deliveryInstructions.length; x++)
						{
							if(deliveryInstructions[x]=="6")
							{
								removeConfirm = true;
								break;
							}
						}
						
						if(removeConfirm==true)
						{
							var tempValue = [];
							for(var x=0; x < deliveryInstructions.length; x++)
							{
								if(deliveryInstructions[x]!="6")
								{
									tempValue.push(deliveryInstructions[x]);
								}
							}
							so_load_record.setFieldValues('custbody194', tempValue);
						}
					}
					
					var soId = nlapiSubmitRecord(so_load_record, true, true);
					
					nlapiLogExecution("debug","Shipping address updated on SO and re-saved...");
					
					//Trigger update of sales order for Avalara tax processing
					var params = new Object();
					params["custscript_avalara_transaction_type"] = "salesorder";
					params["custscript_avalara_transaction_id"] = soId;
					
					nlapiScheduleScript("customscript_process_transaction_avalara",null,params);
					
					nlapiLogExecution("debug","Scheduled script successfully triggered...");
				}
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution('Error', 'Error Occured', ex.message);
	}
}