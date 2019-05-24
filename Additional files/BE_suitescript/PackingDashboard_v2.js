/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Mar 2019     bharath.prakash
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	 var searchArr = [];
     var so_obj = {};
  
  /*var print_link_in = form.addField('custpage_print_inline','inlinehtml','Print Link');
  print_link_in.setDisplayType('hidden');*/
  
	
	if (request.getMethod() === 'GET'){
		
		var form = nlapiCreateForm('Packing Dashboard');
        form.setScript('customscript_packing_dashboard_cs');
		
		var shippingId_fld = form.addField('custpage_shipping_id','text','Shipping ID');
        shippingId_fld.setDisplayType('hidden');
        
        var so_search_fld = form.addField('custpage_so_search_id','text','Search ID');
        so_search_fld.setDisplayType('hidden');
      
      var if_id_fld = form.addField('custpage_itemfulfil_id','text','Item Fulfill ID');
        if_id_fld.setDisplayType('hidden');
      
      
      
      
        
        //var str = "<html><body><a href='www.google.com'>Print</a></body></html>";
       // print_link_in.setDefaultValue(str);
        
    	var sublist = form.addSubList('custpage_packing_sublist','inlineeditor','Sales Orders');
    	var doc_num = sublist.addField('custpage_doc_number','text','Document Number');
    	doc_num.setDisplayType('entry');
    	var doc_status = sublist.addField('custpage_doc_status','text','Document Status');
    	doc_status.setDisplayType('disabled');
    	var cus_fld = sublist.addField('custpage_cus_name','text','Customer');
    	cus_fld.setDisplayType('disabled');
    	var web_bal_fld = sublist.addField('custpage_web_bal','text','Website Balance');
    	web_bal_fld.setDisplayType('disabled');
        var internal_id_hid = sublist.addField('custpage_id_hidden','text','Hidden Id');
        internal_id_hid.setDisplayType('hidden');
       /* sublist.addField('custpage_print_link','url','Print').setDisplayType('disabled').setLinkText('Print');*/
        
         
       //sublist.addField('custpage_print_link', 'url', 'View').setLinkText('View');  
       
       
        
      
    	
    	form.addSubmitButton('Print');
    	response.writePage(form);
		
	}
	else{
       /*
       var str = "<html><head><script>window.open();</script></head></html>"
        var form_one = nlapiCreateForm('PDF');
        var fld = form_one.addField('custpage_html_fld','inlinehtml','Inline');
        fld.setDisplayType('hidden');
       fld.setDefaultValue(str);*/
       
		var body = request.getParameter('custpage_shipping_id');
        var body_2 = request.getParameter('custpage_itemfulfil_id');
        var item_fulfill_ids = JSON.parse(body_2);
        var ship_id = JSON.parse(body);
        var length = ship_id.length;
        var len =item_fulfill_ids.length;
        nlapiLogExecution('debug','ship length',length)
        
     
  var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
     
   xml += "<pdfset>";
     // xml += "<head><script>alert('Hello World');</script></head>"
   
      for(var i=0; i <len; i++)
  	  {
      
  	    var rec = nlapiLoadRecord('itemfulfillment',item_fulfill_ids[i]);
        rec.setFieldValue('custbody_packer',nlapiGetUser());
        var id = nlapiSubmitRecord(rec,true);
  	  
  	 }
  

      
      
       
  	  for(var x=0; x < ship_id.length; x++)
  	  {
        nlapiLogExecution('debug','ship value',ship_id[x]);
  	    var fileUrl = nlapiLoadFile(ship_id[x]).getURL(); 
  	  
      var pdf_fileURL = nlapiEscapeXML(fileUrl);
      xml += "<pdf src='"+ pdf_fileURL +"'/>";
  	  
  	 }
       
       xml += "</pdfset>";
      nlapiLogExecution('debug','XML Val',xml);
      var pdf = nlapiXMLToPDF(xml);
  	   //response.renderPDF(xml)
  	 /*
      pdf.setFolder(12922287);
      pdf.setIsOnline(true);
     var id = nlapiSubmitFile(pdf);
      var pdf_file = nlapiLoadFile(id);
      var pdf_url = pdf_file.getURL();*/
      
      /*if (pdf_url){
        print_link_in.setDefaultValue("<html><script>window.open("+pdf_url+",'_blank');</script></html>");
      }
      response.writePage(form);*/
      
  	  response.setContentType("PDF","PackingDash.pdf",'inline');
      
  	  response.write(pdf.getValue());
     // response.writePage(form_one);
     
    // response.writePage(html);  
	}

}
