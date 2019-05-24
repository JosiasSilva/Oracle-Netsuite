/** 
 * Script Author : 		Nikhil Bhutani (nikhil.bhutani@inoday.com)
 * Author Desig. : 		Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : 		RESTlet
 * Created Date  : 		July 11, 2018
 * Last Modified :		August 09, 2018
 * Comments 	 :		NS-1262 - RESTlet To capture Pre-Appointment Surveys in NS. Aragon will be Posting Data to this RESTlet.
 * Sandbox SS URL:		https://system.netsuite.com/app/common/scripting/script.nl?id=2336&whence=
 * Sandbox RESTlet URL:	https://666639-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=2336&deploy=1
 * Production SS URL:	https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2327&whence=	
 * Production RESTlet URL:	https://666639.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=2327&deploy=1 
 */
 /** Update Log:
 * NS-1287 - Make changes to populate 'custrecord_appointment' field on Custom Record based on the future appointments related to the customer. (Scenario 1/User Story Point 1)
 * NS-1391 - Client Note: "We believe this was set up to only set the Email Status (custentity_email_status) to 'New Survey Created' only if an appointment is found. This should be setting the status each time a survey comes in."
 */

/*
Expected Data Format for datain:
{ full_name : "TestFname TestLname",
custrecord_email_address : "test@xyz.com",
custrecord_ring_preferences : "ringpreference",
custrecord_gem_preferences : "gemstonepref",
custrecord_other_notes : "notes",
custrecord_original_order_email : "origemail@abc.com",
custrecord_original_order_number_text : "2018162775",
custrecord_purchased_er_from_be : "T"};
*/

