function Resize_DropOff_Two_Return_Label_Status_Five(dropOff,returnLabelStatus)
{

  var form = nlapiCreateForm('Send Label to Customer'); 
  var orderId = request.getParameter("custpage_order_id");
  nlapiLogExecution("Debug","order id",orderId);

  var orderNumber = request.getParameter("custpage_order_num");
  nlapiLogExecution("debug","orderNumber",orderNumber);

  var retObj   = Order_Delivery_Information();
  nlapiLogExecution("Debug","Resize Order Delivery Information in if block",JSON.stringify(retObj));

  /* start here Set get data values */
  form.addField("custpage_order_num","text","Order Number").setDisplayType('hidden').setDefaultValue(orderNumber);
  form.addField("custpage_customer","text","Customer").setDisplayType('hidden').setDefaultValue(retObj.customer);
  form.addField("custpage_delivery_date","text","Delivery Date").setDisplayType('hidden').setDefaultValue(retObj.deliveryDate);
  form.addField("custpage_delivery_date_firm","checkbox","Delivery Date Firm").setDisplayType('hidden').setDefaultValue(retObj.deliveryDateFirm);
  form.addField("custpage_or_notes","textarea","Or Notes").setDisplayType('hidden').setDefaultValue(retObj.orNotes);
  form.addField("custpage_sales_rep","text","Sales Rep").setDisplayType('hidden').setDefaultValue(retObj.salesrep);
  form.addField("custpage_date_received_at_be","text","Date Received").setDisplayType('hidden').setDefaultValue(retObj.datereceived);
  form.addField("custpage_location_received_at_be","text","Location Received").setDisplayType('hidden').setDefaultValue(retObj.locationReceived);
  form.addField("custpage_pickup_location","text","Pick-up Loaction").setDisplayType('hidden').setDefaultValue(retObj.pickupLocation);
  form.addField("custpage_drop_off","text","Drop Off").setDisplayType('hidden').setDefaultValue(dropOff);
  form.addField("custpage_so_notes","textarea","Sales Order Notes").setDisplayType('hidden').setDefaultValue(retObj.so_notes);//Added on 03/06/2017

  //start here set shipping information
  form.addField("custpage_addressee","text","addressee").setDisplayType('hidden').setDefaultValue(retObj.addressee);
  form.addField("custpage_attention","text","attention").setDisplayType('hidden').setDefaultValue(retObj.attention);
  form.addField("custpage_address_1","text","address1").setDisplayType('hidden').setDefaultValue(retObj.address1);
  form.addField("custpage_address_2","text","address2").setDisplayType('hidden').setDefaultValue(retObj.address2);
  form.addField("custpage_city","text","city").setDisplayType('hidden').setDefaultValue(retObj.city);
  form.addField("custpage_state","text","state").setDisplayType('hidden').setDefaultValue(retObj.state);
  form.addField("custpage_state_new","text","state new").setDisplayType('hidden').setDefaultValue(retObj.state_txt);
  form.addField("custpage_zip","text","zipcode").setDisplayType('hidden').setDefaultValue(retObj.zipcode);
  form.addField("custpage_country","text","country").setDisplayType('hidden').setDefaultValue(retObj.country);
  form.addField("custpage_delivery_instruction","text","delivery_instruction").setDisplayType('hidden').setDefaultValue(retObj.delivery_instruction);
  form.addField("custpage_delivery_date_notes","textarea","delivery_date_notes").setDisplayType('hidden').setDefaultValue(retObj.delivery_date_notes);
  form.addField("custpage_country_hidden","text","country hidden").setDisplayType('hidden').setDefaultValue(retObj.country_hid);
  form.addField("custpage_pickup_at_be","checkbox","Pick At Be").setDisplayType('hidden').setDefaultValue(retObj.pickup_at_be);
  form.addField("custpage_place_of_sale","text","Place Of Sale").setDisplayType('hidden').setDefaultValue(retObj.placeofsale);
  // end here
  /* end here */

  // set ship service for return label creation 
  /* var shipService = setShipService(orderId);
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
    form.setScript('customscript_back_data_url');
    form.addTab("custpage_resize_review_tab","");
    form.addSubTab("custpage_resize_review_subtab","").setLabel('Select people to copy in this email or add email addresses directly from the list below.');
    form.addSubmitButton('Send Label');    

    var emailType ="resize";
    var script = emailPreview(orderId,emailType);
    form.addButton('custpage_email_preview','Preview Email', script);  

    var edit_EmailTemplate = editEmailTemplate(orderId,emailType);
    form.addButton('custpage_edit_email_template','Edit Email Template', edit_EmailTemplate);  
    form.addField('custpage_copy_email_template_id','text','Copy Email Template').setDisplayType('hidden').setDefaultValue('0'); 
    //var backUrl="https://debugger.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=1185&deploy=1&record=10145956&backdata=true";
    //var backDataObject={"backdata":"true"};
    // response.sendRedirect("suitelet" ,"customscript_post_sale_suitelet" , "customdeploy_post_sale_suitelet_resize","internal",backDataObject) ;
    var postSaleType='2';
    // var backDataUrl_LandingPage =  backDataUrlLandingPage(orderId,postSaleType);
    // nlapiLogExecution("Debug","Back Data Url for Resize",backDataUrl_LandingPage);
    //form.addButton('custpage_back_btn', 'Back',backDataUrl_LandingPage);
    form.addButton('custpage_back_btn','Back','Back_Data_Url_on_Send_label_to_Customer('+orderId+','+postSaleType+')');
    //form.addButton('custpage_refresh_final_page','Refresh', "pageRefresh()");
    form.addButton('custpage_close', 'Close', "window.close();");
    form.addField('custpage_resize_id','text').setDisplayType('hidden').setDefaultValue('2');
    //form.setScript('customscript_copy_others');
    form.addField("custpage_email_address","text","Email Address").setMandatory(true).setDefaultValue(custEmail);

    var sublistcopyemail = form.addSubList('custpage_employee_list', 'inlineeditor', 'Select people to copy in this email or add email addresses directly from the list below.','custpage_resize_review_subtab');
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

        var description = request.getLineItemValue("custpage_items", "sublist_desc", i);
        nlapiLogExecution("debug","description",description);
        if(description !=null && description !='')
          description = description.substring(0,description.indexOf(","));
        var amount = request.getLineItemValue("custpage_items", "sublist_amt", i);
        nlapiLogExecution("debug","amount",amount);
        var quantity = request.getLineItemValue("custpage_items", "sublist_qty", i);
        nlapiLogExecution("debug","amount",quantity);
        var insurance = request.getLineItemValue("custpage_items", "sublist_production_ins_value", i);

        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);

        var saleAmt = request.getLineItemValue("custpage_items", "sublist_sale_amount", i);  
        var newRingSize = request.getLineItemValue("custpage_items", "sublist_new_size", i);  
        var itemLink = request.getLineItemValue("custpage_items", "sublist_item_link", i);
        var createdFrom = request.getLineItemValue("custpage_items", "sublist_created_from", i);
        var centerStoneLink = request.getLineItemValue("custpage_items", "sublist_center_stone_link", i); 
        var relatedSalesOrder = request.getLineItemValue("custpage_items", "sublist_related_sales_order", i);
        rtnItemBe.push({
          custpage_rtn_item:itemId,
          custpage_rtn_item_des :description + " resize to Size " + newRingSize,
          custpage_rtn_item_amount : amount,
          custpage_rtn_item_sale_amt : saleAmt,
          custpage_rtn_item_qty : quantity,
          custpage_rtn_item_newsize : newRingSize,
          custpage_rtn_item_production_ins_val : insurance,
          custpage_rtn_item_link : itemLink,
          custpage_rtn_item_created_from :  createdFrom,
          custpage_rtn_item_center_stone_link : centerStoneLink,
          custpage_rtn_item_related_sales_order : relatedSalesOrder


        });  

      }
    }
    nlapiLogExecution("Debug","Production Insurance Value",return_label_insurance);
    form.addField("custpage_insurance_val","currency","Production Insuranace Value").setDisplayType('hidden').setDefaultValue(return_label_insurance);
    var  item_rtn_be=form.addSubList('custpage_customer_item_returning_be', 'list', 'Customer Item Returning to BE','custpage_resize_review_tab');
    item_rtn_be.addField('custpage_rtn_item','select', 'Item','item').setDisplayType('inline');
    item_rtn_be.addField('custpage_rtn_item_des','textarea', 'Description');
    item_rtn_be.addField('custpage_rtn_item_sale_amt','currency', 'SALE AMOUNT').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_qty','text', 'Quantity');
    item_rtn_be.addField('custpage_rtn_item_amount','currency', 'Amount');
    item_rtn_be.addField('custpage_rtn_item_newsize','text', 'New Size').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_production_ins_val','currency','Production Insurance Value').setDisplayType('hidden');
    item_rtn_be.addField('custpage_rtn_item_link','text', 'Item SKU').setDisplayType('hidden');;
    item_rtn_be.addField('custpage_rtn_item_created_from','select','CREATED FROM','transaction').setDisplayType('hidden'); ;
    item_rtn_be.addField('custpage_rtn_item_center_stone_link','select','Center Stone SKU','item').setDisplayType('hidden');;
    item_rtn_be.addField('custpage_rtn_item_related_sales_order','select','Related Sales Order(s)','transaction').setDisplayType('hidden'); ;

    item_rtn_be.setLineItemValues(rtnItemBe);
   
    response.writePage(form);
    
     deleteNewEmailTemplate();
  }
  catch(err)
  {
    nlapiLogExecution("error","Resize Page Processing Error in else block","Details: " + err.message);
    return true;
  }
}

