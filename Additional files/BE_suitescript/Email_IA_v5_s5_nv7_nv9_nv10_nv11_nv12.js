nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Email_IA(type)
{
  if(type=="create")
  {
    try
    {
      var template = nlapiGetFieldValue("template");
      nlapiLogExecution("debug","Template ID",template);
      if(template=="316" || template=="490")
      {
        var transaction = nlapiGetFieldValue("transaction");
        nlapiLogExecution("debug","Transaction Internal ID",transaction);

        var isIABlock=false;
        isIABlock=isIABlocked(transaction);
        if(isIABlock==false)
        {
          var filters = [];
          filters.push(new nlobjSearchFilter("internalid",null,"is",transaction));
          filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
          var cols = [];
          cols.push(new nlobjSearchColumn("tranid"));
          var results = nlapiSearchRecord("salesorder",null,filters,cols);
          if(results)
          {
            var file = nlapiXMLToPDF(Generate_IA_Form(transaction));
            var iaCodeVal = nlapiGetContext().getSetting('SESSION', 'custpage_hIACode');						
            nlapiLogExecution("debug","isIABlockCode Get Value:"+iaCodeVal,transaction)
            if(iaCodeVal =='0')
            {
              file.setName(results[0].getValue("tranid")+"_IA.pdf");
              file.setFolder("2168897"); //Auto Insurance Appraisals
              var fileId = nlapiSubmitFile(file);

              nlapiSelectNewLineItem("mediaitem");
              nlapiSetCurrentLineItemValue("mediaitem","mediaitem",fileId);
              nlapiCommitLineItem("mediaitem");
            }
          }
        }
        else
        {
          nlapiLogExecution("debug","IA is Blocked for SO Internal Id:"+transaction,transaction);

        }
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Attaching IA Form","Details: " + err.message);
      return true;
    }
  }
}

function Email_IA_BL(type,form)
{
  if(type=="create")
  {
    //form.setScript("customscript_message_client");
    form.addField("custpage_attach_ia","checkbox","Attach Insurance Appraisal",null,"attachments")
  }
}

function Email_IA_FC(type,name)
{
  alert("Name: " + name);
  if(name=="template")
  {
    if(nlapiGetFieldValue("template")=="18")
    {
      nlapiSetFieldValue("custpage_attach_ia","T");
    }
  }
}

function Generate_IA_Form(record)
{
  var email = true;
  var orderId = record;
  var order = nlapiLoadRecord("salesorder",orderId);

  var currency = order.getFieldValue("currencysymbol");

  var pages = 0;
  var xml = "";
  xml += "<?xml version=\"1.0\"?>";
  xml += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">";
  xml += "<pdf>";
  xml += "<head>";
  xml += "<link name='freightDispPro' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_book.otf'/>";
  xml += "<link name='freightDispSB' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_semibold.otf'/>";
  xml += "<link name='brandonMed' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_med.otf'/>";
  xml += "<link name='brandon' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_reg.otf'/>";
  xml += "<link name='brandonBold' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_bld.otf'/>";
  xml += "<style>";
  xml += " .brandonGrotesqueMed {font-family:brandonMed;}";
  xml += " .brandonGrotesque {font-family:brandon;}";
  xml += " .brandonGrotesqueBold {font-family:brandonBold;}";
  xml += " .freightDispProSB {font-family:freightDispSB;}";
  xml += " .freightDispPro {font-family:freightDispPro;}";
  xml += " .pt9 {font-size:9pt; line-height: 11pt;}";
  xml += " .pt10 {font-size:10pt; line-height: 14pt;}";
  xml += " .photo {}";
  xml += " .topborder {border-top: 1px solid black; margin-left: 400px;}";
  xml += "</style>";
  xml += " .yagya {padding: 40px 0; height: 100px;     padding-bottom: -40px!important;}";	
  xml += "<macrolist>";
  xml += "<macro id='nlheader'>";
  xml += "<table cellborder='0' cellmargin='0' cellpadding='0'><tr><td style='color: #ffffff;'>Header</td></tr></table>";
  xml += "</macro>";
  xml += "<macro id='nlfooter'>";
  xml += "<p class='freightDispPro' color='#959595' align='center'>26 O'Farrell Street &#8226; 10th Floor &#8226; San Francisco, CA 94108 &#8226; 800.691.0952 &#8226; BrilliantEarth.com</p>";
  xml += "</macro>";
  xml += "</macrolist>";
  xml += "</head>";
  xml+= "<body size='letter' header='nlheader' header-height='35px' footer='nlfooter' footer-height='0.5in'>";
  var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_template_file");
  var templateFile = nlapiLoadFile(templateID);
  var template = templateFile.getValue();
  var iaTemp = Handlebars.compile(template);

  var today = new Date();
  today = nlapiDateToString(today,"date");

  var pageData = [];
  var isIABlockCode='0',iaBlockMsg='';

  // below code related to the task [ns-941]

  /*var  xml_ia_for_finished_jewelry = IA_For_Finished_Jewelry_Email_Template(order,xml,pages,today,currency,email,iaTemp,isIABlockCode,pageData)
  nlapiLogExecution("Debug","Result ia for finished jewelry",xml_ia_for_finished_jewelry);
  if(xml_ia_for_finished_jewelry !='')
    return xml_ia_for_finished_jewelry;*/

  var chkCategory =false;
  var chkExchangeOrderType = false;

  var soFields = nlapiLookupField("salesorder",orderId,["custbody87","tranid"]);//Exchange Order type =4,Order#
  var orderType = soFields.custbody87;
  var order_tran_id = soFields.tranid;
  nlapiLogExecution("Debug","Exchange Order Type Value",orderType);// Exchange Order Type = 4
  nlapiLogExecution("Debug","Exchange Transaction Order #",order_tran_id);
  if(orderType == 4 && order_tran_id.indexOf('EX')!=-1)
    chkExchangeOrderType = true;
  nlapiLogExecution("Debug","Exchange Order Type(T/F)",chkExchangeOrderType);

  var chkRingForExchange= false;
  var chkGemStoneForExchange = false;
  var countgemStoneArr =[];

  if(chkExchangeOrderType == true)
  {
    var ia_for_exchange_one_email_template =  IA_For_Exchange_One_Email_Template(order,xml,pages,today,currency,email,iaTemp,countgemStoneArr,chkCategory,chkGemStoneForExchange,chkRingForExchange,chkExchangeOrderType,pageData,isIABlockCode);
    nlapiLogExecution("Debug","Result ia_for_exchange_one_email_template",ia_for_exchange_one_email_template);
    if(ia_for_exchange_one_email_template !='')
      return ia_for_exchange_one_email_template;
  }

  var chk_more_than_one_ring_with_modification_email_template = Chk_MoreThan_OneRing_With_Modifications_Email_Template(order,xml,pageData,isIABlockCode);
  nlapiLogExecution("Debug","Return of Chk_MoreThan_OneRing_With_Modifications() fun for email template",chk_more_than_one_ring_with_modification_email_template);
  if(chk_more_than_one_ring_with_modification_email_template != '')
    return chk_more_than_one_ring_with_modification_email_template;

  var  Chk_One_Ring_With_Modifications_Email_Template = Chk_OneRing_With_Modifications_Email_Template(order,xml,pages,today,currency,email,iaTemp,chkCategory,pageData,isIABlockCode);
  if(Chk_One_Ring_With_Modifications_Email_Template !='')
    return Chk_One_Ring_With_Modifications_Email_Template;

  // added for Loose Diamond having Statement Of Value Template
  var templateId_Statement_Of_Value_Email_Template = nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_temp_id_email_ia");
  var templateFile_Statement_Of_Value_Email_Template = nlapiLoadFile(templateId_Statement_Of_Value_Email_Template);
  var template_Statement_Of_Value_Email_Template = templateFile_Statement_Of_Value_Email_Template.getValue();
  var statement_of_value_email_template = Handlebars.compile(template_Statement_Of_Value_Email_Template);

  var xml_chk_LooseDiamond_Email_Template =  chk_LooseDiamond_For_IA_Email_Template(order,currency,pages,email,today,xml,statement_of_value_email_template,chkCategory,pageData,isIABlockCode);
  nlapiLogExecution("Debug","Return vale of chk Loose Diamond For IA Email Template",xml_chk_LooseDiamond_Email_Template);
  if(xml_chk_LooseDiamond_Email_Template!='')
    return xml_chk_LooseDiamond_Email_Template;

  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    var myItemId=order.getLineItemValue("item","item",x+1);
    var myItemText=order.getLineItemText("item","item",x+1);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category, "My Item Text:"+ myItemText);
    nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);

    if(category=="2")
    {
      //Setting with large center stone
      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
      var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
      var diamondID = "";
      var sapphireID = "";
      var image = "";
      var gemstone = "";
      var gemstone_desc = "";
      var centerHeader = "CENTER DIAMOND";
      var replacementAmount = 0.00;
      replacementAmount += parseFloat(order.getLineItemValue("item","rate",x+1));

      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric

      for(var i=0; i < order.getLineItemCount("item"); i++)
      {
        if(x==i)
          continue;

        var sub_category = nlapiLookupField("item",order.getLineItemValue("item","item",i+1),"custitem20");
        if(sub_category=="7")
        {
          diamondID = order.getLineItemValue("item","item",i+1);
          image += "http://image.brilliantearth.com/media/shape_images/";
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          nlapiLogExecution("debug","Replacement Amount",replacementAmount);
          break;
        }		
        else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
        {
          sapphireID = order.getLineItemValue("item","item",i+1);
          image += "http://image.brilliantearth.com/media/images/";
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          nlapiLogExecution("debug","Replacement Amount",replacementAmount);
          break;
        }
      }				

      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;

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
      var myParentItemId=order.getLineItemValue("item","item",x+1); 
      var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");	
      var collection='';
      var  meleeResult='';
      var newTempTable='';
      var dShape ='';
      var nonRoundShape ='';
      //collection=nlapiLookupField("item",myParentItemId,"custitem78");
      // added on 30 March 2017
      collection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
      nlapiLogExecution("debug","My Parent Item Id:"+myParentItemId+",SubItem Id:"+subItemId+", diamondId:"+diamondID+", sapphireID:"+sapphireID,myParentItemId);						
      if(sub_category=='8' && (sapphireID!='' && sapphireID !=null) && (diamondID=='' || diamondID==null))
      {
        dmdStoneId=sapphireID;					
      }
      //End

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
      nlapiLogExecution("debug","dmd Stone Id",dmdStoneId);
      if(dmdStoneId!='' && dmdStoneId!=null)
        dShape=nlapiLookupField("item",dmdStoneId,"custitem5");   
      nlapiLogExecution("debug","My Item Halo Collection :="+collection+",Halo Shape:="+dShape+" for dmdStoneId:"+dmdStoneId,dmdStoneId); 

      //Added By Shiv to get Halo Melee Detail//
      var isHaloStyle='F';  
      if(collection=='T')
      {
        isHaloStyle='T';//Added on 22Sept-16
      } 	
      newTempTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";  
      if((myParentItemId !='' && myParentItemId !=null) && (subItemId !='' && subItemId !=null) && (dmdStoneId !='' && dmdStoneId !=null)&& (dShape=='1'))
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
            // updated code of [NS-876]
            nonRoundShape = checkhaloMeleeCountPageOnPOforNonRoundShape(order, createPOLinkCount);
            nlapiLogExecution('DEBUG', 'JSON Result for non Round Shape having halo melee count page (Test 1)', JSON.stringify(nonRoundShape));
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            nlapiLogExecution('DEBUG', 'JSON Melee Result on PO', JSON.stringify(meleeResult));

            if(nonRoundShape.length>0)
            {
              newTempTable = rtnNewMeleeItemTable(nonRoundShape,newTempTable);
            }
            else if(meleeResult.length>0)
            {
              nlapiLogExecution('DEBUG', 'Result 1', 'There is  melee item on PO & updated by user');
              newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
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
            // updated code of [NS-876]
            nonRoundShape = checkhaloMeleeCountPageOnPOforNonRoundShape(order, createPOLinkCount);
            meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
            if(nonRoundShape.length>0)
            {
              nlapiLogExecution('DEBUG', 'JSON Melee Result for non Round Shape having halo melee count page', JSON.stringify(nonRoundShape));
              newTempTable = rtnNewMeleeItemTable(nonRoundShape,newTempTable);
            }
            else if(meleeResult.length>0)
            {
              nlapiLogExecution('DEBUG', 'There is  melee item on PO & updated by user', JSON.stringify(meleeResult));
              newTempTable = rtnNewMeleeItemTable(meleeResult,newTempTable);
            }
            else
            {
              haloCheck='F';
              isIABlockCode='2';
              nlapiLogExecution("Debug","Information","There is no gemstone count information available for halo style");
              iaBlockMsg='There is no gemstone count information available for this style';
            }
          }
        }
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table",newTempTable);
      nlapiLogExecution("debug","My Halo Melee Result for Diamond Id:"+dmdStoneId," My haloCheck:"+haloCheck+", HaloMeleeId:"+dmdHaloMeleeId+", Diamond Shape:"+dmdShape+", dmdMesearure:"+dmdMesearure+", HaloMeleCount:"+dmdHaloMeleCount+", StockUnit:"+dmdStockUnit+", MinTotCarat:"+dmdMinTotCarat);
      //End

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

      //if(pages > 0)
      //	xml += "<pbr/>";

      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];

      if(isHaloStyle=='F' && (item["parent.custitem9"]==null || item["parent.custitem9"]=="")) // Added per Rachel's feedback on NS-413
      {
        accentText = item["parent.custitem101"];
      }			
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
              var index11= testTemp.toLowerCase().indexOf("diamond");
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

      replacementAmount = Math.ceil(replacementAmount * 1.30);

      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      /*
			var imgCheck = nlapiRequestURL(image);
			if(imgCheck.getCode()!="200")
				image = "";
			*/	
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
      // updated code of [NS-876]
      var poLinkCount =0;
      nlapiLogExecution("Debug","MeleeResult length",meleeResult.length);
      nlapiLogExecution("Debug","NonRoundShape length",nonRoundShape.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      else if(nonRoundShape.length>0)
        poLinkCount =  nonRoundShape[0].nonRoundShapeHeloMeleeCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);

      var pdf = {
        logo : nlapiEscapeXML("http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg"),
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_title"),
        date : formatDate(today),
        name : nlapiEscapeXML(nlapiLookupField("customer",order.getFieldValue("entity"),"altname")),
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
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_disclaimer")),
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

      /*
			if(email)
				xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
			else
				xml += "<div style='height: 60px;'> </div>";
			*/

      /*for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
      {
        /*
				if(pages > 0)
				{
					xml += "<pbr/>";
					if(email)
						xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
					else
						xml += "<div style='height: 60px;'> </div>";
				}


        pageData.push("<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>" + iaTemp(pdf));

        //xml += iaTemp(pdf);
        pages++;
      }		*/
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
    }
    else if(category=="3")
    {
      //Code Added by Shiv for eternity melee count
      var myItemId=order.getLineItemValue("item","item",x+1); 
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
        /*else
        {
          eternityCheck='F';
          isIABlockCode='3';
          nlapiLogExecution("Debug","Information","There is no PO Link associated with sales order for eternity style.");
          iaBlockMsg='There is no gemstone count information available for eternity style.';
        }*/
      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table for Eternity",newTempTable);
      //End 
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;

      //Wedding Bands
      //if(pages > 0)
      //	xml += "<pbr/>";

      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);

      var replacementAmount = order.getLineItemValue("item","rate",x+1);

      /*
			if(order.getFieldValue("taxrate") > 0)
			{
				var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
				replacementAmount = replacementAmount * taxrate;
			}
			*/

      replacementAmount = Math.ceil(replacementAmount * 1.30);

      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
        accentText = item["parent.custitem101"];

      if(accentText!="" && accentText!=null)
      {

        if(eternityCheck=='T' && isEternityItem=='1') // to check eternity
        {	var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";						

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

      var image = "http://image.brilliantearth.com/media/images/" + item["parent.itemid"] + "_";
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
      /*
			var imgCheck = nlapiRequestURL(image);
			if(imgCheck.getCode()!="200")
				image = "";
			*/
      var poLinkCount =0;
      nlapiLogExecution("Debug","MeleeResult length",meleeResult.length);
      if(meleeResult.length>0)
        poLinkCount =  meleeResult[0].meleeItemPOCount;
      nlapiLogExecution("Debug","PO Link Count",poLinkCount);
      var pdf = {
        logo : "http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_title"),
        date : formatDate(today),
        name : nlapiEscapeXML(nlapiLookupField("customer",order.getFieldValue("entity"),"altname")),
        address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
        city : nlapiEscapeXML(order.getFieldValue("billcity")),
        state : order.getFieldValue("billstate"),
        zipcode : order.getFieldValue("billzip"),
        type_of_jewelry : "One wedding band",
        setting : "Brilliant Earth's " + item["parent.salesdescription"],
        //material : setMetal(item.custitem1),
        material : metalNameStr,				
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : "",
        accent_carat_weight : poLinkCount>0 ? newTempTable :accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_disclaimer")),
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

      /*
			if(email)
				xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
			else
				xml += "<div style='height: 60px;'> </div>";
			*/

      /*for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
      {
        /*
				if(pages > 0)
				{
					xml += "<pbr/>";
					if(email)
						xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
					else
						xml += "<div style='height: 60px;'> </div>";
				}


        pageData.push("<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>" + iaTemp(pdf));

        //xml += iaTemp(pdf);
        pages++;
      }*/
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
    }
    else if(category=="24")
    {
      //Estate Rings
      var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
      var fields2 = ["custitem56","custitem64"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
      var metalNameStr=item2.custitem64; // Added by Shiv per NS-402 assigned by Eric
      //if(pages > 0)
      //	xml += "<pbr/>";

      var replacementAmount = order.getLineItemValue("item","rate",x+1);
      /*
			if(order.getFieldValue("taxrate") > 0)
			{
				var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
				replacementAmount = replacementAmount * taxrate;
			}
			*/

      replacementAmount = Math.ceil(replacementAmount * 1.1);

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
      /*
			var imgCheck = nlapiRequestURL(image);
			if(imgCheck.getCode()!="200")
				image = "";
			*/

      var pdf = {
        logo : "http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
        title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_title"),
        date : formatDate(today),
        name : nlapiEscapeXML(nlapiLookupField("customer",order.getFieldValue("entity"),"altname")),
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
        disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_disclaimer")),
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

      /*
			if(email)
				xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
			else
				xml += "<div style='height: 60px;'> </div>";
			*/

      /*for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
      {
        /*
				if(pages > 0)
				{
					xml += "<pbr/>";
					if(email)
						xml += "<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' />";
					else
						xml += "<div style='height: 60px;'> </div>";
				}


        pageData.push("<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>" + iaTemp(pdf));

        //xml += iaTemp(pdf);
        pages++;
      }*/
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
    }
    else if(category=="5" || category =="4" || category == "34")
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
        chkCategory =true;
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
          title : nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_title"),
          date : formatDate(today),
          name : nlapiEscapeXML(nlapiLookupField("customer",order.getFieldValue("entity"),"altname")),
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
          disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_email_disclaimer")),
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

        /* for(var z=0; z < order.getLineItemValue("item","quantity",x+1); z++)
        {
          pageData.push("<img align='center' src='http://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg' dpi='200'/>" + iaTemp(pdf));
          pages++;
        } */
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
      }
    }
  }
  //nlapiSubmitField("salesorder",soId,"custbody_ia_block_code",isIABlockCode);
  nlapiGetContext().setSetting('SESSION','custpage_hIACode',isIABlockCode);
  nlapiLogExecution("debug","isIABlockCode Set Value:"+isIABlockCode,orderId);
  //xml += pageData.join("<pbr/>");
  xml += "</body></pdf>";
  //if(isIABlockCode!='2' || isIABlockCode!='3'){	}
  return xml;
}

