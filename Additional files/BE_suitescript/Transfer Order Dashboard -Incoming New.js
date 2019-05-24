function incoming_list(form,request,get_location_search,result_incoming,get_from_incoming_location,default_loaction)
{

  if(get_location_search || get_from_incoming_location)
  {
    form.addTab('custitem_incoming', 'Incoming');
    var from_location_incoming_to=form.addField('custitem_incoming_location_to', 'select', 'To Location',null, 'custitem_incoming');
    var from_location_incoming_from=form.addField('custitem_incoming_location_from', 'select', 'From Location', null, 'custitem_incoming');
    if(get_location_search)
    {

      from_location_incoming_to.addSelectOption("","All",true);
      for(var a=0;a<get_location_search.length;a++)
      {
        from_location_incoming_to.addSelectOption(get_location_search[a].getId(),get_location_search[a].getValue('name'));
      }
      if(default_loaction)
      {
        from_location_incoming_to.setDefaultValue(default_loaction);
      }
    }


    if(get_from_incoming_location)
    {
      from_location_incoming_from.addSelectOption("","All",true);
      for(var a=0;a<get_from_incoming_location.length;a++)
      {
        from_location_incoming_from.addSelectOption(get_from_incoming_location[a].getId(),get_from_incoming_location[a].getValue('name'));
      }
    }

    var search_incoming= form.addField('custitem_incoming_search', 'text', '.',null, 'custitem_incoming');
    var get_ship_date_incoming=form.addField('custitem_incoming_ship_date', 'date', 'DATE TO SHIP',null, 'custitem_incoming');
    //get_ship_date_incoming.setDefaultValue(nlapiDateToString (new Date()) );
    from_location_incoming_to.setLayoutType('outsidebelow', 'startcol');
    from_location_incoming_from.setLayoutType('outsidebelow', 'startcol');
    get_ship_date_incoming.setLayoutType('outsidebelow', 'startcol');
    search_incoming.setLayoutType('outsidebelow', 'startcol');
    search_incoming.setDisplaySize( 40, 15);
  }
  var list_incoming = form.addSubList("custitem_list_incoming", "list", "Incoming","custitem_incoming"); 
  list_incoming.addRefreshButton();
  // list_incoming.addMarkAllButtons();
  //list_incoming.addButton("custitem_incoming_receive_btn", "Receive",'Receive_Records()');
  //list_incoming.addField("custitem_incoming_receive", "checkbox","Receive");
  list_incoming.addField("custitem_incoming_date_to_ship", "text","DATE TO SHIP");
  list_incoming.addField("custitem_incoming_transfer_order", "text","TRANSFER ORDER");
  list_incoming.addField("custitem_incoming_from_location", "select","FROM LOCATION",'location').setDisplayType('inline');
  list_incoming.addField("custitem_incoming_to_location", "select","TO LOCATION",'location').setDisplayType('inline');
  list_incoming.addField("custitem_incoming_memo", "textarea","MEMO");
  list_incoming.addField("custitem_incoming_insurence_total", "text","INSURANCE");
  list_incoming.addField("custitem_incoming_total_items", "text","TOTAL ITEMS");
  list_incoming.addField("custitem_incoming_sales_order_count", "text","SO COUNT");
  list_incoming.addField("custitem_incoming_box_records", "text","BOX RECORD");
  list_incoming.addField("custitem_incoming_tracking", "textarea","TRACKING #");
  list_incoming.addField("custitem_incoming_package_latest_activity", "select","LATEST ACTIVITY","customlist_last_activity").setDisplayType('inline');;
  list_incoming.addField("custitem_incoming_package_location", "textarea","Location");
  list_incoming.addField("custitem_incoming_package_delivery", "textarea","Scheduled Delivery");
  list_incoming.addField("custitem_incoming_status", "text","STATUS");
  list_incoming.addField("custitem_incoming_internalid", "text","Internalid").setDisplayType('hidden');

  Incoming_list(list_incoming,request,result_incoming);
}
function Incoming_list(list_incoming,request,result_incoming)
{
  var incoming_array=[];
  if(result_incoming)
  {
    var get_all_id=[];
    for(var s=0;s<result_incoming.length;s++)
    {
      var box_record_id=result_incoming[s].getValue('custbody_box_record');
      var link_transfer_order="<a href='/app/accounting/transactions/transaction.nl?id="+ result_incoming[s].getId()+"' target=_blank>"+result_incoming[s].getValue('tranid')+"</a>"
      var box_record_link="";
      if(box_record_id)
      {
        box_record_link="<a href='/app/common/custom/custrecordentry.nl?rectype=707&id="+ result_incoming[s].getValue('custbody_box_record')+"' target=_blank>"+result_incoming[s].getValue('custbody_box_record')+"</a>";
        get_all_id.push(box_record_id);
      }

      incoming_array.push({
        custitem_incoming_date_to_ship:result_incoming[s].getValue('trandate'),
        custitem_incoming_transfer_order: link_transfer_order,
        custitem_incoming_from_location:result_incoming[s].getValue('location'),
        custitem_incoming_to_location:result_incoming[s].getValue('transferlocation'),
        custitem_incoming_memo:result_incoming[s].getValue('memo'),
        custitem_incoming_insurence_total:result_incoming[s].getValue('custbody_insurance_total'),
        custitem_incoming_total_items:result_incoming[s].getValue('custbody306'),
        custitem_incoming_sales_order_count:result_incoming[s].getValue('custbody_to_so_count'),
        custitem_incoming_box_records:box_record_link,
        custitem_incoming_tracking:result_incoming[s].getValue('custbody69'),
        custitem_incoming_package_latest_activity:'',
        custitem_incoming_package_location:'',
        custitem_incoming_package_delivery:'',
        custitem_incoming_status:result_incoming[s].getText('status'),
        custitem_incoming_internalid:result_incoming[s].getId(),
        box_record_id:box_record_id
      });

    }
    if(get_all_id.length>0)
    {
      var columns=[];
      columns.push(new nlobjSearchColumn('internalid').setSort(true));
      columns.push(new nlobjSearchColumn('custrecord_transaction_record'));
      columns.push(new nlobjSearchColumn('custrecord_package_latest_activity'));
      columns.push(new nlobjSearchColumn('custrecord_package_location'));
      columns.push(new nlobjSearchColumn('custrecord_scheduled_delivery_cpr'));
      columns.push(new nlobjSearchColumn('custrecord_box_record_cpr'));
      var filter=new nlobjSearchFilter('custrecord_box_record_cpr',null,'anyof',get_all_id);
      var search_record_custom_package_records=nlapiSearchRecord('customrecord_custom_package_record',null,filter,columns);
      if(search_record_custom_package_records)
      {

        for(var b=0;b<search_record_custom_package_records.length;b++)
        {
          var get_box_record=search_record_custom_package_records[b].getValue('custrecord_box_record_cpr');
          for(var c=0;c<incoming_array.length;c++)
          {
            var get_main_box_id=incoming_array[c].box_record_id;
            var incoming_package_latest_activity=incoming_array[c].custitem_incoming_package_latest_activity;
            if(get_main_box_id && !incoming_package_latest_activity)
            {
              if(get_main_box_id==get_box_record)
              {
                incoming_array[c].custitem_incoming_package_latest_activity=search_record_custom_package_records[b].getValue('custrecord_package_latest_activity');
                incoming_array[c].custitem_incoming_package_location=search_record_custom_package_records[b].getValue('custrecord_package_location');
                incoming_array[c].custitem_incoming_package_delivery=search_record_custom_package_records[b].getValue('custrecord_scheduled_delivery_cpr');
              }
            }
          }
        }
      }
    }
  }
  list_incoming.setLineItemValues(incoming_array);
}





