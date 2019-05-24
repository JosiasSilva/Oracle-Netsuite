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
			
			// 1500 search....
			 var salesrepArray13 =new Array();
			 var statusSearch = nlapiLoadSearch(null,1500);
			 var searchResults13 = statusSearch.runSearch();
			 var index13 = 0; 
			 var resultStep13 = 1000; 
			 var resultSet13;
			 do { 
				 resultSet13 = searchResults13.getResults(index13, index13 + resultStep13);
	             index13 = index13 + resultStep13;
	             for(var w=0; resultSet13!=null && w<resultSet13.length; w++) { 
	            	 var results13 = resultSet13[w];
	            	 // Get all Result columns
	                 var cols13= results13.getAllColumns();
	                 var salesrepstatus= results13.getText(cols13[5]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray13.push(validate(salesrepstatus));
	            	 
	             }
			 }while (resultSet13.length >= 1000);
			 
			 var salesrepArrayResults13= count(salesrepArray13);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 13:', salesrepArrayResults13);
			 
			 var openstatus='';
				if(salesrepArrayResults13==''){
					openstatus="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults13) {
						openstatus = openstatus+'<br/>'+salesrepArrayResults13[a];
					}
					//noitems=salesrepArrayResults12;
				}
			
			// 1329 search....
			 var salesrepArray12 =new Array();
			 var appSearch = nlapiLoadSearch(null,1329);
			 var searchResults12 = appSearch.runSearch();
			 var index12 = 0; 
			 var resultStep12 = 1000; 
			 var resultSet12;
			 do { 
				 resultSet12 = searchResults12.getResults(index12, index12 + resultStep12);
	             index12 = index12 + resultStep12;
	             for(var v=0; resultSet12!=null && v<resultSet12.length; v++) { 
	            	 var results12 = resultSet12[v];
	            	 // Get all Result columns
	                 var cols12 = results12.getAllColumns();
	                 var salesrepapp= results12.getText(cols12[6]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray12.push(validate(salesrepapp));
	            	 
	             }
			 }while (resultSet12.length >= 1000);
			 
			 var salesrepArrayResults12= count(salesrepArray12);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 12:', salesrepArrayResults12);
			 var noitems='';
				if(salesrepArrayResults12==''){
					noitems="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults12) {
						noitems = noitems+'<br/>'+salesrepArrayResults12[a];
					}
					//noitems=salesrepArrayResults12;
				}
			
			// 2113 search....
			 var salesrepArray11 =new Array();
			 var followSearch = nlapiLoadSearch(null,2113);
			 var searchResults11 = followSearch.runSearch();
			 var index11 = 0; 
			 var resultStep11 = 1000; 
			 var resultSet11;
			 do { 
				 resultSet11 = searchResults11.getResults(index11, index11 + resultStep11);
	             index11 = index11 + resultStep11;
	             for(var u=0; resultSet11!=null && u<resultSet11.length; u++) { 
	            	 var results11 = resultSet11[u];
	            	 // Get all Result columns
	                 var cols11 = results11.getAllColumns();
	                 var salesrepfollow= results11.getText(cols11[4]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray11.push(validate(salesrepfollow));
	            	 
	             }
			 }while (resultSet11.length >= 1000);
			 
			 var salesrepArrayResults11= count(salesrepArray11);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 11:', salesrepArrayResults11);
			 var customerfollow='';
				if(salesrepArrayResults11==''){
					customerfollow="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults11) {
						customerfollow = customerfollow+'<br/>'+salesrepArrayResults11[a];
					}
					//customerfollow=salesrepArrayResults11;
				}
			
			 
			
			// 2446 search....
			 var salesrepArray10 =new Array();
			 var misSearch = nlapiLoadSearch(null,2506);
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
	                 var salesrepmis= results10.getText(cols10[2]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray10.push(validate(salesrepmis));
	            	 
	             }
			 }while (resultSet10.length >= 1000);
			 
			 var salesrepArrayResults10= count(salesrepArray10);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 10:', salesrepArrayResults10);
			 
			 var poststatus='';
				if(salesrepArrayResults10==''){
					poststatus="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults10) {
						poststatus = poststatus+'<br/>'+salesrepArrayResults10[a];
					}
					//poststatus=salesrepArrayResults10;
				}
			 
			 
			
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
			 
			 var salesrepArrayResults9= count(salesrepArray9);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 9:', salesrepArrayResults9);
			 var gem='';
				if(salesrepArrayResults9==''){
					gem="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults9) {
						gem = gem+'<br/>'+salesrepArrayResults9[a];
					}
					//gem=salesrepArrayResults9;
				}
			 
			 
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
	                 var salesrepopencs= results8.getText(cols8[5]);
	                 //nlapiLogExecution('Debug','salesrepopencs :',salesrepopencs);
	                 salesrepArray8.push(validate(salesrepopencs));
	            	 
	             }
			 }while (resultSet8.length >= 1000);
			 
			 var salesrepArrayResults8= count(salesrepArray8);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 8:', salesrepArrayResults8);
			 
			 var diamond='';
				if(salesrepArrayResults8==''){
					diamond="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults8) {
						diamond = diamond+'<br/>'+salesrepArrayResults8[a];
					}
					
				}
			
			
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
	                 var salesrepnoemail= results7.getText(cols7[6]);
	               //  nlapiLogExecution('Debug','salesrepnoemail :',salesrepnoemail);
	                 salesrepArray7.push(validate(salesrepnoemail));
	            	 
	             }
			 }while (resultSet7.length >= 1000);
			 
			 var salesrepArrayResults7= count(salesrepArray7);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 7:', salesrepArrayResults7);
			 
			 var noemail='';
				if(salesrepArrayResults7==''){
					noemail="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults7) {
						noemail = noemail+'<br/>'+salesrepArrayResults7[a];
					}
					//noemail=salesrepArrayResults7;
				}
			
			
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
			 
			 var salesrepArrayResults6= count(salesrepArray6);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 6:', salesrepArrayResults6);
			 
			 var photo='';
				if(salesrepArrayResults6==''){
					photo="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults6) {
						photo = photo+'<br/>'+salesrepArrayResults6[a];
					}
				//	photo=salesrepArrayResults6;
				}
			
			
			
			
			
			
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
	                 nlapiLogExecution('Debug','salesrep repair :',salesreprepair);
	                 salesrepArray5.push(validate(salesreprepair));
	            	 
	             }
			 }while (resultSet5.length >= 1000);
			 
			 var salesrepArrayResults5= count(salesrepArray5);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 5:', salesrepArrayResults5);
			 
			 var statusrepair='';
				if(salesrepArrayResults5==''){
					statusrepair="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults5) {
						statusrepair = statusrepair+'<br/>'+salesrepArrayResults5[a];
					}
					
				}
			
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
			 
			 var salesrepArrayResults3= count(salesrepArray3);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 3 :', salesrepArrayResults3);
			 
			 var wax='';
				if(salesrepArrayResults3==''){
					wax="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults3) {
						wax = wax+'<br/>'+salesrepArrayResults3[a];
					}
					//wax=salesrepArrayResults3;
				}
			
			
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
			 
			 var salesrepArrayResults2= count(salesrepArray2);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 2 :', salesrepArrayResults2);
			 
			 var waxwait='';
				if(salesrepArrayResults2==''){
					waxwait="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults2) {
						waxwait = waxwait+'<br/>'+salesrepArrayResults2[a];
					}
					
				}
			 
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
			
			var salesrepArrayResults= count(salesrepArray);
			nlapiLogExecution('DEBUG', 'salesrepArrayResults ', salesrepArrayResults);
			
			var open='';
			if(salesrepArrayResults==''){
				open="There are no search results at this time.";
			}else{
				for ( var a in salesrepArrayResults) {
					open = open+'<br/>'+salesrepArrayResults[a];
				}
				//open=salesrepArrayResults;
			}
			nlapiLogExecution('DEBUG', 'OPEN :', open);
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
			 
			 var salesrepArrayResults1= count(salesrepArray1);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 1 :', salesrepArrayResults1);
			 
			 var syn='';
				if(salesrepArrayResults1==''){
					syn="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults1) {
						syn = syn+'<br/>'+salesrepArrayResults1[a];
					}
					//syn=salesrepArrayResults1;
				}
			 
			 
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
	                 var salesrepdiamond= results4.getText(cols4[24]);
	                // nlapiLogExecution('Debug','salesrepdiamond:',salesrepdiamond);
	                 salesrepArray4.push(validate(salesrepdiamond));
	            	 
	             }
			 }while (resultSet4.length >= 1000);
			 
			 var salesrepArrayResults4= count(salesrepArray4);
			 nlapiLogExecution('DEBUG', 'salesrepArrayResults 4:', salesrepArrayResults4);
			 
			 var last='';
				if(salesrepArrayResults4==''){
					last="There are no search results at this time.";
				}else{
					for ( var a in salesrepArrayResults4) {
						last = last+'<br/>'+salesrepArrayResults4[a];
					}
					//last=salesrepArrayResults4;
				}
			 
			
			 var subject="Consolidated Search Results";
			 var body="<b>Open (CS) Ops/CS Status :</b> <br/>  https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1500 <br/> "+openstatus+" <br/><br/> <b> All Appointments - no items : </b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1329&whence= <br/> "+noitems+" <br/> <br/> <b>Customer Follow Up :</b><br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=2113&whence=%20  <br/> "+customerfollow+" <br/><br/><b> MY Missing Post Appointment Status : </b><br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=2446&whence <br/> "+poststatus+" <br/><br/><b> All CS Open Gem Requests : </b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=748 <br/> "+gem+" <br/> <br/><b> Diamond Request - Open CS : </b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1360&whence= <br/> "+diamond+" <br/><br/> <b>SO with no email confirmation :</b> <br/>  https://system.netsuite.com/app/common/search/searchresults.nl?searchid=199&whence= <br/> "+noemail+" <br/><br/><b> Photography Item Sent to CS : </b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1868&whence <br/> "+photo+" <br/><br/> <b>Open (CS) Status of Repairs/Resizes  :</b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=795&whence= <br/> "+statusrepair+"<br/> <br/><b>CAD/Wax-CS to send to customer  :</b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=842&whence= <br/> "+wax+" <br/> <br/><b> CAD or wax waiting on customer:</b> <br/>  https://system.netsuite.com/app/common/search/searchresults.nl?searchid=692 <br/> "+waxwait+" <br/><br/> <b>Open Quotes-CS Custom Quote Search (est)  : </b><br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1028&whence= <br/>  "+open+" <br/><br/><b> Synchrony App Ready To Be Sent to Customer :</b> <br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1620&whence <br/> "+syn+" <br/><br/><b> Diamond Unavailable-Options pending customer decision : </b><br/> https://system.netsuite.com/app/common/search/searchresults.nl?searchid=1531&whence <br/>"+last+" ";
			 try{
				  nlapiSendEmail(20186, "cs@brilliantearth.com", subject, body);
			 }catch(e){
					nlapiLogExecution('DEBUG', 'error ', e);
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