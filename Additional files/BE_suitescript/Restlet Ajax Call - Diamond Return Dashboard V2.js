function UpdateRecords(datain) {
  try {
    nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(datain));
    //var update_data = JSON.parse(datain);	 
    //  nlapiLogExecution('debug', 'items ',datain.items[0].custpage_internalid );
    if (datain) {
      var operation = datain.operation;
      if (operation == 'Update') {

        var sublist_id = datain.sublist_id;
        if (sublist_id == 'custpage_owned_diamond' ) {
          var item_internal_id=datain.item_internal_id;
          var custpage_reason_for_diamd_ret = datain.custpage_reason_for_diamd_ret;
          var custpage_exptd_ret_date = datain.custpage_exptd_ret_date;
          var custpage_notes = datain.custpage_notes;
          var custpage_gemstone_status = datain.custpage_gemstone_status;


          nlapiSubmitField('inventoryitem', item_internal_id, ['custitemreason_for_diamond_return', 'custitem192', 'custitem39','custitem40'], [custpage_reason_for_diamd_ret, custpage_exptd_ret_date, custpage_notes,custpage_gemstone_status]);
          nlapiLogExecution('debug', 'Item update -', 'Successfully updated on ' + sublist_id+' for item #'+item_internal_id);

        } 
        else if (sublist_id == 'custpage_to_be_returned' ) {
          var item_internal_id=datain.item_internal_id;
          var custpage_reason_for_diamd_ret = datain.custpage_reason_for_diamd_ret;
          var custpage_exptd_ret_date = datain.custpage_exptd_ret_date;
          var custpage_gemstone_status = datain.custpage_gemstone_status;
          var custpage_vendor_ret_status=datain.custpage_vendor_ret_status;


          nlapiSubmitField('inventoryitem', item_internal_id, ['custitemreason_for_diamond_return', 'custitem192', 'custitem40','custitem_vendor_return_status'], [custpage_reason_for_diamd_ret, custpage_exptd_ret_date, custpage_gemstone_status,custpage_vendor_ret_status]);
          nlapiLogExecution('debug', 'Item update -', 'Successfully updated on ' + sublist_id+' for item #'+item_internal_id);
        }
        else  if (sublist_id == 'custpage_create_return' ) {
          var item_internal_id=datain.item_internal_id;
          var custpage_exptd_ret_date = datain.custpage_exptd_ret_date;
          var custpage_notes = datain.custpage_notes;
          var custpage_gemstone_status = datain.custpage_gemstone_status;

          nlapiSubmitField('inventoryitem', item_internal_id, ['custitem192', 'custitem39','custitem40'], [custpage_exptd_ret_date, custpage_notes,custpage_gemstone_status]);
          nlapiLogExecution('debug', 'Item update -', 'Successfully updated on ' + sublist_id+' for item #'+item_internal_id);
        }
        else  if (sublist_id == 'custpage_return_tracking_conf' ) {
          var internal_id=datain.item_internal_id;
          var custpage_tracking_no = datain.custpage_tracking_no;
          var custpage_aes_eei = datain.custpage_aes_eei;

          nlapiSubmitField('itemfulfillment', internal_id, ['custbody69', 'custbody_aes_eei'], [custpage_tracking_no, custpage_aes_eei]);
          nlapiLogExecution('debug', 'Item update -', 'Successfully updated on ' + sublist_id+' for IF #'+internal_id);

          var fulfillmentDetails=nlapiLookupField('itemfulfillment',internal_id,['createdfrom','entity']);
          createPackingSlips(fulfillmentDetails.entity,[internal_id],fulfillmentDetails.createdfrom);

        }
      } else if(operation=='Create Internal Request Form') {
        nlapiLogExecution('debug', 'First', 'operation');
        var objCreateInternalReq=nlapiCreateRecord('customrecord_irf_parent');
        objCreateInternalReq.setFieldValue('name','GR Returns');
        var date=new Date();

        objCreateInternalReq.setFieldValue('custrecord_irf_type_of_request','6');
        objCreateInternalReq.setFieldValue('custrecord_irf_date_needed',date);
        objCreateInternalReq.setFieldValue('custrecord_irf_expected_return_date',date);

        var items=datain.items;
        for(var iCount=0;iCount<items.length;iCount++)
        {
          var item_id=items[iCount].custpage_internalid;
          var qty=0;
          //Get Sum of Quantities on SF and Showroom SF
          var filters=[];
          filters.push(new nlobjSearchFilter("internalid",null,"is",item_id));
          filters.push(new nlobjSearchFilter("inventorylocation",null,"anyof",["2","7"]));

          var cols=[];
          cols.push(new nlobjSearchColumn("locationquantityavailable",null,'sum'));

          var results = nlapiSearchRecord("item",null,filters,cols);
          if(results)
          {
            var columns=results[0].getAllColumns();
            qty=results[0].getValue(columns[0]);
          }

          objCreateInternalReq.selectNewLineItem('recmachcustrecord_irf_items');
          objCreateInternalReq.setCurrentLineItemValue('recmachcustrecord_irf_items','custrecord_irf_item',item_id);
          objCreateInternalReq.setCurrentLineItemValue('recmachcustrecord_irf_items','custrecord_irf_qty_sf',qty);

          objCreateInternalReq.commitLineItem('recmachcustrecord_irf_items');

        }
        var InterReqFormId= nlapiSubmitRecord(objCreateInternalReq);
        nlapiLogExecution('debug', 'Internal Request Form -', 'Successfully created on ' + sublist_id+' with id #'+InterReqFormId);

      }
      else if(operation=='Create Return')
      {
        // nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(datain));
        var itemsCount=datain.items.length;
        var VRAItems=datain.items;
        VRAItems=VRAItems.sort( function (a,b) {
          if (parseFloat(a.carats) < parseFloat(b.carats))
            return -1;
          if (parseFloat(a.carats) > parseFloat(b.carats))
            return 1;
        });


        nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(VRAItems));
        var objVRA=nlapiCreateRecord('vendorreturnauthorization');
        objVRA.setFieldValue('entity',datain.vendor_id);
        objVRA.setFieldValue('orderstatus','B');
        for(var iCount=0;iCount<itemsCount;iCount++)
        {
          objVRA.selectNewLineItem('item');
          objVRA.setCurrentLineItemValue('item','item',VRAItems[iCount].item_id);
		  objVRA.setCurrentLineItemValue('item','location',datain.location_id);
          var po_id= getMostRecentPoOfItem(VRAItems[iCount].item_id);
          if(po_id)
          {
            objVRA.setCurrentLineItemValue('item','custcol_vra_po',po_id);
          }
          objVRA.commitLineItem('item');

        }
        var VRA_Id=nlapiSubmitRecord(objVRA);
        var shipcountry=nlapiLookupField('vendor',datain.vendor_id,'shipcountry');

        var ship_via='5668896';//'2'; //Fedex priority overnight 
        if(shipcountry!='US')
          ship_via='2531266'; // Fedex international priority


        var fulfillments= createFulfillments(VRA_Id,ship_via);
        createLabel(datain.vendor_id,fulfillments);
        createPackingSlips(datain.vendor_id,fulfillments,VRA_Id);
        setInventoryFieldtoNull(VRAItems);
        var arrMsg=[];
        arrMsg.push({
          'Status':'Sucess',
          'VRA Id' :VRA_Id,
          'Item Fulfillment Ids' : fulfillments
        });
        nlapiLogExecution('debug', 'Create Return', JSON.stringify(arrMsg));
      }
      else if(operation=='Create Label')
      {
        var internal_id=datain.internal_id;
        var fulfillmentDetails=nlapiLookupField('itemfulfillment',internal_id,['createdfrom','entity','custbody_fedex_shipping_label']);
        if(fulfillmentDetails.custbody_fedex_shipping_label=='' || fulfillmentDetails.custbody_fedex_shipping_label==null)
        {
          createLabel(fulfillmentDetails.entity,[internal_id]);
          nlapiLogExecution('debug', 'Label created-', 'Fulfillment Id '+ internal_id);
          createPackingSlips(fulfillmentDetails.entity,[internal_id],fulfillmentDetails.createdfrom);
          nlapiLogExecution('debug', 'Packing slips created-', 'Fulfillment Id '+ internal_id);
        }

      }
      else if(operation=='Print Packing Slip')
      {
        var fulfillments=datain.fulfillments;
        var arrFileId=[];
        for(var i=0;i<fulfillments.length;i++)
        {
          var packingSlips=nlapiLookupField('itemfulfillment',fulfillments[i].internal_id,['custbody_internal_vra_packing_slip','custbody_vendor_packing_slip_vra']);
          if(packingSlips.custbody_internal_vra_packing_slip)
            arrFileId.push(packingSlips.custbody_internal_vra_packing_slip);

          if(packingSlips.custbody_vendor_packing_slip_vra)
            arrFileId.push(packingSlips.custbody_vendor_packing_slip_vra);
        }
        var pdf_url= mergePDFs(arrFileId);
        nlapiLogExecution('debug', 'Merged Packing Slip - PDF URL', pdf_url);
        return pdf_url;
      }
      else if(operation=='Print Label')
      {
        var fulfillments=datain.fulfillments;
        var arrFileId=[];
        for(var i=0;i<fulfillments.length;i++)
        {
          var fedex_shipping_lbl=nlapiLookupField('itemfulfillment',fulfillments[i].internal_id,'custbody_fedex_shipping_label');
          if(fedex_shipping_lbl)
            arrFileId.push(fedex_shipping_lbl);
        }
        var pdf_url= mergePDFs(arrFileId);
        nlapiLogExecution('debug', 'Merged Label - PDF URL', pdf_url);
        return pdf_url;
      }
    }

  } catch (er) {
    nlapiLogExecution('debug', 'error', er.message);
  }
  return 'success';
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
function createFulfillments(VRA_Id,ship_via)
{
   var arrIFIds=[];
  var objIF = nlapiTransformRecord('vendorreturnauthorization', VRA_Id, 'itemfulfillment');
  objIF.setFieldValue('shipmethod',ship_via);
  var itemCount = objIF.getLineItemCount('item');
  var arrItems = [];
  /*for (var i = 1; i <= itemCount; i++) {
         objIF.setLineItemValue('item', 'itemreceive', i, 'F');
    }*/
    var IFId = nlapiSubmitRecord(objIF);
    arrIFIds.push(IFId);

  return arrIFIds;

}
/*
function createFulfillments(VRA_Id,ship_via)
{
  var objIF = nlapiTransformRecord('vendorreturnauthorization', VRA_Id, 'itemfulfillment');
  objIF.setFieldValue('shipmethod',ship_via);
  var itemCount = objIF.getLineItemCount('item');
  var arrItems = [];
  for (var i = 1; i <= itemCount; i++) {
    var item_id = objIF.getLineItemValue('item', 'itemkey', i);
    var record=nlapiSearchRecord('item',null,[new nlobjSearchFilter('locationquantityonhand',null,'greaterthan',0),new 
                                              nlobjSearchFilter('internalid',null,'anyof',item_id)],new nlobjSearchColumn('inventorylocation'));
    var loc=0;
    if(record)
    {
      loc = record[0].getValue('inventorylocation');
    }
    else
    {
      loc=objIF.getLineItemValue('item', 'location', i);
    }

    arrItems.push({
      loc: loc,
      item_id: item_id
    });
  }
  var arrLocItems = [];
  var len = arrItems.length;
  while (len > 0) {
    var temp = arrItems.filter(function(obj) {
      return (obj.loc == arrItems[0].loc);
    });
    arrLocItems.push({
      loc: arrItems[0].loc,
      items: temp
    });


    arrItems = removeByAttr(arrItems, 'loc', arrItems[0].loc);
    len = arrItems.length;
  }
  var flag = false;

  var lenLocArr = arrLocItems.length;
  var arrIFIds=[];
  while (lenLocArr > 0) {
    var arrReqItems = arrLocItems[0].items;

    if (flag == true) {
      objIF = nlapiTransformRecord('vendorreturnauthorization', VRA_Id, 'itemfulfillment');
      objIF.setFieldValue('shipmethod',ship_via);
      itemCount = objIF.getLineItemCount('item');
    }
    for (var i = 1; i <= itemCount; i++) {
      // var loc = objIF.getLineItemValue('item', 'location', i);
      var item_id = objIF.getLineItemValue('item', 'itemkey', i);
      var record=nlapiSearchRecord('item',null,[new nlobjSearchFilter('locationquantityonhand',null,'greaterthan',0),new 
                                                nlobjSearchFilter('internalid',null,'anyof',item_id)],new nlobjSearchColumn('inventorylocation'));
      var loc=0;
      if(record)
      {
        loc = record[0].getValue('inventorylocation');
        objIF.setLineItemValue('item','location',i,loc);
      }
      else
      {
        loc=objIF.getLineItemValue('item', 'location', i);
      }

      var result = arrReqItems.filter(function(obj) {
        return (obj.loc == loc);
      });

      if (result.length <= 0) {
        objIF.setLineItemValue('item', 'itemreceive', i, 'F');
      }

    }
    var IFId = nlapiSubmitRecord(objIF);
    arrIFIds.push(IFId);
    flag = true;
    arrLocItems = removeByAttr(arrLocItems, 'loc', arrLocItems[0].loc);
    lenLocArr = arrLocItems.length;
  }
  return arrIFIds;

}*/
/*
function createFulfillments(VRA_Id,ship_via)
{
  var objIF = nlapiTransformRecord('vendorreturnauthorization', VRA_Id, 'itemfulfillment');
  objIF.setFieldValue('shipmethod',ship_via);
  var itemCount = objIF.getLineItemCount('item');
  var arrItems = [];
  for (var i = 1; i <= itemCount; i++) {
    var item_id = objIF.getLineItemValue('item', 'itemkey', i);
    var loc = objIF.getLineItemValue('item', 'location', i);
    arrItems.push({
      loc: loc,
      item_id: item_id
    });
  }
  var arrLocItems = [];
  var len = arrItems.length;
  while (len > 0) {
    var temp = arrItems.filter(function(obj) {
      return (obj.loc == arrItems[0].loc);
    });
    arrLocItems.push({
      loc: arrItems[0].loc,
      items: temp
    });


    arrItems = removeByAttr(arrItems, 'loc', arrItems[0].loc);
    len = arrItems.length;
  }
  var flag = false;

  var lenLocArr = arrLocItems.length;
  var arrIFIds=[];
  while (lenLocArr > 0) {
    var arrReqItems = arrLocItems[0].items;

    if (flag == true) {
      objIF = nlapiTransformRecord('vendorreturnauthorization', VRA_Id, 'itemfulfillment');
      objIF.setFieldValue('shipmethod',ship_via);
      itemCount = objIF.getLineItemCount('item');
    }
    for (var i = 1; i <= itemCount; i++) {
      var loc = objIF.getLineItemValue('item', 'location', i);
      var qty= objIF.getLineItemValue('item', 'quantity', i);
      var result = arrReqItems.filter(function(obj) {
        return (obj.loc == loc);
      });

      if (result.length <= 0) {
        objIF.setLineItemValue('item', 'itemreceive', i, 'F');
      }
      if(qty==0)
      {
        objIF.setLineItemValue('item', 'itemreceive', i, 'F');
      }


    }
    var IFId = nlapiSubmitRecord(objIF);
    arrIFIds.push(IFId);
    flag = true;
    arrLocItems = removeByAttr(arrLocItems, 'loc', arrLocItems[0].loc);
    lenLocArr = arrLocItems.length;
  }
  return arrIFIds;

}*/

