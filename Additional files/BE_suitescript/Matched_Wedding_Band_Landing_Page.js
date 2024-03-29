function Matched_Wedding_Band_Landing_Page(soRec,soId)
{

  var form = nlapiCreateForm('New Matched Wedding Band');
  form.addSubmitButton('Save'); 
  // form.addButton('custpage_back', 'Back', "window.history.go(-1);");
  var backDataUrl_InitialPage =  backDataUrlInitialPage(soId);
  nlapiLogExecution("Debug","Back Data Url for Matched & Wedding band Landing Page ",backDataUrl_InitialPage);
  form.addButton('custpage_back_btn_repair','Back',backDataUrl_InitialPage);
  form.addButton('custpage_close', 'Close', "window.close();" );
  //form.addButton('custpage_refresh', 'Refresh', "pageRefresh()" );
  form.addFieldGroup("orderinfo","Order Information");
  form.addFieldGroup("delivery","Delivery/Shipping");
  form.setScript('customscript_post_sale_matched_wb_client');
  // Order Information started
  var fld = form.addField("custpage_customer","select","Customer","customer","orderinfo");      
  fld.setDefaultValue(soRec.getFieldValue("entity"));
  fld.setDisplayType("disabled");

  fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"orderinfo");
  fld.setDefaultValue(nlapiLookupField("salesorder",soId,"actualshipdate"));
  fld.setDisplayType("disabled");

  fld = form.addField("custpage_drop_off","select","Drop Off",'customlist_drop_off',"orderinfo").setMandatory(true);

  fld = form.addField("custpage_sales_rep","select","Sales Rep","null","orderinfo");      
  //fld.setDisplayType("inline");
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

  fld = form.addField("custpage_or_notes","textarea","OR Notes",null,"orderinfo");

  fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"orderinfo");
  fld = form.addField("custpage_so_notes","textarea","Sales Order Notes",null,"orderinfo");//Added on 03/06/2017
  // fld = form.addField("custpage_place_of_sale","select","Place of Sale","classification","orderinfo").setMandatory(true);//Added on 03/06/2017
  fld = form.addField("custpage_place_of_sale","select","Place of Sale","null","orderinfo").setMandatory(true);//Added on 03/06/2017
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
  // Ended

  // Delivery/Shipping Started
  fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery");
  fld.setMandatory(true);
  fld.setDisplayType('disabled');

  fld=form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery");         
  //fld.setDefaultValue(soRec.getFieldValue("custbody82")); 

  fld = form.addField("custpage_delivery_instruction","multiselect","Delivery Instructions","customlist215","delivery");
  //fld.setDefaultValue(soRec.getFieldValue("custbody194"));

  fld = form.addField("custpage_delivery_date_notes","textarea","Delivery Date Notes",null,"delivery");
  //fld.setDefaultValue(soRec.getFieldValue("custbody150"));  

  fld = form.addField("custpage_pickup_at_be","checkbox","Pick-up at BE",null,"delivery");
  fld.setDefaultValue(soRec.getFieldValue("custbody53"));

  fld = form.addField("custpage_pickup_location","select","Pickup Location","customlist334","delivery");
  fld.setDefaultValue(soRec.getFieldValue("custbody_pickup_location"));

  fld = form.addField("custpage_country","select","Country",null,"delivery").setLayoutType('normal','startcol');
  var  _country =getCountry();
  var  JSON_Country_Stringify =  JSON.stringify(_country);           
  var JSON_Country_Parse = JSON.parse(JSON_Country_Stringify);       
  if(JSON_Country_Parse)
  {
    for(var x=0; x < JSON_Country_Parse.length; x++)
    {
      fld.addSelectOption(JSON_Country_Parse[x].value,JSON_Country_Parse[x].text);
    }
  }
  fld.setDefaultValue(soRec.getFieldValue("shipcountry"));
  form.addField("custpage_country_hidden","text","CountryText",null,"delivery").setDisplayType("hidden");//Added by Ravi

  fld = form.addField("custpage_attention","text","Attention",null,"delivery");
  //fld.setDefaultValue("Brilliant Earth Showroom");
  fld.setDefaultValue(soRec.getFieldValue("shipattention"));

  fld = form.addField("custpage_addressee","text","Addressee",null,"delivery");
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

  fld = form.addField("custpage_address_1","text","Address Line 1",null,"delivery");
  fld.setDefaultValue(soRec.getFieldValue("shipaddr1"));
  fld = form.addField("custpage_address_2","text","Address Line 2",null,"delivery");
  fld.setDefaultValue(soRec.getFieldValue("shipaddr2"));
  fld = form.addField("custpage_city","text","City",null,"delivery");
  fld.setDefaultValue(soRec.getFieldValue("shipcity"));

  var  _state =getState();
  var  JSON_State_Stringify =  JSON.stringify(_state);            
  var JSON_State_Parse = JSON.parse(JSON_State_Stringify);
  fld = form.addField("custpage_state","select","State",null,"delivery");
  if(JSON_State_Parse)
  {       
    for(var x=0; x < JSON_State_Parse.length; x++)
    {
      fld.addSelectOption(JSON_State_Parse[x].value,JSON_State_Parse[x].text);
    }
  }
  fld.setDefaultValue(soRec.getFieldValue("shipstate"));
  form.addField("custpage_state_new","text","State",null,"delivery");
  fld = form.addField("custpage_zip","text","Zip Code",null,"delivery");
  fld.setDefaultValue(soRec.getFieldValue("shipzip"));


  fld = form.addField("custpage_return_label_status","select","Return Label Status","customlist126","delivery").setMandatory(true).setLayoutType('normal','startcol');
  //if(soRec.getFieldValue("custbody137")!=null && soRec.getFieldValue("custbody137")!="")
  //  fld.setDefaultValue(soRec.getFieldValue("custbody137"));    

  fld=form.addField("custpage_date_received_at_be","date","Date Received at BE from Customer",null,"delivery");
  fld = form.addField("custpage_location_received_at_be","multiselect","Location Received at BE from Customer","customlist344","delivery");
  fld =form.addField('custpage_matched_wedding_band_id','text').setDisplayType('hidden').setDefaultValue('7');
  fld = form.addField("custpage_order_num","text","Order Numbers");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getFieldValue("tranid"));

  fld = form.addField("custpage_order_id","text","Order ID");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getId());
  // Ended

  form.addTab("custpage_matched_wedding_band_tab","");
  form.addSubTab("custpage_matched_wedding_band_subtab","").setLabel('Customer Item Shipping to BE');

  var sublist = form.addSubList('custpage_items', 'inlineeditor', 'Customer Item Shipping to BE','custpage_matched_wedding_band_subtab');
  sublist.addField('sublist_shipping_to_be','checkbox', 'Shipping to BE');
  sublist.addField('sublist_item','select', 'ITEM','item');//.setMandatory(true);
  sublist.addField('sublist_desc','textarea', 'DESCRIPTION');
  sublist.addField('sublist_amt','currency', 'AMOUNT').setDefaultValue('0');
  sublist.addField('sublist_sale_amount','currency', 'SALE AMOUNT');
  sublist.addField('sublist_qty','integer', 'QUANTITY');//.setMandatory(true);
  sublist.addField('sublist_production_ins_value','currency', 'PRODUCTION INSURANCE VALUE');//.setMandatory(true);
  //sublist.addField('sublist_item_link','select', 'Item Link','item');
  sublist.addField('sublist_item_link','text', 'Item Link');
  sublist.addField('sublist_created_from','select','CREATED FROM','transaction') ;
  sublist.addField('sublist_center_stone_link','select','Center Stone SKU','item');
  sublist.addField('sublist_related_sales_order','select','Related Sales Order(s)','transaction') ;
  sublist.addField('sublist_chk_be','checkbox','Check BE').setDisplayType('hidden');
  sublist.addField('sublist_created_from_disable','checkbox','created from disable').setDisplayType('hidden');
  sublist.addField('sublist_item_type','text','Item Type').setDisplayType('hidden');
  itemArr=SO_Data_Matched_Wedding_Band(soRec);
  nlapiLogExecution("debug","item array",JSON.stringify(itemArr));
  sublist.setLineItemValues(itemArr);
  //Ended

  //New Items Order Started
  var itemList1 = form.addSubList("custpage_new_items","inlineeditor","New Item(s) Ordered",'custpage_matched_wedding_band_tab');
  fld = itemList1.addField("custpage_new_items_item","select","Item","item");
  fld.setMandatory(true);
  itemList1.addField("custpage_new_items_desc","text","Description");
  fld = itemList1.addField("custpage_new_items_qty","integer","Quantity");
  fld.setMandatory(true);
  fld = itemList1.addField("custpage_new_items_rate","currency","Rate");
  fld.setMandatory(true);
  itemList1.addField("custpage_new_items_amount","currency","Amount");
  itemList1.addField("custpage_new_items_production_insurance_value","currency","Production Insurance Value").setDisplayType('hidden');
  itemList1.addField("custpage_center_stone_sku","select","CENTER STONE SKU",'item');
  //fld.setMandatory(true);
  //Ended

     form.addField('custpage_req_fields_background_color', 'inlinehtml').setDefaultValue("<style type='text/css'>  #custpage_customer_display{background-color:#fce0d6 !important;}  #inpt_custpage_drop_off1{background-color:#fce0d6 !important;} #inpt_custpage_place_of_sale3{background-color:#fce0d6 !important;}#custpage_delivery_date{background-color:#fce0d6 !important;} #inpt_custpage_return_label_status8{background-color:#fce0d6 !important;} #sublist_qty_formattedValue{background-color:#fce0d6 !important;}#sublist_production_ins_value_formattedValue{background-color:#fce0d6 !important;} #sublist_sale_amount_formattedValue{background-color:#fce0d6 !important;}#custpage_new_items_qty_formattedValue{background-color:#fce0d6 !important;}#custpage_new_items_rate_formattedValue{background-color:#fce0d6 !important;}#custpage_new_items_custpage_new_items_item_display{background-color:#fce0d6 !important;}</style>");
//#custpage_items_sublist_center_stone_link_display{background-color:#fce0d6 !important;}#custpage_items_sublist_related_sales_order_display{background-color:#fce0d6 !important;} 
  response.writePage(form);
}