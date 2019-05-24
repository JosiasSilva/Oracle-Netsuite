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

      var form = nlapiCreateForm("Print Queues for Labels");
      form.setScript("customscript_vendor_box_client_use");
      fld = form.addField("custpage_selected_lable","integer","Lable Queue Selected");
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

          if(list_record[i].getValue('custrecord_box_shipping_label'))
          {
            label_queue_record.push(
              {
                custpage_box_id_label:list_record[i].getValue(col[1]),
                custpage_vendor_label:list_record[i].getValue(col[0]),
                custpage_insurence_label:list_record[i].getValue('custrecord_box_insurance_value'),   
                custpage_tracking_id_label:list_record[i].getValue('custrecord_box_tracking_id'),
                cutpage_id_label:list_record[i].getValue('custrecord_box_shipping_label'),

              }
            )

          }

        }	 
      }
      list_label_queue(form,label_queue_record);
      response.writePage(form);
    }
  }
  else
  {
    var get_print=[];
    for(var a=1;a<=request.getLineItemCount('custpage_lable_queue');a++)
    {
      if(request.getLineItemValue('custpage_lable_queue','custpage_select_label',a)=='T')
      {
        get_print.push(request.getLineItemValue('custpage_lable_queue','cutpage_id_label',a));
      }
    }
    if(get_print.length>0)
    {
      nlapiGetContext ( ) .setSessionObject ( "Send_data" , JSON.stringify(get_print) );
      nlapiSetRedirectURL ( 'suitelet' , 'customscript_label_slip' , 'customdeploy_label_slip' , false ,{ send_data:'OK' }) ;
    }
    else
    {
      nlapiSetRedirectURL ( 'suitelet' , 'customscript_label_slip' , 'customdeploy_label_slip') ;
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
  response.setContentType("PDF","Print Queues for Labels.pdf","inline");
  response.write(pdf.getValue());
}



function list_label_queue(form,record)
{

  var list = form.addSubList("custpage_lable_queue","list","Label Queue");
  list.addField("custpage_select_label","checkbox","Select");
  list.addField("custpage_box_id_label","text","Box ID");
  list.addField("custpage_vendor_label","text","Vendor");
  list.addField("custpage_insurence_label","text","Insurance");
  list.addField("custpage_tracking_id_label","text","Tracking ID");
  list.addField("cutpage_id_label","text","ID").setDisplayType('hidden');
  list.addButton("custpage_mark_all_packing","Mark All","mark_all_label(true)");
  list.addButton("custpage_unmark_all_packing","Unmark All","mark_all_label(false)");
  list.setLineItemValues(record);
}