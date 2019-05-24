function  Matched_Wedding_Band_Final_Create_Label_Send_Email(form)
{

  try
  {

    var  CC =[];
    var soid =request.getParameter("custpage_order_id");
    nlapiLogExecution("debug","so id",soid);
    for(var i=1; i<=request.getLineItemCount("custpage_employee_list"); i++)
    {
      var ccChk = request.getLineItemValue("custpage_employee_list", "custpage_email_cc", i);
      if(ccChk == 'T')
      {
        var ccemail = request.getLineItemValue("custpage_employee_list", "custpage_email", i);
        CC.push(ccemail);
      }

    }
    nlapiLogExecution("Debug","CC Email",CC);
    nlapiLogExecution("Debug","CC Email stringify",JSON.stringify(CC));


    // step 1: create return label 
    /*var retlblStatus = createReturnLabelPdf();    
    nlapiLogExecution("Debug","Tracking No",retlblStatus[0]);
    nlapiLogExecution("Debug","File Id",retlblStatus[1]);*/
    // step 2 : create post sale order
    /* Start here Creation Post Sale Order */
    var copyEmailTemplateInternalId = request.getParameter("custpage_copy_email_template_id"); 
    var orderNumber = request.getParameter("custpage_order_num"); 
    nlapiLogExecution("debug","orderNumber",orderNumber);
    var toEmail = request.getParameter("custpage_email_address");
    nlapiLogExecution("debug","To Email",toEmail);
    /* start get data from previous page*/

    var customer = request.getParameter("custpage_customer");
    var deliveryDate = request.getParameter("custpage_delivery_date");
    var deliveryDateFirm = request.getParameter("custpage_delivery_date_firm");
    var orNotes = request.getParameter("custpage_or_notes");
    var salesrep = request.getParameter("custpage_sales_rep");
    var datereceived = request.getParameter("custpage_date_received_at_be");
    var locationReceived = request.getParameter("custpage_location_received_at_be");
    var pickupLocation = request.getParameter("custpage_pickup_location"); 
    var return_label_insurance = request.getParameter("custpage_insurance_val"); 
    var dropOff = request.getParameter("custpage_drop_off");
    var placeofsale = request.getParameter("custpage_place_of_sale");

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
    var so_notes = request.getParameter("custpage_so_notes");//Added on 03/06/2017
    var soRec = nlapiTransformRecord("customer",customer,"salesorder");
    var so_number = orderNumber + "WB";
    soRec.setFieldValue("custbody58",so_notes);//Added on 03/06/2017
    soRec.setFieldValue("tranid",so_number);
    //Check if transaction ID already exists
    var tranid = soRec.getFieldValue("tranid");
    soRec.setFieldValue("tranid",checkNumber(tranid,1));
    soRec.setFieldValue("custbody87",5);//Type Of Order = Matched Wedding Band [added by feedback document of 20 jun 2017]
    soRec.setFieldValue("custbody6",deliveryDate);
    soRec.setFieldValue("custbody82",deliveryDateFirm);
    soRec.setFieldValue("custbody254",orNotes);//custbody58
    soRec.setFieldValue("salesrep",salesrep);
    soRec.setFieldValue("custbody36",datereceived);
    soRec.setFieldValue("custbody245",locationReceived);
    soRec.setFieldValue("custbody_drop_off",dropOff);
    soRec.setFieldValue("custbody194",delivery_instruction);
    soRec.setFieldValue("custbody150",delivery_date_notes);
    soRec.setFieldValue("custbody_drop_off",dropOff);
    soRec.setFieldValue("custbody138",3); //custbody138

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
    var center_stone_sku ='';
    var comments_new_order ='';
    for(var x=0; x < request.getLineItemCount('custpage_new_item_order'); x++)
    {
      soRec.selectNewLineItem("item");
      soRec.setCurrentLineItemValue("item","item",request.getLineItemValue("custpage_new_item_order","new_order_item",x+1));
      soRec.setCurrentLineItemValue("item","description",request.getLineItemValue("custpage_new_item_order","desc",x+1));
      soRec.setCurrentLineItemValue("item","quantity",request.getLineItemValue("custpage_new_item_order","quantity",x+1));
      soRec.setCurrentLineItemValue("item","rate",request.getLineItemValue("custpage_new_item_order","rate",x+1));
      soRec.setCurrentLineItemValue("item","amount",request.getLineItemValue("custpage_new_item_order","amount",x+1));
      //soRec.setCurrentLineItemValue("item","custcol_full_insurance_value_2",request.getLineItemValue("custpage_new_item_order","production_insurance_value",x+1));
      soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",request.getLineItemValue("custpage_new_item_order","production_insurance_value",x+1));
      soRec.setCurrentLineItemValue("item","custcol_center_gem_item",request.getLineItemValue("custpage_new_item_order","center_stone_sku",x+1));
      center_stone_sku =request.getLineItemValue("custpage_new_item_order","center_stone_sku",x+1);
      if(center_stone_sku !=null && center_stone_sku !='')
      {
        var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_sku,['itemid','salesdescription']);

        comments_new_order = "Set With:\n" + "SKU:" +' '+centerStoneItemData.itemid +"\n" +"Description:"+' '+ centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
        soRec.setCurrentLineItemValue("item","custcol5",comments_new_order);
      }
      soRec.commitLineItem("item");
    }
    var centerStoneLink=[];

    var comments='';
    for(var i=1; i<=request.getLineItemCount("custpage_customer_item_returning_be"); i++)
    {

      var description = request.getLineItemValue("custpage_customer_item_returning_be", "desc", i);
      nlapiLogExecution("debug","description",description);
      var amount = request.getLineItemValue("custpage_customer_item_returning_be", "amount", i);
      nlapiLogExecution("debug","amount test",amount);
      var insurance = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_production_ins_val", i);
      //nlapiLogExecution("debug","insurance",insurance);

      var center_stone_link= request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_center_stone_link", i);

      var item_link_sku= request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_link", i);

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
      soRec.setCurrentLineItemValue("item","item",66394);//customer ITEM
      soRec.setCurrentLineItemValue("item","description",description);
      soRec.setCurrentLineItemValue("item","amount",amount);
      soRec.setCurrentLineItemValue("item","rate",amount);//Added by Ravi
      soRec.setCurrentLineItemValue("item","custcol_category","");
      //soRec.setCurrentLineItemValue("item","custcol_full_insurance_value_2",insurance);
      soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",insurance);
      soRec.setCurrentLineItemValue("item","custcol_center_gem_item",center_stone_link);
      if(item_link_sku!=null && item_link_sku!='')
        soRec.setCurrentLineItemText("item","custcol_item_sku_so",item_link_sku);
      if(center_stone_link !=null && center_stone_link !='')
      {
        var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_link,['itemid','salesdescription']);

        comments = "Set With:\n" + "SKU:" + '  '+centerStoneItemData.itemid +"\n" +"Description:"+ '  '+centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
        soRec.setCurrentLineItemValue("item","custcol5",comments);
      }

      soRec.commitLineItem("item");

    }

    soRec.setFieldValue('custbody_center_stone_link',centerStoneLink);
    soRec.setFieldValue('custbody_return_label_insurance',return_label_insurance);
    //Set created from sales order
    var  itemChkFlag ='0';
    var related_Sales_Order ='';
    var arr_related_Sales_Order =[];
    for(var i=0;i<request.getLineItemCount("custpage_customer_item_returning_be");i++)
    {

      var related_so = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_related_sales_order", i+1) ;
      if(related_so !='' && related_so != null)
      {
        arr_related_Sales_Order.push(related_so);
        //itemChkFlag ='1';   
      }

    }
    // if(itemChkFlag=='0')
    soRec.setFieldValue("custbody_created_from",soid);
    // if(itemChkFlag =='1')
    soRec.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);

    // soRec.setFieldValue("custbody123",retlblStatus[0]);// tracking no
    // soRec.setFieldValue("custbody137",retlblStatus[1]);// file 

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

      soRec.setFieldValue("shipaddress",shipaddress);
    } 
    var currency_value=nlapiLookupField('salesorder',soid,'currency');     
    soRec.setFieldValue("currency",currency_value);

    var  mwbOrderID = nlapiSubmitRecord(soRec,true,true);

    var shipService = setShipService(mwbOrderID);	
    nlapiLogExecution("Debug","Trans Id",shipService[1]);
    nlapiLogExecution("Debug","Ship Service",shipService[0]);

    // step 2: create return label
    var type= "matched_wedding_band";
    var retlblStatus = createReturnLabelPdf(shipService[1],shipService[0],type,mwbOrderID);    
    nlapiLogExecution("Debug","Tracking No",retlblStatus[0]);
    nlapiLogExecution("Debug","File Id",retlblStatus[1]);
    nlapiSubmitField('salesorder',mwbOrderID,['custbody123','custbody137'],[retlblStatus[0],retlblStatus[1]]);
    //

    var redirectUrl =  nlapiResolveURL("RECORD" , "salesorder" , mwbOrderID , "view" ) ;
    var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
    nlapiLogExecution("Debug","redirect Url",comRedirectUrl);
    //Redirect user to new sales order
    var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
    htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ redirectUrl+'" ; window.close(); </script>');

    response.writePage(form);
    /* End Here */   
    // step 3: send email with label
    var emailType ="matchedweddingband";
    nlapiLogExecution("debug","second");
    sendEmailWithAttachment(retlblStatus[1],CC,mwbOrderID,toEmail,emailType,copyEmailTemplateInternalId);


  }
  catch(err)
  {
    nlapiLogExecution("error","Matched Wedding Band Item(s) else block","Details: " + err.message);
    return true;
  }
}