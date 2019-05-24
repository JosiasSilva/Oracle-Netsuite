//URL :- https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=923 
function getTrueBalAdjustment(type,name)
{
	var tflag=0;
	
	try
		{  
		
			//if(name=='custbody_truebalanceadjustment' && tflag==0)
			if(name=='custbody_website_truebalance_adj_amt' && tflag==0)
			{
				 var soId= nlapiGetRecordId();
				// alert("Hello soId :" +soId);
				 var salesObj=nlapiLoadRecord('salesorder',soId);				 
				 var ExistingTrueBal= nlapiLookupField('salesorder',soId,'custbody_truebalanceamount'); 
				 var TrueBalAdjAmt=nlapiGetFieldValue('custbody_truebalanceadjustment');		
				
				//Added for Website True Bal
				 var ExistingWebsiteTrueBal= nlapiLookupField('salesorder',soId,'custbody_website_truebalance_amt'); 
				 var TrueBalWebsiteAdjAmt=nlapiGetFieldValue('custbody_website_truebalance_adj_amt');
				//End 
				// alert("Existing True Bal:"+ExistingTrueBal+", TrueBalAdjAmt: "+TrueBalAdjAmt);
				//if(isNaN(TrueBalAdjAmt))
				if(isNaN(TrueBalWebsiteAdjAmt))
				{
                    tflag=0;
				   alert("Please Check True Balance Adjustment Amount must be numeric value");
				   return true;
				}
				else
				{
				
					var trueBalAmt=0;
					var currencySymbol='';
					if(ExistingTrueBal!='')
					{               
						currencySymbol=ExistingTrueBal.split(' ')[0];                 
						//trueBalAmt=ExistingTrueBal.split(' ')[1].replace(',','');		// commented on 25/07/2016 	 
						//alert("currencySymbol- "+currencySymbol+", trueBalAmt : " +trueBalAmt);
					}
					
					//Added for Website True Bal
					if(ExistingWebsiteTrueBal!='' && ExistingWebsiteTrueBal!=null)
					{
					 trueBalAmt=ExistingWebsiteTrueBal;
					}					
					if(TrueBalWebsiteAdjAmt!='' && TrueBalWebsiteAdjAmt!=null)
					{
					 TrueBalAdjAmt=TrueBalWebsiteAdjAmt;
					}
					//End Website True Bal
					
					var NetTrueBal=0;
					//if( trueBalAmt!='' && TrueBalAdjAmt!='' )
					if(trueBalAmt!='' && TrueBalAdjAmt!='')
					{
											
						 NetTrueBal= parseFloat(trueBalAmt) + parseFloat(TrueBalAdjAmt);						
						 nlapiSetFieldValue('custbody_truebalanceamount',currencySymbol+" "+numberWithCommas(NetTrueBal));	
						 nlapiSetFieldValue('custbody_website_truebalance_amt',NetTrueBal);	//Added for Website True Bal
						 nlapiSetFieldValue('custbody_truebalanceadjustment',TrueBalAdjAmt);	//Added for Old True Bal Adjustment Overwrite
						 tflag=1;
					}
				}
				 
			}
      
      
        return true;
       
	}
	catch(err)
	{
        alert("Error on True Balance Adjustment field.\n"+err.toString());		

	}

}
function numberWithCommas(value) {
              if(value==null || value=="" || value=="undefined")
               {
	         return value;
               }
             else
             {
                var  AmtArr="";
                var AmtArr= value.toString().split(".");
                AmtArr[0] = AmtArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                value= AmtArr.join(".");
               return value
            }
}