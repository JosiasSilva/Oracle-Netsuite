/*
 * Task Name							:	NS-654 (Order Update Script - Comparison Shopper enhancements)
 * Script Author 						: 	YAGYA KUMAR NAG (yagyakumar@inoday.com/ yagyakumarnag@gmail.com)
 * Author Desig. 						: 	Jr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	User Event Script (Before Load SO)
 * Created Date  						: 	April 12, 2017
 * Last Modified Date 					:  	April 12, 2017
 * Comments                 			: 	This script set Ring Stack checkbox value according to some combination of items for same size and same metal types on sales order.
 * Sandbox UserEvent Script				:	https://debugger.sandbox.netsuite.com/app/common/scripting/script.nl?id=1229
**/

var Combination2 = 0;
var CombArr2 = ['3319487','3319285','3319386'];//['BE266LCY ','BE266LCB','BE266LCP '];
function RingStack(type,form)
{
	var CheckCombination =[];
	CheckCombination.push({
		ComparisonShopper	:	 false,
		RingStack			:	 false
	});
	var flag = false;
	try
	{
		
		if(type == 'view'||type == 'edit')
		{
			var soId = nlapiGetRecordId();
			var salesOrderType = nlapiGetRecordType(); 
			try
			{
				var myObject = [];	
				//var obj = nlapiLoadRecord('salesorder',soId);			
				var count = nlapiGetLineItemCount('item');
				for (var z = 1; z <= count; z++) 
				{
					var ItemId = nlapiGetLineItemValue('item','item',z);
					try
					{
						
						var ItemArr = nlapiLookupField('inventoryitem',ItemId,['custitem1','custitem2','parent']);
						var parent = ItemArr.parent;
						var ItemMetal= ItemArr.custitem1;
						var ItemSize= ItemArr.custitem2;
					}
					catch(e){}
					if(parent != "" && parent != null )
					{
						
						if(ItemMetal != "" && ItemMetal != null && ItemSize != "" && ItemSize !=null )
						{
							myObject.push({
								ItemId: ItemId,
								parent: parent,
								Metal: ItemMetal,
								Size: ItemSize
							});
						}
					}								
				} 
				//nlapiLogExecution('debug','SO #'+soId+' have total BE type is '+myObject.length,JSON.stringify(myObject));
				// items for Metal group
				if (myObject.length > 2) 
				{
					
					var groups = myObject;
					var Size = {};
					var SizeName = [];

					for (var i = 0; i < groups.length; i++) 
					{
						var group = groups[i];

						if (typeof Size[group.Size] === "undefined") 
						{
							Size[group.Size] = [];
							SizeName.push(group.Size);
							SizeName.sort();
						}
						Size[group.Size].push({
							ItemId: group.ItemId,
							parent: group.parent,
							Metal: group.Metal,
							Size: group.Size
						});
					}
					var groups = myObject;
					var Metal = {};
					var MetalName = [];

					for (var i = 0; i < groups.length; i++) 
					{
						var group = groups[i];

						if (typeof Metal[group.Metal] === "undefined") 
						{
							Metal[group.Metal] = [];
							MetalName.push(group.Metal);
							MetalName.sort();
						}
						Metal[group.Metal].push({
							ItemId: group.ItemId,
							parent: group.parent,
							Metal: group.Metal,
							Size: group.Size
						});
					}
					//nlapiLogExecution('debug','SO #'+soId+' metal name is '+CurrentMetalName,JSON.stringify(groups));
					// items for Size group
					
					if (SizeName.length > 0) 
					{
						for (var x = 0; x < SizeName.length; x++) 
						{
							var CurrentSizeName = SizeName[x];
							if (Size[CurrentSizeName].length > 2) 
							{
								var groups = Size[CurrentSizeName];
								var Metal = {};
								var MetalName = [];
								for (var i = 0; i < groups.length; i++) 
								{
									var group = groups[i];
									if (typeof Metal[group.Metal] === "undefined") 
									{
										Metal[group.Metal] = [];
										MetalName.push(group.Metal);
										MetalName.sort();
									}
									Metal[group.Metal].push({
										ItemId: group.ItemId,
										parent: group.parent,
										Metal: group.Metal,
										Size: group.Size
									});
								}
								nlapiLogExecution('debug','SO #'+soId+' have total metal items is '+MetalName.length,JSON.stringify(MetalName));
								for (var w = 0; w < MetalName.length; w++) 
								{
									var CurrentMetalName = MetalName[w];
									var SameMetalMetal = Metal[CurrentMetalName];
									nlapiLogExecution('debug','SO #'+soId+'same metal name & Metal is '+CurrentMetalName+', '+CurrentMetalName,JSON.stringify(SameMetalMetal));
									if (SameMetalMetal.length > 0) 
									{
										CheckCombination = Combination(SameMetalMetal);	
										if(CheckCombination[0].ComparisonShopper || CheckCombination[0].RingStack)
										{										
											flag = true;																		
											nlapiLogExecution('debug','SO #'+soId+' successfully Combination match ',JSON.stringify(SameMetalMetal));
											break;
										}
										else
										{								
											nlapiLogExecution('debug','SO #'+soId+' Combination Not match ',JSON.stringify(SameMetalMetal));
										}	
									}
								}
								if(flag)	
								{
									break;
								}	
							}
						}
					}
				}
			}
			catch(ex)
			{
				nlapiLogExecution('debug','Error on SO #'+soId,ex);
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('debug','Error on Page ',ex.message);
	}
	nlapiLogExecution('debug','CheckCombination ',JSON.stringify(CheckCombination));
	return CheckCombination;
}

	
var Type = 0;
function Combination(SameSizeMetal)
{
	var CheckCombination = [];
	CheckCombination.push({
		ComparisonShopper	:	 false,
		RingStack			:	 false
	});
	
	var be1_Type = 0;
	var be2_Type = 0;
	var Combination1 = 0;
	var CombArr1 = ['3258147','3266526','3266602'];//['BE1D35PR ','BE1D40RD ','BE1D53PS '];
	
	//var Combination2 = 0;
	//var CombArr2 = ['3319487','3319285','3319386'];//['BE266LCY ','BE266LCB','BE266LCP '];
	
	var Combination3 = 0;
	var CombArr3 = ['3245555','3498869','2495371'];//['BE2133 ','BE2564LD','BE2564 '];
	
	var Combination4 = 0;
	var CombArr4 = ['17755','19118','2030815'];//['BE2BZD20R30 ','BE250BDE ','BE260E '];
	
	var Combination5 = 0;
	var CombArr5 = ['4338','4338','868129'];//['BE2PD50R50 ','BE2PD50R50 ','BE2M254P '];
	
	
	for (var v = 0; v < SameSizeMetal.length; v++) 
	{
		var CurrentItemName = SameSizeMetal[v].parent;
		var CurrentMetalName = SameSizeMetal[v].Metal;
		if (CurrentItemName == CombArr1[0] || CurrentItemName == CombArr1[1] || CurrentItemName == CombArr1[2]) 
		{
			CombArr1[CombArr1.indexOf[CurrentItemName]]='';
			Combination1++;
		}
		else if (CurrentItemName == CombArr2[0] || CurrentItemName == CombArr2[1] || CurrentItemName == CombArr2[2]) 
		{
			if(CurrentMetalName == "1" || CurrentMetalName == "2" || CurrentMetalName == "7")
			{
				CombArr2[CombArr2.indexOf[CurrentItemName]]='';
				Combination2++;
			}			
		}
		else if (CurrentItemName == CombArr3[0] || CurrentItemName == CombArr3[1] || CurrentItemName == CombArr3[2]) 
		{
			CombArr3[CombArr3.indexOf[CurrentItemName]]='';
			Combination3++;
		}
		else if (CurrentItemName == CombArr4[0] || CurrentItemName == CombArr4[1] || CurrentItemName == CombArr4[2]) 
		{
			CombArr4[CombArr4.indexOf[CurrentItemName]]='';
			Combination4++;
		}
		else if (CurrentItemName == CombArr5[0] || CurrentItemName == CombArr5[1] || CurrentItemName == CombArr5[2]) 
		{
			CombArr5[CombArr5.indexOf[CurrentItemName]]='';
			Combination5++;
		}
		var CurrentItemText = nlapiLookupField('inventoryitem',CurrentItemName,'itemid');			
		var patternBE1 = /^be[1].*/im;			
		if( patternBE1.test(CurrentItemText))
		{
			be1_Type++;
		}
		var patternBE2 = /^be[2].*/im;	
		if(patternBE2.test(CurrentItemText))
		{					
			be2_Type++;
			if(CurrentMetalName == "1" || CurrentMetalName == "2" || CurrentMetalName == "7")
			{
				Type++;
			}
		}
	}
	if (Combination1 > 2 || Combination2 > 2 || Combination3 > 2 || Combination4 > 2 || Combination5 > 2 ) 
	{
		if(((Combination3 > 2 || Combination4 > 2 || Combination5 > 2) && be2_Type == 3) || (Combination2 > 2 && Type == 3 ) || (Combination1 > 2 && be1_Type == 3 ))
		{
			CheckCombination[0].ComparisonShopper = true;		
		}
		CheckCombination[0].RingStack = true;		
	}
	return CheckCombination;
}
