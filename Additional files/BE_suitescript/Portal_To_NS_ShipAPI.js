nlapiLogExecution("audit","FLOStart",new Date().getTime());
//var datain = {"po_id":,"date_shipped_from_vendor":"", "tracking_no":"test12321", "comments" :"test"};

/*function UpdateShipAPI(datain)
{
	try
	{
		var responseObj = null;
		var err = new Object();
		var portalArr = new Array();
		    
		nlapiLogExecution('DEBUG',"PO Id is : "+ datain.po_id);
		// Validate if mandatory record type is set in the request
		if (datain.po_id=="")
		{			
                       err.status = "failed";
                       err.message = "missing po_id";
                       return err;
		}
		if (datain.date_shipped_from_vendor=="")
		{			
			err.status = "failed";
                        err.message = "missing date_shipped_from_vendor";
                        return err;
		}
		if (datain.tracking_no=="")
		{			
			err.status = "failed";
                        err.message = "missing tracking_no";
                        return err;
		}
		nlapiSubmitField("purchaseorder",datain.po_id,["custbody209","custbodytracking_number_vc","custbody_portal_comments"],[datain.date_shipped_from_vendor,datain.tracking_no,datain.comments]);
               nlapiLogExecution("debug","Successfully submitted purchase order.");

                err.status = "OK";
                err.message = "Successfully Synced from portal to ns";
                return err;
	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error occur during ship record updation is : ",ex.message);                
		responseObj = {
					"status" : "failed",
					"message": ex.message
			}
                 nlapiLogExecution("debug","Error is : ",ex.toString());
		return responseObj;
	}
}*/


function UpdateShipAPI(datain)
{
	try
	{
		var responseObj = null;
		var err = new Object();
		var portalArr = new Array();
	    if(datain != null)
		{
			for(var k=0; k< datain.length; k++)
			{
				nlapiLogExecution('DEBUG',"PO Id is : "+ datain[k].po_id);
                nlapiLogExecution("debug","date_shipped_from_vendor is :",datain[k].date_shipped_from_vendor);
                nlapiLogExecution("debug","tracking_no is :",datain[k].tracking_no);
                nlapiLogExecution("debug","comments is :",datain[k].comments);
              
				// Validate if mandatory record type is set in the request
				if (datain[k].po_id=="")
				{			
					
							   err.status = "failed";
							   err.message = "missing po_id";
							   return err;
				}
				if (datain[k].date_shipped_from_vendor=="" || datain[k].date_shipped_from_vendor==null)
				{			
					
								err.status = "failed";
								err.message = "missing date_shipped_from_vendor";
								return err;
				}
				/*if (datain[k].tracking_no=="")
				{			
					
								err.status = "failed";
								err.message = "missing tracking_no";
								return err;
				}*/
                var portalStatusArr = nlapiLookupField("purchaseorder",datain[k].po_id,"custbody_portal_status");
				if(portalStatusArr != null && portalStatusArr != "")
				{
					portalArr = portalStatusArr.split(',');
					portalArr.push("17");
				}
				else
				{
					portalArr.push("17");
				}
				nlapiSubmitField("purchaseorder",datain[k].po_id,["custbody209","custbodytracking_number_vc","custbody_portal_comments","custbody_portal_status"],[datain[k].date_shipped_from_vendor,datain[k].tracking_no,datain[k].comments,portalArr]);
					   nlapiLogExecution("debug","Successfully submitted purchase order.");
			}
		}

		err.status = "OK";
		err.message = "Successfully Synced from portal to ns";
		return err;

	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error occur during ship record updation is : ",ex.message);
		responseObj = {
					"status" : "failed",
					"message": ex.message
			}
		return responseObj;
	}
}