function Upgrade_DropOff_One(dropOff,form)
{
  var rmaID = "";
  var return_label_insurance=0;
  try
  {
    //Get POST variables

    var customer = request.getParameter("custpage_customer");
    //var dropOff = request.getParameter("custpage_drop_off");

    var trandate = request.getParameter("custpage_date");
    var created_from = request.getParameter("custpage_created_from");
    nlapiLogExecution("Debug","create from ",created_from);
   // var original_salesrep = request.getParameter("custpage_orig_sales_rep"); commented as per client feedback
  //  nlapiLogExecution("Debug","Original Sales Rep",original_salesrep);
    //var new_salesrep = request.getParameter("custpage_new_sales_rep");
    //nlapiLogExecution("Debug","New Sales Rep",new_salesrep);
    var so_notes = request.getParameter("custpage_so_imp_notes");
    var return_reason = request.getParameter("custpage_reason_for_return");
    var type_of_send_back = request.getParameter("custpage_type_of_send_back");
    var exchange_notes = request.getParameter("custpage_exchange_notes");
    var orNotes = request.getParameter("custpage_or_notes");//Added by Ravi on 03/04/2017
    var actual_ship_date = request.getParameter("custpage_actual_ship_date");
    var delivery_date = request.getParameter("custpage_delivery_date");
    var delivery_date_firm = request.getParameter("custpage_delivery_date_firm");
    var date_received_at_be = request.getParameter("custpage_date_received_at_be");
    var pickup_at_be = request.getParameter("custpage_pickup_at_be");
    var return_shipping_label = request.getParameter("custpage_return_label_status");
    var so_num = request.getParameter("custpage_so_num");
    var place_of_sale = request.getParameter("custpage_place_of_sale");
    // var amount_paid = request.getParameter("custpage_amount_paid");
    var so_total = request.getParameter("custpage_so_total");
    var locationReceived = request.getParameter("custpage_location_received_at_be");
    var pickupLocation = request.getParameter("custpage_pickup_location");
    var rma = request.getParameter("custpage_rma");
    nlapiLogExecution("debug","rma",rma);
    var delivery_instruction = request.getParameter("custpage_delivery_instruction");
    var delivery_date_notes = request.getParameter("custpage_delivery_date_notes");
    var orderId = request.getParameter("custpage_order_id");
    nlapiLogExecution("debug","(POST) Parameters Retrieved");

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

    nlapiLogExecution("debug","(POST) Shipping Info Retrieved");
    //var result =null;
    /* var filter=new Array();
    filter.push(new nlobjSearchFilter('internalid','null','is',original_salesrep));
    filter.push(new nlobjSearchFilter('isinactive','null','is','F'));
    filter.push(new nlobjSearchFilter("salesrep",null,"is","T"));
    var result = nlapiSearchRecord('employee',null,filter,null);*/
    /* if(emp_filter !=null && emp_filter !='')
    {
      var filter=new Array();
      filter.push(new nlobjSearchFilter('salesrep',null,'is',original_salesrep));
      filter.push(new nlobjSearchFilter('mainline',null,'is','T'));
      var column=new Array();
      column.push(new nlobjSearchColumn('salesrep',null,'group'));
      result = nlapiSearchRecord('salesorder',null,filter,column);
    }*/
    var items_return_ra = [];
    var items_exchange_ra = [];
    var items_return_resize = [];
    var items_return_repair = [];
    var items_return_cust_be = [];

    for(var x=0; x < request.getLineItemCount("custpage_items_returning"); x++)
    {
      var returingOption=request.getLineItemValue("custpage_items_returning","custpage_items_returning_check",x+1);

      if(returingOption=="1")
      {
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
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1)
        });
      }
      if(returingOption =='2')
      {
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
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1),
          centerstone :request.getLineItemValue("custpage_items_returning","custpage_items_returning_center_stone_sku",x+1),
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1)
        });
      }
      else if(returingOption =='3')
      {
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
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)
        });
      }
      else if(returingOption =='4')
      {
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
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)
        });
      }   
      else if(returingOption =='5')
      {
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
          relatedsalesorder : request.getLineItemValue("custpage_items_returning","custpage_items_returning_related_sales_order",x+1),
          itemsku : request.getLineItemValue("custpage_items_returning","custpage_items_returning_item_link",x+1),
          disablecreatedfrom :request.getLineItemValue("custpage_items_returning","custpage_items_returning_created_from_disable",x+1)
        });
      }   
    }
    nlapiLogExecution("debug","(POST) Items Returning Retrieved RA",JSON.stringify(items_return_ra));
    nlapiLogExecution("debug","(POST) Items Returning Retrieved RA",JSON.stringify(items_exchange_ra));
    nlapiLogExecution("debug","(POST) Items Returning Retrieved Resize",JSON.stringify(items_return_resize));
    nlapiLogExecution("debug","(POST) Items Returning Retrieved Repair",JSON.stringify(items_return_repair));
    nlapiLogExecution("debug","(POST) Items Returning Retrieved Customer shipping At be",JSON.stringify(items_return_cust_be));

    var new_items = [];
    for(var x=0; x < request.getLineItemCount("custpage_new_items"); x++)
    {
      new_items.push({
        item : request.getLineItemValue("custpage_new_items","custpage_new_items_item",x+1),
        quantity : request.getLineItemValue("custpage_new_items","custpage_new_items_qty",x+1),
        rate : request.getLineItemValue("custpage_new_items","custpage_new_items_rate",x+1),
        amount : request.getLineItemValue("custpage_new_items","custpage_new_items_amount",x+1),
        insurance :request.getLineItemValue("custpage_new_items","custpage_new_items_production_insurance_value",x+1),
        center_stone_sku :request.getLineItemValue("custpage_new_items","custpage_new_items_center_stone_sku",x+1),
        description : request.getLineItemValue("custpage_new_items","custpage_new_items_desc",x+1)
      });
    }

    nlapiLogExecution("debug","(POST) New Item List Retrieved",JSON.stringify(new_items));

  }
  catch(err)
  {
    nlapiLogExecution("error","Error Getting POST Values","Details: " + err.message);
    return true;
  }

  try
  {
    //Create RA for customer

    if(items_return_ra.length>0 || items_exchange_ra.length>0)
    {
      if(rma==null || rma=="")
      {
        //nlapiLogExecution("debug","step1" );
        var ra = nlapiTransformRecord("salesorder",orderId,"returnauthorization");
        ra.setFieldValue("tranid",so_num+"UPGRADE");
        //ra.setFieldValue("tranid",so_num+"RT");

        //Check if transaction ID already exists
        var tranid = ra.getFieldValue("tranid");
        ra.setFieldValue("tranid",checkRaNumber(tranid,1));
        //nlapiLogExecution("Debug","test 1");
        //if(result!=null)
       // ra.setFieldValue("salesrep",original_salesrep); //1. Sales rep will always go on the return auth
        //nlapiLogExecution("Debug","test 2");
        ra.setFieldValue("custbody32",return_reason);
        ra.setFieldValue("custbody35",type_of_send_back);
        ra.setFieldValue("custbody14",exchange_notes);
        ra.setFieldValue("custbody245",locationReceived);
        // ra.setFieldValue("custbody247",new_salesrep);
        //nlapiLogExecution("Debug","test 3");
        ra.setFieldValue("custbody138",return_shipping_label);
        ra.setFieldValue("custbody_drop_off",dropOff);
        ra.setFieldValue("custbody87","10"); //Type of Order = Upgrade
        ra.setFieldValue("custbody137",''); //RETURN SHIPPING LABEL (blank this field) 
        ra.setFieldValue("custbody123",''); // Return Tracking Number
        if(orNotes!='')
          ra.setFieldValue("custbody254",orNotes);
        else
          ra.setFieldValue("custbody254",'');
        for(var x=0; x<ra.getLineItemCount('item');x++)
        {
          ra.removeLineItem("item",x+1);
          x--;
        }

        for(var i=0;i<items_return_ra.length;i++)
        {
          var insurance = items_return_ra[x].insurance;
          if(insurance !=null && insurance != '')
            return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
          ra.selectNewLineItem("item");
          ra.setCurrentLineItemValue("item","item",items_return_ra[i].item);
          ra.setCurrentLineItemValue("item","quantity",items_return_ra[i].quantity);
          ra.setCurrentLineItemValue("item","amount",items_return_ra[i].saleamount);

          ra.setCurrentLineItemValue("item","rate",items_return_ra[i].saleamount);//Added by Ravi on 01/05/2017
          ra.setCurrentLineItemValue("item","custcol_full_insurance_value",items_return_ra[x].insurance);
          ra.setCurrentLineItemValue("item","description",items_return_ra[i].desc);
          if(items_return_ra[i].itemsku!=null && items_return_ra[i].itemsku!='')
            ra.setCurrentLineItemText("item","custcol_item_sku_so",items_return_ra[i].itemsku);
          ra.commitLineItem("item");

        }
        for(var x=0;x<items_exchange_ra.length;x++)
        {
          var insurance = items_exchange_ra[x].insurance;
          if(insurance !=null && insurance != '')
            return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);

          ra.selectNewLineItem("item");
          ra.setCurrentLineItemValue("item","item",items_exchange_ra[x].item);
          ra.setCurrentLineItemValue("item","quantity",items_exchange_ra[x].quantity);
          ra.setCurrentLineItemValue("item","amount",items_exchange_ra[x].saleamount);
          ra.setCurrentLineItemValue("item","rate",items_exchange_ra[x].saleamount);//Added by Ravi
          ra.setCurrentLineItemValue("item","description",items_exchange_ra[x].desc);
          ra.setCurrentLineItemValue("item","custcol_full_insurance_value",items_exchange_ra[x].insurance);
          if(items_exchange_ra[x].itemsku!='' && items_exchange_ra[x].itemsku!=null)
            ra.setCurrentLineItemText("item","custcol_item_sku_so",items_exchange_ra[x].itemsku);
          ra.commitLineItem("item");

        }

        //Update Shipping Address if Necessary
        var updateAddress = false;

        if(address1 != ra.getFieldValue("shipaddr1"))
          updateAddress = true;
        if(!updateAddress && address2 != ra.getFieldValue("shipaddr2"))
          updateAddress = true;
        if(!updateAddress && city != ra.getFieldValue("shipcity"))
          updateAddress = true;
        // if(!updateAddress && state != ra.getFieldValue("shipstate"))
        //updateAddress = true;
        if(!updateAddress && zipcode != ra.getFieldValue("shipzip"))
          updateAddress = true;
        if(!updateAddress && country != ra.getFieldValue("shipcountry"))
          updateAddress = true;
        if(!updateAddress && addressee != ra.getFieldValue("shipaddressee"))
          updateAddress = true;
        if(!updateAddress && attention != ra.getFieldValue("shipattention"))
          updateAddress = true;
        if(state!='' && state!=null)
        {
          if(!updateAddress && state != ra.getFieldValue("shipstate"))
            updateAddress = true;
        }
        else if(state_txt!='' && state_txt!=null)
        {
          if(!updateAddress && state_txt != ra.getFieldValue("shipstate"))
            updateAddress = true;
        }
        if(updateAddress)
        {
          var subrecord = ra.editSubrecord("shippingaddress");
          subrecord.setFieldValue("country",country);
          subrecord.setFieldValue("addressee",addressee);
          if(attention!=null && attention!="")
            subrecord.setFieldValue("attention",attention);
          subrecord.setFieldValue("addr1",address1);
          subrecord.setFieldValue("addr2",address2);
          subrecord.setFieldValue("city",city);
          // subrecord.setFieldValue("state",state);
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
          //shipaddress += country;
          shipaddress += country_hid;

          //ra.setFieldValue("shipaddress",shipaddress);
          ra.setFieldValue("custbody1",shipaddress);
        }
        //ra.setFieldValue("custbody_return_label_insurance",return_label_insurance);
        // nlapiLogExecution("Debug","test 4");
        rmaID = nlapiSubmitRecord(ra,true,true);  
        // nlapiLogExecution("Debug","test 5");
      }
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Creating Return Authorization","Details: " + err.message);
    return true;
  }
  try
  {
    //Create new Sales Order
    if(items_return_resize.length>0 || items_return_repair.length>0 || items_return_cust_be.length>0 || new_items.length>0)
    {
      var newOrder = nlapiTransformRecord("customer",customer,"salesorder",{recordmode: "dynamic"});
      //newOrder.setFieldValue("tranid",so_num + "EX");
      newOrder.setFieldValue("tranid",so_num+"UPGRADE");
      //Check if transaction ID already exists
      var tranid = newOrder.getFieldValue("tranid");
      newOrder.setFieldValue("tranid",checkNumber(tranid,1));
      //Set created from (original sales order)
      //newOrder.setFieldValue("custbody_created_from",created_from);
      //Set Invoice Date
      var filters = [];
      filters.push(new nlobjSearchFilter("createdfrom",null,"is",created_from));
      filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
      var cols = [];
      cols.push(new nlobjSearchColumn("trandate").setSort(true));
      var results = nlapiSearchRecord("invoice",null,filters,cols);
      if(results)
      {
        newOrder.setFieldValue("custbody_invoice_date",results[0].getValue("trandate"));
      }
      newOrder.setFieldValue("entity",customer);
      //if(result!=null)
      //newOrder.setFieldValue("salesrep",original_salesrep);
      //newOrder.setFieldValue("custbody247",new_salesrep);
      newOrder.setFieldValue("custbody58",exchange_notes);
      newOrder.setFieldValue("custbody6",delivery_date);
      /*
       * Updated as per client feedback document of 20 jun 2017
       */ 
      newOrder.setFieldValue("custbody87","10"); //Type of Order = Upgrade
      newOrder.setFieldValue("custbody82",delivery_date_firm);
      newOrder.setFieldValue("custbody53",pickup_at_be);
      newOrder.setFieldValue("custbody_pickup_location",pickupLocation);
      //newOrder.setFieldValue("custpage_return_shipping_label",return_shipping_label);
      newOrder.setFieldValue("custbody132",2); //Diamond Confirmed New (default to No)
      // newOrder.setFieldValue("custbody55",amount_paid); //Amount Paid By Customer
      newOrder.setFieldValue("class",place_of_sale); //Place of Sale
      newOrder.setFieldValue("custbody84","1"); //Fraud Check=Yes
      newOrder.setFieldValue("custbody245",locationReceived);
      if(items_return_ra.length>0 || items_exchange_ra.length>0)
        newOrder.setFieldValue("custbody138",7);
      else
        newOrder.setFieldValue("custbody138",'');
      newOrder.setFieldValue("custbodyfraud_check_new",1);
      if(orNotes!='')
        newOrder.setFieldValue("custbody254",orNotes);
      else
        newOrder.setFieldValue("custbody254",'');
      newOrder.setFieldValue("custbody194",delivery_instruction);
      newOrder.setFieldValue("custbody150",delivery_date_notes);
      newOrder.setFieldValue("custbody_drop_off",dropOff);
      /* if(return_shipping_label=="T")
      {
        newOrder.setFieldValue("custbody138","1"); //Return Label Status = Return label needed
      }*/
      newOrder.setFieldValue("custbody36",date_received_at_be); //Date Received at BE from Customer
      if(request.getParameter("custpage_block_auto_emails")=="T")
      {
        newOrder.setFieldValue("custbodyblock_auto_emails","T");
      }
      //var return_label_insurance=0;
      for(var x=0; x < items_return_resize.length; x++)//resize item
      {
        var insurance = items_return_resize[x].insurance;
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
        newOrder.selectNewLineItem("item");
        newOrder.setCurrentLineItemValue("item","item",1093360);//resize item
        newOrder.setCurrentLineItemValue("item","quantity",items_return_resize[x].quantity);
        newOrder.setCurrentLineItemValue("item","amount",items_return_resize[x].amount);
        newOrder.setCurrentLineItemValue("item","rate",items_return_resize[x].amount);//Added by Ravi on 01/05/2017
        newOrder.setCurrentLineItemValue("item","custcol_category","");
        newOrder.setCurrentLineItemValue("item","description",items_return_resize[x].desc);
        //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",items_return_resize[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",items_return_resize[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",items_return_resize[x].centerstone);
        if(items_return_resize[x].itemsku!=null && items_return_resize[x].itemsku !='')
          newOrder.setCurrentLineItemText("item","custcol_item_sku_so",items_return_resize[x].itemsku);
        if(items_return_resize[x].centerstone !=null && items_return_resize[x].centerstone !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',items_return_resize[x].centerstone,['itemid','salesdescription']);

          comments = "Set With:\n" + "SKU:" + '  '+centerStoneItemData.itemid +"\n" +"Description:"+'  '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          newOrder.setCurrentLineItemValue("item","custcol5",comments);
        }
        newOrder.commitLineItem("item");
      }
      for(var x=0; x < items_return_repair.length; x++)//repair item
      {
        var insurance = items_return_repair[x].insurance;
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);

        newOrder.selectNewLineItem("item");
        newOrder.setCurrentLineItemValue("item","item",1087131);//repair item
        newOrder.setCurrentLineItemValue("item","quantity",items_return_repair[x].quantity);
        newOrder.setCurrentLineItemValue("item","amount",items_return_repair[x].amount);

        newOrder.setCurrentLineItemValue("item","rate",items_return_repair[x].amount);//Added by Ravi on 01/05/2017
        newOrder.setCurrentLineItemValue("item","custcol_category","");
        newOrder.setCurrentLineItemValue("item","description",items_return_repair[x].desc);
        //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",items_return_repair[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",items_return_repair[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",items_return_repair[x].centerstone);
        if(items_return_repair[x].itemsku!=null && items_return_repair[x].itemsku !='')
          newOrder.setCurrentLineItemText("item","custcol_item_sku_so",items_return_repair[x].itemsku);
        if(items_return_repair[x].centerstone !=null && items_return_repair[x].centerstone !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',items_return_repair[x].centerstone,['itemid','salesdescription']);

          comments = "Set With:\n" + "SKU:" + '  '+centerStoneItemData.itemid +"\n" +"Description:"+'  '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          newOrder.setCurrentLineItemValue("item","custcol5",comments);
        }
        newOrder.commitLineItem("item");
      }
      for(var x=0; x < items_return_cust_be.length; x++)
      {
        var insurance = items_return_cust_be[x].insurance;
        if(insurance !=null && insurance != '')
          return_label_insurance =parseFloat(return_label_insurance) + parseFloat(insurance);
        newOrder.selectNewLineItem("item");
        newOrder.setCurrentLineItemValue("item","item",66394);//customer item
        newOrder.setCurrentLineItemValue("item","quantity",items_return_cust_be[x].quantity);
        newOrder.setCurrentLineItemValue("item","amount",items_return_cust_be[x].amount);
        newOrder.setCurrentLineItemValue("item","rate",items_return_cust_be[x].amount);//Added by Ravi on 01/05/2017
        newOrder.setCurrentLineItemValue("item","custcol_category","");
        newOrder.setCurrentLineItemValue("item","description",items_return_cust_be[x].desc);
        //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",items_return_cust_be[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",items_return_cust_be[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",items_return_cust_be[x].centerstone);
        if(items_return_cust_be[x].itemsku!=null && items_return_cust_be[x].itemsku!='')
          newOrder.setCurrentLineItemText("item","custcol_item_sku_so",items_return_cust_be[x].itemsku);
        if(items_return_cust_be[x].centerstone !=null && items_return_cust_be[x].centerstone !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',items_return_cust_be[x].centerstone,['itemid','salesdescription']);
          comments = "Set With:\n" + "SKU:" +'  ' +centerStoneItemData.itemid +"\n" +"Description:"+'  '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          newOrder.setCurrentLineItemValue("item","custcol5",comments);
        }
        newOrder.commitLineItem("item");
      }
      var center_stone_sku ='';
      var comments_new_order ='';
      for(var x=0; x < new_items.length; x++)
      {
        newOrder.selectNewLineItem("item");
        newOrder.setCurrentLineItemValue("item","item",new_items[x].item);
        newOrder.setCurrentLineItemValue("item","quantity",new_items[x].quantity);
        newOrder.setCurrentLineItemValue("item","amount",new_items[x].amount);
        newOrder.setCurrentLineItemValue("item","rate",new_items[x].rate);//Added by Ravi
        //newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value_2",new_items[x].insurance);
        newOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",new_items[x].insurance);
        //newOrder.setCurrentLineItemValue("item","custcol_category","");
        newOrder.setCurrentLineItemValue("item","custcol_center_gem_item",new_items[x].center_stone_sku);
        newOrder.setCurrentLineItemValue("item","description",new_items[x].description);
        center_stone_sku =new_items[x].center_stone_sku;
        if(center_stone_sku !=null && center_stone_sku !='')
        {
          var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_sku,['itemid','salesdescription']);
          comments_new_order = "Set With:\n" + "SKU:" +' '+centerStoneItemData.itemid +"\n" +"Description:"+' '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
          newOrder.setCurrentLineItemValue("item","custcol5",comments_new_order);
        }
        newOrder.commitLineItem("item");
      }
      nlapiLogExecution('debug','Return label insurance',return_label_insurance);
      var arr_related_Sales_Order =[];
      var arr_center_stone_sku =[];
      var  itemChkFlag ='0';
      // For Item Returning to BE
      for(var i=0;i<items_return_cust_be.length;i++)
      {
        //nlapiLogExecution("Debug","Disable Created From Item Returing to BE",items_return_cust_be[i].disablecreatedfrom);
        //if(items_return_cust_be[i].disablecreatedfrom=='T')
        //{
        var related_so = items_return_cust_be[i].relatedsalesorder ;
        if(related_so !='' && related_so != null)
        {
          arr_related_Sales_Order.push(related_so);
          // itemChkFlag ='1';   
        }
        var center_stone_sku = items_return_cust_be[i].centerstone ;
        if(center_stone_sku!='' && center_stone_sku!=null)
        {
          arr_center_stone_sku.push(center_stone_sku);
        }
        //}
      }
      // For Resize Related Sales Order
      for(var i=0;i<items_return_resize.length;i++)
      {
        // nlapiLogExecution("Debug","Disable Created From Resize",items_return_resize[i].disablecreatedfrom);
        // if(items_return_resize[i].disablecreatedfrom=='T')
        //{
        var related_so = items_return_resize[i].relatedsalesorder ;
        if(related_so !='' && related_so != null)
        {
          arr_related_Sales_Order.push(related_so);
          // itemChkFlag ='1';   
        }
        var center_stone_sku = items_return_resize[i].centerstone ;
        if(center_stone_sku!='' && center_stone_sku!=null)
        {
          arr_center_stone_sku.push(center_stone_sku);
        }
        //}
      }
      // For Repair Related Sales Order
      for(var i=0;i<items_return_repair.length;i++)
      {
        // nlapiLogExecution("Debug","Disable Created From Resize",items_return_repair[i].disablecreatedfrom);
        // if(items_return_repair[i].disablecreatedfrom=='T')
        //{
        var related_so = items_return_repair[i].relatedsalesorder ;
        if(related_so !='' && related_so != null)
        {
          arr_related_Sales_Order.push(related_so);
          //itemChkFlag ='1';   
        }
        var center_stone_sku = items_return_repair[i].centerstone ;
        if(center_stone_sku!='' && center_stone_sku!=null)
        {
          arr_center_stone_sku.push(center_stone_sku);
        }
        // }
      }
      // For Return RA Related Sales Order
      for(var i=0;i<items_return_ra.length;i++)
      {
        //nlapiLogExecution("Debug","Disable Created From for Return RA",items_return_ra[i].disablecreatedfrom);
        //if(items_return_ra[i].disablecreatedfrom=='T')
        // {
        var related_so = items_return_ra[i].relatedsalesorder ;
        if(related_so !='' && related_so != null)
        {
          arr_related_Sales_Order.push(related_so);
          //  itemChkFlag ='1';   
        }
        var center_stone_sku = items_return_ra[i].centerstone ;
        if(center_stone_sku!='' && center_stone_sku!=null)
        {
          arr_center_stone_sku.push(center_stone_sku);
        }
        //}
      }
      // For Exchange RA Related Sales Order
      for(var i=0;i<items_exchange_ra.length;i++)
      {
        // nlapiLogExecution("Debug","Disable Created From for Exchange RA",items_exchange_ra[i].disablecreatedfrom);
        //if(items_exchange_ra[i].disablecreatedfrom=='T')
        // {
        var related_so = items_exchange_ra[i].relatedsalesorder ;
        if(related_so !='' && related_so != null)
        {
          arr_related_Sales_Order.push(related_so);
          //  itemChkFlag ='1';   
        }
        var center_stone_sku = items_exchange_ra[i].centerstone ;
        if(center_stone_sku!='' && center_stone_sku!=null)
        {
          arr_center_stone_sku.push(center_stone_sku);
        }
        //}
      }
      // nlapiLogExecution("Debug","Related Sales Order",arr_related_Sales_Order);
      nlapiLogExecution("Debug","JSON Related Sales Order",JSON.stringify(arr_related_Sales_Order));
      // if(itemChkFlag=='0')
      newOrder.setFieldValue("custbody_created_from",orderId);
      //  if(itemChkFlag =='1')
      newOrder.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);
      nlapiLogExecution("Debug","JSON Center Stone Sku",JSON.stringify(arr_center_stone_sku));
      newOrder.setFieldValue("custbody_center_stone_link",arr_center_stone_sku);
      //Update Shipping Address if Necessary
      var updateAddress = false;
      if(address1 != newOrder.getFieldValue("shipaddr1"))
        updateAddress = true;
      if(!updateAddress && address2 != newOrder.getFieldValue("shipaddr2"))
        updateAddress = true;
      if(!updateAddress && city != newOrder.getFieldValue("shipcity"))
        updateAddress = true;
      // if(!updateAddress && state != newOrder.getFieldValue("shipstate"))
      //  updateAddress = true;
      if(!updateAddress && zipcode != newOrder.getFieldValue("shipzip"))
        updateAddress = true;
      if(!updateAddress && country != newOrder.getFieldValue("shipcountry"))
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
	  
	  	var addShippingFee = request.getParameter("custpage_add_shipping_fee");
		var statusOfIntlTaxes = request.getParameter("custpage_status_of_international_taxes");
		
		//Add shipping fee if required
		if(addShippingFee=="T")
		{
			newOrder.selectNewLineItem("item");
			newOrder.setCurrentLineItemValue("item","item","2379833"); //International Shipping Fee
			newOrder.setCurrentLineItemValue("item","quantity","1");
			newOrder.commitLineItem("item");
		}
		
		newOrder.setFieldValue("custbodystatus_of_international_taxes",statusOfIntlTaxes);
	  
      //Set Currency from Created from -- Added By Sandeep For NS -572
      var currency_value=nlapiLookupField('salesorder',created_from,'currency');      
      newOrder.setFieldValue("currency",currency_value);
      var orderID = nlapiSubmitRecord(newOrder,true,true);
      // response.sendRedirect("RECORD","salesorder",orderID); 
      if(rmaID!=null && rmaID!="")
      {
        nlapiSubmitField('returnauthorization',rmaID,'custbody_return_label_insurance',return_label_insurance);
      }
      var redirectUrl =  nlapiResolveURL ("RECORD" , "salesorder" , orderID , "view" ) ;
      var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
      nlapiLogExecution("Debug","redirect Url",comRedirectUrl);
      //Redirect user to new sales order
      var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
      htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ redirectUrl +'" ; window.close(); </script>');
      response.writePage(form);
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error Creating New Sales Order","Details: " + err.message);
    return true;
  }
}