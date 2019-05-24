function gen_salesorder_ZPL_SO_label(request,response)
{
  
  try {
    nlapiLogExecution('DEBUG', 'soid all', request.getParameter("custscriptsoid"));

    var soid = request.getParameter("custscriptsoid");
    var transId = request.getParameter("custscript5");
    var customerName = request.getParameter("custscript_customer_name");
    var item_id = request.getParameter("custscript_item_id");

    if (soid != '' && transId != '' && customerName != '') {
      var new_soid = parseInt(soid);
      /*
      var filters = [];
      var cols = [];
	  filters.push(new nlobjSearchFilter("internalid",null,"is",item_id));
      
	  cols.push(new nlobjSearchColumn("custitem_rfid_description"));
      var results = nlapiSearchRecord("item",null,filters,cols);
      var item_desc = results[0].getValue("custitem_rfid_description");
      */
      var arrItems = ["custitem_rfid_description","itemid"];
      var  objItem = nlapiLookupField("item",item_id, arrItems);
      var  item_rfid_desc = objItem.custitem_rfid_description;
      var  item_sku = objItem.itemid;
      
      //var  item_desc = nlapiLookupField("item",item_id,"custitem_rfid_description");
      //nlapiLogExecution('DEBUG', 'Item RFID', item_desc);
      
      var zpl = '';
      zpl+= '^XA\n';
      zpl+= '^CF0,40\n';
      zpl+= '^FO20,60^FD' + customerName +'^FS\n';
      zpl+= '^FO20,100^FD' + transId + '^FS\n';
      zpl+= '^FO20,140^FD' + item_rfid_desc + '^FS\n';
      zpl+= '^FO20,180^FD' + item_sku + '^FS\n';
      zpl+= '^BY1,1,60'
      zpl+= '^FO80,240^BC^FD' + transId + '^FS\n';
      zpl+= '^XZ';
      zpl+= '\n';

      //Save file for debugging purposes only
      var zplFile = nlapiCreateFile(transId + ".zpl","PLAINTEXT",zpl);
      
      /*
       zplFile.setFolder(13763420);
      var fileId = nlapiSubmitFile(zplFile);
      nlapiSubmitField('salesorder',new_soid, 'custbody_so_label_attach',fileId,false);
      var downloadfile = nlapiLoadFile(fileId);
      */
      
      //Write file back to user so they can open and print
      response.setContentType("PLAINTEXT",transId+".zpl","attachment");
      response.write(zplFile.getValue());
    }
  }
  catch(e){
        nlapiLogExecution('error','suiteScript() has encountered an error.',errText(e));
    }

}
