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
					var custrecord_attention_acr = nlapiGetFieldValue('custrecord_attnetion_acr');
					var custrecord_addressee_acr = nlapiGetFieldValue('custrecord_addressee_acr');
					var custrecord_phone_acr = nlapiGetFieldValue('custrecord_phone_acr');
					var custrecord_address_1_acr = nlapiGetFieldValue('custrecord_address_1_acr');
					var custrecord_address_2_acr = nlapiGetFieldValue('custrecord_address_2_acr');
					var custrecord_city_acr = nlapiGetFieldValue('custrecord_city_acr');
					var custrecord_state_acr = nlapiGetFieldValue('custrecord_state_acr');
					var custrecord_zip_acr = nlapiGetFieldValue('custrecord_zip_acr');
					
					if(acr.getFieldValue('custrecord_pickup_at_be_acr')=='T')
					{
						so_load_record.setFieldValue('custbody53','T');
						so_load_record.setFieldValue('custbody_pickup_location',acr.getFieldValue('custrecord_pickup_location_acr'));
						
						var filters = [];
						filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",acr.getFieldValue('custrecord_pickup_location_acr')));
						var results = nlapiSearchRecord("location",null,filters);
						if(results)
						{
							var location = nlapiLoadRecord("location",results[0].getId());
							
							so_load_record.setFieldValue("shipaddressee","Brilliant Earth Showroom");
							so_load_record.setFieldValue("shipattention",so_load_record.getFieldText("entity"));
							so_load_record.setFieldValue("shipaddr1",location.getFieldValue("addr1"));
							so_load_record.setFieldValue("shipaddr2",location.getFieldValue("addr2"));
							so_load_record.setFieldValue("shipcountry",location.getFieldValue("country"));
							so_load_record.setFieldValue("shipcity",location.getFieldValue("city"));
							so_load_record.setFieldValue("shipstate",location.getFieldValue("state"));
							so_load_record.setFieldValue("shipzip",location.getFieldValue("zip"));
							
							var customerName = so_load_record.getFieldText("entity");
							customerName = customerName.substring(customerName.indexOf(" ") + 1);
							
							var addrText = "";
							addrText += customerName + "\nBrilliant Earth Showroom\n";
							addrText += location.getFieldValue("addr1") + "\n";
							if(location.getFieldValue("addr2")!=null && location.getFieldValue("addr2")!="")
								addrText += location.getFieldValue("addr2") + "\n";
							addrText += location.getFieldValue("city") + " " + location.getFieldValue("state") + " " + location.getFieldValue("zip") + "\n";
							addrText += location.getFieldValue("country");
							
							so_load_record.setFieldValue("shipaddress",addrText);
						}
					}
					else
					{
						//Create new address on customer record
						var customer = nlapiLoadRecord("customer",so_load_record.getFieldValue("entity"),{recordmode:"dynamic"});
						
						customer.selectNewLineItem("addressbook");
						
						var addrRecord = customer.createCurrentLineItemSubrecord("addressbook","addressbookaddress");
						
						addrRecord.setFieldText('country', custrecord_country_acr);
						addrRecord.setFieldValue('attention', custrecord_attention_acr);
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
						
						so_load_record.setFieldValue("shipaddressee",custrecord_addressee_acr);
						so_load_record.setFieldValue("shipattention",custrecord_attention_acr);
						so_load_record.setFieldValue("shipaddr1",custrecord_address_1_acr);
						so_load_record.setFieldValue("shipaddr2",custrecord_address_2_acr);
						so_load_record.setFieldText("shipcountry",custrecord_country_acr);
						so_load_record.setFieldValue("shipcity",custrecord_city_acr);
						so_load_record.setFieldValue("shipstate",custrecord_state_acr);
						so_load_record.setFieldValue("shipzip",custrecord_zip_acr);
						so_load_record.setFieldValue("shipphone",custrecord_phone_acr);
						
						var shipAddrText = "";
						if(custrecord_attention_acr!=null && custrecord_attention_acr!="")
							shipAddrText+= custrecord_attention_acr + "\n";
						shipAddrText+= custrecord_addressee_acr + "\n";
						shipAddrText+= custrecord_address_1_acr + "\n";
						if(custrecord_address_2_acr!=null && custrecord_address_2_acr!="")
							shipAddrText+= custrecord_address_2_acr + "\n";
						shipAddrText+= custrecord_city_acr + " " + custrecord_state_acr + " " + custrecord_zip_acr + "\n";
						shipAddrText+= custrecord_country_acr;
						
						so_load_record.setFieldValue("shipaddress",shipAddrText);
						
						so_load_record.setFieldValue("custbody53","F");
						so_load_record.setFieldValue("custbody_pickup_location","");
					}
					
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
					
					//CS Fulfillment Script Updates
					var csFulfillmentStatus = so_load_record.getFieldValues("custbody140");
					nlapiLogExecution("debug","CS Fulfillment Status",JSON.stringify(csFulfillmentStatus));
					
					if(csFulfillmentStatus!=null && csFulfillmentStatus!="")
					{
						var removePending = false;
						
						for(var x=0; x < csFulfillmentStatus.length; x++)
						{
							if(csFulfillmentStatus[x]=="17")
							{
								nlapiLogExecution("debug","CS Fulfillment Pending Found","Removing...");
								
								removePending = true;
								break;
							}
						}
						
						if(removePending==true)
						{
							var tempValue = [];
							for(var x=0; x < csFulfillmentStatus.length; x++)
							{
								if(csFulfillmentStatus[x]!="17")
								{
									tempValue.push(csFulfillmentStatus[x]);
								}
							}
							
							if(tempValue.length > 0)
								so_load_record.setFieldValues('custbody140', tempValue);
							else
								so_load_record.setFieldValue('custbody140', '');
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
		else
		{
			if(type=='create' || type=='edit')
			{
				var statusOfAddressChange = acr.getFieldValue('custrecord_status_of_reroute_acr');
				var rerouteRequestStatus = acr.getFieldValue('custrecord_reroute_request_status');
				
				var pendingAddress = false;
				
				//Ensure still Pending Address if Status = Requested (1) or FC Request More Info (3)
				if(statusOfAddressChange=='1' || statusOfAddressChange=='3' || rerouteRequestStatus=='1' || rerouteRequestStatus=='3')
				{
					nlapiLogExecution("debug","Setting Pending Address to True in CS Fulfillment Status");
					pendingAddress = true;
				}
				
				var so_load_record = nlapiLoadRecord('salesorder',so_id,{recordmode:'dynamic'});
				
				//CS Fulfillment Script Updates
				var csFulfillmentStatus = so_load_record.getFieldValues("custbody140");
				nlapiLogExecution("debug","CS Fulfillment Status",JSON.stringify(csFulfillmentStatus));
				
				if(csFulfillmentStatus!=null && csFulfillmentStatus!="")
				{
					if(pendingAddress==false)
					{
						var removePending = false;
					
						for(var x=0; x < csFulfillmentStatus.length; x++)
						{
							if(csFulfillmentStatus[x]=="17")
							{
								nlapiLogExecution("debug","CS Fulfillment Pending Found","Removing...");
								
								removePending = true;
								break;
							}
						}
						
						if(removePending==true)
						{
							var tempValue = [];
							for(var x=0; x < csFulfillmentStatus.length; x++)
							{
								if(csFulfillmentStatus[x]!="17")
								{
									tempValue.push(csFulfillmentStatus[x]);
								}
							}
							
							if(tempValue.length > 0)
								so_load_record.setFieldValues('custbody140', tempValue);
							else
								so_load_record.setFieldValue('custbody140', '');
						}
					}
					else
					{
						var addPending = true;
					
						for(var x=0; x < csFulfillmentStatus.length; x++)
						{
							if(csFulfillmentStatus[x]=="17")
							{
								addPending = false;
								break;
							}
						}
						
						if(addPending==true)
						{
							nlapiLogExecution("debug","CS Fulfillment Pending NOT Found","Adding...");
							
							var tempValue = [];
							for(var x=0; x < csFulfillmentStatus.length; x++)
							{
								tempValue.push(csFulfillmentStatus[x]);
							}
							
							tempValue.push("17");
							
							so_load_record.setFieldValues('custbody140', tempValue);
						}
					}
				}
				else if(pendingAddress==true)
				{
					so_load_record.setFieldValue('custbody140', '17');
				}
				
				var soId = nlapiSubmitRecord(so_load_record, true, true);
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution('Error', 'Error Occured', ex.message);
	}
}