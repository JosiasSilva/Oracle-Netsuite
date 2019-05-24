/**
	@Script Author 				:- 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
	@Author Desig. 				:-	Jr. Developer, Inoday Consultancy Pvt. Ltd.
	@Task			   			:-	NS-671 (Melee Items on PO - IA update)
	@Script Type   				:-	Scheduled Script
	@Created Date  				:-	Nov 18, 2017
	@Last Modified Date 		:-  Nov 18, 2017
	@Comments                 	: 	Script will Update Matching halo_melee_Field_of_PO
	@Live UserEvent Script		:-	/app/common/scripting/script.nl?id=1828
	@Live Clien Script			:-	/app/common/scripting/script.nl?id=1829
	@Live Restlet Script		:-	/app/common/scripting/script.nl?id=1830
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2071
	@Live Schedule Script		:-	/app/common/scripting/script.nl?id=2130
	@Live RecordType URL		:-	/app/common/custom/custrecord.nl?id=704
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8086
	@Live Saved Search URL		:-	/app/common/search/searchresults.nl?searchid=8275
*/
function Update_Matching_halo_melee_Field_of_PO()
{
	try
	{	
		var mySearch3 = nlapiLoadSearch(null, 8184); // Sandbox
		var searchresult3 = [];
		var resultset3 = mySearch3.runSearch();
		var searchid = 0;
		do {
			var resultslice = resultset3.getResults(searchid, searchid + 1000);
			if (resultslice != null && resultslice != '') {
				for (var rs in resultslice) 
				{
					Re_Shedule();					
					var col = resultslice[rs].getAllColumns();					
					var shape = resultslice[rs].getValue(col[0]);
					var custitem30 = resultslice[rs].getValue(col[1]);
					var parent = resultslice[rs].getValue(col[2]);
					var po_id = resultslice[rs].getId();
					if(parent && shape && custitem30 && po_id)
					{
						try
						{
							var flag = Page(parent,shape,custitem30,po_id);
							if(flag)
							{
								nlapiLogExecution('debug','Not Updated PO #'+po_id);
							}
							else
							{
								nlapiSubmitField('purchaseorder',po_id,'custbody_matching_halo_melee_count','T');
								nlapiLogExecution('debug','Updated PO #'+po_id);
							}
						}	
						catch(rec)
						{
							nlapiLogExecution('debug','Error in record',rec);
						}
					}
					searchid++;
				}
			}
		}
		while (resultslice.length >= 1000);
	}	
	catch(Ex)
	{
		nlapiLogExecution('debug','Error on Page',Ex);
	}
}



function Page(parent,shape,custitem30)
{	
	var flag = true;
	try
	{
		if(parent && custitem30)
		{
			var fill = [];
			fill.push(new nlobjSearchFilter('custrecord_parent_halo',null,'is',parent));
			fill.push(new nlobjSearchFilter('custrecord_center_shape',null,'is',shape));
			//nlapiLogExecution('debug','parent #'+parent,'SUB_ITEM '+JSON.stringify(SUB_ITEM));		
			var result = nlapiSearchRecord('customrecord_halo_melee',null,fill,new nlobjSearchColumn('custrecord_center_size'));	
				
			if(result != null && result != '' && result.length > 0)
			{
				nlapiLogExecution('debug','Halo Melee Records ',JSON.stringify(result));	
				if(shape == 1)
				{
					
					var mesearureSize = parseFloat(custitem30);
					
					nlapiLogExecution('debug','main size :'+custitem30);	
					for(var l=0; l< result.length; l++)
					{
						var center_size = result[l].getValue('custrecord_center_size');
						if( center_size )
						{	
							var range1 = parseFloat(center_size) - 0.25;
							var range2 = parseFloat(center_size) + 0.25;
							var range3 = parseFloat(center_size);		
							
							nlapiLogExecution('debug','main size 1 : '+center_size);
							if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
							{
								nlapiLogExecution('debug','Match ID ',result[l].getId());		
								flag = false;
								return false;
							}
						}
					}
				}
				else
				{
					var measure_center_size_halo_melee_count = custitem30;
					measure_center_size_halo_melee_count = measure_center_size_halo_melee_count.split('x');
					var r1 = parseFloat(measure_center_size_halo_melee_count[0]) - parseFloat(0.20);
					var r2 = parseFloat(measure_center_size_halo_melee_count[1]) - parseFloat(0.20);
					var range1 = r1.toFixed(2)+ ' x '+ r2.toFixed(2);
					var r3 = parseFloat(measure_center_size_halo_melee_count[0]) + parseFloat(0.20);
					var r4 = parseFloat(measure_center_size_halo_melee_count[1]) + parseFloat(0.20);
					var range2 = r3.toFixed(2)+ ' x '+ r4.toFixed(2);
					var r5 = parseFloat(measure_center_size_halo_melee_count[0]) - parseFloat(0.10);
					var r6 = parseFloat(measure_center_size_halo_melee_count[1]) + parseFloat(0.10);
					var range3 = r5.toFixed(2) + ' x '+ r6.toFixed(2);
					var r7 = parseFloat(measure_center_size_halo_melee_count[0]) + parseFloat(0.10);
					var r8 = parseFloat(measure_center_size_halo_melee_count[1]) - parseFloat(0.10);
					var range4 = r7.toFixed(2) + ' x '+ r8.toFixed(2);
					
					
					
					
					
					nlapiLogExecution('debug','main size :'+custitem30);	
					for(var l=0; l< result.length; l++)
					{
						var center_size = result[l].getValue('custrecord_center_size');
						if( center_size )
						{						
							nlapiLogExecution('debug','main size 1 : '+center_size);	
							var center_arr 		  = center_size.split(' x ');
							var measurements = parseFloat(center_arr[0])+ ' x '+ parseFloat(center_arr[1]);
							

							if((parseFloat(range1)< parseFloat(measurements) && parseFloat(measurements)<parseFloat(range2)) || (parseFloat(range3)< parseFloat(measurements) && parseFloat(measurements)<parseFloat(range4)))
							{
								nlapiLogExecution('debug','Match ID ',result[l].getId());		
								flag = false;
								return false;
							}

						}
					}
				}
			}			
		}
	}
	catch(W)
	{
		nlapiLogExecution('debug','Match Error',W);
	}
	return flag;
}



function Re_Shedule()
{
  if (nlapiGetContext().getRemainingUsage() < 500) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
}
