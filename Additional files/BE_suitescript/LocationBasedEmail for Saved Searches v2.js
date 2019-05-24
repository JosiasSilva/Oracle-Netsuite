nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Feb 2015     geetha
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	if (type =='scheduled' || type =='userinterface') {
		try{
		// Start: ZAG : NS-1457
		var objSalesRep = {};
		var arrSalesRepLoc = ["2","10","14","18","25","26","30"];
		var objShowroomLocation = {"2":"San Francisco","10":"Los Angeles","14":"Boston","18":"Chicago","25":"SD (San Diego)","26":"Washington D.C.","30":"Denver"};
		//var objLocEmail = {"2":"sfcs@brilliantearth.com","10":"weho@brilliantearth.com", "14":"boston@brilliantearth.com","18":"Chicago@brilliantearth.com", "25":"sandiego@brilliantearth.com", "26":"dc@brilliantearth.com", "30":"denvercs@brilliantearth.com"};
		
		var objLocEmail = {"2":9094322,"10":2169423,"14":3922427,"18":7384924,"25":8537928,"26":8867166,"30":10464794};

		/*
		// Location		Id			Email
		//---------------------------------------------
		- None -	 
		Boston			14		boston@brilliantearth.com
		Chicago			18		Chicago@brilliantearth.com
		Denver			30		denvercs@brilliantearth.com
		Los Angeles		10		weho@brilliantearth.com
		San Francisco	2		sfcs@brilliantearth.com
		SD (San Diego)	25		sandiego@brilliantearth.com
		Washington D.C.	26		dc@brilliantearth.com
		*/

		var EmpSearch = nlapiSearchRecord("employee",null,
		[["salesrep","is","T"]], 
		[new nlobjSearchColumn("entityid"), new nlobjSearchColumn("custentity85")]);
		//nlapiLogExecution('Debug','EmpSearch :',EmpSearch.length + ' : ' + JSON.stringify(EmpSearch));
		for(var ln=0; EmpSearch!=null && ln <EmpSearch.length; ln++) { 
			var name= EmpSearch[ln].getValue('entityid');
			objSalesRep[name] = EmpSearch[ln].getValue('custentity85');
		}

			//niraj
		
			// 2825 search....
			 var salesrepArray18 =new Array();
			 var SetsterApptsSearch = nlapiLoadSearch(null,2825);
			 var searchResults18 = SetsterApptsSearch.runSearch();
			 var index18 = 0; 
			 var resultStep18 = 1000; 
			 var resultSet18;
			 do { 
				 resultSet18 = searchResults18.getResults(index18, index18 + resultStep18);
	             index18 = index18 + resultStep18;
	             for(var a=0; resultSet18!=null && a<resultSet18.length; a++) { 
	            	 var results18 = resultSet18[a];
	            	 // Get all Result columns
	                 var cols18= results18.getAllColumns();
	                 var salesrepsetsterappts= results18.getText(cols18[1]);
	                 //nlapiLogExecution('Debug','sales rep setster appts :',salesrepsetsterappts);
	                 salesrepArray18.push(validate(salesrepsetsterappts));
	            	 
	             }
			 }while (resultSet18.length >= 1000);

						
			// 1500 search....
			 var salesrepArray17 =new Array();
			 var statusSearch = nlapiLoadSearch(null,1500);
			 var searchResults17 = statusSearch.runSearch();
			 var index17 = 0; 
			 var resultStep17 = 1000; 
			 var resultSet17;
			 do { 
				 resultSet17 = searchResults17.getResults(index17, index17 + resultStep17);
	             index17 = index17 + resultStep17;
	             for(var w=0; resultSet17!=null && w<resultSet17.length; w++) { 
	            	 var results17 = resultSet17[w];
	            	 // Get all Result columns
	                 var cols17= results17.getAllColumns();
	                 var salesrepstatus= results17.getText(cols17[5]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray17.push(validate(salesrepstatus));
	            	 
	             }
			 }while (resultSet17.length >= 1000);
			
			// 1329 search....
			 var salesrepArray16 =new Array();
			 var appSearch = nlapiLoadSearch(null,1329);
			 var searchResults16 = appSearch.runSearch();
			 var index16 = 0; 
			 var resultStep16 = 1000; 
			 var resultSet16;
			 do { 
				 resultSet16 = searchResults16.getResults(index16, index16 + resultStep16);
	             index16 = index16 + resultStep16;
	             for(var v=0; resultSet16!=null && v<resultSet16.length; v++) { 
	            	 var results16 = resultSet16[v];
	            	 // Get all Result columns
	                 var cols16 = results16.getAllColumns();	                
			 var salesrepapp= results16.getText(cols16[7]); // group by Appt. Taken By
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray16.push(validate(salesrepapp));
	            	 
	             }
			 }while (resultSet16.length >= 1000);
			 
			// 5422 used to be 2113 search....
			/* var salesrepArray15 =new Array();
			 var followSearch = nlapiLoadSearch(null,5422);
			 var searchResults15 = followSearch.runSearch();
			 var index15 = 0; 
			 var resultStep15 = 1000; 
			 var resultSet15;
			 do { 
				 resultSet15 = searchResults15.getResults(index15, index15 + resultStep15);
	             index15 = index15 + resultStep15;
	             for(var u=0; resultSet15!=null && u<resultSet15.length; u++) { 
	            	 var results15 = resultSet15[u];
	            	 // Get all Result columns
	                 var cols15 = results15.getAllColumns();
	                 var salesrepfollow= results15.getText(cols15[4]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray15.push(validate(salesrepfollow));
	            	 
	             }
			 }while (resultSet15.length >= 1000);
			 
			 var salesrepArrayResults15= count(salesrepArray15);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 15:', salesrepArrayResults15);
			 var customerfollow='';
				if(salesrepArrayResults15==''){
					customerfollow="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults15) {
						customerfollow = customerfollow+'<br/>'+salesrepArrayResults15[a];
					}
					//customerfollow=salesrepArrayResults15;
				} */
	
			// Shiv added new code for 5th search				
			// 3327 search....
			 var salesrepArray14 =new Array();
			 var ringsSearch = nlapiLoadSearch(null,3327);
			 var searchResults14 = ringsSearch.runSearch();
			 var index14 = 0; 
			 var resultStep14 = 1000; 
			 var resultSet14;
			 do { 
				 resultSet14 = searchResults14.getResults(index14, index14 + resultStep14);
	             index14 = index14 + resultStep14;
	             for(var u=0; resultSet14!=null && u<resultSet14.length; u++) { 
	            	 var results14 = resultSet14[u];
	            	 // Get all Result columns
	                 var cols14 = results14.getAllColumns();
	                 var salesRepGroup= results14.getText(cols14[0]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray14.push(validate(salesRepGroup));	            	 
	             }
			 }while (resultSet14.length >= 1000);
			 
			
			// Ajay added new code for 6th search				
			// 3082 search....
			 var salesrepArray13 =new Array();
			 var ringsSearch = nlapiLoadSearch(null,3082);
			 var searchResults13 = ringsSearch.runSearch();
			 var index13 = 0; 
			 var resultStep13 = 1000; 
			 var resultSet13;
			 do { 
				 resultSet13 = searchResults13.getResults(index13, index13 + resultStep13);
	             index13 = index13 + resultStep13;
	             for(var u=0; resultSet13!=null && u<resultSet13.length; u++) { 
	            	 var results13 = resultSet13[u];
	            	 // Get all Result columns
	                 var cols13 = results13.getAllColumns();
	                 var salesreprings= results13.getText(cols13[3]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray13.push(validate(salesreprings));	            	 
	             }
			 }while (resultSet13.length >= 1000);
			
			// 2506 search....
			 var salesrepArray12 =new Array();
			 var misSearch = nlapiLoadSearch(null,2506);
			 var searchResults12 = misSearch.runSearch();
			 var index12 = 0; 
			 var resultStep12 = 1000; 
			 var resultSet12;
			 do { 
				 resultSet12 = searchResults12.getResults(index12, index12 + resultStep12);
	             index12 = index12 + resultStep12;
	             for(var t=0; resultSet12!=null && t<resultSet12.length; t++) { 
	            	 var results12 = resultSet12[t];
	            	 // Get all Result columns
	                 var cols12 = results12.getAllColumns();
	                 var salesrepmis= results12.getText(cols12[2]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray12.push(validate(salesrepmis));
	            	 
	             }
			 }while (resultSet12.length >= 1000);
			
			// Added by ajay for 8th search	
			// 3181 search....
			 var salesrepArray11 =new Array();
			 var misSearch = nlapiLoadSearch(null,3181);
			 var searchResults11 = misSearch.runSearch();
			 var index11 = 0; 
			 var resultStep11 = 1000; 
			 var resultSet11;
			 do { 
				 resultSet11 = searchResults11.getResults(index11, index11 + resultStep11);
	             index11 = index11 + resultStep11;
	             for(var t=0; resultSet11!=null && t<resultSet11.length; t++) { 
	            	 var results11 = resultSet11[t];
	            	 // Get all Result columns
	                 var cols11 = results11.getAllColumns();
	                 var salesreplead= results11.getText(cols11[1]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray11.push(validate(salesreplead));
	            	 
	             }
			 }while (resultSet11.length >= 1000);
			
			 // Ended by ajay
			 
			 // Added by Stuti
			 // 3705 search....
			 var salesrepArray10 =new Array();
			 var misSearch = nlapiLoadSearch(null,3705);
			 var searchResults10 = misSearch.runSearch();
			 var index10 = 0; 
			 var resultStep10 = 1000; 
			 var resultSet10;
			 do { 
				 resultSet10 = searchResults10.getResults(index10, index10 + resultStep10);
	             index10 = index10 + resultStep10;
	             for(var t=0; resultSet10!=null && t<resultSet10.length; t++) { 
	            	 var results10 = resultSet10[t];
	            	 // Get all Result columns
	                 var cols10 = results10.getAllColumns();
	                 var salesrepestimate= results10.getText(cols10[4]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray10.push(validate(salesrepestimate));
	            	 
	             }
			 }while (resultSet10.length >= 1000);
			
				// Ended by Stuti
			
			// 748 search....
			 var salesrepArray9 =new Array();
			 var gemSearch = nlapiLoadSearch(null,748);
			 var searchResults9  = gemSearch.runSearch();
			 var index9 = 0; 
			 var resultStep9 = 1000; 
			 var resultSet9;
			 do { 
				 resultSet9 = searchResults9.getResults(index9, index9 + resultStep9);
	             index9 = index9 + resultStep9;
	             for(var s=0; resultSet9!=null && s<resultSet9.length; s++) { 
	            	 var results9 = resultSet9[s];
	            	 // Get all Result columns
	                 var cols9 = results9.getAllColumns();
	                 var salesrepgem= results9.getText(cols9[2]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray9.push(validate(salesrepgem));
	            	 
	             }
			 }while (resultSet9.length >= 1000);
			
			 // 1360 search....
			 var salesrepArray8 =new Array();
			 var opencsSearch = nlapiLoadSearch(null,1360);
			 var searchResults8  = opencsSearch.runSearch();
			 var index8 = 0; 
			 var resultStep8 = 1000; 
			 var resultSet8;
			 do { 
				 resultSet8 = searchResults8.getResults(index8, index8 + resultStep8);
	             index8 = index8 + resultStep8;
	             for(var r=0; resultSet8!=null && r<resultSet8.length; r++) { 
	            	 var results8 = resultSet8[r];
	            	 // Get all Result columns
	                 var cols8 = results8.getAllColumns();
	                 var salesrepopencs= results8.getText(cols8[6]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray8.push(validate(salesrepopencs));
	            	 
	             }
			 }while (resultSet8.length >= 1000);
						
			 // 199 search....
			 var salesrepArray7 =new Array();
			 var noemailSearch = nlapiLoadSearch(null,199);
			 var searchResults7  = noemailSearch.runSearch();
			 var index7 = 0; 
			 var resultStep7 = 1000; 
			 var resultSet7;
			 do { 
				 resultSet7 = searchResults7.getResults(index7, index7 + resultStep7);
	             index7 = index7 + resultStep7;
	             for(var q=0; resultSet7!=null && q<resultSet7.length; q++) { 
	            	 var results7 = resultSet7[q];
	            	 // Get all Result columns
	                 var cols7 = results7.getAllColumns();
	                 //var salesrepnoemail= results7.getText(cols7[6]);   //commented by ajay
                         var salesrepnoemail= results7.getText(cols7[5]);      //added by ajay
	               //  nlapiLogExecution('Debug','salesrepnoemail :',salesrepnoemail);
	                 salesrepArray7.push(validate(salesrepnoemail));
	            	 
	             }
			 }while (resultSet7.length >= 1000);
			
			 // 1868 search....
			 var salesrepArray6 =new Array();
			 var photoSearch = nlapiLoadSearch(null,1868);
			 var searchResults6  = photoSearch.runSearch();
			 var index6 = 0; 
			 var resultStep6 = 1000; 
			 var resultSet6;
			 do { 
				 resultSet6 = searchResults6.getResults(index6, index6 + resultStep6);
	             index6 = index6 + resultStep6;
	             for(var p=0; resultSet6!=null && p<resultSet6.length; p++) { 
	            	 var results6 = resultSet6[p];
	            	 // Get all Result columns
	                 var cols6 = results6.getAllColumns();
	                 var salesrepphoto= results6.getText(cols6[1]);
	                // nlapiLogExecution('Debug','salesrepphoto :',salesrepphoto);
	                 salesrepArray6.push(validate(salesrepphoto));
	            	 
	             }
			 }while (resultSet6.length >= 1000);
		
			// 795 search....
			 var salesrepArray5 =new Array();
			 var repairSearch = nlapiLoadSearch(null,795);
			 var searchResults5  = repairSearch.runSearch();
			 var index5 = 0; 
			 var resultStep5 = 1000; 
			 var resultSet5;
			 do { 
				 resultSet5 = searchResults5.getResults(index5, index5 + resultStep5);
	             index5 = index5 + resultStep5;
	             for(var o=0; resultSet5!=null && o<resultSet5.length; o++) { 
	            	 var results5 = resultSet5[o];
	            	 // Get all Result columns
	                 var cols5 = results5.getAllColumns();
	                 var salesreprepair= results5.getText(cols5[4]);
	                 //nlapiLogExecution('Debug','salesrep repair :',salesreprepair);
	                 salesrepArray5.push(validate(salesreprepair));
	            	 
	             }
			 }while (resultSet5.length >= 1000);
			
			 // 842 search....
			 var salesrepArray3 =new Array();
			 var cusSearch = nlapiLoadSearch(null,842);
			 var searchResults3  = cusSearch.runSearch();
			 var index3 = 0; 
			 var resultStep3 = 1000; 
			 var resultSet3;
			 do { 
				 resultSet3 = searchResults3.getResults(index3, index3 + resultStep3);
	             index3 = index3 + resultStep3;
	             for(var m=0; resultSet3!=null && m<resultSet3.length; m++) { 
	            	 var results3 = resultSet3[m];
	            	 // Get all Result columns
	                 var cols3 = results3.getAllColumns();
	                 var salesrepcus= results3.getText(cols3[6]);
	                // nlapiLogExecution('Debug','salesrep cus :',salesrepcus);
	                 salesrepArray3.push(validate(salesrepcus));
	            	 
	             }
			 }while (resultSet3.length >= 1000);
						
			 // 692 search....
			 var salesrepArray2 =new Array();
			 var cadSearch = nlapiLoadSearch(null,692);
			 var searchResults2  = cadSearch.runSearch();
			 var index2 = 0; 
			 var resultStep2 = 1000; 
			 var resultSet2;
			 do { 
				 resultSet2 = searchResults2.getResults(index2, index2 + resultStep2);
	             index2 = index2 + resultStep2;
	             for(var l =0; resultSet2!=null && l<resultSet2.length; l++) { 
	            	 var results2 = resultSet2[l];
	            	 // Get all Result columns
	                 var cols2 = results2.getAllColumns();
	                 var salesrepcad= results2.getText(cols2[6]);
	               //  nlapiLogExecution('Debug','salesrep cad :',salesrepcad);
	                 salesrepArray2.push(validate(salesrepcad));
	            	 
	             }
			 }while (resultSet2.length >= 1000);
		
			 var salesrepArray =new Array();
			 //1028 first search results.......
			 var openSearch = nlapiLoadSearch('transaction', 'customsearch1028');
			 var searchResults  = openSearch.runSearch();
			 var index = 0; 
			 var resultStep = 1000; 
			 var resultSet;
			 do { 
				 resultSet = searchResults.getResults(index, index + resultStep);
	             index = index + resultStep;
	             for(var j =0; resultSet!=null && j<resultSet.length; j++) { 
	            	 var results = resultSet[j];
	            	 // Get all Result columns
	                 var cols = results.getAllColumns();
	                 var salesrep= results.getText(cols[5]);
	               //  nlapiLogExecution('Debug','salesrep :',salesrep);
	                 salesrepArray.push(validate(salesrep));
	            	 
	             }
			 }while (resultSet.length >= 1000);
		
			//nlapiLogExecution('DEBUG', 'OPEN :', open);
			 //1620 second search....
			 var salesrepArray1 =new Array();
			 var synchronySearch = nlapiLoadSearch(null,1620);
			 var searchResults1  = synchronySearch.runSearch();
			 var index1 = 0; 
			 var resultStep1 = 1000; 
			 var resultSet1;
			 do { 
				 resultSet1 = searchResults1.getResults(index1, index1 + resultStep1);
	             index1 = index1 + resultStep1;
	             for(var k =0; resultSet1!=null && k<resultSet1.length; k++) { 
	            	 var results1 = resultSet1[k];
	            	 // Get all Result columns
	                 var cols1 = results1.getAllColumns();
	                 var salesrepsyn= results1.getText(cols1[1]);
	                // nlapiLogExecution('Debug','salesrep :',salesrepsyn);
	                 salesrepArray1.push(validate(salesrepsyn));
	            	 
	             }
			 }while (resultSet1.length >= 1000);
		
			 
			 // 1531 search....
			 var salesrepArray4 =new Array();
			 var diamondSearch = nlapiLoadSearch(null,1531);
			 var searchResults4 = diamondSearch.runSearch();
			 var index4 = 0; 
			 var resultStep4 = 1000; 
			 var resultSet4;
			 do { 
				 resultSet4 = searchResults4.getResults(index4, index4 + resultStep4);
	             index4 = index4 + resultStep4;
	             for(var n=0; resultSet4!=null && n<resultSet4.length; n++) { 
	            	 var results4 = resultSet4[n];
	            	 // Get all Result columns
	                 var cols4 = results4.getAllColumns();
	                 //var salesrepdiamond= results4.getText(cols4[24]);
					 var salesrepdiamond= results4.getText(cols4[1]);
	                // nlapiLogExecution('Debug','salesrepdiamond:',salesrepdiamond);
	                 salesrepArray4.push(validate(salesrepdiamond));
	            	 
	             }
			 }while (resultSet4.length >= 1000);
			
			 // 5466 Saved Search - Added by Sandeep 12-Jan-2017 as per NS-542
			 
			 var salesrepArray5466 =new Array();
			 var CSRingSizer = nlapiLoadSearch(null,5466);
			 var searchResults5466 = CSRingSizer.runSearch();
			 var index5466 = 0; 
			 var resultStep5466 = 1000; 
			 var resultSet5466;
			 do { 
				 resultSet5466 = searchResults5466.getResults(index5466, index5466 + resultStep5466);
	             index5466 = index5466 + resultStep5466;
	             for(var n=0; resultSet5466!=null && n<resultSet5466.length; n++) { 
	            	 var results5466 = resultSet5466[n];
	            	 // Get all Result columns
	                 var cols5466 = results5466.getAllColumns();
	                 var salesrep_cs_ring_sizer= results5466.getText(cols5466[7]);
	                // nlapiLogExecution('Debug','salesrepdiamond:',salesrepdiamond);
	                 salesrepArray5466.push(validate(salesrep_cs_ring_sizer));
	            	 
	             }
			 }while (resultSet5466.length >= 1000);
		
			 
			 // Start: ZAG : NS-1457
		for(var loc=0; loc <arrSalesRepLoc.length; loc++) { 
			var srLoc = arrSalesRepLoc[loc];
			var email= objLocEmail[srLoc];
			var Location = objShowroomLocation[srLoc];
			//var subject="Consolidated Search Results for Location: " + Location + " : To email : (" + email +")";
			var subject="Consolidated Search Results for Location: " + Location;
			var arrSalesRepByLoc = getSalesRep(objSalesRep, srLoc);
						
			// 2825 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray18)
			var salesrepArrayResults18= count(arrSrchSalesRep);
			
			var setsterappts = getSearchResultStr(salesrepArrayResults18);
			// 1500 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray17)
			var salesrepArrayResults17= count(arrSrchSalesRep);
			
			var openstatus = getSearchResultStr(salesrepArrayResults17);
			// 1329 search....

			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray16)
			var salesrepArrayResults16= count(arrSrchSalesRep);
			
			var noitems = getSearchResultStr(salesrepArrayResults16);
			// 3327 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray14)
			var salesrepArrayResults14= count(arrSrchSalesRep);
			
			var leadFollow = getSearchResultStr(salesrepArrayResults14);
			
			// 3082 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray13)
			var salesrepArrayResults13= count(arrSrchSalesRep);
			
			var contouredringssold = getSearchResultStr(salesrepArrayResults13);
			
			// 2506 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray12)
			var salesrepArrayResults12= count(arrSrchSalesRep);
			
			var poststatus = getSearchResultStr(salesrepArrayResults12);
			
			// 3181 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray11)
			var salesrepArrayResults11= count(arrSrchSalesRep);
			
			var wellsfargoapp = getSearchResultStr(salesrepArrayResults11);
			
			// 3705 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray10)
			var salesrepArrayResults10= count(arrSrchSalesRep);
			
			var estimate = getSearchResultStr(salesrepArrayResults10);

			// 748 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray9)
			var salesrepArrayResults9= count(arrSrchSalesRep);
			
			var gem = getSearchResultStr(salesrepArrayResults9);

			// 1360 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray8)
			var salesrepArrayResults8= count(arrSrchSalesRep);
			
			var diamond = getSearchResultStr(salesrepArrayResults8);

			// 199 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray7)
			var salesrepArrayResults7= count(arrSrchSalesRep);
			
			var noemail = getSearchResultStr(salesrepArrayResults7);

			// 1868 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray6)
			var salesrepArrayResults6= count(arrSrchSalesRep);
			
			var photo = getSearchResultStr(salesrepArrayResults6);

			// 795 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray5)
			var salesrepArrayResults5= count(arrSrchSalesRep);
			
			var statusrepair = getSearchResultStr(salesrepArrayResults5);

			// 842 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray3)
			var salesrepArrayResults3= count(arrSrchSalesRep);
			
			var wax = getSearchResultStr(salesrepArrayResults3);

			// 692 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray2)
			var salesrepArrayResults2= count(arrSrchSalesRep);
			
			var waxwait = getSearchResultStr(salesrepArrayResults2);

			//1028 first search results.......
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray)
			var salesrepArrayResults= count(arrSrchSalesRep);
			
			var open = getSearchResultStr(salesrepArrayResults);

			//1620 second search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray1)
			var salesrepArrayResults1= count(arrSrchSalesRep);
			
			var syn = getSearchResultStr(salesrepArrayResults1);

			// 1531 search....
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray4)
			var salesrepArrayResults4= count(arrSrchSalesRep);
			
			var last = getSearchResultStr(salesrepArrayResults4);

			// 5466 Saved Search
			var arrSrchSalesRep = getSalesRepByLoc(arrSalesRepByLoc, salesrepArray5466)
			var salesrepArrayResults5466= count(arrSrchSalesRep);
			
			var cs = getSearchResultStr(salesrepArrayResults5466);


			//*************
			var body="<b>Open (CS) Ops/CS Status :</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1500 <br/> "+openstatus+" <br/><br/> <b> All Appointments - no items : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1329&whence= <br/> "+noitems+" <br/> <br/><b>My Leads To Follow Up With Today (for email) :</b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2806&whence=  <br/> "+leadFollow+" <br/><br/><b>Contoured Rings Sold :</b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3082&whence=  <br/> "+contouredringssold+" <br/><br/><b> MY Missing Post Appointment Status : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2446&whence <br/> "+poststatus+" <br/><br/><b> Wells Fargo App : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3181&whence <br/> "+wellsfargoapp+" <br/><br/><b> All CS Open Gem Requests : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=748 <br/> "+gem+" <br/> <br/><b> Quote Color Sample : </b><br/>https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3705&whence= <br/> "+estimate+" <br/> <br/><b> Diamond Request - Open CS : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1360&whence= <br/> "+diamond+" <br/><br/> <b>SO with no email confirmation :</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=199&whence= <br/> "+noemail+" <br/><br/><b> Photography Item Sent to CS : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1868&whence <br/> "+photo+" <br/><br/> <b>Open (CS) Status of Repairs/Resizes  :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=795&whence= <br/> "+statusrepair+"<br/> <br/><b>CAD/Wax-CS to send to customer  :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=842&whence= <br/> "+wax+" <br/> <br/><b> CAD or wax waiting on customer:</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=692 <br/> "+waxwait+" <br/><br/> <b>Open Quotes-CS Custom Quote Search (est)  : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1028&whence= <br/>  "+open+" <br/><br/><b> Synchrony App Ready To Be Sent to Customer :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1620&whence <br/> "+syn+" <br/><br/><b> Diamond Unavailable-Options pending customer decision : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1531&whence <br/>"+last+" <br/><br/><b>CS - Ring Sizer Returned to Sender - Need to Contact : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=5466&whence= <br/> "+cs;
			
			try{
				nlapiSendEmail(20186, email, subject, body, "jhaas@brilliantearth.com"); //Removed anerger@brilliantearth.com - JHaas 1/18/19
				
				//nlapiLogExecution('DEBUG', 'mail sent ', subject + ' : to :' + email);
				 
			 }catch(e){
					nlapiLogExecution('DEBUG', 'error ', e);
				}
			
		}
		
		// script for UnAssigned Appointments
		//**********
		// 2825 search....
		var unAsgn_setsterappts = "Unassigned" + "-" + countUnAssigned(salesrepArray18);

		// 1500 search....
		var unAsgn_openstatus = "Unassigned" + "-" + countUnAssigned(salesrepArray17);

		// 1329 search....
		var unAsgn_noitems = "Unassigned" + "-" + countUnAssigned(salesrepArray16);

		// 3327 search....
		var unAsgn_leadFollow = "Unassigned" + "-" + countUnAssigned(salesrepArray14);

		// 3082 search....
		var unAsgn_contouredringssold = "Unassigned" + "-" + countUnAssigned(salesrepArray13);

		// 2506 search....
		var unAsgn_poststatus = "Unassigned" + "-" + countUnAssigned(salesrepArray12);

		// 3181 search....
		var unAsgn_wellsfargoapp = "Unassigned" + "-" + countUnAssigned(salesrepArray11);

		// 3705 search....
		var unAsgn_estimate = "Unassigned" + "-" + countUnAssigned(salesrepArray10);

		// 748 search....
		var unAsgn_gem = "Unassigned" + "-" + countUnAssigned(salesrepArray9);

		// 1360 search....
		var unAsgn_diamond = "Unassigned" + "-" + countUnAssigned(salesrepArray8);

		// 199 search....
		var unAsgn_noemail = "Unassigned" + "-" + countUnAssigned(salesrepArray7);

		// 1868 search....
		var unAsgn_photo = "Unassigned" + "-" + countUnAssigned(salesrepArray6);

		// 795 search....
		var unAsgn_statusrepair = "Unassigned" + "-" + countUnAssigned(salesrepArray5);

		// 842 search....
		var unAsgn_wax = "Unassigned" + "-" + countUnAssigned(salesrepArray3);

		// 692 search....
		var unAsgn_waxwait = "Unassigned" + "-" + countUnAssigned(salesrepArray2);

		//1028 first search results.......
		var unAsgn_open = "Unassigned" + "-" + countUnAssigned(salesrepArray);

		//1620 second search....
		var unAsgn_syn = "Unassigned" + "-" + countUnAssigned(salesrepArray1);

		// 1531 search....
		var unAsgn_last = "Unassigned" + "-" + countUnAssigned(salesrepArray4);

		// 5466 Saved Search
		var unAsgn_cs = "Unassigned" + "-" + countUnAssigned(salesrepArray5466);
		
		var subject="Consolidated Search Results for Un-Assigned";
		
		//Result of three searches(CAD/Wax-CS to send to customer, CAD or wax waiting on customer & Open Quotes-CS Custom Quote Search) to be sent to customcs@brilliantearth.com

		var body1 = "<b>CAD/Wax-CS to send to customer  :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=842&whence= <br/> " + unAsgn_wax+" <br/> <br/><b> CAD or wax waiting on customer:</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=692 <br/> " + unAsgn_waxwait+" <br/><br/> <b>Open Quotes-CS Custom Quote Search (est)  : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1028&whence= <br/> " + unAsgn_open;
		
		//Rest all to be sent to CSmgrs@brilliantearth.com
		
		var body2 = "<b>Open (CS) Ops/CS Status :</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1500 <br/> "+unAsgn_openstatus+" <br/><br/> <b> All Appointments - no items : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1329&whence= <br/> "+unAsgn_noitems+" <br/> <br/><b>My Leads To Follow Up With Today (for email) :</b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2806&whence=  <br/> "+unAsgn_leadFollow+" <br/><br/><b>Contoured Rings Sold :</b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3082&whence=  <br/> "+unAsgn_contouredringssold+" <br/><br/><b> MY Missing Post Appointment Status : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2446&whence <br/> "+unAsgn_poststatus+" <br/><br/><b> Wells Fargo App : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3181&whence <br/> "+unAsgn_wellsfargoapp+" <br/><br/><b> All CS Open Gem Requests : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=748 <br/> "+unAsgn_gem+" <br/> <br/><b> Quote Color Sample : </b><br/>https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=3705&whence= <br/> "+unAsgn_estimate+" <br/> <br/><b> Diamond Request - Open CS : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1360&whence= <br/> "+unAsgn_diamond+" <br/><br/> <b>SO with no email confirmation :</b> <br/>  https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=199&whence= <br/> "+unAsgn_noemail+" <br/><br/><b> Photography Item Sent to CS : </b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1868&whence <br/> "+unAsgn_photo+" <br/><br/> <b>Open (CS) Status of Repairs/Resizes  :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=795&whence= <br/> "+unAsgn_statusrepair+" <br/><br/><b> Synchrony App Ready To Be Sent to Customer :</b> <br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1620&whence <br/> "+unAsgn_syn+" <br/><br/><b> Diamond Unavailable-Options pending customer decision : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=1531&whence <br/>"+unAsgn_last+" <br/><br/><b>CS - Ring Sizer Returned to Sender - Need to Contact : </b><br/> https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=5466&whence= <br/> "+unAsgn_cs;
		
		
		//var emailTo1 = 'customcs@brilliantearth.com';	 
        //var emailTo2 = 'csmgrs@brilliantearth.com';
		var emailTo1 = 3461707;
        var emailTo2 = 2096709;
          
		try{
			nlapiSendEmail(20186, emailTo1, subject, body1);
		}catch(err1){
			nlapiLogExecution('error', 'error while sending three of the unassigned result ', err1);
		}
		try{
			nlapiSendEmail(20186, emailTo2, subject, body2);
		}catch(err2){
			nlapiLogExecution('error', 'error while sending rest of the unassigned result ', err2);
		}

		}catch(e){
			nlapiLogExecution('DEBUG', 'error ', e);
		}
	}

}
function count(salesrepArray) {
    array_elements = salesrepArray;

    array_elements.sort();

    var returnArray =[];
    var current = null;
    var cnt = 0;
    for (var i = 0; i < array_elements.length; i++) {
        if (array_elements[i] != current) {
            if (cnt > 0) {
            	//returnArray.push('<br/>' + current + '-'+ cnt);
            	returnArray.push(current + '-'+ cnt);
            }
            current = array_elements[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
    	//returnArray.push('<br/>' + current + '-'+ cnt);
    	returnArray.push(current + '-'+ cnt);
    }

    return returnArray;
}
function validate(current) {
	var value=current;
	if(value==''){
		value="Unassigned";
		}
 return value;
}
// Start: ZAG : NS-1457
function getSalesRep(objSalesRep, filterLoc){
	var arrSalesRep = [];
	for (x in objSalesRep){
      if(objSalesRep[x] == filterLoc)
		arrSalesRep.push(x);
    }
	return arrSalesRep
}

function getSalesRepByLoc(locSalesRep, srchSalesRep){
	var arrSrchSalesRep = [];
	for(var indx=0; indx < srchSalesRep.length; indx++)
		if(locSalesRep.indexOf(srchSalesRep[indx]) > -1)
			arrSrchSalesRep.push(srchSalesRep[indx]);
		
	return arrSrchSalesRep;
}
function getSearchResultStr(salesrepArrayResults){
	var strResult = '';
	if(salesrepArrayResults == '')
		strResult="There are no search results at this time.";
	else
		for(var a in salesrepArrayResults)
			strResult = strResult+'<br/>'+salesrepArrayResults[a];
		
	return strResult;				
}

function countUnAssigned(salesrepArray){
	var cntr = 0;
	for(var indx=0; indx < salesrepArray.length; indx++)
		if(salesrepArray[indx] == "Unassigned")
			cntr++;
		
	return cntr;
}
// End : ZAG : NS-1457