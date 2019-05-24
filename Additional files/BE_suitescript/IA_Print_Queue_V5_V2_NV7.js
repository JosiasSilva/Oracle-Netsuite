function IA_Print_Queue(request,response)
{

	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_template_file_v5");
	var templateFile =nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var iaTemp = Handlebars.compile(template);
	var email = false;		
	var today = new Date();
	today = nlapiDateToString(today,"date");	
	var results=JSON.parse(nlapiGetContext().getSetting('SESSION', 'custpage_order_data'));
	var run_time=0;	
  nlapiLogExecution("debug","load_data Collection Test:=",JSON.stringify(results[0].haloMeleeSearchResult));
	var salesOrder_data=results[0].salesOrder;
	var hmSearchList=results[0].haloMeleeSearchResult;
	var total_length=salesOrder_data.length-1;
    var pageData = [];
	var pageData_no_category = [];
	var pageData_no_print=[];
    var no_pdf=[];	 
	nlapiLogExecution ( 'debug', 'Test 1' ) ;
	 for(var k=0;k<salesOrder_data.length;k++)
	  {
        var page_data_categorynot_match=false;
		run_time=run_time+1;		
		var customer_name = salesOrder_data[k].customer_name;
		var currency = salesOrder_data[k].currency;
		var orderId=salesOrder_data[k].internalid;
		var trandate=salesOrder_data[k].trandate;
		var billaddress1=salesOrder_data[k].billaddress1;
		var billcity=salesOrder_data[k].billcity;
		var billstate=salesOrder_data[k].billstate;
		var billzip=salesOrder_data[k].billzip;
		var tranid=salesOrder_data[k].tranid;		
		var results=salesOrder_data[k].data_child;
		for(var x=0; x < results.length; x++)
		{
		  
		  
			var category = results[x].custitem20;
			if(category=="2")
			{
					   
			   
                nlapiLogExecution ( 'debug',   ' category 2  Test 1' ) ;    
				//Setting with large center stone
				var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
				var diamondFields = ["custitem5","custitem28","custitem7","custitem19","custitem27","itemid","custitem18"];
				var diamondID = "";
				var sapphireID = "";
				var image = "";
				var replacementAmount = 0.00;
				var gemstone = "";
				var gemstone_desc = "";
				var centerHeader = "CENTER DIAMOND";
				replacementAmount += parseFloat(results[x].fxamount);
				var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
				for(var i=0; i < results.length; i++)
				{
					if(x==i)
						continue;
					
					var sub_category = results[i].custitem20;
					if(sub_category=="7")
					{
						diamondID = results[i].item;
						replacementAmount += parseFloat(results[i].fxamount);
						break;
					}		
					else if(sub_category=="8" || sub_category=="13" || sub_category=="14" || sub_category=="20" || sub_category=="18" || sub_category=="15")
					{
						sapphireID = results[i].item;
						replacementAmount += parseFloat(results[i].fxamount);
						break;
					}
				}				
				
				var metalType=nlapiLookupField("item",results[x].item,metalField,true);
				var metalNameStr=metalType.custitem1;
			
				var isIABlock=nlapiLookupField("item",results[x].item,"custitemblock_insurance_appraisal");
				if(isIABlock=='T')
				{
				
				   	pageData_no_print.push('IA is Blocked for SO For order #:'+tranid );	
				    page_data_categorynot_match=true;
				   continue;
				}
				
				
				var item = nlapiLookupField("item",results[x].item,fields);
				
				var diamond = null;
				//Added by Shiv
				var haloCheck='F';
				var haloMeleeResult=[];
				var dmdShape='';
				var dmdMesearure='';
				var dmdHaloMeleCount='';
				var dmdStockUnit='';
				var dmdMinTotCarat='';
				var dmdCollection='';
				var dmdHaloMeleeId='';
				var dmdStoneId='';
				//Added by Shiv
				
				if(diamondID!="")
				{
					dmdStoneId=diamondID;	
					diamond = nlapiLookupField("item",diamondID,diamondFields,true);
					var diamond2 = nlapiLookupField("item",diamondID,["itemid","custitem27"]);
					diamond.itemid = diamond2.itemid;
					diamond.custitem27 = diamond2.custitem27 + "ct";
					//diamond.itemid = nlapiLookupField("item",diamondID,"itemid");
					//diamond.custitem27 = nlapiLookupField("item",diamondID,"custitem27") + "ct";
					
					//Only include is Origin = LAB GROWN or LAB CREATED
					if(diamond.custitem18!="Lab Grown" && diamond.custitem18!="Lab Created")
						diamond.custitem18 = "";
				}
				if(sapphireID!="")
				{
                    dmdStoneId=sapphireID;	
					diamond = nlapiLookupField("item",sapphireID,diamondFields,true);
					var diamond2 = nlapiLookupField("item",sapphireID,["itemid","custitem27","salesdescription"]);
					diamond.itemid = diamond2.itemid;
					diamond.custitem27 = diamond2.custitem27;
					var centerHeader = "CENTER GEMSTONE";
					gemstone = "T";
					gemstone_desc = nlapiEscapeXML(diamond2.salesdescription);
					
					diamond.custitem18 = "";
				}
				//Added By Shiv
				var myParentItemId=results[x].item; 
				var subItemId=nlapiLookupField("item",myParentItemId,"custitem9");	
				//var collection=nlapiLookupField("item",myParentItemId,"custitem78");
				// added new code on 30 march 2017
				var collection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
				if(sub_category=='8' && (sapphireID!='' && sapphireID !=null) && (diamondID=='' || diamondID==null))
				{
					dmdStoneId=sapphireID;					
				}
				 var isHaloStyle='F';
				if(collection=='T')
				{
				isHaloStyle='T';//Added to check halo style item only
				}
	           
				
				if((myParentItemId !='' && myParentItemId !=null) && (subItemId !='' && subItemId !=null) && (dmdStoneId !='' && dmdStoneId !=null))
				{
					haloMeleeResult=getHaloMeleeDetail(dmdStoneId,myParentItemId,hmSearchList);
                   nlapiLogExecution("debug","haloMeleeResult (Test)", JSON.stringify(haloMeleeResult));
					if(haloMeleeResult.length > 0)
					{
						haloCheck=haloMeleeResult[0].haloCheck;
						dmdShape=haloMeleeResult[0].haloDmdShape;
						dmdHaloMeleeId=haloMeleeResult[0].haloMeleeId;						
						dmdMesearure=haloMeleeResult[0].haloMesearure;
						dmdHaloMeleCount=haloMeleeResult[0].totalGem;
						dmdStockUnit=haloMeleeResult[0].stockUnit;
						dmdMinTotCarat=haloMeleeResult[0].totMinCarat;	
					}
					
				}
				
				// Added by pankaj
				 nlapiLogExecution ( 'debug',   'haloMeleeResult.length',haloMeleeResult.length ) ;   
				 nlapiLogExecution ( 'debug',   'myParentItemId',myParentItemId ) ;   
				 nlapiLogExecution ( 'debug',   'dmdStoneId',dmdStoneId );   
				if(haloMeleeResult.length==0 && myParentItemId !=null && myParentItemId !='' &&  dmdStoneId!=null && dmdStoneId!='' && isHaloStyle=='T')					
				{
					//var haloMeleeCollection=nlapiLookupField("item",myParentItemId,"custitem78");
					// added new code on 30 march 2017
					var haloMeleeCollection=nlapiLookupField("item",myParentItemId,"custitemhalo_setting");
					var diamondShape=nlapiLookupField("item",dmdStoneId,"custitem5");
					
					  nlapiLogExecution ( 'debug',   'haloMeleeCollection' ,haloMeleeCollection ) ;    
					    nlapiLogExecution ( 'debug',   'diamondShape' ,diamondShape ) ;    
 
					if(haloMeleeCollection=='T' && diamondShape=='1')							 
					 {
						
						pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available for halo style.'  );	
				        page_data_categorynot_match=true;
						continue;	
						
					 }
                    else if(haloMeleeCollection =='T' && diamondShape!='1')								 
					 {
						pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available due to shape of halo style.'  );	
				        page_data_categorynot_match=true;
						continue;	
					 }				 
                    else if(haloMeleeCollection=='1' && diamondShape=='1')							 
					{
						pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available due to shape of halo style.'  );	
				        page_data_categorynot_match=true;
						continue;	
					}
					else if(haloMeleeCollection=='4' && diamondShape=='4')							 
					{
						pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available due to shape of halo style.'  );	
				        page_data_categorynot_match=true;
						continue;	
					}
				
				 }
				 //End 
				 
			  if(haloMeleeResult.length==0)					
				{
					haloCheck='F'
				}
				 
			
				var accentText = "";
				//var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
				if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
					accentText = item["parent.custitem101"];
					
					if(accentText!="" && accentText!=null)
					{
											
						if(haloCheck=='T')   
						{	
							var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";							
							
							var accentTextArr=accentText.split("Treatment:	None");   
							for(var j=0; j < accentTextArr.length; j++)
							{	
								if(accentTextArr[j]!='' && accentTextArr[j]!=null)
								{
									var testTemp=accentTextArr[j];
									var index1= testTemp.toLowerCase().indexOf("conflict free diamond");
                                    var index11= testTemp.toLowerCase().indexOf("diamond"); 
									if(index1>0 || index11>0)
									{
									var index2 = accentTextArr[j].toLowerCase().indexOf("round"); //if Round 
									if(index2 > 0 ) 
									{
										var  accentTextTemp = accentTextArr[j].split("\n");
										for(var i=0; i < accentTextTemp.length; i++)
										{	
											var line = accentTextTemp[i].split(":");
											if(line[0]!='\r' && line[0]!='' && line[0]!=null)		
											{
												if(line[0].toLowerCase()=="treatment")
													continue;
												if(line[0].toLowerCase()=="number of gemstones")
												{						
													if(dmdHaloMeleCount!='')
													{
														line[1]=dmdHaloMeleCount;
														
													}
													
												}
												if(line[0].toLowerCase()=="minimum total carats")
												{  
													if(dmdMinTotCarat!=null)
													{							 
														line[1]=dmdMinTotCarat;
													}
												}
												accentTable += "<tr>";
												accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
												accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
												accentTable += "</tr>";
											}											
										}
									
									} 
									else
									{
										var accentTextTemp = accentTextArr[j].split("\n");
										for(var i=0; i < accentTextTemp.length; i++)
										{	
											var line = accentTextTemp[i].split(":");
											if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
											{
												if(line[0])
												/*if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")*/
												if(line[0].toLowerCase()=="treatment")
																		continue;		
													
												accentTable += "<tr>";
												accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
												accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
												accentTable += "</tr>";
											}
										}
										
									}
								 }// end check index1
												  
								}//end check accentTextArr
							}// end loop accentTextArr
							accentTable += "</table>";
						}
						else if(collection!='T')
						{
							var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
							accentText = accentText.split("\n");
							for(var i=0; i < accentText.length; i++)
							{	
								var line = accentText[i].split(":");
								if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
								{
									//if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")
									//continue;
									if(line[0].toLowerCase()=="treatment")
										 continue;	
								accentTable += "<tr>";
								accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
								accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
								accentTable += "</tr>";
								}
							}
						
							accentTable += "</table>";								
						}
						
						
					}
					else
					{
						accentTable = "";
					}
				
					
				if(diamond==null)
				{
					diamond = {
						custitem27 : "",
						custitem7 : "",
						custitem19 : "",
						custitem28 : "",
						custitem18 : ""
					}
				}
				
				
				replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
				var cutString = "";
				if(diamond.custitem5!=null && diamond.custitem5!="")
					cutString += diamond.custitem5;
				if(diamond.custitem28!=null && diamond.custitem28!="" && cutString!="")
					cutString += ", ";
				if(diamond.custitem28!=null && diamond.custitem28!="")
					cutString += diamond.custitem28;
					
				var center_section = "";
				if(diamond.custitem27!=null && diamond.custitem27!="")
					center_section = "T";
				if(cutString!=null && cutString!="")
					center_section = "T";
				if(diamond.custitem7!=null && diamond.custitem7!="")
					center_section = "T";
				if(diamond.custitem19!=null && diamond.custitem19!="")
					center_section = "T";
				
				if(sapphireID!="")
				{
					cutString = "";
					center_section = "";
					color = "";
					clarity = "";
				}
				
				var pdf = {
					date : formatDate(today),
					name : customer_name,
					address1 :billaddress1,
					city : billcity,
					state : billstate,
					zipcode : billzip,
					type_of_jewelry : "One Lady's Engagement Ring",
					setting : "Brilliant Earth's " + item["parent.salesdescription"],
					//material : setMetal(item.custitem1),
					material : metalNameStr,					
					carat : sapphireID!="" ? "" : diamond.custitem27,
					cut : sapphireID!="" ? "" : cutString,
					color : sapphireID!="" ? "" : diamond.custitem7,
					clarity : sapphireID!="" ? "" : diamond.custitem19,
					center_diamond : "",
					accent_carat_weight : accentTable,
					replacement_price : currency + " " + addCommas(replacementAmount),
					disclaimer :  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer_v5")),
					signatory : "",
					signatory_title : "",
					order_number : tranid,
					center_section : center_section,
					center_header : centerHeader,
					gemstone : gemstone,
					gemstone_desc : gemstone_desc,
					origin : diamond.custitem18
				};
				
				for(var z=0; z < results[x].quantity; z++)
				{
				
					pageData.push(iaTemp(pdf));
					page_data_categorynot_match=true;
				}

			}
			else if(category=="3")
			{
			
			   	var isIABlock=nlapiLookupField("item",results[x].item,"custitemblock_insurance_appraisal");
				if(isIABlock=='T')
				{
				
				   	pageData_no_print.push('IA is Blocked for SO For order #:'+tranid );	
				    page_data_categorynot_match=true;
				   continue;
				}
					
                 nlapiLogExecution ( 'debug',   ' category 3 Test 1' ) ;                          
				//Code Added by Shiv for eternity melee count
				var myItemId=results[x].item; 										
				var eternityCheck='F';
				eternityCheck=isCheckEternity(myItemId)
				var NoOfGemStone='0';
				var totalCarat='0';
				var eternityMeleeResult=[];
				if(eternityCheck=='T')
				{
					if(myItemId!='' && myItemId !=null)
					{					
						eternityMeleeResult=getEternityMeleeDetail(myItemId);
						if(eternityMeleeResult.length>0)
						{
							NoOfGemStone=eternityMeleeResult[0].NoOfGemStone;
							totalCarat=eternityMeleeResult[0].totalCarat;
						}
					}
				}
				//Added by Pankaj
				if(eternityCheck=='T' && parseFloat(NoOfGemStone)==0)
				{
	
                                      pageData_no_print.push('For order #:'+tranid +', there is no gemstone count information available for eternity style.'  );
                                    page_data_categorynot_match=true;
			  
				        continue;
				}
                //End				
				if(parseFloat(NoOfGemStone)==0 || parseFloat(totalCarat)==0)
				{
				   eternityCheck='F';
				}
			
				var fields = ["parent","parent.salesdescription","custitem1","parent.itemid","parent.custitem101","parent.custitem9"];
				var item = nlapiLookupField("item",results[x].item,fields);
				
				var metalField=["custitem1"]; // Added by Shiv per NS-402 assigned by Eric
				var metalType=nlapiLookupField("item",results[x].item,metalField,true);
				var metalNameStr=metalType.custitem1;
				
				var replacementAmount = results[x].fxamount;
				
				replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.30)));
				
				var accentText = "";
				//var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
				if(item["parent.custitem9"]!=null && item["parent.custitem9"]!="")
					accentText = item["parent.custitem101"];
					
				if(accentText!="" && accentText!=null)
				{
					
					if(eternityCheck=='T') // to check eternity
					{	var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";						
						iaFlag='0';
						accentText = accentText.split("\n");
						for(var i=0; i < accentText.length; i++)
						{
							var line = accentText[i].split(":");
													
							   if((NoOfGemStone!='' && NoOfGemStone!=null) && (totalCarat!='' && totalCarat!=null))
							   {
									if(line[0].toLowerCase()=="treatment")
										continue;
									if(line[0].toLowerCase()=="number of gemstones")
									{						
										if(NoOfGemStone!='')
										{
											line[1]=NoOfGemStone;
										}
										
									}
									if(line[0].toLowerCase()=="minimum total carats")
									{  
										if(totalCarat!=null)
										{							 
											line[1]=totalCarat;
										}
									}
								}
							
							
							accentTable += "<tr>";
							accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
							accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
							accentTable += "</tr>";
						}
						accentTable += "</table>";
						
					}
					else if(eternityCheck=='F')
					{
						var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";	
						//iaFlag='1';
						//iaMssg='Eternity ring with no stone count information';
						accentText = accentText.split("\n");
						for(var i=0; i < accentText.length; i++)
						{	
							var line = accentText[i].split(":");
							if(line[0]!='\r' && line[0]!='' && line[0]!=null)                                           
							{
								//if(line[0].toLowerCase()=="number of gemstones" || line[0].toLowerCase()=="treatment")
								//continue;
								if(line[0].toLowerCase()=="treatment")
									 continue;	
							accentTable += "<tr>";
							accentTable += "<td width='150px' class='freightDispPro pt10'>" + line[0] + ":</td>";
							accentTable += "<td class='freightDispPro pt10'>" + line[1] + "</td>";
							accentTable += "</tr>";
							}
						}
						accentTable += "</table>";
					}
					
				}
				else
				{
				   accentTable="";	
				}

				var pdf = {
					date : formatDate(today),
					name : customer_name,
					address1 : billaddress1,
					city : billcity,
					state : billstate,
					zipcode : billzip,
					type_of_jewelry : "One wedding band",
					setting : "Brilliant Earth's " + item["parent.salesdescription"],
					//material : setMetal(item.custitem1),
					material : metalNameStr,					
					carat : "",
					cut : "",
					color : "",
					clarity : "",
					center_diamond : "",
					accent_carat_weight : accentTable,
					replacement_price : currency + " " + addCommas(replacementAmount),
					disclaimer :  nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer_v5")),
					signatory : "",
					signatory_title : "",
					order_number : tranid,
					center_section : "",
					center_header : "",
					gemstone : "",
					gemstone_desc : "",
					origin : ""
				};
					
				for(var z=0; z < results[x].quantity; z++)
				{
				   pageData.push(iaTemp(pdf));	
                   page_data_categorynot_match=true;				   
				}
nlapiLogExecution ( 'debug',   ' category 3  end Test 1' ) ;  
			}
			else if(category=="24")
			{
  nlapiLogExecution ( 'debug',   ' category 24 Test 1' ) ;  
				//Estate Rings
				var fields = ["salesdescription","custitem51","custitem61","custitem64","custitem77"];
				var fields2 = ["custitem56","custitem64"];
				var item = nlapiLookupField("item",results[x].item,fields);
				var item2 = nlapiLookupField("item",results[x].item,fields2,true);
				var metalNameStr=item2.custitem64; // Added by Shiv per NS-402 assigned by Eric
				var replacementAmount = results[x].fxamount;
				
				replacementAmount = Math.ceil(parseFloat(nlapiFormatCurrency(replacementAmount * 1.10)));
				
				var centerText = item.custitem51;
				var centerTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px'>";
				if(centerText!="" && centerText!=null)
				{
					centerText = centerText.split(",");
					for(var i=0; i < centerText.length; i++)
					{
						centerTable += "<tr>";
						centerTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(centerText[i]) + "</td>";
						centerTable += "</tr>";
					}
					
					centerTable += "</table>";
				}
				else
				{
					centerTable = "";
				}
				
				var accentText = item.custitem61;
				var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0' margin-left='10px' margin-bottom='10px'>";
				if(accentText!="" && accentText!=null)
				{
					accentText = accentText.split(",");
					for(var i=0; i < accentText.length; i++)
					{
						accentTable += "<tr>";
						accentTable += "<td width='250px' class='freightDispPro pt10'>" + nlapiEscapeXML(accentText[i]) + "</td>";
						accentTable += "</tr>";
					}
					
					accentTable += "</table>";
				}
				else
				{
					accentTable = "";
				}
				
				var pdf = {
					date : formatDate(today),
					name : customer_name,
					address1 : billaddress1,
					city : billcity,
					state : billstate,
					zipcode : billzip,
					type_of_jewelry : "One " + item2.custitem56,
					setting : nlapiEscapeXML("One-of-a-Kind Vintage Estate Piece " + item.custitem77),
					//material : setMetal(item.custitem64), 
					material : metalNameStr,
					carat : "",
					cut : "",
					color : "",
					clarity : "",
					center_diamond : centerTable,
					accent_carat_weight : accentTable,
					replacement_price : currency + " " + addCommas(replacementAmount),
					disclaimer : nlapiEscapeXML(nlapiGetContext().getSetting("SCRIPT","custscript_ia_queue_disclaimer_v5")),
					signatory : "",
					signatory_title : "",
					order_number : tranid,
					center_section : "",
					center_header : "CENTER GEMSTONE",
					gemstone : "",
					gemstone_desc : "",
					origin : ""
				};
					
				for(var z=0; z < results[x].quantity; z++)
				{
					pageData.push(iaTemp(pdf));	
                    page_data_categorynot_match=true;					
				}
			}
		}
		if(!page_data_categorynot_match)
		{
		   pageData_no_category.push("The sales order#"+tranid+" is not applicable to generate IA print due to order's items not belong to category Ring with no large center stone, Setting with large center stone and Antique");
		}
	}
	var data_con=[];
	if(pageData_no_print.length>0 || pageData_no_category.length>0)
	{
   var accentTable = "<table cellpadding='0' cellmargin='0' cellborder='0'>";
          var k=1;
	   for(var t=0;t<pageData_no_print.length;t++)
	   {
		 accentTable+="<tr><td >("+(k)+")=> "+pageData_no_print[t]+"<br/><br/><br/></td></tr>";
                 k=k+1;	
	   
	   }
        accentTable+="<tr><td></td></tr>";	
	  for(var t=0;t<pageData_no_category.length;t++)
	   {
		   accentTable+="<tr><td >("+(k)+")=>"+pageData_no_category[t]+"<br/><br/><br/></td></tr>";
	            k=k+1;	
	   }
	   accentTable+="</table>";
	   	
	   data_con.push(accentTable);
	}
   pageData=pageData.concat(data_con);
   if(pageData.length>0)
    {
      Show_Print(pageData);
    }
	   
}

