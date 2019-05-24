nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/ shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : EmailVendoreVRA_UI.js
 * Created Date  : March 30, 2016
 * Last Modified Date : March 30, 2016
 * Comments : Script will create Button 'Email Vendor VRA' & Send Email to Vendor VRA from NS diaops account ..............
 * Script URL: /app/common/scripting/script.nl?id=845
 * Button URL: /app/site/hosting/scriptlet.nl?script=845&deploy=1
 * Search URL: /app/common/search/searchresults.nl?searchid=3593
 * email from diaops URL: /app/common/entity/employee.nl?id=3128663&whence=
 */

function Email_Vendor_VRA_UI(request,response)
{
	var form = nlapiCreateForm("Email Vendor VRA");
	if(request.getMethod()=="GET")
	{
		try
		{
			//Show User UI Form			
			// var fld = form.addField("custpage_field","file","File");
			// fld.setMandatory(true);
			form.addSubmitButton("Email VRA Notice To All Vendors");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Email Vendor VRA","Details: " + err.message);
			return false;
		}
	}
	else
	{
		try
		{
			//Capture File Information
			nlapiLogExecution("debug","POST Method Invoked", form);
			sendEmailToVendorAfterVRA();
			var formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Email has been send to related vendors.</span></body></html>");
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Email Vendor VRA UI POST Error","Details: " + err.message);
		}
	}
}


