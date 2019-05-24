/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Mar 2019     bharath.prakash
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	try{
	var body = request.getBody();
	var if_id = JSON.parse(body);
    nlapiLogExecution('debug',"Item Fulfillemt ID",if_id[0]);
    var rec = nlapiLoadRecord('itemfulfillment',if_id[0]);
    var shippingLabel = rec.getFieldValue('custbody_fedex_shipping_label');
    nlapiLogExecution('debug',"Shipping Label",shippingLabel);

      //Write file back to user so they can open and print
     // response.setContentType("HTML",shippingLabel+".pdf","inline");
     // response.write(downloadfile.getValue());
   
	 
	 /* for(var x=0; x < if_id.length; x++)
	  {
	  var rec = nlapiLoadRecord('itemfulfillment',if_id[x]);
      var shippingLabel = rec.getFieldValue('custbody_fedex_shipping_label');
      nlapiLogExecution('debug',"Shipping Label",shippingLabel);
	  //var fileObj = nlapiLoadFile(shippingLabel);
      //response.write(fileObj.getValue());
      //
      var downloadfile = nlapiLoadFile(shippingLabel);
      
      
      //Write file back to user so they can open and print
      response.setContentType("PDF",shippingLabel+".pdf","attachment");
      response.write(downloadfile.getValue());
	  }*/
      var fileObj = nlapiLoadFile(shippingLabel);
      var pdf_fileURL = fileObj.getURL();
      pdf_fileURL=pdf_fileURL.replace(/&/g,"&amp;")
      nlapiLogExecution('debug',"pdf_fileURL",pdf_fileURL);
      /* var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
  xml += "<pdfset>";
  xml += "<pdf src='"+ pdf_fileURL +"'/>";
  xml += "</pdfset>";*/

    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += "<pdf>\n<body font-size=\"12\">\n<h3>Purchase Order Items with Barcode</h3>\n";
	xml += "<p></p>";
	xml += "</body>\n</pdf>";

      
  var filePDF = nlapiXMLToPDF(xml); 
  response.renderPDF(xml); 


    }
      catch(e){
        nlapiLogExecution('debug',"Error in PDF generation is",e.message);
      }

}
