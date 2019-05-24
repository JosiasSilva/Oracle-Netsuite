/**
Script Author : Bhawna Dogra (bhawna.dogra@inoday.com)
Author Desig. : Nestuite Consultant, Inoday Consultancy Pvt. Ltd.
Script Type : Suitscript (Client Script)
Script Name :Set Payment Amt on Cust Deposit
Created Date : May 30th, 2018
Last Modified Date : May 31st, 2018
Comments : This script will map the value of Website Balance of Salesorder to Payment Amount field if the Website Balance is greater than or equal to 0.
SS URL :
Script URL:
*/
//Set the value of Payment amount

function pageinit(type)
{
	try{
			if(type =='create')
				{
					var soid = nlapiGetFieldValue('salesorder');
					if(soid !="")
					{
						var true_bal=nlapiLookupField('salesorder',soid,'custbody_website_truebalance_amt');
	
						if(true_bal>=0)
						{
						nlapiSetFieldValue('payment',true_bal);
						}
						else
						{
						nlapiSetFieldValue('payment',0);
						}
					}
				}
	}
	catch(ex)
	{
		nlapiLogExecution('debug','error',ex.message);
	}
}
