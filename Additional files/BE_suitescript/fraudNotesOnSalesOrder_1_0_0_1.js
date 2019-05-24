nlapiLogExecution("audit","FLOStart",new Date().getTime());
function GetFraud_Notes_OnSalesOrder(type)
{
	if(type=="create")
	{
		try
		{
                    var custDepositObj = nlapiLoadRecord('customerdeposit',nlapiGetRecordId()); 
		    var soId = nlapiLookupField("customerdeposit",nlapiGetRecordId(),"salesorder"); 
            	    if(soId != "" && soId != null){
			var soFraudNotes=nlapiLookupField("salesorder",soId,"custbody148");
			var BillTo= nlapiLookupField("salesorder",soId,"billaddress");
                      nlapiLogExecution('debug','Bill To',BillTo);
			var ShipTo= nlapiLookupField("salesorder",soId,"shipaddress");
                      nlapiLogExecution('debug','Ship To',ShipTo);
			var paymentMethod=custDepositObj.getFieldValue('paymentmethod');
                        var type=custDepositObj.getFieldValue('type');			         
          /* Restricted Payment Methods:- 3='Bank Wire',4='Cash',5='Check',10='Money Order',15='GE Money Financing',19='Paypal',21='Wells Fargo Jewelry Advantage',22='Visa Checkout' */
            if(paymentMethod !='3' && paymentMethod !='4' && paymentMethod !='5' && paymentMethod !='10' && paymentMethod !='15' &&  paymentMethod !='19' && paymentMethod !='21'  && paymentMethod !='22')	
			{
				//Comparing of the address .............................................................
				var addsMatch='';
				var avsStreetMatch='',avsZipMatch='', fraudNoteStr='';
				var avsStreet ='',avsZip='',amount='';
				 
				if(BillTo != null && BillTo != '' && ShipTo != null && ShipTo != '')
				{
					var addressIndex1= BillTo.localeCompare(ShipTo);
					 nlapiLogExecution('debug','addressIndex is',addressIndex1);
					if(addressIndex1 == '0')
					{
					  addsMatch= 'same b/s';
					}
					else
					{
					  addsMatch= 'diff b/s'; 	 
					}
				} 
				var count=custDepositObj.getLineItemCount('paymentevent');
				for(var i=1;i<=count;i++) 
				{
					amount = custDepositObj.getLineItemValue('paymentevent','amount',i);
					avsStreet = custDepositObj.getLineItemValue('paymentevent','avsstreet',i);
					avsZip= custDepositObj.getLineItemValue('paymentevent','avszip',i);
					if(avsStreet != null && avsStreet != '')
					{
					  avsStreetMatch= "AVS Street Match ="+avsStreet ;
					}
							
					//Getting the AVS information from the Saved Search .............................................     
					if(avsZip!= null && avsZip!= '')
					{
					  avsZipMatch= "AVS Zip Match ="+avsZip;
					}
					if(avsStreetMatch != '')
					{
						if(fraudNoteStr== '') 
						{
						  fraudNoteStr= avsStreetMatch;
						}
						else 
						{
						 fraudNoteStr= fraudNoteStr+','+avsStreetMatch;
						}        
					}
					if(avsZipMatch!= '')
					{							
						if(fraudNoteStr== '')
						fraudNoteStr= avsZipMatch;
						else
						fraudNoteStr= fraudNoteStr+','+avsZipMatch;
					}
					if(addsMatch != '' && (avsZipMatch != '' || avsStreetMatch != ''))
					{
						if(fraudNoteStr== '')
						{
						  fraudNoteStr= addsMatch;
						}
						else
						{
						 fraudNoteStr= fraudNoteStr+'\n'+addsMatch;		
						}					
					}
					else if(addsMatch != '' && (avsZipMatch == '' && avsStreetMatch == ''))
					{				   
						if(paymentMethod != null && paymentMethod != '20' && paymentMethod != '19')
						{
						  fraudNoteStr= "-Please manually check AVS info in Cybersource, there is a possible AVS mismatch-";
						}
						fraudNoteStr= fraudNoteStr+'\n'+addsMatch;
					   }
					nlapiLogExecution("DEBUG","fraudNoteStr1: "+ fraudNoteStr); 
				
					if((soFraudNotes != null && soFraudNotes != '') && soFraudNotes!=fraudNoteStr)
					{
					   soFraudNotes = soFraudNotes +'\n'+fraudNoteStr;
					}
					else
					{
					   soFraudNotes =fraudNoteStr;
					}	
				}//for loop end	
				try
				{				 
					nlapiSubmitField("salesorder",soId,"custbody148", soFraudNotes);
					nlapiLogExecution('debug','Sales Order Fraud Notes field updated.');			   
				}
				catch(e)
				{
				nlapiLogExecution('error','Error on Fraud Notes during Sales Order update:', e.toString());
				}
            } // end check of paymentMethod         
         }//end condition of soId    
			
        }
        catch(err)
        {
          nlapiLogExecution("error","Error on Fraud Notes during Sales Order :",err.toString());
        }
     }
 }