/* New Metal List added by Shiv*/
/*function setMetal(metalID) {
    var metalName = "";
    switch (metalID) {
        case "1":
            metalName = "18K White Gold";
            break;
        case "2":
            metalName = "18K Yellow Gold";
            break;
        case "3":
            metalName = "Platinum";
            break;
        case "4":
            metalName = "Palladium";
            break;
        case "5":
            metalName = "14K White Gold";
            break;
        case "6":
            metalName = "14K Yellow Gold";
            break;
        case "7":
            metalName = "14K Rose Gold";
            break;
        case "9":
            metalName = "Sterling Silver";
            break;
        case "25":
            metalName = "10K White Gold";
            break;
        case "27":
            metalName = "10K Yellow Gold";
            break;
        case "32":
            metalName = "18K Rose Gold";
            break;
        case "35":
            metalName = "22K Yellow Gold";
            break;
        case "36":
            metalName = "9K Yellow Gold";
            break;
        case "41":
            metalName = "10K Rose Gold";
            break;
        case "44":
            metalName = "19K White Gold";
            break;
        case "45":
            metalName = "20K White Gold";
            break;
        case "46":
            metalName = "15K Yellow Gold";
            break;
        case "47":
            metalName = "12K White Gold";
            break;
        case "48":
            metalName = "21K White Gold";
            break;
        case "51":
            metalName = "15K Yellow Gold";
            break;
        case "53":
            metalName = "21K Rose Gold";
            break;
        case "54":
            metalName = "21K Yellow Gold";
            break;
        case "55":
            metalName = "17K White Gold";
            break;
        case "59":
            metalName = "15K Rose Gold";
            break;
        case "66":
            metalName = "19K Yellow Gold";
            break;
        case "67":
            metalName = "9K Rose Gold";
            break;
        case "69":
            metalName = "14K Yellow Gold, 18k Yellow Gold";
            break;
        case "70":
            metalName = "14K White Gold, 14K Yellow Gold";
            break;
        case "75":
            metalName = "Platinum, 18K White Gold";
            break;
        case "77":
            metalName = "18K White Gold, 18K Yellow Gold";
            break;
        case "78":
            metalName = "10K White Gold, 10K Yellow Gold ";
            break;
        case "79":
            metalName = "14K Yellow Gold, Palladium";
            break;
        case "80":
            metalName = "8K Yellow Gold";
            break;
        case "81":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "82":
            metalName = "12K Rose Gold";
            break;
        case "84":
            metalName = "18K Yellow Gold, 18K Rose Gold";
            break;
        case "85":
            metalName = "18K White Gold, Platinum";
            break;
        case "86":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "87":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "89":
            metalName = "18K White Gold, 10K White Gold";
            break;
        case "90":
            metalName = "14K Yellow Gold, 14K White Gold";
            break;
        case "91":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "92":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "94":
            metalName = "14K Yellow Gold, Platinum";
            break;
        case "96":
            metalName = "Platinum, 10K White Gold";
            break;
        case "98":
            metalName = "15K Yellow Gold, Sterling Silver";
            break;
        case "99":
            metalName = "14K Yellow Gold, Sterling Silver";
            break;
        case "100":
            metalName = "14K White Gold, 18K Yellow Gold";
            break;
        case "101":
            metalName = "14K White Gold, 14K Yellow Gold";
            break;
        case "102":
            metalName = "14K Yellow Gold, Sterling Silver";
            break;
        case "103":
            metalName = "15K Yellow Gold, Sterling Silver";
            break;
        case "104":
            metalName = "18K Rose Gold, Platinum";
            break;
        case "105":
            metalName = "18K Yellow Gold, 18K White Gold";
            break;
        case "106":
            metalName = "Platinum,14K White Gold";
            break;
        case "107":
            metalName = "Platinum,14K Yellow Gold";
            break;
        case "109":
            metalName = "18K White Gold, 14K White Gold";
            break;
        case "110":
            metalName = "14K White Gold, 14K Rose Gold,14K Yellow Gold";
            break;
        case "111":
            metalName = "14K Yellow Gold, Selective Rhodium Plating";
            break;
        case "113":
            metalName = "10K Yellow Gold, 10K Rose Gold";
            break;
        case "115":
            metalName = "12K Yellow Gold";
            break;
        case "116":
            metalName = "22K Rose Gold";
            break;
        case "117":
            metalName = "18K Yellow Gold, Rhodium plating";
            break;
        case "118":
            metalName = "14K Rose Gold, 18K Yellow Gold";
            break;
        case "119":
            metalName = "18K Rose Gold, 14K Yellow Gold";
            break;
        case "120":
            metalName = "15K White Gold";
            break;
        case "121":
            metalName = "18K Yellow Gold, 22K Yellow Gold";
            break;
        case "122":
            metalName = "10K Yellow Gold, 14K White Gold";
            break;
        case "123":
            metalName = "14K Yellow Gold, 14K White Gold";
            break;
        case "124":
            metalName = "14K White Gold, 18K White Gold";
            break;
        case "125":
            metalName = "14K Yellow Gold, 10K White Gold";
            break;
        case "126":
            metalName = "12K Yellow Gold, Selective Rhodium Plating";
            break;
        case "129":
            metalName = "18k Yellow Gold, Selective Rhodium Plating";
            break;
        case "130":
            metalName = "14K White Gold, 14K Rose Gold";
            break;
        case "131":
            metalName = "18K Rose Gold, Selective Rhodium Plating";
            break;
        case "132":
            metalName = "14K Yellow Gold, 18K White Gold";
            break;
        case "133":
            metalName = "17K Yellow Gold";
            break;
        case "134":
            metalName = "14K Yellow Gold,Palladium";
            break;
    }
    return metalName;
}*/
/*end Metal List*/