function Show_Print(pageData)
{

       var xml = "";
		xml += "<?xml version=\"1.0\"?>";
		xml += "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">";
		xml += "<pdf>";
		xml += "<head>";
		xml += "<link name='freightDispPro' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_book.otf'/>";
		xml += "<link name='freightDispSB' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/FreightDispPro_semibold.otf'/>";
		xml += "<link name='brandonMed' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_med.otf'/>";
		xml += "<link name='brandon' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_reg.otf'/>";
		xml += "<link name='brandonBold' type='font' subtype='opentype' src='https://www.brilliantearth.com/media/style/bearth/fonts/Brandon_bld.otf'/>";
		xml += "<style>";
		xml += " .brandonGrotesqueMed {font-family:brandonMed;}";
		xml += " .brandonGrotesque {font-family:brandon;}";
		xml += " .brandonGrotesqueBold {font-family:brandonBold;}";
		xml += " .freightDispProSB {font-family:freightDispSB;}";
		xml += " .freightDispPro {font-family:freightDispPro;}";
		xml += " .pt9 {font-size:9pt; line-height: 11pt;}";
		xml += " .pt10 {font-size:10pt; line-height: 14pt;}";
		xml += " .photo {}";
		xml += " .topborder {border-top: 1px solid black; margin-left: 400px;}";
		xml += "</style>";
		xml += "<macrolist>";
		xml += "<macro id='nlheader'>";
		xml += "<table cellborder='0' cellmargin='0' cellpadding='0'><tr><td style='color: #ffffff;'>Header</td></tr></table>";
		xml += "</macro>";
		xml += "</macrolist>";
		xml += "</head>";
		xml+= "<body size='letter' header='nlheader' header-height='35px'>";
		xml += pageData.join("<pbr/>");
		xml += "</body></pdf>";
		var file = nlapiXMLToPDF(xml);
		response.setContentType("PDF","Insurance_Appraisal.pdf","inline");
		response.write(file.getValue());

}	
	



