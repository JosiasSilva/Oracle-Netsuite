//URL :- https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=920&whence=
function getTrueBalAdjustment(type,name)
{
	var tflag=0;
	
	try
		{  
		
			if(name=='custbody_truebalanceadjustment' && tflag==0)
			{
				 var soId= nlapiGetRecordId();
				// alert("Hello soId :" +soId);
				 var salesObj=nlapiLoadRecord('salesorder',soId);
				 //var ExistingTrueBal=salesObj.getFieldValue('custbody_truebalanceamount');
				 //var ExistingTrueBal=nlapiGetFieldValue('custbody_truebalanceamount');
				 var ExistingTrueBal= nlapiLookupField('salesorder',soId,'custbody_truebalanceamount'); 
				 var TrueBalAdjAmt=nlapiGetFieldValue('custbody_truebalanceadjustment');			 
				// alert("Existing True Bal:"+ExistingTrueBal+", TrueBalAdjAmt: "+TrueBalAdjAmt);
				if(isNaN(TrueBalAdjAmt))
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
					trueBalAmt=ExistingTrueBal.split(' ')[1].replace(',','');			 
					//alert("currencySymbol- "+currencySymbol+", trueBalAmt : " +trueBalAmt);
					}
					var NetTrueBal=0;
					if( trueBalAmt!='' && TrueBalAdjAmt!='' )
					{
											
						 NetTrueBal= parseFloat(trueBalAmt) + parseFloat(TrueBalAdjAmt);						
						 nlapiSetFieldValue('custbody_truebalanceamount',currencySymbol+" "+numberWithCommas(NetTrueBal));												
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