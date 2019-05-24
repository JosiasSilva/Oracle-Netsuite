function Data_Save(datain) {
  try {
    nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(datain));
    //var update_data = JSON.parse(datain);	 
    if (datain) {
      var po = nlapiCreateRecord('purchaseorder');
      var items = datain.items;
      po.setFieldValue('entity', items[0].custpage_vendor);
      var vendor_po_notes = '';
      var date_needed_sf = '';
      var earliest_date;
      var itemDet='';
      var price='';
      for (var i = 0; i < items.length; i++) {
        var qty = 0;
        var qty_email_display = 0;
        if (items[i].custpage_amount_to_order == '' || items[i].custpage_amount_to_order == null) {
          
          qty = items[i].custpage_carats_to_order;
          qty_email_display=items[i].custpage_carats_to_order+' carats';
          price= '$'+items[i].custpage_last_purchase_price+ '  per carat';
        } else {
          qty = items[i].custpage_amount_to_order;
          qty_email_display=items[i].custpage_amount_to_order +' pcs';
          price='$'+items[i].custpage_last_purchase_price+ '  per piece';

        }

        //Vendor Notes
        if (items[i].custpage_vendor_purchasing_notes) {
          if (!vendor_po_notes) {
            vendor_po_notes = items[i].custpage_item_name_number +' - '+ items[i].custpage_vendor_purchasing_notes;
          } else {
            vendor_po_notes = vendor_po_notes + '\n' +items[i].custpage_item_name_number +' - '+ items[i].custpage_vendor_purchasing_notes;
          }
        }

        // Date Needed in SF
        if (items[i].custpage_date_needed_in_sf) {
          date_needed_sf = new Date(items[i].custpage_date_needed_in_sf);

          if (earliest_date) {
            if (earliest_date > date_needed_sf) {
              earliest_date = date_needed_sf;
            }
          } else {
            earliest_date = date_needed_sf;
          }

        }

        po.selectNewLineItem('item');
        //var itemIdNo = 1093360; // Resize Ring
        po.setCurrentLineItemValue('item', 'item', items[i].custpage_item_id);
        po.setCurrentLineItemValue('item', 'quantity', qty);
        po.setCurrentLineItemValue('item', 'rate', items[i].custpage_last_purchase_price);
        po.commitLineItem('item');
        
        
        if(i==0)
          {
        itemDet="<tr>\
          <td>"+items[i].custpage_item_desc+" - "+qty_email_display+" - "+price+" </td>\
           </tr>";
          }
        else
          {
            itemDet= itemDet + "<tr>\
          <td>"+items[i].custpage_item_desc+" - "+qty_email_display+" - "+price+" </td>\
           </tr>";
          }
       }
      po.setFieldValue('custbodyvendor_email_notes', vendor_po_notes);
      po.setFieldValue('custbody_created_frm_gem_melee_dash', 'T');
      po.setFieldValue('custbody59', earliest_date);

      po_internal_id = nlapiSubmitRecord(po, false, true);
 	  var tranid=nlapiLookupField('purchaseorder',po_internal_id, 'tranid');
      var userID = nlapiGetUser();
      var attachTo = [];
      attachTo['transaction'] = po_internal_id;
      var type = 'transaction';
      var id = po_internal_id;
      var mode = 'HTML';
      var properties = null;
      var htmlbody = nlapiPrintRecord(type, id, mode, properties); //returns nlobjFile
      //var htmlbody = htmlbody.getValue();
      nlapiLogExecution('debug', 'process', htmlbody);
      nlapiLogExecution('debug', 'vendor', datain.custpage_vendor);

      var userid=nlapiGetUser();
      var role_id=nlapiGetRole();
      var config=nlapiLoadConfiguration('userpreferences');
      var sign= config.getFieldValue('message_signature');
      nlapiLogExecution('debug', 'role id', role_id);
     // var roles = nlapiSearchRecord('Role', 8156, new nlobjSearchFilter('internalid',null,'anyof',role_id), new nlobjSearchColumn('name') );
     // var role_name='';
     // if(roles)
    //  {
       // role_name=roles[0].getValue('name');
      //}
     // var empFields=nlapiLookupField('employee',userid,['phone','entityid']);

      var body="<table width='100%' cellspacing='0' cellpadding='0' style='font-family: Franklin Gothic Medium, Arial Narrow, Arial, sans-serif;font-size: 14px;padding-left:2px'>\
          <tr>\
          <td>Hello, </td>\
          </tr>\
          <tr>\
          <td height='20px'>&nbsp; </td>\
          </tr>\
          <tr>\
		 <td>Please send us the following items:  </td>\
         </tr>\
		 <tr>\
          <td>&nbsp; </td>\
          </tr>";
          body=body+itemDet;
          body=body+"<tr>\
          <td>&nbsp;</td>\
          </tr>\
          <tr>\
          <td>&nbsp;</td>\
          </tr>\
          <tr>\
          <td>Thank you! </td>\
          </tr>\
          <tr>\
          <td>&nbsp;</td>\
          </tr>\
          <tr>\
          <td>"+sign+"</td>\
          </tr>\
            </table>";

    /*  var signature="<tr>\
          <td>sign</td>\
          </tr>";
                if(role_name)
                {
                  body=body+  "<tr>\
          <td>"+role_name+"</td>\
          </tr>";
                }
                body=body+"<tr>\
          <td>Brilliant Earth</td>\
          </tr>\
          <tr>\
          <td><a href='http://www.brilliantearth.com' target='_blank'>www.brilliantearth.com</a></td>\
          </tr>\
          <tr>\
          <td>"+empFields.phone+"</td>\
          </tr>\"; */
      
      nlapiSendEmail(userID, datain.custpage_vendor, "Brilliant Earth: Purchase Order #" + tranid, body, null, null, attachTo, '');
      nlapiLogExecution("Debug", "Information", "Message has been attached on purchase order successfully");

    }

  } catch (er) {
    nlapiLogExecution('debug', 'Error', er.message);
  }
  return 'success';
}