/* New Metal List added by Shiv*/
/*function setMetal(metalID) {
    var metalName = "";
    switch (metalID) {
        case "1":
            metalName = "18K White Gold";
            break;
        case "2":
            metalName = "18K Yellow Gold";
            break;
        case "3":
            metalName = "Platinum";
            break;
        case "4":
            metalName = "Palladium";
            break;
        case "5":
            metalName = "14K White Gold";
            break;
        case "6":
            metalName = "14K Yellow Gold";
            break;
        case "7":
            metalName = "14K Rose Gold";
            break;
        case "9":
            metalName = "Sterling Silver";
            break;
        case "25":
            metalName = "10K White Gold";
            break;
        case "27":
            metalName = "10K Yellow Gold";
            break;
        case "32":
            metalName = "18K Rose Gold";
            break;
        case "35":
            metalName = "22K Yellow Gold";
            break;
        case "36":
            metalName = "9K Yellow Gold";
            break;
        case "41":
            metalName = "10K Rose Gold";
            break;
        case "44":
            metalName = "19K White Gold";
            break;
        case "45":
            metalName = "20K White Gold";
            break;
        case "46":
            metalName = "15K Yellow Gold";
            break;
        case "47":
            metalName = "12K White Gold";
            break;
        case "48":
            metalName = "21K White Gold";
            break;
        case "51":
            metalName = "15K Yellow Gold";
            break;
        case "53":
            metalName = "21K Rose Gold";
            break;
        case "54":
            metalName = "21K Yellow Gold";
            break;
        case "55":
            metalName = "17K White Gold";
            break;
        case "59":
            metalName = "15K Rose Gold";
            break;
        case "66":
            metalName = "19K Yellow Gold";
            break;
        case "67":
            metalName = "9K Rose Gold";
            break;
        case "69":
            metalName = "14K Yellow Gold, 18k Yellow Gold";
            break;
        case "70":
            metalName = "14K White Gold, 14K Yellow Gold";
            break;
        case "75":
            metalName = "Platinum, 18K White Gold";
            break;
        case "77":
            metalName = "18K White Gold, 18K Yellow Gold";
            break;
        case "78":
            metalName = "10K White Gold, 10K Yellow Gold ";
            break;
        case "79":
            metalName = "14K Yellow Gold, Palladium";
            break;
        case "80":
            metalName = "8K Yellow Gold";
            break;
        case "81":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "82":
            metalName = "12K Rose Gold";
            break;
        case "84":
            metalName = "18K Yellow Gold, 18K Rose Gold";
            break;
        case "85":
            metalName = "18K White Gold, Platinum";
            break;
        case "86":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "87":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "89":
            metalName = "18K White Gold, 10K White Gold";
            break;
        case "90":
            metalName = "14K Yellow Gold, 14K White Gold";
            break;
        case "91":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "92":
            metalName = "18K Yellow Gold, Platinum";
            break;
        case "94":
            metalName = "14K Yellow Gold, Platinum";
            break;
        case "96":
            metalName = "Platinum, 10K White Gold";
            break;
        case "98":
            metalName = "15K Yellow Gold, Sterling Silver";
            break;
        case "99":
            metalName = "14K Yellow Gold, Sterling Silver";
            break;
        case "100":
            metalName = "14K White Gold, 18K Yellow Gold";
            break;
        case "101":
            metalName = "14K White Gold, 14K Yellow Gold";
            break;
        case "102":
            metalName = "14K Yellow Gold, Sterling Silver";
            break;
        case "103":
            metalName = "15K Yellow Gold, Sterling Silver";
            break;
        case "104":
            metalName = "18K Rose Gold, Platinum";
            break;
        case "105":
            metalName = "18K Yellow Gold, 18K White Gold";
            break;
        case "106":
            metalName = "Platinum,14K White Gold";
            break;
        case "107":
            metalName = "Platinum,14K Yellow Gold";
            break;
        case "109":
            metalName = "18K White Gold, 14K White Gold";
            break;
        case "110":
            metalName = "14K White Gold, 14K Rose Gold,14K Yellow Gold";
            break;
        case "111":
            metalName = "14K Yellow Gold, Selective Rhodium Plating";
            break;
        case "113":
            metalName = "10K Yellow Gold, 10K Rose Gold";
            break;
        case "115":
            metalName = "12K Yellow Gold";
            break;
        case "116":
            metalName = "22K Rose Gold";
            break;
        case "117":
            metalName = "18K Yellow Gold, Rhodium plating";
            break;
        case "118":
            metalName = "14K Rose Gold, 18K Yellow Gold";
            break;
        case "119":
            metalName = "18K Rose Gold, 14K Yellow Gold";
            break;
        case "120":
            metalName = "15K White Gold";
            break;
        case "121":
            metalName = "18K Yellow Gold, 22K Yellow Gold";
            break;
        case "122":
            metalName = "10K Yellow Gold, 14K White Gold";
            break;
        case "123":
            metalName = "14K Yellow Gold, 14K White Gold";
            break;
        case "124":
            metalName = "14K White Gold, 18K White Gold";
            break;
        case "125":
            metalName = "14K Yellow Gold, 10K White Gold";
            break;
        case "126":
            metalName = "12K Yellow Gold, Selective Rhodium Plating";
            break;
        case "129":
            metalName = "18k Yellow Gold, Selective Rhodium Plating";
            break;
        case "130":
            metalName = "14K White Gold, 14K Rose Gold";
            break;
        case "131":
            metalName = "18K Rose Gold, Selective Rhodium Plating";
            break;
        case "132":
            metalName = "14K Yellow Gold, 18K White Gold";
            break;
        case "133":
            metalName = "17K Yellow Gold";
            break;
        case "134":
            metalName = "14K Yellow Gold,Palladium";
            break;
    }
    return metalName;
}*/
/*end Metal List*/


