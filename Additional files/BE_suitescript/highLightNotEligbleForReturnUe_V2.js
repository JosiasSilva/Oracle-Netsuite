nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setNotEligbleForReturn(type,form)
{
	try
	{		
		if(type=='edit' || type=='create' )
		{
			//Added by ajay 10April 2017
			var context = nlapiGetContext();
			var contextType = context.getExecutionContext();
			if(contextType!="userinterface" && contextType!="userevent")
			{
				nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
				return true;
			}
			//Ended by ajay 10April 2017
			
			var soId=nlapiGetRecordId();
			//var soObj=nlapiLoadRecord('salesorder',soId);
			//var orderType=soObj.getFieldValue('custbody87');
			var arr=new Array();
			arr=getNotEligbleItem(soId);
			nlapiLogExecution("debug","Not Eligble For Return Items length:"+arr.length,soId);	
			if(arr.length>0)
			{
			   nlapiSubmitField("salesorder",soId,"custbodynot_eligible_for_return_list",arr); 	
			   nlapiLogExecution("debug","Not Eligble For Return Items Set Successfully",soId);
			}
			else
			{				
			   nlapiSubmitField("salesorder",soId,"custbodynot_eligible_for_return_list",arr); 	
			   nlapiLogExecution("debug","Not Eligble For Return Items Set Empty",soId);	
			}					
		}// end check of  Type
	}
	catch(err)
	{
			nlapiLogExecution("debug","Error on Not Eligble For Return Item","Details: " + err.message);
			
	}
}
function getNotEligbleItem(soId)
{				
			var soObj=nlapiLoadRecord('salesorder',soId);
			var orderType=soObj.getFieldValue('custbody87');
			var finalSale=soObj.getFieldValue('custbodyfinal_sale');
			//nlapiLogExecution("debug","orderType",orderType);
			var neiArr=new Array();
			if(orderType=='4') // for Exchange
			{
				neiArr.push('1'); //set Exchange if user opted order Type='Exchange';				
			}
			if(finalSale=='1')
			{
			 neiArr.push('4'); // set Manual if user opted final sale='yes'
			}
			var itemCount=soObj.getLineItemCount('item');
			for(var i=1;i<=itemCount;i++)
			{
				var itemId = soObj.getLineItemValue('item','item',i); 
				var itemType = soObj.getLineItemValue('item','itemtype',i);
				if(itemType == "Service" || itemType =='OthCharge')
				{
					  if(itemType=='Service' && itemId=='782')
					  {
							var itemArr = ["custitem20"];        
							var itemArrVal= nlapiLookupField('serviceitem',itemId,itemArr);
							var itemName=itemArrVal.itemid;
							var itemCategory=itemArrVal.custitem20;
							if(itemCategory=='12')
							{
							  returnEligble=true;							
							  neiArr.push('2'); // set Modifications,
							}
					  }
					  else if(itemType=='OthCharge' && itemId=='2158514')
					  {
							var itemObj=nlapiLoadRecord('otherchargeitem',itemId);
							var itemArr = ["custitem20"];        
							var itemArrVal= nlapiLookupField('otherchargeitem',itemId,itemArr);
							var itemName=itemArrVal.itemid;
							var itemCategory=itemArrVal.custitem20;
							if(itemCategory=='12')
							{
							   returnEligble=true;							 
							   neiArr.push('3'); //set Mid Production Change,
							}
					  }       
					var k=0;
				}  // end check of  itemType
				/*******************************Star Added By Yagya Kumar 25th April 2017 for NS-670 ****************************/
				else if(itemId=='39300')
				{
						neiArr.push('5'); // set Engraving
				}
				/*******************************End Added By Yagya Kumar 10th April 2017 for NS-670 ****************************/
			}//end of loop
			
			
		return neiArr;
	
}

function highlightNotEligibleForReturn(type,form)
{
       try
       {
            if(type == "view" || type == "edit")
            {
				//Added by ajay 10April 2017
				var context = nlapiGetContext();
				var contextType = context.getExecutionContext();
				if(contextType!="userinterface" && contextType!="userevent")
				{
					nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
					return true;
				}
				//Ended by ajay 10April 2017
				
				var soId=nlapiGetRecordId(); // '7012921';
				var arr=new Array();
				arr=getNotEligbleItem(soId);
				if(arr.length>0)
				{
					   //nlapiDisableField('custbodynot_eligible_for_return_list', false);
					
                        var fieldAddingHighLight = form.addField("custpage_not_eligible_for_return", "inlinehtml", "Not Eligible For Return");	
						var fieldAddingHighLightValue = "<script type='text/javascript'>";
						fieldAddingHighLightValue += 'var node = document.getElementById("custbodynot_eligible_for_return_list_lbl_uir_label");';						
						fieldAddingHighLightValue += 'node.parentNode.style.background="cyan";';
						fieldAddingHighLightValue += "</script>";
						fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);						
						nlapiLogExecution("debug","Not Eligble For Return Items Highlight Successfully",soId);
				}
				else
				{
						var fieldAddingHighLight = form.addField("custpage_not_eligible_for_return1", "inlinehtml", "Not Eligible For Return");	
						var fieldAddingHighLightValue = "<script type='text/javascript'>";
						fieldAddingHighLightValue += 'var node = document.getElementById("custbodynot_eligible_for_return_list_lbl_uir_label");';
						fieldAddingHighLightValue += 'node.parentNode.parentNode.style.visibility="hidden";';
						fieldAddingHighLightValue += "</script>";
						fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
						nlapiLogExecution("debug","Not Eligble For Return visibility set hidden",soId);
				}

            }
       }
       catch(err)
       {
			nlapiLogExecution("debug","Error on Highlight Not Eligble For Return Item" , err.message);
       }
}
