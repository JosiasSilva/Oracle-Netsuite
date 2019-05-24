function Resize_Landing_Page(soRec,soId)
{

  var form = nlapiCreateForm('New Resize Order');
  form.addSubmitButton('Save');
  //var postSaleType ='2';
  var backDataUrl_InitialPage =  backDataUrlInitialPage(soId);
  nlapiLogExecution("Debug","Back Data Url for Resize Landing Page ",backDataUrl_InitialPage);
  form.addButton('custpage_back_btn_repair','Back',backDataUrl_InitialPage);
  //form.addButton('custpage_back', 'Back', "window.history.go(-1);");
  form.addButton('custpage_close', 'Close', "window.close();" );
  form.addFieldGroup("info_group","Order Information");
  form.addFieldGroup("item_group","Item Returing For Resize");
  form.addFieldGroup("delivery_group","Delivery/Shipping");
  form.setScript('customscript_postsale_resize');
  //form.addButton('custpage_refresh', 'Refresh', "pageRefresh()" );
  var fld = form.addField("custpage_customer","select","Customer Name","customer","info_group");
  fld.setMandatory(true);
  fld.setDefaultValue(soRec.getFieldValue("entity"));
  fld.setDisplayType('disabled');

  fld = form.addField("custpage_actual_ship_date","date","Actual Ship Date",null,"info_group");
  fld.setDefaultValue(nlapiLookupField("salesorder",soId,"actualshipdate"));
  fld.setMandatory(true);
  fld.setDisplayType('inline');
  fld = form.addField("custpage_drop_off","select","drop off?",'customlist_drop_off',"info_group");
  /* Start: NS-1363 - Oct 08, 2018 - Nikhil */
  // fld.setMandatory(true);
  var ctx = nlapiGetContext();
  var dropOff = ctx.getSessionObject("dropOff");
  fld.setDefaultValue(dropOff);
  fld.setDisplayType('disabled');
  
  /* End: NS-1363 - Oct 08, 2018 - Nikhil */

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
  
  // fld = form.addField("custpage_rep_in_comm", "select", "Rep in Comm", "employee", "info_group").setDefaultValue(nlapiGetUser()); // Added: NS-1363 - Oct 08, 2018 - Nikhil
  
  /* Start: Added by Nikhil on December 13, 2018 for NS-1363 */
  fld = form.addField("custpage_rep_in_comm", "select", "Rep in Comm", "employee", "info_group"); // Added: NS-1363 - Oct 08, 2018 - Nikhil
  if(nlapiLookupField('employee', nlapiGetUser(), 'issalesrep') == 'T')
  {
	fld.setDefaultValue(nlapiGetUser()); // Added: NS-1363 - Oct 08, 2018 - Nikhil
  }
  else
  {
	fld.setDefaultValue(7820); // Set the Customer Support in the field. Employee Id - 7820
  }
  /* End: Added by Nikhil on December 13, 2018 for NS-1363 */

  fld = form.addField("custpage_or_notes","textarea","or notes",null,"info_group");
  var or_notes = nlapiLookupField('salesorder',soId,'custbody254');
  fld.setDefaultValue(or_notes);

  fld = form.addField("custpage_has_resize","checkbox","Has Another Resize Order?",null,"info_group");
  fld.setDisplayType("inline");
  var filters = [];
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  filters.push(new nlobjSearchFilter("entity",null,"is",soRec.getFieldValue("entity")));
  filters.push(new nlobjSearchFilter("custbody87",null,"anyof",2));
  var results = nlapiSearchRecord("salesorder",null,filters);
  if(results)
    fld.setDefaultValue("T");
  else
    fld.setDefaultValue("F");

  fld = form.addField("custpage_block_auto_emails","checkbox","Block Auto Emails",null,"info_group");
  fld = form.addField("custpage_so_notes","textarea","Sales Order Notes",null,"info_group");//Added on 03/06/2017
  //fld = form.addField("custpage_place_of_sale","select","Place of Sale","classification","info_group").setMandatory(true);//Added on 03/06/2017
  fld = form.addField("custpage_place_of_sale","select","Place of Sale","null","info_group").setMandatory(true);//Added on 03/06/2017
  var column =new Array();
  column.push(new nlobjSearchColumn('name'));
  column.push(new nlobjSearchColumn('internalid').setSort());//by default ascending order
  var filter =new Array();
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

  fld = form.addField("custpage_delivery_date","date","Delivery Date",null,"delivery_group");
  fld.setDisplayType('disabled');
  fld.setMandatory(true);

  fld = form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("custbody82"));

  fld = form.addField("custpage_delivery_instruction","multiselect","delivery instructions",'customlist215',"delivery_group");
  //fld.setDefaultValue(soRec.getFieldValue("custbody194"));

  fld = form.addField("custpage_delivery_date_notes","textarea","delivery date notes",null,"delivery_group");

  fld = form.addField("custpage_pickup_at_be","checkbox","Pickup at BE",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("custbody53")); // Commented by Nikhil on December 13, 2018 for NS-1363

  fld = form.addField("custpage_pickup_location","select","Pickup Location","customlist334","delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("custbody_pickup_location")); // Commented by Nikhil on December 13, 2018 for NS-1363
  
  /* Start: Aded by Nikhil on November 12, 2018 for NS-1363 */
  
  var field_shipTo = form.addField("custpage_ship_to_select", "select", "Ship To Select", null, "delivery_group");
  field_shipTo.addSelectOption('-1', '', true);
  var arr_shipToOptions = ShipToSelect(soRec.getFieldValue("entity"));
  if(arr_shipToOptions && arr_shipToOptions.length > 0)
  {
	for( var x =0; x < arr_shipToOptions.length; x++)
	{
		field_shipTo.addSelectOption(arr_shipToOptions[x].id, arr_shipToOptions[x].text, false);
	}
  }
  
  /* End: Added by Nikhil on November 12, 2018 for NS-1363 */
  
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
  // fld.setDefaultValue(soRec.getFieldValue("shipcountry")); // Commenting per NS-1363 on October 29, 2018 - Nikhil
  form.addField("custpage_country_hidden","text","CountryText",null,"delivery_group").setDisplayType("hidden");//Added by Ravi

  fld = form.addField("custpage_attention","text","Attention",null,"delivery_group");
  //fld.setDefaultValue("Brilliant Earth Showroom");
  // fld.setDefaultValue(soRec.getFieldValue("shipattention")); // Commenting per NS-1363 on October 29, 2018 - Nikhil

  fld = form.addField("custpage_addressee","text","Addressee",null,"delivery_group").setMandatory(true); // .setMandatory(true); added on January 17, 2019 for NS-1363
  //fld.setDefaultValue(soRec.getFieldValue("shipaddressee"));
  if(soRec.getFieldValue("shipaddressee")=="Brilliant Earth Showroom")
  {
    var cust_name = soRec.getFieldText("entity");
    cust_name = cust_name.replace(/[0-9]/g,'');
    // fld.setDefaultValue(cust_name); // Commenting per NS-1363 on October 29, 2018 - Nikhil
  }
  else
  {
    // fld.setDefaultValue(soRec.getFieldValue("shipaddressee"));// Commenting per NS-1363 on October 29, 2018 - Nikhil
  }
  fld = form.addField("custpage_address_1","text","Address Line 1",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("shipaddr1")); // Commenting per NS-1363 on October 29, 2018 - Nikhil
  fld = form.addField("custpage_address_2","text","Address Line 2",null,"delivery_group");
  fld.setDefaultValue(soRec.getFieldValue("shipaddr2")); // Commenting per NS-1363 on October 29, 2018 - Nikhil
  fld = form.addField("custpage_city","text","City",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("shipcity")); // Commenting per NS-1363 on October 29, 2018 - Nikhil

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
  // fld.setDefaultValue(soRec.getFieldValue("shipstate")); // Commenting per NS-1363 on October 29, 2018 - Nikhil
  form.addField("custpage_state_new","text","State",null,"delivery_group");
  fld = form.addField("custpage_zip","text","Zip Code",null,"delivery_group");
  // fld.setDefaultValue(soRec.getFieldValue("shipzip")); // Commenting per NS-1363 on October 29, 2018 - Nikhil

  fld = form.addField("custpage_return_label_status","select","Return Label Status","customlist126","delivery_group");
  fld.setMandatory(true).setLayoutType('normal','startcol');;

 /* Start: Edited by Nikhil on October 12, 2018 for NS-1363 */
  var fld_dateReceivedAtBe = form.addField("custpage_date_received_at_be","date","Date Received at BE from Customer",null,"delivery_group"); // Edited by Nikhil on October 29, 2018 for NS-1363
  //Changed from customlist338 to customlist344
  var fld_locationReceivedAtBe = form.addField("custpage_location_received_at_be","multiselect","Location Received at BE from Customer","customlist344","delivery_group"); // Edited by Nikhil on October 29, 2018 for NS-1363
  //fld.setMandatory(true);
  /* End: Edited by Nikhil on October 12, 2018 for NS-1363 */
  
  /* Start: NS-1363 - Oct 08, 2018 - Nikhil */
  var ctx = nlapiGetContext();
  var dropOff = ctx.getSessionObject("dropOff");
  
  if(dropOff == '1') // 1 - Yes & 2 = No
  {
	fld_dateReceivedAtBe.setMandatory(true);
	fld_locationReceivedAtBe.setMandatory(true);
  }
  else if(dropOff == '2')
  {
	fld_dateReceivedAtBe.setDisplayType('disabled');
	fld_locationReceivedAtBe.setDisplayType('disabled');
  }
  /* End: NS-1363 - Oct 08, 2018 - Nikhil */
	
  //Status of International Taxes
  fld = form.addField("custpage_status_of_international_taxes","select","Status of International Taxes",null,"delivery_group");
  fld.addSelectOption("1","Ops to confirm taxes",false);
  fld.addSelectOption("2","Customer contacted - waiting for reply",false);
  fld.addSelectOption("3","Customer approved - send documents",false);
  fld.addSelectOption("4","Customer rejected",false);
  fld.addSelectOption("5","N/A",true);
  
  // fld.setDefaultValue("5");
  // fld.setDisplayType("inline");
  
  /* Commenting on Nov 6, 2018 based on comments received on NS-1363 Dated: November 05, 2018
  var addressObj = ctx.getSessionObject("addressObj");
  if(addressObj!=null && addressObj!="")
  {
  	addressObj = JSON.parse(addressObj);
	
	nlapiLogExecution("debug","AddressObj.country: " + addressObj.country,"SO Country: " + soRec.getFieldValue("shipcountry"));
	
  	if(addressObj.country != soRec.getFieldValue("shipcountry"))
		fld.setDefaultValue("1");
  }
  */
  
  fld = form.addField("custpage_add_shipping_fee","checkbox","Add $50 Shipping Fee");
  fld.setDisplayType("hidden");

  var sublist = form.addSubList('custpage_items', 'inlineeditor', 'Items Returning For Resize');
  sublist.addField('sublist_shipping_to_be','checkbox', 'Shipping to BE');
  sublist.addField('sublist_item','select', 'ITEM','item');//.setMandatory(true);
  sublist.addField('sublist_desc','textarea', 'DESCRIPTION');
  sublist.addField('sublist_new_size','text', 'NEW SIZE');//.setMandatory(true);
  sublist.addField('sublist_amt','currency', 'AMOUNT').setDefaultValue('0');
  sublist.addField('sublist_sale_amount','currency', 'SALE AMOUNT');//.setMandatory(true);
  sublist.addField('sublist_qty','integer', 'QUANTITY');//.setMandatory(true);
  sublist.addField('sublist_production_ins_value','currency', 'PRODUCTION INSURANCE VALUE');//.setMandatory(true);
  //sublist.addField('sublist_item_link','select', 'Item SKU','item');
  sublist.addField('sublist_item_link','text', 'Item SKU');  
  sublist.addField('sublist_created_from','select','CREATED FROM','transaction') ;
  sublist.addField('sublist_center_stone_link','select','Center Stone SKU','item');
  sublist.addField('sublist_related_sales_order','select','Related Sales Order(s)','transaction') ;
  sublist.addField('sublist_chk_be','checkbox','Check BE').setDisplayType('hidden');
  sublist.addField('sublist_created_from_disable','checkbox','Created From Disable').setDisplayType('hidden');
  sublist.addField('sublist_item_type','text', 'Item Type').setDisplayType('hidden');
  //sublist.addField('sublist_item_id','text','Item Id').setDisplayType('hidden');
  //sublist.addField('sublist_center_stone_link_amount','currency','Center Stone Link Amount').setDisplayType('hidden');
  var itemArr=SO_Data_Resize(soRec);
  nlapiLogExecution("debug","item array",JSON.stringify(itemArr));
  sublist.setLineItemValues(itemArr);

  fld =form.addField('custpage_resize_id','text').setDisplayType('hidden').setDefaultValue('2');
  fld = form.addField("custpage_order_num","text","Order Numbers");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getFieldValue("tranid"));

  fld = form.addField("custpage_order_id","text","Order ID");
  fld.setDisplayType("hidden");
  fld.setDefaultValue(soRec.getId());
  
  form.addField('custpage_req_fields_background_color', 'inlinehtml').setDefaultValue("<style type='text/css'>  #custpage_customer_display{background-color:#fce0d6 !important;}  #inpt_custpage_drop_off1{background-color:#fce0d6 !important;} #inpt_custpage_place_of_sale3{background-color:#fce0d6 !important;}#custpage_delivery_date{background-color:#fce0d6 !important;} #inpt_custpage_return_label_status8{background-color:#fce0d6 !important;} #sublist_new_size{background-color:#fce0d6 !important;} #sublist_qty_formattedValue{background-color:#fce0d6 !important;}#sublist_production_ins_value_formattedValue{background-color:#fce0d6 !important;}#sublist_sale_amount_formattedValue{background-color:#fce0d6 !important;}</style>");
//#custpage_items_sublist_center_stone_link_display{background-color:#fce0d6 !important;}#custpage_items_sublist_related_sales_order_display{background-color:#fce0d6 !important;}
  response.writePage(form);
}
/* Start: Added by Nikhil on October 15, 2018 for NS-1363 */
function outsideResizePolicy(soRec)
{
	if(nlapiAddDays(nlapiStringToDate(soRec.getValue('shipdate')), 60) >= new Date())
	{
		return false;
	}
	else
	{
		return true;
	}
}
/* End: Added by Nikhil on October 15, 2018 for NS-1363 */