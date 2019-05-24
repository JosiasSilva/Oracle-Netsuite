function PDF_file_Create(get_line_item,vendor_text,box_rec_Id,total_insu,packing_slip_id,po_push)
{
  if(packing_slip_id)
  {
    try {nlapiDeleteFile ( packing_slip_id ) ;}
    catch(er){}
  }
  var get_obj_box=nlapiLookupField ( 'customrecord_box_record' , box_rec_Id , ['custrecord_box_tracking_id','custrecord_box_ship_date','custrecord_box_vendor'] );




  var get_obj=Create_obj_data(get_line_item,vendor_text,box_rec_Id,total_insu);
  if(get_obj)
  {
    //  if(vendor_text){ vendor_text=vendor_text.replaceAll("&","");}

    var xml='<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
    xml += '<pdf><head>';
    xml += '<macrolist>';
    xml += '<macro id="nlheader" >';

    xml += Get_Header(get_obj_box).replaceAll("&","").replaceAll("image_url","7429493&amp;c=666639&amp;h=f38c84ab4d27a4e5bdc6&amp;fcts=20170816041603")   ;
    xml += '</macro>';
    xml += '<macro id="nlfooter" >';
    xml += Get_Fotter(vendor_text,box_rec_Id,get_obj_box).replaceAll("&","");
    xml += '</macro>';
    xml += '</macrolist>';   
    xml += '</head>';
    xml += '<body footer="nlfooter"  footer-height="10" header="nlheader"  header-height="40"  style="font-size:10.5pt;font-family: Century Gothic,CenturyGothic,AppleGothic,sans-serif;">'; 
    xml +=Get_Body_One(get_obj,total_insu,get_obj_box).replaceAll("&","");
      nlapiLogExecution("debug","4");
    //  xml +='<br />';
    xml +=Get_Body_two(get_obj).replaceAll("&","");
      nlapiLogExecution("debug","5");
    xml += '</body></pdf>';
    try
    {
      var file = nlapiXMLToPDF(xml);
      var fileNameStr="Vendor_List" + box_rec_Id + ".pdf";
      file.setName(fileNameStr);
      file.setFolder(11269252);
      file.setEncoding('UTF-8');
      file.setIsOnline(true);
      var fileId = nlapiSubmitFile(file);
      nlapiSubmitField ( 'customrecord_box_record' , box_rec_Id , ['custrecord_box_packing_slip','custrecord_po_id'] , [fileId,po_push]);
      // nlapiSubmitField ( 'customrecord_box_record' , box_rec_Id , 'custrecord_box_packing_slip' ,fileId) ;
      //return [fileId,get_obj];
    }
    catch(err)
    {
      nlapiLogExecution("debug","Error in File ID",err.message);
    }
  }

}
function Create_obj_data(get_line_item,vendor_text,box_rec_Id,total_insu)
{
  var po_count=[];
  var compaire_function_call=false;
  try
  {
    if(!total_insu){total_insu=0;}
    var obj_data={
      header:"Sending from SF " + vendor_text + " - Box # " + box_rec_Id,
      footer:"$" + nlapiFormatCurrency(total_insu),
      vendor_text:vendor_text,
      po_count:0,
      list:[]
    }
    for(var p=0;p<get_line_item.length;p++)
    {
      var po_doc=get_line_item[p].po_doc;
      var po_doc_insert ='';
      if(po_doc){po_doc_insert=po_doc.replace("Purchase Order #", ""); }
      var get_desc=decodeURIComponent(decodeURIComponent(get_line_item[p].description));
      if(get_desc)
      {
        get_desc= nlapiEscapeXML(get_desc);
      }
      else
      {
        get_desc='';
      }
      if(po_doc_insert && get_line_item[p].sublist_type=='2')
      {
        po_doc_insert='SB-'+po_doc_insert;
        if(po_count.indexOf(po_doc_insert)==-1)
        {
          po_count.push(po_doc_insert);
          compaire_function_call=true;
        }
        //po_count++;
      }
      if(po_doc_insert && get_line_item[p].sublist_type=='1')
      {
        if(po_count.indexOf(po_doc_insert)==-1)
        {
          po_count.push(po_doc_insert);
        }
        // po_count++;
      }
      if(po_doc_insert && get_line_item[p].sublist_type=='3')
      {
        if(po_count.indexOf(po_doc_insert)==-1)
        {
          po_count.push(po_doc_insert);
        }
      }


      var get_insurence=get_line_item[p].insurance_value;
      if(!get_insurence){get_insurence=0;}
      obj_data.list.push({
        sr_no:(p+1),
        po_document:po_doc_insert,
        description:get_desc,
        insurence_value:nlapiFormatCurrency(get_insurence),
        sublist_type:get_line_item[p].sublist_type
      });

    }
    obj_data.po_count=po_count.length;
    // nlapiLogExecution ( 'debug' ,  obj_data, JSON.stringify(obj_data)); 
    if(compaire_function_call)
    {
      obj_data.list= Get_Sorting_SB(obj_data.list);
    }
    return obj_data;
  }
  catch(er)
  {
  }
}


function Get_Header(get_obj_box)
{
  var mydate = new Date(get_obj_box.custrecord_box_ship_date);
  var month = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
  var str = month + ' ' +mydate.getDate()+', '+ mydate.getFullYear();
  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="2">';
  xml += '<tr>';
  xml += '<td colspan="4">';
  xml += '<table width="100%" border="0">';
  xml += '<tr>';
  xml += '<td height="30" align="left"><img width="180"  height="35" src="https://system.sandbox.netsuite.com/core/media/media.nl?id=image_url" /></td>';
  xml += '<td height="30" align="right" > <p style="padding: 0.13in;font-size:11pt;"> Date: '+str+' </p></td>';
  xml += '</tr>';
  xml += '</table>';
  xml += '</td>';
  xml += '</tr>';
  xml += '</table>';  ;  
  return xml;
}








