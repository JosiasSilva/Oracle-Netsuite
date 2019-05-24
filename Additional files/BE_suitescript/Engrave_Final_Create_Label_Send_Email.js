function  Engrave_Final_Create_Label_Send_Email(form)
{
  try
  {

    var  CC =[];
    var soid =request.getParameter("custpage_order_id");
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

    var retObj   = Order_Delivery_Information();
    nlapiLogExecution("Debug","Engrave Order Delivery Information else block",JSON.stringify(retObj));
    /* start get data from previous page*/
    var return_label_insurance = request.getParameter("custpage_insurance_val"); 
    var dropOff = request.getParameter("custpage_drop_off");

    var soRec = nlapiTransformRecord("customer",retObj.customer,"salesorder");
    var so_number = orderNumber + "ENG";
    soRec.setFieldValue("custbody58",retObj.so_notes);//Added on 03/06/2017
    soRec.setFieldValue("tranid",so_number);
    //Check if transaction ID already exists
    var tranid = soRec.getFieldValue("tranid");
    soRec.setFieldValue("tranid",checkNumber(tranid,1));
    soRec.setFieldValue("custbody87",8);//type Of Order = Engrave added by feedback document of 20 jun 2017
    soRec.setFieldValue("custbody6",retObj.deliveryDate);
    soRec.setFieldValue("custbody82",retObj.deliveryDateFirm);
    soRec.setFieldValue("custbody254",retObj.orNotes);//custbody58
    soRec.setFieldValue("salesrep",retObj.salesrep);
    soRec.setFieldValue("custbody36",retObj.datereceived);
    soRec.setFieldValue("custbody245",retObj.locationReceived);
    soRec.setFieldValue("custbody_drop_off",dropOff);
    soRec.setFieldValue("custbody194",retObj.delivery_instruction);
    soRec.setFieldValue("custbody150",retObj.delivery_date_notes);
    soRec.setFieldValue("custbody_drop_off",dropOff);
    soRec.setFieldValue("custbody138",3); //custbody138

    if(request.getParameter("custpage_pickup_at_be")!=null && request.getParameter("custpage_pickup_at_be")!="")
      soRec.setFieldValue("custbody53",request.getParameter("custpage_pickup_at_be"));

    soRec.setFieldValue("custbody_pickup_location",retObj.pickupLocation);

    soRec.setFieldValue("custbody55",0.00); //Amount Paid By Customer
    soRec.setFieldValue("custbody132",3); //Diamond Confirmed New - N/A
    soRec.setFieldValue("class",retObj.placeofsale); //Place of Sale
    //soRec.setFieldValue("class",2); //Place of Sale - Phone: Not Bank Wire
    soRec.setFieldValue("custbodyfraud_check_new",1); //fraud check new
    if(request.getParameter("custpage_block_auto_emails")=="T")
    {
      soRec.setFieldValue("custbodyblock_auto_emails","T");
    }
    var centerStoneLink=[];

    var comments='';
    for(var i=1; i<=request.getLineItemCount("custpage_customer_item_returning_be"); i++)
    {

      var description = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_des", i);
      //nlapiLogExecution("debug","description",description);
      var amount = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_amount", i);
      //nlapiLogExecution("debug","amount",amount);
      var insurance = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_production_ins_val", i);
      //nlapiLogExecution("debug","insurance",insurance);

      var center_stone_link= request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_center_stone_link", i);

      var item_link_sku= request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_link", i);
      var  engravingText = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_engraving_text", i);
      var  typeOfFont    = request.getLineItemValue("custpage_customer_item_returning_be", "custpage_rtn_item_type_of_font", i);
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
      soRec.setCurrentLineItemValue("item","item",39300);//Engrave ITEM
      soRec.setCurrentLineItemValue("item","description",description + "\n\n" + "Engrave in " +" "+ typeOfFont +" "+"Font:" +"\n\n" + engravingText);
      soRec.setCurrentLineItemValue("item","amount",amount);
      soRec.setCurrentLineItemValue("item","rate",amount);//Added by Ravi
      soRec.setCurrentLineItemValue("item","custcol_category","");
      soRec.setCurrentLineItemValue("item","custcol_full_insurance_value",insurance);
      soRec.setCurrentLineItemValue("item","custcol_center_gem_item",center_stone_link);
      if(item_link_sku!=null && item_link_sku!='')
        soRec.setCurrentLineItemText("item","custcol_item_sku_so",item_link_sku);
      if(center_stone_link !=null && center_stone_link !='')
      {
        var centerStoneItemData = nlapiLookupField('inventoryitem',center_stone_link,['itemid','salesdescription']);

        comments = "Set With:\n" + "SKU:" +'  '+ centerStoneItemData.itemid +"\n" +"Description:"+ '  '+centerStoneItemData.salesdescription +"\n" + "Arriving from SF: ";
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
    //if(itemChkFlag =='1')
    soRec.setFieldValue("custbodyrelated_sales_order",arr_related_Sales_Order);

    //soRec.setFieldValue("custbody123",retlblStatus[0]);// tracking no
    //soRec.setFieldValue("custbody137",retlblStatus[1]);// file 

    //Update Shipping Address if Necessary
    var updateAddress = false;

    if(retObj.address1 != soRec.getFieldValue("shipaddr1"))
      updateAddress = true;
    if(!updateAddress && retObj.address2 != soRec.getFieldValue("shipaddr2"))
      updateAddress = true;
    if(!updateAddress && retObj.city != soRec.getFieldValue("shipcity"))
      updateAddress = true;
    //if(!updateAddress && retObj.state != soRec.getFieldValue("shipstate"))
    //  updateAddress = true;
    if(!updateAddress && retObj.zipcode != soRec.getFieldValue("shipzip"))
      updateAddress = true;
    if(!updateAddress && retObj.country != soRec.getFieldValue("shipcountry"))
      updateAddress = true;
    if(!updateAddress && retObj.addressee != soRec.getFieldValue("shipaddressee"))
      updateAddress = true;
    if(!updateAddress && retObj.attention != soRec.getFieldValue("shipattention"))
      updateAddress = true;
    if(retObj.state!='' && retObj.state!=null)
    {
      if(!updateAddress && retObj.state != soRec.getFieldValue("shipstate"))
        updateAddress = true;
    }
    else if(retObj.state_txt!='' && retObj.state_txt!=null)
    {
      if(!updateAddress && retObj.state_txt != soRec.getFieldValue("shipstate"))
        updateAddress = true;
    }

    if(updateAddress)
    {
      var subrecord = soRec.editSubrecord("shippingaddress");
      subrecord.setFieldValue("country",retObj.country);
      subrecord.setFieldValue("addressee",retObj.addressee);
      if(retObj.attention!=null && retObj.attention!="")
        subrecord.setFieldValue("attention",retObj.attention);
      subrecord.setFieldValue("addr1",retObj.address1);
      subrecord.setFieldValue("addr2",retObj.address2);
      subrecord.setFieldValue("city",retObj.city);
      // subrecord.setFieldValue("state",retObj.state);

      if(retObj.state!=''&& retObj.state!=null)
        subrecord.setFieldValue("state",retObj.state);
      else if(retObj.state_txt!=''&& retObj.state_txt!=null)
        subrecord.setFieldValue("state",retObj.state_txt);
      subrecord.setFieldValue("zip",retObj.zipcode);
      subrecord.commit();

      var shipaddress = "";
      var final_state='';
      if(retObj.state!=''&& retObj.state!=null)
        final_state = retObj.state;
      else if(retObj.state_txt!=''&& retObj.state_txt!=null)
        final_state = retObj.state_txt;
      nlapiLogExecution("debug","final state",final_state);
      if(retObj.attention!=null && retObj.attention!="")
        shipaddress += retObj.attention + "\n";
      shipaddress += retObj.addressee + "\n";
      shipaddress += retObj.address1 + "\n";
      if(retObj.address2!=null && retObj.address2!="")
        shipaddress += retObj.address2 + "\n";
      shipaddress += retObj.city + " " + final_state + " " + retObj.zipcode + "\n";
      //shipaddress += country;
      shipaddress += retObj.country_hid;

      soRec.setFieldValue("shipaddress",shipaddress);
    } 
    var currency_value=nlapiLookupField('salesorder',soid,'currency');     
    soRec.setFieldValue("currency",currency_value);

    var  engraveOrderID = nlapiSubmitRecord(soRec,true,true);

    var shipService = setShipService(engraveOrderID);	
    nlapiLogExecution("Debug","Trans Id",shipService[1]);
    nlapiLogExecution("Debug","Ship Service",shipService[0]);

    // step 2: create return label
    var type = "engrave";
    var retlblStatus = createReturnLabelPdf(shipService[1],shipService[0]);    
    nlapiLogExecution("Debug","Tracking No",retlblStatus[0]);
    nlapiLogExecution("Debug","File Id",retlblStatus[1]);
    nlapiSubmitField('salesorder',engraveOrderID,['custbody123','custbody137'],[retlblStatus[0],retlblStatus[1]]);
    //

    var redirectUrl =  nlapiResolveURL("RECORD" , "salesorder" , engraveOrderID , "view" ) ;
    var  comRedirectUrl ="https://debugger.sandbox.netsuite.com" + redirectUrl ;
    nlapiLogExecution("Debug","redirect Url",comRedirectUrl);
    //Redirect user to new sales order
    var htmlHeader = form.addField('custpage_popup_close', 'inlinehtml');
    htmlHeader.setDefaultValue('<script type="text/javascript" language="javascript"> window.opener.location ="'+ comRedirectUrl+'" ; window.close(); </script>');

    response.writePage(form);
    /* End Here */   
    // step 3: send email with label
    var  emailType ="engrave";
    sendEmailWithAttachment(retlblStatus[1],CC,engraveOrderID,toEmail,emailType,copyEmailTemplateInternalId);


  }
  catch(err)
  {
    nlapiLogExecution("error","Engrave Page Processing Error in else block final page submission","Details: " + err.message);
  }
}