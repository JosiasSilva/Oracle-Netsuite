nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Anuj Kumar Verma
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd(India)
 * Under Supervision :Sr. Developer Shiv Pratap Rastogi (sprastogi@inoday.com/shivamupc73@gmail.com),Inoday Consultancy Pvt. Ltd(India)
 * Script Type   : Scheduled Script
 * Script Name   : websiteBalanceAdjustment.js
 * Created Date  :
 * Last Modified Date :17-jan-2017
 * URL: /app/common/scripting/script.nl?id=1084&whence=
 */


function websiteBalAdj()
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
			//sand box saved search 4651
			//production saved search id 4826

			var mySearch = nlapiLoadSearch(null,4826);
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
					 var soId= searchresult[m].getId();
                     nlapiLogExecution("debug","soId",soId);

					 var wsBalAmt= searchresult[m].getValue(Results[2]);
                     nlapiLogExecution("debug","ws Bal Amt",wsBalAmt);

					 var wsBalAdjAmt= searchresult[m].getValue(Results[3]);
                     nlapiLogExecution("debug","ws Bal AdjAmt",wsBalAdjAmt);

					 var pif_notes= searchresult[m].getValue(Results[5]);
                     nlapiLogExecution("debug","pif notes",pif_notes);

					 var my_account_info= searchresult[m].getValue(Results[6]);
                     nlapiLogExecution("debug","my account info",my_account_info);

					if(parseFloat(wsBalAmt) > 0)
					{
					     if(parseFloat(wsBalAdjAmt)==0)
						 {
						    var new_website_bal_adjustment= parseFloat(wsBalAmt) * (-1);
							var true_website_bal=parseFloat(wsBalAmt) + parseFloat(new_website_bal_adjustment);
					        updateBalAmt(soId,true_website_bal,new_website_bal_adjustment,pif_notes,my_account_info,new_website_bal_adjustment) ;
						 }
						 else if(parseFloat(wsBalAdjAmt)>0 || parseFloat(wsBalAdjAmt)<0)
						 {
						     var new_website_bal_adjustment=  parseFloat(wsBalAmt) * (-1);
							var true_website_bal=parseFloat(wsBalAmt) + parseFloat(new_website_bal_adjustment);
							var ture_website_bal_adjustment= parseFloat(wsBalAdjAmt) + parseFloat(new_website_bal_adjustment);
							updateBalAmt(soId,true_website_bal,ture_website_bal_adjustment,pif_notes,my_account_info,new_website_bal_adjustment) ;
						 }
                        /*
						 else if(parseFloat(wsBalAdjAmt)<0)
						 {
						 	var new_website_bal_adjustment=  parseFloat(wsBalAmt) * (-1);
							var true_website_bal=parseFloat(wsBalAmt) + parseFloat(new_website_bal_adjustment);
							//var ture_website_bal_adjustment= parseFloat(wsBalAdjAmt) - parseFloat(new_website_bal_adjustment);
                           var ture_website_bal_adjustment= parseFloat(wsBalAdjAmt) + parseFloat(wsBalAmt);
							updateBalAmt(soId,true_website_bal,ture_website_bal_adjustment,pif_notes,my_account_info,wsBalAdjAmt) ;  
						 }
                         */
					}
				}
			}
	}
	catch(e)
	{
		  nlapiLogExecution('error','exception in searh is', e);
	}
}
function updateBalAmt(soId,website_bal,website_bal_adjustment,pif_notes,my_account_info,new_website_bal_adjustment)
{
	  try
	 {

		var fields = new Array();
		var values = new Array();
		fields[0] = 'custbody_my_account_info_on_web';
		fields[1] = 'custbodybilling_pif_notes';
		fields[2] = 'custbody_website_truebalance_amt';
		fields[3] = 'custbody_website_truebalance_adj_amt';
		if(my_account_info =='F')
		{
			 values[0] = 'T';
		}
		else
		{
			 values[0] = 'T';
		}
		if(pif_notes !='')
		{
			pif_notes =pif_notes + '\nScript added a Website Adjustment value of amount added: '+ parseFloat(new_website_bal_adjustment).toFixed(2);
			values[1] = pif_notes;
		}
		else
		{
			pif_notes='Script added a Website Adjustment value of amount added: ' + parseFloat(new_website_bal_adjustment).toFixed(2);
			values[1] = pif_notes;
		}
		values[2] =  parseFloat(website_bal);
		values[3] =  parseFloat(website_bal_adjustment);
		nlapiSubmitField('salesorder',soId, fields,values) ;
		nlapiLogExecution("debug","Website Balance Amt Updated w.r.t soId:"+soId, "Website Balance Amt:"+website_bal+", Website Balance Adj. Amt:"+website_bal_adjustment+" updated sucessfully w.r.t soId:"+soId);

	}
	catch(ex)
	{
		nlapiLogExecution("debug","Error raised on update Website Balance Adjustment is :",ex.message);
	}

}