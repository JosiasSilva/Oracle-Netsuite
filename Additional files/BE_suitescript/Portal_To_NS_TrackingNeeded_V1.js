/**
 * Task 				:- DP-363
 * Restlet Script URL	:- https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2137
 * API URL				:- https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=2137&deploy=1
 * var datain = {"tracking_no":"123456789","cdp_data":[{"cdp_id":57426}]}
 */
function UpdateRecord(datain)
{
    var err = new Object();	
	try
	{
		err.status  	= "OK";
		err.message 	= "CDP records sync successfully.";
		var datain_text = JSON.stringify(datain);
		var tracking_no = datain.tracking_no;
		var cdp 		= datain.cdp_data;
		nlapiLogExecution('DEBUG',"DP-363 Portal json data is : ", datain_text);
		if(tracking_no && cdp && cdp.length > 0 )
		{
			for(var z = 0; z < cdp.length; z++ )
			{
				var cdp_id = cdp[z].cdp_id;
				if(cdp_id)
				{
					try
					{
						nlapiSubmitField('customrecord_custom_diamond',cdp_id,['custrecord_portal_response', 'custrecord238', 'custrecord_tracking_number'], [datain_text, '2137', tracking_no]);
						nlapiLogExecution('debug','successfully updated CDP #' + cdp_id );
					}
					catch(cd)
					{
						nlapiLogExecution('error','Error in updating CDP #' + cdp_id, cd);
					}
				}
			}
		}		
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error occur during getting record from portal is : ",err.message);
		err.status = "Failed";
		err.message= err.message;
	}
	return JSON.stringify(err);
}
var h = 0;