function removeByAttr(arr, attr1, value1) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr1) && (arguments.length > 2 && arr[i][attr1] === value1)) {
      arr.splice(i, 1);
    }
  }
  return arr;
}

function getMostRecentPoOfItem(item_id)
{
  var filters=new Array();
  var cols=new Array();

  filters.push(new nlobjSearchFilter('internalid',null,'anyof',item_id));
  filters.push(new nlobjSearchFilter('type','transaction','is','PurchOrd'));

  cols.push(new nlobjSearchColumn('internalid','transaction'));
  cols.push(new nlobjSearchColumn('datecreated','transaction').setSort(true));

  var search=nlapiSearchRecord('item',null,filters,cols);
  var po_id='';
  if(search)
  {
    po_id=search[0].getValue('internalid','transaction');
  }
  return po_id;
}

function createLabel(vendor_id,fulfillmentIds)
{
  var isFedex=nlapiLookupField('vendor',vendor_id,'custentity_outgoing_shipping_carrier');
  nlapiLogExecution('debug', 'Create Label - Is',isFedex );
  var index=isFedex.indexOf('1');
  if(index>-1)
  {
    for(var i=0;i<fulfillmentIds.length;i++)
    {
      nlapiLogExecution('debug', 'Create Label - IF Id',fulfillmentIds[i] );
      VRA_Fulfillment_Label(fulfillmentIds[i],false);
    }
  }
}

