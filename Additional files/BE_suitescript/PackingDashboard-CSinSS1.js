/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Mar 2019     bharath.prakash
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
  var searchArr = [];
  
  var packingDashSearch = nlapiLoadSearch(null,'customsearch_packing_db_readytoship');
 //var packingDashSearch = nlapiLoadSearch(null,'customsearch_packing_db_readytoship_2');  
  var searchResults = packingDashSearch.runSearch();
  console.log(searchResults);
 // if (searchResults){
  var length = getResultsLength(searchResults);
  //}
  //alert(length);
  var searchResult = searchResults.getResults(0,length);
  //console.log("searchResult:" + searchResult.length);
  
  //console.log(JSON.stringify(searchResult));
  
  
  
  for (var i = 0 ; i< searchResult.length;i++){
    
    var cols = searchResult[i].getAllColumns();
    var so_obj = {};
    so_obj.doc_number = searchResult[i].getValue(cols[2]);
    so_obj.doc_status_1 = searchResult[i].getText('statusref');
    so_obj.customer = searchResult[i].getText(cols[3]);
    so_obj.websiteBalance = searchResult[i].getValue(cols[4]);
    so_obj.internalid = searchResult[i].getValue('internalid');
    searchArr.push(so_obj);
    
  }
  
  
	//console.log("Search Array is"+ JSON.stringify(searchArr));
  
  nlapiSetFieldValue('custpage_so_search_id',JSON.stringify(searchArr));
  
  
   
}

function getResultsLength(results)

{
      
        var length = 0;
        var count = 0, pageSize = 100;
        var currentIndex = 0;
        do{
                count = results.getResults(currentIndex, currentIndex + pageSize).length;
                currentIndex += pageSize;
                length += count;

        }

        while(count == pageSize);
        return length;
      

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Boolean} True to continue changing field value, false to abort value change
 */
function clientValidateField(type, name, linenum){
   
    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
 
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function clientPostSourcing(type, name) {
   
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type){
	
	var tempShip = nlapiGetFieldValue('custpage_shipping_id');
    var tempIf = nlapiGetFieldValue('custpage_itemfulfil_id');
  
     if (tempIf){
    var tempIfId = JSON.parse(tempIf);
    }
  
    if (tempShip){
    var tempShipId = JSON.parse(tempShip);
    }
   var shipping_ID = [];
   var item_fulfill_id = [];
  
  if (tempIfId){
      for (var m=0;k<tempShipId.length;m++){
       item_fulfill_id.push(tempIfId[m]); 
      }
  }
  
  if (tempShipId){
      for (var k=0;k<tempShipId.length;k++){
       shipping_ID.push(tempShipId[k]); 
      }
     
    }
   console.log(shipping_ID);
   var searchArr = [];
  var tempVal = nlapiGetFieldValue('custpage_so_search_id');
  searchArr = JSON.parse(tempVal);
 // console.log(JSON.stringify(searchArr));
	
   
   var itemFulfillSearch = nlapiLoadSearch(null,'customsearch10630');
  
   
  
  
  
	
	if (type == 'custpage_packing_sublist'){
      
		
			var docNumber = nlapiGetCurrentLineItemValue('custpage_packing_sublist','custpage_doc_number');
         
		
		//alert(docNumber);
		if (docNumber){
         // alert("I should be here")
			for (var j=0; j< searchArr.length;j++){
            
			var so_obj_check = searchArr[j];
           // console.log(so_obj_check);
			if ( docNumber == so_obj_check.doc_number){
			//alert("I should be here too")
				
				var cus = so_obj_check.customer;
               
				nlapiSetCurrentLineItemValue('custpage_packing_sublist','custpage_cus_name',cus,false,true);
               
                 var web = so_obj_check.websiteBalance
                
				nlapiSetCurrentLineItemValue('custpage_packing_sublist','custpage_web_bal',web,false,true);
              
                 var Id_int = so_obj_check.internalid
                // alert(Id_int);
				nlapiSetCurrentLineItemValue('custpage_packing_sublist','custpage_id_hidden',Id_int,false,true);
              
               var status = so_obj_check.doc_status_1
                nlapiSetCurrentLineItemValue('custpage_packing_sublist','custpage_doc_status',status,false,true);
              
              
              
           itemFulfillSearch.addFilter(new nlobjSearchFilter('createdfrom',null,'anyof',Id_int));   
            var itemFulfilResults =  itemFulfillSearch.runSearch();
            var itemFulfillResult = itemFulfilResults.getResults(0,1); 
              if(itemFulfillResult != null){
             shipping_ID.push(itemFulfillResult[0].getValue('custbody_fedex_shipping_label'));
             item_fulfill_id.push(itemFulfillResult[0].getValue('internalid'));
              }
             console.log(shipping_ID);
              nlapiSetFieldValue('custpage_shipping_id',JSON.stringify(shipping_ID));
              nlapiSetFieldValue('custpage_itemfulfil_id',JSON.stringify(item_fulfill_id));
              
            
              return true;
			}
			
			else{
				
			continue;
			//alert("Sales Order not ready to ship today");
			
				
			}
			}
          
		}
		
		
		
	}
      /*else{	
              alert("Sales Order not ready to ship today"); 
              return false;
            }*/
  
 alert("Sales Order not ready to ship today");
 return false;
    
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item insert, false to abort insert
 */
function clientValidateInsert(type){
  
    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item delete, false to abort delete
 */
function clientValidateDelete(type){
   
    return true;
}
