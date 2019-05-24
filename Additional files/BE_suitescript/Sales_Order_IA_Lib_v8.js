function Sales_Order_IA(orderId,email,type)
{
  nlapiLogExecution("Debug","Type",type);
  var order = nlapiLoadRecord('salesorder', orderId);
  /* var soPdfFile = nlapiPrintRecord('TRANSACTION', orderId, 'PDF', {'formnumber' : '102'});
  soPdfFile.setFolder(9432162);
  soPdfFile.setIsOnline(true); 
  var soPdfFileId = nlapiSubmitFile(soPdfFile);
  var soPdfFileObj = nlapiLoadFile(soPdfFileId);
  var soPdfUrl = soPdfFileObj.getURL();*/
  var xml ='';
  xml='<?xml version="1.0"?>';
  xml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
  xml += '<pdfset>';
  xml += '<pdf>';
  xml += '<head>';
  xml += '<link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2"></link>';
  xml += "<link name='freightDispPro' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_book.otf'/>";
  xml += "<link name='freightDispSB' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_semibold.otf'/>";
  xml += "<link name='brandonMed' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_med.otf'/>";
  xml += "<link name='brandon' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_reg.otf'/>";
  xml += "<link name='brandonBold' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_bld.otf'/>";
  xml += '<style type="text/css">';
  xml += '.title{text-transform: uppercase;font-size: 10pt;line-height: 14pt;font-family: brandon;color: #000;}';
  xml += " .brandonGrotesqueMed {font-family:brandonMed;}";
  xml += " .brandonGrotesque {font-family:brandon;}";
  xml += " .brandonGrotesqueBold {font-family:brandonBold;}";
  xml += " .freightDispProSB {font-family:freightDispSB;}";
  xml += " .freightDispPro {font-family:freightDispPro;}";
  xml += " .pt9 {font-size:9pt; line-height: 11pt;}";
  xml += " .pt10 {font-size:10pt; line-height: 14pt;}";
  xml += '</style>';
  xml += '<macrolist>';
  xml += '<macro id="nlheader"></macro>';
  xml += '<macro id="nlfooter">';
  xml += '<hr background-color="#000000" width="7.0in"/>';
  xml += '<#setting number_format=",##0.00">';
  xml += '<#if record.currency=="Great Britain Pound">';
  xml += '<table align="right" cellmargin="0" cellpadding="0" vertical-align="bottom">';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">Net Price</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${(record.custbody_total_duty_amount + record.custbody_total_item_price)?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<#if record.discounttotal != 0>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">${record.discounttotal@label}</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.discounttotal?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '</#if>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">Shipping Cost</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.shippingcost?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">VAT (20%)</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.custbody_total_vat_amount?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">Gross Price</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.total}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '<#else>';
  xml += '<table align="right" cellmargin="0" cellpadding="0" vertical-align="bottom">';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">${record.subtotal@label}</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.subtotal?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<#if record.discounttotal != 0>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">${record.discounttotal@label}</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.discounttotal?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '</#if>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">Shipping Cost</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.shippingcost?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">${record.taxtotal@label} (${record.taxrate}%)</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.taxtotal?string}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td align="right" class="brandonGrotesque pt10">${record.total@label}</td>';
  xml += '<td align="right" class="brandonGrotesque pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10">${record.total}</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '</#if>';
  xml += '<table align="center" cellmargin="0" cellpadding="0" margin-top="0.15in">';
  xml += '<tr>';
  xml += '<td width="0.25in">&nbsp;</td>';
  xml += '<td class="freightDispPro pt9">***${record.currency}*** Thank you for choosing Brilliant Earth and supporting ethical origin fine jewelry! We take pride that our jewelry is produced with the highest standards of quality and excellence. However, if for any reason you are not completely satisfied, you can return or exchange any order in its original condition with the following exceptions: layaway orders, custom or modified items; items that have been altered, engraved, resized, repaired or previously exchanged. Items must be returned in original and unworn condition within 30 days from the date of shipment and require a return authorization number. Orders received after this date will not be accepted for a refund, exchange, resize or repair. Within 30 days of shipment within the US we also offer one free resizing for standard style rings. Please note that custom, modified, and engraved rings are subject to resize fees and do not qualify for our complimentary resizing. Please contact 800.691.0952 with any questions or to receive a return authorization number.</td>';
  xml += '<td width="0.25in">&nbsp;</td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '</macro>';
  xml += '</macrolist>';
  xml += '<script>var w=window;if(w.performance||w.mozPerformance||w.msPerformance||w.webkitPerformance){var d=document;AKSB=w.AKSB||{},AKSB.q=AKSB.q||[],AKSB.mark=AKSB.mark||function(e,_){AKSB.q.push(["mark",e,_||(new Date).getTime()])},AKSB.measure=AKSB.measure||function(e,_,t){AKSB.q.push(["measure",e,_,t||(new Date).getTime()])},AKSB.done=AKSB.done||function(e){AKSB.q.push(["done",e])},AKSB.mark("firstbyte",(new Date).getTime()),AKSB.prof={custid:"501074",ustr:"",originlat:"0",clientrtt:"65",ghostip:"184.25.57.179",ipv6:false,pct:"10",clientip:"174.103.165.164",requestid:"21ec75e",region:"23110",protocol:"h2",blver:13,akM:"x",akN:"ae",akTT:"O",akTX:"1",akTI:"21ec75e",ai:"329458",ra:"false",pmgn:"",pmgi:"",pmp:"",qc:""},function(e){var _=d.createElement("script");_.async="async",_.src=e;var t=d.getElementsByTagName("script"),t=t[t.length-1];t.parentNode.insertBefore(_,t)}(("https:"===d.location.protocol?"https:":"http:")+"//ds-aksb-a.akamaihd.net/aksb.min.js")}</script>';
  xml += '</head>';
  xml += '<body header="nlheader" header-height="0.95in" footer="nlfooter" footer-height="2.5in">';
  xml += '<table align="center">';
  xml += '<tr>';
  xml += '<td align="center"><p class="brandonGrotesqueMed" text-align="center" color="#000000" align="center" padding-top="15">SALES INVOICE</p></td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '<hr background-color="#000000" width="7.0in" />';
  xml += '<table align="center" width="7.0in">';
  xml += '<tr>';
  xml += '<td style="padding-bottom: 15px;" width="2.5in" class="freightDispPro  pt10">Date: ${record.trandate?string.long}</td>';
  xml += '<td style="padding-bottom: 15px;" width="2.5in" class="freightDispPro  pt10">Order: ${record.tranid}</td>';
  xml += '<td style="padding-bottom: 15px; text-align: right;" width="2.0in" class="freightDispPro  pt10" align="right">${record.custbody283}</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td width="2.5in" class="freightDispPro pt10">';
  xml += '<span class="brandonGrotesque pt10">${record.billaddress@label}</span><br/>';
  xml += '${record.billaddress}';
  xml += '</td>';
  xml += '<td width="2.5in" class="freightDispPro pt10">';
  xml += '<span class="brandonGrotesque pt10">${record.shipaddress@label}</span><br/>';
  xml += '${record.shipaddress}';
  xml += '</td>';
  xml += '<td width="2.0in" class="freightDispPro pt10">&nbsp;</td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '<hr background-color="#000000" width="7.00in" />';
  xml += '<table align="center" cellmargin="0" cellpadding="0" width="7.00in" height="3.00in">';
  xml += '<#list record.item as item>';
  xml += '<#if item_index==0>';
  xml += '<thead>';
  xml += '<tr>';
  xml += '<td align="left" width="1.5in" class="brandonGrotesque pt10">ITEM</td>';
  xml += '<td align="left" width="3in" class="brandonGrotesque pt10">DESCRIPTION</td>';
  xml += '<td align="left" width="0.15in" class="brandonGrotesque pt10">&nbsp;</td>';
  xml += '<td align="right" width="0.50in" class="brandonGrotesque pt10">QUANTITY</td>';
  xml += '<td align="left" width="0.25in" class="brandonGrotesque pt10">&nbsp;</td>';
  xml += '<td align="right" width="0.75in" class="brandonGrotesque pt10">AMOUNT</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td colspan="6" align="left">';
  xml += '<hr background-color="#000000" width="7.00in"/>';
  xml += '</td>';
  xml += '</tr>';
  xml += '</thead>';
  xml += '</#if>';
  xml += '<#if item.custcol_category != "Melee (Diamond)" && item.custcol_category != "Melee (Sapphire)" && item.custcol_category != "Melee (Other colored gemstone)">';
  xml += '<#if !(item.description=="" && (item.item=="Resize Ring ." || item.item=="Assemble Jewelry ." || item.item=="Repair Ring ." || item.item=="Head ."))>';
  xml += '<tr padding-bottom="0.1in">';
  xml += '<td class="freightDispPro pt10" width="1.5in"><p align="left" text-align="left">${item.item}</p></td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="3in"><p align="left" text-align="left">${item.description}';
  xml += '<#if (item.custcol_category=="Loose Diamond" || item.custcol_category=="Loose Colored Gemstone" || item.custcol_category=="Certed Preset Engagement Ring") && item.custcol16!="">';
  xml += '<br/>Diamond Grading Report Number : ${item.custcol16}';
  xml += '</#if>';
  xml += '</p></td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="0.15in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.50in">${item.quantity}</td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.75in">';
  xml += '<#if item.amount[0] == "$">';
  xml += '${item.amount?substring(1)}';
  xml += '<#else>';
  xml += '${item.amount}';
  xml += '</#if>';
  xml += '</td>';
  xml += '</tr>';
  xml += '</#if></#if>';
  xml += '</#list>';
  xml += '</table>';
  xml += '</body>';
  xml += '</pdf>';
  //xml+= "<pdf src='" + nlapiEscapeXML(soPdfUrl) + "' />";
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
  //xml += "<p class='freightDispPro' color='#959595' align='center'>26 O'Farrell Street &#8226; 10th Floor &#8226; San Francisco, CA 94108 &#8226; 800.691.0952 &#8226; BrilliantEarth.com</p>";
  xml += "</macro>";
  xml += "</macrolist>";
  xml += "</head>";
  xml+= "<body size='letter' footer='nlfooter' footer-height='0.5in'>";
  var currency = order.getFieldValue("currencysymbol");  
  var pages = 0;
  var templateID  =0;
  var templateId_Statement_Of_Value = 0;
  if(type =="soIASinglePdfFileCreation")
  {
    templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_template_file_id");
    templateId_Statement_Of_Value = nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_temp_id_new");
  }
  else if(type =="bulkPrintingQueue")
  {
    templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_template_file_id_new");
    templateId_Statement_Of_Value = nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_temp_id");
  }
  nlapiLogExecution("Debug","templateID",templateID);
  nlapiLogExecution("Debug","templateID Statement Of Value",templateId_Statement_Of_Value);

  var templateFile = nlapiLoadFile(templateID);
  var template = templateFile.getValue();
  var iaTemp = Handlebars.compile(template);

  // added for Loose Diamond having Statement Of Value Template
  var templateFile_Statement_Of_Value = nlapiLoadFile(templateId_Statement_Of_Value);
  var template_Statement_Of_Value = templateFile_Statement_Of_Value.getValue();
  var statement_of_value_temp_so_ia_temp = Handlebars.compile(template_Statement_Of_Value);

  var customer_name = nlapiLookupField("customer",order.getFieldValue("entity"),["firstname","lastname"]);
  customer_name = nlapiEscapeXML(customer_name.firstname) + " " + nlapiEscapeXML(customer_name.lastname);

  var today = new Date();
  today = nlapiDateToString(today,"date");

  var isIABlock='F',isIABlockCode='0',iaBlockMsg='' ;
  var chkCategory =false;

  var chkExchangeOrderType = false;
  var soFields = nlapiLookupField("salesorder",orderId,["custbody87","tranid"]);//Exchange Order type =4,Order#
  var orderType = soFields.custbody87;
  var order_tran_id = soFields.tranid;
  nlapiLogExecution("Debug","Exchange Order Type Value",orderType);// Exchange Order Type = 4
  nlapiLogExecution("Debug","Exchange Transaction Order #",order_tran_id);
  // Repair = 2 & Resize = 3
  // Added new code for [ns-1051]
  //Start here
  var chk_repair_resize_order_type= false;
  if(orderType == 2 || orderType== 3)
  {
    nlapiLogExecution("Debug","Repair/Resize Order Type",orderType);
    chk_repair_resize_order_type = true;
    nlapiLogExecution("Debug","Boolean value for Repair or Resize Order Type",chk_repair_resize_order_type);
  }
  // End Here
  if(chk_repair_resize_order_type == false)
  {
    nlapiLogExecution("Debug","Boolean value for Repair or Resize Order Type",chk_repair_resize_order_type);
    if(orderType == 4 && order_tran_id.indexOf('EX')!=-1)
      chkExchangeOrderType = true;
    nlapiLogExecution("Debug","Exchange Order Type(T/F)",chkExchangeOrderType);
    var chkRingForExchange= false;
    var chkGemStoneForExchange = false;
    var countgemStoneArr =[];
    var chkMorethanOneRing =0;

    var so_ia_chk_loosediamond =  chk_LooseDiamond_For_SO_IA(order,currency,pages,email,customer_name,today,statement_of_value_temp_so_ia_temp,type);
    nlapiLogExecution("Debug","Return value of chk_LooseDiamond_For_SO_IA() fun",so_ia_chk_loosediamond);
    if(so_ia_chk_loosediamond != '')
    {
      xml += so_ia_chk_loosediamond;
      nlapiLogExecution("Debug","XML of chk_LooseDiamond_For_SO_IA() fun",xml);
    }
    else
    {
      var so_ia_chk_more_than_one_ring_with_modification = SO_IA_Chk_More_Than_One_Ring_With_Modifications(order);
      nlapiLogExecution("Debug","Return value of SO_IA_Chk_More_Than_One_Ring_With_Modifications() fun",so_ia_chk_more_than_one_ring_with_modification);
      if(so_ia_chk_more_than_one_ring_with_modification == true)
      {
        // do nothing
      }
      else
      {
        var  so_ia_chk_one_ring_with_modifications = SO_IA_Chk_One_Ring_With_Modifications(order,pages,today,customer_name,currency,email,iaTemp,type);
        nlapiLogExecution("Debug","Return value of SO_IA_Chk_One_Ring_With_Modifications() fun",so_ia_chk_one_ring_with_modifications);
        if(so_ia_chk_one_ring_with_modifications != '')
        {
          xml += so_ia_chk_one_ring_with_modifications;
          nlapiLogExecution("Debug","XML of SO_IA_Chk_One_Ring_With_Modifications() fun",xml);
        }
        else
        {
          if(chkExchangeOrderType == true)
          {
            var so_ia_exchange =  SO_IA_Exchange_One(order,pages,today,customer_name,currency,email,iaTemp,countgemStoneArr,chkCategory,chkGemStoneForExchange,chkRingForExchange,chkExchangeOrderType,type);
            nlapiLogExecution("Debug","Return value of SO_IA_Exchange_One() fun",so_ia_exchange);
            if(so_ia_exchange !='')
            {
              xml += so_ia_exchange;
              nlapiLogExecution("Debug","XML of SO_IA_Exchange_One() fun",xml);
            }
            else
            {
              var default_action_function = defaultActionFunction(order,isIABlock,isIABlockCode,pages,customer_name,email,iaTemp,type,currency,today);
              nlapiLogExecution("DEBUG","Return value of Default Action Function IA in Exchange Else Block",default_action_function);
              xml += default_action_function;
              nlapiLogExecution("DEBUG","XML of Default Action Function IA in Exchange Else Block",xml);
            }  
          }
          else
          {
            var default_action_function = defaultActionFunction(order,isIABlock,isIABlockCode,pages,customer_name,email,iaTemp,type,currency,today);
            nlapiLogExecution("DEBUG","Return value of Default Action Function IA",default_action_function);
            xml += default_action_function;
            nlapiLogExecution("DEBUG","XML of Default Action Function IA",xml);
          }
        }
      }
    }
  }
  xml += "</body></pdf>";
  xml += "</pdfset>";
  var renderer = nlapiCreateTemplateRenderer();
  renderer.setTemplate(xml);
  renderer.addRecord('record', order);
  var xmlRendered = renderer.renderToString();
  nlapiLogExecution("debug","xmlRendered",xmlRendered);
  try
  {
    var file = nlapiXMLToPDF(xmlRendered);
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error Message","Error occurs during convert xml file into Pdf::" + ex.message);
  }
  finally
  {
    return file;
  }
}

