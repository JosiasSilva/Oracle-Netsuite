function IA_For_Exchange_One_Print_Queue_IA_V5_Template(order,today,currency,iaTemp,countgemStoneArr,chkGemStoneForExchange,chkRingForExchange,chkExchangeOrderType,customer_name,countgemStoneArrTwo,pageData_no_print)
{
  var orderId  = order.getId();
  var tranid = order.getFieldValue("tranid");
  var tempPageData =[];
  var chk_category = false;
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    var myItemText=order.getLineItemText("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category, "My Item Text:"+ myItemText);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);

    if(category=="2")
    {
      var chkImagUrl =false;
      chk_category = true;
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

      nlapiLogExecution("debug","Replacement Amount (1)",replacementAmount);
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric

      for(var i=0; i < order.getLineItemCount("item"); i++)
      {
        if(x==i)
          continue;

        var sub_category = nlapiLookupField("item",order.getLineItemValue("item","item",i+1),"custitem20");
        if(sub_category=="7")
        {
          diamondID = order.getLineItemValue("item","item",i+1);
          image += "https://image.brilliantearth.com/media/shape_images/";
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          nlapiLogExecution("debug","Replacement Amount (2)",replacementAmount);
          chkImagUrl = true;
          if(chkExchangeOrderType == true)
          {
            chkGemStoneForExchange =true;
            chkRingForExchange = true
          }
          break;
        }		
        else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
        {
          sapphireID = order.getLineItemValue("item","item",i+1);
          image += "https://image.brilliantearth.com/media/images/";
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          nlapiLogExecution("debug","Replacement Amount (3)",replacementAmount);
          chkImagUrl = true;
          if(chkExchangeOrderType ==true)
          {
            chkGemStoneForExchange =true;
            chkRingForExchange = true
          }
          break;
        }
      }		
      if(chkExchangeOrderType == true && chkGemStoneForExchange == false)
      {
        nlapiLogExecution("Debug","Exchange Order Type (2)",chkExchangeOrderType);
        nlapiLogExecution("Debug","GemStone For Exchange",chkGemStoneForExchange);
        chkRingForExchange = true;
        var originalSOId = nlapiLookupField("salesorder",orderId,"custbody_created_from");//tempPageData
        if(originalSOId == null || originalSOId =='') return tempPageData;
        var original_order_id = nlapiLoadRecord("salesorder",originalSOId);
        for(var i=0; i < original_order_id.getLineItemCount("item"); i++)
        {
          var sub_category = nlapiLookupField("item",original_order_id.getLineItemValue("item","item",i+1),"custitem20");
          if(sub_category=="7")
          {
            diamondID = original_order_id.getLineItemValue("item","item",i+1);
            image += "https://image.brilliantearth.com/media/shape_images/";
            chkImagUrl = true;
            replacementAmount += parseFloat(original_order_id.getLineItemValue("item","amount",i+1));
            nlapiLogExecution("debug","Replacement Amount(4)",replacementAmount);
            countgemStoneArr.push(sub_category);
          }   
          else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
          {
            sapphireID = original_order_id.getLineItemValue("item","item",i+1);
            image += "https://image.brilliantearth.com/media/images/";
            chkImagUrl = true;
            replacementAmount += parseFloat(original_order_id.getLineItemValue("item","amount",i+1));
            nlapiLogExecution("debug","Replacement Amount(5)",replacementAmount);
            countgemStoneArr.push(sub_category);
          }
        } 	
      }	
      nlapiLogExecution("Debug","GemStone Count For Exchange One IA Print Queue Template in Original Sales Order",countgemStoneArr.length);
      if(countgemStoneArr.length>=2)
        break;
      var isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");
      if(isIABlock=='T')
      {
        pageData_no_print.push('IA is Blocked for SO For order #:'+tranid );  
        continue;
      }
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
      var myParentItemId=order.getLineItemValue("item","item",x+1); 
      var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");
      var collection='',dShape='';
      var nonRoundShape =''; 
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
      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];
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
            nonRoundShape = checkhaloMeleeCountPageOnPOforNonRoundShape(order, createPOLinkCount);
            nlapiLogExecution('DEBUG', 'JSON Result for non Round Shape having halo melee count page (Test 1)', JSON.stringify(nonRoundShape));
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            nlapiLogExecution('DEBUG', 'JSON Melee Result on PO', JSON.stringify(meleeResult));

            if(nonRoundShape.length>0)
            {
              newTempTable = rtnNewMeleeItemTable_Temp(nonRoundShape,newTempTable,accentText);
            }
            else if(meleeResult.length>0)
            {
              nlapiLogExecution('DEBUG', 'Result 1', 'There is  melee item on PO & updated by user');
              newTempTable = rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText);
            }
            else
            {
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
            nonRoundShape = checkhaloMeleeCountPageOnPOforNonRoundShape(order, createPOLinkCount);
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            if(nonRoundShape.length>0)
            {
              nlapiLogExecution('DEBUG', 'JSON Melee Result for non Round Shape having halo melee count page', JSON.stringify(nonRoundShape));
              newTempTable = rtnNewMeleeItemTable_Temp(nonRoundShape,newTempTable,accentText);
            }
            else if(meleeResult.length>0)
            {
              nlapiLogExecution('DEBUG', 'There is  melee item on PO & updated by user', JSON.stringify(meleeResult));
              newTempTable = rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText);
            }
            else
            {
              haloCheck='F';
              //isIABlockCode='2';
              nlapiLogExecution("Debug","Information","There is no gemstone count information available for halo style on PO under Melee Item Tab having round shape.");
              //iaBlockMsg='There is no gemstone count information available for this style';
              pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available due to shape of halo style.'  );	
              //page_data_categorynot_match=true;
              continue;	
            }
          }
        }
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table",newTempTable);
      nlapiLogExecution("debug","My Halo Melee Result for Diamond Id:"+dmdStoneId," My haloCheck:"+haloCheck+", HaloMeleeId:"+dmdHaloMeleeId+", Diamond Shape:"+dmdShape+", dmdMesearure:"+dmdMesearure+", HaloMeleCount:"+dmdHaloMeleCount+", StockUnit:"+dmdStockUnit+", MinTotCarat:"+dmdMinTotCarat);
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


      //var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      //if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
      //accentText = item["parent.custitem101"];

      if(isHaloStyle=='F' && (item["parent.custitem9"]==null || item["parent.custitem9"]=="")) // Added per feedback on NS-413
      {
        accentText = item["parent.custitem101"];
      }

      //If vendor is Harout R, then use website text as sub-items are not populated
      if(item["vendor"]=="1223843")
        accentText = item["parent.custitem101"];

      if(accentText!="" && accentText!=null)
      {
        if(haloCheck=='T')   
        {	
          var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";							
          var accentTextArr=accentText.split("Treatment:	None");   
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

      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));

      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
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
      nlapiLogExecution("Debug","NonRoundShape length",nonRoundShape.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      else if(nonRoundShape.length>0)
        poLinkCount =  nonRoundShape[0].nonRoundShapeHeloMeleeCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);
      var pdf = {
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
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : tranid,
        center_section : center_section,
        center_header : centerHeader,
        gemstone : gemstone,
        gemstone_desc : gemstone_desc,
        origin : diamond.custitem18
      };

      for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
      {
        tempPageData.push(iaTemp(pdf));
      }
    }//end of cat 2
    else if(category=="3")
    {
      chk_category = true;
      //Wedding Bands
      var isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");
      if(isIABlock=='T')
      {
        pageData_no_print.push('IA is Blocked for SO For order #:'+tranid );  
        continue;
      }
      var myItemId=results[x].getValue("item"); 
      var eternityCheck='F';
      eternityCheck=isCheckEternity(myItemId)
      nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category+", eternityCheck:"+eternityCheck,myItemId);
      //check isEternityItem//
      var field = ["parent","custitem9"];
      var item = nlapiLookupField("item",myItemId,field);
      var myParentItemId=item.parent;
      var isEternityItem= nlapiLookupField("item",myParentItemId,"custitem172");
      //End check
      var NoOfGemStone='0';
      var totalCarat='0';
      var eternityMeleeResult=[];
      var meleeResult='';
      var newTempTable='';
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
      var item = nlapiLookupField("item",results[x].getValue("item"),fields);
      var accentText = "";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];
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
                newTempTable = rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText);
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
      nlapiLogExecution("debug","Eternity  Check-> No. of GemStone:"+NoOfGemStone+", totalCarat:"+totalCarat,myItemId); 
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
            newTempTable = rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText);
          }
          else
          {
            eternityCheck='F';
            nlapiLogExecution("Debug","Information","There is no gemstone count information available for eternity style on PO under Melee Tab.");
            pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available for eternity style.');
            //page_data_categorynot_match=true;
            continue;
          }
        }
        /*else
            {
              eternityCheck='F';
              nlapiLogExecution("Debug","Information","There is no PO Link associated with sales order for eternity style.");
              pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available for eternity style.');
              page_data_categorynot_match=true;
              continue;
            }*/
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table for Eternity",newTempTable);
      // var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
      //var item = nlapiLookupField("item",results[x].getValue("item"),fields);
      var replacementAmount = results[x].getValue("fxamount");
      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
      // var accentText = "";
      //if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
      //  accentText = item["parent.custitem101"];
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
          nlapiLogExecution("Debug","isEternityItem(Test)",isEternityItem);
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
      var poLinkCount =0;
      nlapiLogExecution("Debug","MeleeResult length",meleeResult.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);
      var pdf = {
        date : formatDate(today),
        name : customer_name,
        address1 : nlapiEscapeXML(results[x].getValue("billaddress1")),
        city : nlapiEscapeXML(results[x].getValue("billcity")),
        state : results[x].getValue("billstate"),
        zipcode : results[x].getValue("billzip"),
        type_of_jewelry : "One wedding band",
        setting : "Brilliant Earth's " + item["parent.salesdescription"],
        material : setMetal(item.custitem1),
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : "",
        accent_carat_weight : poLinkCount>0 ? newTempTable :accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : results[x].getValue("tranid"),
        center_section : "",
        center_header : "",
        gemstone : "",
        gemstone_desc : "",
        origin : ""
      };
      for(var z=0; z < results[x].getValue("quantity"); z++)
      {
        tempPageData.push(iaTemp(pdf));
      }
    }//end of cat 3
    else if(category=="24")
    {
      chk_category = true;
      //Estate Rings
      var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
      var fields2 = ["custitem56","custitem64"];
      var item = nlapiLookupField("item",results[x].getValue("item"),fields);
      var item2 = nlapiLookupField("item",results[x].getValue("item"),fields2,true);
      var replacementAmount = results[x].getValue("fxamount");
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
        date : formatDate(today),
        name : customer_name,
        address1 : nlapiEscapeXML(results[x].getValue("billaddress1")),
        city : nlapiEscapeXML(results[x].getValue("billcity")),
        state : results[x].getValue("billstate"),
        zipcode : results[x].getValue("billzip"),
        type_of_jewelry : "One " + item2.custitem56,
        setting : nlapiEscapeXML("One-of-a-Kind Vintage Estate Piece " + item.custitem77),
        material : setMetal(item.custitem64),
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : centerTable,
        accent_carat_weight : accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer")),
        signatory : "",
        signatory_title : "",
        order_number : results[x].getValue("tranid"),
        center_section : "",
        center_header : "CENTER GEMSTONE",
        gemstone : "",
        gemstone_desc : "",
        origin : ""
      };
      for(var z=0; z < results[x].getValue("quantity"); z++)
      {
        tempPageData.push(iaTemp(pdf));         
      }
    }
  }
  if(chk_category == true && (countgemStoneArr.length>=2))
  {
    var result = "For order #:" + tranid + ",Original Sales order has more than 1 center gem stones.";
    return pageData_no_print.push(result);
  }
  if(chk_category == true && (countgemStoneArr.length==1 || countgemStoneArr.length==0))
  {
    if(tempPageData.length>0)
      return tempPageData;
    else return tempPageData;
  }
  var tempPageDateTwo=[];
  if(chkExchangeOrderType == true && chkRingForExchange == false)
  {
    return IA_For_Exchange_Two_Print_Queue_IA_V5_Template(order,today,currency,iaTemp,countgemStoneArrTwo,tempPageDateTwo,customer_name,pageData_no_print);
  }
  else 
    return tempPageDateTwo;
}