function createPackingSlips(vendor_id,fulfillmentIds,VRAId)
{
  for(var i=0;i<fulfillmentIds.length;i++)
  {
    var if_id=fulfillmentIds[i];
    var objIF=nlapiLoadRecord('itemfulfillment',if_id);
    var tracking_id=objIF.getFieldValue('custbody69');
    var ship_to_addr=getShipToAddr(objIF);
    var location_id= objIF.getLineItemValue('item','location',1);
    var ship_from_addr=getShipFromAddr(location_id)
    var itemCount=objIF.getLineItemCount('item');
    var arrProducts=[];
    for(var j=1;j<=itemCount;j++)
    {
      var item_id=objIF.getLineItemValue('item','item',j);
      var quantity=objIF.getLineItemValue('item','quantity',j);
      var vra_po=objIF.getLineItemText('item','custcol_vra_po',j);
      var itemDet=nlapiLookupField('inventoryitem',item_id,['itemid','vendorname','custitem_vra_description','custitemcertificate_included','custitem46','cost']);
      var cert_included=nlapiLookupField('inventoryitem',item_id,'custitemcertificate_included',true);
      arrProducts.push(
        {
          item: itemDet.itemid,
          vendor: itemDet.vendorname,
          desc: itemDet.custitem_vra_description,
          cert_included:cert_included,
          certificate_no: itemDet.custitem46,
          vra_po: vra_po,
          amount:itemDet.cost,
          qty: quantity
        }
      );

    }
    createInternalVRAPackingSlip(arrProducts,VRAId,if_id,tracking_id,ship_from_addr, ship_to_addr);
    createVRAPackingSlip(arrProducts,VRAId,if_id,tracking_id,ship_from_addr, ship_to_addr);
  }
}