function defaultActionFunction(order,isIABlock,isIABlockCode,pages,customer_name,email,iaTemp,type,currency,today)
{
  var xml ='';
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
  for(var x=0; x < order.getLineItemCount("item"); x++)
  {
    var category = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem20");
    //Added By Shiv
    var myItemId=order.getLineItemValue("item","item",x+1);
    var myItemText=order.getLineItemText("item","item",x+1);
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
        //iaBlockMsg +='IA From is Blocked for this item =>' + myItemText +'<br/>';
        //iaBlockMsg='IA From is Blocked for this item ';
        continue;
      }
    }
    //----End----
    if(category=="2")
    {
      //Setting with large center stone
      // chkCategory =true;
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
      var chkImagUrl =false;
      nlapiLogExecution("debug","Replacement Amount",replacementAmount);
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
      //image += "https://image.brilliantearth.com/media/shape_images/";
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
          chkImagUrl =true;
          nlapiLogExecution("debug","Replacement Amount",replacementAmount);
          break;
        }   
        else if(sub_category=="8" || sub_category=="31" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
        {
          sapphireID = order.getLineItemValue("item","item",i+1);
          image += "https://image.brilliantearth.com/media/images/";
          replacementAmount += parseFloat(order.getLineItemValue("item","amount",i+1));
          chkImagUrl =true;
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
      var myParentItemId=order.getLineItemValue("item","item",x+1); 
      var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");
      var collection='',dShape='';
      var  roundMeleeShape =0,marquiseMeleeShape=0;
      var marquise_dmdHaloMeleCount=0;
      var marquise_dmdMinTotCarat =0;
      var  meleeResult='';
      var newTempTable='';
      var nonRoundShape ='';
      //collection=nlapiLookupField("item",myParentItemId,"custitem78");
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
      if((myParentItemId !='' && myParentItemId !=null) && (subItemId !='' && subItemId !=null) && (dmdStoneId !='' && dmdStoneId !=null) && (dShape=='1'))
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
              isIABlockCode='2';
              nlapiLogExecution("Debug","Information","There is no gemstone count information available for halo style on PO under Melee Item Tab having round shape.");
              //iaBlockMsg +='There is no gemstone count information available for this style.<br/>';
              continue;
            }
          }
        }
      }
      nlapiLogExecution("debug","My Halo Melee Result for Diamond Id:"+dmdStoneId," My haloCheck:"+haloCheck+", HaloMeleeId:"+dmdHaloMeleeId+", Diamond Shape:"+dmdShape+", dmdMesearure:"+dmdMesearure+", HaloMeleCount:"+dmdHaloMeleCount+", StockUnit:"+dmdStockUnit+", MinTotCarat:"+dmdMinTotCarat);
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table",newTempTable);
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
      //var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      //if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
      //  accentText = item["parent.custitem101"];

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

          var accentTextArr=accentText.split("Treatment:  None");   
          nlapiLogExecution("debug","Accent Text Split Length",accentTextArr.length);
          for(var j=0; j < accentTextArr.length; j++)
          { 
            if(accentTextArr[j]!='' && accentTextArr[j]!=null)
            {
              var testTemp=accentTextArr[j];
              nlapiLogExecution("debug","Test Temp",accentTextArr[j]);
              var index1= testTemp.toLowerCase().indexOf("conflict free diamond");
              var index11= testTemp.toLowerCase().indexOf("diamond"); //Added by Sandeep for NS-624
              if(index1>0 || index11>0)
              {
                var index2 = accentTextArr[j].toLowerCase().indexOf("round"); //if Round 
                if(index2 > 0)
                {
                  var  accentTextTemp = accentTextArr[j].split("\n");
                  nlapiLogExecution("debug","accent Text Temp",accentTextArr[j]);
                  nlapiLogExecution("debug","accent Text Temp length",accentTextTemp.length);
                  for(var i=0; i < accentTextTemp.length; i++)
                  { 
                    var line = accentTextTemp[i].split(":");
                    nlapiLogExecution("Debug","line",line);
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
      nlapiLogExecution("Debug","Image Url",image);
      nlapiLogExecution("Debug","Check Image Url",chkImagUrl);
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

      /* var title='';
      var disclaimer ='';
      if(type =="soIASinglePdfFileCreation")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new");
      else if(type =="bulkPrintingQueue")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new_two");

      if(type =="soIASinglePdfFileCreation")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new"));
      else if(type =="bulkPrintingQueue")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new_two"));*/

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
      // chkCategory =true;
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
      //Wedding Bands

      var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
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
      nlapiLogExecution("debug","Final No. of GemStone:"+NoOfGemStone+", totalCarat:"+totalCarat,myItemId);


      if(eternityCheck=='T' && eternityMeleeResult.length ==0 && parseFloat(NoOfGemStone)==0)
      {
        //eternityCheck='F';
        // isIABlockCode='3';
        // iaBlockMsg=' There is no gemstone count information available for eternity style.';
        var createPOLinkCount = order.getLineItemCount('links');//find PO link on line item
        nlapiLogExecution('DEBUG', 'PO Link for Eternity style', createPOLinkCount);
        if(createPOLinkCount>0)
        {
          meleeResult = MeleeItemCountOn_PO(order, createPOLinkCount); 
          nlapiLogExecution('DEBUG', 'JSON Melee Result for Eternity', JSON.stringify(meleeResult));
          if(meleeResult.length>0)
          {
            //haloCheck=meleeResult[0].haloCheck;
            //NoOfGemStone=meleeResult[0].totalMeleeCount;
            // totalCarat=meleeResult[0].totalMeleeCarat;
            newTempTable = rtnNewMeleeItemTable_Temp(meleeResult,newTempTable,accentText);
          }
          else
          {
            eternityCheck='F';
            isIABlockCode='3';
            nlapiLogExecution("Debug","Information","There is no gemstone count information available for eternity style on PO under Melee Tab.");
            // iaBlockMsg +='There is no gemstone count information available for eternity style.<br/>';
            continue;
          }
        }
        /* else
        {
          eternityCheck='F';
          isIABlockCode='3';
          nlapiLogExecution("Debug","Information","There is no PO Link associated with sales order for eternity style.");
         // iaBlockMsg +='There is no gemstone count information available for eternity style.<br/>';
          continue;
        }*/

      }
      newTempTable += "</table>";
      nlapiLogExecution("Debug","New Temp Table for Eternity",newTempTable);
      //End 
      var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
      var metalType=nlapiLookupField("item",order.getLineItemValue("item","item",x+1),metalField,true);
      var metalNameStr=metalType.custitem1;


      //Wedding Bands

      // var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9","vendor"];
      // var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);

      var replacementAmount = order.getLineItemValue("item","rate",x+1);
      /*
                  if(order.getFieldValue("taxrate") > 0)
                  {
                      var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
                      replacementAmount = replacementAmount * taxrate;
                  }
                  */

      replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));

      //var accentText = "";
      //var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
      //if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
      //accentText = item["parent.custitem101"];

      nlapiLogExecution("debug","accentText-3 : "+accentText,accentText);    // Added for UT

      //If vendor is Harout R, then use website text as sub-items are not populated
      if(item["vendor"]=="1223843")
        accentText = item["parent.custitem101"];

      if(accentText!="" && accentText!=null)
      {

        if(eternityCheck=='T' && isEternityItem=='1') // to check eternity
        { var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";            

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
      /* var title='';
      var disclaimer ='';
      if(type =="soIASinglePdfFileCreation")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new");
      else if(type =="bulkPrintingQueue")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new_two");

      if(type =="soIASinglePdfFileCreation")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new"));
      else if(type =="bulkPrintingQueue")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new_two"));*/

      var pdf = {
        logo : "https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
        title : title,
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
        carat : "",
        cut : "",
        color : "",
        clarity : "",
        center_diamond : "",
        accent_carat_weight : poLinkCount>0 ? newTempTable :accentTable,
        replacement_price : currency + " " + addCommas(replacementAmount),
        image : image,
        disclaimer : disclaimer,
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
      //Estate Rings
      // chkCategory =true;
      var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
      var fields2 = ["custitem56","custitem64"];
      var item = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields);
      var item2 = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),fields2,true);
      var metalNameStr=item2.custitem64; // Added by Shiv per NS-402 assigned by Eric       


      var replacementAmount = order.getLineItemValue("item","rate",x+1);

      /*
                  if(order.getFieldValue("taxrate") > 0)
                  {
                      var taxrate = (parseFloat(order.getFieldValue("taxrate")) / 100) + 1;
                      replacementAmount = replacementAmount * taxrate;
                  }
                  */

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
      /*
                  var imgCheck = nlapiRequestURL(image);
                  if(imgCheck.getCode()!="200")
                      image = "";
                  */
      /*var title='';
      var disclaimer ='';
      if(type =="soIASinglePdfFileCreation")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new");
      else if(type =="bulkPrintingQueue")
        title = nlapiGetContext().getSetting("SCRIPT","custscript_ia_title_new_two");

      if(type =="soIASinglePdfFileCreation")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new"));
      else if(type =="bulkPrintingQueue")
        disclaimer =  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_disclaimer_new_two"));*/

      var pdf = {
        logo : "https://image.brilliantearth.com/media/images/logo/BE_logo_475x150.jpg",
        title : title,
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
        disclaimer : disclaimer,
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
          title : title,
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
          disclaimer : disclaimer,
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
  nlapiLogExecution("DEBUG","XML of Default Action Function IA (Test)",xml);
  return xml;
}