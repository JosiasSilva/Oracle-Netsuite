function Data_Save(datain) {
  try {


    nlapiLogExecution('DEBUG',"JSON ", JSON.stringify(datain));	
    //var update_data = JSON.parse(datain);	 
    if(datain)	
    {	
      if (datain.tab == 'items') {

        var custom_invoice = nlapiCreateRecord('customrecorddiamond_return_invoice');
        custom_invoice.setFieldValue('custrecord_vendor_invoice', datain.custpage_vendor_id);
        custom_invoice.setFieldValue('custrecord_vendor_return_status_invoice', '1');
        custom_invoice.setFieldValue('custrecord_item_total_return_invoice', datain.items.length);

        var invoice_id = nlapiSubmitRecord(custom_invoice, true, true);
        var ship_to_addr = '';

        var arrProductDetails = getLineItemsOfInvoice(datain.items, invoice_id);

        var vendor_fields = nlapiLookupField('vendor', datain.custpage_vendor_id, ['custentity_special_return_invoice_instru', 'companyname', 'custentity_special_return_address']);

        if (vendor_fields.custentity_special_return_invoice_instru.indexOf('2') > -1) {
          ship_to_addr = vendor_fields.custentity_special_return_address;
        } else {
          var obj_vendor = nlapiLoadRecord('vendor', datain.custpage_vendor_id);
          ship_to_addr = obj_vendor.getFieldValue('defaultaddress');
        }

        createTemplateA(arrProductDetails, invoice_id, ship_to_addr, vendor_fields.companyname, vendor_fields.custentity_special_return_invoice_instru);


      } else if (datain.tab == 'invoices') {

        nlapiSubmitField('customrecorddiamond_return_invoice', datain.invoice_id, 'custrecord_invoice_email_status', datain.email_status);

      }else if (datain.tab == 'items-update') {

        nlapiSubmitField('inventoryitem', datain.custpage_item_id, ['custitem_return_invoice_description','custitem_vendor_return_status'],[datain.custpage_description,datain.custpage_vendor_return_status]);

      }

    }

  } catch (er) {
    nlapiLogExecution('debug', 'error', er.message);
  }
  return 'success';
}

