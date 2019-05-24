function Upgrade_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus)
{
  var form = nlapiCreateForm('Send Label to Customer'); 
  var orderId = request.getParameter("custpage_order_id");
  nlapiLogExecution("Debug","order id",orderId);
  var orderNumber = request.getParameter("custpage_so_num");
  /* start get data from previous page*/
  var customer = request.getParameter("custpage_customer");
  /*  start here upgrade value             */
  var trandate = request.getParameter("custpage_date");
  var created_from = request.getParameter("custpage_created_from");
  //var original_salesrep = request.getParameter("custpage_orig_sales_rep"); commented as per client feedback.
  //var new_salesrep = request.getParameter("custpage_new_sales_rep");
  var so_notes = request.getParameter("custpage_so_imp_notes");
  var return_reason = request.getParameter("custpage_reason_for_return");
  var type_of_send_back = request.getParameter("custpage_type_of_send_back");
  var exchange_notes = request.getParameter("custpage_exchange_notes");
  var orNotes = request.getParameter("custpage_or_notes");
  var actual_ship_date = request.getParameter("custpage_actual_ship_date");
  var delivery_date = request.getParameter("custpage_delivery_date");
  var delivery_date_firm = request.getParameter("custpage_delivery_date_firm");
  var date_received_at_be = request.getParameter("custpage_date_received_at_be");
  var pickup_at_be = request.getParameter("custpage_pickup_at_be");
  var place_of_sale = request.getParameter("custpage_place_of_sale");
  //var amount_paid = request.getParameter("custpage_amount_paid");
  var so_total = request.getParameter("custpage_so_total");
  var locationReceived = request.getParameter("custpage_location_received_at_be");
  var pickupLocation = request.getParameter("custpage_pickup_location");
  var rma = request.getParameter("custpage_rma");
  /*      end here upgrade value        */
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
  /* end here*/
  /* start here Set get data values */
  form.addField("custpage_so_num","text","Order Number").setDisplayType('hidden').setDefaultValue(orderNumber);
  form.addField("custpage_customer","text","Customer").setDisplayType('hidden').setDefaultValue(customer);
  form.addField("custpage_delivery_date","text","Delivery Date").setDisplayType('hidden').setDefaultValue(delivery_date);
  form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm").setDisplayType('hidden').setDefaultValue(delivery_date_firm);
  form.addField("custpage_date_received_at_be","text","Date Received").setDisplayType('hidden').setDefaultValue(date_received_at_be);
  form.addField("custpage_location_received_at_be","text","Location Received").setDisplayType('hidden').setDefaultValue(locationReceived);
  form.addField("custpage_pickup_location","text","Pick-up Loaction").setDisplayType('hidden').setDefaultValue(pickupLocation);
  form.addField("custpage_drop_off","text","Drop Off").setDisplayType('hidden').setDefaultValue(dropOff);
  form.addField("custpage_date","text","date").setDisplayType('hidden').setDefaultValue(trandate);
  form.addField("custpage_created_from","text","created from").setDisplayType('hidden').setDefaultValue(created_from);
  //form.addField("custpage_orig_sales_rep","text","Original Sales Rep").setDisplayType('hidden').setDefaultValue(original_salesrep);
  //form.addField("custpage_new_sales_rep","text","New Sale Rep").setDisplayType('hidden').setDefaultValue(new_salesrep);
  form.addField("custpage_so_imp_notes","textarea","So Notes").setDisplayType('hidden').setDefaultValue(so_notes);
  form.addField("custpage_reason_for_return","text","Return Reason").setDisplayType('hidden').setDefaultValue(return_reason);
  form.addField("custpage_type_of_send_back","text","Type Of Sand Back").setDisplayType('hidden').setDefaultValue(type_of_send_back);
  form.addField("custpage_exchange_notes","textarea","Exchange Note").setDisplayType('hidden').setDefaultValue(exchange_notes);
  form.addField("custpage_or_notes","textarea","Or Note").setDisplayType('hidden').setDefaultValue(orNotes); 
  form.addField("custpage_actual_ship_date","text","Actual ship date").setDisplayType('hidden').setDefaultValue(actual_ship_date);
  form.addField("custpage_pickup_at_be","text","pickup at be").setDisplayType('hidden').setDefaultValue(pickup_at_be);
  form.addField("custpage_place_of_sale","text","place of sale").setDisplayType('hidden').setDefaultValue(place_of_sale);
  //form.addField("custpage_amount_paid","text","amount paid").setDisplayType('hidden').setDefaultValue(amount_paid);
  form.addField("custpage_so_total","text","so total").setDisplayType('hidden').setDefaultValue(so_total);
  form.addField("custpage_rma","text","rma").setDisplayType('hidden').setDefaultValue(rma);
  // form.addField("custpage_return_label_status","text","return label status").setDisplayType('hidden').setDefaultValue(return_shipping_label);
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
    form.addSubmitButton('Send Label');   
    var emailType ="upgrade";
    var script = emailPreview(orderId,emailType);
    form.addButton('custpage_email_preview','Preview Email', script); 
    var edit_EmailTemplate = editEmailTemplate(orderId,emailType);
    form.addButton('custpage_edit_email_template','Edit Email Template', edit_EmailTemplate); 
    //form.addButton('custpage_back', 'Back', "window.history.go(-2);");
    var postSaleType='6';
    // var backDataUrl_LandingPage =  backDataUrlLandingPage(orderId,postSaleType);
    //nlapiLogExecution("Debug","Back Data Url for Upgrade",backDataUrl_LandingPage);
    //form.addButton('custpage_back_btn', 'Back',backDataUrl_LandingPage);
    form.setScript('customscript_back_data_url');
    form.addButton('custpage_back_btn','Back','Back_Data_Url_on_Send_label_to_Customer('+orderId+','+postSaleType+')');
    // form.addButton('custpage_refresh_final_page','Refresh', "pageRefresh()");
    form.addButton('custpage_close', 'Close', "window.close();" ); 
    form.addField('custpage_upgrade_id','text').setDisplayType('hidden').setDefaultValue('6');
    //form.setScript('customscript_copy_others');
    form.addField("custpage_upgrade_client","text").setDisplayType('hidden').setDefaultValue(8);
    form.addField("custpage_email_address","text","Email Address").setMandatory(true).setDefaultValue(custEmail);
    form.addField('custpage_copy_email_template_id','text','Copy Email Template').setDisplayType('hidden').setDefaultValue('0');  
    var sublistcopyemail = form.addSubList('custpage_employee_list', 'inlineeditor', 'Select people to copy in this email or add email addresses directly from the list below.');
    sublistcopyemail.addField('custpage_copy_others','select', 'Copy Others','employee');
    sublistcopyemail.addField('custpage_email','text', 'Email');
    sublistcopyemail.addField('custpage_email_cc','checkbox', 'CC');
    sublistcopyemail.addField('custpage_email_bcc','checkbox', 'BCC');
    var return_label_insurance =0;     
    var return_label_insurance_ra =0;
    var return_label_insurance_rtn_item_ra_exchange=0;
    var items_return_ra = [];
    var items_exchange_ra = [];
    var items_return_resize = [];
    var items_return_repair = [];
    var items_return_cust_be = [];
    for(var x=0; x < request.getLineItemCount("custpage_items_returning"); x++)
    {
      var returingOption=request.getLineItemValue("custpage_items_returning","custpage_items_returning_check",x+1);
      var ins =0;
      if(returingOption=="1")
      {
        var  itemId = request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1);
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemName==null || itemName =='')
        {
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        }
        nlapiLogExecution("debug","itemName",itemName);
        items_return_ra.push({
          item : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1),
          quantity : request.getLineItemValue("custpage_items_returning","custpage_items_returning_qty",x+1),
          amount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_amount",x+1),
          saleamount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_sale_amount",x+1),
          units : request.getLineItemValue("custpage_items_returning","custpage_items_returning_units",x+1),
          unitsprice : request.getLineItemValue("custpage_items_returning","custpage_items_returning_unit_price",x+1),
          desc : request.getLineItemValue("custpage_items_returning","custpage_items_returning_desc",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          insurance :request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1),
          itemText : itemName,
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1)
        });
        ins =parseFloat(ins) + request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1);
        if(ins != null && ins !="")
        {
          return_label_insurance = parseFloat(return_label_insurance) + parseFloat(ins);
          //return_label_insurance_rtn_item_ra_exchange = parseFloat(return_label_insurance_rtn_item_ra_exchange) + parseFloat(ins);
        }
      }
      else if(returingOption =='2')
      {
        var  itemId = request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1);
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemName==null || itemName =='')
        {
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        }
        nlapiLogExecution("debug","itemName",itemName);
        items_exchange_ra.push({
          item : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1),
          quantity : request.getLineItemValue("custpage_items_returning","custpage_items_returning_qty",x+1),
          amount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_amount",x+1),
          saleamount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_sale_amount",x+1),
          units : request.getLineItemValue("custpage_items_returning","custpage_items_returning_units",x+1),
          unitsprice : request.getLineItemValue("custpage_items_returning","custpage_items_returning_unit_price",x+1),
          desc : request.getLineItemValue("custpage_items_returning","custpage_items_returning_desc",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          insurance :request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1),
          itemText : itemName,
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1)
        });
        ins =parseFloat(ins) + request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1);
        if(ins != null && ins !="")
        {
          return_label_insurance = parseFloat(return_label_insurance) + parseFloat(ins);
          //return_label_insurance_rtn_item_ra_exchange = parseFloat(return_label_insurance_rtn_item_ra_exchange) + parseFloat(ins);
        }
      }
      else if(returingOption =='3')
      {
        var  itemId = request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1);
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemName==null || itemName =='')
        {
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        }
        nlapiLogExecution("debug","itemName",itemName);
        items_return_resize.push({
          item : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1),
          quantity : request.getLineItemValue("custpage_items_returning","custpage_items_returning_qty",x+1),
          amount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_amount",x+1),
          saleamount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_sale_amount",x+1),
          units : request.getLineItemValue("custpage_items_returning","custpage_items_returning_units",x+1),
          unitsprice : request.getLineItemValue("custpage_items_returning","custpage_items_returning_unit_price",x+1),
          desc : request.getLineItemValue("custpage_items_returning","custpage_items_returning_desc",x+1),
          insurance :request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          itemText : itemName,
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)
        });
        ins =parseFloat(ins) + request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1);
        if(ins != null && ins !="")
          return_label_insurance = parseFloat(return_label_insurance) + parseFloat(ins);
      }
      else if(returingOption =='4')
      { 
        var  itemId = request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1);
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemName==null || itemName =='')
        {
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        }
        nlapiLogExecution("debug","itemName",itemName);
        items_return_repair.push({
          item : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1),
          quantity : request.getLineItemValue("custpage_items_returning","custpage_items_returning_qty",x+1),
          amount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_amount",x+1),
          saleamount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_sale_amount",x+1),
          units : request.getLineItemValue("custpage_items_returning","custpage_items_returning_units",x+1),
          unitsprice : request.getLineItemValue("custpage_items_returning","custpage_items_returning_unit_price",x+1),
          desc : request.getLineItemValue("custpage_items_returning","custpage_items_returning_desc",x+1),
          insurance :request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          itemText : itemName,
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)
        });
        ins =parseFloat(ins) + request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1);
        if(ins != null && ins !="")
          return_label_insurance = parseFloat(return_label_insurance) + parseFloat(ins);
      }   
      else if(returingOption =='5')
      {

        var  itemId = request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1);
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemName==null || itemName =='')
        {
          itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
        }
        nlapiLogExecution("debug","itemName",itemName);
        items_return_cust_be.push({
          item : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item",x+1),
          quantity : request.getLineItemValue("custpage_items_returning","custpage_items_returning_qty",x+1),
          amount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_amount",x+1),
          saleamount : request.getLineItemValue("custpage_items_returning","custpage_items_returning_sale_amount",x+1),
          units : request.getLineItemValue("custpage_items_returning","custpage_items_returning_units",x+1),
          unitsprice : request.getLineItemValue("custpage_items_returning","custpage_items_returning_unit_price",x+1),
          desc : request.getLineItemValue("custpage_items_returning","custpage_items_returning_desc",x+1),                        
          insurance :request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder :request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          itemText : itemName,
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)

        });
        ins =request.getLineItemValue("custpage_items_returning","custpage_items_returning_production_ins_value",x+1);
        if(ins != null && ins !="")
          return_label_insurance = parseFloat(return_label_insurance) + parseFloat(ins);
      }   
    }
    nlapiLogExecution("Debug","Production Insurance Value(all the items except new item)",return_label_insurance);
    form.addField("custpage_insurance_val","currency","Production Insuranace Value").setDisplayType('hidden').setDefaultValue(return_label_insurance);
    // form.addField("custpage_insurance_val_ra_exchange","currency","Production Insuranace Value").setDisplayType('hidden').setDefaultValue(return_label_insurance_rtn_item_ra_exchange);
    nlapiLogExecution("debug","Before Final (POST) Items Returning Retrieved RA ",JSON.stringify(items_return_ra));
    nlapiLogExecution("debug","After Final (POST) Items Exchange RA",JSON.stringify(items_exchange_ra));
    nlapiLogExecution("debug","After Final (POST) Items Resize",JSON.stringify(items_return_resize));
    nlapiLogExecution("debug","After Final (POST) Items Repair",JSON.stringify(items_return_repair));
    nlapiLogExecution("debug","Before Final (POST) Items Returning Retrieved Customer shipping At be",JSON.stringify(items_return_cust_be));

    var new_items = [];
    for(var x=0; x < request.getLineItemCount("custpage_new_items"); x++)
    {
      var  itemId = request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1);
      var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
      if(itemName==null || itemName =='')
      {
        itemName = nlapiLookupField('assemblyitem',itemId,"itemid");
      }
      nlapiLogExecution("debug","itemName",itemName);
      new_items.push({
        item : request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1),
        quantity : request.getLineItemValue("custpage_new_items","custpage_new_items_qty",x+1),
        rate : request.getLineItemValue("custpage_new_items","custpage_new_items_rate",x+1),
        amount : request.getLineItemValue("custpage_new_items","custpage_new_items_amount",x+1),
        desc : request.getLineItemValue("custpage_new_items","custpage_new_items_desc",x+1),
        production_insurance_value : request.getLineItemValue("custpage_new_items","custpage_new_items_production_insurance_value",x+1),
        center_stone_sku :request.getLineItemValue("custpage_new_items","custpage_new_items_center_stone_sku",x+1),
        itemText :itemName
      });
    }
    nlapiLogExecution("debug","Before Final(POST) New Item List Retrieved",JSON.stringify(new_items));

    var  item_resize=form.addSubList('custpage_resize_item', 'list', ''); // Resize Item
    item_resize.addField('item','select', 'Item','item').setDisplayType('hidden');
    item_resize.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_resize.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_resize.addField('saleamount','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_resize.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_resize.addField('unitsprice','currency', 'Units price').setDisplayType('hidden');;
    item_resize.addField('units','integer', 'Units').setDisplayType('hidden');
    item_resize.addField('insurance','currency','Production Insurance Value').setDisplayType('hidden');
    item_resize.addField('centerstone','select', 'Center Stone SKU','item').setDisplayType('hidden');
    item_resize.addField('relatedsalesorder','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_resize.addField('itemsku','text','Item Sku').setDisplayType('hidden');
    item_resize.addField('disablecreatedfrom','checkbox','Disable Created From').setDisplayType('hidden');
    item_resize.setLineItemValues(items_return_resize);

    var  item_repair=form.addSubList('custpage_repair_item', 'list', ''); // Repair Item
    item_repair.addField('item','select', 'Item','item').setDisplayType('hidden');
    item_repair.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_repair.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_repair.addField('saleamount','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_repair.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_repair.addField('unitsprice','currency', 'Units price').setDisplayType('hidden');;
    item_repair.addField('units','integer', 'Units').setDisplayType('hidden');
    item_repair.addField('insurance','currency','Production Insurance Value').setDisplayType('hidden');
    item_repair.addField('centerstone','select', 'Center Stone SKU','item').setDisplayType('hidden');
    item_repair.addField('relatedsalesorder','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_repair.addField('itemsku','text','Item Sku').setDisplayType('hidden');
    item_repair.addField('disablecreatedfrom','checkbox','Disable Created From').setDisplayType('hidden');
    item_repair.setLineItemValues(items_return_repair);

    var  item_rtn_be=form.addSubList('custpage_customer_item_returning_be', 'list', '');//Customer Item Returning to BE
    item_rtn_be.addField('item','select', 'Item','item').setDisplayType('hidden');
    item_rtn_be.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_rtn_be.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_rtn_be.addField('saleamount','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_rtn_be.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_rtn_be.addField('unitsprice','currency', 'Units price').setDisplayType('hidden');;
    item_rtn_be.addField('units','integer', 'Units').setDisplayType('hidden');
    item_rtn_be.addField('insurance','currency','Production Insurance Value').setDisplayType('hidden');
    item_rtn_be.addField('centerstone','select', 'Center Stone SKU','item').setDisplayType('hidden');
    item_rtn_be.addField('relatedsalesorder','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_rtn_be.addField('itemsku','text','Item Sku').setDisplayType('hidden');
    item_rtn_be.addField('disablecreatedfrom','checkbox','Disable Created From').setDisplayType('hidden');
    item_rtn_be.setLineItemValues(items_return_cust_be);

    var  item_ra=form.addSubList('custpage_item_ra', 'list', '');//Returning For Credit
    item_ra.addField('item','select', 'Item','item').setDisplayType('hidden');
    item_ra.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_ra.addField('units','integer', 'Units').setDisplayType('hidden');
    item_ra.addField('unitsprice','currency', 'Units price').setDisplayType('hidden');;
    item_ra.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_ra.addField('saleamount','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_ra.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_ra.addField('itemsku','text', 'Item Sku').setDisplayType('hidden');
    item_ra.addField('insurance','currency', 'Production Insurance Value').setDisplayType('hidden');
    item_ra.addField('disablecreatedfrom','checkbox','Disable Created From').setDisplayType('hidden');
    item_ra.addField('centerstone','select', 'Center Stone SKU','item').setDisplayType('hidden');
    item_ra.addField('relatedsalesorder','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_ra.setLineItemValues(items_return_ra);

    var  item_exchange_ra=form.addSubList('custpage_item_exchange_ra', 'list', '');//Item Exchange RA
    item_exchange_ra.addField('item','select', 'Item','item').setDisplayType('hidden');
    item_exchange_ra.addField('desc','textarea', 'Description').setDisplayType('hidden');
    item_exchange_ra.addField('units','integer', 'Units').setDisplayType('hidden');
    item_exchange_ra.addField('unitsprice','currency', 'Units price').setDisplayType('hidden');;
    item_exchange_ra.addField('amount','currency', 'Amount').setDisplayType('hidden');
    item_exchange_ra.addField('saleamount','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_exchange_ra.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    item_exchange_ra.addField('itemsku','text', 'Item Sku').setDisplayType('hidden');
    item_exchange_ra.addField('insurance','currency', 'Production Insurance Value').setDisplayType('hidden');
    item_exchange_ra.addField('disablecreatedfrom','checkbox','Disable Created From').setDisplayType('hidden');
    item_exchange_ra.addField('centerstone','select', 'Center Stone SKU','item').setDisplayType('hidden');
    item_exchange_ra.addField('relatedsalesorder','select','Related Sales Order(s)','transaction').setDisplayType('hidden');
    item_exchange_ra.setLineItemValues(items_exchange_ra);

    var  new_item_ordered_be=form.addSubList('custpage_new_item_order', 'list', '');//New Item Ordered
    new_item_ordered_be.addField('item','select', 'Item','item').setDisplayType('hidden');
    new_item_ordered_be.addField('desc','textarea', 'Description').setDisplayType('hidden');
    new_item_ordered_be.addField('amount','currency', 'Amount').setDisplayType('hidden');
    new_item_ordered_be.addField('rate','currency', 'Rate').setDisplayType('hidden');
    new_item_ordered_be.addField('quantity','integer', 'Quantity').setDisplayType('hidden');
    new_item_ordered_be.addField('production_insurance_value','currency', 'Production Insurance Value').setDisplayType('hidden');
    new_item_ordered_be.addField('center_stone_sku','select', 'Item','item').setDisplayType('hidden');
    new_item_ordered_be.setLineItemValues(new_items);


    var return_item_Resize_Html_Upgrade = item_Resize_Html_Upgrade(items_return_resize);
    var return_item_Repair_Html_Upgrade = item_Repair_Html_Upgrade(items_return_repair);
    var return_customer_Items_Return_to_BE_Upgrade = customer_Items_Return_to_BE_Upgrade(items_return_cust_be);
    var return_item_Return_RA_Upgrade = item_Return_RA_Upgrade(items_return_ra);
    var return_items_Exchange_RA_Upgrade  =items_Exchange_RA_Upgrade(items_exchange_ra);
    var return_new_Item_Ordered_Html_Upgrade = new_Item_Ordered_Html_Upgrade(new_items);

    var chk_repair = true;
    var chk_resize = true;
    var chk_customer_item_ret_be = true;
    var chk_item_ret_ra = true;
    var chk_item_exchange_ra = true;
    var chk_new_item_order = true;

    if(return_item_Resize_Html_Upgrade !='')
      form.addField('custpage_item_resize_html', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_item_Resize_Html_Upgrade);
    else
      chk_resize =false;
    if(return_item_Repair_Html_Upgrade!='')
    {
      if(chk_resize == false)
        form.addField('custpage_item_repair_html_10', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_item_Repair_Html_Upgrade);
      else
        form.addField('custpage_item_repair_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_item_Repair_Html_Upgrade);
    }
    else
      chk_repair = false;
    if(return_customer_Items_Return_to_BE_Upgrade!='')
    {
      if(chk_resize == false && chk_repair==false)
        form.addField('custpage_customer_item_return_to_be_html_10', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_customer_Items_Return_to_BE_Upgrade);
      else if(chk_resize == true && chk_repair==true)
        form.addField('custpage_customer_item_return_to_be_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_customer_Items_Return_to_BE_Upgrade);
      else
        form.addField('custpage_customer_item_return_to_be_html_2', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_customer_Items_Return_to_BE_Upgrade);
    }
    else
      chk_customer_item_ret_be = false;
    if(return_item_Return_RA_Upgrade!='')
    {
      if(chk_resize == false && chk_repair==false && chk_customer_item_ret_be==false)
        form.addField('custpage_returning_for_credit_html_10', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_item_Return_RA_Upgrade);
      else if(chk_resize == true && chk_repair==true && chk_customer_item_ret_be==true)
        form.addField('custpage_returning_for_credit_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_item_Return_RA_Upgrade);
      else
        form.addField('custpage_returning_for_credit_html_2', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_item_Return_RA_Upgrade);
    }
    else
      chk_item_ret_ra = false;
    if(return_items_Exchange_RA_Upgrade!='')
    {
      if(chk_resize == false && chk_repair==false && chk_customer_item_ret_be==false && chk_item_ret_ra==false)
        form.addField('custpage_item_exchange_html_10', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_items_Exchange_RA_Upgrade);
      else if(chk_resize == true && chk_repair==true && chk_customer_item_ret_be==true && chk_item_ret_ra==true)
        form.addField('custpage_item_exchange_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_items_Exchange_RA_Upgrade);
      else
        form.addField('custpage_item_exchange_html_2', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_items_Exchange_RA_Upgrade);
    }
    else
      chk_item_exchange_ra =false;
    if(return_new_Item_Ordered_Html_Upgrade !='')
    {
      if(chk_resize == false && chk_repair==false && chk_customer_item_ret_be==false && chk_item_ret_ra==false && chk_item_exchange_ra == false)
        form.addField('custpage_new_item_ordered_html_10', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(10).setDefaultValue(return_new_Item_Ordered_Html_Upgrade);
      else if(chk_resize == true && chk_repair==true && chk_customer_item_ret_be==true && chk_item_ret_ra==true && chk_item_exchange_ra == true)
        form.addField('custpage_new_item_ordered_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_new_Item_Ordered_Html_Upgrade);
      else
        form.addField('custpage_new_item_ordered_html_1', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(1).setDefaultValue(return_new_Item_Ordered_Html_Upgrade);
    }
    else
      chk_new_item_order = false;
    form.addField('custpage_hide_tbl', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(0).setDefaultValue("<style type='text/css'>          span#custpage_customer_item_returning_belnkdot{display:none;} span#custpage_item_ralnkdot{display:none;} span#custpage_new_item_orderlnkdot{display:none;} span#custpage_resize_itemlnkdot{display:none;} span#custpage_repair_itemlnkdot{display:none;} .uir-outside-fields-table{width:100%;} span#custpage_item_exchange_ralnkdot{display:none;}</style>");

    form.addField('custpage_copy_email_address', 'inlinehtml').setLayoutType('outsidebelow', 'startrow').setPadding(0).setDefaultValue("<style type='text/css'> .uir-table-block{position:absolute;top:242px!important;padding-right:40px!important;}div.uir-machine-table-container{height:140px!important;overflow:scroll !important;}</style>");

   
    
    response.writePage(form);
    
     deleteNewEmailTemplate();
  }
  catch(err)
  {
    nlapiLogExecution("error","upgrade(s) if block","Details: " + err.message);
    return true;
  }
}

function new_Item_Ordered_Html_Upgrade(new_items_ordered_upgrade)
{
  nlapiLogExecution("Debug","New Item Ordered(upgrade) Array Html",JSON.stringify(new_items_ordered_upgrade));
  nlapiLogExecution("Debug","New Item Ordered(upgrade) Length", new_items_ordered_upgrade.length);
  var new_Item_Html_upgrade ='';
  if(new_items_ordered_upgrade.length>0)
  {
    new_Item_Html_upgrade =new_Item_Html_upgrade + '<div style="border: 1px solid #CCCCCC !important;">';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<tbody>';
    new_Item_Html_upgrade = new_Item_Html_upgrade+ '<tr>';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">New Item(s) Ordered</td>';
    new_Item_Html_upgrade = new_Item_Html_upgrade+ '</tr>';
    new_Item_Html_upgrade = new_Item_Html_upgrade + '<tr class="uir-machine-headerrow">';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<td  class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    new_Item_Html_upgrade = new_Item_Html_upgrade+ '<td  class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    new_Item_Html_upgrade = new_Item_Html_upgrade +'<td  class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    new_Item_Html_upgrade = new_Item_Html_upgrade+'</tr>';

    for(var i=0; i < new_items_ordered_upgrade.length; i++)
    {
      new_Item_Html_upgrade = new_Item_Html_upgrade+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      new_Item_Html_upgrade = new_Item_Html_upgrade +'<td class="uir-list-row-cell listtext">'+ new_items_ordered_upgrade[i].itemText  +'</td>';
      //new_Item_Html_upgrade = new_Item_Html_upgrade +'<td class="uir-list-row-cell listtext"><textarea rows="2" cols="100" readonly disabled>'+  new_items_ordered_upgrade[i].desc +'</textarea></td>';
      new_Item_Html_upgrade = new_Item_Html_upgrade +'<td class="uir-list-row-cell listtext"><label>'+ new_items_ordered_upgrade[i].desc +'</label></td>';
      new_Item_Html_upgrade = new_Item_Html_upgrade +'<td class="uir-list-row-cell listtext" align="center">'+ new_items_ordered_upgrade[i].quantity +'</td>';
      new_Item_Html_upgrade = new_Item_Html_upgrade+ '<td class="uir-list-row-cell listtext" align="right">'+ new_items_ordered_upgrade[i].amount +'</td>';
      new_Item_Html_upgrade = new_Item_Html_upgrade+'</tr>';
    }
    new_Item_Html_upgrade = new_Item_Html_upgrade +'</tbody>';
    new_Item_Html_upgrade = new_Item_Html_upgrade+'</table>';
    new_Item_Html_upgrade =new_Item_Html_upgrade +'</div>';
    nlapiLogExecution("Debug","View New Item Ordered[Upgrade] Html",new_Item_Html_upgrade);
  }
  return new_Item_Html_upgrade;
}

function item_Resize_Html_Upgrade(item_resize_upgrade)
{
  nlapiLogExecution("Debug","Items Resize(upgrade) Array",JSON.stringify(item_resize_upgrade));
  var item_resize_html_upgrade ='';
  if(item_resize_upgrade.length>0)
  {
    item_resize_html_upgrade = item_resize_html_upgrade +  '<div style="border: 1px solid #CCCCCC !important;">';
    item_resize_html_upgrade = item_resize_html_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    item_resize_html_upgrade = item_resize_html_upgrade+'<tbody>';
    item_resize_html_upgrade = item_resize_html_upgrade + '<tr>';
    item_resize_html_upgrade = item_resize_html_upgrade +'<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Resize</td>';
    item_resize_html_upgrade = item_resize_html_upgrade + '</tr>';
    item_resize_html_upgrade = item_resize_html_upgrade + '<tr class="uir-machine-headerrow">';
    item_resize_html_upgrade = item_resize_html_upgrade +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    item_resize_html_upgrade = item_resize_html_upgrade +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    item_resize_html_upgrade = item_resize_html_upgrade+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    item_resize_html_upgrade = item_resize_html_upgrade +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    item_resize_html_upgrade = item_resize_html_upgrade+'</tr>';
    for(var i=0; i < item_resize_upgrade.length; i++)
    {
      var desc=item_resize_upgrade[i].desc ;
      nlapiLogExecution("Debug","Resize(upgrade) Description",desc);
      if(desc==null || desc=="")
      {
        desc="";
      }
      item_resize_html_upgrade = item_resize_html_upgrade+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      item_resize_html_upgrade = item_resize_html_upgrade+'<td class="uir-list-row-cell listtext">'+ item_resize_upgrade[i].itemText  +'</td>';
      // item_resize_html_upgrade = item_resize_html_upgrade+'<td class="uir-list-row-cell listtext"> <textarea rows="2" cols="100" readonly disabled>'+desc+'</textarea></td>';
      item_resize_html_upgrade = item_resize_html_upgrade+'<td class="uir-list-row-cell listtext"><label>'+desc+'</label></td>';
      item_resize_html_upgrade = item_resize_html_upgrade +'<td class="uir-list-row-cell listtext" align="center">'+ item_resize_upgrade[i].quantity +'</td>';
      item_resize_html_upgrade = item_resize_html_upgrade+ '<td class="uir-list-row-cell listtext" align="right">'+ item_resize_upgrade[i].amount +'</td>';
      item_resize_html_upgrade = item_resize_html_upgrade+'</tr>';
    }
    item_resize_html_upgrade = item_resize_html_upgrade +'</tbody>';
    item_resize_html_upgrade = item_resize_html_upgrade +'</table>';
    item_resize_html_upgrade = item_resize_html_upgrade +'</div>';
    nlapiLogExecution("Debug","View Resize(upgrade) Html",item_resize_html_upgrade);
  }
  return item_resize_html_upgrade;
}

function item_Repair_Html_Upgrade(items_repair_upgrade)
{
  nlapiLogExecution("Debug","Items Repair(upgrade) Array",JSON.stringify(items_repair_upgrade));
  var item_repair_html_upgrade ='';
  if(items_repair_upgrade.length>0)
  {
    item_repair_html_upgrade = item_repair_html_upgrade +  '<div style="border: 1px solid #CCCCCC !important;">';
    item_repair_html_upgrade = item_repair_html_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    item_repair_html_upgrade = item_repair_html_upgrade +'<tbody>';
    item_repair_html_upgrade = item_repair_html_upgrade + '<tr>';
    item_repair_html_upgrade = item_repair_html_upgrade +'<td height="100%"  colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Repair</td>';
    item_repair_html_upgrade = item_repair_html_upgrade + '</tr>';
    item_repair_html_upgrade = item_repair_html_upgrade + '<tr class="uir-machine-headerrow">';
    item_repair_html_upgrade = item_repair_html_upgrade +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    item_repair_html_upgrade = item_repair_html_upgrade +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    item_repair_html_upgrade = item_repair_html_upgrade+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    item_repair_html_upgrade = item_repair_html_upgrade +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    item_repair_html_upgrade = item_repair_html_upgrade+'</tr>';
    for(var i=0; i < items_repair_upgrade.length; i++)
    {
      item_repair_html_upgrade = item_repair_html_upgrade+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      item_repair_html_upgrade = item_repair_html_upgrade +'<td class="uir-list-row-cell listtext">'+ items_repair_upgrade[i].itemText  +'</td>';
      //item_repair_html_upgrade = item_repair_html_upgrade+'<td class="uir-list-row-cell listtext"> <textarea rows="2" cols="100" readonly disabled>'+ items_repair_upgrade[i].desc +'</textarea></td>';
      item_repair_html_upgrade = item_repair_html_upgrade+'<td class="uir-list-row-cell listtext"><label>'+ items_repair_upgrade[i].desc +'</label></td>';
      item_repair_html_upgrade = item_repair_html_upgrade +'<td class="uir-list-row-cell listtext" align="center">'+ items_repair_upgrade[i].quantity +'</td>';
      item_repair_html_upgrade = item_repair_html_upgrade+ '<td class="uir-list-row-cell listtext" align="right">'+ items_repair_upgrade[i].amount +'</td>';
      item_repair_html_upgrade = item_repair_html_upgrade +'</tr>';
    }
    item_repair_html_upgrade = item_repair_html_upgrade +'</tbody>';
    item_repair_html_upgrade = item_repair_html_upgrade+'</table>';
    item_repair_html_upgrade = item_repair_html_upgrade + '</div>';
    nlapiLogExecution("Debug","View Repair(upgrade) Html", item_repair_html_upgrade);
  }
  return  item_repair_html_upgrade;
}

function customer_Items_Return_to_BE_Upgrade(customer_items_to_be_upgrade)
{
  nlapiLogExecution("Debug","Customer Item return to BE(upgrade) Array",JSON.stringify(customer_items_to_be_upgrade));
  var customer_item_return_to_be_upgrade ='';
  if(customer_items_to_be_upgrade.length>0)
  {
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade + '<div style="border: 1px solid #CCCCCC !important;">';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<tbody>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade + '<tr>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td height="100%" colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Customer Item Return to BE</td>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade + '</tr>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade + '<tr class="uir-machine-headerrow">';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade+'</tr>';

    for(var i=0; i < customer_items_to_be_upgrade.length; i++)
    {
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="uir-list-row-cell listtext">'+ customer_items_to_be_upgrade[i].itemText  +'</td>';
      //customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="uir-list-row-cell listtext"> <textarea rows="2" cols="100" readonly disabled>'+  customer_items_to_be_upgrade[i].desc +'</textarea></td>';
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="uir-list-row-cell listtext"><label>'+customer_items_to_be_upgrade[i].desc +'</label></td>';
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'<td class="uir-list-row-cell listtext" align="center">'+ customer_items_to_be_upgrade[i].quantity +'</td>';
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade+ '<td class="uir-list-row-cell listtext" align="right">'+ customer_items_to_be_upgrade[i].amount +'</td>';
      customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'</tr>';
    }
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'</tbody>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'</table>';
    customer_item_return_to_be_upgrade = customer_item_return_to_be_upgrade +'</div>';
    nlapiLogExecution("Debug","View Customer Item Return to BE(upgrade) Html",customer_item_return_to_be_upgrade);
  }
  return customer_item_return_to_be_upgrade;
}

function item_Return_RA_Upgrade(items_return_ra_upgrade)
{
  nlapiLogExecution("Debug","Item Return RA(upgrade) Array",JSON.stringify(items_return_ra_upgrade));
  var items_return_ra_html_upgrade ='';
  if(items_return_ra_upgrade.length>0)
  {
    items_return_ra_html_upgrade = items_return_ra_html_upgrade + '<div style="border: 1px solid #CCCCCC !important;">';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade+'<tbody>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade + '<tr>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Return</td>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade + '</tr>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade+ '<tr class="uir-machine-headerrow">';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td  class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade+ '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade+'</tr>';

    for(var i=0; i < items_return_ra_upgrade.length; i++)
    {
      items_return_ra_html_upgrade = items_return_ra_html_upgrade+ '<tr class="uir-list-row-tr uir-list-row-odd">';
      items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td class="uir-list-row-cell listtext">'+ items_return_ra_upgrade[i].itemText  +'</td>';
      //items_return_ra_html_upgrade = items_return_ra_html_upgrade+'<td class="uir-list-row-cell listtext"><textarea rows="2" cols="100" readonly disabled>'+  items_return_ra_upgrade[i].desc +'</textarea></td>';
      items_return_ra_html_upgrade = items_return_ra_html_upgrade+'<td class="uir-list-row-cell listtext"><label>'+ items_return_ra_upgrade[i].desc +'</label></td>';
      items_return_ra_html_upgrade = items_return_ra_html_upgrade +'<td class="uir-list-row-cell listtext" align="center">'+ items_return_ra_upgrade[i].quantity +'</td>';
      items_return_ra_html_upgrade = items_return_ra_html_upgrade+ '<td class="uir-list-row-cell listtext" align="right">'+ items_return_ra_upgrade[i].amount +'</td>';
      items_return_ra_html_upgrade = items_return_ra_html_upgrade+'</tr>';
    }
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'</tbody>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'</table>';
    items_return_ra_html_upgrade = items_return_ra_html_upgrade +'</div>';
    nlapiLogExecution("Debug","View Item Return RA (upgrade) Html",  items_return_ra_html_upgrade);
  }
  return   items_return_ra_html_upgrade;
}

function items_Exchange_RA_Upgrade(items_exchange_ra_upgrade)
{
  nlapiLogExecution("Debug","Item Exchange RA (upgrade) Array",JSON.stringify(items_exchange_ra_upgrade));
  var items_exchange_ra_html_upgrade ='';
  if(items_exchange_ra_upgrade.length>0)
  {
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade + '<div style="border: 1px solid #CCCCCC !important;">';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'<table width="100%" border="0" cellspacing="0" cellpadding="0" class="bgsubtabbar">';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<tbody>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade + '<tr>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td colspan="4" class="formsubtabon formsubtabtext formsubtabtexton">Exchange</td>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  + '</tr>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  + '<tr class="uir-machine-headerrow">';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td class="listheadertdleft listheadertextb uir-column-large"><div class="listheader">Item</div></td>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'<td class="listheadertd listheadertextb uir-column-large"><div class="listheader">Description</div></td>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade + '<td class="listheadertd listheadertextb uir-column-medium"><div class="listheader">Quantity</div></td>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'<td class="listheadertd listheadertextbrt uir-column-x-large"><div class="listheader">Amount</div></td>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'</tr>';
    for(var i=0; i < items_exchange_ra_upgrade.length; i++)
    {
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade + '<tr class="uir-list-row-tr uir-list-row-odd">';
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td class="uir-list-row-cell listtext">'+ items_exchange_ra_upgrade[i].itemText  +'</td>';
      //items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td class="uir-list-row-cell listtext"><textarea rows="2" cols="100" readonly disabled>'+  items_exchange_ra_upgrade[i].desc +'</textarea></td>';
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td class="uir-list-row-cell listtext"><label>'+  items_exchange_ra_upgrade[i].desc +'</label></td>';
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'<td class="uir-list-row-cell listtext" align="center">'+ items_exchange_ra_upgrade[i].quantity +'</td>';
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade + '<td class="uir-list-row-cell listtext" align="right">'+ items_exchange_ra_upgrade[i].amount +'</td>';
      items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'</tr>';
    }
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade +'</tbody>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'</table>';
    items_exchange_ra_html_upgrade = items_exchange_ra_html_upgrade  +'</div>';
    nlapiLogExecution("Debug","View Exchange Item RA(upgrade) Html", items_exchange_ra_html_upgrade);
  }
  return items_exchange_ra_html_upgrade;
}
