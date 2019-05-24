function User_Close_PO_Save  (type)
{

  if(type=="create")
{
 try
 {
	var itemId = 0;
	var itemfulfillmentID= nlapiGetRecordId();
    var obj = nlapiLoadRecord("itemfulfillment",itemfulfillmentID);
    var count = obj.getLineItemCount("item");
    if(count > 0)
    {
       itemId = obj.getLineItemValue("item","item",1);   
    }
    var V_R_A_id=nlapiLookupField('itemfulfillment',itemfulfillmentID,'createdfrom');
    var createdFromName =  nlapiLookupField('itemfulfillment',itemfulfillmentID,'createdfrom',true);
    if(createdFromName .indexOf("Vendor Return Authorization") != -1)
    {
     var V_R_A_id_recortype =nlapiLookupField('vendorreturnauthorization',V_R_A_id,'recordType');
     if(V_R_A_id_recortype=='vendorreturnauthorization')
      {
       var V_R_A_id_data=nlapiLoadRecord('vendorreturnauthorization',V_R_A_id); 
       var V_R_A_id_data_links_count=V_R_A_id_data.getLineItemCount('links');
       var chk_shipStatus=false;    
       for(k=1;k<=V_R_A_id_data_links_count;k++)
       {
        
         var shipStatus =  V_R_A_id_data.getLineItemValue('links','status',k);
         if(shipStatus=='Shipped')
         {
            chk_shipStatus=true;
             break;
         }
         
       }
      if(chk_shipStatus)
      {
        var P_O_id=nlapiLookupField('vendorreturnauthorization',V_R_A_id,'createdfrom'); 
        var P_O_data=nlapiLoadRecord('purchaseorder',P_O_id); 
        var P_O_Items_count=P_O_data.getLineItemCount('item');
        for(var i=1;i<=P_O_Items_count;i++)
        {
          var poItemId = P_O_data.getLineItemValue("item","item",i);   			
          var isclosed=P_O_data.getLineItemValue('item','isclosed',i);
          var quantityreceived=P_O_data.getLineItemValue('item','quantityreceived',i);
          var quantitybilled=P_O_data.getLineItemValue('item','quantitybilled',i);
          var quantity=P_O_data.getLineItemValue('item','quantity',i);
          //if(quantitybilled==0 && quantityreceived==1 &&  quantity==1 && isclosed=='F')
		  if(quantitybilled==0 && quantityreceived==1 && isclosed=='F')
          {
             if(poItemId == itemId)
             {				 
               P_O_data.setLineItemValue ( 'item', 'isclosed', i, 'T');
             }			   
          }
          else
          {
               P_O_data.setLineItemValue ( 'item', 'isclosed', i, 'F') 
          }
        
        }
        nlapiSubmitRecord (P_O_data); 
        nlapiLogExecution("debug", "status " ,"success");
       
      }

    }

  }
    
 }
 catch(err)
 {	
    nlapiLogExecution("error", "Gemstone Status to set null after VRA", "Error on Item fulfillment: " + err.toString());
    return true;
 }
nlapiLogExecution("debug", "status " ,"success");
return true;

}
}