/** 
 * Script Author : 	Nikhil Bhutani (nikhil.bhutani@inoday.com)
 * Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : 	UserEvent
 * Created Date  : 	july 9, 2018
 * Last Modified Date : july 9, 2018
 * Comments :Auto-update shipping address
 * Sandbox scriptURL: https://system.netsuite.com/app/common/scripting/script.nl?id=2322&whence=
 * Production scriptURL: https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2323&whence=
 */

function acr_after_submit(type)
{
	try
	{
		var flag = 0;
		var customform = nlapiGetFieldText('customform');
		var add_change_status = nlapiGetFieldText('custrecord_status_of_reroute_acr');
		var so_id = nlapiGetFieldValue('custrecord_transaction_acr');

		var so_load_record = nlapiLoadRecord('salesorder',so_id);
		var shippingaddress_editrecord = so_load_record.editSubrecord('shippingaddress');
		
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
			
			if(custrecord_country_acr.length != 0)
			{
				// shippingaddress_editrecord.setFieldValue('country', custrecord_country_acr);
              			shippingaddress_editrecord.setFieldText('country', custrecord_country_acr);
				flag = 1;
			}
			if(custrecord_attnetion_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('attention', custrecord_attnetion_acr);
				flag = 1;
			}
			if(custrecord_addressee_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('addressee', custrecord_addressee_acr);
				flag = 1;
			}
			if(custrecord_phone_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('phone',custrecord_phone_acr);
				flag = 1;
			}
			if(custrecord_address_1_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('addr1',custrecord_address_1_acr);
				flag = 1;
			}
			if(custrecord_address_2_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('addr2',custrecord_address_2_acr);
				flag = 1;
			}
			if(custrecord_city_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('city',custrecord_city_acr);
				flag = 1;
			}
			if(custrecord_state_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('state',custrecord_state_acr);
				flag = 1;
			}
			if(custrecord_zip_acr.length != 0)
			{
				shippingaddress_editrecord.setFieldValue('zip',custrecord_zip_acr);
				flag = 1;
			}
		}
		if(flag == 1)
		{
			shippingaddress_editrecord.commit();
			nlapiSubmitRecord(so_load_record);
		}
		else if(flag == 0)
		{
			shippingaddress_editrecord.cancel();
		}				
	}
	catch(ex)
	{
		nlapiLogExecution('Error', 'Error Occured', ex.message);
	}
}