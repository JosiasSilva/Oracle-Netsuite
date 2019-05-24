function Repair_Landing_Page(soRec,soId)
{
  var form = nlapiCreateForm('New Repair Order');
  form.addSubmitButton('Save'); 
  //form.addButton('custpage_back', 'Back', "window.history.go(-1);");
  var backDataUrl_InitialPage =  backDataUrlInitialPage(soId);
  nlapiLogExecution("Debug","Back Data Url for Repair Landing Page ",backDataUrl_InitialPage);
  form.addButton('custpage_back_btn_repair','Back',backDataUrl_InitialPage);

  form.addButton('custpage_close', 'Close', "window.close();" );
  //form.addButton('custpage_refresh', 'Refresh', "pageRefresh()" );
  // form.setScript("customscript_repair_resize_client");

  form.addFieldGroup("info_group","Order Information");
  form.addFieldGroup("item_group","Item Details");
  form.addFieldGroup("delivery_group","Delivery/Shipping");
  form.setScript('customscript_post_sale_repair_client');
  form.setScript('customscript_copy_others');
  var fld = form.addField("custpage_customer","select","Customer Name","customer","info_group");
  fld.setMandatory(true);
  fld.setDefaultValue(soRec.getFieldValue("entity"));
  fld.setDisplayType('disabled');

  fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"info_group");
  fld.setDefaultValue(nlapiLookupField("salesorder",soId,"actualshipdate"));
  fld.setMandatory(true);
  fld.setDisplayType('inline');

  fld = form.addField("custpage_drop_off","select","Drop Off",'customlist_drop_off',"info_group");
  fld.setMandatory(true);

  fld = form.addField("custpage_place_of_sale","select","Place of Sale","null","info_group").setMandatory(true);//Added on 03/06/2017 classification
  var column =new Array();
  column.push(new nlobjSearchColumn('name'));
  column.push(new nlobjSearchColumn('internalid').setSort());//ascending order
  var filter =new Array();
  //filter.push(new nlobjSearchFilter('isinactive',null,'is','F'));
  var filter = [
    ['isinactive','is','F'],
    'and',
    [
      ['internalid','is',2],
      'or',
      ['internalid','is',9],
      'or',
      ['internalid','is',54],
      'or',
      ['internalid','is',57]   
    ]
  ] ;
  var searchResult = nlapiSearchRecord('classification',null,filter,column);
  if(searchResult)
  {
    fld.addSelectOption("","");
    for(var x=0; x < searchResult.length; x++)
    {
      fld.addSelectOption(searchResult[x].getId(),searchResult[x].getValue("name"));
    }
  }
  fld = form.addField("custpage_sales_rep","select","Sales Rep",null,"info_group");
  var filters = [];
  filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
  filters.push(new nlobjSearchFilter("salesrep",null,"is","T"));
  var cols = [];
  cols.push(new nlobjSearchColumn("entityid"));
  var results = nlapiSearchRecord("employee",null,filters,cols);
  if(results)
  {
    fld.addSelectOption("","");
    for(var x=0; x < results.length; x++)
    {
      fld.addSelectOption(results[x].getId(),results[x].getValue("entityid"));
    }
  }
  fld.setDefaultValue(soRec.getFieldValue("salesrep"));
  // fld.setDisplayType('inline');

  /* fld = form.addField("custpage_repair_problem","multiselect","Repair Problem","customlist31","info_group");
  fld.setDisplaySize(300,10);*/

  fld = form.addField("custpage_num_times_repaired","integer","Number of times repaired",null,"info_group");
  fld.setDisplayType("inline");

  var filters = [];
  filters.push(new nlobjSearchFilter("entity",null,"is",soRec.getFieldValue("entity")));
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  filters.push(new nlobjSearchFilter("customform",null,"is","131"));
  var cols = [];
  cols.push(new nlobjSearchColumn("tranid",null,"count"));
  var results = nlapiSearchRecord("salesorder",null,filters,cols);
  if(results)
  {
    fld.setDefaultValue(parseInt(results[0].getValue("tranid",null,"count")));
  }
  else
  {
    fld.setDefaultValue(0);
  }
  fld = form.addField("custpage_customers_reported_repair_issue","text","What is the Customers reported repair issue?",null,"info_group").setMandatory(true).setLayoutType('normal','startcol');
  fld = form.addField("custpage_wear_habits","text","Wear habits?",null,"info_group").setMandatory(true);
  fld = form.addField("custpage_notice_issue","text","When did they notice issue?",null,"info_group").setMandatory(true);
  fld = form.addField("custpage_customer_temp","text","Customer temp?",null,"info_group").setMandatory(true);
  fld = form.addField("custpage_insurance_or_bbesp","text","Insurance or BBESP?",null,"info_group").setMandatory(true);
  fld = form.addField("custpage_contact_inspection","text","Who to contact after inspection?",null,"info_group").setMandatory(true);

  fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"info_group").setLayoutType('normal','startcol');
  fld = form.addField("custpage_so_notes","textarea","Sales Order Notes",null,"info_group");//Added on 03/06/2017
  fld = form.addField("custpage_or_notes","textarea","OR Notes",null,"info_group");
  //fld = form.addField("custpage_place_of_sale","select","Place of Sale","classification","info_group").setMandatory(true);//Added on 03/06/2017 classification

  fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery_group");
  fld.setDisplayType('disabled');
  fld.setMandatory(true);

  fld = form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery_group");
  //fld.setDefaultValue(soRec.getFieldValue("custbody82")); 

  fld = form.addField("custpage_delivery_instruction","multiselect","Delivery Instructions","customlist215","delivery_group");
  //fld.setDefaultValue(soRec.getFieldValue("custbody194"));

  fld = form.addField("custpage_delivery_date_notes","textarea","Delivery Date Notes",null,"delivery_group");
  //fld.setDefaultValue(soRec.getFieldValue("custbody150"));

  fld = form.addField("custpage_pickup_at_be","checkbox","Pickup at BE",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("custbody53"));

  fld = form.addField("custpage_pickup_location","select","Pickup Location","customlist334","delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("custbody_pickup_location"));

  /*      Country         */
  var  _country =getCountry();
  var  JSON_Country_Stringify =  JSON.stringify(_country);
  // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
  var JSON_Country_Parse = JSON.parse(JSON_Country_Stringify);
  // nlapiLogExecution("debug","Get Country Parse",JSON_Country_Parse);
  fld = form.addField("custpage_country","select","Country",null,"delivery_group").setLayoutType('normal','startcol');
  if(JSON_Country_Parse)
  {
    //fld.addSelectOption("","");

    for(var x=0; x < JSON_Country_Parse.length; x++)
    {
      fld.addSelectOption(JSON_Country_Parse[x].value,JSON_Country_Parse[x].text);
    }
  }
  fld.setDefaultValue(soRec.getFieldValue("shipcountry"));
  /*    END          */
  fld = form.addField("custpage_attention","text","Attention",null,"delivery_group");
  //fld.setDefaultValue("Brilliant Earth Showroom");
  fld.setDefaultValue(soRec.getFieldValue("shipattention"));

  fld = form.addField("custpage_addressee","text","Addressee",null,"delivery_group");
  //fld.setDefaultValue(soRec.getFieldValue("shipaddressee")); 
  if(soRec.getFieldValue("shipaddressee")=="Brilliant Earth Showroom")
  {
    var cust_name = soRec.getFieldText("entity");
    cust_name = cust_name.replace(/[0-9]/g,'');
    fld.setDefaultValue(cust_name);
  }
  else
  {
    fld.setDefaultValue(soRec.getFieldValue("shipaddressee"));
  }

  fld = form.addField("custpage_address_1","text","Address Line 1",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("shipaddr1"));
  fld = form.addField("custpage_address_2","text","Address Line 2",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("shipaddr2"));
  fld = form.addField("custpage_city","text","City",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("shipcity"));
  // fld = form.addField("custpage_state","text","State",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("shipstate"));
  /*         STATE        */
  var  _state =getState();
  var  JSON_State_Stringify =  JSON.stringify(_state);
  //nlapiLogExecution("debug","Get State Stringify",JSON_State_Stringify);
  var JSON_State_Parse = JSON.parse(JSON_State_Stringify);
  // nlapiLogExecution("debug","Get State Parse",JSON_State_Parse);
  fld = form.addField("custpage_state","select","State",null,"delivery_group");
  //nlapiLogExecution("debug","json length",JSON_State_Parse.length);
  if(JSON_State_Parse)
  {
    //fld.addSelectOption("","");
    for(var x=0; x < JSON_State_Parse.length; x++)
    {
      fld.addSelectOption(JSON_State_Parse[x].value,JSON_State_Parse[x].text);
    }
  }
  fld.setDefaultValue(soRec.getFieldValue("shipstate"));

  /*  END   */

  form.addField("custpage_state_new","text","State",null,"delivery_group");//.setDisplayType('hidden');
  fld = form.addField("custpage_zip","text","Zip Code",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("shipzip"));

  form.addField("custpage_country_hidden","text","CountryText",null,"delivery_group").setDisplayType("hidden");//Added by Ravi

  fld = form.addField("custpage_return_label_status","select","Return Label Status","customlist126","delivery_group").setMandatory(true).setLayoutType('normal','startcol');
  //fld.RemoveSelectOption('Website Generated Label','6');

  fld = form.addField("custpage_date_received_at_be","date","Date Received at BE from Customer",null,"delivery_group");

  //Changed from customlist338 to customlist344
  fld = form.addField("custpage_location_received_at_be","multiselect","Location Received at BE from Customer","customlist344","delivery_group");
  //fld.setMandatory(true);

  var sublist = form.addSubList('custpage_items', 'inlineeditor', 'Items Returning For Repair');
  sublist.addField('sublist_shipping_to_be','checkbox', 'Shipping to BE');
  sublist.addField('sublist_item','select', 'ITEM','item');//.setMandatory(true);
  sublist.addField('sublist_desc','textarea', 'DESCRIPTION');
  sublist.addField('sublist_amt','currency', 'AMOUNT').setDefaultValue('0');
  sublist.addField('sublist_sale_amount','currency', 'SALE AMOUNT');//.setMandatory(true);;
  sublist.addField('sublist_qty','integer', 'QUANTITY');//.setMandatory(true);
  sublist.addField('sublist_production_ins_value','currency', 'PRODUCTION INSURANCE VALUE');//.setMandatory(true);
  // sublist.addField('sublist_item_link','select', 'Item SKU','item');
  sublist.addField('sublist_item_link','text', 'Item SKU');//.setDisplayType('inline');
  sublist.addField('sublist_created_from','select','CREATED FROM','transaction') ;
  sublist.addField('sublist_center_stone_link','select','Center Stone SKU','item');
  sublist.addField('sublist_related_sales_order','select','Related Sales Order(s)','transaction') ;
  sublist.addField('sublist_created_from_disable','checkbox','Created From Disable').setDisplayType('hidden');
  sublist.addField('sublist_chk_be','checkbox','Check BE').setDisplayType('hidden');
  sublist.addField('sublist_item_type','text', 'Item Type').setDisplayType('hidden');
  var itemArr=SO_Data_Repair(soRec);
  nlapiLogExecution("debug","item array",JSON.stringify(itemArr));
  sublist.setLineItemValues(itemArr);

  fld = form.addField("custpage_order_num","text","Order Numbers");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getFieldValue("tranid"));

  fld = form.addField("custpage_order_id","text","Order ID");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getId());

  fld =form.addField('custpage_repair_id','text').setDisplayType('hidden').setDefaultValue('1');


  form.addField('custpage_hide_tbl', 'inlinehtml').setDefaultValue("<style type='text/css'>  #inpt_custpage_return_label_status8{background-color:#fce0d6 !important;}  #inpt_custpage_drop_off1{background-color:#fce0d6 !important;} #inpt_custpage_place_of_sale3{background-color:#fce0d6 !important;} #sublist_production_ins_value_formattedValue{background-color:#fce0d6 !important;} #sublist_qty_formattedValue{background-color:#fce0d6 !important;}#custpage_delivery_date{background-color:#fce0d6 !important;} #sublist_sale_amount_formattedValue{background-color:#fce0d6 !important;}#custpage_customers_reported_repair_issue{background-color:#fce0d6 !important;}  #custpage_wear_habits{background-color:#fce0d6 !important;}  #custpage_notice_issue{background-color:#fce0d6 !important;}  #custpage_customer_temp{background-color:#fce0d6 !important;}  #custpage_insurance_or_bbesp{background-color:#fce0d6 !important;}  #custpage_contact_inspection{background-color:#fce0d6 !important;}  #inpt_custpage_place_of_sale2{background-color:#fce0d6 !important;} #custpage_customer_display{background-color:#fce0d6 !important;}</style>");
//#custpage_items_sublist_center_stone_link_display{background-color:#fce0d6 !important;} #custpage_items_sublist_related_sales_order_display{background-color:#fce0d6 !important;}
  response.writePage(form);

}