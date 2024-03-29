function SO_IA_For_Exchange_Two(order,pages,today,customer_name,currency,email,iaTemp,countgemStoneArr,type,chkCategory)
{
  var diamondID = "";
  var sapphireID = "";
  var image = "";
  var replacementAmount = 0.00;
  var image = "";
  var chkImagUrl = false;
  var soId  = order.getId();
  var tranid = order.getFieldValue("tranid");
  var xml ='';
  for(var i=0; i < order.getLineItemCount("item"); i++)
  {
    var sub_category = nlapiLookupField("item",order.getLineItemValue("item","item",i+1),"custitem20");
    if(sub_category=="7")
    {
      diamondID = order.getLineItemValue("item","item",i+1);
      image += "https://image.brilliantearth.com/media/shape_images/";
      chkImagUrl = true;
      replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      break;
    }   
    else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
    {
      sapphireID = order.getLineItemValue("item","item",i+1);
      nlapiLogExecution("debug","test 999");
      image += "https://image.brilliantearth.com/media/images/";
      chkImagUrl = true;
      replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      break;
    }
  }  
  var orderId = nlapiLookupField("salesorder",soId,"custbody_created_from");
  if(orderId == null || orderId =='') return '';
  var order = nlapiLoadRecord("salesorder",orderId);
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
    var isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");
    nlapiLogExecution("debug","My Item Id:"+ myItemId+",Item Category:"+category+", isIABlock:"+isIABlock,myItemId);
    if(category=='2' || category=='3')
    {
      if(isIABlock=='T')
      {
        continue;
      }
    }
    if(category=="2")
    {
      chkCategory = true;
      //Setting with large center stone
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
      var gemstone = "";
      var gemstone_desc = "";
      var centerHeader = "CENTER DIAMOND";
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      var metalField=["custitem1"]; 
      var chkImagUrl =false;
      for(var i=0; i < order.getLineItemCount("item"); i++)
      {
        var sub_category = nlapiLookupField("item",order.getLineItemValue("item","item",i+1),"custitem20");
        if(sub_category=="7")
        {
          countgemStoneArr.push(sub_category);
        }		
        else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
        {
          countgemStoneArr.push(sub_category);
        }
      }
      nlapiLogExecution("debug","Count Gem Stone Length for IA_For_Exchange_Two() fun",countgemStoneArr.length);
      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;
      var k1=0;
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);       
      var diamond = null;
      var haloCheck='F';
      var haloMeleeResult=[];
      var dmdShape='';
      var dmdMesearure='';
      var dmdHaloMeleCount='';
      var dmdStockUnit='';
      var dmdMinTotCarat='';
      var dmdCollection='';
      var dmdHaloMeleeId='';
      var dmdStoneId='';
      var  meleeResult='';
      var newTempTable='';
      var nonRoundShape ='' 
      var dmdMinTotCaratMarquise='';
      var dmdHaloMeleCountMarquise='';
      var myParentItemId=order.getLineItemValue("item","item",x+1); 
      var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");
      var collection='',dShape='';
      //collection=nlapiLookupField("item",myParentItemId,"custitem78");
      //added new code on 30 march 2017
      collection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
      nlapiLogExecution("debug","My Parent Item Id:"+myParentItemId+",Collection"+collection+",SubItem Id:"+subItemId+", diamondId:"+diamondID+", sapphireID:"+sapphireID,diamondID);
      if(sub_category=='8' && (sapphireID!='' && sapphireID !=null) && (diamondID=='' && diamondID==null))
      {
        dmdStoneId=sapphireID;          
      }
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
      if(sapphireID!="")
      {
        dmdStoneId=sapphireID;  
        diamond = nlapiLookupField("item",sapphireID,diamondFields,true);
        diamond.itemid = nlapiLookupField("item",sapphireID,"itemid");
        nlapiLogExecution("debug","Item ID",diamond.itemid);
        diamond.custitem27 = nlapiLookupField("item",sapphireID,"custitem27");
        image += item["parent.itemid"] + "-" + getSapphire(diamond.itemid) + "_";
        centerHeader = "CENTER GEMSTONE";
        gemstone = "T";
        gemstone_desc = nlapiEscapeXML(nlapiLookupField("item",sapphireID,"salesdescription"));
        diamond.custitem18 = "";
      }
      //Added by Shiv
      nlapiLogExecution("debug","dmd Stone Id",dmdStoneId);
      if(dmdStoneId !='' && dmdStoneId !=null)
        dShape=nlapiLookupField("item",dmdStoneId,"custitem5");   
      nlapiLogExecution("debug","My Item Halo Collection :="+collection+",Halo Shape:="+dShape+" for dmdStoneId:"+dmdStoneId,dmdStoneId); 
      var isHaloStyle='F';  
      if(collection=='T')
      {
        isHaloStyle='T';//Added on 22Sept-16
      }     
      var meleeItemRoundShape=true;
      newTempTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";   
      if((myParentItemId !='' && myParentItemId !=null) && (subItemId !='' && subItemId !=null) && (dmdStoneId !='' || dmdStoneId !=null) && (dShape=='1'))
      {
        nlapiLogExecution("debug","myParentItemId (Test)",myParentItemId);  
        haloMeleeResult=getHaloMeleeDetail(dmdStoneId,myParentItemId);
        nlapiLogExecution("debug","haloMeleeResult (Test)", JSON.stringify(haloMeleeResult));
        if(haloMeleeResult.length > 0)
        {
          var createPOLinkCount = order.getLineItemCount('links');//find PO link on line item
          nlapiLogExecution('DEBUG', 'PO Link for dimaond shape is round having halo melee count page', createPOLinkCount);
          if(createPOLinkCount>0)
          {
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            nlapiLogExecution('DEBUG', 'JSON Melee Result for round shape having halo melee count page', JSON.stringify(meleeResult));
            if(meleeResult.length>0)
            {
              nlapiLogExecution('DEBUG', 'Result 1', 'There is  melee item on PO & having halo melee count page too');
              newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
            }
          }
          if(meleeResult.length==0)// no melee data associated with PO
          {
            // nlapiLogExecution('DEBUG', 'Result 3', 'there is no PO link with salesorder but having halo melee count page');
            nlapiLogExecution('DEBUG', 'Result 2', 'There is no melee item on PO & having halo melee count page');
            haloCheck=haloMeleeResult[0].haloCheck;
            dmdShape=haloMeleeResult[0].haloDmdShape;
            dmdHaloMeleeId=haloMeleeResult[0].haloMeleeId;
            dmdMesearure=haloMeleeResult[0].haloMesearure;
            dmdHaloMeleCount=haloMeleeResult[0].totalGem;
            dmdStockUnit=haloMeleeResult[0].stockUnit;
            dmdMinTotCarat=haloMeleeResult[0].totMinCarat;
          }
        }
      } 
      if(haloMeleeResult.length==0 && isHaloStyle=='T' && myParentItemId !='' && myParentItemId !=null  && dmdStoneId !='' && dmdStoneId !=null)
      {
        var diamondShape=nlapiLookupField("item",dmdStoneId,"custitem5");
        nlapiLogExecution('DEBUG', 'diamond Shape',diamondShape);
        var diamondShapeText=nlapiLookupField("item",dmdStoneId,"custitem5",true);
        nlapiLogExecution('DEBUG', 'diamond Shape Text',diamondShapeText);
        var haloMeleeCollection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
        if(haloMeleeCollection=='T' && (diamondShape=='1' || diamondShape!='1'))
        {
          var createPOLinkCount = order.getLineItemCount('links');//find PO link on line item
          nlapiLogExecution('DEBUG', 'PO Link for dimaond having shape is ::'+ diamondShapeText, createPOLinkCount);
          if(createPOLinkCount>0)
          {
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            nlapiLogExecution('DEBUG', 'JSON Melee Result for diamond having shape::'+diamondShapeText, JSON.stringify(meleeResult));
            if(meleeResult.length>0)
            {
              newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
            }
            else
            {
              haloCheck='F'
              //isIABlockCode='2';
              nlapiLogExecution("Debug","Information","There is no gemstone count information available for halo style on PO under Melee Item Tab having round shape.");
              //iaBlockMsg +='There is no gemstone count information available for this style.<br/>';
              continue;
            }
          }
          else
          {
            haloCheck='F'
            //isIABlockCode='2';
            //iaBlockMsg='There is no po link associated with sales order & diamond shape is round';
            nlapiLogExecution("Debug","Information","There is no po link associated with sales order & diamond shape is round.");
            // iaBlockMsg +='There is no gemstone count information available for this style.<br/>';
            continue;
          }
        }
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table",newTempTable);
      // nlapiLogExecution("debug","My Halo Melee Result for Diamond Id:"+dmdStoneId," My haloCheck:"+haloCheck+", HaloMeleeId:"+dmdHaloMeleeId+", Diamond Shape:"+dmdShape+", dmdMesearure:"+dmdMesearure+", HaloMeleCount:"+dmdHaloMeleCount+", StockUnit:"+dmdStockUnit+", MinTotCarat:"+dmdMinTotCarat);
      //End by Shiv
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
      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];
      if(isHaloStyle=='F' && (item["parent.custitem9"]==null || item["parent.custitem9"]=="")) // Added per feedback on NS-413
      {
        accentText = item["parent.custitem101"];
      }
      //If vendor is Harout R, then use website text as sub-items are not populated
      if(item["vendor"]=="1223843")
        accentText = item["parent.custitem101"];
      nlapiLogExecution("debug","meleeItemRoundShape(T or F)",meleeItemRoundShape);
      if(meleeItemRoundShape == true)
      {
        if(accentText!="" && accentText!=null)
        {
          if(haloCheck=='T')   
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
                            //nlapiLogExecution("debug","my minimum total carats: "+line[1],line[1]);
                          }
                        }
                        accentTable += "<tr>";
                        accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
                        accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
                        accentTable += "</tr>";
                      }                     
                    }
                    //nlapiLogExecution("debug","accentTable-Round, Item Id:"+itemId, accentTable);
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
                          /*if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")*/
                          if(line[0].toLowerCase()=="treatment")
                            continue;   
                        accentTable += "<tr>";
                        accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
                        accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
                        accentTable += "</tr>";
                      }
                    }
                    //nlapiLogExecution("debug","accentTable-nonRound, Item Id:"+itemId, accentTable);
                  }
                }// end check index1
              }//end check accentTextArr
            }// end loop accentTextArr
            accentTable += "</table>";
          }
          else if(collection!='T')
          {
            var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";  
            accentText = accentText.split("\n");
            for(var i=0; i < accentText.length; i++)
            { 
              var line = accentText[i].split(":");
              if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
              {
                //if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")
                //continue;
                if(line[0].toLowerCase()=="treatment")
                  continue; 
                accentTable += "<tr>";
                accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
                accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
                accentTable += "</tr>";
              }
            }
            //nlapiLogExecution("debug","accentTable-else, Item Id:"+itemId, accentTable);
            accentTable += "</table>";                
          }
        }
        else
        {
          accentTable = "";
        }
      }
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
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      //var imgCheck = nlapiRequestURL(image);
      // if(imgCheck.getCode()!="200")
      // image = "";
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
      var poLinkCount =0;
      nlapiLogExecution("Debug","MeleeResult length",meleeResult.length);
      //nlapiLogExecution("Debug","NonRoundShape length",nonRoundShape.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      // else if(nonRoundShape.length>0)
      //  poLinkCount =  nonRoundShape[0].nonRoundShapeHeloMeleeCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);
      var title ='';
      var disclaimer ='';
      if(type =="soIASinglePdfFileCreation")
      {
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new");
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new"));
      }
      else if(type =="bulkPrintingQueue")
      {
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new_two");
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new_two"));
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
        type_of_jewelry : "One Lady's Engagement Ring",
        setting : "Brilliant Earth's " + item["parent.salesdescription"],
        //material : setMetal(item.custitem1),
        material : metalNameStr,          
        carat : sapphireID!="" ? "" : diamond.custitem27,
        cut : sapphireID!="" ? "" : cutString,
        color : sapphireID!="" ? "" : diamond.custitem7,
        clarity : sapphireID!="" ? "" : diamond.custitem19,
        center_diamond : "",
        accent_carat_weight :  poLinkCount > 0 ? newTempTable : accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : disclaimer,
        signatory : "",
        signatory_title : "",
        order_number : tranid,
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
        xml += iaTemp(pdf);
        pages++;
      } 
    }
  }
  if(chkCategory == true && (countgemStoneArr.length==0 || countgemStoneArr.length==1))
    return xml;
  else
    return '';
}