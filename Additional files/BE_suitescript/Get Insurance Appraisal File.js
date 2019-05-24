function Insurance_Appraisal_Obj(email_obj,orderId_obj)
{
  try
  {
    var  email = true;
    if(!email_obj){email=false;}				
    var orderId=orderId_obj;
    var order = nlapiLoadRecord("salesorder",orderId);
    var currency = order.getFieldValue("currency");
    switch(currency)
    {
      case "1":
        currency = "USD";
        break;
      case "3":
        currency = "CAD";
        break;
      case "5":
        currency = "AUD";
        break;
      default:
        currency = "USD";
        break;
    }

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
    xml += " .yagya {padding: 40px 0; height: 100px;     padding-bottom: -40px!important;}";	
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
    xml += "<macrolist>";
    xml += "<macro id='nlfooter'>";
    xml += "</macro>";
    xml += "</macrolist>";
    xml += "</head>";
    xml+= "<body size='letter' footer='nlfooter' footer-height='0.5in'>";		
    var templateID = '7538895';
    var templateFile = nlapiLoadFile(templateID);
    var template = templateFile.getValue();
    var iaTemp = Handlebars.compile(template);

    var customer_name = nlapiLookupField("customer",order.getFieldValue("entity"),["firstname","lastname"]);
    customer_name = nlapiEscapeXML(customer_name.firstname) + " " + nlapiEscapeXML(customer_name.lastname);

    var today = new Date();
    today = nlapiDateToString(today,"date");

    var isIABlock='F',isIABlockCode='0',iaBlockMsg='' ;
    for(var x=0; x < order.getLineItemCount("item"); x++)
    {
      var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
      //Added By Shiv
      var myItemId=order.getLineItemValue("item","item",x+1);
      //nlapiLogExecution("debug","My Item Id:"+myItemId+", Item Category:"+category,myItemId);
      //-------to check whether IA block or not--------			
      isIABlock=nlapiLookupField("item",myItemId,"custitemblock_insurance_appraisal");

      if(isIABlock=='' || isIABlock==null)
      {
        isIABlock='F';
      }
    //  nlapiLogExecution("debug","My Item Id:"+ myItemId+",Item Category:"+category+", isIABlock:"+isIABlock,myItemId);
      if(category=='2' || category=='3')
      {
        if(isIABlock=='T')
        {
          isIABlockCode='1';
          iaBlockMsg='IA From is Blocked for this item';

        }
      }
      if(category=="2")
      {
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

       //nlapiLogExecution("debug","Replacement Amount",replacementAmount);
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
           // nlapiLogExecution("debug","Replacement Amount",replacementAmount);
            break;
          }		
          else if(sub_category=="8" || sub_category=="13" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
          {
            sapphireID = order.getLineItemValue("item","item",i+1);
            image += "https://image.brilliantearth.com/media/images/";
            replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
           // nlapiLogExecution("debug","Replacement Amount",replacementAmount);
            break;
          }
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
        var myParentItemId=order.getLineItemValue("item","item",x+1); 
        var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");
        var collection='',dShape='';
        collection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
       // nlapiLogExecution("debug","My Parent Item Id:"+myParentItemId+",Collection"+collection+",SubItem Id:"+subItemId+", diamondId:"+diamondID+", sapphireID:"+sapphireID,diamondID);						
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
          if(diamond.custitem18!="Lab Grown" && diamond.custitem18!="Lab Created")
            diamond.custitem18 = "";
        }
        if(sapphireID!="")
        {
          dmdStoneId=sapphireID;	
          diamond = nlapiLookupField("item",sapphireID,diamondFields,true);
          diamond.itemid = nlapiLookupField("item",sapphireID,"itemid");
         // nlapiLogExecution("debug","Item ID",diamond.itemid);
          diamond.custitem27 = nlapiLookupField("item",sapphireID,"custitem27");
          image += item["parent.itemid"] + "-" + getSapphire(diamond.itemid) + "_";
          centerHeader = "CENTER GEMSTONE";
          gemstone = "T";
          gemstone_desc = nlapiEscapeXML(nlapiLookupField("item",sapphireID,"salesdescription"));

          diamond.custitem18 = "";
        }
        dShape=nlapiLookupField("item",dmdStoneId,"custitem5");		
       // nlapiLogExecution("debug","My Item Halo Collection :="+collection+",Halo Shape:="+dShape+" for dmdStoneId:"+dmdStoneId,dmdStoneId);	
        var isHaloStyle='F';  
        if(collection=='T')
        {
          isHaloStyle='T';
        } 				
        if((myParentItemId !='' && myParentItemId !=null) && (subItemId !='' && subItemId !=null) && (dmdStoneId !='' || dmdStoneId !=null) && (dShape=='1'))
        {
          //nlapiLogExecution("debug","myParentItemId (Test)",myParentItemId);	
          haloMeleeResult=getHaloMeleeDetail(dmdStoneId,myParentItemId);
         // nlapiLogExecution("debug","haloMeleeResult (Test)", JSON.stringify(haloMeleeResult));
          if(haloMeleeResult.length > 0)
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
        if(haloMeleeResult.length==0 && isHaloStyle=='T')					
        {
          haloCheck='F'	;	
          var diamondShape=nlapiLookupField("item",dmdStoneId,"custitem5");
          var haloMeleeCollection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
          if(haloMeleeCollection=='T' && diamondShape=='1')							 
          {
            isIABlockCode='2';
            iaBlockMsg='There is no gemstone count information available for halo style.';
          }
          else if(haloMeleeCollection =='T' && diamondShape!='1')								 
          {
            isIABlockCode='2';
            iaBlockMsg='There is no gemstone count information available due to shape of halo style.';
          }				 
          else if(haloMeleeCollection=='1' && diamondShape=='1')							 
          {
            isIABlockCode='2';
            iaBlockMsg='There is no gemstone count information available due to shape of halo style.';
          }
          else if(haloMeleeCollection=='4' && diamondShape=='4')	                                      						 
          {
            isIABlockCode='2';
            iaBlockMsg='There is no gemstone count information available due to shape of halo style.';
          }	

        }
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
        if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
          accentText = item["parent.custitem101"];

        if(isHaloStyle=='F' && (item["parent.custitem9"]==null || item["parent.custitem9"]=="")) // Added per feedback on NS-413
        {
          accentText = item["parent.custitem101"];
        }
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
          {

            var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";	
            accentText = accentText.split("\n");
            for(var i=0; i < accentText.length; i++)
            {	
              var line = accentText[i].split(":");
              if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
              {
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

       // nlapiLogExecution("debug","Tax Rate",order.getFieldValue("taxrate"));			
        //nlapiLogExecution("debug","Replacement Amount",replacementAmount);					
        replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));				
        //nlapiLogExecution("debug","Replacement Amount",replacementAmount);				
        var imgCheck = nlapiRequestURL(image);
        if(imgCheck.getCode()!="200")
          image = "";

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
          title : 'INSURANCE APPRAISAL',
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
          accent_carat_weight : accentTable,
          replacement_price : currency + " " + addCommas(replacementAmount),
          image : image,
          disclaimer : nlapiEscapeXML('The replacement amount above is the actual sale price required to replace the property with another of similar type, nature and quality. This amount is determined by current market conditions, and is changeable without notice. The estimated replacement price above is meant for insurance purposes only. The foregoing Insurance Appraisal is made with the understanding that Brilliant Earth assumes no liability with respect to any other action that may be taken on the basis of the Insurance Appraisal.'),
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

       // nlapiLogExecution("debug","PDF JSON",JSON.stringify(pdf));

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

        var myItemId=order.getLineItemValue("item","item",x+1); 
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
        if(eternityCheck=='T')
        {
          if(myItemId!='' && myItemId !=null)
          {					
            eternityMeleeResult=getEternityMeleeDetail(myItemId);
            if(eternityMeleeResult.length>0)
            {
              NoOfGemStone=eternityMeleeResult[0].NoOfGemStone;
              totalCarat=eternityMeleeResult[0].totalCarat;

            }
          }
        }
       // nlapiLogExecution("debug","Final No. of GemStone:"+NoOfGemStone+", totalCarat:"+totalCarat,myItemId);


        if(eternityCheck=='T' && parseFloat(NoOfGemStone)==0)
        {
          eternityCheck='F';
          isIABlockCode='3';
          iaBlockMsg=' There is no gemstone count information available for eternity style.';

        }

        //End 
        var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
        var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
        var metalNameStr=metalType.custitem1;


        //Wedding Bands

        var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
        var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);

        var replacementAmount = order.getLineItemValue("item","rate",x+1);

        replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));

        var accentText = "";
        if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
          accentText = item["parent.custitem101"];

      //  nlapiLogExecution("debug","accentText-3 : "+accentText,accentText);		 // Added for UT

        //If vendor is Harout R, then use website text as sub-items are not populated
        if(item["vendor"]=="1223843")
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
                 // nlapiLogExecution("debug","my number of gemstones: "+line[1],line[1]);
                 }

               }
               if(line[0].toLowerCase()=="minimum total carats")
               {  
                 if(totalCarat!=null)
                 {							 
                   line[1]=totalCarat;
                  // nlapiLogExecution("debug","my total carats: "+line[1],line[1]);
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
       // nlapiLogExecution("debug","Ring Image",image);

        var imgCheck = nlapiRequestURL(image);
        if(imgCheck.getCode()!="200")
          image = "";

        var pdf = {
          logo : "https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
          title : 'INSURANCE APPRAISAL',
          date : formatDate(today),
          name : customer_name,
          address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
          city : nlapiEscapeXML(order.getFieldValue("billcity")),
          state : order.getFieldValue("billstate"),
          zipcode : order.getFieldValue("billzip"),
          type_of_jewelry : "One wedding band",
          setting : "Brilliant Earth's " + item["parent.salesdescription"],
          material : metalNameStr,					
          carat : "",
          cut : "",
          color : "",
          clarity : "",
          center_diamond : "",
          accent_carat_weight : accentTable,
          replacement_price : currency + " " + addCommas(replacementAmount),
          image : image,
          disclaimer : nlapiEscapeXML('The replacement amount above is the actual sale price required to replace the property with another of similar type, nature and quality. This amount is determined by current market conditions, and is changeable without notice. The estimated replacement price above is meant for insurance purposes only. The foregoing Insurance Appraisal is made with the understanding that Brilliant Earth assumes no liability with respect to any other action that may be taken on the basis of the Insurance Appraisal.'),
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
      else if(category=="24")
      {
        var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
        var fields2 = ["custitem56","custitem64"];
        var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
        var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
        var metalNameStr=item2.custitem64; 				
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
          title : 'INSURANCE APPRAISAL',
          date : formatDate(today),
          name : customer_name,
          address1 : nlapiEscapeXML(order.getFieldValue("billaddr1")),
          city : nlapiEscapeXML(order.getFieldValue("billcity")),
          state : order.getFieldValue("billstate"),
          zipcode : order.getFieldValue("billzip"),
          type_of_jewelry : "One " + item2.custitem56,
          setting : nlapiEscapeXML("One-of-a-Kind Vintage Estate Piece " + item.custitem77),
          material : metalNameStr,
          carat : "",
          cut : "",
          color : "",
          clarity : "",
          center_diamond : centerTable,
          accent_carat_weight : accentTable,
          replacement_price : currency + " " + addCommas(replacementAmount),
          image : "",
          disclaimer : nlapiEscapeXML('The replacement amount above is the actual sale price required to replace the property with another of similar type, nature and quality. This amount is determined by current market conditions, and is changeable without notice. The estimated replacement price above is meant for insurance purposes only. The foregoing Insurance Appraisal is made with the understanding that Brilliant Earth assumes no liability with respect to any other action that may be taken on the basis of the Insurance Appraisal.'),
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
              xml += "<div style='height: 110px;'> </div>";
          }

          xml += iaTemp(pdf);
          pages++;
        }	
      }
    }
    if(isIABlockCode=='1' || isIABlockCode=='2' || isIABlockCode=='3')
    {
      var errorMsg = "";
      errorMsg += "<p>Instruction!<br/>"+iaBlockMsg+"</p>";	
     // nlapiLogExecution("error","IA Instruction Error",errorMsg);		
      xml = errorMsg;
      var file = nlapiXMLToPDF(xml);
      return file;
    }
    else
    {
      if(category=='2' || category=='3' || category=='24')
      {
        xml += "</body></pdf>";
        var file = nlapiXMLToPDF(xml);
        return file;
      }
      else
      {
        var errorMsg = "";
        errorMsg += "<p>Instruction!<br/>IA From allowed for following item:";			
        errorMsg += "<br/>Setting with large center stone(2)";
        errorMsg += "<br/>Ring with no large center stone(3)";
        errorMsg += "<br/>Melee [Other colored gemstone](24)";	
        errorMsg += "</p>";
       // nlapiLogExecution("error","IA Instruction Error",errorMsg);

        xml += "</body></pdf>";                
        var file = nlapiXMLToPDF(xml);
        return file;

      }
    }
  }
  catch(err)
  {
  //  nlapiLogExecution("error","Error Generating Insurance Appraisal for Order ID " + orderId,"Details: " + err.message);
    //return true;
  }
}



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
  return x1 + x2;l
}

