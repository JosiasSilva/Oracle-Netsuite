function SO_IA_Create_Statement_Of_Value_For_Loose_Diamond(order,currency,pages,email,customer_name,today,statement_of_value_temp_so_ia_temp,type)
{
  var disclaimer ='';
  var title ='';
  var xml ='';
  if(type =="soIASinglePdfFileCreation")
  {
    disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new"));
    title =	nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_so_ia_title_two"));
  }
  else if(type =="bulkPrintingQueue")
  {
    disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new_two"));
    title =	nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_so_ia_title"));
  }
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    var myItemText=order.getLineItemText("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category, "My Item Text:"+ myItemText);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
    var chkImagUrl =false;
    if(category=="7")
    {
      //Setting with large center stone
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
      var diamondID = "";
      var sapphireID = "";
      var image = "";
      var gemstone = "";
      var gemstone_desc = "";
      var replacementAmount = 0.00;
      var centerHeader = "CENTER DIAMOND";
     // nlapiLogExecution("debug","Replacement Amount (1)",replacementAmount);
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
  
      diamondID = order.getLineItemValue("item","item",x+1);
      image += "https://image.brilliantearth.com/media/shape_images/";
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
      nlapiLogExecution("debug","Replacement Amount (1)",replacementAmount);
      chkImagUrl = true;
      //break;

      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;
      var k1=0;
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      var diamond = null;
      var dmdStoneId='';
      
      if(diamondID!="")
      {
        dmdStoneId=diamondID;	
        diamond = nlapiLookupField("item",diamondID,diamondFields,true);
        diamond.itemid = nlapiLookupField("item",diamondID,"itemid");
        diamond.custitem27 = nlapiLookupField("item",diamondID,"custitem27") + "ct";
        image += item["parent.itemid"] + "_" + diamond.custitem5.toLowerCase() + "_";
        //Only include is Origin = LAB GROWN or LAB CREATED
        if(diamond.custitem18!="Lab Grown" && diamond.custitem18!="Lab Created")
          diamond.custitem18 = "";
      }

      switch(item.custitem1)
      {
        case "1": //18K White Gold
        case "3": //Platinum
          image += "white";
          break;
        case "2": //18K Yellow Gold
          image += "yellow";
          break;
        case "7": //14K Rose Gold
          image += "rose";
          break;
      }
      image += "_top_t_w300_h300.jpg";

      if(pages > 0)
        xml += "<pbr/>";

      if(diamond==null)
      {
        diamond = {
          custitem27 : "",
          custitem7 : "",
          custitem19 : "",
          custitem28 : "",
          custitem18 : ""
        }
      }
      nlapiLogExecution("debug","Tax Rate",order.getFieldValue("taxrate"));
      //nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount)));
      nlapiLogExecution("debug","Replacement Amount (2)",replacementAmount);
      if(chkImagUrl==true)
      {
        var imgCheck = nlapiRequestURL(image);
        nlapiLogExecution("Debug","Image Check getCode()",imgCheck.getCode());
        if(imgCheck.getCode()!="200")
          image = "";
      } 
      else if(chkImagUrl==false)
      {
        image = "";
      }
      var cutString = "";
      if(diamond.custitem5!=null && diamond.custitem5!="")
        cutString += diamond.custitem5;
      if(diamond.custitem28!=null && diamond.custitem28!="" && cutString!="")
        cutString += ", ";
      if(diamond.custitem28!=null && diamond.custitem28!="")
        cutString += diamond.custitem28;
      var center_section = "";
      if(diamond.custitem27!=null && diamond.custitem27!="")
        center_section = "T";
      if(cutString!=null && cutString!="")
        center_section = "T";
      if(diamond.custitem7!=null && diamond.custitem7!="")
        center_section = "T";
      if(diamond.custitem19!=null && diamond.custitem19!="")
        center_section = "T";
      if(sapphireID!="")
      {
        cutString = "";
        center_section = "";
        color = "";
        clarity = "";
      }
      var pdf = {
        logo : nlapiEscapeXML("https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg"),
        title : title,
        date : formatDate(today),
        name : customer_name,
        address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
        city : nlapiEscapeXML(order.getFieldValue("billcity")),
        state : order.getFieldValue("billstate"),
        zipcode : order.getFieldValue("billzip"),
        type_of_jewelry : "One Loose Stone",
        //setting : "",
        //material : setMetal(item.custitem1),
        material : metalNameStr,					
        carat : sapphireID!="" ? "" : diamond.custitem27,
        cut : sapphireID!="" ? "" : cutString,
        color : sapphireID!="" ? "" : diamond.custitem7,
        clarity : sapphireID!="" ? "" : diamond.custitem19,
        center_diamond : "",
        accent_carat_weight : "",
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : disclaimer,
        signatory : "",
        signatory_title : "",
        //order_number : "",
        center_section : center_section,
        center_header : centerHeader,
        gemstone : gemstone,
        gemstone_desc : gemstone_desc,
        origin : diamond.custitem18
      };
      if(email)
        pdf.letterhead = "";
      else
        pdf.letterhead = "";

      nlapiLogExecution("debug","PDF JSON",JSON.stringify(pdf));

      if(pages==0)
      {
        if(email)
          xml += "<img align='center' src='https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>";
        else
          xml += "<div style='height: 60px;'> </div>";
      }

      for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
      {
        if(pages > 0)
        {
          xml += "<pbr/>";
          if(email)
            xml += "<img class='yagya' align='center' src='https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>";
          else
            xml += "<div style='height: 110px;'> </div>";
        }
        xml += statement_of_value_temp_so_ia_temp(pdf);
        pages++;
      }	
    }
  }
  return xml;
}