function formatDate(dateStr)
{
	var rtnStr = "";
	var dateObj = nlapiStringToDate(dateStr);
	var month = dateObj.getMonth();
	switch(month)
	{
		case 0:
			rtnStr += "January ";
			break;
		case 1:
			rtnStr += "February ";
			break;
		case 2:
			rtnStr += "March ";
			break;
		case 3:
			rtnStr += "April ";
			break;
		case 4:
			rtnStr += "May ";
			break;
		case 5:
			rtnStr += "June ";
			break;
		case 6:
			rtnStr += "July ";
			break;
		case 7:
			rtnStr += "August ";
			break;
		case 8:
			rtnStr += "September ";
			break;
		case 9:
			rtnStr += "October ";
			break;
		case 10:
			rtnStr += "November ";
			break;
		case 11:
			rtnStr += "December ";
			break;
	}
	
	rtnStr += dateObj.getDate() + ", " + dateObj.getFullYear();
	
	return rtnStr;
}


function addCommas(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
// Block-1 start to Calculate Halo Melee Count Added By Shiv//
function getHaloMeleeDetail(dmd_Id,dmd_ParentItemId,searchResult)
{


	var haloMeleeResult=[];
	if((dmd_Id!='' && dmd_ParentItemId!=null))
	{
		   
		   var haloCheck='F';
		   var grpItemArr=[];
			var diamondMesearure=nlapiLookupField("item",dmd_Id,"custitem30"); 
			var diamondShape=nlapiLookupField("item",dmd_Id,"custitem5");
			var mesearureSize=0;
			if(diamondMesearure!='' && diamondMesearure!=null)
			{
			 mesearureSize=diamondMesearure.split('x')[0];
			}
			var itemFields=["parent","custitem20","custitem9","custitem11","custitem13","custitem94","custitem_sub_item_5","custitem_sub_item_6","custitem_sub_item_7"];
			var Item=nlapiLookupField("item",dmd_ParentItemId,itemFields);
			var itemParentId=Item.parent;
			 var itemParentName='';
			 var haloMeleeCollection='';
			if(itemParentId!='' && itemParentId!=null)
			{
			  itemParentName=nlapiLookupField("item",dmd_ParentItemId,"parent",true);
			//  haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitem78");
			// added new code on 30 march 2017
			 haloMeleeCollection=nlapiLookupField("item",itemParentId,"custitemhalo_setting");
			}
			if(haloMeleeCollection=='T' && diamondShape=='1') // Check for Halo Settings Collection & diamond Shape
			{			    				
				var itemCategId=Item.custitem20;
				var subItem1=Item.custitem9;
				var subItem2=Item.custitem11;
				var subItem3=Item.custitem13;
				var subItem4=Item.custitem94;
				var subItem5=Item.custitem_sub_item_5;
				var subItem6=Item.custitem_sub_item_6;
				var subItem7=Item.custitem_sub_item_7
				var stockUnit=0;
				if(subItem1!='' && subItem1!=null)
				{
					var gemStoneCarat=0;	
                    var gemStoneCount=0;
					//var sunbItemShape1=nlapiLookupField("item",subItem1,"custitem5");
					var sunbItemShape1=getItemHaloShape(subItem1);
					if(sunbItemShape1=='1')
					{
						grpItemArr.push({subItemId:subItem1,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}
				  
				}
				if(subItem2!='' && subItem2!=null)
				{
					var subItemShape2=getItemHaloShape(subItem2);					
					if(subItemShape2=='1')
					{	
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem10");	
                        var myStockUnitStr= nlapiLookupField("item",subItem2,"stockunit",true);						
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem2,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				if(subItem3!='' && subItem2!=null)
				{
					var subItemShape3=getItemHaloShape(subItem3);
					if(subItemShape3=='1')
					{
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem12");
						var myStockUnitStr= nlapiLookupField("item",subItem3,"stockunit",true);
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem3,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				if(subItem4!='' && subItem4!=null)
				{
					var subItemShape4=getItemHaloShape(subItem4);
					if(subItemShape4=='1')
					{
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem95");
						var myStockUnitStr= nlapiLookupField("item",subItem4,"stockunit",true);
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem4,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				if(subItem5!='' && subItem5!=null)
				{
					var subItemShape5=getItemHaloShape(subItem5);
					if(subItemShape5=='1')
					{
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_5");
						var myStockUnitStr= nlapiLookupField("item",subItem5,"stockunit",true);
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem5,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				if(subItem6!='' && subItem6!=null)
				{
					var subItemShape6=getItemHaloShape(subItem6);
					if(subItemShape6=='1')
					{
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_6");
						var myStockUnitStr= nlapiLookupField("item",subItem6,"stockunit",true);
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem6,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				if(subItem7!='' && subItem7!=null)
				{
					var subItemShape7=getItemHaloShape(subItem7);
					if(subItemShape7=='1')
					{
						var gemStoneCarat=0;	
                        var gemStoneCount=nlapiLookupField("item",dmd_ParentItemId,"custitem_quantity_7");
						var myStockUnitStr= nlapiLookupField("item",subItem7,"stockunit",true);
						if(myStockUnitStr!=null && myStockUnitStr!='')
						{
							stockUnit=myStockUnitStr.split(' ')[0];
						}
						if(gemStoneCount > 0 && stockUnit!=0)
						{							
							gemStoneCarat=parseFloat(gemStoneCount) * parseFloat(stockUnit);
							gemStoneCarat=Math.round(gemStoneCarat * 100)/100;
							gemStoneCarat=gemStoneCarat.toFixed(2);
						}
					  grpItemArr.push({subItemId:subItem7,gemStone:gemStoneCount,gemCarat:gemStoneCarat});
					}				  
				}
				var totGemStone=0;
				var totGemCarat=0;
				var meleeSize=0;
				if((subItem1!='' && subItem1!=null) && grpItemArr.length==1)
				{
				  meleeSize=1;
				}
				else if((subItem2!='' && subItem2!=null) && grpItemArr.length>=1)
				{
					meleeSize=2; // If more than 1 melee Size stone found
					
					for(var i=0;i<grpItemArr.length;i++)
					{
					  
					  var gemStone=grpItemArr[i].gemStone;
					  var gemCarat=grpItemArr[i].gemCarat;
					  totGemStone=parseInt(totGemStone)+parseInt(gemStone);
					  totGemCarat=parseFloat(totGemCarat)+ parseFloat(gemCarat);
					  var j=0;
					}
				}	
				if(meleeSize==1 || meleeSize==2)
				{
				
					var haloMeleeArr=[];
					//var count=searchResult.length;
					if(searchResult.length>0)
					{
						
						//var itemMeleeSizeId=grpItemArr[0];
						/*var itemMeleeSizeId=grpItemArr[0].subItemId;
						var itemMeleeSize=nlapiLookupField("item",itemMeleeSizeId,"itemid");*/
						for(i=0;i<searchResult.length;i++)
						{
							var hmSize=0;
							var hmId = searchResult[i].hmId;							
							var hmGemCount = searchResult[i].hmGemCount;                            					
							var hmSize = searchResult[i].hmSize;
							var hmMeleeSize = searchResult[i].hmMeleeSize;
							var hmParantItemId= searchResult[i].hmParantItemId;
							if(hmParantItemId==itemParentId)
							{								
							  haloMeleeArr.push({hmId:hmId,hmSize:hmSize,hmGemCount:hmGemCount,hmMeleeSize:hmMeleeSize});
							}
							
							
						}
                      nlapiLogExecution("debug","haloMeleeArr (Test )",JSON.stringify(haloMeleeArr));	
							
						haloMeleeArr.sort(function(a, b) {
						return a.hmSize- b.hmSize;
						});
						var k=0; range1 = 0, range2=0,range3=0; 
						var gemCount=0;
						var haloMeleeId=0;
						var haloMeleeSize='';
						for(var i=0; i<haloMeleeArr.length; i++)
						{
						   range1 = parseFloat(haloMeleeArr[i].hmSize) - 0.25;
						   range2 = parseFloat(haloMeleeArr[i].hmSize) + 0.25;
						   range3 = parseFloat(haloMeleeArr[i].hmSize);					   					   
						   if((range1 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2) || (range3 < parseFloat(mesearureSize) && parseFloat(mesearureSize) < range2))
						   {
							   gemCount=haloMeleeArr[i].hmGemCount;
							   haloMeleeId=haloMeleeArr[i].hmId;
							   haloMeleeSize=haloMeleeArr[i].hmMeleeSize;
							   break;
						   }
						}
                        nlapiLogExecution("debug","haloMeleeSize (Test )",haloMeleeSize);	
						// get halo melee size
                        if( haloMeleeId > 0 && (haloMeleeSize!='' && haloMeleeSize!=null))                
						{
						    var filters = new Array();
							filters[0] = new nlobjSearchFilter('type',null,'is','InvtPart'); //Item type will be Inventory Item
							filters[1] = new nlobjSearchFilter('itemid',null,'is',haloMeleeSize); //itemname
							var results_s = nlapiSearchRecord('item', null, filters, new nlobjSearchColumn('itemid'));
							var haloItemId='';
							var haloItemName='';
							for (var i in results_s)
							{
								 haloItemId = results_s[i].getId();
								 haloItemName = results_s[i].getValue('itemid');
								 break;
							}
                            if(haloItemId!='' && haloItemId!=null)
							{
                               nlapiLogExecution("debug","haloItemId (Test )",haloItemId);	
								var myStockUnitStr= nlapiLookupField("item",haloItemId,"stockunit",true);
                                  nlapiLogExecution("debug","myStockUnitStr (Test )",myStockUnitStr);	
								if(myStockUnitStr!=null && myStockUnitStr!='')
								{
									stockUnit=myStockUnitStr.split(' ')[0];
								}
							}
						
						}
						//end halo melee size
						var totMinCarat=0;
						if(gemCount > 0 && stockUnit!=0 ) 
						{
							totMinCarat=parseFloat(gemCount) * parseFloat(stockUnit);
							totMinCarat=Math.round(totMinCarat * 100)/100;
							totMinCarat=totMinCarat.toFixed(2);
							if(meleeSize==2)
							{							  
							  gemCount=parseInt(totGemStone)+parseInt(gemCount);
							  totMinCarat=parseFloat(totMinCarat)+parseFloat(totGemCarat);
							  totMinCarat=totMinCarat.toFixed(2);
							}
							haloCheck='T';						
							haloMeleeResult.push({
										haloCheck:haloCheck,
										haloDmdShape:diamondShape,									
										haloMeleeId:haloMeleeId,
										haloMesearure:mesearureSize,
										totalGem:gemCount,
										stockUnit:stockUnit,
										totMinCarat:totMinCarat
										
							});
						}
					}
				}
			}
		
	}
	return haloMeleeResult;
}
function getItemHaloShape(itemId)
{
  var shape='0';
   shape=nlapiLookupField("item",itemId,"custitem5");
  return shape;
}


function isCheckEternity(myItemId)
{
	var eternityFlag='F';
	if(myItemId!='' && myItemId!=null)
	{
		//var fields = ["custitemeternitymeleecountsize3","custitemeternitymeleecountsize35","custitemeternitymeleecountsize4","custitemeternitymeleecountsize45","custitemeternitymeleecountsize5","custitemeternitymeleecountsize55","custitemeternitymeleecountsize6","custitemeternitymeleecountsize65","custitemeternitymeleecountsize7","custitemeternitymeleecountsize75","custitemeternitymeleecountsize8","custitemeternitymeleecountsize85","custitemeternitymeleecountsize9"];
      
        var fields = ["custitemeternitymeleecountsize3","custitemeternitymeleecountsize35","custitemeternitymeleecountsize4","custitemeternitymeleecountsize45","custitemeternitymeleecountsize5","custitemeternitymeleecountsize55","custitemeternitymeleecountsize6","custitemeternitymeleecountsize65","custitemeternitymeleecountsize7","custitemeternitymeleecountsize75","custitemeternitymeleecountsize8","custitemeternitymeleecountsize85","custitemeternitymeleecountsize9","custitemeternitymeleecountsize95","custitemeternitymeleecountsize10","custitemeternitymeleecountsize105","custitemeternitymeleecountsize11","custitemeternitymeleecountsize115","custitemeternitymeleecountsize12","custitemeternitymeleecountsize125"];
		var eternityItem = nlapiLookupField("item",myItemId,fields);
		var eMC3=eternityItem.custitemeternitymeleecountsize3;
		var eMC35=eternityItem.custitemeternitymeleecountsize35;
		var eMC4=eternityItem.custitemeternitymeleecountsize4;
		var eMC45=eternityItem.custitemeternitymeleecountsize45;
		var eMC5=eternityItem.custitemeternitymeleecountsize5;
		var eMC55=eternityItem.custitemeternitymeleecountsize55;
		var eMC6=eternityItem.custitemeternitymeleecountsize6;
		var eMC65=eternityItem.custitemeternitymeleecountsize65;
		var eMC7=eternityItem.custitemeternitymeleecountsize7;
		var eMC75=eternityItem.custitemeternitymeleecountsize75;
		var eMC8=eternityItem.custitemeternitymeleecountsize8;
		var eMC85=eternityItem.custitemeternitymeleecountsize85;
		var eMC9=eternityItem.custitemeternitymeleecountsize9;
         //added new enternity melee count size
        var eMC95=eternityItem.custitemeternitymeleecountsize95;
        var eMC10=eternityItem.custitemeternitymeleecountsize10;
        var eMC105=eternityItem.custitemeternitymeleecountsize105;
        var eMC11=eternityItem.custitemeternitymeleecountsize11;
        var eMC115=eternityItem.custitemeternitymeleecountsize115;
        var eMC12=eternityItem.custitemeternitymeleecountsize12;
        var eMC125=eternityItem.custitemeternitymeleecountsize125;
		//if(eMC3.length > 0 || eMC35.length > 0 || eMC4.length > 0 || eMC45.length > 0 || eMC5.length > 0 || eMC55.length > 0 || eMC6.length > 0 || eMC65.length > 0 || eMC7.length > 0 || eMC75.length > 0 || eMC8.length > 0 || eMC85.length > 0 || eMC9.length > 0)  
        if(eMC3.length > 0 || eMC35.length > 0 || eMC4.length > 0 || eMC45.length > 0 || eMC5.length > 0 || eMC55.length > 0 || eMC6.length > 0 || eMC65.length > 0 || eMC7.length > 0 || eMC75.length > 0 || eMC8.length > 0 || eMC85.length > 0 || eMC9.length > 0 || eMC95.length>0 || eMC10.length>0 || eMC105.length>0 ||eMC11.length>0 || eMC115.length>0 || eMC12.length>0 || eMC125.length>0)  
		{
		  eternityFlag='T';
		}
	}
	return eternityFlag;
}
function getEternityMeleeDetail(myItemId)
{
   var eternityMeleeArr=[];
   if(myItemId!='' && myItemId!=null)
   {
		var fields = ["parent","custitem9"];
		var item = nlapiLookupField("item",myItemId,fields);
		var myParentItemId=item.parent;
		var myChildId=item.custitem9;
		if(myChildId!='' && myChildId !=null)     
		{
			var ringSize = nlapiLookupField("item",myItemId,"custitem2",true); //get ring Size;
			var fracPart=0, wholePart=0;
			if(ringSize.length >1)
			{ 
    
				wholePart=ringSize.split('.')[0];
				fracPart=ringSize.split('.')[1];// Get fraction part of ring size
				fracPart='0.'+fracPart;  
				if(parseFloat(fracPart)>=0 && parseFloat(fracPart)<=0.49)
				{
					//ringSize= Math.round(ringSize);
					ringSize=wholePart;
				}
				else if(parseFloat(fracPart)>=0.50 && parseFloat(fracPart)<=0.99)
				{
					//ringSize= Math.round(ringSize);                           
					ringSize=wholePart+'5';					 
				}
			}
			var fldName="custitemeternitymeleecountsize"+ringSize;
			var EternityMeleeCount=nlapiLookupField("item",myItemId,fldName); //custitemeternitymeleecountsize6			
            var isEternity= nlapiLookupField("item",myParentItemId,"custitem172");				
            var myStockUnitStr= nlapiLookupField("item",myChildId,"stockunit",true);
			var stockUnit='';
			var totalCarat='';
			var NoOfGemStone='';
			if(myStockUnitStr!=null && myStockUnitStr!='')
			{
			  stockUnit=myStockUnitStr.split(' ')[0];
			}
			if(isEternity=='1');
			{
				NoOfGemStone=EternityMeleeCount; 
				if(NoOfGemStone=='' || NoOfGemStone==null)
				{
				  NoOfGemStone='0';
				}
				if((stockUnit !='' && stockUnit != null) && (NoOfGemStone !='' && NoOfGemStone != null))
				{
					totalCarat=parseFloat(NoOfGemStone) * parseFloat(stockUnit);
					totalCarat=Math.round(totalCarat * 100)/100;
					totalCarat=totalCarat.toFixed(2);
					eternityMeleeArr.push({NoOfGemStone:NoOfGemStone,
					totalCarat:totalCarat});

				}
			}
		}
	}
 
  return eternityMeleeArr;
}