function getShipToAddr(objIF)
{
  var subrecord= objIF.viewSubrecord('shippingaddress');
  var attention=subrecord.getFieldValue('attention');
  var addressee=subrecord.getFieldValue('addressee');
  var addr1=subrecord.getFieldValue('addr1');
  var addr2=subrecord.getFieldValue('addr2');
  var city=subrecord.getFieldValue('city');
  var state=subrecord.getFieldValue('state');
  var zip=subrecord.getFieldValue('zip');
  var address='';
  if(attention)
    address=address+attention+'\n';

  if(addressee)
    address=address+addressee+'\n';

  if(addr1)
    address=address+addr1+'\n';

  if(addr2)
    address=address+addr2+'\n';

  if(city)
    address=address+city+', ';

  if(state)
    address=address+state+' ';

  if(zip)
    address=address+zip;

  return address;
}

function getShipFromAddr(location_id)
{
  var objLoc=nlapiLoadRecord('location',location_id);
  var subrecord= objLoc.viewSubrecord('mainaddress');

  var addr1=subrecord.getFieldValue('addr1');
  var addr2=subrecord.getFieldValue('addr2');
  var city=subrecord.getFieldValue('city');
  var state=subrecord.getFieldValue('state');
  var zip=subrecord.getFieldValue('zip');
  var address='Brilliant Earth \n';

  if(addr1)
    address=address+addr1+'\n';

  if(addr2)
    address=address+addr2+'\n';

  if(city)
    address=address+city+', ';

  if(state)
    address=address+state+' ';

  if(zip)
    address=address+zip;

  return address;
}


