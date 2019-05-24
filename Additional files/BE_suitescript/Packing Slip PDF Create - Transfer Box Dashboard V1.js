function Packing_slip_file_Create(get_line_item,load_box_rec,from_location_text,to_location_text)
{
  var packing_slip_id=load_box_rec.getFieldValue('custrecord_box_packing_slip');
  if(packing_slip_id)
  {
    try {nlapiDeleteFile ( packing_slip_id ) ;}
    catch(er){}
  }
  var xml='<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
  xml += '<pdf><head>';
  xml += '<macrolist>';
  xml += '<macro id="nlheader" >';
  xml += Get_Header().replaceAll("&","").replaceAll("image_url","7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603")   ;
  xml += '</macro>';
  xml += '<macro id="nlfooter" >';
  xml += Get_Fotter(load_box_rec).replaceAll("&","");
  xml += '</macro>';
  xml += '</macrolist>'; 
  xml += '</head>';
  xml += '<body footer="nlfooter"  footer-height="10" header="nlheader"  header-height="40">'; 
  xml +=Get_Body_two(get_line_item,from_location_text,to_location_text);
  xml +=Get_Body_One(load_box_rec);
  xml += '</body></pdf>';
  try
  {
    var file = nlapiXMLToPDF(xml);
    var fileNameStr="shipping_List" + load_box_rec.getId() + ".pdf";
    file.setName(fileNameStr);
    file.setFolder(11269252);
    file.setEncoding('UTF-8');
    file.setIsOnline(true);
    var fileId = nlapiSubmitFile(file);
    return fileId;
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error in File ID",err.message);
  }
}



function Get_Header()
{
  var mydate = new Date();
  var month = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
  var str = month + ' ' +mydate.getDate()+', '+ mydate.getFullYear();
  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="2">';
  xml += '<tr>';
  xml += '<td colspan="4">';
  xml += '<table width="100%" border="0">';
  xml += '<tr>';
  xml += '<td height="30" align="left"><img width="180"  height="35" src="https://system.sandbox.netsuite.com/core/media/media.nl?id=image_url" /></td>';
  xml += '<td height="30" align="right" > <p style="padding: 0.13in;font-size:12pt;color:#6f7172;font-family: CenturyGothic, AppleGothic, sans-serif;"> Date: '+str+' </p></td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '</td>';
  xml += '</tr>';
  xml += '</table>';  ;  
  return xml;
}

