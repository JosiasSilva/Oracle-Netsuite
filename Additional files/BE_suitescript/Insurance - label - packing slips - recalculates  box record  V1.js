String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}
function Add_Button(type,form,nlobjRequest)
{
  try
  {
    if(type=='view')
    {
      var get_value= nlobjRequest.getParameter ('update_record'); 
      if(get_value)
      {
        try
        {
          var total_insurence=0;
          var get_line_item=[];
          var get_vendor_text;
          var get_vendor_id;
          var box_shipping_label;
          var box_rec_Id=nlapiGetRecordId();

          var search_record_po=nlapiSearchRecord(null,'customsearch_vdb_po_item_packing_slip_2',new nlobjSearchFilter('custcol_box_record_po',null,'anyof', nlapiGetRecordId ( )));
          var search_record_qa=nlapiSearchRecord(null,'customsearch_qa_search_dashboard',new nlobjSearchFilter('custrecord_box_record_qa',null,'anyof', nlapiGetRecordId ( )));
          if(search_record_po)
          {
            var get_col=search_record_po[0].getAllColumns();
            for(var a=0;a<search_record_po.length;a++)
            {
              var insurec=search_record_po[a].getValue(get_col[10]);
              if(insurec){insurec=parseFloat(insurec);}else{insurec=0;}
              total_insurence+=parseFloat(insurec);
              get_line_item.push({
                "po_doc":search_record_po[a].getValue(get_col[15]),
                "description":encodeURIComponent(encodeURIComponent(search_record_po[a].getValue(get_col[4]))),
                "insurance_value":insurec,
                "sublist_type":"1"
              });
            }
          }
          if(search_record_qa)
          {

            var get_col=search_record_qa[0].getAllColumns();
            for(var a=0;a<search_record_qa.length;a++)
            {
              var insurec=search_record_qa[a].getValue('custrecord_purchase_order_insurance_qa',null,'group');
              if(insurec){insurec=parseFloat(insurec);}else {insurec=0;}
              total_insurence+=parseFloat(insurec);
              get_line_item.push({
                "po_doc":search_record_qa[a].getValue('tranid','custrecord_qa_po_number','group'),
                "description":encodeURIComponent(encodeURIComponent(search_record_qa[a].getValue(get_col[9]))),
                "insurance_value":insurec,
                "sublist_type":"2"
              });
            }
          }

          var load_box=nlapiLoadRecord('customrecord_box_record',nlapiGetRecordId ( ));
          get_vendor_text=load_box.getFieldText('custrecord_box_vendor');
          get_vendor_id=load_box.getFieldValue('custrecord_box_vendor');
          box_shipping_label=load_box.getFieldValue('custrecord_box_shipping_label');    
          for(var a=1;a<=load_box.getLineItemCount('recmachcustrecord_vbi_box_record');a++)
          {
            var insurec=load_box.getLineItemValue('recmachcustrecord_vbi_box_record','custrecord_vbi_insurance',a);
            if(insurec){insurec=parseFloat(insurec);}else{insurec=0;}
            total_insurence+=parseFloat(insurec);
            get_line_item.push({
              "po_doc":load_box.getLineItemValue('recmachcustrecord_vbi_box_record','custrecord_vbi_po_number_display',a),
              "description":encodeURIComponent(encodeURIComponent(load_box.getLineItemValue('recmachcustrecord_vbi_box_record','custrecord_vbi_item_description',a))),
              "insurance_value":insurec,
              "sublist_type":"3"
            });
          }

          load_box.setFieldValue('custrecord_box_insurance_value',total_insurence);
          load_box.setFieldValue('custrecord_box_record_total_items',get_line_item.length);
          var get_value=nlapiSearchRecord('customrecord32',null,new nlobjSearchFilter('custrecord_box_record_qa',null,'anyof',nlapiGetRecordId ( )));
          if(get_value)
          {
            load_box.setFieldValue('custrecord_box_sendbacks','T');
          }
          else
          {
            load_box.setFieldValue('custrecord_box_sendbacks','F');
          }
          var custrecord_type_of_box=load_box.getFieldValue('custrecord_box_sendbacks');
          var custrecord_box_packing_slip=load_box.getFieldValue('custrecord_box_packing_slip');
          nlapiSubmitRecord ( load_box , true , true );
          if(box_shipping_label){try {nlapiDeleteFile ( box_shipping_label ) ;}catch(er){}}
          //if(get_vendor_id=='7773' && custrecord_type_of_box=="F")
         // {
           // try{ Vendor_Box_Shipping_Label(box_rec_Id);}catch(er){}
          //}
          else if(get_vendor_id!='153')
          {
            try{ Vendor_Box_Shipping_Label(box_rec_Id);}catch(er){}
          }
          try{PDF_file_Create(get_line_item,get_vendor_text,box_rec_Id,total_insurence,custrecord_box_packing_slip,'');} catch(er){nlapiLogExecution ( 'debug' ,' er-1' , er ) }
        }
        catch(er){nlapiLogExecution ( 'debug' ,' er-1' , er ) }
        nlapiSetRedirectURL ( 'RECORD' , 'customrecord_box_record' , nlapiGetRecordId ( )) ;
      }
      else
      {
        try
        {
          var data_obj=nlapiLookupField ( 'customrecord_box_record' , nlapiGetRecordId ( ) , ['custrecord_po_id','custrecord_type_of_box'] ); 
          var custrecord_po_id=data_obj.custrecord_po_id;
          var custrecord_type_of_box=data_obj.custrecord_type_of_box;
          if(!custrecord_po_id && custrecord_type_of_box=='1')
          {
            form.addButton('custpage_button','Update Record',"window.location.href='/app/common/custom/custrecordentry.nl?rectype=707&update_record=true&id="+nlapiGetRecordId ( ) +"';");
          }
        }
        catch(er){nlapiLogExecution ( 'debug' ,' er-2' , er ) }
      }
    }
  }
  catch(er){nlapiLogExecution ( 'debug' ,' er-3' , er ) }
}