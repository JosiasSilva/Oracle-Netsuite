function Matched_Wedding_Band_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus)
{

  var form = nlapiCreateForm('Send Label to Customer'); 
  var orderId = request.getParameter("custpage_order_id");
  nlapiLogExecution("Debug","order id",orderId);
  var orderNumber = request.getParameter("custpage_order_num");
  nlapiLogExecution("debug","orderNumber",orderNumber);
  /* start get data from previous page*/
  var customer = request.getParameter("custpage_customer");
  var deliveryDate = request.getParameter("custpage_delivery_date");
  var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
  var orNotes = request.getParameter("custpage_or_notes");
  var salesrep = request.getParameter("custpage_sales_rep");
  var datereceived = request.getParameter("custpage_date_received_at_be");
  var locationReceived = request.getParameter("custpage_location_received_at_be");
  var pickupLocation = request.getParameter("custpage_pickup_location");



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
  var country_hid = request.getParameter("custpage_country_hidden");
  var delivery_instruction =request.getParameter('custpage_delivery_instruction');
  var delivery_date_notes = request.getParameter('custpage_delivery_date_notes');
  var pickup_at_be = request.getParameter('custpage_pickup_at_be');
  var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017
  var placeofsale = request.getParameter("custpage_place_of_sale");
  /* end here*/

  /* start here Set get data values */
  form.addField("custpage_order_num","text","Order Number").setDisplayType('hidden').setDefaultValue(orderNumber);
  form.addField("custpage_customer","text","Customer").setDisplayType('hidden').setDefaultValue(customer);
  form.addField("custpage_delivery_date","text","Delivery Date").setDisplayType('hidden').setDefaultValue(deliveryDate);
  form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm").setDisplayType('hidden').setDefaultValue(deliveryDateFirm);
  form.addField("custpage_or_notes","textarea","Or Notes").setDisplayType('hidden').setDefaultValue(orNotes);
  form.addField("custpage_sales_rep","text","Sales Rep").setDisplayType('hidden').setDefaultValue(salesrep);
  form.addField("custpage_date_received_at_be","text","Date Received").setDisplayType('hidden').setDefaultValue(datereceived);
  form.addField("custpage_location_received_at_be","text","Location Received").setDisplayType('hidden').setDefaultValue(locationReceived);
  form.addField("custpage_pickup_location","text","Pick-up Loaction").setDisplayType('hidden').setDefaultValue(pickupLocation);
  form.addField("custpage_drop_off","text","Drop Off").setDisplayType('hidden').setDefaultValue(dropOff);
  form.addField("custpage_so_notes","textarea","Sales Order Notes").setDisplayType('hidden').setDefaultValue(so_notes);//Added on 03/06/2017  
  //start here set shipping information
  form.addField("custpage_addressee","text","addressee").setDisplayType('hidden').setDefaultValue(addressee);
  form.addField("custpage_attention","text","attention").setDisplayType('hidden').setDefaultValue(attention);
  form.addField("custpage_address_1","text","address1").setDisplayType('hidden').setDefaultValue(address1);
  form.addField("custpage_address_2","text","address2").setDisplayType('hidden').setDefaultValue(address2);
  form.addField("custpage_city","text","city").setDisplayType('hidden').setDefaultValue(city);
  form.addField("custpage_state","text","state").setDisplayType('hidden').setDefaultValue(state);
  form.addField("custpage_state_new","text","state new").setDisplayType('hidden').setDefaultValue(state_txt);
  form.addField("custpage_zip","text","zipcode").setDisplayType('hidden').setDefaultValue(zipcode);
  form.addField("custpage_country","text","country").setDisplayType('hidden').setDefaultValue(country);
  form.addField("custpage_delivery_instruction","text","delivery_instruction").setDisplayType('hidden').setDefaultValue(delivery_instruction);
  form.addField("custpage_delivery_date_notes","textarea","delivery_date_notes").setDisplayType('hidden').setDefaultValue(delivery_date_notes);
  form.addField("custpage_country_hidden","text","country hidden").setDisplayType('hidden').setDefaultValue(country_hid);
  form.addField("custpage_pickup_at_be","checkbox","Pick At Be").setDisplayType('hidden').setDefaultValue(pickup_at_be);
  form.addField("custpage_place_of_sale","text","Place Of Sale").setDisplayType('hidden').setDefaultValue(placeofsale);
  // end here
  /* end here */

  // set ship service for return label creation 
  /*var shipService = setShipService(orderId);
  var tranidFld = form.addField("custpage_tranid","text","Transaction #");
  tranidFld.setDisplayType("hidden");
  tranidFld.setDefaultValue(shipService[1]);
  nlapiLogExecution("Debug","Trans Id",shipService[1]);

  var fld = form.addField("custpage_service_type","text","Ship Service");
  fld.setDisplayType('hidden');
  fld.setDefaultValue(shipService[0]);
  nlapiLogExecution("Debug","Ship Service",shipService[0]);*/



  fld = form.addField("custpage_order_id","text","Sales Order Internal ID");
  fld.setDefaultValue(orderId);
  fld.setDisplayType("hidden");
  var custEmail= nlapiLookupField('salesorder',orderId,'custbody2');



  try
  { 
    // form.addTab("custpage_matched_wedding_band_review_tab","");
    // form.addSubTab("custpage_matched_wedding_band_review_subtab","").setLabel('New Item Ordered');
    form.addSubmitButton('Send Label');    

    var emailType ="matchedweddingband";
    var script = emailPreview(orderId,emailType);
    form.addButton('custpage_email_preview','Preview Email', script); 

    var edit_EmailTemplate = editEmailTemplate(orderId,emailType);
    form.addButton('custpage_edit_email_template','Edit Email Template', edit_EmailTemplate);

    // form.addButton('custpage_back', 'Back', "window.history.go(-2);");

    var postSaleType='7';
    // var backDataUrl_LandingPage =  backDataUrlLandingPage(orderId,postSaleType);
    //nlapiLogExecution("Debug","Back Data Url for Matched & Wedding Band",backDataUrl_LandingPage);
    // form.addButton('custpage_back_btn', 'Back',backDataUrl_LandingPage);
    //form.setScript('customscript_copy_others');
    form.setScript('customscript_back_data_url');
    form.addButton('custpage_back_btn','Back','Back_Data_Url_on_Send_label_to_Customer('+orderId+','+postSaleType+')');
    // form.addButton('custpage_refresh_final_page','Refresh', "pageRefresh()");
    form.addButton('custpage_close', 'Close', "window.close();" ); 
    form.addField('custpage_matched_wedding_band_id','text').setDisplayType('hidden').setDefaultValue('7');

    form.addField("custpage_email_address","text","Email Address").setMandatory(true).setDefaultValue(custEmail);
    form.addField('custpage_copy_email_template_id','text','Copy Email Template').setDisplayType('hidden').setDefaultValue('0');  
    var sublistcopyemail = form.addSubList('custpage_employee_list', 'inlineeditor', 'Select people to copy in this email or add email addresses directly from the list below.');
    sublistcopyemail.addField('custpage_copy_others','select', 'Copy Others','employee');
    sublistcopyemail.addField('custpage_email','text', 'Email');
    sublistcopyemail.addField('custpage_email_cc','checkbox', 'CC');
    sublistcopyemail.addField('custpage_email_bcc','checkbox', 'BCC');
    var return_label_insurance =0;     
    var rtnItemBe =[];  
    for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
    {
      var shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i);
      if(shipping_to_be == 'T')
      {
        var itemId= request.getLineItemValue("custpage_items", "sublist_item", i);
        nlapiLogExecution("debug","item Id",itemId);
        var itemName = nlapiLookupField('inventoryitem',itemId,"itemid");
        if(itemName==null || itemName =='')
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        var description = request.getLineItemValue("custpage_items", "sublist_desc", i);
        nlapiLogExecution("debug","description",description);
        var amount = request.getLineItemValue("custpage_items", "sublist_amt", i);
        nlapiLogExecution("debug","amount 11",amount);
        var quantity = request.getLineItemValue("custpage_items", "sublist_qty", i);
        nlapiLogExecution("debug","amount",quantity);
        var insurance = request.getLineItemValue("custpage_items", "sublist_production_ins_value", i);
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
        var saleAmt = request.getLineItemValue("custpage_items", "sublist_sale_amount", i);  
        var itemLink = request.getLineItemValue("custpage_items", "sublist_item_link", i);
        var createdFrom = request.getLineItemValue("custpage_items", "sublist_created_from", i);
        var centerStoneLink = request.getLineItemValue("custpage_items", "sublist_center_stone_link", i); 
        var relatedSalesOrder = request.getLineItemValue("custpage_items", "sublist_related_sales_order", i);
        rtnItemBe.push({
          custpage_rtn_item:itemId,
          desc :description,
          amount : amount,
          custpage_rtn_item_sale_amt : saleAmt,
          quantity : quantity,
          custpage_rtn_item_production_ins_val : insurance,
          custpage_rtn_item_link : itemLink,
          custpage_rtn_item_created_from :  createdFrom,
          custpage_rtn_item_center_stone_link : centerStoneLink,
          custpage_rtn_item_related_sales_order : relatedSalesOrder,
          itemText :itemName
        });  
      }
    }
    nlapiLogExecution("Debug","Production Insurance Value",return_label_insurance);
    form.addField("custpage_insurance_val","currency","Production Insuranace Value").setDisplayType('hidden').setDefaultValue(return_label_insurance);
    var  item_rtn_be=form.addSubList('custpage_customer_item_returning_be', 'list', '');//Customer Item Returning to BE
    item_rtn_be.addField('custpage_rtn_item','select', 'Item','item').setDisplayType('hidden');
    item_rtn_be.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_rtn_be.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_sale_amt','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_rtn_be.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_newsize','text', 'New Size').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_production_ins_val','currency','Production Insurance Value').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_link','text', 'Item SKU').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_created_from','select','CREATED FROM','transaction').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_center_stone_link','select','Center Stone SKU','item').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_related_sales_order','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_rtn_be.setLineItemValues(rtnItemBe);
    var new_item_ordered_arr =[];
    for(var x=0; x < request.getLineItemCount("custpage_new_items"); x++)
    {
      var  itemId = request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1);
      var itemName = nlapiLookupField('inventoryitem',itemId,"itemid");
      if(itemName==null || itemName =='')
        itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
      new_item_ordered_arr.push({
        new_order_item : request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1),
        desc : request.getLineItemValue("custpage_new_items","custpage_new_items_desc",x+1),
        quantity : request.getLineItemValue("custpage_new_items","custpage_new_items_qty",x+1),
        rate : request.getLineItemValue("custpage_new_items","custpage_new_items_rate",x+1),
        amount: request.getLineItemValue("custpage_new_items","custpage_new_items_amount",x+1),
        production_insurance_value: request.getLineItemValue("custpage_new_items","custpage_new_items_production_insurance_value",x+1),
        center_stone_sku: request.getLineItemValue("custpage_new_items","custpage_center_stone_sku",x+1),
        itemText :itemName
      });
    }
    var  new_item_ordered_be=form.addSubList('custpage_new_item_order', 'list', '');//New Item Ordered
    new_item_ordered_be.addField('new_order_item','select', 'Item','item').setDisplayType('inline');
    new_item_ordered_be.addField('desc','textarea', 'Description').setDisplayType('hidden');
    new_item_ordered_be.addField('amount','currency', 'Amount').setDisplayType('hidden');
    new_item_ordered_be.addField('rate','currency', 'Rate').setDisplayType('hidden');
    new_item_ordered_be.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    new_item_ordered_be.addField('production_insurance_value','currency', 'Production Insurance Value').setDisplayType('hidden');
    new_item_ordered_be.addField('center_stone_sku','select', 'Item','item').setDisplayType('hidden');
    new_item_ordered_be.setLineItemValues(new_item_ordered_arr);


    var return_customer_items_return_to_be = Customer_Items_Return_to_BE(rtnItemBe);
    var return_new_Item_Ordered_Html = new_Item_Ordered_Html(new_item_ordered_arr);

    if(return_customer_items_return_to_be !='')
      form.addField('custpage_customer_item_return_to_be_html', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_customer_items_return_to_be);

    if(return_new_Item_Ordered_Html !='')
      form.addField('custpage_new_item_ordered_html', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_new_Item_Ordered_Html);


    form.addField('custpage_hide_tbl', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(0).setDefaultValue("<style type='text/css'>          span#custpage_customer_item_returning_belnkdot{display:none;} span#custpage_new_item_orderlnkdot{display:none;} .uir-outside-fields-table{width:100%;}</style>");


    form.addField('custpage_copy_email_address', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(0).setDefaultValue("<style type='text/css'> .uir-table-block{position:absolute;top:242px!important;padding-right:40px!important;}div.uir-machine-table-container{height:140px!important;overflow:scroll !important;}</style>");

    
    response.writePage(form);
    deleteNewEmailTemplate();
  }
  catch(err)
  {
    nlapiLogExecution("error","Matched Wedding Band Item(s) if block","Details: " + err.message);
    return true;
  }
}      
function new_Item_Ordered_Html(new_items_ordered)
{
  var new_Item_Html ='';
  if(new_items_ordered.length>0)
  {
    new_Item_Html =new_Item_Html + '<div style="border: 1px solid #CCCCCC !important;">';
    new_Item_Html =new_Item_Html + '<table width="100%"  border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    new_Item_Html =new_Item_Html + '<tbody>';
    new_Item_Html =new_Item_Html + '<tr>';
    new_Item_Html =new_Item_Html + '<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">New Item(s) Ordered</td>';
    new_Item_Html =new_Item_Html + '</tr>';
    new_Item_Html =new_Item_Html+ '<tr class="uir-machine-headerrow">';
    new_Item_Html =new_Item_Html +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    new_Item_Html =new_Item_Html +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    new_Item_Html =new_Item_Html+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    new_Item_Html =new_Item_Html +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    new_Item_Html =new_Item_Html +'</tr>';
    for(var i=0; i < new_items_ordered.length; i++)
    {
      new_Item_Html =new_Item_Html+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      new_Item_Html =new_Item_Html +'<td class="uir-list-row-cell listtext">'+ new_items_ordered[i].itemText  +'</td>';
      //new_Item_Html =new_Item_Html +'<td class="uir-list-row-cell listtext"><textarea rows="2" cols="100" readonly>'+  new_items_ordered[i].desc +'</textarea></td>';
      new_Item_Html =new_Item_Html +'<td class="uir-list-row-cell listtext"><label>'+  new_items_ordered[i].desc +'</label></td>';
      new_Item_Html =new_Item_Html +'<td class="uir-list-row-cell listtext" align="center">'+ new_items_ordered[i].quantity +'</td>';
      new_Item_Html =new_Item_Html+ '<td class="uir-list-row-cell listtext" align="right">'+ new_items_ordered[i].amount +'</td>';
      new_Item_Html =new_Item_Html +'</tr>';
    }
    new_Item_Html =new_Item_Html+'</tbody>';
    new_Item_Html =new_Item_Html +'</table>';
    new_Item_Html =new_Item_Html +'</div>';
  }
  nlapiLogExecution("Debug","View [New Item Ordered Matched & Wedding Band] Html", new_Item_Html);
  return new_Item_Html;
}
function Customer_Items_Return_to_BE(cust_items_return_to_be)
{
  var customer_Item_Return_to_BE ='';
  if(cust_items_return_to_be.length>0)
  {
    customer_Item_Return_to_BE =customer_Item_Return_to_BE + '<div style="border: 1px solid #CCCCCC !important;">';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<tbody>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE+ '<tr>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Customer Item Return to BE</td>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE + '</tr>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE + '<tr class="uir-machine-headerrow">';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE+'</tr>';
    for(var i=0; i < cust_items_return_to_be.length; i++)
    {
      customer_Item_Return_to_BE = customer_Item_Return_to_BE+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="uir-list-row-cell listtext">'+ cust_items_return_to_be[i].itemText  +'</td>';
      // customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="uir-list-row-cell listtext"> <textarea rows="2" cols="100" readonly>'+  cust_items_return_to_be[i].desc +'</textarea></td>';
      customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="uir-list-row-cell listtext"><label>'+ cust_items_return_to_be[i].desc +'</label></td>';
      customer_Item_Return_to_BE = customer_Item_Return_to_BE +'<td class="uir-list-row-cell listtext" align="center">'+ cust_items_return_to_be[i].quantity +'</td>';
      customer_Item_Return_to_BE = customer_Item_Return_to_BE+ '<td class="uir-list-row-cell listtext" align="right">'+ cust_items_return_to_be[i].amount +'</td>';
      customer_Item_Return_to_BE = customer_Item_Return_to_BE +'</tr>';
    }
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'</tbody>';
    customer_Item_Return_to_BE = customer_Item_Return_to_BE +'</table>';
    customer_Item_Return_to_BE =customer_Item_Return_to_BE + '</div>';
    nlapiLogExecution("Debug","View[Customer Item Return to BE Matched & Wedding Band] Html",customer_Item_Return_to_BE);
  }
  return customer_Item_Return_to_BE;
}