function Get_Fotter(vendor_text,box_rec_Id,get_obj_box)
{
  var xml = '<table width="100%" border="0" cellpadding="1" cellspacing="1" style="border-top:0px #959799 ;padding: 0.1in;">';
  xml += '<tr>';
  xml += '<td>'+vendor_text+' | Box # '+box_rec_Id;
  if(get_obj_box.custrecord_box_tracking_id)
  {
    xml += ' | Tracking # '+get_obj_box.custrecord_box_tracking_id ;
  }
  xml += '</td>';
  xml += '<td></td>';
  xml += '<td align="right"><pagenumber/>  of <totalpages/> | Page</td>';
  xml += '</tr>';
  xml += '</table>'; 
  return  xml; 
}
function Get_Body_One(get_obj,total_insu,get_obj_box)
{



  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 0.1in;">';

  var vendor_address=nlapiLoadRecord('vendor' , get_obj_box.custrecord_box_vendor ).getFieldValue('defaultaddress');
  if(vendor_address){
    xml += '<tr>';
    xml += '<td colspan="3"><p><strong><br />SHIP TO</strong><br />';
    xml +=vendor_address.replaceAll('\r\n','<br />');
    xml += '</p><br /></td>';
    xml += '</tr>';
  }
  xml += '<tr>';
  xml += '<td width="*" align="center" valign="middle">Purchase Order Total</td>';
  xml += '<td width="*" align="center" valign="middle">Item Total</td>';
  xml += '<td width="*" align="center">Insurance Total</td>';
  xml += '</tr>'; 
  xml += '<tr>';
  xml += '<td width="*" align="center" style="border: 1px solid #959799;">'+get_obj.po_count+'</td>';
  xml += '<td width="*" align="center" style="border: 1px solid #959799;">'+get_obj.list.length+'</td>';
  xml += '<td width="*" align="center" style="border: 1px solid #959799;">$'+total_insu+'</td>';
  xml += '</tr>'
  xml += '</table>'; 
  return xml;
}
function Get_Body_two(get_obj)
{
  var line_item=get_obj.list;
  var xml = '<table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 0.1in;">';
  xml += '<tr>';
  xml += '<td width="6%" align="center">No.</td>';
  xml += '<td width="13%" align="center">PO #</td>';
  xml += '<td width="50%" align="left">Description</td>';
  xml += '<td width="33%" align="center">Insurance Value</td>';
  xml += '</tr>';
  for(var a=0;a<line_item.length;a++)
  {
    if(line_item[a].description && line_item[a].description!="null")
    {
      line_item[a].description= line_item[a].description
    }
    else
    {
      line_item[a].description='';
    }
    xml += '<tr>';
    xml += '<td align="center" style="border: 1px solid #959799;">'+line_item[a].sr_no+'</td>';
    xml += '<td align="center" style="border: 1px solid #959799;">'+line_item[a].po_document+'</td>';
    xml += '<td align="left" style="border: 1px solid #959799;">'+line_item[a].description+'</td>';
    xml += '<td align="center" style="border: 1px solid #959799;">$'+line_item[a].insurence_value+'</td>';
    xml += '</tr>';
  }
  xml += '</table>';
  return xml;
}

function Get_Sorting_SB(get_line_item)
{
  nlapiLogExecution("debug","1");
  var obj_line=[];
  var obj_line_two=[];
  var obj_line_three=[];
  var po_order=[];
  var po_orde_other=[];
  for(var a=0;a<get_line_item.length;a++)
  {
    if(get_line_item[a].sublist_type=='1')
    {
      obj_line.push({
        sr_no:get_line_item[a].sr_no,
        po_document:get_line_item[a].po_document,
        description:get_line_item[a].description,
        insurence_value:get_line_item[a].insurence_value,
        sublist_type:get_line_item[a].sublist_type,
      
      });
    }
    else if(get_line_item[a].sublist_type=='2')
    {
      obj_line_two.push(get_line_item[a]);
      var po_doc=get_line_item[a].po_document;
      po_doc = po_doc.replace("SB-","");
      po_order.push(po_doc);
      po_orde_other.push(po_doc);
    }
    else if(get_line_item[a].sublist_type=='3')
    {
      obj_line_three.push(get_line_item[a]);
    }

  }
  if(po_order.length>0)
  {
    po_order.sort( function(a,b){return a-b} );
    for(var a=0;a<po_order.length;a++)
    {
      var index_number=po_orde_other.indexOf(po_order[a]);
      if(index_number>=0)
      {

        obj_line.push({
          sr_no:obj_line_two[index_number].sr_no,
          po_document:obj_line_two[index_number].po_document,
          description:obj_line_two[index_number].description,
          insurence_value:obj_line_two[index_number].insurence_value,
          sublist_type:obj_line_two[index_number].sublist_type,
         
        });
        po_orde_other.splice(index_number,1);
        obj_line_two.splice(index_number,1);
      }
    }
  }
  for(var a=0;a<obj_line_three.length;a++)
  {
    obj_line.push({
      sr_no:obj_line_three[a].sr_no,
      po_document:obj_line_three[a].po_document,
      description:obj_line_three[a].description,
      insurence_value:obj_line_three[a].insurence_value,
      sublist_type:obj_line_three[a].sublist_type,
     
    });
  }
  nlapiLogExecution("debug","2");
  return obj_line;
}

