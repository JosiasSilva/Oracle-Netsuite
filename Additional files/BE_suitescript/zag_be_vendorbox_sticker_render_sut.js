/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Aug 2018     satya
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function vendorbox_sticker_renderer(request,response)
{
	var fileId = request.getParameter("recId");
	
	var fileObj = nlapiLoadRecord("customrecord_zpl_label_holder",fileId);
	
	response.setContentType("PLAINTEXT",fileObj.getFieldValue("custrecord_zpl_filename"),"attachment");
	response.write(fileObj.getFieldValue("custrecord_zpl_data"));
	
	nlapiDeleteRecord("customrecord_zpl_label_holder",fileId);
}

