function IA_For_Finished_Jewelry(order,xml,pages,today,customer_name,currency,email,iaTemp,chkCategory)
{
  var finished_jewelry_item_found = false;
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    var myItemText=order.getLineItemText("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category, "My Item Text:"+ myItemText);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
    if(category=="5" || category =="4" || category == "34")
    {
      // for Pendant(5) ,Earings(4),Bracelet(34)
      var chkItem = false ;
      var searchResult_FinishedJewelry = nlapiSearchRecord(null,"8025",null,null);
      if(searchResult_FinishedJewelry)
      {  
        for(var sr =0; sr<searchResult_FinishedJewelry.length;sr++)
        {
          var itemId = searchResult_FinishedJewelry[sr].getId();
          if(itemId == myItemId)
          {
            chkItem = true;
            break;
          }
        }
      }
      nlapiLogExecution("DEBUG","Finished jewelry (gold and platinum metal only) has been found in saved search result",chkItem);
      if(chkItem== true)
      {
        finished_jewelry_item_found = true;
        //chkCategory =true;
        var fields = ["salesdescription","custitem64","custitem101"];
        var fields2 = ["custitem64"];
        var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
        var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
        var metalNameStr=item2.custitem64;  
        var replacementAmount = order.getLineItemValue("item","rate",x+1);
        replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
        var accentText = item.custitem101;
        var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px' margin-bottom='10px'>";
        if(accentText!="" && accentText!=null)
        {
          var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";              
          var accentTextArr=accentText.split("Treatment:  None");   
          for(var j=0; j < accentTextArr.length; j++)
          { 
            if(accentTextArr[j]!='' && accentTextArr[j]!=null)
            {
              var testTemp=accentTextArr[j];
              var index1= testTemp.toLowerCase().indexOf("conflict free diamond");
              var index11= testTemp.toLowerCase().indexOf("diamond"); //Added by Sandeep for NS-624
              if(index1>0 || index11>0)
              {
                var index2 = accentTextArr[j].toLowerCase().indexOf("round"); //if Round 
                if(index2 > 0 ) 
                {
                  var  accentTextTemp = accentTextArr[j].split("\n");
                  for(var i=0; i < accentTextTemp.length; i++)
                  { 
                    var line = accentTextTemp[i].split(":");
                    if(line[0]!='\r' && line[0]!='' && line[0]!=null)   
                    {
                      if(line[0].toLowerCase()=="treatment")
                        continue;
                      if(line[0].toLowerCase()=="number of gemstones")
                      {           
                        if(dmdHaloMeleCount!='')
                        {
                          line[1]=dmdHaloMeleCount;
                        }
                      }
                      if(line[0].toLowerCase()=="minimum total carats")
                      {  
                        if(dmdMinTotCarat!=null)
                        {              
                          line[1]=dmdMinTotCarat;
                        }
                      }
                      accentTable += "<tr>";
                      accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
                      accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
                      accentTable += "</tr>";
                    }                     
                  }
                } 
                else
                {
                  var accentTextTemp = accentTextArr[j].split("\n");
                  for(var i=0; i < accentTextTemp.length; i++)
                  { 
                    var line = accentTextTemp[i].split(":");
                    if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
                    {
                      if(line[0])
                        if(line[0].toLowerCase()=="treatment")
                          continue;   
                      accentTable += "<tr>";
                      accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
                      accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
                      accentTable += "</tr>";
                    }
                  }
                }
              }// end check index1
            }//end check accentTextArr
          }// end loop accentTextArr
          accentTable += "</table>";
        }
        else
        {
          accentTable = "";
        }
        var pdf = {
          logo : "https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
          title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
          date : formatDate(today),
          name : customer_name,
          address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
          city : nlapiEscapeXML(order.getFieldValue("billcity")),
          state : order.getFieldValue("billstate"),
          zipcode : order.getFieldValue("billzip"),
          type_of_jewelry : category == 34 ? "One Bracelet" : category == 4 ? "One Pair Earrings" :"One Necklace",
          // type_of_jewelry : category == 34 ? "One Bracelet" : category == 4 ? "One Pair Earrings" :category == 5 ? "One Necklace":'',
          setting : nlapiEscapeXML(item.salesdescription),
          material : metalNameStr,
          carat : "",
          cut : "",
          color : "",
          clarity : "",
          center_diamond :"",
          accent_carat_weight : accentTable,
          replacement_price : currency + " " + addCommas(replacementAmount),
          image : "",
          disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
          signatory : "",
          signatory_title : "",
          order_number : order.getFieldValue("tranid"),
          center_section : "",
          center_header :"",
          gemstone : "",
          gemstone_desc : "",
          origin : ""
        };
        if(email)
          pdf.letterhead = "";
        else
          pdf.letterhead = "";

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
          xml += iaTemp(pdf);
          pages++;
        } 

      }
    }
  }

  if(finished_jewelry_item_found == true)
  {
    xml += "</body></pdf>";
    var file = nlapiXMLToPDF(xml);
    response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
    response.write(file.getValue());
    nlapiLogExecution("DEBUG","IA For Finished Jewelry(Test 1)");	
    return true;
  }
  else
    return false;

  /*if(chkItem == true)
  {
    if(category=='5' || category=='34' || category=='4')
    {
      xml += "</body></pdf>";
      var file = nlapiXMLToPDF(xml);
      response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
      response.write(file.getValue());
      nlapiLogExecution("DEBUG","Main File IA(Test 1)");	
    }
    else
    {
      if(chkCategory==true)
      {
        xml += "</body></pdf>";
        nlapiLogExecution("Debug","xml",xml);
        var file = nlapiXMLToPDF(xml);
        response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
        response.write(file.getValue());
        nlapiLogExecution("DEBUG","Main File IA(Test 2)");	
      }
      else
      {
        var errorMsg = "";
        errorMsg += "<p>Instruction!<br/>IA From allowed for following item:";      
        errorMsg += "<br/>Item does not exits in following saved search All Finished Jewelry - insurance appraisal: Results ";  

        errorMsg += "</p>";
        nlapiLogExecution("error","IA Instruction Error",errorMsg);
        xml += errorMsg;
        xml += "</body></pdf>";
        var file = nlapiXMLToPDF(xml);
        response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
        response.write(file.getValue());
        nlapiLogExecution("DEBUG","Main File IA(Test 3)");	
      }
    }
    return true;
  }*/
}