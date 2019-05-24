function Exchange_Landing_Page(soRec,soId)
{
  var form = nlapiCreateForm('NEW EXCHANGE',false);
  form.addSubmitButton('Save');
  //form.addButton('custpage_back', 'Back', "window.history.go(-1);");
  var backDataUrl_InitialPage =  backDataUrlInitialPage(soId);
  nlapiLogExecution("Debug","Back Data Url for Exchange Landing Page ",backDataUrl_InitialPage);
  form.addButton('custpage_back_btn_repair','Back',backDataUrl_InitialPage);
  form.addButton('custpage_close', 'Close', "window.close();" );
  //form.addButton('custpage_refresh', 'Refresh', "pageRefresh()" );
  //form.setScript("customscript_exchange_page_client_script");
  //Create Field Groups
  form.addFieldGroup("exchange","Order Information");
  form.addFieldGroup("delivery","Delivery/Shipping");
  var exchange_NewItemOrdered_Tab = form.addTab('custpage_exchange_new_item_ordered_tab', '');
  var exchange_ItemReturningToBe_SubTab = form.addSubTab('custpage_exchange_item_returning_to_be_subtab','');
  exchange_ItemReturningToBe_SubTab.setLabel('Item Returning to BE');
  //Ended
  //Exchange Section Form Fields Started
  var fld = form.addField("custpage_customer","select","Customer","customer","exchange");
  fld.setMandatory(true);
  fld.setDefaultValue(soRec.getFieldValue("entity"));
  fld.setDisplayType('disabled');

  /*fld = form.addField("custpage_date","date","Date",null,"exchange").setDisplayType('hidden');
  fld.setMandatory(true);
  var today = new Date();
  fld.setDefaultValue(nlapiDateToString(today,"date"));*/

  fld = form.addField("custpage_so_num","text","Sales Order Number");
  fld.setDefaultValue(soRec.getFieldValue("tranid"));
  fld.setDisplayType("hidden");

  fld = form.addField("custpage_order_id","text","Order ID");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getId());

  fld = form.addField("custpage_so_total","currency","Sales Order Total");
  fld.setDefaultValue(soRec.getFieldValue("total"));
  fld.setDisplayType("hidden");

  fld = form.addField("custpage_created_from","select","Created From","salesorder","exchange");
  fld.setMandatory(true);
  fld.setDisplayType("inline");
  fld.setDefaultValue(soId);

  /* fld = form.addField("custpage_orig_sales_rep","select","Original Sales Rep","employee","exchange");
  fld.setMandatory(true);
  //fld.setDisplayType("inline");
  fld.setDefaultValue(soRec.getFieldValue("salesrep"));
  */
 /* var filters = [];
  filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
  filters.push(new nlobjSearchFilter("salesrep",null,"is","T"));
  var cols = [];
  cols.push(new nlobjSearchColumn("entityid"));
  var results = nlapiSearchRecord("employee",null,filters,cols);
  //Original Sale rep
  fld = form.addField("custpage_orig_sales_rep","select","Original Sales Rep",null,"exchange");
  if(results)
  {
    fld.addSelectOption("","");
    for(var x=0; x < results.length; x++)
    {
      fld.addSelectOption(results[x].getId(),results[x].getValue("entityid"));
    }
  }
  fld.setMandatory(true);
  //fld.setDisplayType("inline");
  fld.setDefaultValue(soRec.getFieldValue("salesrep"));*/
  //New Sale rep
  /* fld = form.addField("custpage_new_sales_rep","select","Rep in Communication",null,"exchange").setDisplayType('hidden');
  if(results)
  {
    fld.addSelectOption("","");
    for(var x=0; x < results.length; x++)
    {
      fld.addSelectOption(results[x].getId(),results[x].getValue("entityid"));
    }
  }
  //fld.setMandatory(true);
  //fld.setDefaultValue(nlapiGetUser());
  fld.setDefaultValue(soRec.getFieldValue("salesrep"));
  */
  fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"exchange");
  fld.setMandatory(true);
  fld.setDefaultValue(nlapiLookupField("salesorder",soId,"actualshipdate"));
  fld.setDisplayType("disabled");     

  fld = form.addField("custpage_so_imp_notes","textarea","Original Sales Order Notes",null,"exchange");
  fld.setDefaultValue(soRec.getFieldValue("custbody58"));
  fld.setDisplayType("disabled");

  fld = form.addField("custpage_reason_for_return","select","Reason For Return","customlist21","exchange");
  fld.setMandatory(true);

  fld = form.addField("custpage_type_of_send_back","select","Type of Send Back","customlist22","exchange");
  fld.setMandatory(true);
  fld.setDefaultValue("6"); //Default to EXCHANGE

  //Added by Ravi on 03/04/2017
  fld = form.addField("custpage_or_notes","textarea","OR Notes",null,"exchange");     
  //Ended

  //Added by Sandeep - NS-593
  fld = form.addField("custpage_drop_off","select","Drop Off",'customlist_drop_off',"exchange");
  fld.setMandatory(true);
  //Ended

  fld = form.addField("custpage_exchange_notes","longtext","Exchange Order Notes",null,"exchange");
  fld.setMandatory(true);

  //form.addField("custpage_place_of_sale","select","Place of Sale","classification","exchange").setMandatory(true);
  fld = form.addField("custpage_place_of_sale","select","Place of Sale","null","exchange").setMandatory(true);//Added on 03/06/2017
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
  //fld.setMandatory(true);
  //fld.setDefaultValue(2); //Phone: Not Bank Wire
  //fld.setDisplayType("disabled");

  fld = form.addField("custpage_amount_paid","float","Amount Paid By Customer",null,"exchange").setDisplayType("hidden");;
  fld.setMandatory(true);
  //fld.setDefaultValue(nlapiLookupField("salesorder",sales_order,"custbody55"));

  fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"exchange");
  //Exchange Ended

  //Delivery/Shipping Section Form Fields Started
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

  var  _country =getCountry();
  var  JSON_Country_Stringify =  JSON.stringify(_country);
  // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
  var JSON_Country_Parse = JSON.parse(JSON_Country_Stringify);
  // nlapiLogExecution("debug","Get Country Parse",JSON_Country_Parse);
  fld = form.addField("custpage_country","select","Country",null,"delivery").setLayoutType('normal','startcol');
  if(JSON_Country_Parse)
  {
    //fld.addSelectOption("","");
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

  fld = form.addField("custpage_return_label_status","select","Return Shipping Label","customlist126","delivery").setLayoutType('normal','startcol');
  //if(soRec.getFieldValue("custbody138")!=null && soRec.getFieldValue("custbody138")!="")
  // fld.setDefaultValue(soRec.getFieldValue("custbody138"));
  fld.setMandatory(true);

  form.addField("custpage_date_received_at_be","date","Date Received at BE from Customer",null,"delivery");

  //Changed from customlist338 to customlist344
  fld = form.addField("custpage_location_received_at_be","multiselect","Location Received at BE from Customer","customlist344","delivery");
  //fld.setMandatory(true);

  //Delivery Ended

  //Items Returning Started
  var itemList = form.addSubList("custpage_items_returning","inlineeditor","Item returning to BE","custpage_exchange_item_returning_to_be_subtab");

  fld = itemList.addField("custpage_items_returning_check","select",'Choose Option');
  /*fld.addSelectOption('','');
      fld.addSelectOption('1','Returning for Credit');
      fld.addSelectOption('2','Customer Item Shipping to BE');*/
  fld.addSelectOption('','');
  fld.addSelectOption('1','Return');
  fld.addSelectOption('2','Exchange');
  fld.addSelectOption('3','Resize');
  fld.addSelectOption('4','Repair');
  fld.addSelectOption('5','Customer Item');
  fld.addSelectOption('6','Not Sending');

  fld = itemList.addField("custpage_items_returning_item","select","Item","item");
  //fld.setMandatory(true);
  itemList.addField("custpage_items_returning_qty","integer","Quantity");  
  itemList.addField("custpage_items_returning_units","integer","Units");  
  itemList.addField("custpage_items_returning_desc","textarea","Description");
  itemList.addField("custpage_items_returning_unit_price","currency","Sale Unit Price");     
  itemList.addField("custpage_items_returning_amount","currency","Amount").setDefaultValue('0'); //Added by Ravi on 04/05/2017
  itemList.addField("custpage_items_returning_sale_amount","currency","Sale Amount");
  itemList.addField('custpage_items_returning_production_ins_value','currency', 'PRODUCTION INSURANCE VALUE');//.setMandatory(true);
  itemList.addField('custpage_items_returning_item_link','text', 'Item SKU'); 
  itemList.addField('custpage_items_returning_created_from','select','CREATED FROM','transaction');
  itemList.addField("custpage_items_returning_center_stone_sku","select","Center Stone SKU","item");
  itemList.addField('custpage_items_returning_related_sales_order','select','Related Sales Order(s)','transaction') ;
  itemList.addField('custpage_items_returning_created_from_disable','checkbox', 'Created From Disable').setDisplayType('hidden'); 
  itemList.addField('custpage_items_returning_item_type','text', 'Item Type').setDisplayType('hidden'); 
  var itemArr=SO_itemreturn_exchange(soRec);
  nlapiLogExecution("debug","item array",JSON.stringify(itemArr));
  itemList.setLineItemValues(itemArr);  
  //Ended

  //New Items Order Started
  var itemList1 = form.addSubList("custpage_new_items","inlineeditor","New Item(s) Ordered","custpage_exchange_new_item_ordered_tab");
  fld = itemList1.addField("custpage_new_items_item","select","Item","item");
  fld.setMandatory(true);
  itemList1.addField("custpage_new_items_desc","textarea","Description");
  fld = itemList1.addField("custpage_new_items_qty","integer","Quantity");
  fld.setMandatory(true);
  fld = itemList1.addField("custpage_new_items_rate","currency","Rate");
  fld.setMandatory(true);
  itemList1.addField("custpage_new_items_amount","currency","Amount");
  itemList1.addField("custpage_new_items_center_stone_sku","select","Center Stone SKU","item");
  itemList1.addField("custpage_new_items_production_insurance_value","currency","Production Insurance Value").setDisplayType('hidden');
  //fld.setMandatory(true);
  //Ended
  fld = form.addField("custpage_rma","select","Return Authorization","returnauthorization");
  fld.setDisplayType("hidden");
  if(request.getParameter("rma")!=null && request.getParameter("rma")!="")
    fld.setDefaultValue(request.getParameter("rma"));     
  fld =form.addField('custpage_exchange_id','text').setDisplayType('hidden').setDefaultValue('3');
  form.setScript("customscript_postsale_exchange_client");

  
  
   form.addField('custpage_req_fields_background_color', 'inlinehtml').setDefaultValue("<style type='text/css'>  #custpage_customer_display{background-color:#fce0d6 !important;}  #inpt_custpage_orig_sales_rep1{background-color:#fce0d6 !important;} #custpage_actual_ship_date{background-color:#fce0d6 !important;}#inpt_custpage_reason_for_return2{background-color:#fce0d6 !important;} #inpt_custpage_type_of_send_back3{background-color:#fce0d6 !important;} #inpt_custpage_drop_off4{background-color:#fce0d6 !important;}#custpage_exchange_notes{background-color:#fce0d6 !important;} #inpt_custpage_place_of_sale5{background-color:#fce0d6 !important;}#custpage_delivery_date{background-color:#fce0d6 !important;} #inpt_custpage_return_label_status10{background-color:#fce0d6 !important;}#custpage_new_items_qty_formattedValue{background-color:#fce0d6 !important;}#custpage_new_items_rate_formattedValue{background-color:#fce0d6 !important;}#custpage_new_items_custpage_new_items_item_display{background-color:#fce0d6 !important;} #inpt_custpage_reason_for_return1{background-color:#fce0d6 !important;} #inpt_custpage_type_of_send_back2{background-color:#fce0d6 !important;}#inpt_custpage_drop_off3{background-color:#fce0d6 !important;}#inpt_custpage_place_of_sale4{background-color:#fce0d6 !important;}#inpt_custpage_return_label_status9{background-color:#fce0d6 !important;}</style>");
  //#custpage_items_returning_qty_formattedValue{background-color:#fce0d6 !important;}#custpage_items_returning_unit_price_formattedValue{background-color:#fce0d6 !important;}#custpage_items_returning_sale_amount_formattedValue{background-color:#fce0d6 !important;}#custpage_items_returning_production_ins_value_formattedValue{background-color:#fce0d6 !important;}
//#custpage_items_returning_custpage_items_returning_center_stone_sku_display{background-color:#fce0d6 !important;}#custpage_items_returning_custpage_items_returning_related_sales_order_display{background-color:#fce0d6 !important;}
  //response.sendNoCache();
  //
  response.writePage(form);
  //response.setHeader("Custom-Header-Cache-Control", "no-cache, no-store, must-revalidate");
  //response.setHeader("Custom-Header-Pragma", "no-cache");
  //response.setHeader("Custom-Header-Expires", "0");
}