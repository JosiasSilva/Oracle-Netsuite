/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/render','N/search'],
/**
 * @param {record} record
 * @param {render} render
 */
function(record, render,search) {
   
    /**
     * Function called upon sending a GET request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.1
     */
    function doGet(requestParams) {

    }

    /**
     * Function called upon sending a PUT request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPut(requestBody) {

    }


    /**
     * Function called upon sending a POST request to the RESTlet.
     *
     * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
     * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doPost(requestBody) {
        var tranid;
    	var reqBody = JSON.parse(requestBody);
    	var recordtype=reqBody.recordtype;
    	  var recordId=parseInt(reqBody.recordId);
          //log.debug("record ID",recordId);
          //log.debug("record Type",recordtype);
    	  var template=parseInt(reqBody.templateId);
    	  var transactionOrEntity=reqBody.transactionOrEntity;
          log.debug("Transaction or Entity",transactionOrEntity)
    	  var getrecord = record.load({type:recordtype,id:recordId})
    	  
    	  var emailTemp = record.load({type:record.Type.EMAIL_TEMPLATE,id:template});
    	  var  subject = emailTemp.getValue({fieldId: 'subject'});
    	  var  body = emailTemp.getValue({fieldId: 'content'});
    	  
    	  var renderer = render.create();
    	  if(transactionOrEntity=="transaction")
    	  {
    	    renderer.addRecord({templateName:'customer',record:record.load({type:record.Type.CUSTOMER,id:getrecord.getValue({fieldId:'entity'})})}); // Change by Bharath (03/21/2019) - property "template" to 'templateName'
            renderer.addRecord({templateName:'transaction',record:record.load({type:record.Type.SALES_ORDER,id:recordId})});
            
    	    if(template=='368' && recordtype=='salesorder')
    	      {
    	       
    	        renderer.addRecord({templateName:'transaction',record:record.load({type:record.Type.SALES_ORDER,id:recordId})}); // Change by Bharath (03/21/2019) - property "template" to 'templateName'
    	      }
    	  }
    	  else
    	  {
    	    log.debug("I am in customer else");
    	    renderer.addRecord({templateName:'customer',record:record.load({type:record.Type.CUSTOMER,id:recordId})});// Change by Bharath (03/21/2019) - property "template" to 'templateName'
            var salesorderSearchObj = search.create({
   type: "salesorder",
   filters:
   [
      ["name","anyof",recordId], 
      "AND", 
      ["type","anyof","SalesOrd"], 
      "AND", 
      ["mainline","is","T"]
   ],
   columns:
   [
      search.createColumn({name: "internalid", label: "Internal ID"})
   ]
});

salesorderSearchObj.run().each(function(result){
   tranid = result.getValue({name:'internalid'});
   
});
   if(tranid){         renderer.addRecord({templateName:'transaction',record:record.load({type:record.Type.SALES_ORDER,id:tranid})});
             }
            
    	    if(template=='368' && recordtype=='salesorder')
    	      {
    	        
    	        renderer.addRecord({templateName:'transaction',record:record.load({type:record.Type.SALES_ORDER,id:recordId})});// Change by Bharath (03/21/2019) - property "template" to 'templateName'
    	      }
    	  }
    	  
    	  renderer.templateContent = subject
    	  var renderSubj = renderer.renderAsString();
    	  renderer.templateContent = body
    	  var renderedbody = renderer.renderAsString();
    	  var obj_rendered={};
    	  obj_rendered['subject']=renderSubj;
    	  obj_rendered['body']=renderedbody;
          log.debug("Rendered Obj",JSON.stringify(obj_rendered));
    	  return JSON.stringify(obj_rendered);
    	

    }

    /**
     * Function called upon sending a DELETE request to the RESTlet.
     *
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
     * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
     * @since 2015.2
     */
    function doDelete(requestParams) {

    }

    return {
        'get': doGet,
       
        'post': doPost
        
    };
    
});