function setInventoryFieldtoNull(items)
{
  for(var i=0;i<items.length;i++)
  {
    nlapiSubmitField('inventoryitem',items[i].item_id,['custitemcertificate_included','custitemcertificate_status','custitemcert_ordered','custitemcert_eta','custitem40',
                                                       'custitem192','custitemreason_for_diamond_return','custitem_vendor_return_status',
                                                       'custitem_preferred_vendor_stock_item'],['','','','','','','','','F']);
  }
}
function mergePDFs(get_file)
{
  var folder_id='11064888';
  try
  {
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
    xml += "<pdfset>";
    for(var s=0;s<get_file.length;s++)
    {
      try
      {
        var fileURL = nlapiLoadFile(get_file[s]).getURL();
        xml += "<pdf src='"+ nlapiEscapeXML(fileURL) +"'/>";
      }
      catch(er){}
    }
    xml += "</pdfset>";
    var file = nlapiXMLToPDF(xml);
    var timestamp = new Date().getUTCMilliseconds();
    file.name=timestamp+'.pdf';
    file.setFolder(folder_id); //Return Shipping Labels
    var fileID = nlapiSubmitFile(file);
    var fileURL_main = nlapiLoadFile(fileID).getURL(); 
    return fileURL_main;
  }
  catch(er)
  {
    return false;
  }
}