function sendEmailToVendorAfterVRA()
{
  try
	{
			if(nlapiGetContext().getRemainingUsage() < 500) 
			{
				var stateMain = nlapiYieldScript();
				if (stateMain.status == 'FAILURE') 
				{
					nlapiLogExecution("Debug","Failed to yield script, exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
					throw "Failed to yield script";
				} 
				else if (stateMain.status == 'RESUME') 
				{
					nlapiLogExecution("Debug","Resuming script because of "+ stateMain.reason + ". Size = "+ stateMain.size);
				}
			}			
			var mySearch = nlapiLoadSearch(null,3593);
			var searchresult = [];
			var resultset = mySearch.runSearch();
			var searchid = 0;
			do {
				var resultslice = resultset.getResults( searchid, searchid+1000 );
				if (resultslice !=null && resultslice !='') 
				{	
					for (var rs in resultslice) 
					{
						searchresult.push(resultslice[rs]);                
						searchid++;
					   
					} 
				}
			} while (resultslice.length >= 1000);			
			var searchCount1=searchresult.length;   
                      nlapiLogExecution("debug"," Length : "+ searchCount1, searchCount1);	   
			if (searchresult && searchCount1>0) 
			{                              
				for( var m = 0; m < searchresult.length; m++) 
				{
					var Results = searchresult[m].getAllColumns();				
					var id= searchresult[m].getId();
					var item= searchresult[m].getValue(Results[0]);
					var date= searchresult[m].getValue(Results[1]);
					var itemFulfil= searchresult[m].getText(Results[2]);
					var itemFulfillId= searchresult[m].getValue(Results[2]);
					var documentNo = searchresult[m].getValue(Results[3]);
					var vendorName= searchresult[m].getText(Results[4]);
					var vendorId= searchresult[m].getValue(Results[4]);
					var memo= searchresult[m].getValue(Results[5]);
					var emailStatus= searchresult[m].getText(Results[6]);
					var emailStatusId= searchresult[m].getValue(Results[6]);                              
					if(emailStatusId=='1')
					{
					   var k=0;               
                       nlapiLogExecution("debug"," Count: "+ m, m);	                   
					   var itemObj=nlapiLoadRecord('itemfulfillment',id)  ;
					   var itemCount=itemObj.getLineItemCount('item');
					   if(itemCount>=1)
					   {                                    
						 var isSend='';
						 isSend= SendMailToVendor(id);
						 if(isSend=='T')
						 {
						   nlapiLogExecution("debug","Message","e-mail has been send to the vendor successfully. IF Id:"+id);						   
						  // nlapiLogExecution("debug","Item Fulfillment field Email VRA Notice to Vendor has been updated with Emailed.");
						 }						 	 
					   }
						else
						{
							nlapiLogExecution("debug","Record not found for  Id:"+id);
							 
						}// end check of itemCount
					}// end check of emailStatusId
				}// end  of loop
			}
	}	 	
	catch(e)
	{
		  nlapiLogExecution('error','exception in searh is', e);
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
		if(baseRecordType=='vendorreturnauthorization'  || isItemfulfilled =='T') // , if Item is fulfilled from Item fulfulment
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
				msgStr =msgStr +"<tr><td colspan='5'>Hi&nbsp;"+vendorContact+",</td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>&nbsp;</td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>We returned the following items today. Tracking No. <b>"+trackingNumber+"</b></td></tr>";
				msgStr =msgStr +"<tr><td colspan='5'>&nbsp;</td></tr>";

				msgStr =msgStr +"<tr>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Item</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Carat</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Shape</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Color</b></td>";
				msgStr =msgStr +"<td width='10%' align='left'><b>Clarity</b></td>";
				msgStr =msgStr +"</tr>";
    
				for(var i=1;i<=itemCount;i++)
				{                 
					var itemId=itemObj.getLineItemValue('item','item',i); 
                                        var itemName=itemObj.getLineItemText('item','item',i); 
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
						msgStr =msgStr +"<td>"+itemName+"</td>"
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
				//nlapiLogExecution("DEBUG","e-mail format: ", msgStr);    
				
				var emailTo=vendorEmailId;			       
				var emailToCc=null;
				if(itemCount>=1 && emailTo!='')
				{
					isEmailSend='T';					
					//var userId=nlapiGetUser();
					var userId='3128663'; // employee id of diaops is '3128663' 
					var userEmail=nlapiLookupField('employee',userId,'email') 
					//nlapiLogExecution("debug","author Email(from) :"+userEmail,userId);		
					
					var msgRecord = nlapiCreateRecord('message');					 
					 msgRecord.setFieldValue('author', userId);
					 msgRecord.setFieldValue('authoremail', userEmail);					
					 msgRecord.setFieldValue('compressattachments', 'F');
					 msgRecord.setFieldValue('emailed', 'T');
					 msgRecord.setFieldValue('entity', '');  
					 msgRecord.setFieldValue('transaction', id);
					 msgRecord.setFieldValue('hasattachment', 'F');
					 msgRecord.setFieldValue('htmlmessage', 'T');
					 msgRecord.setFieldValue('recipient', vendorId);
					 msgRecord.setFieldValue('recipientemail', emailTo);
					 msgRecord.setFieldValue('subject', subject);
					 msgRecord.setFieldValue('message', msgStr );
					 msgRecord.setFieldValue('templatetype', 'EMAIL');
					 msgRecord.setFieldValue('type', 'crmmessage');   
					 var msgRecordId = nlapiSubmitRecord(msgRecord, true, true);
					//nlapiSendEmail(-5,emailTo,subject, msgStr ,emailToCc);	
					nlapiSendEmail(userId,emailTo,subject, msgStr ,emailToCc);					
                    nlapiLogExecution("debug","Message Details","Msg Id: "+msgRecordId+",Email from: "+userEmail+", To: "+emailTo+", IF Id:"+id);
					emailVraNoticeToVendor='2'; //Set Email VRA Notice to Vendor is Emailed
					nlapiSubmitField('itemfulfillment',id,'custbodyemail_vra_notice_to_vendor', emailVraNoticeToVendor);
					nlapiLogExecution("debug","Message","Email VRA Notice To Vendor has been updated with Emailed, Status Id:"+emailVraNoticeToVendor+", IF Id:"+id);
                                    
				}      
			}//end check emailVraNoticeToVendor
		}// end check baseRecordType
	} //end check of vraType
	return isEmailSend;
}