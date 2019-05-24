function Diamond_Receive_DB_Label_Print(request,response)
{
	var fileId = request.getParameter("fileid");
	
	var fileObj = nlapiLoadRecord("customrecord_zpl_label_holder",fileId);
	
	response.setContentType("PLAINTEXT",fileObj.getFieldValue("custrecord_zpl_filename"),"attachment");
	response.write(fileObj.getFieldValue("custrecord_zpl_data"));
	
	nlapiDeleteRecord("customrecord_zpl_label_holder",fileId);
}