function formatDate(dateStr)
{
  var rtnStr = "";
  var dateObj = nlapiStringToDate(dateStr);
  var month = dateObj.getMonth();
  switch(month)
  {
    case 0:
      rtnStr += "January ";
      break;
    case 1:
      rtnStr += "February ";
      break;
    case 2:
      rtnStr += "March ";
      break;
    case 3:
      rtnStr += "April ";
      break;
    case 4:
      rtnStr += "May ";
      break;
    case 5:
      rtnStr += "June ";
      break;
    case 6:
      rtnStr += "July ";
      break;
    case 7:
      rtnStr += "August ";
      break;
    case 8:
      rtnStr += "September ";
      break;
    case 9:
      rtnStr += "October ";
      break;
    case 10:
      rtnStr += "November ";
      break;
    case 11:
      rtnStr += "December ";
      break;
  }

  rtnStr += dateObj.getDate() + ", " + dateObj.getFullYear();

  return rtnStr;
}

function getSapphire(netsuiteID)
{
  var rtnStr = "";
  switch(netsuiteID)
  {
    case "SBSL6.0RD2":
      rtnStr = "SB6RD";
      break;
    case "SPSL6.0RD2":
      rtnStr = "SP6RD";
      break;
    case "SBSL6.5RD3":
      rtnStr = "SB65RD";
      break;
    case "SBSL6.0CU3":
      rtnStr = "SB6XCU";
      break;
    case "SBSL8X6OV3":
    case "SBSL8x6OV3":
      rtnStr = "SB8X6OV";
      break;
    case "SBSL5.5RD3":
      rtnStr = "SB55RD";
      break;
    case "SVSL6.0RD2":
      rtnStr = "SV6RD";
      break;
  }

  return rtnStr;
}

