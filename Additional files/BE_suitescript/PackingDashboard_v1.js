/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/search','N/file','N/render'],
/**
 * @param {serverWidget} serverWidget
 */
function(serverWidget,search,file,render) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	var response = context.response;
        var request = context.request;
        var searchArr = [];
        var so_obj = {};
    	var form = serverWidget.createForm({title:'Packing Dashboard'});
        form.clientScriptFileId = 30193606;
      /* var packingDashSearch = search.load({id:'customsearch_packing_db_readytoship_2'});
      var searchResults = packingDashSearch.run().getRange({start:0,end:33});
      for (var i = 0 ; i< searchResults.length;i++){
        so_obj.doc_number = searchResults[i].getValue({name:'tranid'});
        //so_obj.doc_status_1 = searchResults.getText({name:'status'});
        so_obj.customer = searchResults[i].getText({name:'entity'});
        so_obj.websiteBalance = searchResults[i].getValue({name:'custbody_website_truebalance_amt'});
        searchArr.push(so_obj);
      }*/
      
      log.debug("Search Results",JSON.stringify(searchArr));
      
       if (request.method ==='GET')	{
        var shippingId_fld = form.addField({id:'custpage_shipping_id',type:serverWidget.FieldType.LONGTEXT, label:'Shipping ID'});
        shippingId_fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.NORMAL});
    	var sublist = form.addSublist({id:'custpage_packing_sublist',type:serverWidget.SublistType.INLINEEDITOR,label:'Sales Orders'});
    	var doc_num = sublist.addField({id:'custpage_doc_number',type:serverWidget.FieldType.TEXT,label:'Document Number'});
    	doc_num.updateDisplayType({displayType:serverWidget.FieldDisplayType.ENTRY});
    	var doc_status = sublist.addField({id:'custpage_doc_status',type:serverWidget.FieldType.TEXT,label:'Document Status'});
    	doc_status.updateDisplayType({displayType:serverWidget.FieldDisplayType.DISABLED});
    	var cus_fld = sublist.addField({id:'custpage_cus_name',type:serverWidget.FieldType.TEXT,label:'Customer'});
    	cus_fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.DISABLED});
    	var web_bal_fld = sublist.addField({id:'custpage_web_bal',type:serverWidget.FieldType.TEXT,label:'Website Balance'});
    	web_bal_fld.updateDisplayType({displayType:serverWidget.FieldDisplayType.DISABLED});
        var internal_id_hid = sublist.addField({id:'custpage_id_hidden',type:serverWidget.FieldType.TEXT,label:'Hidden Id'});
        internal_id_hid.updateDisplayType({displayType:serverWidget.FieldDisplayType.HIDDEN});
    	//sublist.addMarkAllButtons();
    	//form.addButton({id:'custpage_print_button',label:'Print',functionName:'printQueue()'});
    	form.addSubmitButton({label:'Print'});
    	response.writePage(form);
       }
      
      else {
        var body = request.parameters.custpage_shipping_id;
        var ship_id = JSON.parse(body);
       var myFile = render.create();

 
        
       /* var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
	xml += "<pdf>\n<body font-size=\"12\">\n<h3>Purchase Order Items with Barcode</h3>\n";
	xml += "<p></p>";
	xml += "</body>\n</pdf>";*/

              
 for(var x=0; x < ship_id.length; x++)
  {
    var fileObj = file.load({id:ship_id[x]});
    var fileUrl = fileObj.url;
    fileUrl=fileUrl.replace(/&/g,"&amp;");
    myFile.templateContent = fileObj.getContents();
    //var invoicePdf = myFile.renderAsPdf();
     var invoicePdf = myFile.renderPdfToResponse({
 response: response
});
    //response.write(invoicePdf);
  
      }

    }
    }

    return {
        onRequest: onRequest
    };
    
});
