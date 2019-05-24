nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Shiv Pratap Rastogi (sprastogi@inoday.com/shivamupc73@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript
 * Script Name   : syncWorkorderDate.js
 * Created Date  : April 30, 2016
 * Last Modified Date : August 19, 2017
 * Comments : Script will Sync PO's Date Needed In SF with Work Order's End Date which are created from Work Order
 * Unit Test : Done
 * URL: /app/common/scripting/script.nl?id=932
 */
function updateWODate(type)
{

	if(type=='edit'||type=='create')
	{
		try
		{			
			var poId=nlapiGetRecordId();
			var poObj=nlapiLoadRecord('purchaseorder',poId);	
			var poNo=poObj.getFieldValue('tranid');	
			var dateNeededInSF=poObj.getFieldValue('custbody59');
			var createdFrm=poObj.getFieldValue('custbody33');
		    if(createdFrm.indexOf('Work Order')> -1 && dateNeededInSF!=null)			
			{
				
				var woId=poObj.getFieldValue('createdfrom'); // Get Workorder Id                                  
                var woNo=nlapiLookupField('workorder',woId,'tranid');	
				nlapiSubmitField("workorder",woId,'custbody_production_end_date', dateNeededInSF);
				nlapiLogExecution('debug','Workorder#'+woNo+' end date updated w.r.t PO#'+poNo+' sucessfully.',woId);
                nlapiLogExecution('debug','PO#'+poNo+' is created from Work Order.',poId);
				
			}
			else
			{
				nlapiLogExecution('debug','PO#:'+poNo+' is not created from Work Order.',poId);
				
			}
			
			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error on work order date during update:",err.toString());
		  
		}
	} 
}