function addCommas(nStr)
{
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

// Block-1 start to Calculate Halo Melee Count Added By Shiv//
function getHaloMeleeDetail(dmd_Id,dmd_ParentItemId)
{
  var haloMeleeResult=[];
  if((dmd_Id!='' && dmd_ParentItemId!=null))
  {

    var haloCheck='F';
    var grpItemArr=[];
    //nlapiLogExecution("debug","My Parent Item Id:"+dmd_ParentItemId,dmd_Id);
    var diamondMesearure=nlapiLookupField("item",dmd_Id,"custitem30"); 
    var diamondShape=nlapiLookupField("item",dmd_Id,"custitem5");
    var mesearureSize=0;
    if(diamondMesearure!='' && diamondMesearure!=null)
    {
      mesearureSize=diamondMesearure.split('x')[0];
    }
    var itemFields=["parent","custitem20","custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7"];
    var Item=nlapiLookupField("item",dmd_ParentItemId,itemFields);
    var itemParentId=Item.parent;
    var itemParentName='';
    var haloMeleeCollection='';
    if(itemParentId!='' && itemParentId!=null)
    {
      itemParentName=nlapiLookupField("item",dmd_ParentItemId,"parent",true);
      // haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitem78");//old code
      // added on 30 March 2017
      haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitemhalo_setting");
    }
    if(haloMeleeCollection=='T' && diamondShape=='1') // Check for Halo Settings  & diamond Shape
    {			    				
      var itemCategId=Item.custitem20;
      var subItem1=Item.custitem9;
      var subItem2=Item.custitem11;
      var subItem3=Item.custitem13;
      var subItem4=Item.custitem94;
      var subItem5=Item.custitem_sub_item_5;
      var subItem6=Item.custitem_sub_item_6;
      var subItem7=Item.custitem_sub_item_7
      var stockUnit=0;
      if(subItem1!='' && subItem1!=null)
      {
        var gemStoneCarat=0;	
        var gemStoneCount=0;
        //var sunbItemShape1=nlapiLookupField("item",subItem1,"custitem5");
        var sunbItemShape1=getItemHaloShape(subItem1);
        if(sunbItemShape1=='1')
        {
          grpItemArr.push({subItemId:subItem1,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }

      }
      if(subItem2!='' && subItem2!=null)
      {
        var subItemShape2=getItemHaloShape(subItem2);					
        if(subItemShape2=='1')
        {	
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem10");	
          var myStockUnitStr= nlapiLookupField("item",subItem2,"stockunit",true);						
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem2,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      if(subItem3!='' && subItem2!=null)
      {
        var subItemShape3=getItemHaloShape(subItem3);
        if(subItemShape3=='1')
        {
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem12");
          var myStockUnitStr= nlapiLookupField("item",subItem3,"stockunit",true);
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem3,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      if(subItem4!='' && subItem4!=null)
      {
        var subItemShape4=getItemHaloShape(subItem4);
        if(subItemShape4=='1')
        {
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem95");
          var myStockUnitStr= nlapiLookupField("item",subItem4,"stockunit",true);
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem4,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      if(subItem5!='' && subItem5!=null)
      {
        var subItemShape5=getItemHaloShape(subItem5);
        if(subItemShape5=='1')
        {
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_5");
          var myStockUnitStr= nlapiLookupField("item",subItem5,"stockunit",true);
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem5,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      if(subItem6!='' && subItem6!=null)
      {
        var subItemShape6=getItemHaloShape(subItem6);
        if(subItemShape6=='1')
        {
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_6");
          var myStockUnitStr= nlapiLookupField("item",subItem6,"stockunit",true);
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem6,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      if(subItem7!='' && subItem7!=null)
      {
        var subItemShape7=getItemHaloShape(subItem7);
        if(subItemShape7=='1')
        {
          var gemStoneCarat=0;	
          var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_7");
          var myStockUnitStr= nlapiLookupField("item",subItem7,"stockunit",true);
          if(myStockUnitStr!=null && myStockUnitStr!='')
          {
            stockUnit=myStockUnitStr.split(' ')[0];
          }
          if(gemStoneCount > 0 && stockUnit!=0)
          {							
            gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
            gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
            gemStoneCarat=gemStoneCarat.toFixed(2);
          }
          grpItemArr.push({subItemId:subItem7,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
        }				  
      }
      var totGemStone=0;
      var totGemCarat=0;
      var meleeSize=0;
      if((subItem1!='' && subItem1!=null) && grpItemArr.length==1)
      {
        meleeSize=1;
      }
      else if((subItem2!='' && subItem2!=null) && grpItemArr.length>=1)
      {
        meleeSize=2; // If more than 1 melee Size stone found

        for(var i=0;i<grpItemArr.length;i++)
        {

          var gemStone=grpItemArr[i].gemStone;
          var gemCarat=grpItemArr[i].gemCarat;
          totGemStone=parseInt(totGemStone)+parseInt(gemStone);
          totGemCarat=parseFloat(totGemCarat)+ parseFloat(gemCarat);
          var j=0;
        }
      }	
      nlapiLogExecution("debug","Halo melee Size:"+meleeSize+ " calc. w.r.t. Parent Item Id:"+dmd_ParentItemId+", Dmd Id:"+dmd_Id,dmd_Id);
      if(meleeSize==1 || meleeSize==2)
      {
        var filters = [];    	
        filters[0] = nlobjSearchFilter("custrecord_center_shape",null,'is',1); //Shape= Round
        filters[1] = nlobjSearchFilter("custrecord_parent_halo",null,'is',itemParentId);
        var searchResult = nlapiSearchRecord("customrecord_halo_melee",4391,filters,[]);	
        nlapiLogExecution("Debug","Search Result",JSON.stringify(searchResult));
        if(searchResult==null)return haloMeleeResult;
        var haloMeleeArr=[];
        var count=searchResult.length;
        if(searchResult.length>0)
        {

          //var itemMeleeSizeId=grpItemArr[0];
          var itemMeleeSizeId=grpItemArr[0].subItemId;
          var itemMeleeSize=nlapiLookupField("item",itemMeleeSizeId,"itemid");
          for(i=0;i<searchResult.length;i++)
          {
            var ResultColm = searchResult[i].getAllColumns();
            var hmId = searchResult[i].getId(); 		
            var hmItemId = searchResult[i].getValue(ResultColm[0]);  
            var hmGemCount = searchResult[i].getValue(ResultColm[1]);                            					
            var hmCenterSize = searchResult[i].getValue(ResultColm[3]);
            var hmMeleeSize = searchResult[i].getValue(ResultColm[4]);
            var hmSize=0;
            if(hmCenterSize!='' && hmCenterSize!=null)
            {
              hmSize=hmCenterSize.replace('mm','');
            }							
            haloMeleeArr.push({hmId:hmId,hmSize:hmSize,hmGemCount:hmGemCount,hmMeleeSize:hmMeleeSize});
          }
          nlapiLogExecution("Debug","haloMeleeArr (Test)",JSON.stringify(haloMeleeArr));
          haloMeleeArr.sort(function(a, b) {
            return a.hmSize- b.hmSize;
          });
          nlapiLogExecution("Debug","sorted haloMeleeArr (Test)",JSON.stringify(haloMeleeArr));
          var k=0; range1 = 0, range2=0,range3=0; 
          var gemCount=0;
          var haloMeleeId=0;
          var haloMeleeSize='';
          for(var i=0; i<haloMeleeArr.length; i++)
          {
            range1 = parseFloat(haloMeleeArr[i].hmSize) - 0.25;
            range2 = parseFloat(haloMeleeArr[i].hmSize) + 0.25;
            range3 = parseFloat(haloMeleeArr[i].hmSize);					   					   
            if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
            {
              gemCount=haloMeleeArr[i].hmGemCount;
              haloMeleeId=haloMeleeArr[i].hmId;
              haloMeleeSize=haloMeleeArr[i].hmMeleeSize;
              break;
            }
          }
          nlapiLogExecution("Debug","gemCount (Test)",gemCount);
          nlapiLogExecution("Debug","haloMeleeId (Test)",haloMeleeId);
          nlapiLogExecution("Debug","haloMeleeSize (Test)",haloMeleeSize);
          // get halo melee size
          if( haloMeleeId > 0 && (haloMeleeSize!='' && haloMeleeSize!=null))                
          {
            var filters = new Array();
            filters[0] = new nlobjSearchFilter('type',null,'is','InvtPart'); //Item type will be Inventory Item
            filters[1] = new nlobjSearchFilter('itemid',null,'is',haloMeleeSize); //itemname
            var results = nlapiSearchRecord('item', null, filters, new nlobjSearchColumn('itemid'));
            var haloItemId='';
            var haloItemName='';
            for (var i in results)
            {
              haloItemId = results[i].getId();
              haloItemName = results[i].getValue('itemid');
              break;
            }
            if(haloItemId!='' && haloItemId!=null)
            {
              var subItemObj=nlapiLoadRecord('inventoryitem',haloItemId);                                
              var myStockUnitStr=subItemObj.getFieldText('stockunit');

              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                stockUnit=myStockUnitStr.split(' ')[0];
              }
            }

          }
          //end halo melee size
          var totMinCarat=0;
          if(gemCount > 0 && stockUnit!=0 ) 
          {
            totMinCarat=parseFloat(gemCount) * parseFloat(stockUnit);
            totMinCarat=Math.round(totMinCarat * 100)/100;
            totMinCarat=totMinCarat.toFixed(2);
            if(meleeSize==2)
            {							  
              gemCount=parseInt(totGemStone)+parseInt(gemCount);
              totMinCarat=parseFloat(totMinCarat)+parseFloat(totGemCarat);
              totMinCarat=totMinCarat.toFixed(2);
            }
            nlapiLogExecution("debug","totgemCount (Test)",gemCount);
            nlapiLogExecution("debug","gemCarat (Test)",totMinCarat);
            haloCheck='T';						
            haloMeleeResult.push({
              haloCheck:haloCheck,
              haloDmdShape:diamondShape,									
              haloMeleeId:haloMeleeId,
              haloMesearure:mesearureSize,
              totalGem:gemCount,
              stockUnit:stockUnit,
              totMinCarat:totMinCarat

            });
          }
        }
      }
    }

  }
  return haloMeleeResult;
}
function getItemHaloShape(itemId)
{
  var shape='0';
  shape=nlapiLookupField("item",itemId,"custitem5");
  return shape;
}
/* ---Old Function---
function getHaloMeleeDetail(dmd_Id,dmd_ParentItemId)
{
	var haloMeleeResult=[];
	if((dmd_Id!='' && dmd_ParentItemId!=null))
	{

		   var haloCheck='F';
		   var grpItemArr=[];
			nlapiLogExecution("debug","My Parent Item Id:"+dmd_ParentItemId,dmd_Id);
			var diamondMesearure=nlapiLookupField("item",dmd_Id,"custitem30"); 
			var diamondShape=nlapiLookupField("item",dmd_Id,"custitem5");
			var mesearureSize=0;
			if(diamondMesearure!='' && diamondMesearure!=null)
			{
			 mesearureSize=diamondMesearure.split('x')[0];
			}
			var itemFields=["parent","custitem20","custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7"];
			var Item=nlapiLookupField("item",dmd_ParentItemId,itemFields);
			var itemParentId=Item.parent;
			 var itemParentName='';
			 var haloMeleeCollection='';
			if(itemParentId!='' && itemParentId!=null)
			{
			  itemParentName=nlapiLookupField("item",dmd_ParentItemId,"parent",true);
			  haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitem78");
			}
			if(haloMeleeCollection=='6' && diamondShape=='1') // Check for Halo Settings Collection & diamond Shape
			{			    				
				var itemCategId=Item.custitem20;
				var subItem1=Item.custitem9;
				var subItem2=Item.custitem11;
				var subItem3=Item.custitem13;
				var subItem4=Item.custitem94;
				var subItem5=Item.custitem_sub_item_5;
				var subItem6=Item.custitem_sub_item_6;
				var subItem7=Item.custitem_sub_item_7
				var stockUnit=0;
				if(subItem1!='' && subItem1!=null)
				{

					var sunbItemShape1=nlapiLookupField("item",subItem1,"custitem5");
					if(sunbItemShape1=='1')
					{
						grpItemArr.push(subItem1);
					}

				}

				var phase=0;
				if(subItem1!='' && subItem1!=null)
				{
				  phase=1;
				}

				if(phase==1)
				{
					var filters = [];    	
					filters[0] = nlobjSearchFilter("custrecord_center_shape",null,'is',1); //Shape= Round
					filters[1] = nlobjSearchFilter("custrecord_parent_halo",null,'is',itemParentId);
					var searchResult = nlapiSearchRecord("customrecord_halo_melee",4391,filters,[]);	
					var haloMeleeArr=[];
					var count=searchResult.length;
					if(searchResult.length>0)
					{

						var itemMeleeSizeId=grpItemArr[0];
						var itemMeleeSize=nlapiLookupField("item",itemMeleeSizeId,"itemid");
						for(i=0;i<searchResult.length;i++)
						{
							var ResultColm = searchResult[i].getAllColumns();
							var hmId = searchResult[i].getId(); 		
							var hmItemId = searchResult[i].getValue(ResultColm[0]);  
							var hmGemCount = searchResult[i].getValue(ResultColm[1]);                            					
							var hmCenterSize = searchResult[i].getValue(ResultColm[3]);
							var hmMeleeSize = searchResult[i].getValue(ResultColm[4]);
							var hmSize=0;
							if(hmCenterSize!='' && hmCenterSize!=null)
							{
								hmSize=hmCenterSize.replace('mm','');
							}							

							  haloMeleeArr.push({hmId:hmId,hmSize:hmSize,hmGemCount:hmGemCount,hmMeleeSize:hmMeleeSize});


						}

						haloMeleeArr.sort(function(a, b) {
						return a.hmSize- b.hmSize;
						});
						var k=0; range1 = 0, range2=0,range3=0; 
						var gemCount=0;
						var haloMeleeId=0;
						var haloMeleeSize='';
						for(var i=0; i<haloMeleeArr.length; i++)
						{
						   range1 = parseFloat(haloMeleeArr[i].hmSize) - 0.25;
						   range2 = parseFloat(haloMeleeArr[i].hmSize) + 0.25;
						   range3 = parseFloat(haloMeleeArr[i].hmSize);					   					   
						   if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
						   {
							   gemCount=haloMeleeArr[i].hmGemCount;
							   haloMeleeId=haloMeleeArr[i].hmId;
							   haloMeleeSize=haloMeleeArr[i].hmMeleeSize;
							   break;
						   }
						}
						// get halo melee size
                        if( haloMeleeId > 0 && (haloMeleeSize!='' && haloMeleeSize!=null))                
						{
						    var filters = new Array();
							filters[0] = new nlobjSearchFilter('type',null,'is','InvtPart'); //Item type will be Inventory Item
							filters[1] = new nlobjSearchFilter('itemid',null,'is',haloMeleeSize); //itemname
							var results = nlapiSearchRecord('item', null, filters, new nlobjSearchColumn('itemid'));
							var haloItemId='';
							var haloItemName='';
							for (var i in results)
							{
								 haloItemId = results[i].getId();
								 haloItemName = results[i].getValue('itemid');
								 break;
							}
                            if(haloItemId!='' && haloItemId!=null)
							{
								var subItemObj=nlapiLoadRecord('inventoryitem',haloItemId);                                
								var myStockUnitStr=subItemObj.getFieldText('stockunit');

								if(myStockUnitStr!=null && myStockUnitStr!='')
								{
									stockUnit=myStockUnitStr.split(' ')[0];
								}
							}

						}
						//end halo melee size
						var totMinCarat=0;
						if(gemCount > 0 && stockUnit!=0 ) 
						{
							totMinCarat=parseFloat(gemCount) * parseFloat(stockUnit);
							totMinCarat=Math.round(totMinCarat * 100)/100;
							totMinCarat=totMinCarat.toFixed(2);
							haloCheck='T';						
							haloMeleeResult.push({
										haloCheck:haloCheck,
										haloDmdShape:diamondShape,									
										haloMeleeId:haloMeleeId,
										haloMesearure:mesearureSize,
										totalGem:gemCount,
										stockUnit:stockUnit,
										totMinCarat:totMinCarat

							});
						}
					}
				}
			}

	}
	return haloMeleeResult;
}
*/

// Block-1 End to Calculate Halo Melee Count //

// Block-2 start to Calculate Eternity Melee Count Added By Shiv//
function isCheckEternity(myItemId)
{
  var eternityFlag='F';


  if(myItemId!='' && myItemId!=null)
  {
    var field = ["parent","custitem9"];
    var item = nlapiLookupField("item",myItemId,field);
    var myParentItemId=item.parent;
    var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");	
    //var fields = ["custitemeternitymeleecountsize3","custitemeternitymeleecountsize35","custitemeternitymeleecountsize4","custitemeternitymeleecountsize45","custitemeternitymeleecountsize5","custitemeternitymeleecountsize55","custitemeternitymeleecountsize6","custitemeternitymeleecountsize65","custitemeternitymeleecountsize7","custitemeternitymeleecountsize75","custitemeternitymeleecountsize8","custitemeternitymeleecountsize85","custitemeternitymeleecountsize9"];

    var fields = ["custitemeternitymeleecountsize3","custitemeternitymeleecountsize35","custitemeternitymeleecountsize4","custitemeternitymeleecountsize45","custitemeternitymeleecountsize5","custitemeternitymeleecountsize55","custitemeternitymeleecountsize6","custitemeternitymeleecountsize65","custitemeternitymeleecountsize7","custitemeternitymeleecountsize75","custitemeternitymeleecountsize8","custitemeternitymeleecountsize85","custitemeternitymeleecountsize9","custitemeternitymeleecountsize95","custitemeternitymeleecountsize10","custitemeternitymeleecountsize105","custitemeternitymeleecountsize11","custitemeternitymeleecountsize115","custitemeternitymeleecountsize12","custitemeternitymeleecountsize125"];
    var eternityItem = nlapiLookupField("item",myItemId,fields);
    var eMC3=eternityItem.custitemeternitymeleecountsize3;
    var eMC35=eternityItem.custitemeternitymeleecountsize35;
    var eMC4=eternityItem.custitemeternitymeleecountsize4;
    var eMC45=eternityItem.custitemeternitymeleecountsize45;
    var eMC5=eternityItem.custitemeternitymeleecountsize5;
    var eMC55=eternityItem.custitemeternitymeleecountsize55;
    var eMC6=eternityItem.custitemeternitymeleecountsize6;
    var eMC65=eternityItem.custitemeternitymeleecountsize65;
    var eMC7=eternityItem.custitemeternitymeleecountsize7;
    var eMC75=eternityItem.custitemeternitymeleecountsize75;
    var eMC8=eternityItem.custitemeternitymeleecountsize8;
    var eMC85=eternityItem.custitemeternitymeleecountsize85;
    var eMC9=eternityItem.custitemeternitymeleecountsize9;

    //added new enternity melee count size
    var eMC95=eternityItem.custitemeternitymeleecountsize95;
    var eMC10=eternityItem.custitemeternitymeleecountsize10;
    var eMC105=eternityItem.custitemeternitymeleecountsize105;
    var eMC11=eternityItem.custitemeternitymeleecountsize11;
    var eMC115=eternityItem.custitemeternitymeleecountsize115;
    var eMC12=eternityItem.custitemeternitymeleecountsize12;
    var eMC125=eternityItem.custitemeternitymeleecountsize125;

    //if(isEternity=='1' && (eMC3.length > 0 || eMC35.length > 0 || eMC4.length > 0 || eMC45.length > 0 || eMC5.length > 0 || eMC55.length > 0 || eMC6.length > 0 || eMC65.length > 0 || eMC7.length > 0 || eMC75.length > 0 || eMC8.length > 0 || eMC85.length > 0 || eMC9.length > 0))  
    if(isEternity=='1' && (eMC3.length > 0 || eMC35.length > 0 || eMC4.length > 0 || eMC45.length > 0 || eMC5.length > 0 || eMC55.length > 0 || eMC6.length > 0 || eMC65.length > 0 || eMC7.length > 0 || eMC75.length > 0 || eMC8.length > 0 || eMC85.length > 0 || eMC9.length > 0 || eMC95.length>0 || eMC10.length>0 || eMC105.length>0 ||eMC11.length>0 || eMC115.length>0 || eMC12.length>0 || eMC125.length>0))
    {
      eternityFlag='T';
    }
  }
  return eternityFlag;
}
function getEternityMeleeDetail(myItemId)
{
  var eternityMeleeArr=[];
  if(myItemId!='' && myItemId!=null)
  {
    var fields = ["parent","custitem9"];
    var item = nlapiLookupField("item",myItemId,fields);
    var myParentItemId=item.parent;
    var myChildId=item.custitem9;
    if(myChildId!='' && myChildId !=null)     
    {
      var ringSize = nlapiLookupField("item",myItemId,"custitem2",true); //get ring Size;
      var fracPart=0, wholePart=0;
      if(ringSize.length >1)
      { 
        nlapiLogExecution("debug","My ringSize:"+ringSize+", Ring Size:"+ringSize,myItemId);     
        wholePart=ringSize.split('.')[0];
        fracPart=ringSize.split('.')[1];// Get fraction part of ring size
        fracPart='0.'+fracPart;                                                   
        if(parseFloat(fracPart)>=0 && parseFloat(fracPart)<=0.49)
        {
          //ringSize= Math.round(ringSize);
          ringSize=wholePart;
        }
        else if(parseFloat(fracPart)>=0.50 && parseFloat(fracPart)<=0.99)
        {
          //ringSize= Math.round(ringSize);                           
          ringSize=wholePart+'5';					 
        }
      }
      var fldName="custitemeternitymeleecountsize"+ringSize;
      nlapiLogExecution("debug","My fldName:"+fldName+", Ring Size:"+ringSize,myItemId);
      var EternityMeleeCount=nlapiLookupField("item",myItemId,fldName); //custitemeternitymeleecountsize6
      /*var subItemObj=nlapiLoadRecord('inventoryitem',myParentItemId);                                
			var isEternity=subItemObj.getFieldValue('custitem172');*/
      var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");

      /*var subItemObj2=nlapiLoadRecord('inventoryitem',myChildId);                                
			var myStockUnitStr=subItemObj2.getFieldText('stockunit');*/
      var myStockUnitStr= nlapiLookupField("item",myChildId,"stockunit",true);
      var stockUnit='';
      var totalCarat='';
      var NoOfGemStone='';
      if(myStockUnitStr!=null && myStockUnitStr!='')
      {
        stockUnit=myStockUnitStr.split(' ')[0];
      }
      if(isEternity=='1');
      {
        NoOfGemStone=EternityMeleeCount; 
        if(NoOfGemStone=='' || NoOfGemStone==null)
        {
          NoOfGemStone='0';
        }
        nlapiLogExecution("debug","My No. Of GemStone:"+NoOfGemStone+", stockUnit:"+stockUnit,myItemId);
        if((stockUnit !='' && stockUnit != null) && (NoOfGemStone !='' && NoOfGemStone != null))
        {
          totalCarat=parseFloat(NoOfGemStone) * parseFloat(stockUnit);
          totalCarat=Math.round(totalCarat * 100)/100;
          totalCarat=totalCarat.toFixed(2);
          eternityMeleeArr.push({NoOfGemStone:NoOfGemStone,
                                 totalCarat:totalCarat});

        }
      }
    }
  }

  return eternityMeleeArr;
}

// Block-2 End to Calculate Eternity Melee Count //

function isIABlocked(orderId)
{
  var iaFlag=false;
  if(orderId!='' && orderId!=null)
  {
    var order = nlapiLoadRecord("salesorder",orderId);
    for(var x=0; x < order.getLineItemCount("item"); x++)
    {
      var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");		
      var myItemId=order.getLineItemValue("item","item",x+1);
      //	nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);				
      isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");

      if(isIABlock=='' || isIABlock==null)
      {
        isIABlock='F';
      }
      //nlapiLogExecution("debug","My Item Id:"+ myItemId+",Item Category:"+category+", isIABlock:"+isIABlock,myItemId);
      if(category=='2' || category=='3')
      {
        if(isIABlock=='T')
        {
          iaFlag=true;
          break;
        }
      }
    }
  }

  return iaFlag;
}
// added new code for [ns-671]
function MeleeItemCountOn_PO(order, createPOLinkCount)
{
  var haloCheck='F';
  var meleeArr=[];
  for (var m = 1; m <= createPOLinkCount; m++)
  {

    var curr_item_type = order.getLineItemValue('links', 'type', m);
    var curr_item_PoID = order.getLineItemValue('links', 'tranid', m);
    nlapiLogExecution('DEBUG', 'curr_record_type and ID', curr_item_type + " " + curr_item_PoID);

    if (curr_item_type === 'Purchase Order') {
      var itemType = 'purchaseorder';
      var filters = new Array();
      filters[0] = nlobjSearchFilter('tranid', null, 'is', curr_item_PoID);
      var itemResult = nlapiSearchRecord(itemType, null, filters);
      if (itemResult != null) {
        var itemPO = nlapiLoadRecord(itemType, itemResult[0].getId());
        var  meleeItemPOCount = itemPO.getLineItemCount('recmachcustrecord_melee_items_po_link'); 
        var melee_count_updated = nlapiLookupField(itemType,itemResult[0].getId(),"custbody_melee_count_updated");
        nlapiLogExecution("Debug","Melee Count Updated on PO",melee_count_updated);
        var totalMeleeCount=0;
        var meleeCarat =0;
        var totalMeleeCarat =0;
        var meleeStockUnit=0;
        var roundMeleeShape =0;
        var roundMeleeShapeText ='';
        var roundMeleeColor ='';
        var roundMeleeClarity='';

        var marquise_totalMeleeCount=0;
        var marquise_meleeCarat =0;
        var marquise_totalMeleeCarat =0;
        var marquise_meleeStockUnit=0;
        var marquise_meleeShape =0;
        var marquise_meleeShapeText ='';
        var marquise_MeleeColor ='';
        var marquise_MeleeClarity='';

        var princess_totalMeleeCount=0;
        var princess_meleeCarat =0;
        var princess_totalMeleeCarat =0;
        var princess_meleeStockUnit=0;
        var princess_meleeShape =0;
        var princess_meleeShapeText ='';
        var princess_MeleeColor ='';
        var princess_MeleeClarity='';

        var cushion_totalMeleeCount=0;
        var cushion_meleeCarat =0;
        var cushion_totalMeleeCarat =0;
        var cushion_meleeStockUnit=0;
        var cushion_meleeShape =0;
        var cushion_meleeShapeText ='';
        var cushion_MeleeColor ='';
        var cushion_MeleeClarity='';

        var oval_totalMeleeCount=0;
        var oval_meleeCarat =0;
        var oval_totalMeleeCarat =0;
        var oval_meleeStockUnit=0;
        var oval_meleeShape =0;
        var oval_meleeShapeText ='';
        var oval_MeleeColor ='';
        var oval_MeleeClarity='';

        var emerald_totalMeleeCount=0;
        var emerald_meleeCarat =0;
        var emerald_totalMeleeCarat =0;
        var emerald_meleeStockUnit=0;
        var emerald_meleeShape =0;
        var emerald_meleeShapeText ='';
        var emerald_MeleeColor ='';
        var emerald_MeleeClarity='';

        var asscher_totalMeleeCount=0;
        var asscher_meleeCarat =0;
        var asscher_totalMeleeCarat =0;
        var asscher_meleeStockUnit=0;
        var asscher_meleeShape =0;
        var asscher_meleeShapeText ='';
        var asscher_MeleeColor ='';
        var asscher_MeleeClarity='';

        var radiant_totalMeleeCount=0;
        var radiant_meleeCarat =0;
        var radiant_totalMeleeCarat =0;
        var radiant_meleeStockUnit=0;
        var radiant_meleeShape =0;
        var radiant_meleeShapeText ='';
        var radiant_MeleeColor ='';
        var radiant_MeleeClarity='';

        var pear_totalMeleeCount=0;
        var pear_meleeCarat =0;
        var pear_totalMeleeCarat =0;
        var pear_meleeStockUnit=0;
        var pear_meleeShape =0;
        var pear_meleeShapeText ='';
        var pear_MeleeColor ='';
        var pear_MeleeClarity='';

        var heart_totalMeleeCount=0;
        var heart_meleeCarat =0;
        var heart_totalMeleeCarat =0;
        var heart_meleeStockUnit=0;
        var heart_meleeShape =0;
        var heart_meleeShapeText ='';
        var heart_MeleeColor ='';
        var heart_MeleeClarity='';

        if(melee_count_updated == 'T')  
        {
          for(var k=1;k<=meleeItemPOCount;k++)
          {
            var itemId = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item',k);
            var meleeShape = getItemHaloShape(itemId);
            if(meleeShape == '1')
            {
              var chkroundMelee = false;
              roundMeleeShape = meleeShape;
              nlapiLogExecution("debug","Round Melee Shape",roundMeleeShape);
              roundMeleeShapeText ="Round";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(chkroundMelee==false)
              {
                var roundMeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var roundMeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkroundMelee = true;
              }
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(meleeCount > 0 && meleeStockUnit!=0)
              {
                meleeCarat=parseFloat(meleeCount) * parseFloat(meleeStockUnit);
                meleeCarat=Math.round(meleeCarat * 100)/100;
                meleeCarat=meleeCarat.toFixed(2);
                totalMeleeCount = totalMeleeCount + parseInt(meleeCount);
                totalMeleeCarat = parseFloat(totalMeleeCarat) + parseFloat(meleeCarat);
              }
            }
            if(meleeShape =='2')
            {
              var chkprincessMelee = false;
              princess_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Princess Melee Shape",princess_meleeShape);
              princess_meleeShapeText="Heart";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var princess_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkprincessMelee==false)
              {
                var princess_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var princess_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkprincessMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                princess_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(princess_meleeCount > 0 && princess_meleeStockUnit!=0)
              {
                princess_meleeCarat=parseFloat(princess_meleeCount) * parseFloat(princess_meleeStockUnit);
                princess_meleeCarat=Math.round(princess_meleeCarat * 100)/100;
                princess_meleeCarat=princess_meleeCarat.toFixed(2);
                princess_totalMeleeCount = princess_totalMeleeCount + parseInt(princess_meleeCount);
                princess_totalMeleeCarat = parseFloat(princess_totalMeleeCarat) + parseFloat(princess_meleeCarat);
              }
            }
            if(meleeShape =='3')
            {
              var chkcushionMelee =false;
              cushion_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Cushion Melee Shape",cushion_meleeShape);
              cushion_meleeShapeText="Cushion";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var cushion_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkcushionMelee==false)
              {
                var cushion_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var cushion_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkcushionMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                cushion_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(cushion_meleeCount > 0 && cushion_meleeStockUnit!=0)
              {
                cushion_meleeCarat=parseFloat(cushion_meleeCount) * parseFloat(cushion_meleeStockUnit);
                cushion_meleeCarat=Math.round(cushion_meleeCarat * 100)/100;
                cushion_meleeCarat=cushion_meleeCarat.toFixed(2);
                cushion_totalMeleeCount = cushion_totalMeleeCount + parseInt(cushion_meleeCount);
                cushion_totalMeleeCarat = parseFloat(cushion_totalMeleeCarat) + parseFloat(cushion_meleeCarat);
              }
            }
            if(meleeShape =='4')
            {
              var chkovalMelee =false;
              oval_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Oval Melee Shape",oval_meleeShape);
              oval_meleeShapeText="Oval";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var oval_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkovalMelee==false)
              {
                var oval_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var oval_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkovalMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                oval_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(oval_meleeCount > 0 && oval_meleeStockUnit!=0)
              {
                oval_meleeCarat=parseFloat(oval_meleeCount) * parseFloat(oval_meleeStockUnit);
                oval_meleeCarat=Math.round(oval_meleeCarat * 100)/100;
                oval_meleeCarat=oval_meleeCarat.toFixed(2);
                oval_totalMeleeCount = oval_totalMeleeCount + parseInt(oval_meleeCount);
                oval_totalMeleeCarat = parseFloat(oval_totalMeleeCarat) + parseFloat(oval_meleeCarat);
              }
            }
            if(meleeShape =='5')
            {
              var chkemeraldMelee =false;
              emerald_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Emerald Melee Shape",emerald_meleeShape);
              emerald_meleeShapeText="Oval";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var emerald_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkemeraldMelee==false)
              {
                var emerald_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var emerald_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkemeraldMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                emerald_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(emerald_meleeCount > 0 && emerald_meleeStockUnit!=0)
              {
                emerald_meleeCarat=parseFloat(emerald_meleeCount) * parseFloat(emerald_meleeStockUnit);
                emerald_meleeCarat=Math.round(emerald_meleeCarat * 100)/100;
                emerald_meleeCarat=emerald_meleeCarat.toFixed(2);
                emerald_totalMeleeCount = emerald_totalMeleeCount + parseInt(emerald_meleeCount);
                emerald_totalMeleeCarat = parseFloat(emerald_totalMeleeCarat) + parseFloat(emerald_meleeCarat);
              }
            }
            if(meleeShape =='6')
            {
              var chkasscherMelee =false;
              asscher_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Asscher Melee Shape",asscher_meleeShape);
              asscher_meleeShapeText="Asscher";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var asscher_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkasscherMelee==false)
              {
                var asscher_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var asscher_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkasscherMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                asscher_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(asscher_meleeCount > 0 && asscher_meleeStockUnit!=0)
              {
                asscher_meleeCarat=parseFloat(asscher_meleeCount) * parseFloat(asscher_meleeStockUnit);
                asscher_meleeCarat=Math.round(asscher_meleeCarat * 100)/100;
                asscher_meleeCarat=asscher_meleeCarat.toFixed(2);
                asscher_totalMeleeCount = asscher_totalMeleeCount + parseInt(asscher_meleeCount);
                asscher_totalMeleeCarat = parseFloat(asscher_totalMeleeCarat) + parseFloat(asscher_meleeCarat);
              }
            }
            if(meleeShape =='7')
            {
              var chkradiantMelee =false;
              radiant_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Radiant Melee Shape",radiant_meleeShape);
              radiant_meleeShapeText="Asscher";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var radiant_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkradiantMelee==false)
              {
                var radiant_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var radiant_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkradiantMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                radiant_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(radiant_meleeCount > 0 && radiant_meleeStockUnit!=0)
              {
                radiant_meleeCarat=parseFloat(radiant_meleeCount) * parseFloat(radiant_meleeStockUnit);
                radiant_meleeCarat=Math.round(radiant_meleeCarat * 100)/100;
                radiant_meleeCarat=radiant_meleeCarat.toFixed(2);
                radiant_totalMeleeCount =radiant_totalMeleeCount + parseInt(radiant_meleeCount);
                radiant_totalMeleeCarat = parseFloat(radiant_totalMeleeCarat) + parseFloat(radiant_meleeCarat);
              }
            }
            if(meleeShape =='8')
            {
              var chkpearMelee =false;
              pear_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Pear Melee Shape",pear_meleeShape);
              pear_meleeShapeText="Pear";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var pear_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(chkpearMelee==false)
              {
                var pear_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var pear_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkpearMelee = true;
              }
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                pear_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(pear_meleeCount > 0 && pear_meleeStockUnit!=0)
              {
                pear_meleeCarat=parseFloat(pear_meleeCount) * parseFloat(pear_meleeStockUnit);
                pear_meleeCarat=Math.round(pear_meleeCarat * 100)/100;
                pear_meleeCarat=pear_meleeCarat.toFixed(2);
                pear_totalMeleeCount =pear_totalMeleeCount + parseInt(pear_meleeCount);
                pear_totalMeleeCarat = parseFloat(pear_totalMeleeCarat) + parseFloat(pear_meleeCarat);
              }
            }
            if(meleeShape =='9')
            {
              var chkmarquiseMelee = false;
              marquise_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Marquise Melee Shape",marquise_meleeShape);
              marquise_meleeShapeText="Marquise";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var marquise_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkmarquiseMelee==false)
              {
                var marquise_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var marquise_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkmarquiseMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                marquise_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(marquise_meleeCount > 0 && marquise_meleeStockUnit!=0)
              {
                marquise_meleeCarat=parseFloat(marquise_meleeCount) * parseFloat(marquise_meleeStockUnit);
                marquise_meleeCarat=Math.round(marquise_meleeCarat * 100)/100;
                marquise_meleeCarat=marquise_meleeCarat.toFixed(2);
                marquise_totalMeleeCount = marquise_totalMeleeCount + parseInt(marquise_meleeCount);
                marquise_totalMeleeCarat = parseFloat(marquise_totalMeleeCarat) + parseFloat(marquise_meleeCarat);
              }
            }
            if(meleeShape =='10')
            {
              var chkheartMelee =false;
              heart_meleeShape = meleeShape;
              nlapiLogExecution("Debug","Heart Melee Shape",heart_meleeShape);
              heart_meleeShapeText="Heart";
              var itemDisplay = itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_item_display',k);
              var heart_meleeCount= itemPO.getLineItemValue('recmachcustrecord_melee_items_po_link','custrecord_melee_items_quantity',k);
              if(chkheartMelee==false)
              {
                var heart_MeleeColor =  nlapiLookupField("item",itemId,"custitem7",true);
                var heart_MeleeClarity =  nlapiLookupField("item",itemId,"custitem19",true);
                chkheartMelee = true;
              }
              var myStockUnitStr= nlapiLookupField("item",itemId,"stockunit",true);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                heart_meleeStockUnit=myStockUnitStr.split(' ')[0];
              }
              if(heart_meleeCount > 0 && heart_meleeStockUnit!=0)
              {
                heart_meleeCarat=parseFloat(heart_meleeCount) * parseFloat(heart_meleeStockUnit);
                heart_meleeCarat=Math.round(heart_meleeCarat * 100)/100;
                heart_meleeCarat=heart_meleeCarat.toFixed(2);
                heart_totalMeleeCount = heart_totalMeleeCount + parseInt(heart_meleeCount);
                heart_totalMeleeCarat = parseFloat(heart_totalMeleeCarat) + parseFloat(heart_meleeCarat);
              }
            }
          }
          haloCheck = 'T';
          meleeArr.push({
            meleeItemPOCount:meleeItemPOCount,

            totalMeleeCount:totalMeleeCount,totalMeleeCarat:totalMeleeCarat.toFixed(2),haloCheck:haloCheck,roundMeleeShape:roundMeleeShape,roundMeleeShapeText:roundMeleeShapeText,roundMeleeColor:roundMeleeColor,roundMeleeClarity:roundMeleeClarity,
            marquise_totalMeleeCount:marquise_totalMeleeCount,marquise_totalMeleeCarat:marquise_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,marquise_meleeShape:marquise_meleeShape,marquise_meleeShapeText:marquise_meleeShapeText,marquise_MeleeColor:marquise_MeleeColor,marquise_MeleeClarity:marquise_MeleeClarity,
            princess_totalMeleeCount:princess_totalMeleeCount,princess_totalMeleeCarat:princess_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,princess_meleeShape:princess_meleeShape,princess_meleeShapeText:princess_meleeShapeText,princess_MeleeColor:princess_MeleeColor,princess_MeleeClarity:princess_MeleeClarity,
            cushion_totalMeleeCount:cushion_totalMeleeCount,cushion_totalMeleeCarat:cushion_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,cushion_meleeShape:cushion_meleeShape,cushion_meleeShapeText:cushion_meleeShapeText,cushion_MeleeColor:cushion_MeleeColor,cushion_MeleeClarity:cushion_MeleeClarity,
            oval_totalMeleeCount:oval_totalMeleeCount,oval_totalMeleeCarat:oval_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,oval_meleeShape:oval_meleeShape,oval_meleeShapeText:oval_meleeShapeText,oval_MeleeColor:oval_MeleeColor,oval_MeleeClarity:oval_MeleeClarity,
            emerald_totalMeleeCount:emerald_totalMeleeCount,emerald_totalMeleeCarat:emerald_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,emerald_meleeShape:emerald_meleeShape,emerald_meleeShapeText:emerald_meleeShapeText,emerald_MeleeColor:emerald_MeleeColor,emerald_MeleeClarity:emerald_MeleeClarity,
            asscher_totalMeleeCount:asscher_totalMeleeCount,asscher_totalMeleeCarat:asscher_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,asscher_meleeShape:asscher_meleeShape,asscher_meleeShapeText:asscher_meleeShapeText,asscher_MeleeColor:asscher_MeleeColor,asscher_MeleeClarity:asscher_MeleeClarity,
            radiant_totalMeleeCount:radiant_totalMeleeCount,radiant_totalMeleeCarat:radiant_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,radiant_meleeShape:radiant_meleeShape,radiant_meleeShapeText:radiant_meleeShapeText,radiant_MeleeColor:radiant_MeleeColor,radiant_MeleeClarity:radiant_MeleeClarity,
            pear_totalMeleeCount:pear_totalMeleeCount,pear_totalMeleeCarat:pear_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,pear_meleeShape:pear_meleeShape,pear_meleeShapeText:pear_meleeShapeText,pear_MeleeColor:pear_MeleeColor,pear_MeleeClarity:pear_MeleeClarity,
            heart_totalMeleeCount:heart_totalMeleeCount,heart_totalMeleeCarat:heart_totalMeleeCarat.toFixed(2),haloCheck:haloCheck,heart_meleeShape:heart_meleeShape,heart_meleeShapeText:heart_meleeShapeText,heart_MeleeColor:heart_MeleeColor,heart_MeleeClarity:heart_MeleeClarity

          });
        }
      }
    }
  }
  return meleeArr;
}

function rtnNewMeleeItemTable(meleeResult,newTempTable)
{
  if(meleeResult[0].roundMeleeShape=='1')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].roundMeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].princess_meleeShape=='2')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].princess_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].princess_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].cushion_meleeShape=='3')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].cushion_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].cushion_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].oval_meleeShape=='4')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].oval_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].oval_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].emerald_meleeShape=='5')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].emerald_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].emerald_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].asscher_meleeShape=='6')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].asscher_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].asscher_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].radiant_meleeShape=='7')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].radiant_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].radiant_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].pear_meleeShape=='8')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].pear_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].pear_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].marquise_meleeShape=='9')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].marquise_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].marquise_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  if(meleeResult[0].heart_meleeShape=='10')
  {
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Shape:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_meleeShapeText + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'> Number of gemstones:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_totalMeleeCount + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Minimum total carats:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" +meleeResult[0].heart_totalMeleeCarat + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Color:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeColor + "</td>";
    newTempTable += "</tr>";
    newTempTable += "<tr>";
    newTempTable += "<td width='150px' class='freightDispPro pt10'>Clarity:</td>";
    newTempTable += "<td class='freightDispPro pt10'>" + meleeResult[0].heart_MeleeClarity + "</td>";
    newTempTable += "</tr>";
  }
  return newTempTable;
}
