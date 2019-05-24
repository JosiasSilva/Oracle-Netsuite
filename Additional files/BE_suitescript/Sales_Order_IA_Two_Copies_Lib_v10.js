function Sales_Order_IA_Two_Copies(orderId,email,type)
{
  nlapiLogExecution("Debug","Type",type);
  var order = nlapiLoadRecord('salesorder', orderId);
  /*var soPdfFile = nlapiPrintRecord('TRANSACTION', orderId, 'PDF', {'formnumber' : '102'});
  soPdfFile.setFolder(9432162);
  soPdfFile.setIsOnline(true); 
  var soPdfFileId = nlapiSubmitFile(soPdfFile);
  var soPdfFileObj = nlapiLoadFile(soPdfFileId);
  var soPdfUrl =soPdfFileObj.getURL();*/
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
  xml += '<#if record.shipcountry=="GB">';
  xml += '<table align="left" cellmargin="0" cellpadding="0" margin-top="0.15in">';
  	xml += '<tr>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '<td align="left" class="brandonGrotesque pt10" text-align="left"><p text-align="left" align="left" class="brandonGrotesque pt10">Brilliant Earth LLC - VAT number GB 267 1033 19</p></td>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '</tr>';
  xml += '</table>';
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
  xml += '<#elseif record.shipcountry=="AU">';
  xml += '<table align="left" cellmargin="0" cellpadding="0" margin-top="0.15in">';
  	xml += '<tr>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '<td align="left" class="brandonGrotesque pt10" text-align="left"><p text-align="left" align="left" class="brandonGrotesque pt10">ABN/GST # 24 369 770 344</p></td>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '</tr>';
  xml += '</table>';
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
  xml += '<td align="right" class="brandonGrotesque pt10">GST (${record.taxrate}%)</td>';
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
  xml += '<td class="freightDispPro pt9">***${record.currency}*** Thank you for choosing Brilliant Earth and supporting ethical origin fine jewelry! We take pride that our jewelry is produced with the highest standards of quality and excellence. However, if for any reason you are not completely satisfied, you can return or exchange any order in its original condition with the following exceptions: layaway orders, custom or modified items; items that have been altered, engraved, resized, repaired or previously exchanged. Items must be returned in original and unworn condition within 30 days from the date of shipment and require a return authorization number. Orders received after this date will not be accepted for a refund, exchange, resize or repair. Within 30 days of shipment within the US we also offer one free resizing for standard style rings. Please note that custom, modified, and engraved rings are subject to resize fees and do not qualify for our complimentary resizing. Please contact 800.691.0952 with any questions or to receive a return authorization number.<#if record.shipcountry=="US" && record.shipstate=="PA"><br/>Pennsylvania sales tax was not collected on this sale. Therefore, you may be required to remit use tax directly to the Commonwealth on your purchase if the items are subject to Pennsylvania sales tax. Please visit http://www.revenue.pa.gov/GeneralTaxInformation/Tax%20Types%20and%20Information/SUT/UseTax/Pages/default.aspx to learn more about your use tax obligations under Pennsylvania law.</#if><#if record.shipcountry="US" && record.shipstate=="WA"><br/>Brilliant Earth, LLC is not required to, and does not, collect Washington sales or use tax. Under Washington law, purchases are not tax-exempt merely because a seller is not required to collect Washington�s tax. Washington law requires Washington purchasers to review untaxed purchases and, if any tax is owed, file a Washington use tax return and pay any tax due. Visit dor.wa.gov/consumerusetax for more information.</#if></td>';
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
  xml += '<td style="padding-right: 15px; padding-bottom: 15px; text-align: right;" width="2.0in" class="freightDispPro  pt10" align="right">${record.custbody283}</td>';
  xml += '</tr>';
  xml += '<tr>';
  xml += '<td width="2.5in" class="freightDispPro pt10">';
  xml += '<span class="brandonGrotesque pt10">${record.billaddress@label}</span><br/>';
  xml += '${record.billaddress}';
  xml += '</td>';
  xml += '<td width="2.5in" class="freightDispPro  pt10">';
  xml += '<span class="brandonGrotesque pt10">${record.shipaddress@label}</span><br/>';
  xml += '${record.shipaddress}';
  xml += '</td>';
  xml += '<td width="2.0in" class="freightDispPro pt10" align="right">';
  xml += '<barcode codetype="code128" showtext="false" value="${record.tranid}"/>';
  xml += '</td>';
  //xml += '<td width="2.0in" class="freightDispPro pt10">&nbsp;</td>';
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
  xml += '<td class="freightDispPro  pt10" width="1.5in"><p align="left" text-align="left">${item.item}</p></td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="3in"><p align="left" text-align="left">${item.description}';
  xml += '<#if (item.custcol_category=="Loose Diamond" || item.custcol_category=="Loose Colored Gemstone" || item.custcol_category=="Certed Preset Engagement Ring") && item.custcol16!="">';
  xml += '<br/>Diamond Grading Report Number : ${item.custcol16}';
  xml += '</#if>';
  xml += '</p></td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="0.15in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro pt10" width="0.50in">${item.quantity}</td>';
  xml += '<td align="left" class="freightDispPro   pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro  pt10" width="0.75in">';
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
  xml += '<#if record.shipcountry=="GB">';
  xml += '<table align="left" cellmargin="0" cellpadding="0" margin-top="0.15in">';
  	xml += '<tr>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '<td align="left" class="brandonGrotesque pt10" text-align="left"><p text-align="left" align="left" class="brandonGrotesque pt10">Brilliant Earth LLC - VAT number GB 267 1033 19</p></td>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '</tr>';
  xml += '</table>';
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
  xml += '<#elseif record.shipcountry=="AU">';
  xml += '<table align="left" cellmargin="0" cellpadding="0" margin-top="0.15in">';
  	xml += '<tr>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '<td align="left" class="brandonGrotesque pt10" text-align="left"><p text-align="left" align="left" class="brandonGrotesque pt10">ABN/GST # 24 369 770 344</p></td>';
  	xml += '<td width="0.25in">&nbsp;</td>';
  	xml += '</tr>';
  xml += '</table>';
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
  xml += '<td align="right" class="brandonGrotesque pt10">GST (${record.taxrate}%)</td>';
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
  xml += '<td class="freightDispPro pt9">***${record.currency}*** Thank you for choosing Brilliant Earth and supporting ethical origin fine jewelry! We take pride that our jewelry is produced with the highest standards of quality and excellence. However, if for any reason you are not completely satisfied, you can return or exchange any order in its original condition with the following exceptions: layaway orders, custom or modified items; items that have been altered, engraved, resized, repaired or previously exchanged. Items must be returned in original and unworn condition within 30 days from the date of shipment and require a return authorization number. Orders received after this date will not be accepted for a refund, exchange, resize or repair. Within 30 days of shipment within the US we also offer one free resizing for standard style rings. Please note that custom, modified, and engraved rings are subject to resize fees and do not qualify for our complimentary resizing. Please contact 800.691.0952 with any questions or to receive a return authorization number.<#if record.shipcountry=="US" && record.shipstate=="PA"><br/>Pennsylvania sales tax was not collected on this sale. Therefore, you may be required to remit use tax directly to the Commonwealth on your purchase if the items are subject to Pennsylvania sales tax. Please visit http://www.revenue.pa.gov/GeneralTaxInformation/Tax%20Types%20and%20Information/SUT/UseTax/Pages/default.aspx to learn more about your use tax obligations under Pennsylvania law.</#if><#if record.shipcountry="US" && record.shipstate=="WA"><br/>Brilliant Earth, LLC is not required to, and does not, collect Washington sales or use tax. Under Washington law, purchases are not tax-exempt merely because a seller is not required to collect Washington�s tax. Washington law requires Washington purchasers to review untaxed purchases and, if any tax is owed, file a Washington use tax return and pay any tax due. Visit dor.wa.gov/consumerusetax for more information.</#if></td>';
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
  xml += '<td style="padding-bottom: 15px;" width="2.5in" class="freightDispPro pt10">Date: ${record.trandate?string.long}</td>';
  xml += '<td style="padding-bottom: 15px;" width="2.5in" class="freightDispPro  pt10">Order: ${record.tranid}</td>';
  xml += '<td style="padding-right: 15px; padding-bottom: 15px; text-align: right;" width="2.0in" class="freightDispPro  pt10" align="right">${record.custbody283}</td>';
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
  xml += '<td width="2.0in" class="freightDispPro pt10" align="right">';
  xml += '<barcode codetype="code128" showtext="false" value="${record.tranid}"/>';
  xml += '</td>';
  //xml += '<td width="2.0in" class="freightDispPro pt10">&nbsp;</td>';
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
  xml += '<td align="left" class="freightDispPro pt10" width="3in"><p align="left" text-align="left">${item.description}';
  xml += '<#if (item.custcol_category=="Loose Diamond" || item.custcol_category=="Loose Colored Gemstone" || item.custcol_category=="Certed Preset Engagement Ring") && item.custcol16!="">';
  xml += '<br/>Diamond Grading Report Number : ${item.custcol16}';
  xml += '</#if>';
  xml += '</p></td>';
  xml += '<td align="left" class="freightDispPro  pt10" width="0.15in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro  pt10" width="0.50in">${item.quantity}</td>';
  xml += '<td align="left" class="freightDispPro   pt10" width="0.25in">&nbsp;</td>';
  xml += '<td align="right" class="freightDispPro  pt10" width="0.75in">';
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
  var templateID  = 0;
  var templateId_Statement_Of_Value = 0;
  var templateId_so_ia_for_earrings_pendants =0;
  if(type =="soIASinglePdfFileCreation")
  {
    templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_template_file_id");
    templateId_Statement_Of_Value = nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_temp_id_new");
    templateId_so_ia_for_earrings_pendants = nlapiGetContext().getSetting("SCRIPT","custscript_so_ia_earrings_pendants_1870");
  }
  else if(type =="bulkPrintingQueue")
  {
    templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_template_file_id_new");
    templateId_Statement_Of_Value = nlapiGetContext().getSetting("SCRIPT","custscript_st_of_value_temp_id");
    templateId_so_ia_for_earrings_pendants = nlapiGetContext().getSetting("SCRIPT","custscript_so_ia_earrings_pendants_1869");
  }
  nlapiLogExecution("Debug","templateID",templateID);
  nlapiLogExecution("Debug","templateID Statement Of Value",templateId_Statement_Of_Value);
  nlapiLogExecution("Debug","template Id for SO/IA having  earrings & pendants",templateId_so_ia_for_earrings_pendants);

  var templateFile = nlapiLoadFile(templateID);
  var template = templateFile.getValue();
  var iaTemp = Handlebars.compile(template);

  // added for Loose Diamond having Statement Of Value Template
  var templateFile_Statement_Of_Value = nlapiLoadFile(templateId_Statement_Of_Value);
  var template_Statement_Of_Value = templateFile_Statement_Of_Value.getValue();
  var statement_of_value_temp_so_ia_temp = Handlebars.compile(template_Statement_Of_Value);

  // IA for Earrings & Pendants
  var templateFile_so_ia_for_earrings_pendants = nlapiLoadFile(templateId_so_ia_for_earrings_pendants);
  var template_so_ia_for_earrings_pendants = templateFile_so_ia_for_earrings_pendants.getValue();
  var so_ia_for_earrings_pendants = Handlebars.compile(template_so_ia_for_earrings_pendants);

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
    nlapiLogExecution("Debug","Boolean value for Repair or Resize Order Type having Two Copies SO/IA",chk_repair_resize_order_type);
  }
  // End Here
  if(chk_repair_resize_order_type== false)
  {
    nlapiLogExecution("Debug","Boolean value for Repair or Resize Order Type having Two Copies SO/IA",chk_repair_resize_order_type);
    if(orderType == 4 && order_tran_id.indexOf('EX')!=-1)
      chkExchangeOrderType = true;
    nlapiLogExecution("Debug","Exchange Order Type(T/F)",chkExchangeOrderType);
    var chkRingForExchange= false;
    var chkGemStoneForExchange = false;
    var countgemStoneArr =[];
    var chkMorethanOneRing =0;
    //Start Here [NS-1128]
    var so_ia_cyo_earrings_xml = SO_IA_CYO_Earrings(order,currency,pages,email,customer_name,today,so_ia_for_earrings_pendants,type);
    nlapiLogExecution("Debug","Return value of SO_IA_CYO_Earrings() fun for Two Copies:",so_ia_cyo_earrings_xml);
    if(so_ia_cyo_earrings_xml !='')
    {
      xml += so_ia_cyo_earrings_xml;
      nlapiLogExecution("Debug","XML of SO/IA CYO Earrings for Two Copies :",so_ia_cyo_earrings_xml);
    }
    else
    {
      var so_ia_cyo_pendants_xml = SO_IA_CYO_Pendants(order,currency,pages,email,customer_name,today,so_ia_for_earrings_pendants,type);
      nlapiLogExecution("Debug","Return value of SO_IA_CYO_Pendants() fun for Two Copies",so_ia_cyo_pendants_xml);
      if(so_ia_cyo_pendants_xml !='')
      {
        xml += so_ia_cyo_pendants_xml;
        nlapiLogExecution("Debug","XML of SO/IA CYO Pendants for Two Copies ",so_ia_cyo_pendants_xml);
      }
      else
      {
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
                  nlapiLogExecution("DEBUG","Return value of Default Action Function SO/IA Two Copies in Exchange Else Block",default_action_function);
                  xml += default_action_function;
                  nlapiLogExecution("DEBUG","XML of Default Action Function SO/IA Two Copies in Exchange Else Block",xml);
                }   
              }
              else
              {
                var default_action_function = defaultActionFunction(order,isIABlock,isIABlockCode,pages,customer_name,email,iaTemp,type,currency,today);
                nlapiLogExecution("DEBUG","Return value of Default Action Function IA",default_action_function);
                xml += default_action_function;
                nlapiLogExecution("DEBUG","XML of Default Action Function IA",xml);
              }
            }// end of else part one ring with modification
          }// end of else part more than one ring with modification
        }// end of else part of loose diamond
      }//end of else part of cyo pendants
    }//end of else part of cyo earrings
  }//end of if part of repair and resize order type is false
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
    nlapiLogExecution("Debug","Error Message","Error occurs during convert xml file into Pdf having two copies ::" + ex.message);
  }
  finally
  {
    return file;
  }
}