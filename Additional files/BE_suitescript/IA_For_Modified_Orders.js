function Chk_OneRing_With_Modifications(order,xml,pages,today,customer_name,currency,email,iaTemp,isIABlock,isIABlockCode,iaBlockMsg,countgemStoneArr,chkCategory,chkExchangeOrderType,chkGemStoneForExchange,chkRingForExchange)
{
  var chk_catOne_catTwo=0;
  var chk_modification= false;
  for(var u=0; u < order.getLineItemCount("item"); u++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",u+1),"custitem20");
    var itemId=order.getLineItemValue("item","item",u+1);
    if(category == 2 || category== 3)
    {
      chk_catOne_catTwo  += 1;
    }
    else if(category== 12)
    {
      if(itemId == 782)
      {
        var  replacementAmountforModifiedOrders = order.getLineItemValue("item","rate",u+1);
        var  descriptionforModifiedOrders = order.getLineItemValue("item","description",u+1);
        nlapiLogExecution("DEBUG","Description for Modified Orders",descriptionforModifiedOrders);
        nlapiLogExecution("DEBUG","Replacement Amount for Modified Orders",replacementAmountforModifiedOrders);
        chk_modification=true;
      }
    }
  }
  nlapiLogExecution("Debug","one Ring(Test) Lib File",chk_catOne_catTwo);
  nlapiLogExecution("Debug","Modifications(Test) Lib File",chk_modification);
  if(parseInt(chk_catOne_catTwo)== 1 && chk_modification == true)
  {
    return IA_For_Modified_Orders(order,xml,replacementAmountforModifiedOrders,descriptionforModifiedOrders,pages,today,customer_name,currency,email,iaTemp,isIABlock,isIABlockCode,iaBlockMsg,countgemStoneArr,chkCategory,chkExchangeOrderType,chkGemStoneForExchange,chkRingForExchange)
    //return true;
  }
  else 
    return false;
}
function IA_For_Modified_Orders(order,xml,replacementAmountforModifiedOrders,descriptionforModifiedOrders,pages,today,customer_name,currency,email,iaTemp,isIABlock,isIABlockCode,iaBlockMsg,countgemStoneArr,chkCategory,chkExchangeOrderType,chkGemStoneForExchange,chkRingForExchange)
{
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
    //-------to check whether IA block or not--------     
    isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");
    if(isIABlock=='' || isIABlock==null)
    {
      isIABlock='F';
    }
    nlapiLogExecution("debug","My Item Id:"+ myItemId+",Item Category:"+category+", isIABlock:"+isIABlock,myItemId);
    if(category=='2' || category=='3')
    {
      if(isIABlock=='T')
      {
        isIABlockCode='1';
        iaBlockMsg='IA From is Blocked for this item';
        break;
      }
    }
    //----End----
    if(category=="2")
    {
      chkCategory =true;
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
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));

      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
      var chkImagUrl =false;
      for(var i=0; i < order.getLineItemCount("item"); i++)
      {
        if(x==i)
          continue;

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
          image += "https://image.brilliantearth.com/media/images/";
          chkImagUrl = true;
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          nlapiLogExecution("debug","Replacement Amount",replacementAmount);
          break;
        }
      }

      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;
      var k1=0;

      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);       
      var diamond = null;
      //Added by Shiv
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
      //End by Shiv
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
              isIABlockCode='2';
              nlapiLogExecution("Debug","Information","There is no gemstone count information available for halo style on PO under Melee Item Tab having round shape.");
              iaBlockMsg='There is no gemstone count information available for this style';
            }
          }
          /*else
          {
            haloCheck='F'
            // isIABlockCode='2';
            nlapiLogExecution("Debug","Information","There is no po link associated with sales order & diamond shape is round.");
            //iaBlockMsg='There is no gemstone count information available for this style';
          }*/
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
      // nlapiLogExecution("debug","meleeItemRoundShape(T or F)",meleeItemRoundShape);
      //if(meleeItemRoundShape == true)
      //{
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
          //  else if(collection!='6' && (collection!==null && collection!=='')) // added /on 21/11/2016
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
      //}
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
      /*
        if(order.getFieldValue("taxrate") > 0)
        {
          var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
          replacementAmount = replacementAmount * taxrate;
        }
        */
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      replacementAmount += parseFloat(replacementAmountforModifiedOrders);
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
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount)
      var pdf = {
        logo : nlapiEscapeXML("https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg"),
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
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
        modified :nlapiEscapeXML(descriptionforModifiedOrders),
        carat : sapphireID!="" ? "" : diamond.custitem27,
        cut : sapphireID!="" ? "" : cutString,
        color : sapphireID!="" ? "" : diamond.custitem7,
        clarity : sapphireID!="" ? "" : diamond.custitem19,
        center_diamond : "",
        accent_carat_weight :  poLinkCount > 0 ? newTempTable : accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : order.getFieldValue("tranid"),
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
    else if(category=="3")
    {
      chkCategory =true;
      var replacementAmount=0.00;
      //Code Added by Shiv for eternity melee count
      var myItemId=order.getLineItemValue("item","item",x+1); 
      //var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");
      var field = ["parent","custitem9"];
      var item = nlapiLookupField("item",myItemId,field);
      var myParentItemId=item.parent;
      var isEternityItem= nlapiLookupField("item",myParentItemId,"custitem172");
      var eternityCheck='F';
      eternityCheck=isCheckEternity(myItemId)
      nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category+", eternityCheck:"+eternityCheck,myItemId);
      var NoOfGemStone='0';
      var totalCarat='0';
      var eternityMeleeResult=[];
      var meleeResult='';
      var newTempTable='';
      newTempTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";  
      if(eternityCheck=='T')
      {
        if(myItemId!='' && myItemId !=null)
        {
          eternityMeleeResult=getEternityMeleeDetail(myItemId);
          nlapiLogExecution('DEBUG', 'JSON Eternity Melee Result', JSON.stringify(eternityMeleeResult));
          if(eternityMeleeResult.length>0)
          {
            var createPOLinkCount = order.getLineItemCount('links');//find PO link on line item
            nlapiLogExecution('DEBUG', 'PO Link for Eternity style having eternity melee count size field', createPOLinkCount);
            if(createPOLinkCount>0)
            {
              meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
              nlapiLogExecution('DEBUG', 'JSON Melee Result for eternity style having eternity melee count size field', JSON.stringify(meleeResult));
              if(meleeResult.length>0)
              {
                nlapiLogExecution('DEBUG', 'Result 1', 'There is  melee item on PO &  having eternity melee count size field too');
                newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
              }
            }
            if(meleeResult.length==0)
            {
              NoOfGemStone=eternityMeleeResult[0].NoOfGemStone;
              totalCarat=eternityMeleeResult[0].totalCarat;
            }
          }
        }
      }
      nlapiLogExecution("debug","Final No. of GemStone:"+NoOfGemStone+", totalCarat:"+totalCarat,myItemId);
      if(eternityCheck=='T' && eternityMeleeResult.length ==0 && parseFloat(NoOfGemStone)==0)
      {
        var createPOLinkCount = order.getLineItemCount('links');//find PO link on line item
        nlapiLogExecution('DEBUG', 'PO Link for Eternity style', createPOLinkCount);
        if(createPOLinkCount>0)
        {
          meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
          nlapiLogExecution('DEBUG', 'JSON Melee Result for Eternity', JSON.stringify(meleeResult));
          if(meleeResult.length>0)
          {
            newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
          }
          else
          {
            eternityCheck='F';
            isIABlockCode='3';
            nlapiLogExecution("Debug","Information","There is no gemstone count information available for eternity style on PO under Melee Tab.");
            iaBlockMsg=' There is no gemstone count information available for eternity style.';
          }
        }
        /* else
        {
          eternityCheck='F';
          // isIABlockCode='3';
          nlapiLogExecution("Debug","Information","There is no PO Link associated with sales order for eternity style.");
          // iaBlockMsg='There is no gemstone count information available for eternity style.';
        }*/
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table for Eternity",newTempTable);
      //End 
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;
      //Wedding Bands
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));
      nlapiLogExecution("Debug","replacementAmount(test 1)",replacementAmount);
      /*
        if(order.getFieldValue("taxrate") > 0)
        {
          var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
          replacementAmount = replacementAmount * taxrate;
        }
        */
      replacementAmount += parseFloat(replacementAmountforModifiedOrders);
      nlapiLogExecution("Debug","replacementAmount(test 2)",replacementAmount);
      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
      nlapiLogExecution("Debug","replacementAmount(test 3)",replacementAmount);
      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];
      nlapiLogExecution("debug","accentText-3 : "+accentText,accentText);    // Added for UT
      //If vendor is Harout R, then use website text as sub-items are not populated
      if(item["vendor"]=="1223843")
        accentText = item["parent.custitem101"];
      if(accentText!="" && accentText!=null)
      {
        if(eternityCheck=='T' && isEternityItem=='1') // to check eternity
        { 
          var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";            
          accentText = accentText.split("\n");
          for(var i=0; i < accentText.length; i++)
          {
            var line = accentText[i].split(":");
            if((NoOfGemStone!='' && NoOfGemStone!=null) && (totalCarat!='' && totalCarat!=null))
            {
              if(line[0].toLowerCase()=="treatment")
                continue;
              if(line[0].toLowerCase()=="number of gemstones")
              {            
                if(NoOfGemStone!='')
                {
                  line[1]=NoOfGemStone;
                  nlapiLogExecution("debug","my number of gemstones: "+line[1],line[1]);
                }
              }
              if(line[0].toLowerCase()=="minimum total carats")
              {  
                if(totalCarat!=null)
                {               
                  line[1]=totalCarat;
                  nlapiLogExecution("debug","my total carats: "+line[1],line[1]);
                }
              }
            }
            accentTable += "<tr>";
            accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
            accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
            accentTable += "</tr>";
          }
          accentTable += "</table>";
        }
        else if(isEternityItem !='1')
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
          accentTable += "</table>";
        }
      }
      else
      {
        accentTable=""; 
      }
      var image = "https://image.brilliantearth.com/media/images/" + item["parent.itemid"] + "_";
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
      nlapiLogExecution("debug","Ring Image",image);
      var imgCheck = nlapiRequestURL(image);
      if(imgCheck.getCode()!="200")
        image = "";
      var poLinkCount =0;
      nlapiLogExecution("Debug","MeleeResult length",meleeResult.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);
      var pdf = {
        logo : "https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_title"),
        date : formatDate(today),
        name : customer_name,
        address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
        city : nlapiEscapeXML(order.getFieldValue("billcity")),
        state : order.getFieldValue("billstate"),
        zipcode : order.getFieldValue("billzip"),
        type_of_jewelry : "One wedding band",
        setting : "Brilliant Earth's " + item["parent.salesdescription"],
        //material : setMetal(item.custitem1),
        material : metalNameStr,   
        modified : nlapiEscapeXML(descriptionforModifiedOrders),
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : "",
        accent_carat_weight : poLinkCount>0 ? newTempTable :accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : order.getFieldValue("tranid"),
        center_section : "",
        center_header : "",
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
    /*else if(category=="24")
    {
      chkCategory =true;
      //chk_ia = false;
      //Estate Rings
      var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
      var fields2 = ["custitem56","custitem64"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
      var metalNameStr=item2.custitem64; // Added by Shiv per NS-402 assigned by Eric				
      var replacementAmount = order.getLineItemValue("item","rate",x+1);
      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.10)));
      var centerText = item.custitem51;
      var centerTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px'>";
      if(centerText!="" && centerText!=null)
      {
        centerText = centerText.split(",");
        for(var i=0; i < centerText.length; i++)
        {
          centerTable += "<tr>";
          centerTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(centerText[i]) + "</td>";
          centerTable += "</tr>";
        }
        centerTable += "</table>";
      }
      else
      {
        centerTable = "";
      }
      var accentText = item.custitem61;
      var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px' margin-bottom='10px'>";
      if(accentText!="" && accentText!=null)
      {
        accentText = accentText.split(",");
        for(var i=0; i < accentText.length; i++)
        {
          accentTable += "<tr>";
          accentTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(accentText[i]) + "</td>";
          accentTable += "</tr>";
        }

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
        type_of_jewelry : "One " + item2.custitem56,
        setting : nlapiEscapeXML("One-of-a-Kind Vintage Estate Piece " + item.custitem77),
        //material : setMetal(item.custitem64),
        material : metalNameStr,
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : centerTable,
        accent_carat_weight : accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : "",
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : order.getFieldValue("tranid"),
        center_section : "",
        center_header : "CENTER GEMSTONE",
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
            xml += "<div style='height:60px;'> </div>";
        }
        xml += iaTemp(pdf);
        pages++;
      }
    }*/
  }
  /*if(chkCategory==true)
  {
    xml += "</body></pdf>";
    nlapiLogExecution("Debug","xml",xml);
    var file = nlapiXMLToPDF(xml);
    response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
    response.write(file.getValue());
    return true;
  }
  else
    return false;*/

  if(isIABlockCode=='1' || isIABlockCode=='2' || isIABlockCode=='3')
  {
    var errorMsg = "";
    errorMsg += "<p>Instruction!<br/>"+iaBlockMsg+"</p>";	
    nlapiLogExecution("error","IA Instruction Error",errorMsg);		
    xml = errorMsg;
    var file = nlapiXMLToPDF(xml);
    response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
    response.write(file.getValue());
    return true;
  }
  else
  {
    if(category=='2' || category=='3' || category =='12')
    {
      xml += "</body></pdf>";
      var file = nlapiXMLToPDF(xml);
      response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
      response.write(file.getValue());
      nlapiLogExecution("debug","t1 modified");
      return true;
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
        return true;
      }
      /*else
      {
        var errorMsg = "";
        errorMsg += "<p>Instruction!<br/>IA From allowed for following item:";      
        errorMsg += "<br/>Setting with large center stone(2)";
        errorMsg += "<br/>Ring with no large center stone(3)";
        errorMsg += "<br/>Melee [Other colored gemstone](24)";  
        errorMsg += "<br/>Original Sales Order contains more than one gem stone";  
        errorMsg += "<br/>Item does not exits in following saved search All Finished Jewelry - insurance appraisal: Results ";  

        errorMsg += "</p>";
        nlapiLogExecution("error","IA Instruction Error",errorMsg);
        xml += errorMsg;
        xml += "</body></pdf>";
        var file = nlapiXMLToPDF(xml);
        response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
        response.write(file.getValue());
        nlapiLogExecution("debug","t3 modified");
      }*/
    }
  }

}