function pre_appointment_survey(datain)
{
	nlapiLogExecution('Debug', 'Received Data: ', JSON.stringify(datain));
	var err = new Object();
	var customer_id;
	err =
	{
		"status": "Failed",
		"message": "Unknown Error Occured"
	};
	var jsonResponse = JSON.stringify(err,replacer);
	var flag = 0;
	try
	{
		if(datain.length != 0)
		{
			var full_name = datain.full_name;
			var custrecord_email_address = datain.custrecord_email_address;
			// var custrecord_phone_number= datain.custrecord_phone_number;		// Removed after requirement changed
			var custrecord_ring_preferences = datain.custrecord_ring_preferences;
			var custrecord_gem_preferences = datain.custrecord_gem_preferences;
			var custrecord_other_notes = datain.custrecord_other_notes;
			var custrecord_original_order_email = datain.custrecord_original_order_email;
			var custrecord_original_order_number;
			// var custrecord_original_order_number = datain.custrecord_original_order_number;	// Removed after requirement clarification
			var custrecord_original_order_number_text = datain.custrecord_original_order_number_text;
			var custrecord_purchased_er_from_be = datain.custrecord_purchased_er_from_be;
			
			var custrecord_first_name = '';
			var custrecord_last_name = '';
			var searchResult = null;
			
			if(full_name.length == 0)
			{
				nlapiLogExecution('Debug', 'full_name is empty');
			}
			else if(full_name)
			{
				var result = full_name.split(' ');
				var len = result.length;
				custrecord_last_name = result[len-1];
				for(var i = 0; i<len-1; i++)
				{
					custrecord_first_name = custrecord_first_name + result[i] + ' ';
				}
				custrecord_first_name = custrecord_first_name.trim();
				custrecord_last_name = custrecord_last_name.trim();
			}
			
			// Code to create a new record of type custom record
			
			var customrecord848_obj;
			customrecord848_obj = nlapiCreateRecord('customrecord848');
			customrecord848_obj.setFieldValue('custrecord_first_name',custrecord_first_name);
			customrecord848_obj.setFieldValue('custrecord_last_name',custrecord_last_name);
			customrecord848_obj.setFieldValue('custrecord_email_address',custrecord_email_address);
			// customrecord848_obj.setFieldValue('custrecord_phone_number',custrecord_phone_number);
			customrecord848_obj.setFieldValue('custrecord_ring_preferences',custrecord_ring_preferences);
			customrecord848_obj.setFieldValue('custrecord_gem_preferences',custrecord_gem_preferences);
			customrecord848_obj.setFieldValue('custrecord_other_notes',custrecord_other_notes);
			customrecord848_obj.setFieldValue('custrecord_original_order_email',custrecord_original_order_email);
			// customrecord848_obj.setFieldValue('custrecord_original_order_number',custrecord_original_order_number);
			if(custrecord_original_order_number_text.length != 0)
			{
				searchResult = nlapiSearchRecord('transaction',null,[new nlobjSearchFilter('tranid',null,'is',custrecord_original_order_number_text), new nlobjSearchFilter('mainline',null,'is','T')]);
			}
			if(searchResult && searchResult != null)
			{
				custrecord_original_order_number = searchResult[0].id;
				customrecord848_obj.setFieldValue('custrecord_original_order_number',custrecord_original_order_number);
			}
			customrecord848_obj.setFieldValue('custrecord_original_order_number_text',custrecord_original_order_number_text);
			if(custrecord_purchased_er_from_be.toUpperCase() == 'T')
			{
				customrecord848_obj.setFieldValue('custrecord_purchased_er_from_be', custrecord_purchased_er_from_be.toUpperCase());
			}
			var customrecord848_id = nlapiSubmitRecord(customrecord848_obj);
			
			/*
			Code to lookup the existing customer using search with custrecord_original_order_email
			*/
			
			if(custrecord_original_order_email.length != 0)
			{
				nlapiLogExecution('Debug', 'custrecord_original_order_email has value');
				var ooe_filter = []; // Original Order Email Filter
				ooe_filter.push(new nlobjSearchFilter('email',null,'is',custrecord_original_order_email));
				ooe_result = nlapiSearchRecord('customer',null,ooe_filter);
				if(ooe_result)
				{
					var ooe_customer_id = ooe_result[0].getId();
					flag = 1;
					nlapiLogExecution('debug', 'Existing customer with ooe_customer_id: '+ ooe_customer_id + ' & flag vlaue: ' + flag);
					if(ooe_customer_id)
					{
						customer_id = ooe_customer_id;
						// var customer_obj = nlapiLoadRecord('customer',customer_id);
						nlapiSubmitField('customrecord848',customrecord848_id,'custrecord_customer',ooe_customer_id,true);						
					}
					err.status = "OK";
					err.message = "Success";
					jsonResponse = JSON.stringify(err, replacer);
				}
			}
			/* 
			Code to check if the custrecord_original_order_email has no value
			then check if custrecord_email_address has value then search using custrecord_email_address
			create new lead if not found
			*/
			if(flag == 0)
			{
				nlapiLogExecution('Debug', 'Either custrecord_original_order_email is empty or could not find the customer');
				
				if(custrecord_email_address.length == 0)
				{
					nlapiLogExecution('Debug', 'custrecord_email_address is empty');
					err.status = "Failed";
					err.message = "custrecord_email_address field is blank.";
					jsonResponse = JSON.stringify(err, replacer);
					return jsonResponse;
				}
				
				/* Check if custrecord_email_address has value and then search using custrecord_email_address*/
				
				else // Code to lookup for customer and create a new lead if not found
				{
					nlapiLogExecution('Debug', 'custrecord_email_address has value. Search and create new if not found');
					
					var ea_filter = []; // Email Address Filter
					ea_filter.push(new nlobjSearchFilter('email',null,'is',custrecord_email_address));
					var ea_result = nlapiSearchRecord('customer',null,ea_filter);
					if(ea_result)
					{
						var ea_customer_id = ea_result[0].getId();
						nlapiLogExecution('debug', 'Existing customer with ea_customer_id: '+ ea_customer_id);
						if(ea_customer_id)
						{
							customer_id = ea_customer_id;
							// var customer_obj = nlapiLoadRecord('customer',ea_customer_id);
							nlapiSubmitField('customrecord848',customrecord848_id,'custrecord_customer',ea_customer_id,true);
						}
						err.status = "OK";
						err.message = "Success";
						jsonResponse = JSON.stringify(err, replacer);
					}
					/*
					Code to create a new lead as the customer email adress was not found in netsuite with ea_filter
					*/
					else
					{
						nlapiLogExecution('debug', 'Customer does not exist with Email Address ea_filter');
						/* Create new lead */
						var new_lead = nlapiCreateRecord('customer',{stage: 'lead'});
						new_lead.setFieldValue('firstname',custrecord_first_name);
						new_lead.setFieldValue('lastname',custrecord_last_name);
						new_lead.setFieldValue('email',custrecord_email_address);
						// new_lead.setFieldValue('phone',custrecord_phone_number);
						new_lead.setFieldText('leadsource','22 Appointment Request Form');
						/*
						Code to add Appointment line item once client confirms - Client confirmed, this is not needed.
						new_lead.setLineItemValue(<the valus for apoointment>);
						*/
						var new_lead_id = nlapiSubmitRecord(new_lead,false,true);
						customer_id = new_lead_id;
						nlapiSubmitField('customrecord848',customrecord848_id,'custrecord_customer',new_lead_id,true);
						err.status = "OK";
						err.message = "Success";
						jsonResponse = JSON.stringify(err, replacer);
					}
				}			
			}
			
			/*
			Starting Changes for NS-1287
			var loaded848 = nlapiLoadRecord('customrecord848', customrecord848_id);
			nlapiLogExecution('debug', 'Custom Record 848 loaded.' 'Created record is now loaded');
			var customer = loaded848.getFieldValue('custrecord_customer');
			var loadedcustomer = nlapiLoadRecord('customer', customer);
			*/
			
			nlapiSubmitField('customer', customer_id, 'custentity_email_status', '10'); // Added on October 16, 2018 for NS-1391 - Nikhil
			
			var customersearch = nlapiSearchRecord("customer", null, [ ["event.date","onorafter","today"], "AND", ["internalid","is",customer_id]], [new nlobjSearchColumn("entityid").setSort(false), new nlobjSearchColumn("internalid","event",null)]);
			
			if(customersearch && customersearch.length != 0)
			{
				/* Commenting below line and placing above this if per NS-1391 - October 16, 2018 - Nikhil
				nlapiSubmitField('customer', customer_id, 'custentity_email_status', '10');
				*/
				var custrecord_appointment_arr = [];
				var appointment_id;
				nlapiLogExecution('debug', 'customersearch.length != 0', 'Customer has appointments scheduled today/after today.');
				for(var c = 0; c < customersearch.length; c++)
				{
					appointment_id = customersearch[c].getValue('internalid', 'event', null)
					custrecord_appointment_arr.push(appointment_id);
				}
				if(custrecord_appointment_arr && custrecord_appointment_arr.length != 0)
				{
					var loaded848 = nlapiLoadRecord('customrecord848', customrecord848_id);
					loaded848.setFieldValue('custrecord_appointment', custrecord_appointment_arr);
					// nlapiSubmitField('customrecord848', customrecord848_id, 'custrecord_appointment', custrecord_appointment_arr, false); // This code is not working hence the above code.
					nlapiSubmitRecord(loaded848);
				}
				
			}
			/*
			Ending changes for NS-1287
			err.status = "OK";
			err.message = "Success";
			jsonResponse = JSON.stringify(err,replacer);
			return jsonResponse;
			*/
		}

		else
		{
			nlapiLogExecution('Debug', 'datain is empty.');
			err.status = "Failed";
			err.message = "Data not received.";
			jsonResponse = JSON.stringify(err,replacer);
		}
		return jsonResponse;
	}
	catch(ex)
	{
		nlapiLogExecution('Debug', 'Error in Request', ex.message);
		err.status = "Failed";
        err.message = ex.message;
		jsonResponse = JSON.stringify(err, replacer);
		return jsonResponse;
	}
	return jsonResponse;	// This statement will never execute.
}


function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}