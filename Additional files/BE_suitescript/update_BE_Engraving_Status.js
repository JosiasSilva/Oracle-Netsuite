nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateEngravingStatus(type,form)
{
	try
	{
		var so_id = nlapiGetRecordId();
	    var so_obj = nlapiLoadRecord('salesorder',so_id);
		var be_engraving_status = so_obj.getFieldValue('custbody348');
		var line_count = so_obj.getLineItemCount('links');
		for(var i = 1; i<=line_count; i++)
		{
			var rec_type = so_obj.getLineItemValue('links','type',i);
			if(rec_type== "Purchase Order")
			{
				var link_po = so_obj.getLineItemValue('links','id',i);
				if(link_po)
				{
					nlapiSubmitField('purchaseorder',link_po,'custbody348',be_engraving_status,false)
				    nlapiLogExecution('debug','record submitted successfully');
			    }
		    }
	    }
	}
	catch(ee)
	{
		nlapiLogExecution('debug','error',ee.message);
	}
}