function Print_Queue_packing_Slip(request,response)
{
  if(request.getMethod()=="GET")
  {
    if(request.getParameter( 'send_data' ))
    {
      Show_data(nlapiGetContext ( ) .getSessionObject ( 'Send_data' ));
    }
    else
    {
      nlapiScheduleScript ( 'customscript_vendor_box_createds' , 'customdeploy_vendor_box_createds_script' ) ;
      var form = nlapiCreateForm("Print Queues for Packing Slips");
      
       form.setScript("customscript_vendor_box_client_use");
     // form.setScript("customscript_lable_print_queue");
      fld = form.addField("custpage_selected_packing","integer","Packing Slip Selected");
      fld.setDisplayType("inline");
      fld.setDefaultValue("0");     
      form.addSubmitButton("Print");
      var list_record=nlapiSearchRecord(null,'customsearch_box_record_print'); 
      var packing_slip_record=[];
      var label_queue_record=[]
      if(list_record)
      {
        var col=list_record[0].getAllColumns();
        for(var i=0;i<list_record.length;i++)
        {
          if(list_record[i].getValue('custrecord_box_packing_slip'))
          {
            packing_slip_record.push(
              {
                custpage_vendor_packing:list_record[i].getValue(col[0]),
                custpage_insurence_packing:list_record[i].getValue('custrecord_box_insurance_value'),
                custpage_total_item_packing:list_record[i].getValue('custrecord_box_record_total_items'),
                custpage_box_id_packing:list_record[i].getValue(col[1]),
                custpage_tracking_id_packing:list_record[i].getValue('custrecord_box_tracking_id'),
                cutpage_id_packing:list_record[i].getValue('custrecord_box_packing_slip'),

              }
            )

          }

        }	 
      }

      list_packing_slip_queue(form,packing_slip_record);
      response.writePage(form);
    }
  }
  else
  {
    var get_print=[];
    for(var a=1;a<=request.getLineItemCount('custpage_packing_slip');a++)
    {
      if(request.getLineItemValue('custpage_packing_slip','custpage_select_packing',a)=='T')
      {
        get_print.push(request.getLineItemValue('custpage_packing_slip','cutpage_id_packing',a));
      }
    }
    if(get_print.length>0)
    {
      nlapiGetContext ( ) .setSessionObject ( "Send_data" , JSON.stringify(get_print) );
      nlapiSetRedirectURL ( 'suitelet' , 'customscript_queue_for_packing_slip' , 'customdeploy_queue_for_packing_slip' , false ,{ send_data:'OK' }) ;
    }
    else
    {
      nlapiSetRedirectURL ( 'suitelet' , 'customscript_queue_for_packing_slip' , 'customdeploy_queue_for_packing_slip') ;
    }
  }
}


function Show_data(data)
{
  var  get_obj= JSON.parse(data);
  var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
  xml+= "<pdfset>";
  for(var x=0; x < get_obj.length; x++)
  {
    var fileObj = nlapiLoadFile(get_obj[x]); //10 Units
    var fileUrl = fileObj.getURL();
    fileUrl=fileUrl.replace(/&/g,"&amp;");
    xml+= "<pdf src='" + fileUrl + "' />";
  }
  xml+= "</pdfset>";
  var pdf = nlapiXMLToPDF(xml);
  response.setContentType("PDF","Print Queues for Packing Slip.pdf","inline");
  response.write(pdf.getValue());
}

function list_packing_slip_queue(form,record)
{

  var list = form.addSubList("custpage_packing_slip","list","Packing Slip");
  list.addField("custpage_select_packing","checkbox","Select");
  list.addField("custpage_vendor_packing","text","Vendor");
  list.addField("custpage_insurence_packing","text","Insurance");
  list.addField("custpage_total_item_packing","text","Total Items");
  list.addField("custpage_box_id_packing","text","Box ID");
  list.addField("custpage_tracking_id_packing","text","Tracking ID");
  list.addField("cutpage_id_packing","text","ID").setDisplayType('hidden');
  list.addButton("custpage_mark_all_packing","Mark All","mark_all_packing(true)");
  list.addButton("custpage_unmark_all_packing","Unmark All","mark_all_packing(false)");
  list.setLineItemValues(record);

}