function getHaloMeleeDetail(dmd_Id,dmd_ParentItemId)
{
  var haloMeleeResult=[];
  if((dmd_Id!='' && dmd_ParentItemId!=null))
  {

    var haloCheck='F';
    var grpItemArr=[];
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
      //nlapiLogExecution("debug","Halo melee Size:"+meleeSize+ " calc. w.r.t. Parent Item Id:"+dmd_ParentItemId+", Dmd Id:"+dmd_Id,dmd_Id);
      if(meleeSize==1 || meleeSize==2)
      {
        var filters = [];    	
       // nlapiLogExecution("debug","custrecord_parent_halo (Test)", itemParentId);
        filters[0] = nlobjSearchFilter("custrecord_center_shape",null,'is',1); //Shape= Round
        filters[1] = nlobjSearchFilter("custrecord_parent_halo",null,'is',itemParentId);
        var searchResult = nlapiSearchRecord("customrecord_halo_melee",4391,filters,[]);		
        var haloMeleeArr=[];
        var count=searchResult.length;
        if(searchResult.length>0)
        {

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
         // nlapiLogExecution("debug","haloMeleeArr (Test)", JSON.stringify(haloMeleeArr));
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
        //  nlapiLogExecution("debug","haloMeleeSize (Test )",haloMeleeSize);	
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
              nlapiLogExecution("debug","haloItemId (Test )",haloItemId);
              var subItemObj=nlapiLoadRecord('inventoryitem',haloItemId);                                
              var myStockUnitStr=subItemObj.getFieldText('stockunit');
              nlapiLogExecution("debug","myStockUnitStr (Test )",myStockUnitStr);
              if(myStockUnitStr!=null && myStockUnitStr!='')
              {
                stockUnit=myStockUnitStr.split(' ')[0];
              }
            }

          }
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
function isCheckEternity(myItemId)
{
  var eternityFlag='F';


  if(myItemId!='' && myItemId!=null)
  {
    var field = ["parent","custitem9"];
    var item = nlapiLookupField("item",myItemId,field);
    var myParentItemId=item.parent;
    var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");
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
    var eMC95=eternityItem.custitemeternitymeleecountsize95;
    var eMC10=eternityItem.custitemeternitymeleecountsize10;
    var eMC105=eternityItem.custitemeternitymeleecountsize105;
    var eMC11=eternityItem.custitemeternitymeleecountsize11;
    var eMC115=eternityItem.custitemeternitymeleecountsize115;
    var eMC12=eternityItem.custitemeternitymeleecountsize12;
    var eMC125=eternityItem.custitemeternitymeleecountsize125;
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
       // nlapiLogExecution("debug","My ringSize:"+ringSize+", Ring Size:"+ringSize,myItemId);     
        wholePart=ringSize.split('.')[0];
        fracPart=ringSize.split('.')[1];// Get fraction part of ring size
        fracPart='0.'+fracPart;                                                   
        if(parseFloat(fracPart)>=0 && parseFloat(fracPart)<=0.49)
        {
          ringSize=wholePart;
        }
        else if(parseFloat(fracPart)>=0.50 && parseFloat(fracPart)<=0.99)
        {

          ringSize=wholePart+'5';					 
        }
      }
      var fldName="custitemeternitymeleecountsize"+ringSize;
     // nlapiLogExecution("debug","My fldName:"+fldName+", Ring Size:"+ringSize,myItemId);
      var EternityMeleeCount=nlapiLookupField("item",myItemId,fldName); 
      var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");
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