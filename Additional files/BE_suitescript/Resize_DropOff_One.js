function  Resize_DropOff_One(dropOff,form)
{
  try
  {
    var customer = request.getParameter("custpage_customer");
    var deliveryDate = request.getParameter("custpage_delivery_date");
    var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
    var orderID = request.getParameter("custpage_order_id");
    var orderNumber = request.getParameter("custpage_order_num");

    var return_label = request.getParameter("custpage_return_label_status");
    var notes = request.getParameter("custpage_notes");
    var salesrep = request.getParameter("custpage_sales_rep");
    var datereceived = request.getParameter("custpage_date_received_at_be");
    var locationReceived = request.getParameter("custpage_location_received_at_be");
    var pickupLocation = request.getParameter("custpage_pickup_location");

    /* var originalOrder = nlapiLoadRecord("salesorder",orderID);
    var originalSOItem =[];
    for(var i=0; i<=originalOrder.getLineItemCount("item"); i++)
    {
      var itemType = originalOrder.getLineItemValue("item","itemtype",i+1);
    if(itemType == "InvtPart")
      originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
    else if(itemType == "Assembly")
      originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
    }
    nlapiLogExecution("Debug","Original SO Item Array",originalSOItem);
   */
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
    var country_hid = request.getParameter("custpage_country_hidden");//custpage_country_hidden
    var delivery_instruction =request.getParameter('custpage_delivery_instruction');
    nlapiLogExecution("Debug","Delivery Instruction",delivery_instruction);
    var delivery_date_notes = request.getParameter('custpage_delivery_date_notes');
    var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017
    var placeofsale = request.getParameter("custpage_place_of_sale");
    //Create Sales Order
    var soRec = nlapiTransformRecord("customer",customer,"salesorder");
    soRec.setFieldValue("custbody58",so_notes);//Added on 03/06/2017
    for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
    {
      var shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i);
      nlapiLogExecution("debug","shipping to be",shipping_to_be);
      if(shipping_to_be == 'T')
      {
        var newRingSize = request.getLineItemValue("custpage_items", "sublist_new_size", i);
        nlapiLogExecution("debug","New Ring Size 1",newRingSize);
        var numericSize = newRingSize.replace(/\./g,"");
        nlapiLogExecution("Debug","Numeric Size [replace dot]",numericSize);
        nlapiLogExecution("Debug","New Tran Id with suffix SZ",orderNumber + "SZ" + numericSize);
        soRec.setFieldValue("tranid",orderNumber + "SZ" + numericSize);
        break;
      }        
    }
    //Check if transaction ID already exists
    var tranid = soRec.getFieldValue("tranid");
    nlapiLogExecution("Debug","Tran Id",tranid);
    soRec.setFieldValue("tranid",checkNumber(tranid,1));
    /*
     * Updated as per client feedback doc 20 jun 2017
     * 2 = Resize
     */
    soRec.setFieldValue("custbody87",2);
    soRec.setFieldValue("custbody6",deliveryDate);
    soRec.setFieldValue("custbody82",deliveryDateFirm);
    soRec.setFieldValue("custbody254",notes);//OR Notes
    soRec.setFieldValue("salesrep",salesrep);
    soRec.setFieldValue("custbody36",datereceived);
    soRec.setFieldValue("custbody245",locationReceived);
    soRec.setFieldValue("custbody_drop_off",dropOff);
    soRec.setFieldValue("custbody194",delivery_instruction);
    soRec.setFieldValue("custbody150",delivery_date_notes);
    if(return_label!=null && return_label!="")
      soRec.setFieldValue("custbody138",return_label); //custbody138

    if(request.getParameter("custpage_pickup_at_be")!=null && request.getParameter("custpage_pickup_at_be")!="")
      soRec.setFieldValue("custbody53",request.getParameter("custpage_pickup_at_be"));
    soRec.setFieldValue("custbody_pickup_location",pickupLocation);
    soRec.setFieldValue("custbody55",0.00); //Amount Paid By Customer
    soRec.setFieldValue("custbody132",3); //Diamond Confirmed New - N/A
    //soRec.setFieldValue("class",2); //Place of Sale - Phone: Not Bank Wire
    soRec.setFieldValue("class",placeofsale); //Place of Sale
    soRec.setFieldValue("custbodyfraud_check_new",1); //fraud check new
    if(request.getParameter("custpage_block_auto_emails")=="T")
    {
      soRec.setFieldValue("custbodyblock_auto_emails","T");
    }
    var centerStoneLink=[];
    var return_label_insurance =0;
    var comments='';
    for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
    {
      var shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i); 
      nlapiLogExecution("debug","shipping to be 2",shipping_to_be);
      if(shipping_to_be == 'T')
      {
        //var item = request.getLineItemValue("custpage_items", "sublist_item", i);
        var newRingSize = request.getLineItemValue("custpage_items", "sublist_new_size", i);
        //nlapiLogExecution("debug","new ring size 2",newRingSize);
        var description = request.getLineItemValue("custpage_items", "sublist_desc", i);
        //nlapiLogExecution("debug","description",description);
        var amount = request.getLineItemValue("custpage_items", "sublist_amt", i);
        //nlapiLogExecution("debug","amount",amount);
        var insurance = request.getLineItemValue("custpage_items", "sublist_production_ins_value", i);
        //nlapiLogExecution("debug","insurance",insurance);
        if(description !=null && description !='')
          description = description.substring(0,description.indexOf(","));
        //nlapiLogExecution("debug","description 2",description);
        var center_stone_link= request.getLineItemValue("custpage_items", "sublist_center_stone_link", i);
        var item_link_sku= request.getLineItemValue("custpage_items", "sublist_item_link", i);
        nlapiLogExecution("debug","item link sku value ",item_link_sku);
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
        nlapiLogExecution("debug","Center Stone Link : " + i,center_stone_link);
        if(center_stone_link !=null && center_stone_link !='')
        {
          /*if(centerStoneLink.length==0)
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
        soRec.setCurrentLineItemValue("item","item",1093360);//RESIZE ITEM  1093360
        soRec.setCurrentLineItemValue("item","description",description + " resize to Size " + newRingSize);
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
          comments = "Set With:\n" + "SKU:" +' '+ centerStoneItemData.itemid +"\n" +"Description:"+' '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          soRec.setCurrentLineItemValue("item","custcol5",comments);
        }
        soRec.commitLineItem("item");
      }
    }
    soRec.setFieldValue('custbody_center_stone_link',centerStoneLink);
    soRec.setFieldValue('custbody_return_label_insurance',return_label_insurance);
    //Set created from sales order
    var  itemChkFlag ='0';
    var related_Sales_Order ='';
    var arr_related_Sales_Order =[];
    for(var i=0;i<request.getLineItemCount("custpage_items");i++)
    {
      nlapiLogExecution("Debug","Resize Page Item Value",request.getLineItemValue("custpage_items", "sublist_item", i+1));
      //nlapiLogExecution("Debug","Original  Item Value",originalSOItem[i]);
      var sublist_shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i+1) ;
      if(sublist_shipping_to_be =='T')
      {
        //if(request.getLineItemValue("custpage_items", "sublist_item", i+1) != originalSOItem[i])
        //{
        related_Sales_Order = request.getLineItemValue("custpage_items", "sublist_related_sales_order", i+1);
        if(related_Sales_Order!='' && related_Sales_Order!=null)
          arr_related_Sales_Order.push(related_Sales_Order);
        //nlapiLogExecution("Debug","Related Sales Order",related_Sales_Order);
        //related_Sales_Order =related_Sales_Order.replace(/,/g,'');
        //nlapiLogExecution("Debug","Related Sales Order replace comma ,",related_Sales_Order);
        // itemChkFlag ='1';
        // }
      }
    }
    //if(itemChkFlag=='0')
    soRec.setFieldValue("custbody_created_from",orderID);
    // if(itemChkFlag =='1')
    soRec.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);
    //Update Shipping Address if Necessary
    var updateAddress = false;
    if(address1 != soRec.getFieldValue("shipaddr1"))
      updateAddress = true;
    if(!updateAddress && address2 != soRec.getFieldValue("shipaddr2"))
      updateAddress = true;
    if(!updateAddress && city != soRec.getFieldValue("shipcity"))
      updateAddress = true;
    //if(!updateAddress && state != soRec.getFieldValue("shipstate"))
    //  updateAddress = true;
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
    if(updateAddress)
    {
      var subrecord = soRec.editSubrecord("shippingaddress");
      subrecord.setFieldValue("country",country);
      subrecord.setFieldValue("addressee",addressee);
      if(attention!=null && attention!="")
        subrecord.setFieldValue("attention",attention);
      subrecord.setFieldValue("addr1",address1);
      subrecord.setFieldValue("addr2",address2);
      subrecord.setFieldValue("city",city);
      //subrecord.setFieldValue("state",state);
      if(state!=''&& state!=null)
        subrecord.setFieldValue("state",state);
      else if(state_txt!=''&& state_txt!=null)
        subrecord.setFieldValue("state",state_txt);
      subrecord.setFieldValue("zip",zipcode);
      subrecord.commit();
      var shipaddress = "";
      var final_state='';
      if(state!=''&& state!=null)
        final_state = state;
      else if(state_txt!=''&& state_txt!=null)
        final_state = state_txt;
      if(attention!=null && attention!="")
        shipaddress += attention + "\n";
      shipaddress += addressee + "\n";
      shipaddress += address1 + "\n";
      if(address2!=null && address2!="")
        shipaddress += address2 + "\n";
      shipaddress += city + " " + final_state + " " + zipcode + "\n";
      //shipaddress += country;
      shipaddress += country_hid;
      soRec.setFieldValue("shipaddress",shipaddress);
    } 
    var currency_value=nlapiLookupField('salesorder',orderID,'currency');     
    soRec.setFieldValue("currency",currency_value);
    var resizeOrderID = nlapiSubmitRecord(soRec,true,true);
    nlapiSubmitField('salesorder',orderID,"custbody_resize_requested",'T');
    var redirectUrl =  nlapiResolveURL("RECORD" , "salesorder" , resizeOrderID , "view") ;
    var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
    nlapiLogExecution("Debug","redirect Url",comRedirectUrl);
    //Redirect user to new sales order
    var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
    htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ redirectUrl+'" ; window.close(); </script>');
    response.writePage(form);
  }
  catch(err)
  {
    nlapiLogExecution("Error","Resize Page Processing Error in if block","Details:" + err.message);
    //return true;
  }

}