function getLineItemsOfInvoice(items, invoice_id) {
  var arrProductDet = [];
  try {
    var productName = '';
    for (var i = 0; i < items.length; i++) {
      //Get product name
      var special_return_inv_ins = nlapiLookupField('vendor', items[i].custpage_vendor_id, 'custentity_special_return_invoice_instru');
      if (special_return_inv_ins.indexOf('1') > -1) {
        productName = items[i].custpage_certificate_number;
      } else {
        productName = items[i].custpage_vendor_stock_number;
      }

      // Get rate and quantity from PO
      var item_id = items[i].custpage_item_id;

      var obj_po = nlapiLoadRecord('purchaseorder', items[i].custpage_po_id);
      var item_count = obj_po.getLineItemCount('item');
      var quantity, item_det, rate,amount;
      for (var j = 1; j <= item_count; j++) {
        var itemId = obj_po.getLineItemValue('item', 'item', j);
        if (itemId == item_id) {
          //quantity = obj_po.getLineItemValue('item', 'quantity', j);
          item_det = nlapiLookupField('inventoryitem', itemId, ['custitem_return_price','custitem27']); //obj_po.getLineItemValue('item','rate',j);
          quantity=item_det.custitem27;
          if(quantity)
          {
            quantity=parseFloat(quantity);
          }
          rate=item_det.custitem_return_price;
          amount = parseFloat(quantity) * parseFloat(rate);
          //Update PO field on line item 
          obj_po.setLineItemValue('item', 'custcol_return_invoice', j, invoice_id);
          nlapiSubmitRecord(obj_po,true,true);
          break;
        }
      }
      //Update Item field
      nlapiSubmitField('inventoryitem',item_id,['custitem_vendor_return_status','custitem_return_invoice_description'],['1',items[i].custpage_description]);
      //Fill item details in array
      arrProductDet.push({
        product: productName,
        desc: items[i].custpage_description,
        unit_price: rate,
        quantity: quantity,
        price: amount,
		item_id:item_id

      });

    }
  } catch (ex) {
    nlapiLogExecution('debug', 'Error in getting details', ex.message);
  }

  return arrProductDet;
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function createTemplateA(arrProducts, invoice_id, ship_to_addr, vendor_name, vendor_special_instructions) {
  try {
    var date = getTodayDate();
    var fileName = 'return_' + vendor_name + '_' + date[1] + '_' + invoice_id + '.pdf';

    //Address
    var compAddress = "26 O'Farrell St, 10th Floor\n San Francisco, CA 94108\n Phone: 415-354-4628\n Fax: 505-212-4881";
    compAddress = compAddress.replaceAll('\n', '<br/>');

    //Ship To Address
    if (ship_to_addr) {
      ship_to_addr = ship_to_addr.replaceAll('&', '&amp;');
      ship_to_addr = ship_to_addr.replaceAll('\n', '<br/>');
    }


    var trandate = date[0]; //OrderRecord.getFieldValue('trandate');

    var xml = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
    xml += '<pdf><head>';

    xml += '<macrolist>';
    xml += '<macro id="nlfooter" >';
    var footer_height = '5%';
    if (vendor_special_instructions.indexOf(4) > -1) {
      xml += '<p style="color:#77797a;position: absolute; right: 0;  bottom: 0;  left: 0;  padding: 1rem; text-align: center;font-size:9pt;font-family: Century Gothic, sans-serif;"><table width="100%"><tr><td align="left" style="color:#77797a;text-align: center;font-size:9pt;font-family: Century Gothic, sans-serif;">(1) We declare that this Invoice shows the actual price of the goods described and that all particulars are true and correct. </td></tr>';
      xml += '<tr><td align="left" style="color:#77797a;text-align: center;font-size:9pt;font-family: Century Gothic, sans-serif;">(2) The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and in compliance with the United Nations Resolutions. The seller hereby guarantees that these diamonds are conflict free, based on personal knowledge and/or written guarantees provided by the supplier of these diamonds.</td></tr>';
      xml += '<tr><td align="left" style="color:#77797a;text-align: center;font-size:9pt;font-family: Century Gothic, sans-serif;">(3) The diamonds herein invoiced are exclusively of natural origin and untreated based on personal knowledge and/or written guarantees provided by the supplier of these diamonds.</td></tr>';
      xml += '<tr height="2%"><td></td></tr>';
      xml += '<tr><td align="center" style="color:#77797a;text-align: center;font-size:11pt;font-family: Century Gothic, sans-serif;">Please contact Brilliant Earth at 415-423-1295 with any questions or concerns.</td></tr></table></p>';
      footer_height = '15%';
    } else {
      xml += '<p width="100%" align="center" style="color:#77797a;position: absolute; right: 0;  bottom: 0;  left: 0;  padding: 1rem; text-align: center;font-size:11pt;font-family: Century Gothic, sans-serif;">Please contact Brilliant Earth at 415-423-1295 with any questions or concerns.</p>';
      footer_height = '5%';
    }

    xml += '</macro>';
    xml += '</macrolist>';
    xml += '<style type="text/css">';
    xml += "th {";
    xml += "font-family: Century Gothic, sans-serif;";
    xml += "word-spacing: 0px!important;";
    xml += "font-size: 10.5pt;";
    xml += "vertical-align: top;";
    xml += "padding-right: 6px;";
    xml += "padding-left: 6px;";
    xml += "padding-bottom: 4px;";
    xml += "padding-top: 4px;";
    xml += "background-color: #d6d7d8;";
    xml += "color: #77797a;";
    xml += "font-weight:bold;";
    xml += "}";
    xml += "td.maintd {";
    xml += "padding-right: 6px;";
    xml += "padding-left: 6px;";
    xml += "padding-bottom: 4px;";
    xml += "padding-top: 4px;";
    xml += "font-family: Century Gothic, sans-serif;";
    xml += "}";
    xml += ".main {";
    xml += "}";
    xml += '</style>';
    xml += '</head>';

    xml += '<body footer="nlfooter" footer-height="' + footer_height + '">';
    xml += '<table>';
    xml += '<tr>';
    xml += '<td align="left" width="230"><img src="/core/media/media.nl?id=7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603" width="229" height="47"/></td>';
    xml += '<td width="100"></td>';
    xml += '<td align="right" width="200" style="color:#77797a; font-size:14pt;font-family: Century Gothic, sans-serif;">Invoice # ' + invoice_id + '</td>';
    xml += '</tr>';
    xml += '<tr height="3%">';
    xml += '<td colspan="12"></td>';
    xml += '</tr>';
    xml += '</table>';
    xml += '<table>';
    xml += '<tr>';
    xml += '<td width="100" align="left" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;">Date:</td>';
    xml += '<td width="200" align="left" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;">Address:</td>';
    xml += '<td align="left" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;" width="300" >Ship To:</td>';
    xml += '</tr>';
    xml += '<tr>';
    xml += '<td width="100" align="left" style="color:#77797a; font-size:10.5pt; font-family: Century Gothic, sans-serif;">' + trandate + '</td>';
    xml += '<td width="200" align="left" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;">' + compAddress + '</td>';
    xml += '<td align="left" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;" width="300" >' + ship_to_addr + '</td>';
    xml += '</tr>';
    xml += '<tr height="3%"><td colspan="12"></td></tr>';
    xml += '</table>';
    
    if(vendor_name=='JB')
	{
      var search=nlapiSearchRecord('vendorbill',null,[new nlobjSearchFilter('entity',null,'anyof',3132473),new nlobjSearchFilter('item',null,'anyof',arrProductDet[0].item_id)],[new nlobjSearchColumn('trandate').setSort(true),new nlobjSearchColumn('tranid')]);
		//var search=nlapiSearchRecord('vendorbill',null,nlobjSearchFilter('entity',null,'anyof',3132473),[new nlobjSearchColumn('trandate').setSort(true),new nlobjSearchColumn('tranid')]);
		if(search)
		{
			xml += '<table class="main" cellspacing="0"  width="100%">';
			xml += '<tr ><td colspan="12" style="color:#77797a; font-size:12pt; font-family: Century Gothic, sans-serif;font-weight:bold">CONSIGNMENT # '+search[0].getValue('tranid')+'</td></tr>';
			xml += '</table>';
		}
	}

    var strName = '<table class="main" cellspacing="0"  width="100%">';
    strName += '<thead><tr>';
    strName += '<th align="center" style="border:1px solid #959799;">Product</th>';
    strName += '<th align="center" style="border-top:1px solid #959799;border-bottom:1px solid #959799;border-right:1px solid #959799;">Description</th>';
    strName += '<th align="center" style="border-top:1px solid #959799;border-bottom:1px solid #959799;border-right:1px solid #959799;" >Unit <br/> Price</th>';
    strName += '<th align="center" style="border-top:1px solid #959799;border-bottom:1px solid #959799;border-right:1px solid #959799;" >Order <br/> Quantity</th>';
    strName += '<th align="center" style="border-top:1px solid #959799;border-bottom:1px solid #959799;border-right:1px solid #959799;">Price</th></tr>';
    strName += '</thead>';


    var sum = 0;
    var tot_qty=0;

    for (var i = 0; i < arrProducts.length; i++) {
      var item = arrProducts[i].product; //'A'; //OrderRecord.getLineItemValue('item','item_display',i);
      var desc = arrProducts[i].desc; //'This is test description' ;//OrderRecord.getLineItemValue('item','description',i);
      var rate = arrProducts[i].unit_price; //250.25;//OrderRecord.getLineItemValue('item','rate',i);
      var quantity = arrProducts[i].quantity; //'2' //OrderRecord.getLineItemValue('item','quantity',i);
      var amount = arrProducts[i].price; //500 ;//OrderRecord.getLineItemValue('item','amount',i);

      strName += '<tr>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif;border-left:1px solid #959799;border-bottom:1px solid #959799;border-right:1px solid #959799;">' + item + '</td>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif; border-bottom:1px solid #959799;border-right:1px solid #959799;">' + desc + '</td>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif; border-bottom:1px solid #959799;border-right:1px solid #959799;">' + rate + '</td>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif; border-bottom:1px solid #959799;border-right:1px solid #959799;">' + quantity + '</td>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:10.5pt;font-family: Century Gothic, sans-serif; border-bottom:1px solid #959799;border-right:1px solid #959799;">' + amount.toFixed(2) + '</td>';
      strName += '</tr>';

      sum += amount;
      tot_qty= parseFloat(tot_qty)+ parseFloat(quantity);
    }

    strName += '<tr>';
    strName += '<td></td>';
    strName += '<td></td>';
    strName += '<td align="center" style="font-size:11pt; color:#77797a; font-weight:bold; border-right:1px solid #959799; font-family: Century Gothic, sans-serif;">TOTAL: </td>';
    strName += '<td align="center" style="font-size:11pt; color:#77797a; font-weight:bold; border-bottom:1px solid #959799;border-right:1px solid #959799; font-family: Century Gothic, sans-serif;">' + tot_qty.toFixed(2) + '</td>';
    strName += '<td align="center" style="font-size:11pt; color:#77797a; font-weight:bold; border-bottom:1px solid #959799;border-right:1px solid #959799; font-family: Century Gothic, sans-serif;">' + sum.toFixed(2) + '</td>';
    strName += '</tr>';
    strName += '</table>';
    strName += '</body></pdf>';

    xml += strName;
    // var fileA = nlapiXMLToPDF(xml.replace(/&/g, " "));
    var fileA = nlapiXMLToPDF(xml);
    nlapiLogExecution('DEBUG', 'file :', fileA);
    // response.setContentType('PDF', 'Template_A.pdf ', 'inline');
    //response.write(fileA.getValue());

    // var folderId = '10831511'; //Folder ID -Sandbox
    var folderId = '11064888'; //Folder ID -Production
    if (fileA != null && fileA != '') {
      fileA.setFolder(folderId);
      fileA.setName(fileName);
    }
    var fileId = nlapiSubmitFile(fileA);
    nlapiSubmitField('customrecorddiamond_return_invoice', invoice_id, 'custrecord_invoice_diamond_return', fileId);
    //end of Template A
  } catch (ex) {
    nlapiLogExecution('debug', 'Error in pdf', ex.message);
  }
}

function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var format1 = mm + '/' + dd + '/' + yyyy;
  var format2 = mm + '_' + dd + '_' + yyyy;
  return [format1, format2];
}