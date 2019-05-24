function createVRAPackingSlip(arrProducts,VRAId,IF_Id,trackingNo,ship_from_addr, ship_to_addr) {
  try {
    var date = getTodayDate();
    var fileName = 'vra_packing_slip_'+ IF_Id + '.pdf';
    var vraDocNo=nlapiLookupField('vendorreturnauthorization',VRAId,'tranid');
    if(!trackingNo)
      trackingNo='';

    //Address
   // var ship_from_addr = "26 O'Farrell St, 10th Floor\n San Francisco, CA 94108\n Phone: 415-354-4628\n Fax: 505-212-4881";
    ship_from_addr = ship_from_addr.replaceAll('\n', '<br/>');

    //Ship To Address
	//ship_to_addr="26 O'Farrell St, 10th Floor\n San Francisco, CA 94108\n Phone: 415-354-4628\n Fax: 505-212-4881";
    if (ship_to_addr) {
		
      ship_to_addr = ship_to_addr.replaceAll('\n', '<br/>');
    }


    var trandate = date[0]; //OrderRecord.getFieldValue('trandate');

    var xml = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
    xml += '<pdf><head>';

    xml += '<macrolist>';
    xml += '<macro id="nlfooter" >';
    var footer_height = '5%';
        xml += '<p width="100%" align="center" style="color:#77797a;position: absolute; right: 0;  bottom: 0;  left: 0;  padding: 1rem; text-align: center;font-size:9pt;font-family: Century Gothic, sans-serif;">26 O’Farrell Street ᛫ 10th Floor ᛫San Francisco, CA94108 ᛫ 800-691-0962 ᛫ www.BrilliantEarth.com </p>';
      footer_height = '5%';
  

    xml += '</macro>';
    xml += '</macrolist>';
    xml += '<style type="text/css">';
    xml += "th {";
    xml += "font-family: Century Gothic, sans-serif;";
    xml += "word-spacing: 0px!important;";
    xml += "font-size: 9pt;";
    xml += "vertical-align: top;";
    xml += "padding-right: 6px;";
    xml += "padding-left: 6px;";
    xml += "padding-bottom: 4px;";
    xml += "padding-top: 4px;";
    xml += "background-color: #d6d7d8;";
    xml += "color: #77797a;";
    xml += "font-weight:normal;";
    xml += "}";
    xml += "td.maintd {";
    xml += "padding-right: 6px;";
    xml += "padding-left: 6px;";
    xml += "padding-bottom: 4px;";
    xml += "padding-top: 4px;";
    xml += "font-family: Century Gothic, sans-serif;";
    xml += "}";
    xml += ".main {";
    xml += "}";
    xml += '</style>';
    xml += '</head>';

    xml += '<body footer="nlfooter" footer-height="' + footer_height + '">';
    xml += '<table>';
    xml += '<tr>';
    xml += '<td align="left" width="229px"><img src="/core/media/media.nl?id=7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603" width="229px" height="47px"/></td>';
    xml += '<td width="100"></td>';
    xml += '<td align="right" width="200" style="color:#77797a; font-size:10pt;font-family: Century Gothic, sans-serif;">PACKING SLIP</td>';
    xml += '</tr>';
    xml += '<tr height="3%">';
    xml += '<td colspan="12"></td>';
    xml += '</tr>';
    xml += '</table>';
    xml += '<table>';
    xml += '<tr>';
   
    xml += '<td width="200" align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;font-weight:bold;">SHIP FROM</td>';
    xml += '<td align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;font-weight:bold;" width="200" >SHIP TO</td>';
	 xml += '<td width="150" align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;font-weight:normal;">Date : '+trandate+'</td>';
    xml += '</tr>';
    xml += '<tr>';
    xml += '<td width="200" align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">' + ship_from_addr + '</td>';
    xml += '<td align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;" width="200" >' + ship_to_addr + '</td>';
	xml += '<td  align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;" width="150">'; 
	xml += '<table>';
	xml += '<tr><td align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">VRA #'+vraDocNo+'</td></tr>';
	xml += '<tr><td align="left" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">Tracking #'+trackingNo+'</td></tr>';
	xml += '</table></td>';
    xml += '</tr>';
    xml += '<tr height="3%"><td colspan="12"></td></tr>';
    xml += '</table>';
	
	
    var strName = '<table class="main" cellspacing="0"  width="100%">';
    strName += '<thead><tr>';
    strName += '<th align="center">ITEM</th>';
    strName += '<th align="center">DESCRIPTION</th>';
    strName += '<th align="center">CERTIFICATE #</th>';
	strName += '<th align="center">AMOUNT</th></tr>';
    strName += '</thead>';


    var sum = 0;
    var tot_qty=0;

    for (var i = 0; i < arrProducts.length; i++) {
      var item = arrProducts[i].vendor;
	  var desc = arrProducts[i].desc; 
      var certificate_no = arrProducts[i].certificate_no; 
      var amount = parseFloat(arrProducts[i].amount); 
	 
      strName += '<tr>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">' + item + '</td>';
      strName += '<td align="center" class="maintd" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">' + desc + '</td>';
       strName += '<td align="center" class="maintd" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">' + certificate_no + '</td>';
	  strName += '<td align="center" class="maintd" style="color:#77797a; font-size:9pt;font-family: Century Gothic, sans-serif;">$' + amount.toFixed(2) + '</td>';
      strName += '</tr>';

      sum += parseFloat(amount);
     }

    strName += '<tr>';
    strName += '<td></td>';
    strName += '<td></td>';
    strName += '<td align="center" style="font-size:9pt; color:#77797a; background-color: #d6d7d8; font-weight:bold; font-family: Century Gothic, sans-serif;">TOTAL </td>';
    strName += '<td align="center" style="font-size:9pt; color:#77797a; background-color: #d6d7d8; font-family: Century Gothic, sans-serif;">$'+sum.toFixed(2)+'</td>';
    strName += '</tr>';
    strName += '</table>';
    strName += '</body></pdf>';

    xml += strName;
    var fileA = nlapiXMLToPDF(xml);
    nlapiLogExecution('DEBUG', 'file :', fileA);
    
	var folderId = '11064888'; //Folder ID
    if (fileA != null && fileA != '') {
      
      //Delete existing file
      var custbody_vendor_packing_slip_vra = nlapiLookupField("itemfulfillment",IF_Id,"custbody_vendor_packing_slip_vra");
	  if(custbody_vendor_packing_slip_vra!=null && custbody_vendor_packing_slip_vra!="")
		nlapiDeleteFile(custbody_vendor_packing_slip_vra);
      
      fileA.setFolder(folderId);
      fileA.setName(fileName);
      fileA.setIsOnline(true);
    }
    var fileId = nlapiSubmitFile(fileA);
	nlapiSubmitField('itemfulfillment', IF_Id, 'custbody_vendor_packing_slip_vra', fileId);
    //end of Template A
  } catch (ex) {
    nlapiLogExecution('debug', 'Error in creating Internal slip', ex.message);
  }
}
function getTodayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var format1 = mm + '/' + dd + '/' + yyyy;
  var format2 = mm + '_' + dd + '_' + yyyy;
  return [format1, format2];
}
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