function Get_Fotter(load_box_rec)
{
  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top:0px  #959799 ;">';
  xml += '<tr style="font-size: 14px;color:#555859;font-style: normal;font-family: Century Gothic,CenturyGothic,AppleGothic,sans-serif;font-variant: normal;line-height: 20px;">';
  xml += '<td>'+load_box_rec.getFieldText('custrecord_box_location')+' | Box # '+load_box_rec.getId();
  if(load_box_rec.getFieldValue('custrecord_box_tracking_id'))
  {
    xml += ' | Tracking # '+load_box_rec.getFieldValue('custrecord_box_tracking_id') ;
  }
  xml += '</td>';
  xml += '<td></td>';
  xml += '<td align="right"><pagenumber/>  of <totalpages/> | Page</td>';
  xml += '</tr>';
  xml += '</table>'; 
  return  xml; 
}
function Get_Body_One(load_box_rec)
{

  var xml = '<br /><table width="100%">';
  xml += '<tr>';
  xml += '<td width="*" align="center" valign="middle"></td>';
  xml += '<td width="*" align="right" valign="middle">';
  xml += '<table width="300px" border="0" cellpadding="1" cellspacing="0">';
  xml += '<tr style="font-size: 14px;color:#555859;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 20px">';
  xml += '<th width="150px" align="center" valign="middle">Transfer Order Total</th>';
  xml += '<th width="150px" align="right" valign="middle">Insurance Total</th>';
  xml += '</tr>'; 
  xml += '<tr  style="font-size: 14px;color:#555859;font-style: normal;font-variant: normal;line-height: 20px">';
  xml += '<td align="center" style="border: 1px solid #959799;">'+load_box_rec.getFieldValue('custrecord_transaction_total')+'</td>';
  xml += '<td align="right" style="border-right: 1px solid #959799;border-top: 1px solid #959799;border-bottom: 1px solid #959799;">$'+load_box_rec.getFieldValue('custrecord_box_insurance_value')+'</td>';
  xml += '</tr>'
  xml += '</table>';
  xml += '</td>';
  xml += '</tr>';
  xml += '</table>';

  return xml;
}
function Get_Body_two(line_item,from_location_text,to_location_text)
{
  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
  xml += '<tr>';
  xml += '<td colspan="2"><p  style="color:#6f7172;font-size: 14px;font-family: CenturyGothic, AppleGothic, sans-serif;font-style: normal;font-variant: small-caps;padding: 20px 20px 0px 20px;">SHIPPING FROM </p>';
  xml += '<p style="font-size: 14px;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 16px;padding: 0px 20px 20px 20px;">'+ from_location_text.replaceAll('\r\n','<br />')+'</p>';
  xml += '<br /></td>';
  xml += '<td colspan="2"><p  style="color:#6f7172;font-size: 14px;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: small-caps;padding: 20px 20px 0px 20px;">SHIP TO </p>';
  xml += '<p style="font-size: 14px;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 16px ;padding: 0px 20px 20px 20px;">'+ to_location_text.replaceAll('\r\n','<br />')+'</p>';
  xml += '<br /></td>';
  xml += '</tr>';
  xml += '<tr style="color:#6f7172;font-size: 14px;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 20px">';
  xml += '<th width="50px" align="center">No.</th>';
  xml += '<th width="100px" align="center">TO #</th>';
  xml += '<th width="200px" align="center">Memo</th>';
  xml += '<th width="100px" align="center">Insurance</th>';
  xml += '</tr>';
  line_item.sort(sort_by('tranfer_doc'));
  for(var a=0;a<line_item.length;a++)
  {

    if(!line_item[a].insurance_value)
    {
      line_item[a].insurance_value='0';
    }
    if(a==0)
    {
      xml += '<tr style="font-size: 14px;color:#555859;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 20px;">';
      xml += '<td align="center" style="border-left: 1px solid #959799;border-right: 1px solid #959799;border-top: 1px solid #959799;border-bottom: 1px solid #959799;">'+(a+1)+'</td>';
      xml += '<td align="center" style="border-right: 1px solid #959799;border-top: 1px solid #959799;border-bottom: 1px solid #959799;">'+line_item[a].tranfer_doc+'</td>';
      xml += '<td align="center" style="border-right: 1px solid #959799;border-top: 1px solid #959799;border-bottom: 1px solid #959799;">'+decodeURIComponent(line_item[a].memo)+'</td>';
      xml += '<td align="center" style="font-family: CenturyGothic, AppleGothic, sans-serif;border-right: 1px solid #959799;border-top: 1px solid #959799;border-bottom: 1px solid #959799;">$'+line_item[a].insurance_value+'</td>';
      xml += '</tr>';
    }
    else
    {
      xml += '<tr style="font-size: 14px;color:#555859;font-style: normal;font-family: CenturyGothic, AppleGothic, sans-serif;font-variant: normal;line-height: 20px;">';
      xml += '<td align="center" style="border-left: 1px solid #959799;border-right: 1px solid #959799;border-bottom: 1px solid #959799;">'+(a+1)+'</td>';
      xml += '<td align="center" style="border-right: 1px solid #959799;border-bottom: 1px solid #959799;">'+line_item[a].tranfer_doc+'</td>';
      xml += '<td align="center" style="border-right: 1px solid #959799;border-bottom: 1px solid #959799;">'+decodeURIComponent(line_item[a].memo)+'</td>';
      xml += '<td align="center" style="font-family: CenturyGothic, AppleGothic, sans-serif;border-right: 1px solid #959799;border-bottom: 1px solid #959799;">$'+line_item[a].insurance_value+'</td>';
      xml += '</tr>';
    }
  }
  xml += '</table>';
  return xml;
}