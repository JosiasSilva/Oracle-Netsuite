function Repair_DropOff_One(dropOff,form)
{
  try
  {
    //getting the values of repair form
    var customer = request.getParameter("custpage_customer");
    //var dropOff = request.getParameter("custpage_drop_off");
    var deliveryDate = request.getParameter("custpage_delivery_date");
    var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
    var orderID = request.getParameter("custpage_order_id");
    var orderNumber = request.getParameter("custpage_order_num");
    var return_label = request.getParameter("custpage_return_label_status");
   // var notes = request.getParameter("custpage_notes");
	var notes = request.getParameter("custpage_or_notes"); // Added by Bharath
    var salesrep = request.getParameter("custpage_sales_rep");
    var datereceived = request.getParameter("custpage_date_received_at_be");
    // var repairProblem = request.getParameterValues("custpage_repair_problem");
    var locationReceived = request.getParameter("custpage_location_received_at_be");
    var pickupLocation = request.getParameter("custpage_pickup_location");
	var shipToSelect = request.getParameter('custpage_ship_to_select'); // Added by Nikhil for NS-1363 on November 12, 2018
    //var originalOrder = nlapiLoadRecord("salesorder",orderID);
    //var originalSOItem =[];
    /* for(var i=0; i<=originalOrder.getLineItemCount("item"); i++)
    {
      var itemType = originalOrder.getLineItemValue("item","itemtype",i+1);
      if(itemType == "InvtPart")
        originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
      else if(itemType == "Assembly")
        originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
    }*/
    //nlapiLogExecution("Debug","Original SO Item Array",originalSOItem);
    //Get Shipping Information From Form
    var addressee = request.getParameter("custpage_addressee");
    var attention = request.getParameter("custpage_attention");
    var address1 = request.getParameter("custpage_address_1");
    var address2 = request.getParameter("custpage_address_2");
    var city = request.getParameter("custpage_city");
    var state = request.getParameter("custpage_state");
    nlapiLogExecution("Debug","State from list",state);
    var state_txt = request.getParameter("custpage_state_new");
    nlapiLogExecution("Debug","State from textbox",state_txt);
    var zipcode = request.getParameter("custpage_zip");
    var country = request.getParameter("custpage_country");
    nlapiLogExecution('Debug','country',country);
    var country_hid = request.getParameter("custpage_country_hidden");
    nlapiLogExecution('Debug','countryhid',country_hid);
    var delivery_instruction =request.getParameter('custpage_delivery_instruction');
    var delivery_date_notes = request.getParameter('custpage_delivery_date_notes');
    var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017
    var placeofsale = request.getParameter("custpage_place_of_sale");
    var noOfTimesRepaired = request.getParameter("custpage_num_times_repaired");
	
	var addShippingFee = request.getParameter("custpage_add_shipping_fee");
	var statusOfIntlTaxes = request.getParameter("custpage_status_of_international_taxes");

    var customers_reported_repair_issue = request.getParameter("custpage_customers_reported_repair_issue");
    var wear_habits = request.getParameter("custpage_wear_habits");
    var notice_issue = request.getParameter("custpage_notice_issue");
   // var customer_temp = request.getParameter("custpage_customer_temp");
	/* Start: Added by Nikhil Bhutani on October 31, 2018 for NS-1363 */
    var c_temp = request.getParameter("custpage_customer_temp");
	var filters = [];
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', c_temp);
	var columns = [];
	columns[0] = new nlobjSearchColumn('name');
	columns[1] = new nlobjSearchColumn('internalid');
	var searchRec = nlapiSearchRecord('customlist145', null, filters, columns);
	var customer_temp = searchRec[0].getValue('name');
	/* End: Added by Nikhil Bhutani on October 31, 2018 for NS-1363 */
    var insurance_or_bbesp = request.getParameter("custpage_insurance_or_bbesp");
    var contact_inspection = request.getParameter("custpage_contact_inspection");
	
	var repair_notes = request.getParameter("custpage_repair_notes");
	var repInComm = request.getParameter("custpage_rep_in_comm"); // Added by Nikhil on 08 October, 2018 for NS-1363
	
    // so_notes = so_notes + "\n" + customers_reported_repair_issue + "\n" + wear_habits + "\n" + notice_issue + "\n" + customer_temp + "\n" + insurance_or_bbesp + "\n" + contact_inspection ;
    /* Above line is being commented a new line will be entered per NS-1363 on Oct 12, 2018 - Nikhil*/
	so_notes = so_notes + "\n" + "What is the Customers reported repair issue? " + customers_reported_repair_issue + "\n" + "Wear habits? " + wear_habits + "\n" + "When did they notice issue? " + notice_issue + "\n" + "Customer temp? " + customer_temp + "\n" + "Insurance or BBESP? "  + insurance_or_bbesp + "\n" + "Who to contact after inspection? "  + contact_inspection ;
	
    //Create Sales Order
    var soRec = nlapiTransformRecord("customer",customer,"salesorder");
	/* Start: NS-1363 - Oct 08, 2018 - Nikhil */
	
	soRec.setFieldValue("custbody72", repair_notes); //As of now custbody72 is named QA Notes, might change to repair notes. Requirement Doc refers it as Repair Notes
	soRec.setFieldValue("custbody247", repInComm);
	/* End: NS-1363 - Oct 08, 2018 - Nikhil */
    soRec.setFieldValue("class",placeofsale); //Place of Sale - Phone: Not Bank Wire
    soRec.setFieldValue("customform","131"); //Custom BE Repair Order - Invoice
    soRec.setFieldValue("custbody58",so_notes);//Added on 03/06/2017 SO Notes
    var so_number = orderNumber + "RP";
    soRec.setFieldValue("tranid",so_number);

    //Set created from sales order
    //soRec.setFieldValue("custbody_created_from",orderID);

    //Check if transaction ID already exists
    var tranid = soRec.getFieldValue("tranid");
    soRec.setFieldValue("tranid",checkNumber(tranid,1));
    /*
     * 	Updated  as per client feedback doc 20 jun 2017
     * 	3 = Repair for type of order
     */
    soRec.setFieldValue("custbody87",3);
    soRec.setFieldValue("custbody6",deliveryDate);
    soRec.setFieldValue("custbody82",deliveryDateFirm);
    soRec.setFieldValue("custbody254",notes); //OR Notes 
    soRec.setFieldValue("salesrep",salesrep);
    soRec.setFieldValue("custbody36",datereceived);
    soRec.setFieldValue("custbody245",locationReceived);
    soRec.setFieldValue("custbody194",delivery_instruction);
    soRec.setFieldValue("custbody150",delivery_date_notes);  
    // commented by client feedback
    //soRec.setFieldValue("custbody142",11); //Status of Repairs/Resizes
    soRec.setFieldValue("custbody109",6); //Type of Repair
    //soRec.setFieldValue("custbody73",repairProblem); //Repair Problem
    soRec.setFieldValue("custbodyfraud_check_new",1); //fraud check new

    soRec.setFieldValue("custbody_drop_off",dropOff);

    if(return_label!=null && return_label!="")
      soRec.setFieldValue("custbody138",return_label);//RETURN SHIPPING LABEL STATUS

    if(request.getParameter("custpage_pickup_at_be")!=null && request.getParameter("custpage_pickup_at_be")!="")
      soRec.setFieldValue("custbody53",request.getParameter("custpage_pickup_at_be"));

    soRec.setFieldValue("custbody_pickup_location",pickupLocation);

    soRec.setFieldValue("custbody55",0.00); //Amount Paid By Customer

    soRec.setFieldValue("custbody132",3); //Diamond Confirmed New - N/A


    if(request.getParameter("custpage_block_auto_emails")=="T")
    {
      soRec.setFieldValue("custbodyblock_auto_emails","T");
    }
	
	soRec.setFieldValue("custbodystatus_of_international_taxes",statusOfIntlTaxes);
	
	/* Start: Added below code for NS-1363 on October 26, 2018 */
	if (country == 'GB')
	{
		soRec.setFieldValue("currency", "2");
	}
	else if(country == 'CA')
	{
		soRec.setFieldValue("currency", "3");
	}
	else if(country == 'AU')
	{
		soRec.setFieldValue("currency", "5");
	}
	else
	{
		soRec.setFieldValue("currency", "1");
	}
	/* End: Added below code for NS-1363 on October 26, 2018 */
	
    var centerStoneLink=[];
    var comments ='';
    //  nlapiLogExecution("debug","Center Stone Link length " ,centerStoneLink.length);
    var return_label_insurance =0;
    var item_to_be_repaired =[];
    for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
    {
      var shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i);
      nlapiLogExecution("debug","shipping to be 2",shipping_to_be);
	  var itemCategory = request.getLineItemValue("custpage_items", "sublist_item_cat", i);
	  nlapiLogExecution("debug", "itemCategory", itemCategory);
	  var itemPoVendor = request.getLineItemValue("custpage_items", "sublist_item_po_vendor", i);
	  nlapiLogExecution("debug", "itemPoVendor", itemPoVendor);
      if(shipping_to_be == 'T')
      {
        // var newRingSize = request.getLineItemValue("custpage_items", "sublist_new_size", i);
        //nlapiLogExecution("debug","new ring size 2",newRingSize);
        var itemId= request.getLineItemValue("custpage_items", "sublist_item", i);
        //nlapiLogExecution("debug","item Id",itemId);
        var description = request.getLineItemValue("custpage_items", "sublist_desc", i);
        //nlapiLogExecution("debug","description",description);
        var amount = request.getLineItemValue("custpage_items", "sublist_amt", i);
        //nlapiLogExecution("debug","amount",amount);
        var insurance = request.getLineItemValue("custpage_items", "sublist_production_ins_value", i);
        //nlapiLogExecution("debug","insurance",insurance);
        // if(description !=null && description !='')
        //description = description.substring(0,description.indexOf(","));
        //nlapiLogExecution("debug","description 2",description);
        var center_stone_link= request.getLineItemValue("custpage_items", "sublist_center_stone_link", i);
        var item_link_sku= request.getLineItemValue("custpage_items", "sublist_item_link", i);
        nlapiLogExecution("debug","Item Link SKU ",item_link_sku);
        //if(item_link_sku!=null && item_link_sku!='')
          item_to_be_repaired.push(itemId);
        // var item_link_sku_text= request.getLineItemText("custpage_items", "sublist_item_link", i);
        // nlapiLogExecution("debug","item link sku text ",item_link_sku_text);
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
        nlapiLogExecution("debug","Center Stone Link : " + i,center_stone_link);
        if(center_stone_link !=null && center_stone_link !='')
        {
          /* if(centerStoneLink.length==0)
          {
            centerStoneLink.push(center_stone_link);
          }
          else if(centerStoneLink.length>0)
          {
            for(var cslk=0;cslk<centerStoneLink.length;cslk++)
            {
              if(center_stone_link != centerStoneLink[cslk] )
              {
                centerStoneLink.push(center_stone_link);
              }
            }
          }*/
          centerStoneLink.push(center_stone_link);
        }
		
        soRec.selectNewLineItem("item");
        soRec.setCurrentLineItemValue("item","item",1087131); //REPAIR ITEM
		
		/* Start: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */
		var certificateNumber = checkIfDiamond(itemId);
		if(certificateNumber)
		{
			soRec.setCurrentLineItemValue("item","description", description + '\n Certificate Number: ' + certificateNumber);
		}
		else
		{
			soRec.setCurrentLineItemValue("item","description",description);
		}
		/* End: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */
		
        soRec.setCurrentLineItemValue("item","amount",amount);
        soRec.setCurrentLineItemValue("item","custcol_category","");
        soRec.setCurrentLineItemValue("item","rate",amount);//Added by Ravi on 01/05/2017

        soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",insurance);
        soRec.setCurrentLineItemValue("item","custcol_center_gem_item",center_stone_link);
        if(item_link_sku!=null && item_link_sku!='')
          soRec.setCurrentLineItemText("item","custcol_item_sku_so",item_link_sku);
        if(center_stone_link !=null && center_stone_link !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_link,['itemid','salesdescription']);

          comments = "Set With:\n" + "SKU:" +' '+centerStoneItemData.itemid +"\n" +"Description: " + centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
		  /* Start: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */
		  var certificateNumber = checkIfDiamond(itemId);
		  if(certificateNumber)
		  {
			soRec.setCurrentLineItemValue("item","custcol5",'Certificate Number: ' + certificateNumber + '\n' + comments);
		  }
		  else
		  {
			soRec.setCurrentLineItemValue("item","custcol5",comments);
		  }
		  /* End: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */
        }
		/* Start: Added by Nikhil Bhutani on February 19, 2019 for NS-1534 */
		var origSoLookedupFields = nlapiLookupField('salesorder', orderID, ['trandate']);
		nlapiLogExecution('Debug', 'origSoLookedupFields.trandate', origSoLookedupFields.trandate);
		nlapiLogExecution('Debug', 'Date Formatted origSoLookedupFields.trandate', nlapiStringToDate(origSoLookedupFields.trandate));
		nlapiLogExecution('Debug', 'DateDiff in Days', DateDiff.inDays(nlapiStringToDate(origSoLookedupFields.trandate), new Date()));
		if(origSoLookedupFields.trandate && (DateDiff.inDays(nlapiStringToDate(origSoLookedupFields.trandate), new Date()) <= 365))
		{
			if(itemCategory && (itemCategory == '2' || itemCategory == '3'))
			{
				soRec.setCurrentLineItemValue("item", "povendor", itemPoVendor);
			}
		}
		
		/* End: Added by Nikhil Bhutani on February 19, 2019 for NS-1534 */
        soRec.commitLineItem("item");
      }
    }
    nlapiLogExecution("Debug","Item To Be Repaired",JSON.stringify(item_to_be_repaired));
    if(item_to_be_repaired.length>0)
      soRec.setFieldValue('custbody107',item_to_be_repaired[0]);
    soRec.setFieldValue('custbody_center_stone_link',centerStoneLink);
    soRec.setFieldValue('custbody_return_label_insurance',return_label_insurance);
    nlapiLogExecution("Debug","No Of Times Repaired",noOfTimesRepaired);
    if(parseInt(noOfTimesRepaired)>0)
    {
      if(parseInt(noOfTimesRepaired)<=6)
        soRec.setFieldValue('custbody108',parseInt(noOfTimesRepaired));
    }
	
	//Add shipping fee if required
	if(addShippingFee=="T")
	{
		soRec.selectNewLineItem("item");
		soRec.setCurrentLineItemValue("item","item","2379833"); //International Shipping Fee
		soRec.setCurrentLineItemValue("item","quantity","1");
		soRec.commitLineItem("item");
	}
	
    //Set created from sales order
    var  itemChkFlag ='0';
    var related_Sales_Order ='';
    var arr_related_Sales_Order =[];
    for(var i=0;i<request.getLineItemCount("custpage_items");i++)
    {
      // nlapiLogExecution("Debug","Resize Page Item Value",request.getLineItemValue("custpage_items", "sublist_item", i+1));
      // nlapiLogExecution("Debug","Original  Item Value",originalSOItem[i]);
      var sublist_shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i+1) ;
      if(sublist_shipping_to_be =='T')
      {
        // if(request.getLineItemValue("custpage_items", "sublist_item", i+1) != originalSOItem[i])
        // {

        related_Sales_Order = request.getLineItemValue("custpage_items", "sublist_related_sales_order", i+1);
        if(related_Sales_Order!='' && related_Sales_Order!=null)
          arr_related_Sales_Order.push(related_Sales_Order);
        //nlapiLogExecution("Debug","Related Sales Order",related_Sales_Order);
        //related_Sales_Order =related_Sales_Order.replace(/,/g,'');
        //nlapiLogExecution("Debug","Related Sales Order replace comma ,",related_Sales_Order);
        // itemChkFlag ='1';

        //}
      }

    }
    // nlapiLogExecution("debug","test",itemChkFlag);
    //if(itemChkFlag=='0')
    soRec.setFieldValue("custbody_created_from",orderID);
    //if(itemChkFlag =='1')
    soRec.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);
    //Update Shipping Address if Necessary
    var updateAddress = false;
	/* Start: Added by Nikhil on November 12, 2018 for NS-1363 */
	
	if(shipToSelect && shipToSelect != '-1' && shipToSelect != null && shipToSelect != undefined)
	{
		soRec.setFieldValue('shipaddresslist', shipToSelect);
	}
	
	/* End: Added by Nikhil on November 12, 2018 for NS-1363 */
	/*
	else
	{
	*/
		if(address1 != soRec.getFieldValue("shipaddr1"))
		  updateAddress = true;
		if(!updateAddress && address2 != soRec.getFieldValue("shipaddr2"))
		  updateAddress = true;
		if(!updateAddress && city != soRec.getFieldValue("shipcity"))
		  updateAddress = true;
		if(!updateAddress && zipcode != soRec.getFieldValue("shipzip"))
		  updateAddress = true;
		if(!updateAddress && country != soRec.getFieldValue("shipcountry"))
		  updateAddress = true;
		if(!updateAddress && addressee != soRec.getFieldValue("shipaddressee"))
		  updateAddress = true;
		if(!updateAddress && attention != soRec.getFieldValue("shipattention"))
		  updateAddress = true;
		if(state!='' && state!=null)
		{
		  if(!updateAddress && state != soRec.getFieldValue("shipstate"))
			updateAddress = true;
		}
		else if(state_txt!='' && state_txt!=null)
		{
		  if(!updateAddress && state_txt != soRec.getFieldValue("shipstate"))
			updateAddress = true;
		}
		nlapiLogExecution("Debug","Update Address",updateAddress);
		if(updateAddress)
		{ 	  
		  /* Start: Commenting below code for NS-1363 - Nikhil */
		  /*
		  var shipaddress = "";
		  var final_state='';
		  if(state!=''&& state!=null)
			final_state = state;
		  else if(state_txt!=''&& state_txt!=null)
			final_state = state_txt;
		  nlapiLogExecution("debug","final state",final_state);
		  if(attention!=null && attention!="")
			shipaddress += attention + "\n";
		  shipaddress += addressee + "\n";
		  shipaddress += address1 + "\n";
		  if(address2!=null && address2!="")
			shipaddress += address2 + "\n";
		  shipaddress += city + " " + final_state + " " + zipcode + "\n";
		  //shipaddress += country;
		  shipaddress += country_hid;
		  nlapiLogExecution("Debug","ship address",shipaddress);
		  // soRec.setFieldValue("shipaddress",shipaddress); // Not working
		  */
		  /* End: Commenting below code for NS-1363 - Nikhil */
		  
		  /* Start: Added by Nikhil Bhutani on October 17, 2018 for NS-1363 */
		  var final_state='';
		  if(state!=''&& state!=null)
			final_state = state;
		  else if(state_txt!=''&& state_txt!=null)
			final_state = state_txt;
		
		
		  var customerObj = nlapiLoadRecord('customer', customer);
		  customerObj.selectNewLineItem('addressbook');
		  var subrecord = customerObj.createCurrentLineItemSubrecord('addressbook','addressbookaddress')
		  customerObj.setCurrentLineItemValue('addressbook', 'defaultshipping', 'F'); //This field is not a subrecord field.
		  customerObj.setCurrentLineItemValue('addressbook', 'defaultbilling', 'F');  //This field is not a subrecord field.
		  customerObj.setCurrentLineItemValue('addressbook', 'label', address1); //This field is not a subrecord field.
		  customerObj.setCurrentLineItemValue('addressbook', 'isresidential', 'F');  //This field is not a subrecord field.
		  

		  //set subrecord fields
		  subrecord.setFieldValue('country', country); //Country must be set before setting the other address fields
		  subrecord.setFieldValue('attention', attention);
		  subrecord.setFieldValue('addressee', addressee);
		  subrecord.setFieldValue('addr1', address1);
		  subrecord.setFieldValue('addr2', address2);
		  subrecord.setFieldValue('city', city);
		  subrecord.setFieldValue('state', final_state);
			// if the address is not in U.S., Canada, or Australia, use
			// state instead of dropdownstate. For example,
			// subrecord.setFieldValue('state', 'BY');
			// for Bavaria, Germany
		  subrecord.setFieldValue('zip', zipcode);

			//commit subrecord and line item
		  subrecord.commit();
		  customerObj.commitLineItem('addressbook');
		  var savedCustomer = '';
		  savedCustomer = nlapiSubmitRecord(customerObj);
		  nlapiLogExecution('Debug', 'New Address Created and Customer Saved', 'Customer ID: ' + savedCustomer);
		  
		  /* End: Added by Nikhil Bhutani on October 17, 2018 for NS-1363 */
		  
		  /* Start: Commenting below code for NS-1363 - Nikhil */
		  /*
		  var so_subrecord = soRec.editSubrecord("shippingaddress");
		  so_subrecord.setFieldValue("country",country);
		  //so_subrecord.setFieldValue("country",country_hid);
		  so_subrecord.setFieldValue("addressee",addressee);
		  if(attention!=null && attention!="")
			so_subrecord.setFieldValue("attention",attention);
		  so_subrecord.setFieldValue("addr1",address1);
		  so_subrecord.setFieldValue("addr2",address2);
		  so_subrecord.setFieldValue("city",city);
		  if(state!=''&& state!=null)
			so_subrecord.setFieldValue("state",state);
		  else if(state_txt!=''&& state_txt!=null)
			so_subrecord.setFieldValue("state",state_txt);
		  so_subrecord.setFieldValue("zip",zipcode);
		  so_subrecord.commit();
		  */
		  /* End: Commenting above code for NS-1363 - Nikhil */
		  
		}
	/*
	}
	*/
	/* 
	Start: Commenting below code on October 26, 2018 per NS-1363
    var currency_value=nlapiLookupField('salesorder',orderID,'currency');
    soRec.setFieldValue("currency",currency_value);
	*/
	
	try
	{
		var repairOrderID = nlapiSubmitRecord(soRec, true, true);
	}
	catch(ex)
	{
		nlapiLogExecution("Debug","Error occurred while Submitting the record", ex.message);
	}
	/* Start: Added on November 1, 2018 for NS-1363 - Nikhil */
	
	/* Start: Added on November 12, 2018 for NS-1363 - Nikhil */
	
	if(repairOrderID  && shipToSelect && shipToSelect != '-1' && shipToSelect != null && shipToSelect != undefined)
	{
		nlapiSubmitField('salesorder', repairOrderID, 'shipaddresslist', shipToSelect, true);
	}
	
	/* End: Added on November 12, 2018 for NS-1363 - Nikhil */
	if(repairOrderID && savedCustomer && savedCustomer != '' && savedCustomer != null && savedCustomer != undefined)
	{
		var cObj = nlapiLoadRecord('customer', savedCustomer);
		var selectAddr = cObj.getLineItemValue('addressbook', 'internalid', cObj.getLineItemCount('addressbook'));
		nlapiLogExecution('Debug', 'selectAddr: ' + selectAddr, 'LineItemCount: ' + cObj.getLineItemCount('addressbook'));
		nlapiSubmitField('salesorder', repairOrderID, 'shipaddresslist', selectAddr, true);
	}
	/* End: Added on November 1, 2018 for NS-1363 - Nikhil */
    var redirectUrl =  nlapiResolveURL ("RECORD" , "salesorder" , repairOrderID , "view" ) ;
    // var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
    nlapiLogExecution("Debug","Relative Redirect URL",redirectUrl);
    //Redirect user to new sales order
    var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
    htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ redirectUrl +'" ; window.close(); </script>');
    response.writePage(form);
  }
  catch(err)
  {
    nlapiLogExecution("error","Repair Page Processing Error in if block","Details: " + err.message);
    return true;
  }
}

/* Start: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */
function checkIfDiamond(itemId)
{
	var arr_diamonds = ["7"]; // 7 -  Loose Diamond
	var item_fields = nlapiLookupField('item', itemId, ['custitem20','custitem46']);
	if(arr_diamonds.indexOf(item_fields.custitem20) >= 0)
	{
		return item_fields.custitem46;
	}
	else
	{
		return null;
	}
}
/* End: Added by Nikhil Bhutani on October 15, 2018 for NS-1363 */

/* Start: Added by Nikhil Bhutani on February 19, 2019 for NS-1534 */
var DateDiff = {
 
    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return parseInt((t2-t1)/(24*3600*1000));
    },
 
    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return parseInt((t2-t1)/(24*3600*1000*7));
    },
 
    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
 
        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
 
    inYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}

/*
Function Test:
var dString = "May, 20, 1984";
var d1 = new Date(dString);
var d2 = new Date();
DateDiff.inDays(d1, d2);
DateDiff.inWeeks(d1, d2);
DateDiff.inMonths(d1, d2);
DateDiff.inYears(d1, d2);
*/
/* End: Added by Nikhil Bhutani on February 19, 2019 for NS-1534 */