String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}
var search_line_item='customsearch_vdb_po_item_packing_slip';
var search_qa_sendback='customsearch_qa_search_dashboard';
var search_vendor_box_item='customsearch_vendor_box_item_search';
var box_record_create=false;
var box_record_not_create=false;
var button_update_or_create=false;
function Vendor_Box_Dashboard(request,response)
{

  if(request.getParameter("get_price"))
  {
    var base_price=nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',request.getParameter("get_price")),new nlobjSearchColumn('baseprice') ); 
    if(base_price)
    {
      response.write(base_price[0].getValue('baseprice'));
    }
  }
  
  /* NS-1278 - 07/25/2018 Start */ 
  else if(request.getParameter('open_popup')=='T')
  {
	bulkupdate_list_vendorboxdash(request,response);
  }
  /* NS-1278 - 07/25/2018 End */
  
  else
  {
    //nlapiLogExecution ( 'debug' , 'request.getMethod()'); 
    if(request.getMethod()=="GET")
    {
      try
      {

        var get_vendor=request.getParameter('custpage_vendor');
        var get_status=request.getParameter('custpage_status');
        var get_item=null;//request.getParameter('custpage_item');
        var form = nlapiCreateForm("Vendor Box Dashboard");
        form.setScript("customscript_vendor_box_client_use");
        var vendor_field=form.addField("custpage_vendor","select","Vendor");
        vendor_field.addSelectOption('','',true);
        var status=form.addField("custpage_status","select","Status",'customlist_vbd_status');
        if(get_status){status.setDefaultValue(get_status);}
        var record_no=form.addField("custpage_record","textArea");
        record_no.setDisplayType('inline');
        var record_content=[];
        record_content.push("PO ITEMS: 0");
        record_content.push("QA SENDBACKS: 0");
        record_content.push("VENDER BOX ITEMS: 0");
        add_line_sublist(form,get_vendor,get_item,get_status,record_content);
        add_qa_sandbox_sublist(form,get_vendor,get_item,get_status,record_content);
        add_vendor_box_sublist(form,get_vendor,get_item,get_status,record_content);
        record_no.setDefaultValue(record_content.join('\n'));      
        fill_vendor_list(vendor_field,get_vendor);
        form.addSubmitButton("Update Records");
        var search_record=nlapiSearchRecord('customrecord_box_record',null,new nlobjSearchFilter('custrecord_po_id',null,'isnotempty'),new nlobjSearchColumn('custrecord_po_id'));
        if(!search_record)
        {
          if(button_update_or_create)
          {

            form.addButton("custpage_update_print","Update Packing Slip",'check_value_insert(2,'+nlapiGetUser ( )+');');
          }
          else
          {
            form.addButton("custpage_print","Create Vendor Box",'check_value_insert(1,'+nlapiGetUser ( )+');');
          }
        }


        response.writePage(form);
      }
      catch(er)
      {
        nlapiLogExecution ( 'debug' , 'error',er.message); 
      }
    }
    else
    {
      // nlapiLogExecution ( 'debug' , 'Update'); 
      var param=new Array();
      try
      {    
        for(var x=1; x <= request.getLineItemCount("custpage_list"); x++)
        {

          if(request.getLineItemValue("custpage_list","custpage_list_changed",x)=="T")
          {

            var get_id=request.getLineItemValue("custpage_list","custpage_list_po",x);
            var list_notes=request.getLineItemValue("custpage_list","custpage_list_notes",x);
            var old_list_notes=request.getLineItemValue("custpage_list","custpage_old_list_notes",x);
            var date_sent_from_sf=request.getLineItemValue("custpage_list","custpage_list_date_sent_from_sf",x);
            var old_date_sent_from_sf=request.getLineItemValue("custpage_list","custpage_old_list_date_sent_from_sf",x);
            var list_status=request.getLineItemValue("custpage_list","custpage_list_status",x);
            var old_list_status=request.getLineItemValue("custpage_list","custpage_old_list_status",x);
            var insurance_value=request.getLineItemValue("custpage_list","custpage_list_insurance_value",x);
            var old_insurance_value=request.getLineItemValue("custpage_list","custpage_list_insurance_value_old",x);
            var list_gem_notif=request.getLineItemValue("custpage_list","custpage_list_gem_notif",x);
            var old_list_gem_notif=request.getLineItemValue("custpage_list","custpage_old_list_gem_notif",x);
            if(list_notes!=old_list_notes || date_sent_from_sf!=old_date_sent_from_sf ||list_status!=old_list_status ||insurance_value!=old_insurance_value  )
            {
              var po = nlapiLoadRecord("purchaseorder",request.getLineItemValue("custpage_list","custpage_list_po",x));
              po.setFieldValue("custbody244",list_gem_notif);

              for(var i=1; i <= po.getLineItemCount("item"); i++)
              {
                if(po.getLineItemValue("item","lineuniquekey",i)==request.getLineItemValue("custpage_list","custpage_list_po_line",x))
                {
                  po.setLineItemValue("item","custcol_vbd_notes",i,list_notes);
                  po.setLineItemValue("item","custcol18",i,date_sent_from_sf);
                  po.setLineItemValue("item","custcol_vbd_status",i,list_status);
                  po.setLineItemValue("item","custcol_full_insurance_value",i,insurance_value);
                  break;
                }
              }
              nlapiSubmitRecord(po,true,true);
              nlapiLogExecution("debug","Udate OK");

            }
            else if(list_gem_notif!=old_list_gem_notif)
            {
              nlapiSubmitField ( 'purchaseorder' , get_id , 'custbody244' , list_gem_notif ) ;
            }

          }
        }
      }
      catch(err)
      {
        nlapiLogExecution("error","Error Updating Date Sent from SF","Details: " + err.message);
      }
      try
      {    
        for(var x=1; x <= request.getLineItemCount("custpage_qa_list"); x++)
        {
          var get_id=request.getLineItemValue("custpage_qa_list","custpage_qa_list_qa_record_id",x);
          var old_insurence=request.getLineItemValue("custpage_qa_list","custpage_qa_list_insurance_val_old",x);
          var new_insurence=request.getLineItemValue("custpage_qa_list","custpage_qa_list_insurance_val",x);
          if(old_insurence!=new_insurence)
          {
            nlapiSubmitField ( 'customrecord32' , get_id , 'custrecord_purchase_order_insurance_qa' , new_insurence ) ;
          }
        }
      }
      catch(err)
      {
        nlapiLogExecution("error","Error Updating QA","Details: " + err.message);
      }

      try
      {    
        for(var x=1; x <= request.getLineItemCount("custpage_vendor_list"); x++)
        {
          if(!request.getLineItemValue("custpage_vendor_list","custpage_old_record",x))
          {
            var box_rec=nlapiCreateRecord('customrecord_vendor_box_item', {recordmode: 'dynamic'});
            box_rec.setFieldValue( 'custrecord_vbi_item_name_numb',
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_item_name",x));	

            box_rec.setFieldValue( 'custrecord_vbi_insurance',
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_insurance",x));	

            box_rec.setFieldValue( 'custrecord_vbi_vendor', 
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_vendor_master",x));	

            box_rec.setFieldValue('custrecord_vbi_notes', 
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_note",x));				

            box_rec.setFieldValue('custrecord_vbi_date_sent_from_sf',
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_sf_date",x));	

            box_rec.setFieldValue('custrecord_vbi_item_description', 
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_desc",x));


            box_rec.setFieldValue('custrecord_index_number_id',
                                  request.getLineItemValue("custpage_vendor_list","1",x));

            box_rec.setFieldValue('custrecord_vbi_po_number',
                                  request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_po_number",x));
            nlapiSubmitRecord(box_rec,true,true);
          }
          else
          {


            var get_new_insu=request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_insurance",x);    
            var get_old_insu=request.getLineItemValue("custpage_vendor_list","custpage_vendor_box_insurance_old",x);
            if(get_old_insu!=get_new_insu)
            {
              nlapiSubmitField ( 'customrecord_vendor_box_item' , 
                                request.getLineItemValue("custpage_vendor_list","custpage_line_internal_id",x) , 'custrecord_vbi_insurance' ,get_new_insu ) ;
            }

          }

        }
      }
      catch(err)
      {
        nlapiLogExecution("error","Error Box Create","Details: " + err.message);
      }

      param['custpage_vendor']=request.getParameter('custpage_vendor');
      param['custpage_status']=request.getParameter('custpage_status');
      param['custpage_item']=request.getParameter('custpage_item');
      response.sendRedirect("SUITELET","customscript_vendor_box_new","customdeploy_vendor_box_new",false, param);
    }
  }
}



