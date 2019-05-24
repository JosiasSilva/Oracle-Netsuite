function get_DiamondETA_Frm_PO_Or_SO(cdpId)
{
	var chkDiamondETAVal = false;
	var cdpObj = nlapiLookupField("customrecord_custom_diamond",cdpId,['custrecord_diamond_eta','custrecord_diamond_status']);
	var diamondETA = cdpObj.custrecord_diamond_eta;
	nlapiLogExecution("debug","Diamond Eta:",diamondETA +" having cdp id " + cdpId);
    var diamondStatus = cdpObj.custrecord_diamond_status;
    nlapiLogExecution("debug","Diamond Status :",diamondStatus +" having cdp id " + cdpId);
    if(diamondETA == '' || diamondETA == null)
    {
    	// diamond eta will be set if diamond status is either 1 (confirmed) or 9 (On Hold - Customer Payment Pending)
    	if(diamondStatus == 1 || diamondStatus == 9)
    	{
              chkDiamondETAVal = true;
    	}
    }
    return chkDiamondETAVal;
}

























































