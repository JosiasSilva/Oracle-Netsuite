nlapiLogExecution("audit","FLOStart",new Date().getTime());
var SOOBJ ='';
var billcountry = null;
var shipcountry = null;
function Page_Init_Fun(type)
{
  
  lockaddress_PI(type); // Added by Nikhil on October 15, 2018 - NS-1363
  /* Start: Added by Nikhil on October 15, 2018 for NS-1363 */
  
  if(nlapiGetFieldValue('custpage_pickup_location'))
  {
	nlapiSetFieldValue('custpage_pickup_location', nlapiGetFieldValue('custpage_pickup_location'));
  }
  
  if(nlapiGetFieldValue('custpage_drop_off')=='1')
    {
      nlapiRemoveSelectOption('custpage_return_label_status',null) ;
      var col = new Array();
      col.push(new nlobjSearchColumn('name')); 
      col.push(new nlobjSearchColumn('internalid').setSort(false)); 
      var results = nlapiSearchRecord('customlist126', null, null, col);
      nlapiInsertSelectOption('custpage_return_label_status' ,'','');
      nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -');
      for(var i=0; i<results.length;i++)
      {
        if(results[i].getId() == '4')
          nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),true);
        else
          nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
      }
      nlapiSetFieldValue('custpage_date_received_at_be',nlapiDateToString(new Date()));
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '2' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '3' );
	  nlapiRemoveSelectOption( 'custpage_return_label_status' , '5' ); // Adding on January 22, 2019 as per new comments on NS-1363
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '6' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
	  /* Start: Commenting below code on October 26, 2018 - Nikhil*/
      /*
	  if(shipcountry !='US')
      {
        nlapiRemoveSelectOption('custpage_return_label_status' , '5');
      }
	  */
	  /* End: Commenting below code on October 26, 2018 - Nikhil*/
	  /* Start: Added by Nikhil on October 25, 2018 for NS-1363 */
	  var fld_return_lbl = nlapiGetField('custpage_return_label_status');
	  fld_return_lbl.setDisplayType('disabled');
    }
    else
    {
      nlapiRemoveSelectOption('custpage_return_label_status',null) ;
      var col = new Array();
      col.push(new nlobjSearchColumn('name')); 
      col.push(new nlobjSearchColumn('internalid').setSort(false)); 
      var results = nlapiSearchRecord('customlist126', null, null, col);
      nlapiInsertSelectOption('custpage_return_label_status' ,'','',true);
      nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -',false);
      for(var i=0; i<results.length;i++)
      {
        nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
      }
      nlapiSetFieldValue('custpage_date_received_at_be','');
      nlapiSetFieldValue('custpage_location_received_at_be','');
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '2' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '3' );
	  nlapiRemoveSelectOption( 'custpage_return_label_status' , '5' ); // Adding on January 22, 2019 as per new comments on NS-1363
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '6' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
      /* Start: Commenting below code on October 26, 2018 - Nikhil*/
      /*
	  if(shipcountry !='US')
      {
        nlapiRemoveSelectOption('custpage_return_label_status' , '5');
      }
	  */
	  /* End: Commenting below code on October 26, 2018 - Nikhil*/
	  var setValue = nlapiGetFieldValue('custpage_return_label_status'); // Added on October 15, 2018 for NS-1363
	  if(setValue && setValue!= null && setValue != undefined)
	  {
		try
		{
			nlapiSetFieldValue('custpage_return_label_status', setValue);
		}
		catch(ex)
		{
			nlapiLogExecution('Debug', 'Exception setting Return Label Status', ex.message);
		}
	  }
    }
	
	/* End: Added on October 15, 2018 for NS-1363 by Nikhil*/
  	
  var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
  fld.setDisplayType('hidden');
  var soid = nlapiGetFieldValue('custpage_order_id');
  SOOBJ = nlapiLoadRecord('salesorder',soid);
  //Added by Ravi on 18/05/2017
  /*var ddfirm =   SOOBJ.getFieldValue('custbody82');
  if(ddfirm == 'T')
  {
    nlapiDisableField('custpage_delivery_date', false);
  }
  else
  {
    nlapiDisableField('custpage_delivery_date', true);
  }*/
  var so_setDeliveryDate =  SO_SetDeliveryDate();
  //nlapiSetFieldValue('custpage_delivery_date', so_setDeliveryDate);
  var chkHolidayPopup = false;
  so_setDeliveryDate = setDeliveryDate_by_Pickup_Location(so_setDeliveryDate,chkHolidayPopup);
  nlapiSetFieldValue('custpage_delivery_date', so_setDeliveryDate);
  var pickUpValue =   SOOBJ.getFieldValue('custbody53');
  if(pickUpValue == 'T')
  {
    nlapiSetFieldValue('custpage_attention', "Brilliant Earth Showroom");
  }
  //Ended on 17/05/2017
  nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
  nlapiDisableLineItemField('custpage_items', "sublist_item", true);
  nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
  nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
  nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
  nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
  nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
  nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
  nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
  nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
  nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
  nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
  nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
  nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
  
  /* Start: Commented by Nikhil on October 15, 2018 for NS-1363 */
  /*
  nlapiRemoveSelectOption( 'custpage_return_label_status' , '2' );
  nlapiRemoveSelectOption( 'custpage_return_label_status' , '3' );
  nlapiRemoveSelectOption( 'custpage_return_label_status' , '6' );
  nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
  shipcountry =   SOOBJ.getFieldValue("shipcountry");
 // billcountry =   SOOBJ.getFieldValue("billcountry");
  if(shipcountry !='US')
  {
    nlapiRemoveSelectOption('custpage_return_label_status' , '5');
  }
  */
  /* End: Commented by Nikhil on October 15, 2018 for NS-1363 */
}
function pageRefresh()
{
  window.location.reload(true);
}
function Post_Sale_Line_Init_Fun(type)
{
  // disableLineItem();
  var Shipping_to_BE = nlapiGetCurrentLineItemValue("custpage_items","sublist_shipping_to_be");
  var itemId = nlapiGetCurrentLineItemValue("custpage_items","sublist_item");
  if(itemId !=null && itemId !="")
    var  itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
  if(itemcat==2 || itemcat==3 || itemcat==32 || itemcat==35 ||itemcat==36 || itemcat==24)
  {
    if(Shipping_to_BE=='F')
    {
      // alert('1');
      nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item", true);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
    }
    else
    {
      //alert('2');
      nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item", false);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", false);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", false);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", false);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", false);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", false);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", false);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", false);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", false); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", false);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", false);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", false);
    }
  }
  else
  {
    var chk_be = nlapiGetCurrentLineItemValue("custpage_items","sublist_chk_be");
    if(chk_be =='T')
    {
      //alert('3');
      nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", true);
      nlapiDisableLineItemField('custpage_items', "sublist_item", true);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
    }
    else
    {
      /* nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item", true);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);*/
      if(Shipping_to_BE=='T')
      {
        //alert('4');
        nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
        nlapiDisableLineItemField('custpage_items', "sublist_item", false);
        nlapiDisableLineItemField('custpage_items', "sublist_desc", false);
        nlapiDisableLineItemField('custpage_items', "sublist_new_size", false);
        nlapiDisableLineItemField('custpage_items', "sublist_amt", false);
        nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", false);
        nlapiDisableLineItemField('custpage_items', "sublist_qty", false);
        nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", false);
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", false);
        nlapiDisableLineItemField('custpage_items', "sublist_item_link", false);
        nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", false); 
        nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", false);
        nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", false);
        nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", false);
      }
      else
      {
        //alert('5');
        nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
        nlapiDisableLineItemField('custpage_items', "sublist_item", true);
        nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
        nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
        nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
        nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
        nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
        nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
        nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
        nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
        nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
        nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
        nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
      }
    }
  }
  // commented initial requirement as per client feedback.
  /*if(nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable")=='T')
  {
    nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
  }else
  {
    var chk_be = nlapiGetCurrentLineItemValue("custpage_items","sublist_chk_be");
    if(chk_be=='T')
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
    else
    {
      if(nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable")=='F' && Shipping_to_BE=='T')
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", false);
      else
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
    }
  }*/
  nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
  nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
  highLightBackgroundColor();
}
function Post_Sale_Engrave_Fld_Changed_Fun(type,name)
{
  lockaddress_FC(type, name); // Added by Nikhil on October 15, 2018 - NS-1363
  shipToSelect_FC(type, name); // Added by Nikhil on November 12, 2018 - NS-1363
  
  var origSoShipCountry = nlapiLookupField('salesorder', nlapiGetFieldValue('custpage_order_id'), 'shipcountry'); // Added by Nikhil Bhutani on February 02, 2019 for NS-1363
  
  if(name =="custpage_drop_off")
  {
	var setValue = nlapiGetFieldValue('custpage_return_label_status'); // Added on October 15, 2018 for NS-1363 by Nikhil
    if(nlapiGetFieldValue('custpage_drop_off')=='1')
    {
      nlapiRemoveSelectOption('custpage_return_label_status',null) ;
      var col = new Array();
      col.push(new nlobjSearchColumn('name')); 
      col.push(new nlobjSearchColumn('internalid').setSort(false)); 
      var results = nlapiSearchRecord('customlist126', null, null, col);
      nlapiInsertSelectOption('custpage_return_label_status' ,'','');
      nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -');
      for(var i=0; i<results.length;i++)
      {
        if(results[i].getId() == '4')
          nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),true);
        else
          nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
      }
      nlapiSetFieldValue('custpage_date_received_at_be',nlapiDateToString(new Date()));
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '2' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '3' );
	  nlapiRemoveSelectOption( 'custpage_return_label_status' , '5' ); // Adding on January 22, 2019 as per new comments on NS-1363
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '6' );
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
      /* Start: Commenting below code on October 26, 2018 - Nikhil*/
      /*
	  if(shipcountry !='US')
      {
        nlapiRemoveSelectOption('custpage_return_label_status' , '5');
      }
	  */
	  /* End: Commenting below code on October 26, 2018 - Nikhil*/
    }
    else
    {
      nlapiRemoveSelectOption('custpage_return_label_status',null) ;
      var col = new Array();
      col.push(new nlobjSearchColumn('name')); 
      col.push(new nlobjSearchColumn('internalid').setSort(false)); 
      var results = nlapiSearchRecord('customlist126', null, null, col);
      nlapiInsertSelectOption('custpage_return_label_status' ,'','',true);
      nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -',false);
      for(var i=0; i<results.length;i++)
      {
        nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
      }
      nlapiSetFieldValue('custpage_date_received_at_be','');
      nlapiSetFieldValue('custpage_location_received_at_be','');
      nlapiRemoveSelectOption('custpage_return_label_status' , '2');
      nlapiRemoveSelectOption('custpage_return_label_status' , '3');
      nlapiRemoveSelectOption('custpage_return_label_status' , '6');
      nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
      /* Start: Commenting below code on October 26, 2018 - Nikhil*/
      /*
	  if(shipcountry !='US')
      {
        nlapiRemoveSelectOption('custpage_return_label_status' , '5');
      }
	  */
	  /* End: Commenting below code on October 26, 2018 - Nikhil*/
	  /* Start: Added on October 15, 2018 for NS-1363 by Nikhil*/
	  if(setValue && setValue!= null && setValue != undefined)
	  {
		try
		{
			nlapiSetFieldValue('custpage_return_label_status', setValue);
		}
		catch(ex)
		{
			nlapiLogExecution('Debug', 'Exception setting Return Label Status', ex.message);
		}
	  }
	  /* End: Added on October 15, 2018 for NS-1363 by Nikhil*/
    }
  }
  /* Start  Auto Populate Sate on selection of Country */
  if(name=="custpage_country")
  {
	/* Start: Added by Nikhil Bhutani on November 06, 2018 for NS-1363 */
	if(nlapiGetFieldValue('custpage_country') !=  origSoShipCountry)
	{
		nlapiSetFieldValue('custpage_status_of_international_taxes', '1');
		var fieldSoit = nlapiGetField('custpage_status_of_international_taxes'); //this is the field to be set to disabled
		fieldSoit.setDisplayType('disabled');
	}
	else
	{
		nlapiSetFieldValue('custpage_status_of_international_taxes', '5');
		var fieldSoit = nlapiGetField('custpage_status_of_international_taxes'); //this is the field to be set to normal
		fieldSoit.setDisplayType('normal');
	}
	/* End: Added by Nikhil Bhutani on November 06, 2018 for NS-1363 */
    if(nlapiGetFieldValue('custpage_country')=="CA")
    {
      //var countryCode ='CA';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var canadaState = get_Canada_State();
      var  JSON_CanadaState_Stringify =  JSON.stringify(canadaState);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_CanadaState_Parse = JSON.parse(JSON_CanadaState_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_CanadaState_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_CanadaState_Parse[i].value , JSON_CanadaState_Parse[i].text,false);
      }
    }
    else if(nlapiGetFieldValue('custpage_country')=="US")
    {
      //var countryCode ='US';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);

      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var usState = get_US_State();
      var  JSON_US_Stringify =  JSON.stringify(usState);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_US_Parse = JSON.parse(JSON_US_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_US_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_US_Parse[i].value , JSON_US_Parse[i].text,false);
      }
	  
	  /* Start: Added by Nikhil on October 26, 2018 for Ns-1363 */
	  /*
		nlapiRemoveSelectOption('custpage_return_label_status',null) ;
		var col = new Array();
		col.push(new nlobjSearchColumn('name')); 
		col.push(new nlobjSearchColumn('internalid').setSort(false)); 
		var results = nlapiSearchRecord('customlist126', null, null, col);
		nlapiInsertSelectOption('custpage_return_label_status' ,'','',true);
		nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -',false);
		for(var i=0; i<results.length;i++)
		{
			nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
		}
		nlapiSetFieldValue('custpage_date_received_at_be','');
		nlapiSetFieldValue('custpage_location_received_at_be','');
		nlapiRemoveSelectOption( 'custpage_return_label_status' , '2' );
		nlapiRemoveSelectOption( 'custpage_return_label_status' , '3' );
		nlapiRemoveSelectOption( 'custpage_return_label_status' , '6' );
		nlapiRemoveSelectOption( 'custpage_return_label_status' , '7' );
		if(shipcountry !='US')
		{
			nlapiRemoveSelectOption('custpage_return_label_status' , '5');
		}
	  */
	  /* End: Added by Nikhil on October 26, 2018 for Ns-1363 */
	  
    }
    else if(nlapiGetFieldValue('custpage_country')=="AU")
    {
      //var countryCode ='AU';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var aus_State = get_Australia_State();
      var  JSON_AUS_Stringify =  JSON.stringify(aus_State);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_AUS_Parse = JSON.parse(JSON_AUS_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_AUS_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_AUS_Parse[i].value , JSON_AUS_Parse[i].text,false);
      }
    }
    else if(nlapiGetFieldValue('custpage_country')=="MX")
    {
      //var countryCode ='MX';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var MexicoState = get_Mexico_State();
      var  JSON_Mexico_Stringify =  JSON.stringify(MexicoState);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_Mexico_Parse = JSON.parse(JSON_Mexico_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_Mexico_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_Mexico_Parse[i].value , JSON_Mexico_Parse[i].text,false);
      }
    }
    else if(nlapiGetFieldValue('custpage_country')=="GB")
    {
      //var countryCode ='GB';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var UnitedkingdomState = get_Unitedkingdom_State();
      var  JSON_Unitedkingdom_Stringify =  JSON.stringify(UnitedkingdomState);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_Unitedkingdom_Parse = JSON.parse(JSON_Unitedkingdom_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_Unitedkingdom_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_Unitedkingdom_Parse[i].value , JSON_Unitedkingdom_Parse[i].text,false);
      }
    }
    else if(nlapiGetFieldValue('custpage_country')=="CN")
    {
      //var countryCode ='CN';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var China_State = get_China_State();
      var  JSON_China_Stringify =  JSON.stringify(China_State);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_China_Parse = JSON.parse(JSON_China_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_China_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_China_Parse[i].value , JSON_China_Parse[i].text,false);
      }
    }
    else if(nlapiGetFieldValue('custpage_country')=="JP")
    {
      //var countryCode ='JP';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to normal
      field.setDisplayType('normal');
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to hidden
      fld.setDisplayType('hidden');
      var Japan_State = get_Japan_State();
      var  JSON_Japan_Stringify =  JSON.stringify(Japan_State);
      // nlapiLogExecution("debug","Get Country Stringify",JSON_Country_Stringify);
      var JSON_Japan_Parse = JSON.parse(JSON_Japan_Stringify);
      nlapiRemoveSelectOption('custpage_state', null) ;
      for(var i=0; i<JSON_Japan_Parse.length;i++)
      {
        nlapiInsertSelectOption('custpage_state' , JSON_Japan_Parse[i].value , JSON_Japan_Parse[i].text,false);
      }
    }
    else
    {
      //var countryCode ='';
      //remove_add_ReturnLabelStatus_EmailToCustomer(countryCode);
      alert("Customer may be liable for taxes due to shipped country change.");
      var field = nlapiGetField('custpage_state'); //this is the field to be set to hidden
      field.setDisplayType('hidden');
      nlapiRemoveSelectOption('custpage_state', null) ;
      var fld = nlapiGetField('custpage_state_new'); //this is the field to be set to normal
      fld.setDisplayType('normal');
    }
	
	/* Start: Added by Nikhil for NS-1363 on January 29, 2019*/
	var return_shipping_label_status = nlapiGetFieldValue("custpage_return_label_status");
	var shipping_to_country = nlapiGetFieldValue("custpage_country");
	if(return_shipping_label_status=="1" && shipping_to_country!="US" && shipping_to_country!="CA" && shipping_to_country!="AU" && shipping_to_country!="GB" && shipping_to_country != origSoShipCountry)
	{
		alert("This country requires a $50 shipping fee. This will automatically be added to the sales order.");
		nlapiSetFieldValue("custpage_add_shipping_fee","T",true,true);
	}
	else
	{
		nlapiSetFieldValue("custpage_add_shipping_fee","F",true,true);
	}
	/* End: Added by Nikhil for NS-1363 on January 29, 2019*/
	
  }
  if(name=="custpage_return_label_status")
	{
		var return_shipping_label_status = nlapiGetFieldValue("custpage_return_label_status");
		var shipping_to_country = nlapiGetFieldValue("custpage_country");
		
		if(return_shipping_label_status=="1" && shipping_to_country!="US" && shipping_to_country!="CA" && shipping_to_country!="AU" && shipping_to_country!="GB" && shipping_to_country != origSoShipCountry)
		{
			alert("This country requires a $50 shipping fee. This will automatically be added to the sales order.");
			nlapiSetFieldValue("custpage_add_shipping_fee","T",true,true);
		}
		else
		{
			nlapiSetFieldValue("custpage_add_shipping_fee","F",true,true);
		}
	}
  if(type=="custpage_items" && name=="sublist_created_from")
  {
    nlapiRefreshLineItems('custpage_items');
  }
  if(type=="custpage_items" && name=="sublist_related_sales_order")
  {
    nlapiRefreshLineItems('custpage_items');
  }
  if(type=="custpage_items" && name=="sublist_item")
  {
    nlapiRefreshLineItems('custpage_items');
    if(nlapiGetCurrentLineItemValue("custpage_items","sublist_sale_amount")=='' || nlapiGetCurrentLineItemValue("custpage_items","sublist_sale_amount")==null)
    {
      nlapiSetCurrentLineItemValue("custpage_items","sublist_created_from_disable",'T');
    }
    var itemId =  nlapiGetCurrentLineItemValue("custpage_items","sublist_item");
    var itemPrice =0;
    if(itemId!=null && itemId!='')
    {
      var salesdescription = nlapiLookupField("item",itemId,"description");
      var parentText = nlapiLookupField("item",itemId,"parent",true);
      try
      {
        var obj = nlapiLoadRecord('inventoryitem',itemId);
        var itemType = obj.getFieldValue("itemtype");
        for(var i=0; i<obj.getLineItemCount('price');i++)
        {
          itemPrice = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
          if(itemPrice !='' && itemPrice!=null)
            break;
        }
        nlapiSetCurrentLineItemValue("custpage_items","sublist_desc",salesdescription);
        nlapiSetCurrentLineItemValue("custpage_items","sublist_sale_amount",nlapiFormatCurrency(itemPrice));
        nlapiSetCurrentLineItemValue("custpage_items","sublist_item_link",parentText);
        nlapiSetCurrentLineItemValue("custpage_items","sublist_item_type",itemType);
      }catch(ex)
      {
        try
        {
          var obj = nlapiLoadRecord('assemblyitem',itemId);
          var itemType = obj.getFieldValue("itemtype");
          for(var i=0; i<obj.getLineItemCount('price');i++)
          {
            itemPrice = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
            if(itemPrice !='' && itemPrice!=null)
              break;
          }
          nlapiSetCurrentLineItemValue("custpage_items","sublist_desc",salesdescription);
          nlapiSetCurrentLineItemValue("custpage_items","sublist_sale_amount",nlapiFormatCurrency(itemPrice));
          nlapiSetCurrentLineItemValue("custpage_items","sublist_item_link",parentText);
          nlapiSetCurrentLineItemValue("custpage_items","sublist_item_type",itemType);
        }
        catch(ex)
        {
        }
      }
      //document.getElementsByClassName("listinlinefocusedrow")[4].click();
      highLightBackgroundColor();
    }
  }
  if(type=="custpage_items" && name=="sublist_center_stone_link")
  {
    nlapiRefreshLineItems('custpage_items');
    var center_stone_link_price = 0;
    var totalInsuranceValue = 0;
    var itemId= nlapiGetCurrentLineItemValue("custpage_items","sublist_center_stone_link");
    var saleamount = nlapiGetCurrentLineItemValue("custpage_items", "sublist_sale_amount");
    if(itemId!=null && itemId!='' && saleamount !='' && saleamount != null)
    {
      try
      {
        var obj = nlapiLoadRecord('inventoryitem',itemId);
        for(var i=0; i<obj.getLineItemCount('price');i++)
        {
          center_stone_link_price = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
          if(center_stone_link_price !='' && center_stone_link_price!=null)
            break;
        }
        totalInsuranceValue = ((parseFloat(center_stone_link_price)+parseFloat(saleamount)) * .8 );
        nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
      }catch(ex)
      {
        try
        {
          var obj = nlapiLoadRecord('assemblyitem',itemId);
          for(var i=0; i<obj.getLineItemCount('price');i++)
          {
            center_stone_link_price = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
            if(center_stone_link_price !='' && center_stone_link_price!=null)
              break;
          }
          totalInsuranceValue = ((parseFloat(center_stone_link_price)+parseFloat(saleamount)) * .8 );
          nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
        }catch(ex)
        {
        }
      }
    }else
    {
      totalInsuranceValue = (parseFloat(saleamount) * .8 );
      nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
    }
  }
  /* Start Here  Auto Populate Total Insurance */
  if(type=="custpage_items" && name=="sublist_sale_amount")
  {
    var center_stone_link_price = 0;
    var totalInsuranceValue = 0;
    var itemId= nlapiGetCurrentLineItemValue("custpage_items","sublist_center_stone_link");
    var saleamount = nlapiGetCurrentLineItemValue("custpage_items", "sublist_sale_amount");
    if(itemId!=null && itemId!='' && saleamount !='' && saleamount != null)
    {
      try
      {
        var obj = nlapiLoadRecord('inventoryitem',itemId);
        for(var i=0; i<obj.getLineItemCount('price');i++)
        {
          center_stone_link_price = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
          if(center_stone_link_price !='' && center_stone_link_price!=null)
            break;
        }
        totalInsuranceValue = ((parseFloat(center_stone_link_price)+parseFloat(saleamount)) * .8 );
        nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
      }catch(ex)
      {
        try
        {
          var obj = nlapiLoadRecord('assemblyitem',itemId);
          for(var i=0; i<obj.getLineItemCount('price');i++)
          {
            center_stone_link_price = obj.getLineItemMatrixValue('price', 'price', i+1, 1);
            if(center_stone_link_price !='' && center_stone_link_price!=null)
              break;
          }
          totalInsuranceValue = ((parseFloat(center_stone_link_price)+parseFloat(saleamount)) * .8 );
          nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
        }catch(ex)
        {
        }
      }
    }else
    {
      totalInsuranceValue = (parseFloat(saleamount) * .8);
      nlapiSetCurrentLineItemValue("custpage_items","sublist_production_ins_value",parseFloat(totalInsuranceValue));
    }
  }
  /* End Here  */
  if(type=="custpage_items" && name=="sublist_shipping_to_be" )
  {
    var Shipping_to_BE = nlapiGetCurrentLineItemValue("custpage_items","sublist_shipping_to_be");
    if(Shipping_to_BE=='T')
    {
      nlapiDisableLineItemField('custpage_items', "sublist_item", false);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", false);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", false);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", false);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", false);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", false);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", false);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", false);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", false); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", false);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", false);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", false);

      highLightBackgroundColor();
      /* var itemId = nlapiGetCurrentLineItemValue("custpage_items","sublist_item");
      var created_from_disable = nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable");
      if(itemId !=null && itemId !="")
        if(created_from_disable =='T')
          document.getElementsByClassName("listinlinefocusedrow")[4].click();*/
    }
    else
    {
      nlapiDisableLineItemField('custpage_items', "sublist_shipping_to_be", false);
      nlapiDisableLineItemField('custpage_items', "sublist_item", true);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
      nlapiDisableLineItemField('custpage_items', "sublist_new_size", true);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
      nlapiDisableLineItemField('custpage_items', "sublist_sale_amount", true);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
      nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
    }
    // commented initial requirement as per client feedback.
    /*if(nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable")=='T')
    {
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
    }else if(nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable")=='F' && Shipping_to_BE=='F')
    {
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
    }*/
    nlapiDisableLineItemField('custpage_items', "sublist_item_link", true);
    nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
  }
  /*End Here */
  if(name =="custpage_delivery_date_firm")
  {
    var deliveryDateFirm = nlapiGetFieldValue('custpage_delivery_date_firm');
    if(deliveryDateFirm == 'T')
      nlapiDisableField('custpage_delivery_date', false);
    else
      nlapiDisableField('custpage_delivery_date', true);
  }
  if(name=="custpage_pickup_location")
  {
    if(nlapiGetFieldValue("custpage_pickup_location")!=null && nlapiGetFieldValue("custpage_pickup_location")!="")
    {
      nlapiSetFieldValue("custpage_pickup_at_be" ,'T');
      var puLocation = nlapiGetFieldValue("custpage_pickup_location");
      var filters = [];
      filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
      var results = nlapiSearchRecord("location",null,filters);
      if(results)
      {
        var location = nlapiLoadRecord("location",results[0].getId());
        nlapiSetFieldValue("custpage_address_1",location.getFieldValue("addr1"),false,true);
        nlapiSetFieldValue("custpage_address_2",location.getFieldValue("addr2"),false,true);
        nlapiSetFieldValue("custpage_country",location.getFieldValue("country"),false,true);
        nlapiSetFieldValue("custpage_city",location.getFieldValue("city"),false,true);
        nlapiSetFieldValue("custpage_state",location.getFieldValue("state"),false,true);
        nlapiSetFieldValue("custpage_zip",location.getFieldValue("zip"),false,true);
      }
      var pushDeliveryDateByPickupLocation = nlapiGetFieldValue('custpage_delivery_date');
      var chkHolidayPopup = false;
      pushDeliveryDateByPickupLocation = setDeliveryDate_by_Pickup_Location(pushDeliveryDateByPickupLocation,chkHolidayPopup);
      nlapiSetFieldValue('custpage_delivery_date',pushDeliveryDateByPickupLocation);
    }
    else
    {
      nlapiSetFieldValue("custpage_pickup_at_be" ,'F');
      nlapiSetFieldValue("custpage_address_1",'');
      nlapiSetFieldValue("custpage_address_2",'');
      nlapiSetFieldValue("custpage_country",'');
      nlapiSetFieldValue("custpage_city",'');
      nlapiSetFieldValue("custpage_state",'');
      nlapiSetFieldValue("custpage_zip",'');
    }

  }
  //Added by Ravi on 17/05/2017
  if(name=="custpage_pickup_at_be")
  {
    if(nlapiGetFieldValue("custpage_pickup_at_be")=='T')
    {
      nlapiSetFieldValue('custpage_attention', "Brilliant Earth Showroom");
    }
    else
    {
      nlapiSetFieldValue('custpage_attention', "");
    }
  }
  //Ended on 17/05/2017


  if(type=="custpage_items" && name=="sublist_qty")
  {
    highLightBackgroundColor();
    /*var div =null;
    var itemId = nlapiGetCurrentLineItemValue("custpage_items","sublist_item");
    if(itemId !=null && itemId !="")
      var  itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
    if(itemcat==2)
    {
      document.getElementsByClassName("listinlinefocusedrow")[8].click();
      div = document.getElementById('custpage_items_sublist_center_stone_link_display');
      div.setAttribute("style", "background-color:#fce0d6 !important");
      div = document.getElementById('custpage_items_sublist_related_sales_order_display');
      div.setAttribute("style", "background-color:#white !important");
    }else
    {
      document.getElementsByClassName("listinlinefocusedrow")[9].click();
      var created_from_disable = nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable");
      if(created_from_disable == 'T')
      {

        div = document.getElementById('custpage_items_sublist_related_sales_order_display');
        div.setAttribute("style", "background-color:#fce0d6 !important");
        div = document.getElementById('custpage_items_sublist_center_stone_link_display');
        div.setAttribute("style", "background-color:#white !important");
      }
      else
      {
        div = document.getElementById('custpage_items_sublist_related_sales_order_display');
        div.setAttribute("style", "background-color:#white !important");
        div = document.getElementById('custpage_items_sublist_center_stone_link_display');
        div.setAttribute("style", "background-color:#white !important");
      }
    }*/
  }
  if(type=="custpage_items" && name=="sublist_center_stone_link")
    highLightBackgroundColor();
  //document.getElementsByClassName("listinlinefocusedrow")[10].click();

  if(type=="custpage_items" && name=="sublist_related_sales_order")
    highLightBackgroundColor();
  //document.getElementsByClassName("listinlinefocusedrow")[10].click();

  if(type=="custpage_items" && name=="sublist_engraving_text")
    highLightBackgroundColor();
  // document.getElementsByClassName("listinlinefocusedrowright")[0].click();

}
// On Save
function Post_Sale_Engrave_Save_Record_Fun(type,name)
{  
  /*if(nlapiGetFieldValue('custpage_country')!='US' || (nlapiGetFieldValue('custpage_state')=='AE' || nlapiGetFieldValue('custpage_state')=='AP' || nlapiGetFieldValue('custpage_state')=='AA' ))
  {
    if(nlapiGetFieldValue('custpage_return_label_status') == 5)
    {
      alert('Country/State not eligible for this selection');
      var shipcountry=SOOBJ.getFieldValue('shipcountry');
      nlapiSetFieldValue('custpage_country',shipcountry);
      nlapiSetFieldValue('custpage_return_label_status','');
      var shipstate=SOOBJ.getFieldValue('shipstate');
      nlapiSetFieldValue('custpage_state',shipstate);
      return false;
    }
  }*/
  /* Start: Added by Nikhil Bhutani on November 02, 2018 */
  if(!addressMandatoryValidation())
  {
	  alert('Please fill in the mandatory address details(Country, Addressee, Address Line 1, City, State and Zipcode)');
	  return false;
  }
  /* End: Added by Nikhil Bhutani on November 02, 2018 */
  var countrytxt=nlapiGetFieldText('custpage_country');
  if(countrytxt!=null && countrytxt!="")
  {		
    nlapiSetFieldValue('custpage_country_hidden',countrytxt);
    //alert(countrytxt);
  }
  if(nlapiGetFieldValue('custpage_return_label_status')==6)
  {
    //alert('Not a valid selection');
    alert('Please select a valid return label status');
    nlapiSetFieldValue('custpage_return_label_status','');
    return false;
  }
  var pickup_at_be = nlapiGetFieldValue("custpage_pickup_at_be");
  if(pickup_at_be == 'F')
  {
    if(nlapiGetFieldValue("custpage_pickup_location")!="")
    {
      alert('Pick-up at BE is mandatory');
      return false;
    }
  }
  else if(pickup_at_be == 'T')
  {
    if(nlapiGetFieldValue("custpage_pickup_location")=="")
    {
      alert('Pick-up location is mandatory');
      return false;
    }
  }
  if(nlapiGetLineItemCount('custpage_new_items')==-1)
  {
    var line_item_count =0;
    var curr_line_item_count =nlapiGetLineItemCount('custpage_items');
    for(licount =0; licount<curr_line_item_count;licount++)
    {
      var shipatbe =  nlapiGetLineItemValue('custpage_items','sublist_shipping_to_be',licount+1);
      if(shipatbe == 'F')
      {
        line_item_count = line_item_count  + 1 ;
        continue;
      }
    }
    if(line_item_count == curr_line_item_count)
    {
      alert('You must enter at least one line item for this transaction. ');
      return false;
    }
  }
  var pushDeliveryDateBySave = nlapiGetFieldValue('custpage_delivery_date');
  var chkHolidayPopup = true;
  pushDeliveryDateBySave = setDeliveryDate_by_Pickup_Location(pushDeliveryDateBySave,chkHolidayPopup);
  if(pushDeliveryDateBySave != false)
    nlapiSetFieldValue('custpage_delivery_date',pushDeliveryDateBySave);

  if(nlapiGetFieldValue('custpage_drop_off')=='1')
  {
    if(nlapiGetFieldValue("custpage_date_received_at_be")==null || nlapiGetFieldValue("custpage_date_received_at_be")=="") 
    {
      alert("Please select date received at BE from customer.");
      return false;
    }
    if(nlapiGetFieldValue("custpage_location_received_at_be")==null || nlapiGetFieldValue("custpage_location_received_at_be")=="")
    {
      alert("Please select location received at BE from customer.");
      return false;
    }
  }
  var related_Sales_Order ='';
  for(var i=0;i<nlapiGetLineItemCount("custpage_items");i++)
  {
    var sublist_shipping_to_be = nlapiGetLineItemValue("custpage_items", "sublist_shipping_to_be", i+1) ;
    if(sublist_shipping_to_be =='T')
    {
      var itemId= nlapiGetLineItemValue("custpage_items","sublist_item",i+1);
      if(itemId == null || itemId =='')
      {
        alert("Please select item");
        return false;
      }
      var itemIdText= nlapiGetLineItemText("custpage_items","sublist_item",i+1);
      var  itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
      if(nlapiGetLineItemValue("custpage_items", "sublist_qty", i+1)==""||nlapiGetLineItemValue("custpage_items", "sublist_qty", i+1) == null)
      {
        alert('Quantity is mandatory')
        return false;
      }
      else if(nlapiGetLineItemValue("custpage_items", "sublist_production_ins_value", i+1)==""||nlapiGetLineItemValue("custpage_items", "sublist_production_ins_value", i+1) == null)
      {
        alert('Production insurance value is mandatory')
        return false;
      }
      else if(nlapiGetLineItemValue("custpage_items", "sublist_engraving_text", i+1)==""||nlapiGetLineItemValue("custpage_items", "sublist_engraving_text", i+1) == null)
      {
        alert('Engraving text is mandatory');
        return false;
      }
      else if(nlapiGetLineItemValue("custpage_items", "sublist_type_of_font", i+1)=="" || nlapiGetLineItemValue("custpage_items", "sublist_type_of_font", i+1) == null)
      {
        alert('Type of font is mandatory');
        return false;
      }
      //  else if(nlapiGetLineItemValue("custpage_items", "sublist_item", i+1) != originalSOItem[i])
      else if(nlapiGetLineItemValue("custpage_items", "sublist_created_from_disable", i+1) == 'T')
      {
        if(itemcat!=2)
        {
          related_Sales_Order = nlapiGetLineItemValue("custpage_items", "sublist_related_sales_order", i+1);
          if(related_Sales_Order == ''|| related_Sales_Order == null)
          { 
            alert("Related Sales order is mandatory for the item :"+"\n"+ itemIdText);
            return false;
          }
        }
      }
      //else
      //{
      var itemId= nlapiGetLineItemValue("custpage_items","sublist_item",i+1);
      var itemIdText= nlapiGetLineItemText("custpage_items","sublist_item",i+1);
      var  itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
      if(itemcat == 2)
      {
        var centerStoneLink= nlapiGetLineItemValue("custpage_items","sublist_center_stone_link",i+1);
        if(centerStoneLink == null || centerStoneLink =="")
        {
          alert('Center Stone Link is mandatory for item :: ' + ''+itemIdText);
          return false;
        }
      }
      //}
    }
  }
  return true;
}
function SO_SetDeliveryDate()
{
  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var curr_date= new Date();
  //var delivery_date = nlapiDateToString(nlapiAddDays(curr_date,56));// 106  28
  var delivery_date = nlapiDateToString(nlapiAddDays(curr_date,28));
  //alert(delivery_date);
  var filter = new Array();
  filter.push(new nlobjSearchFilter('custrecord_all_location',null,'is','T'));
  var column = new Array();
  column.push(new nlobjSearchColumn('custrecord_holiday_date'));
  var result = nlapiSearchRecord('customrecordholiday_table_child',null,filter,column);
  if(result!=null)
  {
    for(var deldate=0;deldate<result.length;deldate++)
    {
      var holiday_date=  result[deldate].getValue('custrecord_holiday_date');
      if(delivery_date == holiday_date)
      {
        var dddate = new Date(delivery_date);
        /*weekday[0]=  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";*/
        var ddName = weekday[dddate.getDay()];
        if(ddName=="Sunday" || ddName=="Saturday")
        {
          if(ddName=="Sunday")
          {
            delivery_date=nlapiStringToDate(delivery_date);
            delivery_date=nlapiAddDays( delivery_date, 1);
            delivery_date=nlapiDateToString(delivery_date);
            delivery_date = exclude_holiday_date(result,delivery_date,weekday);
            return delivery_date;
          }
          if(ddName=="Saturday")
          {
            delivery_date=nlapiStringToDate(delivery_date);
            delivery_date=nlapiAddDays( delivery_date, 2);
            delivery_date=nlapiDateToString(delivery_date);
            delivery_date = exclude_holiday_date(result,delivery_date,weekday);
            return delivery_date;
          }						
        }
        else
        {
          delivery_date=nlapiStringToDate(delivery_date);
          delivery_date=nlapiAddDays(delivery_date, 1);
          delivery_date=nlapiDateToString(delivery_date);
          delivery_date = exclude_holiday_date(result,delivery_date,weekday);
          return delivery_date;
        }
      }
    }
    delivery_date = exclude_holiday_date(result,delivery_date,weekday);
  }
  return delivery_date;    
}
function  exclude_holiday_date(result,delivery_date,weekday)
{
  /*weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";*/
  var dddate = new Date(delivery_date);
  var ddName = weekday[dddate.getDay()];
  for(var deldate=0;deldate<result.length;deldate++)
  {
    var holiday_date=  result[deldate].getValue('custrecord_holiday_date');
    if(delivery_date == holiday_date)
    {
      if(ddName=="Sunday" || ddName=="Saturday")
      {
        if(ddName=="Sunday")
        {
          delivery_date=nlapiStringToDate(delivery_date);
          delivery_date=nlapiAddDays( delivery_date, 1);
          delivery_date=nlapiDateToString(delivery_date);
          delivery_date = exclude_holiday_date(result,delivery_date,weekday);
          return delivery_date;
        }
        if(ddName=="Saturday")
        {
          delivery_date=nlapiStringToDate(delivery_date);
          delivery_date=nlapiAddDays( delivery_date, 2);
          delivery_date=nlapiDateToString(delivery_date);
          delivery_date = exclude_holiday_date(result,delivery_date,weekday);
          return delivery_date;
        }						
      }
      else
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        return delivery_date;
      }
    }
  }
  if(ddName=="Sunday" || ddName=="Saturday")
  {
    //alert('Delivery day should not be Sunday or Saturday');
    if(ddName=="Sunday")
    {
      delivery_date=nlapiStringToDate(delivery_date);
      delivery_date=nlapiAddDays( delivery_date, 1);
      delivery_date=nlapiDateToString(delivery_date);
      delivery_date = exclude_holiday_date(result,delivery_date,weekday);
      return delivery_date;
      //nlapiSetFieldValue('custpage_delivery_date',dlv_date);
    }
    if(ddName=="Saturday")
    {
      delivery_date=nlapiStringToDate(delivery_date);
      delivery_date=nlapiAddDays( delivery_date, 2);
      delivery_date=nlapiDateToString(delivery_date);
      delivery_date = exclude_holiday_date(result,delivery_date,weekday);
      return  delivery_date;
      //nlapiSetFieldValue('custpage_delivery_date',dlv_date);
    }						
  }
  return delivery_date;
}
function get_Canada_State()
{
  var ca_state=[{"value":"","text":""},{"text" : "Alberta","value": "AB"},
                {"text":"British Columbia","value":"BC"},
                {"text":"Manitoba","value":"MB"},
                {"text":"New Brunswick","value":"NB"},
                {"text":"Newfoundland" , "value":"NL"},
                {"text":"Northwest Territories","value":"NT"},
                {"text":"Nova Scotia","value":"NS"},
                {"text":"Nunavut","value":"NU"},
                {"text":"Ontario","value":"ON"},
                {"text":"Prince Edward Island","value":"PE"},
                {"text":"Quebec","value":"QC"},
                {"text":"Saskatchewan","value":"SK"},
                {"text":"Yukon","value":"YT"}
               ]
  return ca_state;
}
function get_US_State()
{
  var us_state = [{"value":"","text":""},{"value":"AL","text":"Alabama"},{"value":"AK","text":"Alaska"},{"value":"AZ","text":"Arizona"},{"value":"AR","text":"Arkansas"},{"value":"AA","text":"Armed Forces Americas"},{"value":"AE","text":"Armed Forces Europe"},{"value":"AP","text":"Armed Forces Pacific"},{"value":"CA","text":"California"},{"value":"CO","text":"Colorado"},{"value":"CT","text":"Connecticut"},{"value":"DE","text":"Delaware"},{"value":"DC","text":"District of Columbia"},{"value":"FL","text":"Florida"},{"value":"GA","text":"Georgia"},{"value":"HI","text":"Hawaii"},{"value":"ID","text":"Idaho"},{"value":"IL","text":"Illinois"},{"value":"IN","text":"Indiana"},{"value":"IA","text":"Iowa"},{"value":"KS","text":"Kansas"},{"value":"KY","text":"Kentucky"},{"value":"LA","text":"Louisiana"},{"value":"ME","text":"Maine"},{"value":"MD","text":"Maryland"},{"value":"MA","text":"Massachusetts"},{"value":"MI","text":"Michigan"},{"value":"MN","text":"Minnesota"},{"value":"MS","text":"Mississippi"},{"value":"MO","text":"Missouri"},{"value":"MT","text":"Montana"},{"value":"NE","text":"Nebraska"},{"value":"NV","text":"Nevada"},{"value":"NH","text":"New Hampshire"},{"value":"NJ","text":"New Jersey"},{"value":"NM","text":"New Mexico"},{"value":"NY","text":"New York"},{"value":"NC","text":"North Carolina"},{"value":"ND","text":"North Dakota"},{"value":"OH","text":"Ohio"},{"value":"OK","text":"Oklahoma"},{"value":"OR","text":"Oregon"},{"value":"PA","text":"Pennsylvania"},{"value":"PR","text":"Puerto Rico"},{"value":"RI","text":"Rhode Island"},{"value":"SC","text":"South Carolina"},{"value":"SD","text":"South Dakota"},{"value":"TN","text":"Tennessee"},{"value":"TX","text":"Texas"},{"value":"UT","text":"Utah"},{"value":"VT","text":"Vermont"},{"value":"VA","text":"Virginia"},{"value":"WA","text":"Washington"},{"value":"WV","text":"West Virginia"},{"value":"WI","text":"Wisconsin"},{"value":"WY","text":"Wyoming"}];
  return us_state;
}
function get_Australia_State()
{
  var aus_state=[{"value":"","text":""},{"text" : "Australian Capital Territory","value": "ACT"},
                 {"text":"New South Wales","value":"NSW"},
                 {"text":"Northern Territory","value":"NT"},
                 {"text":"Queensland","value":"QLD"},
                 {"text":"South Australia" , "value":"SA"},
                 {"text":"Tasmania","value":"TAS"},
                 {"text":"Victoria","value":"VIC"},
                 {"text":"Western Australia","value":"WA"}]
  return aus_state;
}
function get_Mexico_State()
{
  var mex_state=[{"value":"","text":""},{"text" : "Aguascalientes","value": "AGS"},
                 {"text":"Baja California Norte","value":"BCN"},
                 {"text":"Baja California Sur","value":"BCS"},
                 {"text":"Campeche","value":"CAM"},
                 {"text":"Chiapas" , "value":"CHIS"},
                 {"text":"Chihuahua","value":"CHIH"},
                 {"text":"Coahuila","value":"COAH"},
                 {"text":"Colima","value":"COL"},	
                 {"text":"Distrito Federal","value":"DF"},
                 {"text":"Durango","value":"DGO"},
                 {"text":"Guanajuato","value":"GTO"},
                 {"text":"Guerrero" , "value":"GRO"},
                 {"text":"Hidalgo","value":"HGO"},
                 {"text":"Jalisco","value":"JAL"},
                 {"text":"Michoacán","value":"MICH"},	
                 {"text":"Morelos","value":"MOR"},
                 {"text":"México (Estado de)","value":"MEX"}]
  return mex_state;
}
function get_Unitedkingdom_State()
{
  var uk_state=[{"value":"","text":""},{"text" : "Aberdeenshire","value": "Aberdeenshire"},
                {"text":"Angus","value":"Angus"},
                {"text":"Argyll","value":"Argyll"},
                {"text":"Avon","value":"Avon"},
                {"text":"Ayrshire" , "value":"Ayrshire"},
                {"text":"Banffshire","value":"Banffshire"},
                {"text":"Bedfordshire","value":"Beds."},
                {"text":"Berkshire","value":"Berks."},	
                {"text":"Berwickshire","value":"Berwickshire"},
                {"text":"Buckinghamshire","value":"Bucks."},
                {"text":"Caithness","value":"Caithness"},
                {"text":"Cambridgeshire" , "value":"Cambs."},
                {"text":"Cheshire","value":"Ches."},	
                {"text":"Clackmannanshire","value":"Clackmannanshire"},
                {"text":"Cleveland" , "value":"Cleveland"},
                {"text":"Clwyd","value":"Clwyd"},
                {"text":"Cornwall","value":"Cornwall"},
                {"text":"County Antrim","value":"Co Antrim"},	
                {"text":"County Armagh","value":"Co Armagh"},
                {"text":"County Down","value":"Co Down"},
                {"text":"County Durham","value":"Durham"},
                {"text":"County Fermanagh" , "value":"Co Fermanagh"},
                {"text":"County Londonderry","value":"Co Londonderry"},
                {"text":"County Tyrone","value":"Co Tyrone"},
                {"text":"Cumbria","value":"Cumbria"},
                {"text":"Derbyshire","value":"Derbys."},
                {"text":"Devon","value":"Devon"},
                {"text":"Dorset","value":"Dorset"},	
                {"text":"Dumfriesshire","value":"Dumfriesshire"},
                {"text":"Dunbartonshire" , "value":"Dunbartonshire"},
                {"text":"Dyfed","value":"Dyfed"},
                {"text":"East Lothian","value":"E Lothian"},
                {"text":"East Sussex","value":"E Sussex"},	
                {"text":"Essex","value":"Essex"},
                {"text":"Fife","value":"Fife"},
                {"text":"Gloucestershire","value":"Gloucs."},
                {"text":"Greater London" , "value":"London"},
                {"text":"Gwent","value":"Gwent"},
                {"text":"Gwynedd","value":"Gwynedd"},
                {"text":"Hampshire","value":"Hants."},
                {"text":"Herefordshire","value":"Hereford"},
                {"text":"Hertfordshire","value":"Herts."},
                {"text":"Inverness-shire","value":"Inverness-shire"},	
                {"text":"Isle of Arran","value":"Isle of Arran"},
                {"text":"Isle of Barra","value":"Isle of Barra"},
                {"text":"Isle of Benbecula","value":"Isle of Benbecula"},
                {"text":"Isle of Bute","value":"Isle of Bute"},
                {"text":"Isle of Canna","value":"Isle of Canna"},	
                {"text":"Isle of Coll","value":"Isle of Coll"},
                {"text":"Isle of Colonsay" , "value":"Isle of Colonsay"},
                {"text":"Isle of Cumbrae","value":"Isle of Cumbrae"},
                {"text":"Isle of Eigg","value":"Isle of Eigg"},
                {"text":"Isle of Gigha","value":"Isle of Gigha"},	
                {"text":"Isle of Harris","value":"Isle of Harris"},
                {"text":"Isle of Iona","value":"Isle of Iona"},
                {"text":"Isle of Islay","value":"Isle of Islay"},
                {"text":"Isle of Jura" , "value":"Isle of Jura"},
                {"text":"Isle of Lewis","value":"Isle of Lewis"},
                {"text":"Isle of Mull","value":"Isle of Mull"},
                {"text":"Isle of North Uist","value":"Isle of North Uist"},
                {"text":"Isle of Rum","value":"Isle of Rum"},
                {"text":"Isle of Scalpay","value":"Isle of Scalpay"},
                {"text":"Isle of Skye","value":"Isle of Skye"},	
                {"text":"Isle of South Uist","value":"Isle of South Uist"},
                {"text":"Isle of Tiree","value":"Isle of Tiree"},
                {"text":"Isle of Wight","value":"Isle of Wight"},
                {"text":"Kent" , "value":"Kent"},
                {"text":"Kincardineshire","value":"Kincardineshire"},
                {"text":"Kinross-shire","value":"Kinross-shire"},
                {"text":"Kirkcudbrightshire","value":"Kirkcudbrightshire"},	
                {"text":"Lanarkshire","value":"Lanarkshire"},
                {"text":"Lancashire","value":"Lancs."},
                {"text":"Leicestershire","value":"Leics."},
                {"text":"Lincolnshire" , "value":"Lincs."},
                {"text":"Merseyside","value":"Merseyside"},
                {"text":"Mid Glamorgan","value":"M Glam"},
                {"text":"Mid Lothian","value":"Mid Lothian"},	
                {"text":"Middlesex","value":"Middx."},
                {"text":"Morayshire","value":"Morayshire"},	
                {"text":"Nairnshire","value":"Nairnshire"},
                {"text":"Norfolk","value":"Norfolk"},
                {"text":"North Humberside","value":"N Humberside"},	
                {"text":"North Yorkshire","value":"N Yorkshire"},
                {"text":"Northamptonshire" , "value":"Northants."},
                {"text":"Northumberland","value":"Northumberland"},
                {"text":"Nottinghamshire","value":"Notts."},
                {"text":"Oxfordshire","value":"Oxon."},	
                {"text":"Peeblesshire","value":"Peeblesshire"},
                {"text":"Perthshire","value":"Perthshire"},
                {"text":"Powys","value":"Powys"},
                {"text":"Renfrewshire" , "value":"Renfrewshire"},
                {"text":"Ross-shire","value":"Ross-shire"},
                {"text":"Roxburghshire","value":"Roxburghshire"},
                {"text":"Selkirkshire","value":"Selkirkshire"},
                {"text":"Shropshire","value":"Shrops"},
                {"text":"Somerset","value":"Somt."},
                {"text":"South Glamorgan","value":"S Glam"},	
                {"text":"South Humberside","value":"S Humberside"},
                {"text":"South Yorkshire","value":"S Yorkshire"},
                {"text":"Staffordshire","value":"Staffs."},
                {"text":"Stirlingshire","value":"Stirlingshire"},
                {"text":"Suffolk","value":"Suffolk"},
                {"text":"Surrey","value":"Surrey"},	
                {"text":"Sutherland","value":"Sutherland"},
                {"text":"Tyne and Wear","value":"Tyne and Wear"},
                {"text":"Warwickshire","value":"Warks"},
                {"text":"West Glamorgan" , "value":"W Glam"},
                {"text":"West Lothian","value":"W Lothian"},
                {"text":"West Midlands","value":"W Midlands"},
                {"text":"West Sussex","value":"W Sussex"},
                {"text":"West Yorkshire","value":"W Yorkshire"},
                {"text":"Wigtownshire","value":"Wigtownshire"},
                {"text":"Wiltshire","value":"Wilts"},	
                {"text":"Worcestershire","value":"Worcs"}]
  return uk_state;
} 		
function get_China_State()
{
  var chin_state=[{"value":"","text":""},{"text" : "Heilongjiang Province","value": "Heilongjiang Province"},
                  {"text":"Jilin Province","value":"Jilin Province"},
                  {"text":"Liaoning Province","value":"Liaoning Province"},
                  {"text":"Neimenggu A. R.","value":"Neimenggu A. R."},
                  {"text":"Gansu Province" , "value":"Gansu Province"},
                  {"text":"Ningxia A. R.","value":"Ningxia A. R."},
                  {"text":"Xinjiang A. R.","value":"Xinjiang A. R."},
                  {"text":"Qinghai Province","value":"Qinghai Province"},	
                  {"text":"Hebei Province","value":"Hebei Province"},
                  {"text":"Henan Province","value":"Henan Province"},
                  {"text":"Shandong Province","value":"Shandong Province"},
                  {"text":"Shanxi Province" , "value":"Shanxi Province"},
                  {"text":"Shaanxi Province","value":"Shaanxi Province"},
                  {"text":"Jiangsu Province","value":"Jiangsu Province"},
                  {"text":"Zhejiang Province","value":"Zhejiang Province"},	
                  {"text":"Anhui Province","value":"Anhui Province"},
                  {"text":"Hubei Province","value":"Hubei Province"},	
                  {"text":"Hunan Province","value":"Hunan Province"},
                  {"text":"Sichuan Province","value":"Sichuan Province"},
                  {"text":"Guizhou Province","value":"Guizhou Province"},
                  {"text":"Jiangxi Province" , "value":"Jiangxi Province"},
                  {"text":"Guangdong Province","value":"Guangdong Province"},
                  {"text":"Guangxi A. R.","value":"Guangxi A. R."},
                  {"text":"Yunnan Province","value":"Yunnan Province"},	
                  {"text":"Hainan Province","value":"Hainan Province"},
                  {"text":"Xizang A. R.","value":"Xizang A. R."},
                  {"text":"Beijing","value":"Beijing"},
                  {"text":"Shanghai" , "value":"Shanghai"},
                  {"text":"Tianjin","value":"Tianjin"},
                  {"text":"Chongqing","value":"Chongqing"},
                  {"text":"Fujian Province","value":"Fujian Province"}]	
  return chin_state;
}	
function get_Japan_State()
{
  var jap_state=[{"value":"","text":""},{"text" : "Hokkaido","value": "Hokkaido"},
                 {"text":"Aomori","value":"Aomori"},
                 {"text":"Iwate","value":"Iwate"},
                 {"text":"Miyagi","value":"Miyagi"},
                 {"text":"Akita" , "value":"Akita"},
                 {"text":"Yamagata","value":"Yamagata"},
                 {"text":"Fukushima","value":"Fukushima"},
                 {"text":"Ibaraki","value":"Ibaraki"},	
                 {"text":"Tochigi","value":"Tochigi"},
                 {"text":"Gunma","value":"Gunma"},
                 {"text":"Saitama","value":"Saitama"},
                 {"text":"Chiba" , "value":"Chiba"},
                 {"text":"Tokyo","value":"Tokyo"},
                 {"text":"Kanagawa","value":"Kanagawa"},
                 {"text":"Niigata","value":"Niigata"},	
                 {"text":"Toyama","value":"Toyama"},
                 {"text":"Ishikawa","value":"Ishikawa"},	
                 {"text":"Fukui","value":"Fukui"},
                 {"text":"Yamanashi","value":"Yamanashi"},
                 {"text":"Nagano","value":"Nagano"},
                 {"text":"Gifu" , "value":"Gifu"},
                 {"text":"Shizuoka","value":"Shizuoka"},
                 {"text":"Aichi","value":"Aichi"},
                 {"text":"Mie","value":"Mie"},	
                 {"text":"Shiga","value":"Shiga"},
                 {"text":"Kyoto","value":"Kyoto"},
                 {"text":"Osaka","value":"Osaka"},
                 {"text":"Hyogo" , "value":"Hyogo"},
                 {"text":"Nara","value":"Nara"},
                 {"text":"Wakayama","value":"Wakayama"},
                 {"text":"Tottori","value":"Tottori"},	
                 {"text":"Shimane","value":"Shimane"},
                 {"text":"Okayama","value":"Okayama"}, 	
                 {"text":"Hiroshima","value":"Hiroshima"},
                 {"text":"Yamaguchi","value":"Yamaguchi"},	
                 {"text":"Tokushima","value":"Tokushima"},
                 {"text":"Kagawa","value":"Kagawa"},
                 {"text":"Ehime","value":"Ehime"},
                 {"text":"Kochi" , "value":"Kochi"},
                 {"text":"Fukuoka","value":"Fukuoka"},
                 {"text":"Saga","value":"Saga"},
                 {"text":"Nagasaki","value":"Nagasaki"},	
                 {"text":"Kumamoto","value":"Kumamoto"},
                 {"text":"Oita","value":"Oita"},	
                 {"text":"Miyazaki","value":"Miyazaki"},	
                 {"text":"Kagoshima","value":"Kagoshima"},
                 {"text":"Okinawa","value":"Okinawa"}]
  return jap_state;
}
function setDeliveryDate_by_Pickup_Location(delivery_date,chkHolidayPopup)
{
  var dddate = null;
  var ddName =null;
  var filter = new Array();
  filter.push(new nlobjSearchFilter('custrecord_all_location',null,'is','T'));
  var column = new Array();
  column.push(new nlobjSearchColumn('custrecord_holiday_date'));
  var result = nlapiSearchRecord('customrecordholiday_table_child',null,filter,column);
  if(chkHolidayPopup==true)
  {
    if(result!=null)
    {
      for(var deldate=0;deldate<result.length;deldate++)
      {
        var holiday_date=  result[deldate].getValue('custrecord_holiday_date');
        if(delivery_date == holiday_date)
        {
          alert('Not a valid date selection due to holiday');
          return false;
        }
      }
    }
  }
  //Ended on 17/05/2017
  var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  // if(chkHolidayPopup==true)
  // {
  delivery_date = exclude_holiday_date(result,delivery_date,weekday);
  //nlapiSetFieldValue('custpage_delivery_date',delivery_date);
  //}
  dddate = new Date(delivery_date);
  ddName = weekday[dddate.getDay()];
  var pickupLocation =  nlapiGetFieldValue('custpage_pickup_location');
  if(pickupLocation =="8") //Denver
  {
    if(ddName == "Tuesday" || ddName =="Monday")
    {
      //alert('Pick-ups are not available on Tuesday & Monday for Denver');
      if(ddName=="Monday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 2);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
      if(ddName=="Tuesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        //nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
    }
  }//Ended on 18/05/2017
  else if(pickupLocation =="4") //Chicago
  {
    if(ddName == "Wednesday" || ddName =="Thursday")
    {
      // alert('Pick-ups are not available on Wednesday & Thursday for Chicago');
      if(ddName=="Thursday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        //nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
      if(ddName=="Wednesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 2);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
    }
  }
  else if(pickupLocation =="3")//Boston
  {
    if(ddName == "Monday" || ddName =="Tuesday")
    {
      //alert('Pick-ups are not available on Monday & Tuesday for Boston');
      if(ddName=="Tuesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
      if(ddName=="Monday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 2);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
    }
  }
  else if(pickupLocation == 6)// SD (San Diego)  
  {
    if(ddName == "Tuesday" || ddName =="Wednesday")
    {
      //alert('Pick-ups are not available on Tuesday & Wednesday for SD (San Diego) & Washington D.C.');
      if(ddName=="Wednesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays( delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        //nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
      if(ddName=="Tuesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 2);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
    }
  }
  else if(pickupLocation == 7)//  Washington D.C.
  {
    if(ddName == "Thursday" || ddName =="Wednesday")
    {
      //alert('Pick-ups are not available on Tuesday & Wednesday for SD (San Diego) & Washington D.C.');
      if(ddName=="Wednesday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays( delivery_date, 2);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
      if(ddName=="Thursday")
      {
        delivery_date=nlapiStringToDate(delivery_date);
        delivery_date=nlapiAddDays(delivery_date, 1);
        delivery_date=nlapiDateToString(delivery_date);
        delivery_date = exclude_holiday_date(result,delivery_date,weekday);
        // nlapiSetFieldValue('custpage_delivery_date',delivery_date);
        return delivery_date;
      }
    }
  }
  return delivery_date;
}
function disableLineItem()
{
  var Shipping_to_BE = nlapiGetCurrentLineItemValue("custpage_items","sublist_shipping_to_be");
  var itemId = nlapiGetCurrentLineItemValue("custpage_items","sublist_item");
  if(itemId !=null && itemId !="")
  {
    var  itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
    if(itemcat!=2 && itemcat!=3 && itemcat!=32 && itemcat!=35 && itemcat!=36)
    {
      nlapiDisableLineItemField('custpage_items', "sublist_item", true);
      nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
      nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
      nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
      nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
      nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
      nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
      nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
      nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
      nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
    }
    else
    {
      if(Shipping_to_BE=='T')
      {
        nlapiDisableLineItemField('custpage_items', "sublist_item", false);
        nlapiDisableLineItemField('custpage_items', "sublist_desc", false);
        nlapiDisableLineItemField('custpage_items', "sublist_amt", false);
        nlapiDisableLineItemField('custpage_items', "sublist_qty", false);
        nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", false);
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", false);
        nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", false); 
        nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", false); 
        nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", false);
        nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", false);
      }
      else
      {
        nlapiDisableLineItemField('custpage_items', "sublist_item", true);
        nlapiDisableLineItemField('custpage_items', "sublist_desc", true);
        nlapiDisableLineItemField('custpage_items', "sublist_amt", true);
        nlapiDisableLineItemField('custpage_items', "sublist_qty", true);
        nlapiDisableLineItemField('custpage_items', "sublist_production_ins_value", true);
        nlapiDisableLineItemField('custpage_items', "sublist_created_from", true);
        nlapiDisableLineItemField('custpage_items', "sublist_center_stone_link", true); 
        nlapiDisableLineItemField('custpage_items', "sublist_related_sales_order", true);
        nlapiDisableLineItemField('custpage_items', "sublist_engraving_text", true);
        nlapiDisableLineItemField('custpage_items', "sublist_type_of_font", true);
      }
    }
  }
}

function remove_add_ReturnLabelStatus_EmailToCustomer(countryCode)
{
  nlapiRemoveSelectOption('custpage_return_label_status',null) ;
  var col = new Array();
  col.push(new nlobjSearchColumn('name')); 
  col.push(new nlobjSearchColumn('internalid').setSort(false)); 
  var results = nlapiSearchRecord('customlist126', null, null, col);
  nlapiInsertSelectOption('custpage_return_label_status' ,'','',true);
  nlapiInsertSelectOption('custpage_return_label_status' ,'-1','- New -',false);
  for(var i=0; i<results.length;i++)
  {
    nlapiInsertSelectOption('custpage_return_label_status' ,results[i].getId() ,results[i].getValue("name"),false);
  }
  if(countryCode !='US')
  {
    nlapiRemoveSelectOption('custpage_return_label_status' , '5');
  }
  nlapiRemoveSelectOption('custpage_return_label_status' , '2');
  nlapiRemoveSelectOption('custpage_return_label_status' , '3');
  nlapiRemoveSelectOption('custpage_return_label_status' , '6');
}
function highLightBackgroundColor()
{
  var Shipping_to_BE = nlapiGetCurrentLineItemValue("custpage_items","sublist_shipping_to_be");
  var engraving_txt = nlapiGetCurrentLineItemValue("custpage_items","sublist_engraving_text");
  var type_of_font = nlapiGetCurrentLineItemValue("custpage_items","sublist_type_of_font");
  var qty = nlapiGetCurrentLineItemValue("custpage_items","sublist_qty");
  var related_sales_order = nlapiGetCurrentLineItemValue("custpage_items","sublist_related_sales_order");
  var center_stone_link = nlapiGetCurrentLineItemValue("custpage_items","sublist_center_stone_link");
  var itemId = nlapiGetCurrentLineItemValue("custpage_items","sublist_item");

  var div = null;
  var  itemcat = null;
  var created_from_disable =null;
  if(itemId !=null && itemId !="")
  {
    itemcat = nlapiLookupField("inventoryitem",itemId,"custitem20");
    if(itemcat == null)
      itemcat = nlapiLookupField("assemblyitem",itemId,"custitem20");
  }
  created_from_disable = nlapiGetCurrentLineItemValue("custpage_items","sublist_created_from_disable");
  if(Shipping_to_BE=='T')
  {
    if(itemcat==2)
    {
      if(created_from_disable == 'F')
      {
        if(qty==null || qty == '')
          document.getElementsByClassName("listinlinefocusedrow")[4].click();
        else if(center_stone_link == null || center_stone_link =='')
          document.getElementsByClassName("listinlinefocusedrow")[8].click();
        else if(engraving_txt == null || engraving_txt =='')
          document.getElementsByClassName("listinlinefocusedrow")[10].click();
        else if(type_of_font == null || type_of_font == '')
          document.getElementsByClassName("listinlinefocusedrowright")[0].click();
      }
      else
      {
        if(qty==null || qty == '')
          document.getElementsByClassName("listinlinefocusedrow")[4].click();
        else if(center_stone_link ==null || center_stone_link =='')
          document.getElementsByClassName("listinlinefocusedrow")[8].click();
        else if(engraving_txt == null || engraving_txt =='')
          document.getElementsByClassName("listinlinefocusedrow")[10].click();
        else if(type_of_font == null || type_of_font == '')
          document.getElementsByClassName("listinlinefocusedrowright")[0].click();

      }
      div = document.getElementById('custpage_items_sublist_center_stone_link_display');
      div.setAttribute("style", "background-color:#fce0d6 !important");

      div = document.getElementById('custpage_items_sublist_related_sales_order_display');
      div.setAttribute("style", "background-color:#white !important");

      div = document.getElementById('sublist_engraving_text');
      div.setAttribute("style", "background-color:#fce0d6 !important");
	  
      // div = document.getElementById('inpt_sublist_type_of_font10'); // Throwing exception - Nikhil - November 01, 2018 So, Commenting and adding new line
	  div = document.getElementById('inpt_sublist_type_of_font12'); // Added by Nikhil on November 01, 2018
      div.setAttribute("style", "background-color:#fce0d6 !important");
    }
    else if(itemcat !=2)
    {
      if(created_from_disable == 'F')
      {
        if(qty==null || qty == '')
          document.getElementsByClassName("listinlinefocusedrow")[4].click();
        if(engraving_txt == null || engraving_txt =='')
          document.getElementsByClassName("listinlinefocusedrow")[10].click();
        else if(type_of_font == null || type_of_font == '')
          document.getElementsByClassName("listinlinefocusedrowright ")[0].click();

        div = document.getElementById('custpage_items_sublist_related_sales_order_display');
        div.setAttribute("style", "background-color:#white !important");

        div = document.getElementById('custpage_items_sublist_center_stone_link_display');
        div.setAttribute("style", "background-color:#white !important");

        div = document.getElementById('sublist_engraving_text');
        div.setAttribute("style", "background-color:#fce0d6 !important");

        // div = document.getElementById('inpt_sublist_type_of_font10'); // Throwing exception - Nikhil - November 01, 2018 So, Commenting and adding new line
		div = document.getElementById('inpt_sublist_type_of_font12'); // Added by Nikhil on November 01, 2018
        div.setAttribute("style", "background-color:#fce0d6 !important");
      }
      else
      {
        if(itemcat =='' || itemcat ==null)
        {
          div = document.getElementById('custpage_items_sublist_related_sales_order_display');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('custpage_items_sublist_center_stone_link_display');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('sublist_engraving_text');
          div.setAttribute("style", "background-color:#white !important");

          // div = document.getElementById('inpt_sublist_type_of_font10'); // Throwing exception - Nikhil - November 01, 2018 So, Commenting and adding new line
		  div = document.getElementById('inpt_sublist_type_of_font12'); // Added by Nikhil on November 01, 2018
          div.setAttribute("style", "background-color:#white !important");
        }
        else
        {
          if(qty==null || qty == '')
            document.getElementsByClassName("listinlinefocusedrow")[4].click();
          else if(related_sales_order==null || related_sales_order =='' )
            document.getElementsByClassName("listinlinefocusedrow")[9].click();
          else if(engraving_txt == null || engraving_txt =='')
            document.getElementsByClassName("listinlinefocusedrow")[10].click();
          else if(type_of_font == null || type_of_font == '')
            document.getElementsByClassName("listinlinefocusedrowright")[0].click();

          div = document.getElementById('custpage_items_sublist_related_sales_order_display');
          div.setAttribute("style", "background-color:#fce0d6 !important");

          div = document.getElementById('custpage_items_sublist_center_stone_link_display');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('sublist_engraving_text');
          div.setAttribute("style", "background-color:#fce0d6 !important");

          // div = document.getElementById('inpt_sublist_type_of_font10'); // Throwing exception - Nikhil - November 01, 2018 So, Commenting and adding new line
		  div = document.getElementById('inpt_sublist_type_of_font12'); // Added by Nikhil on November 01, 2018
          div.setAttribute("style", "background-color:#fce0d6 !important");
        }
      }
    }
  }
  else
  {
    /*if(itemcat==2)
    {
      div = document.getElementById('custpage_items_sublist_center_stone_link_display');
      div.setAttribute("style", "background-color:#fce0d6 !important");
      div = document.getElementById('custpage_items_sublist_related_sales_order_display');
      div.setAttribute("style", "background-color:#white !important");

      div = document.getElementById('sublist_engraving_text');
      div.setAttribute("style", "background-color:#fce0d6 !important");

      div = document.getElementById('inpt_sublist_type_of_font10');
      div.setAttribute("style", "background-color:#fce0d6 !important");
    }
    else if(itemcat !=2)
    {
      if(created_from_disable == 'F')
      {
        div = document.getElementById('custpage_items_sublist_related_sales_order_display');
        div.setAttribute("style", "background-color:#white !important");
        div = document.getElementById('custpage_items_sublist_center_stone_link_display');
        div.setAttribute("style", "background-color:#white !important");

        div = document.getElementById('sublist_engraving_text');
        div.setAttribute("style", "background-color:#fce0d6 !important");

        div = document.getElementById('inpt_sublist_type_of_font10');
        div.setAttribute("style", "background-color:#fce0d6 !important");
      }
      else
      {
        if(itemcat =='' || itemcat ==null)
        {
          div = document.getElementById('custpage_items_sublist_related_sales_order_display');
          div.setAttribute("style", "background-color:#white !important");
          div = document.getElementById('custpage_items_sublist_center_stone_link_display');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('sublist_engraving_text');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('inpt_sublist_type_of_font10');
          div.setAttribute("style", "background-color:#white !important");
        }
        else
        {
          div = document.getElementById('custpage_items_sublist_related_sales_order_display');
          div.setAttribute("style", "background-color:#fce0d6 !important");
          div = document.getElementById('custpage_items_sublist_center_stone_link_display');
          div.setAttribute("style", "background-color:#white !important");

          div = document.getElementById('sublist_engraving_text');
          div.setAttribute("style", "background-color:#fce0d6 !important");

          div = document.getElementById('inpt_sublist_type_of_font10');
          div.setAttribute("style", "background-color:#fce0d6 !important");
        }
      }
    }*/
  }
}


/* Start: NS-1363 - Oct 15, 2018 - Nikhil */

function lockaddress_PI(type) {
/* This function will enable or disable the Address Fields based on value of Pickup at BE checkbox on page initialization. */
    try {
        var pickAtBE = nlapiGetFieldValue('custpage_pickup_at_be');
        
        if (pickAtBE == 'T') {
			// var pickUpLocationField = nlapiGetField('custpage_pickup_location');
			// pickUpLocationField.setMandatory(true);
			nlapiSetFieldMandatory('custpage_pickup_location', true);
			var countryField = nlapiGetField('custpage_country');
			countryField.setDisplayType('disabled');
			nlapiSetFieldMandatory ('custpage_country', false);
			/* var addresseeField = nlapiGetField('custpage_addressee');
			addresseeField.setDisplayType('disabled');
			nlapiSetFieldMandatory ('custpage_addressee', false); */
			var addr2Field = nlapiGetField('custpage_address_2');
			addr2Field.setDisplayType('disabled');
			var addr1Field = nlapiGetField('custpage_address_1');
			addr1Field.setDisplayType('disabled');
			nlapiSetFieldMandatory ('custpage_address_1', false);
			var cityField = nlapiGetField('custpage_city');
			cityField.setDisplayType('disabled');
			nlapiSetFieldMandatory ('custpage_city', false);
			var stateField = nlapiGetField('custpage_state');
			stateField.setDisplayType('disabled');
			var zipField = nlapiGetField('custpage_zip');
			zipField.setDisplayType('disabled');
			nlapiSetFieldMandatory ('custpage_zip', false);
        } else {
			// var pickUpLocationField = nlapiGetField('custpage_pickup_location');
			// pickUpLocationField.setMandatory(false);
			nlapiSetFieldMandatory('custpage_pickup_location', false);
			var countryField = nlapiGetField('custpage_country');
			countryField.setDisplayType('normal');
			nlapiSetFieldMandatory ('custpage_country', true);
			/* var addresseeField = nlapiGetField('custpage_addressee');
			addresseeField.setDisplayType('normal');
			nlapiSetFieldMandatory ('custpage_addressee', true); */
			var addr2Field = nlapiGetField('custpage_address_2');
			addr2Field.setDisplayType('normal');
			var addr1Field = nlapiGetField('custpage_address_1');
			addr1Field.setDisplayType('normal');
			nlapiSetFieldMandatory ('custpage_address_1', true);
			var cityField = nlapiGetField('custpage_city');
			cityField.setDisplayType('normal');
			nlapiSetFieldMandatory ('custpage_city', true);
			var stateField = nlapiGetField('custpage_state');
			stateField.setDisplayType('normal');
			var zipField = nlapiGetField('custpage_zip');
			zipField.setDisplayType('normal');
			nlapiSetFieldMandatory ('custpage_zip', true);
        }
    } catch (ex) {
        nlapiLogExecution('error', 'error : ', ex.message);
        // baseRecordType = document.getElementById('baserecordtype').value;
    }
}

function lockaddress_FC(type, name) {
/* This function will enable or disable the Address Fields based on value of Pickup at BE checkbox whenever the Pickup at BE checkbox is changed. */
    if (name == 'custpage_pickup_at_be') {
        try {
            var pickAtBE = nlapiGetFieldValue('custpage_pickup_at_be');
            if (pickAtBE == 'T') {
				// var pickUpLocationField = nlapiGetField('custpage_pickup_location');
				// pickUpLocationField.setMandatory(true);
				nlapiSetFieldMandatory('custpage_pickup_location', true);
				var countryField = nlapiGetField('custpage_country');
				countryField.setDisplayType('disabled');
				nlapiSetFieldMandatory ('custpage_country', false);
				/* var addresseeField = nlapiGetField('custpage_addressee');
				addresseeField.setDisplayType('disabled');
				nlapiSetFieldMandatory ('custpage_addressee', false); */
				var addr2Field = nlapiGetField('custpage_address_2');
				addr2Field.setDisplayType('disabled');
				var addr1Field = nlapiGetField('custpage_address_1');
				addr1Field.setDisplayType('disabled');
				nlapiSetFieldMandatory ('custpage_address_1', false);
				var cityField = nlapiGetField('custpage_city');
				cityField.setDisplayType('disabled');
				nlapiSetFieldMandatory ('custpage_city', false);
				var stateField = nlapiGetField('custpage_state');
				stateField.setDisplayType('disabled');
				var zipField = nlapiGetField('custpage_zip');
				zipField.setDisplayType('disabled');
				nlapiSetFieldMandatory ('custpage_zip', false);
            } else {
				// var pickUpLocationField = nlapiGetField('custpage_pickup_location');
				// pickUpLocationField.setMandatory('false');
				nlapiSetFieldMandatory('custpage_pickup_location', false);
				var countryField = nlapiGetField('custpage_country');
				countryField.setDisplayType('normal');
				nlapiSetFieldMandatory ('custpage_country', true);
				// Start: Uncommenting lines for NS-1363 - January 17, 2019 - Nikhil
				var addresseeField = nlapiGetField('custpage_addressee');
				addresseeField.setDisplayType('normal');
				nlapiSetFieldMandatory ('custpage_addressee', true);
				// End: Uncommenting lines for NS-1363 - January 17, 2019 - Nikhil
				var addr2Field = nlapiGetField('custpage_address_2');
				addr2Field.setDisplayType('normal');
				var addr1Field = nlapiGetField('custpage_address_1');
				addr1Field.setDisplayType('normal');
				nlapiSetFieldMandatory ('custpage_address_1', true);
				var cityField = nlapiGetField('custpage_city');
				cityField.setDisplayType('normal');
				nlapiSetFieldMandatory ('custpage_city', true);
				var stateField = nlapiGetField('custpage_state');
				stateField.setDisplayType('normal');
				var zipField = nlapiGetField('custpage_zip');
				zipField.setDisplayType('normal');
				nlapiSetFieldMandatory ('custpage_zip', true);
            }
        } catch (ex) {
            nlapiLogExecution('error', 'error : ', ex.message);
            return false;
        }
    }
return true;
}

function addressMandatoryValidation()
{
	if(nlapiGetFieldMandatory('custpage_country'))
	{
		if(!nlapiGetFieldValue('custpage_country'))
		{
			return false;
		}
	}
	if(nlapiGetFieldMandatory('custpage_addressee'))
	{
		if(!nlapiGetFieldValue('custpage_addressee'))
		{
			return false;
		}
	}
	if(nlapiGetFieldMandatory('custpage_address_1'))
	{
		if(!nlapiGetFieldValue('custpage_address_1'))
		{
			return false;
		}
	}
	if(nlapiGetFieldMandatory('custpage_city'))
	{
		if(!nlapiGetFieldValue('custpage_city'))
		{
			return false;
		}
	}
	if(nlapiGetFieldMandatory('custpage_state'))
	{
		if(!nlapiGetFieldValue('custpage_state'))
		{
			return false;
		}
	}
	if(nlapiGetFieldMandatory('custpage_zip'))
	{
		if(!nlapiGetFieldValue('custpage_zip'))
		{
			return false;
		}
	}
	return true;
}

function checkSKU_VL(type) // Need to edit script and add this to the Validate Line Entry Point
{
	if(type == 'custpage_items')
	{
		var arr_restrictedSKU = ['1087131','1093360','66394'];
		if(arr_restrictedSKU.indexOf(nlapiGetCurrentLineItemValue('custpage_items', 'sublist_item')) >= 0)
		{
			alert('Please use the actual item SKU in the item field');
			return false;
		}
	}
	return true;
}


function shipToSelect_FC(type, name)
{
	if(name == 'custpage_ship_to_select')
	{
		var shipToSelectValue = nlapiGetFieldValue('custpage_ship_to_select');
		if(shipToSelectValue && shipToSelectValue != '-1' && shipToSelectValue != null && shipToSelectValue != undefined)
		{
			var arr_addressDetails = getAddressDetailsById(nlapiGetFieldValue('custpage_customer'), shipToSelectValue);
			nlapiSetFieldValue('custpage_country', arr_addressDetails[0].countrycode);
			nlapiSetFieldValue('custpage_addressee', arr_addressDetails[0].addressee);
			nlapiSetFieldValue('custpage_address_2', arr_addressDetails[0].address2);
			nlapiSetFieldValue('custpage_address_1', arr_addressDetails[0].address1);
			nlapiSetFieldValue('custpage_city', arr_addressDetails[0].city);
			nlapiSetFieldValue('custpage_state', arr_addressDetails[0].state);
			nlapiSetFieldValue('custpage_zip', arr_addressDetails[0].zipcode);
		}
		else
		{
			nlapiSetFieldValue('custpage_country', '');
			nlapiSetFieldValue('custpage_addressee', '');
			nlapiSetFieldValue('custpage_address_2', '');
			nlapiSetFieldValue('custpage_address_1', '');
			nlapiSetFieldValue('custpage_city', '');
			nlapiSetFieldValue('custpage_state', '');
			nlapiSetFieldValue('custpage_zip', '');
		}
	}
}


function getAddressDetailsById(customerId, addressSubRecordId)
{
	var customerSearch = nlapiSearchRecord('customer', null,
	[
	   ['internalid', 'anyof', customerId]
	], 
	[
	   new nlobjSearchColumn('addressinternalid', 'Address', null),
	   new nlobjSearchColumn('internalid', 'Address', null),
	   new nlobjSearchColumn('address1', 'Address', null),
	   new nlobjSearchColumn('address2', 'Address', null),
	   new nlobjSearchColumn('city', 'Address', null),
	   new nlobjSearchColumn('state', 'Address', null),
	   new nlobjSearchColumn('countrycode', 'Address', null),
	   new nlobjSearchColumn('zipcode', 'Address', null),
	   new nlobjSearchColumn("addressee","Address",null)
	]
	);
	var arr_addressDetails = [];
	if(customerSearch && customerSearch != null && customerSearch != undefined && customerSearch.length > 0)
	{
		for(var i = 0; i < customerSearch.length; i++)
		{
			if(customerSearch[i].getValue(customerSearch[0].getAllColumns()[0]) == addressSubRecordId)
			{
				arr_addressDetails.push({'addressinternalid': customerSearch[i].getValue(customerSearch[i].getAllColumns()[0]),
				'internalid': customerSearch[i].getValue(customerSearch[i].getAllColumns()[1]),
				'address1': customerSearch[i].getValue(customerSearch[i].getAllColumns()[2]),
				'address2': customerSearch[i].getValue(customerSearch[i].getAllColumns()[3]),
				'city': customerSearch[i].getValue(customerSearch[i].getAllColumns()[4]),
				'state': customerSearch[i].getValue(customerSearch[i].getAllColumns()[5]),
				'countrycode': customerSearch[i].getValue(customerSearch[i].getAllColumns()[6]),
				'zipcode': customerSearch[i].getValue(customerSearch[i].getAllColumns()[7]),
				'addressee': customerSearch[i].getValue(customerSearch[i].getAllColumns()[8])
				});
			}
		}
	}
	return arr_addressDetails;
}
/* End: NS-1363 - Oct 08, 2018 - Nikhil */