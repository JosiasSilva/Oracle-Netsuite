nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Rahul Panchal (rahul.panchal@inoday.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : User Event
 * Script Name   : Populate OR Items on SO from RA 
 * Created Date  : NOV 19, 2016
 * Updated Date  : NOV 19, 2016
 * SB Script URL: /app/common/scripting/script.nl?id=1138
 **/



function OR_item_on_SO(type)
{
	if(type=='edit' || type=='view')
		nlapiLogExecution("debug","Type is" +type, type);
	{
		try
		{
			var rAId=nlapiGetRecordId();
			var rAobj=nlapiLoadRecord("returnauthorization",rAId);
			//var rA_orderType=rAobj.getFieldValue("custbody87");
			var rA_sendbackType= rAobj.getFieldValue("custbody35");
			var rAFieldArr=['custbody253'];
		 	var rA_OR_items=[];
			var rAField=nlapiLookupField("returnauthorization",rAId,rAFieldArr);
			rA_OR_items=rAField.custbody253;			
			var rA_OR_notes=rAobj.getFieldValue("custbody254");
			var rA_Date_received=rAobj.getFieldValue("custbody36");
			var rA_cust_item_loc=rAobj.getFieldValue("custbody245");
			var rA_docNo= rAobj.getFieldValue("tranid");
			var rA_date= rAobj.getFieldValue("trandate");
			//var rA_created_from=rAobj.getFieldValue("createdfrom");
			var rA_customerId=rAobj.getFieldValue("entity");
			//var SO_docNo=nlapiLookupField("salesorder",rA_created_from,"tranid");
			//var SO_date=nlapiLookupField("salesorder",rA_created_from,"trandate");
			var custObj=nlapiLoadRecord("customer",rA_customerId);
			var cust_soId1=custObj.getFieldValue("custentity_sales_order_1");
			var cust_soId2=custObj.getFieldValue("custentity_sales_order_2");
			var cust_soId3=custObj.getFieldValue("custentity_sales_order_3");
			var cust_soId4=custObj.getFieldValue("custentity_sales_order_4");
			var cust_soId5=custObj.getFieldValue("custentity_sales_order_5");
			if(rA_sendbackType=='6' || rA_sendbackType=='8' || rA_sendbackType=='9'|| rA_sendbackType=='25') // Added (8,9,25) on 9 Jan 2017
			{
				if(cust_soId1!=null)
				{
					var SO_docNo1=nlapiLookupField("salesorder",cust_soId1,"tranid");
					var SO_date1=nlapiLookupField("salesorder",cust_soId1,"trandate");
					//if(rA_docNo==SO_docNo1 && rA_date==SO_date1)                    
					if((rA_docNo==SO_docNo1 || (SO_docNo1.match(rA_docNo))) && rA_date==SO_date1) //Added By Ravi on 22/03/2017
					{
						if(rA_OR_items!=null)
						{
							if(rA_OR_items.length>0)
							{
								rA_OR_items=rA_OR_items.split(',');
							}						
							nlapiSubmitField("salesorder",cust_soId1,"custbody253",rA_OR_items);
							nlapiLogExecution("debug","Sales order OR items field updated");
						}
						if(rA_OR_notes!=null)
						{
							nlapiSubmitField("salesorder",cust_soId1,"custbody254",rA_OR_notes);
							nlapiLogExecution("debug","Sales order OR notes field updated");
						}
						if(rA_Date_received!=null)
						{	
							nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
							nlapiSubmitField("salesorder",cust_soId1,"custbody36",rA_Date_received);
							nlapiLogExecution("debug","Sales order Date Received field updated");
						}
						if(rA_cust_item_loc!=null)
						{	
							nlapiSubmitField("salesorder",cust_soId1,"custbody245",rA_cust_item_loc);
							nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
						}
					}
					else if(cust_soId2!=null)
					{
						var SO_docNo2=nlapiLookupField("salesorder",cust_soId2,"tranid");
						var SO_date2=nlapiLookupField("salesorder",cust_soId2,"trandate");
						//if(rA_docNo==SO_docNo2 && rA_date==SO_date2)
                        if((rA_docNo==SO_docNo2 || (SO_docNo2.match(rA_docNo))) && rA_date==SO_date2) //Added By Ravi on 22/03/2017
						{
							if(rA_OR_items!=null)
							{
								if(rA_OR_items.length>0)
								{
									rA_OR_items=rA_OR_items.split(',');
								}						
								nlapiSubmitField("salesorder",cust_soId2,"custbody253",rA_OR_items);
								nlapiLogExecution("debug","Sales order OR items field updated");
							}
							if(rA_OR_notes!=null)
							{
								nlapiSubmitField("salesorder",cust_soId2,"custbody254",rA_OR_notes);
								nlapiLogExecution("debug","Sales order OR notes field updated");
							}
							if(rA_Date_received!=null)
							{	
								nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
								nlapiSubmitField("salesorder",cust_soId1,"custbody36",rA_Date_received);
								nlapiLogExecution("debug","Sales order Date Received field updated");
							}
							if(rA_cust_item_loc!=null)
							{	
								nlapiSubmitField("salesorder",cust_soId1,"custbody245",rA_cust_item_loc);
								nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
							}
						}
						else if(cust_soId3!=null)
						{
							var SO_docNo3=nlapiLookupField("salesorder",cust_soId3,"tranid");
							var SO_date3=nlapiLookupField("salesorder",cust_soId3,"trandate");
							//if(rA_docNo==SO_docNo3 && rA_date==SO_date3)
                            if((rA_docNo==SO_docNo3 || (SO_docNo3.match(rA_docNo))) && rA_date==SO_date3) //Added By Ravi on 22/03/2017
							{
								if(rA_OR_items!=null)
								{
									if(rA_OR_items.length>0)
									{
										rA_OR_items=rA_OR_items.split(',');
									}						
									nlapiSubmitField("salesorder",cust_soId3,"custbody253",rA_OR_items);
									nlapiLogExecution("debug","Sales order OR items field updated");
								}
								if(rA_OR_notes!=null)
								{
									nlapiSubmitField("salesorder",cust_soId3,"custbody254",rA_OR_notes);
									nlapiLogExecution("debug","Sales order OR notes field updated");
								}
								if(rA_Date_received!=null)
								{	
									nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
									nlapiSubmitField("salesorder",cust_soId1,"custbody36",rA_Date_received);
									nlapiLogExecution("debug","Sales order Date Received field updated");
								}
								if(rA_cust_item_loc!=null)
								{	
									nlapiSubmitField("salesorder",cust_soId1,"custbody245",rA_cust_item_loc);
									nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
								}
							}
							else if(cust_soId4!=null)
							{
								var SO_docNo4=nlapiLookupField("salesorder",cust_soId4,"tranid");
								var SO_date4=nlapiLookupField("salesorder",cust_soId4,"trandate");
								//if(rA_docNo==SO_docNo4 && rA_date==SO_date4)
                                if((rA_docNo==SO_docNo4 || (SO_docNo4.match(rA_docNo))) && rA_date==SO_date4) //Added By Ravi on 22/03/2017
								{
									if(rA_OR_items!=null)
									{
										if(rA_OR_items.length>0)
										{
											rA_OR_items=rA_OR_items.split(',');
										}						
										nlapiSubmitField("salesorder",cust_soId4,"custbody253",rA_OR_items);
										nlapiLogExecution("debug","Sales order OR items field updated");
									}
									if(rA_OR_notes!=null)
									{
										nlapiSubmitField("salesorder",cust_soId4,"custbody254",rA_OR_notes);
										nlapiLogExecution("debug","Sales order OR notes field updated");
									}
									if(rA_Date_received!=null)
									{	
										nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
										nlapiSubmitField("salesorder",cust_soId1,"custbody36",rA_Date_received);
										nlapiLogExecution("debug","Sales order Date Received field updated");
									}
									if(rA_cust_item_loc!=null)
									{	
										nlapiSubmitField("salesorder",cust_soId1,"custbody245",rA_cust_item_loc);
										nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
									}
								}
								else if(cust_soId5!=null)
								{
									var SO_docNo5=nlapiLookupField("salesorder",cust_soId5,"tranid");
									var SO_date5=nlapiLookupField("salesorder",cust_soId5,"trandate");
									//if(rA_docNo==SO_docNo5 && rA_date==SO_date5)
                                    if((rA_docNo==SO_docNo5 || (SO_docNo5.match(rA_docNo))) && rA_date==SO_date5) //Added By Ravi on 22/03/2017
									{
										if(rA_OR_items!=null)
										{
											if(rA_OR_items.length>0)
											{
												rA_OR_items=rA_OR_items.split(',');
											}						
											nlapiSubmitField("salesorder",cust_soId5,"custbody253",rA_OR_items);
											nlapiLogExecution("debug","Sales order OR items field updated");
										}
										if(rA_OR_notes!=null)
										{
											nlapiSubmitField("salesorder",cust_soId5,"custbody254",rA_OR_notes);
											nlapiLogExecution("debug","Sales order OR notes field updated");
										}
										if(rA_Date_received!=null)
										{	
											nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
											nlapiSubmitField("salesorder",cust_soId1,"custbody36",rA_Date_received);
											nlapiLogExecution("debug","Sales order Date Received field updated");
										}
										if(rA_cust_item_loc!=null)
										{	
											nlapiSubmitField("salesorder",cust_soId1,"custbody245",rA_cust_item_loc);
											nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
										}
									}
									else
									{
										//var mySearch = nlapiLoadSearch(null,4733);//Sandbox save search Id
										var mySearch = nlapiLoadSearch(null,5322);// Production save search Id
										var searchresult = [];
										var resultset = mySearch.runSearch();
										var searchid = 0;
										do
										{
											var resultslice = resultset.getResults( searchid, searchid+1000 );
											if (resultslice !=null && resultslice !='')
											{
												for (var rs in resultslice)
												{
													searchresult.push( resultslice[rs] );
													searchid++;
												}
											}	
										}
										while (resultslice.length >= 1000);
										var cnt=0;
										if (searchresult)
										{
											nlapiLogExecution('debug','Total No. of sales orders:'+searchresult.length,searchresult.length);
											for ( var z = 0; z < searchresult.length; z++)
											{
												var Results = searchresult[z].getAllColumns();
												var recId= searchresult[z].getId();
												var documentNo=searchresult[z].getValue(Results[1]);
												var SO_date=searchresult[z].getValue(Results[0]);
												var customerId=searchresult[z].getValue(Results[2]);
												if(rA_customerId== customerId)
												{
													//if(rA_docNo==documentNo && rA_date==SO_date)
                                                    if((rA_docNo==documentNo || (documentNo.match(rA_docNo))) && rA_date==SO_date) //Added By Ravi on 22/03/2017
													{
														if(rA_OR_items!=null)
														{
															if(rA_OR_items.length>0)
															{
																rA_OR_items=rA_OR_items.split(',');
															}						
															nlapiSubmitField("salesorder",recId,"custbody253",rA_OR_items);
															nlapiLogExecution("debug","Sales order OR items field updated from search");
														}
														if(rA_OR_notes!=null)
														{
															nlapiSubmitField("salesorder",recId,"custbody254",rA_OR_notes);
															nlapiLogExecution("debug","Sales order OR notes field updated from search");
														}
														if(rA_Date_received!=null)
														{	
															nlapiLogExecution("debug","Date Received is"+rA_Date_received,rA_Date_received);
															nlapiSubmitField("salesorder",recId,"custbody36",rA_Date_received);
															nlapiLogExecution("debug","Sales order Date Received field updated");
														}
														if(rA_cust_item_loc!=null)
														{	
															nlapiSubmitField("salesorder",recId,"custbody245",rA_cust_item_loc);
															nlapiLogExecution("debug","Sales order Cust Item Loc field updated");
														}
													}
												}
											}
										}
									}	// end of search criteria							
								}
							}							
						}
					}
				}
				
			}			
		}
		catch(err)
		{
			nlapiLogExecution("debug","Error occuring in RA",err.message);
		}
	}
}

