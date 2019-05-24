nlapiLogExecution("audit","FLOStart",new Date().getTime());
function sendEmailToVendorAfterVRA()
{
  try
  {   
    var duplicateId = 0;
    var currentDateTime = new Date(); // current date
    var presentDate = nlapiDateToString(nlapiAddDays(currentDateTime,-1));
    //Filter Logics
	var filters = new Array();            
        filters[0] = new nlobjSearchFilter('trandate', null,'on', presentDate);
	        
	var columns = new Array(); // new array for columns of the search
	columns[0] = new nlobjSearchColumn('internalid');					 
     var SavedSearch = nlapiSearchRecord('itemfulfillment', null, filters, columns);
     if(SavedSearch != null)
     {
       for(var i=0; i<SavedSearch.length; i++)
       {
          var id = SavedSearch[i].id;
          if(duplicateId != id)
          {
             duplicateId = id;
             var isSend='';
             isSend= SendMailToVendor(id);
             if(isSend=='T')
             {
               nlapiLogExecution("debug","Mail has been successfully sent to the vendor");
               //nlapiSubmitField("itemfulfillment",id,"custbodyemail_vra_notice_to_vendor",2);
               nlapiLogExecution("debug","Item Fulfillment field Email VRA Notice to Vendor has been updated with Emailed.");
             }
			 else
			 {
				nlapiLogExecution("debug","Email Mail could not send to the vendor for Item FF Id:"+id);
				 
			 }	 
          }
       }
     }
  }
  catch(err)
  {
     nlapiLogExecution("error","Error occur during sending mail to vendor is :",err.message);
  }
}

function SendMailToVendor(id)
{
	var isEmailSend='F';
	var today = new Date(); 
	var dd = today.getDate(); 
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear(); 
	if(dd<10){dd='0'+dd} 
	if(mm<10){mm='0'+mm} 
	var todaysDate=mm+'/'+dd+'/'+yyyy ;

	var itemObj=nlapiLoadRecord('itemfulfillment',id)  
	var itemStatus=itemObj.getFieldValue('status')
	var isItemfulfilled =itemObj.getFieldValue('isfulfillmentedit')

	var vendorId=itemObj.getFieldValue('companyid'); 
	var vrAuthId=itemObj.getFieldValue('createdfrom'); //get vraId after submit
	var vraType = nlapiLookupField("itemfulfillment",id,"createdfrom",true);  

    if(vraType.indexOf("Vendor Return Authorization") != -1)  // Accept only VRA
    {
		var vrObj=nlapiLoadRecord('vendorreturnauthorization',vrAuthId);  
		var vendor = nlapiLookupField("vendorreturnauthorization",vrAuthId,"entity");    
		var baseRecordType=vrObj.getFieldValue('baserecordtype');    
		if(baseRecordType=='vendorreturnauthorization' && isItemfulfilled =='T') // if Item is fulfilled from Item fulfulment
		{
              
			var vendObj=nlapiLoadRecord('vendor',vendorId);   
			if(vendorId=='' || vendorId==null)
			{
			vendorId =itemObj.getFieldValue('entity')
			} 
			var vendorName=nlapiLookupField('vendor',vendorId,'entityid');
			var vendorCompName=nlapiLookupField('vendor',vendorId,'companyname')
			var vendorContact=nlapiLookupField('vendor',vendorId,'custentity70');
			var vendorEmailId=nlapiLookupField('vendor',vendorId,'email');   
			var subject = vendorName +" Return today "+todaysDate;    
			var trackingNumber=nlapiLookupField('itemfulfillment',id,'custbodytracking_number_vc');
			var emailVraNoticeToVendor=nlapiLookupField('itemfulfillment',id,'custbodyemail_vra_notice_to_vendor');
			if(emailVraNoticeToVendor =="1") // check for Email VRA Notice to Vendor is 'To Be Emailed' on Item fulfillment
			{
				var itemCount=itemObj.getLineItemCount('item');
				var VendorStockNo='', ItemCarat='', ItemShape='', ItemColor='', ItemClarity='';
				msgStr ="<table border='0' align='left' width='100%' cellpadding='0' cellspacing='0'>";
				msgStr =msgStr +"<tr>";
				msgStr =msgStr +"<td width='1%'></td>";
				msgStr =msgStr +"<td width='98%'>";

				msgStr =msgStr +"<table border='0' align='left' width='50%'>";
				msgStr =msgStr +"<tr><td colspan='5'>&nbsp;</td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>Hi&nbsp;<b>"+vendorName+"</b>,</td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>&nbsp;</td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>We returned the following items today. Tracking No. <b>"+trackingNumber+"</b></td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>&nbsp;</td></tr>";

				msgStr =msgStr +"<tr>";
				// msgStr =msgStr +"<td width='10%' align='left'><b>Stock Number</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Carat</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Shape</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Color</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Clarity</b></td>";
				msgStr =msgStr +"</tr>";
    
				for(var i=1;i<=itemCount;i++)
				{                 
					var itemId=itemObj.getLineItemValue('item','item',i); 
					var itemType=itemObj.getLineItemValue('item','itemtype',i);
					//nlapiLogExecution("debug", "Inv. Item Id: " + itemId + ',Event Type :  ' + itemType);
					if(itemType=='InvtPart')
					{            
						var invItemObj=nlapiLoadRecord('inventoryitem',itemId);                 
						ItemShape=invItemObj.getFieldText('custitem5');   // toget dropdown selected text name
						ItemColor=invItemObj.getFieldText('custitem7');  
						ItemClarity=invItemObj.getFieldText('custitem19'); 
						ItemCarat=invItemObj.getFieldValue('custitem27');    
						var vendorname=invItemObj.getFieldValue('vendorname');
                       
						msgStr =msgStr +"<tr>";
						// msgStr =msgStr +"<td>-</td>"
						msgStr =msgStr +"<td align='left'>"+ItemCarat+"</td>"
						msgStr =msgStr +"<td align='left'>"+ItemShape+"</td>"
						msgStr =msgStr +"<td align='left'>"+ItemColor+"</td>"
						msgStr =msgStr +"<td align='left'>"+ItemClarity+"</td>"
						msgStr =msgStr +"</tr>"              
            
					}
				}// end of for loop
				msgStr =msgStr +"</table>"
				msgStr =msgStr +"</td>"
				msgStr =msgStr +"<td width='1%'></td>"
				msgStr =msgStr +"</tr>"
				msgStr =msgStr +"</table>"      
				nlapiLogExecution('DEBUG', msgStr);       
				var body = msgStr ;  
				//var emailTo=vendorEmailId;
				var emailTo='aaguilar@brilliantearth.com';				
				var emailToCc='sprastogi@inoday.com';
				if(itemCount>=1 && emailTo!='')
				{
					isEmailSend='T';
					nlapiSendEmail(-5,emailTo,subject, body,emailToCc);
					emailVraNoticeToVendor='2'; //Set Email VRA Notice to Vendor is Emailed
					nlapiSubmitField('itemfulfillment',id,'custbodyemail_vra_notice_to_vendor', emailVraNoticeToVendor);
				}      
			}//end check emailVraNoticeToVendor
		}// end check baseRecordType
	} //end check of vraType
	return isEmailSend;
}