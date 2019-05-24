nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Vendor_Box_Dashboard(request,response)
{
  if(request.getParameter("data_save")=='T')
  {
    if(request.getParameter("send_data"))
    {
      create_box_api(request.getParameter("send_data"));
    }
    else if(request.getParameter("qa_delete"))
    {
      delete_box_api(request.getParameter("qa_delete"));
    }

  }
  if(request.getParameter("get_price"))
  {
    var base_price=nlapiSearchRecord('item',null,new nlobjSearchFilter('internalid',null,'anyof',request.getParameter("get_price")),new nlobjSearchColumn('baseprice') ); 
    if(base_price)
    {
      response.write(base_price[0].getValue('baseprice'));
    }
  }
  else
  {
    if(request.getMethod()=="GET")
    {
      var get_vendor=request.getParameter('custpage_vendor');
      var get_status=request.getParameter('custpage_status');
      var get_item=null;//request.getParameter('custpage_item');
      var form = nlapiCreateForm("Vendor Box Dashboard");
      form.setScript("customscript_vendor_box_client");
      var vendor=form.addField("custpage_vendor","select","Vendor");
      var status=form.addField("custpage_status","select","Status",'customlist_vbd_status');
      if(get_status){status.setDefaultValue(get_status);}
      // var item=form.addField("custpage_item","select","Item Link",'item');
      // if(get_item){item.setDefaultValue(get_item);}	  
     nlapiLogExecution ( 'debug' , 1 ) ;
      add_line_sublist(form,get_vendor,get_item,get_status);
     nlapiLogExecution ( 'debug' , 2 ); 
      add_qa_sandbox_sublist(form,get_vendor,get_item,get_status);
      nlapiLogExecution ( 'debug' , 3 ); 
      add_vendor_box_sublist(form,get_vendor,get_item,get_status);
      nlapiLogExecution ( 'debug' , 4); 
      fill_vendor_list(vendor,get_vendor);
      nlapiLogExecution ( 'debug' , 5); 
      form.addSubmitButton("Update Records");


      var get_search=nlapiSearchRecord('customrecord_box_record',null,[new nlobjSearchFilter('custrecord_created_by',null,'anyof',nlapiGetUser ( ) ),new nlobjSearchFilter('created',null,'on',nlapiDateToString (new Date())  )]);
      if(get_search)
      {
        form.addButton("custpage_update_print","Update Packing Slip",'check_value_insert(2);');
      }
      else
      {
        form.addButton("custpage_print","Create Vendor Box",'check_value_insert(1);');
      }
      response.writePage(form);
    }
    else
    {

      var param=new Array();
      try
      {    
        for(var x=0; x < request.getLineItemCount("custpage_list"); x++)
        {
          if(request.getLineItemValue("custpage_list","custpage_list_changed",x+1)=="T")
          {
            var po = nlapiLoadRecord("purchaseorder",request.getLineItemValue("custpage_list","custpage_list_po",x+1));
            po.setFieldValue("custbody244",request.getLineItemValue("custpage_list","custpage_list_gem_notif",x+1));

            for(var i=0; i < po.getLineItemCount("item"); i++)
            {
              if(po.getLineItemValue("item","line",i+1)==request.getLineItemValue("custpage_list","custpage_list_po_line",x+1))
              {
                po.setLineItemValue("item","custcol_vbd_notes",i+1,request.getLineItemValue("custpage_list","custpage_list_notes",x+1));
                po.setLineItemValue("item","custcol18",i+1,request.getLineItemValue("custpage_list","custpage_list_date_sent_from_sf",x+1));
                //po.setLineItemValue("item","custcolitem_link",i+1,request.getLineItemValue("custpage_list","custpage_list_item_link",x+1));
                po.setLineItemValue("item","custcol_vbd_status",i+1,request.getLineItemValue("custpage_list","custpage_list_status",x+1));
                po.setLineItemValue("item","custcol_full_insurance_value",i+1,request.getLineItemValue("custpage_list","custpage_list_insurance_value",x+1));
                break;
              }
            }
            nlapiSubmitRecord(po,true,true);
          }
        }
      }
      catch(err)
      {
        nlapiLogExecution("error","Error Updating Date Sent from SF","Details: " + err.message);
      }
      param['custpage_vendor']=request.getParameter('custpage_vendor');
      param['custpage_status']=request.getParameter('custpage_status');
      param['custpage_item']=request.getParameter('custpage_item');
      response.sendRedirect("SUITELET","customscript_vendor_box_dashboard","customdeploy_vendor_box_dashboard",false, param);
    }
  }
}



