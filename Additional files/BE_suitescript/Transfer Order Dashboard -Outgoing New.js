function outgoing_tab(form,request,get_location_search,result_outgoing,create_box,default_loaction)
{
  if(get_location_search)
  {
    form.addTab('custitem_outgoing', 'Outgoing');
    var from_location_outgoing_to=form.addField('custitem_outgoing_location_to', 'select', 'To Location',null, 'custitem_outgoing');
    var from_location_outgoing_from=form.addField('custitem_outgoing_location_from', 'select', 'From Location', null, 'custitem_outgoing');

    if(get_location_search)
    {
      from_location_outgoing_from.addSelectOption("","All",true);
      from_location_outgoing_to.addSelectOption("","All",true);
      for(var a=0;a<get_location_search.length;a++)
      {
        from_location_outgoing_from.addSelectOption(get_location_search[a].getId(),get_location_search[a].getValue('name'));
        from_location_outgoing_to.addSelectOption(get_location_search[a].getId(),get_location_search[a].getValue('name'));
      }
      if(default_loaction)
      {
        from_location_outgoing_from.setDefaultValue(default_loaction);
      }
    }

    var search_outgoing= form.addField('custitem_outgoing_search', 'text', '.',null, 'custitem_outgoing');
    var get_ship_date_outgoing=form.addField('custitem_outgoing_ship_date', 'date', 'DATE TO SHIP',null, 'custitem_outgoing');
    // get_ship_date_outgoing.setDefaultValue(nlapiDateToString (new Date()) );
    from_location_outgoing_to.setLayoutType('outsidebelow', 'startcol');
    from_location_outgoing_from.setLayoutType('outsidebelow', 'startcol');
    get_ship_date_outgoing.setLayoutType('outsidebelow', 'startcol');
    search_outgoing.setLayoutType('outsidebelow', 'startcol');
    search_outgoing.setDisplaySize( 40, 15);
  }
  var list_outgoing = form.addSubList("custitem_list_outgoing", "list", "outgoing","custitem_outgoing");
  list_outgoing.addRefreshButton();
  list_outgoing.addMarkAllButtons();
  list_outgoing.addButton("custitem_outgoing_print_pick_slip", "Picking Slip","Print_Pick_Slip()");
  list_outgoing.addButton("custitem_outgoing_fulfill", "Fulfill","Fulfillment_Records()");
  list_outgoing.addButton("custitem_outgoing_print_picking_slip", "Packing Slip","Print_Doc('custitem_outgoing_packing_slip')");
  list_outgoing.addButton("custitem_outgoing_shipping_label", "Shipping Label","Print_Doc('custitem_outgoing_shipping_label')");
  list_outgoing.addButton("custitem_outgoing_create_box_recordss", "Create Box",'check_value_insert_create('+nlapiGetUser ( ) +')');
  list_outgoing.addButton("custitem_outgoing_update_box_records", "Update Box",'check_value_insert_update('+nlapiGetUser ( ) +')');

  list_outgoing.addField("custitem_outgoing_fulfill_check", "textarea","Fulfill");
  list_outgoing.addField("custitem_outgoing_date_to_ship", "text","DATE TO SHIP");
  list_outgoing.addField("custitem_outgoing_transfer_order", "text","TRANSFER ORDER");
  list_outgoing.addField("custitem_outgoing_from_location", "select","FROM LOCATION",'location').setDisplayType('inline');
  list_outgoing.addField("custitem_outgoing_to_location", "select","TO LOCATION",'location').setDisplayType('inline');
  list_outgoing.addField("custitem_outgoing_memo", "textarea","MEMO");
  list_outgoing.addField("custitem_outgoing_insurence_total", "text","INSURANCE TOTAL");
  list_outgoing.addField("custitem_outgoing_total_items", "text","TOTAL ITEMS");
  list_outgoing.addField("custitem_outgoing_sales_order_count", "text","SALES ORDER COUNT");
  list_outgoing.addField("custitem_outgoing_box_records", "text","BOX RECORD");
  list_outgoing.addField("custitem_outgoing_tracking", "textarea","TRACKING #");
  list_outgoing.addField("custitem_outgoing_status", "text","STATUS");
  list_outgoing.addField("custitem_outgoing_internalid", "text","internalid").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_packing_slip", "text","internalid").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_shipping_label", "text","internalid").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_box_records_id", "text","BOX RECORD ID").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_document_number", "text","Transfer Document Number").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_sno", "text","Sno").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_box_record_have", "text","Box Have").setDisplayType('hidden');
  list_outgoing.addField("custitem_outgoing_to_same_location", "text","To Same Location").setDisplayType('hidden');

  Outgoing_list(list_outgoing,request,result_outgoing,create_box)
}
function Outgoing_list(list_outgoing,request,result_outgoing,create_box)
{
  var outgoing_array=[];
  if(result_outgoing)
  {
    var to_location_obj=[];
    for(var s=0;s<result_outgoing.length;s++)
    {
      var trans_doc=result_outgoing[s].getValue('tranid');
      var link_transfer_order;
      if(trans_doc)
      {
        link_transfer_order ="<a href='/app/accounting/transactions/transaction.nl?id="+ result_outgoing[s].getId()+"' target=_blank>"+trans_doc+"</a>";
      }
      else
      {
        link_transfer_order ="<a href='/app/accounting/transactions/transaction.nl?id="+ result_outgoing[s].getId()+"' target=_blank>Transfer Order</a>";
      }
      var text_status=result_outgoing[s].getText('status');
      var style_check_box="style='margin-left:.4cm'";
      var name_id='check_box_outgoing_value';
      if(text_status!="Pending Fulfillment")
      {
        name_id='';
        style_check_box="style='display:none;'";
      }
      var box_record_link="<a href='/app/common/custom/custrecordentry.nl?rectype=707&id="+ result_outgoing[s].getValue('custbody_box_record')+"' target=_blank>"+result_outgoing[s].getValue('custbody_box_record')+"</a>"
      var box_have=false;
      if( result_outgoing[s].getValue('custbody_box_record'))
      {
        box_have=true;
      }

      var to_location_value_get= result_outgoing[s].getValue('transferlocation');
      if(to_location_obj.indexOf(to_location_value_get)==-1)
      {
        to_location_obj.push(to_location_value_get);
      }
      outgoing_array.push({
        custitem_outgoing_fulfill_check:'<span  name="'+name_id+'"    '+style_check_box+' id="outgoing_check'+(s+1)+'" class="checkbox_unck" onclick="NLCheckboxOnClick(this);"><input type="checkbox" class="checkbox" ><img class="checkboximage" src="/images/nav/ns_x.gif" alt=""></span>',
        custitem_outgoing_date_to_ship:result_outgoing[s].getValue('trandate'),
        custitem_outgoing_transfer_order: link_transfer_order,
        custitem_outgoing_from_location:result_outgoing[s].getValue('location'),
        custitem_outgoing_to_location:result_outgoing[s].getValue('transferlocation'),
        custitem_outgoing_memo:result_outgoing[s].getValue('memo'),
        custitem_outgoing_insurence_total:result_outgoing[s].getValue('custbody_insurance_total'),
        custitem_outgoing_total_items:result_outgoing[s].getValue('custbody306'),
        custitem_outgoing_sales_order_count:result_outgoing[s].getValue('custbody_to_so_count'),
        custitem_outgoing_box_records:box_record_link,
        custitem_outgoing_tracking:result_outgoing[s].getValue('custbody69'),
        custitem_outgoing_status:result_outgoing[s].getText('status'),
        custitem_outgoing_internalid:result_outgoing[s].getId(),
        custitem_outgoing_packing_slip:result_outgoing[s].getValue('custrecord_box_packing_slip','custbody_box_record'),
        custitem_outgoing_shipping_label:result_outgoing[s].getValue('custrecord_box_shipping_label','custbody_box_record'),
        custitem_outgoing_box_records_id: result_outgoing[s].getValue('custbody_box_record'),
        custitem_outgoing_document_number:result_outgoing[s].getValue('tranid'),
        custitem_outgoing_sno:(s+1)+'',
        custitem_outgoing_box_record_have:box_have,
        custitem_outgoing_to_same_location:result_outgoing[s].getValue('transferlocation')
      });
    }

    if(create_box && to_location_obj.length>0)
    {

      var get_city_location=nlapiSearchRecord('location',null,[new nlobjSearchFilter('custrecord_location_type',null,'anyof','2'),
                                                               new nlobjSearchFilter('isinactive',null,'is','F'),
                                                               new nlobjSearchFilter('custrecord_city_location',null,'noneof','@NONE@'),
                                                               new nlobjSearchFilter('internalid',null,'anyof',to_location_obj)
                                                              ],
                                              new nlobjSearchColumn('custrecord_city_location'));

      if(get_city_location)
      {
        for(var a=0;a<outgoing_array.length;a++)
        {
          var get_loction_value=outgoing_array[a].custitem_outgoing_to_same_location;
          for(var b=0;b<get_city_location.length;b++)
          {
            if(get_loction_value==get_city_location[b].getId())
            {
              outgoing_array[a].custitem_outgoing_to_same_location=get_city_location[b].getValue('custrecord_city_location');
            }
          }
        }
      }

    }
  }
  list_outgoing.setLineItemValues(outgoing_array);
}