function SyncVendorCodeCopyInventoryItem(type)
{
	 try
      {
            if(type=="view")
            {
               var   inventoryitemId = nlapiGetRecordId();
               nlapiSubmitField('customrecord_syncvendorcodecopyinventory',1,'custrecord_itemid',inventoryitemId);
            }
           if(type=="copy"){
               var itemID = nlapiLookupField("customrecord_syncvendorcodecopyinventory",1,"custrecord_itemid");
               nlapiLogExecution("debug","inventory item Id in copy section",itemID);
              var vendorname = nlapiLookupField("inventoryitem",itemID,"vendorname");
              nlapiLogExecution("debug","vendor name",vendorname);
              nlapiSetFieldValue('vendorname',vendorname);
            }
          }
          catch(e)
          {
               nlapiLogExecution("debug","error",e.message);
          }
}