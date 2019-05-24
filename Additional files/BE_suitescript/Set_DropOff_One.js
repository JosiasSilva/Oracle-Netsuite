function Set_DropOff_One(dropOff,form)
{
  try
  {
    //Get POST variables
    var customer = request.getParameter("custpage_customer");
    var trandate = request.getParameter("custpage_date");
    var orderID = request.getParameter("custpage_order_id");
    var salesrep = request.getParameter("custpage_sales_rep");
    var orNotes = request.getParameter("custpage_or_notes");
    var actual_ship_date = request.getParameter("custpage_actual_ship_date");
    var delivery_date = request.getParameter("custpage_delivery_date");
    var delivery_date_firm = request.getParameter("custpage_delivery_date_firm");
    var date_received_at_be = request.getParameter("custpage_date_received_at_be");
    var pickup_at_be = request.getParameter("custpage_pickup_at_be");
    var return_shipping_label = request.getParameter("custpage_return_label_status");
    var so_num = request.getParameter("custpage_order_num");
    var locationReceived = request.getParameter("custpage_location_received_at_be");
    var pickupLocation = request.getParameter("custpage_pickup_location");
    var delivery_instruction =request.getParameter('custpage_delivery_instruction');
    var delivery_date_notes = request.getParameter('custpage_delivery_date_notes');
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
    var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017
    var placeofsale = request.getParameter("custpage_place_of_sale");

    nlapiLogExecution("debug","(POST) Shipping Info Retrieved");
    /* var originalOrder = nlapiLoadRecord("salesorder",orderID);
    var originalSOItem =[];
    for(var i=0; i<=originalOrder.getLineItemCount("item"); i++)
    {
      //originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
       var itemType = originalOrder.getLineItemValue("item","itemtype",i+1);
    if(itemType == "InvtPart")
      originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
    else if(itemType == "Assembly")
      originalSOItem.push(originalOrder.getLineItemValue("item","item",i+1));
    }
    nlapiLogExecution("Debug","Original SO Item Array",originalSOItem);*/
    var new_items = [];
    for(var x=0; x < request.getLineItemCount("custpage_new_items"); x++)
    {
      new_items.push({
        item : request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1),
        description : request.getLineItemValue("custpage_new_items","custpage_new_items_desc",x+1),
        quantity : request.getLineItemValue("custpage_new_items","custpage_new_items_qty",x+1),
        rate : request.getLineItemValue("custpage_new_items","custpage_new_items_rate",x+1),
        amount: request.getLineItemValue("custpage_new_items","custpage_new_items_amount",x+1),
        insurance: request.getLineItemValue("custpage_new_items","custpage_new_items_production_insurance_value",x+1),
        center_stone_sku: request.getLineItemValue("custpage_new_items","custpage_center_stone_sku",x+1)
      });
    }
    //Create new Sales Order
    //var newOrder = nlapiTransformRecord("customer",customer,"salesorder",{recordmode: "dynamic"});
    var newOrder = nlapiTransformRecord("customer",customer,"salesorder",{recordmode: "dynamic"});
    newOrder.setFieldValue("tranid",so_num + "SET");
    newOrder.setFieldValue("custbody58",so_notes);//Added on 03/06/2017
    //Check if transaction ID already exists
    var tranid = newOrder.getFieldValue("tranid");
    newOrder.setFieldValue("tranid",checkNumber(tranid,1));

    //Set created from (original sales order)
    //  newOrder.setFieldValue("custbody_created_from",orderID);

    //Set Invoice Date
    var filters = [];
    filters.push(new nlobjSearchFilter("createdfrom",null,"is",orderID));
    filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
    var cols = [];
    cols.push(new nlobjSearchColumn("trandate").setSort(true));
    var results = nlapiSearchRecord("invoice",null,filters,cols);
    if(results)
    {
      newOrder.setFieldValue("custbody_invoice_date",results[0].getValue("trandate"));
    }

    newOrder.setFieldValue("entity",customer);
    newOrder.setFieldValue("salesrep",salesrep); 
    newOrder.setFieldValue("custbody6",delivery_date);
    newOrder.setFieldValue("custbody254",orNotes);//custbody58
    newOrder.setFieldValue("custbody82",delivery_date_firm);
    /*
     * Updated as per client feedback doc 20 jun 2017
     * 17= Set(Type Of Order)
     */
    newOrder.setFieldValue("custbody87",17);
    newOrder.setFieldValue("custbody53",pickup_at_be);
    newOrder.setFieldValue("custbody_pickup_location",pickupLocation);
    newOrder.setFieldValue("custbody132",2); //Diamond Confirmed New (default to No)
    newOrder.setFieldValue("custbody84","1"); //Fraud Check=Yes
    newOrder.setFieldValue("custbody245",locationReceived);
    if(return_shipping_label!=null && return_shipping_label !='')
    newOrder.setFieldValue("custbody138",return_shipping_label);
    newOrder.setFieldValue("custbody_drop_off",dropOff);
    newOrder.setFieldValue("custbody194",delivery_instruction);
    newOrder.setFieldValue("custbody150",delivery_date_notes);
    newOrder.setFieldValue("custbodyfraud_check_new",1); //fraud check new
    newOrder.setFieldValue("custbody36",date_received_at_be); //Date Received at BE from Customer
    newOrder.setFieldValue("class",placeofsale); //Place of Sale

    if(request.getParameter("custpage_block_auto_emails")=="T")
    {
      newOrder.setFieldValue("custbodyblock_auto_emails","T");
    }
    var centerStoneLink=[];

    //  nlapiLogExecution("debug","Center Stone Link length " ,centerStoneLink.length);
    var return_label_insurance =0;
    var comments='';
    for(var i=1; i<=request.getLineItemCount("custpage_items"); i++)
    {
      var shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i);
      if(shipping_to_be == 'T')
      {
        var description = request.getLineItemValue("custpage_items", "sublist_desc", i);
        nlapiLogExecution("debug","description",description);
        var amount = request.getLineItemValue("custpage_items", "sublist_amt", i);
        nlapiLogExecution("debug","amount",amount);
        var insuranceValue = request.getLineItemValue("custpage_items", "sublist_production_ins_value", i);
        nlapiLogExecution("debug","Insurance Value",insuranceValue);
        var center_stone_link= request.getLineItemValue("custpage_items", "sublist_center_stone_link", i);
        nlapiLogExecution("debug","center stone link",center_stone_link);
        if(insuranceValue !=null && insuranceValue != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insuranceValue);
        var item_link_sku= request.getLineItemValue("custpage_items", "sublist_item_link", i);
        nlapiLogExecution("debug","Item Link SKU ",item_link_sku);
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

        newOrder.selectNewLineItem("item");
        newOrder.setCurrentLineItemValue("item","item",66394);//Customer ITEM
        newOrder.setCurrentLineItemValue("item","description",description);
        newOrder.setCurrentLineItemValue("item","amount",amount);
        newOrder.setCurrentLineItemValue("item","rate",amount);//Added by Ravi on 01/05/2017
        newOrder.setCurrentLineItemValue("item","custcol_category","");
        //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",insuranceValue);
        newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",insuranceValue);
        newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",center_stone_link);
        if(item_link_sku!=null && item_link_sku!='')
          newOrder.setCurrentLineItemText("item","custcol_item_sku_so",item_link_sku);
        if(center_stone_link !=null && center_stone_link !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_link,['itemid','salesdescription']);
          comments = "Set With:\n" + "SKU:" +'  '+ centerStoneItemData.itemid +"\n" +"Description:"+'  '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          newOrder.setCurrentLineItemValue("item","custcol5",comments);
        }
        nlapiLogExecution("debug","comments",comments);
        newOrder.commitLineItem("item");
      }
    }
    newOrder.setFieldValue('custbody_center_stone_link',centerStoneLink);
    nlapiLogExecution("debug","center stone link 2",centerStoneLink);
    newOrder.setFieldValue('custbody_return_label_insurance',return_label_insurance);
    nlapiLogExecution("debug","return label insurance",return_label_insurance);
    //Set created from sales order
    var  itemChkFlag ='0';
    var related_Sales_Order ='';
    var arr_related_Sales_Order =[];
    for(var i=0;i<request.getLineItemCount("custpage_items");i++)
    {
      //nlapiLogExecution("Debug","Resize Page Item Value",request.getLineItemValue("custpage_items", "sublist_item", i+1));
      // nlapiLogExecution("Debug","Original  Item Value",originalSOItem[i]);
      var sublist_shipping_to_be = request.getLineItemValue("custpage_items", "sublist_shipping_to_be", i+1) ;
      if(sublist_shipping_to_be =='T')
      {
        // if(request.getLineItemValue("custpage_items", "sublist_item", i+1) != originalSOItem[i])
        // {
        related_Sales_Order = request.getLineItemValue("custpage_items", "sublist_related_sales_order", i+1);
        if(related_Sales_Order !='' && related_Sales_Order !=null)
          arr_related_Sales_Order.push(related_Sales_Order);
        //nlapiLogExecution("Debug","Related Sales Order",related_Sales_Order);
        //related_Sales_Order =related_Sales_Order.replace(/,/g,'');
        //nlapiLogExecution("Debug","Related Sales Order replace comma ,",related_Sales_Order);
        //itemChkFlag ='1';
        // }
      }
    }
    // if(itemChkFlag=='0')
    newOrder.setFieldValue("custbody_created_from",orderID);
    //if(itemChkFlag =='1')
    newOrder.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);
    var comments_new_order ='';
    var center_stone_sku ='';
    for(var x=0; x < new_items.length; x++)
    {
      newOrder.selectNewLineItem("item");
      newOrder.setCurrentLineItemValue("item","item",new_items[x].item);
      newOrder.setCurrentLineItemValue("item","description",new_items[x].description);
      newOrder.setCurrentLineItemValue("item","quantity",new_items[x].quantity);
      newOrder.setCurrentLineItemValue("item","rate",new_items[x].rate);//Added by Ravi
      newOrder.setCurrentLineItemValue("item","amount",new_items[x].amount);
      //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",new_items[x].insurance); 
      newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",new_items[x].insurance); 
      newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",new_items[x].center_stone_sku);
      center_stone_sku =new_items[x].center_stone_sku;
      if(center_stone_sku !=null && center_stone_sku !='')
      {
        var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_sku,['itemid','salesdescription']);
        comments_new_order = "Set With:\n" + "SKU:" +' '+centerStoneItemData.itemid +"\n" +"Description:"+' '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
        newOrder.setCurrentLineItemValue("item","custcol5",comments_new_order);
      }
      newOrder.commitLineItem("item");
    }
    //Update Shipping Address if Necessary
    var updateAddress = false;

    if(address1 != newOrder.getFieldValue("shipaddr1"))
      updateAddress = true;
    if(!updateAddress && address2 != newOrder.getFieldValue("shipaddr2"))
      updateAddress = true;
    if(!updateAddress && city != newOrder.getFieldValue("shipcity"))
      updateAddress = true;
    //if(!updateAddress && state != newOrder.getFieldValue("shipstate"))
    //  updateAddress = true;
    if(!updateAddress && zipcode != newOrder.getFieldValue("shipzip"))
      updateAddress = true;
    if(!updateAddress && country != newOrder.getFieldText("shipcountry"))
      updateAddress = true;
    if(!updateAddress && addressee != newOrder.getFieldValue("shipaddressee"))
      updateAddress = true;
    if(!updateAddress && attention != newOrder.getFieldValue("shipattention"))
      updateAddress = true;
    if(state!='' && state!=null)
    {
      if(!updateAddress && state != newOrder.getFieldValue("shipstate"))
        updateAddress = true;
    }
    else if(state_txt!='' && state_txt!=null)
    {
      if(!updateAddress && state_txt != newOrder.getFieldValue("shipstate"))
        updateAddress = true;
    }
    if(updateAddress)
    {
      var subrecord = newOrder.editSubrecord("shippingaddress");
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
      nlapiLogExecution("debug","final state",final_state);

      if(attention!=null && attention!="")
        shipaddress += attention + "\n";
      shipaddress += addressee + "\n";
      shipaddress += address1 + "\n";
      if(address2!=null && address2!="")
        shipaddress += address2 + "\n";
      shipaddress += city + " " + final_state + " " + zipcode + "\n";
      //shipaddress += newOrder.getFieldText("shipcountry");
      shipaddress += country_hid;
      newOrder.setFieldValue("shipaddress",shipaddress);
    }
    newOrder.setFieldValue("tranid",so_num + "SET");
    //Check if transaction ID already exists
    var tranid = newOrder.getFieldValue("tranid");
    newOrder.setFieldValue("tranid",checkNumber(tranid,1));

    var currency_value=nlapiLookupField('salesorder',orderID,'currency');     
    newOrder.setFieldValue("currency",currency_value);

    var newOrderID = nlapiSubmitRecord(newOrder,true,true);
    var redirectUrl =  nlapiResolveURL ("RECORD" , "salesorder" , newOrderID , "view" ) ;
    var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
    nlapiLogExecution("Debug","Redirect Url",comRedirectUrl);

    //Redirect user to new sales order
    var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
    htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ redirectUrl +'" ; window.close(); </script>');
    response.writePage(form);
  }
  catch(err)
  {
    nlapiLogExecution("error","Set Page Processing Error in if block","Details: " + err.message);
    return true;
  }
}