function Get_Pdf_Packing_Shiping_File(get_file)
{
  var folder_id='8533934';
  try
  {
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
    xml += "<pdfset>";
    for(var s=0;s<get_file.length;s++)
    {
      try
      {
        var fileURL = nlapiLoadFile(get_file[s]).getURL();
        xml += "<pdf src='"+ nlapiEscapeXML(fileURL) +"'/>";
      }
      catch(er){}
    }
    xml += "</pdfset>";
    var file = nlapiXMLToPDF(xml);
    var timestamp = new Date().getUTCMilliseconds();
    file.name=timestamp+'.pdf';
    file.setFolder(folder_id); //Return Shipping Labels
    var fileID = nlapiSubmitFile(file);
    var fileURL_main = nlapiLoadFile(fileID).getURL(); 
    return fileURL_main;
  }
  catch(er)
  {
    return false;
  }
}


function Get_Pdf_File(get_id)
{
  var file_id_obj=[];
  var record_type='PICKINGTICKET';
  var folder_id='8533934';
  try
  {
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
    xml += "<pdfset>";
    for(var s=0;s<get_id.length;s++)
    {
      try
      {
        var pdfFile = nlapiPrintRecord(record_type, get_id[s],'PDF');
        pdfFile.setFolder(folder_id);
        pdfFile.setIsOnline(true);
        pdfFile.setName(get_id[s]+'.pdf');		
        var fileID = nlapiSubmitFile(pdfFile);
        file_id_obj.push(fileID);
        var fileURL = nlapiLoadFile(fileID).getURL();
        xml += "<pdf src='"+ nlapiEscapeXML(fileURL) +"'/>";
      }
      catch(er){}
    }
    xml += "</pdfset>";
    var file = nlapiXMLToPDF(xml);
    var timestamp = new Date().getUTCMilliseconds();
    file.name=timestamp+'.pdf';
    file.setFolder(folder_id); //Return Shipping Labels
    var fileID = nlapiSubmitFile(file);
    var fileURL_main = nlapiLoadFile(fileID).getURL(); 
    for(var s=0;s<file_id_obj.length;s++)
    {
      try{nlapiDeleteFile(file_id_obj[s]);}catch(er){}
    }
    return fileURL_main;
  }
  catch(er)
  {
    return false;
  }
}