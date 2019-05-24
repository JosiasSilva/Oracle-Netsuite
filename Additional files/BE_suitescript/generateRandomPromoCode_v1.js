nlapiLogExecution("audit","FLOStart",new Date().getTime());
function generateRandomPromoCode()
{

  // saved search id-4689 for custom record type Promo Code Master Data
  try{
    var mySearch = nlapiLoadSearch(null,5117);
    var searchresult = [];
    var resultset = mySearch.runSearch();
    var searchid = 0;
    do {
      YieldExecution();
      var resultslice = resultset.getResults(searchid, searchid+1000 );
      if (resultslice !=null && resultslice !='') 
      { 
        for (var rs in resultslice) 
        {
          YieldExecution();
          searchresult.push(resultslice[rs]);                
          searchid++;
          YieldExecution();
        } 
      }
    } while (resultslice.length >= 1000); 

    var searchCount1=searchresult.length;   
    nlapiLogExecution("debug"," Length Search Result-5117 : "+ searchCount1, searchCount1);  
    // end here
  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error in Search : 5117(Part -1) ", ex.message);  
  }

  try{
    // start here svaed serach id- 4681 for assign promo code to customer
    var mySearch2 = nlapiLoadSearch(null,5041);
    var searchresult2 = [];
    var resultset2 = mySearch2.runSearch();
    var newsearchid = 0;
    do {
      YieldExecution();
      var resultslice2 = resultset2.getResults(newsearchid, newsearchid+1000);
      if (resultslice2 !=null && resultslice2 !='') 
      { 
        for (var rs2 in resultslice2) 
        {
          YieldExecution();
          searchresult2.push(resultslice2[rs2]);                
          newsearchid++;
          YieldExecution();
        } 
      }
    } while (resultslice2.length >= 1000); 

    var searchCount2=searchresult2.length;   
    nlapiLogExecution("debug"," Length Search Result 2 (5041): "+ searchCount2, searchCount2);
    if(searchCount2 > 50)
    {
      searchCount2 = 50;
      nlapiLogExecution("debug"," Length Search Result 2 (5041): After Limit "+ searchCount2, searchCount2);
    }
  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error in Search : 5041(Part - 2) ", ex.message);  
  }
  // end here
  //var fixedStr  = getPrefixThreeChar();
  try
  {
    var fixedStr ='RSA';
    var uniqueArray=[];
    var duplicateArray=[];
    var currentCode='';
    var lastCode='';
    var checkUniquePromoCode=[];
    var masterlistpromocodeduplicateArray=[];
    var batchno='';
    if (searchresult && searchCount1>0) 
    {
      for(var m = 0; m < searchresult.length; m++)            
      {
        YieldExecution();
        if(m == searchCount1-1)
        {
          YieldExecution();
          batchno = searchresult[m].getValue('custrecord_batchno');
          if(batchno =='' || batchno == null) 
          { batchno=1;}
          else
          {
            batchno = parseFloat(batchno) + 1;
          }  
          YieldExecution();
        }
        YieldExecution();
      }
    }
    else
    {
      batchno=1;
    }
  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error in (Part -3)", ex.message);  
  }


  //  var htmlStr="<table border='0' align='left' width='950px' cellpadding='0' cellspacing='0'>";
  // htmlStr =htmlStr +"<tr><td colspan='2' style='text-align:center;width:100px;'><b>RANDOM PROMO CODE</b></td></tr>";
  // htmlStr =htmlStr +"<tr><td style='text-align:center;width:200px;'>SNO</td><td style='text-align:center;width:200px;'>PROMO CODE</td></tr>";
  try
  {
    if (searchresult2 && searchCount2>0) 
    {
      // for(var i = 0; i <searchresult2.length; i++)
      for(var i = 0; i <searchCount2; i++)
      {
        YieldExecution();
        var chkFlag=false;
        var chkIndex=false;
        //var ResultColm = searchresult2[i].getAllColumns();
        var custid= searchresult2[i].getId();
        //var custid='2314582';// Test for Alexand as Customer
        var pcode_4 = generateRandomPromoCode_4_place();
        var pcode_5 = generateRandomPromoCode_5_place();
        YieldExecution();
        var pcode_6 =generateRandomPromoCode_6_place();
        var pcode_7_8 =generateRandomPromoCode_7_8_place();
        YieldExecution();
        currentCode=fixedStr+pcode_4+pcode_5+pcode_6+pcode_7_8;   
        if (searchresult && searchCount1>0) 
        {   
          try
          {
            for( var m = 0; m < searchresult.length; m++) 
            {
              YieldExecution();
              var promocode= searchresult[m].getValue('custrecord_promocode'); 

              if(currentCode==promocode) 
              {
                YieldExecution();
                masterlistpromocodeduplicateArray.push(currentCode);
                chkFlag=true;
                i--;
                chkIndex=true;
                break;
              }   
              YieldExecution();
            }
          }
          catch(ex)
          {
            nlapiLogExecution("debug","Error in (Part -4)", ex.message); 
          }
        }
        try
        {
          for(var j=0;j<checkUniquePromoCode.length;j++)
          {
            YieldExecution();
            if(currentCode==checkUniquePromoCode[j])
            {
              YieldExecution();
              duplicateArray.push(currentCode);
              chkFlag=true;
              if(chkIndex==false)
              {
                i--;    
              }
              break;    
            }
            YieldExecution();
          }
        }
        catch(ex)
        {
          nlapiLogExecution("debug","Error in (Part -5)", ex.message); 
        }
        try
        {
          if(chkFlag==false)
          {
            YieldExecution();
            checkUniquePromoCode.push(currentCode);
            uniqueArray.push(currentCode); 
            var  addPromoCode=nlapiCreateRecord('customrecord_promocode_master');
            addPromoCode.setFieldValue('custrecord_promocode',currentCode);
            var sno=parseFloat(i)+1;
            addPromoCode.setFieldValue('custrecord_sno',sno);
            addPromoCode.setFieldValue('custrecord_batchno',batchno);
            addPromoCode.setFieldValue('custrecord_customer_id',custid);
            var promocodeId = nlapiSubmitRecord(addPromoCode);
            YieldExecution();
            updateCustomerUniquePromoCode(custid,currentCode,promocodeId);
            YieldExecution();
          }    
          YieldExecution();
        }
        catch(ex)
        {
          nlapiLogExecution("debug","Error in (Part -6)", ex.message); 
        }
      }//End of for loop
    }//End of if part of searchresult2
    // for(var t=0;t<uniqueArray.length;t++)
    // {
    //    var j=t+1;
    //    htmlStr =htmlStr +"<tr><td style='text-align:center;width:200px;'>"+ j +"</td><td style='text-align:center;width:200px;'>"+uniqueArray[t]+"</td></tr>";
    // }
    // htmlStr =htmlStr +"</table>" ;  
    YieldExecution(); 
    nlapiLogExecution('debug', 'duplicate promo code' ,duplicateArray);   
    nlapiLogExecution('debug', 'duplicate  promo code in master list data' ,masterlistpromocodeduplicateArray);  
    nlapiLogExecution('debug', 'unique promo code' ,uniqueArray);    
    YieldExecution();
    // nlapiLogExecution('debug', 'unique promo code html table' ,htmlStr); 
  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error in (Part -7)", ex.message);  
  }

}

function generateRandomPromoCode_4_place()
{
  var fixedStr='';
  var charset = "0123456789";
  for(var i=0; i <1; i++)
  {
    fixedStr = charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return fixedStr;
}

function generateRandomPromoCode_5_place()
{
  var fixedStr='';
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var i=0; i <1; i++)
  {
    fixedStr += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return fixedStr;
}

function generateRandomPromoCode_6_place()
{
  var fixedStr='';
  var charset = "0123456789";
  for(var i=0; i <1; i++)
  {
    fixedStr += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return fixedStr;
}


function generateRandomPromoCode_7_8_place()
{
  var fixedStr='';
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var i=0; i <2; i++)
  {
    fixedStr += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return fixedStr;
}

function getPrefixThreeChar()
{
  var d = new Date();
  var month = new Array();
  var prefixChar='';
  // month[0] = "January";
  // month[1] = "February";
  // month[2] = "March";
  // month[3] = "April";
  // month[4] = "May";
  // month[5] = "June";
  // month[6] = "July";
  // month[7] = "August";
  // month[8] = "September";
  // month[9] = "October";
  // month[10] = "November";
  // month[11] = "December";
  var n = d.getMonth();
  switch(n)
  {
    case 0:

      prefixChar = "ABC";
      break;
    case 1:
      prefixChar = "DEF";
      break;
    case 2:
      prefixChar =  "GHI";
      break;
    case 3:
      prefixChar =  "JKL";
      break;
    case 4:
      prefixChar =  "MNO";
      break;
    case 5:
      prefixChar = "OPQ";
      break;
    case 6:
      prefixChar =  "RST";
      break;
    case 7:
      prefixChar =  "UVW";
      break;
    case 8:
      prefixChar =  "XYZ";
      break;
    case 9:
      prefixChar =  "RSZ";
      break;
    case 10:
      prefixChar =  "LMN";
      break;
    case 11:
      prefixChar =  "OPI";
      break;


  }
  return prefixChar ;
}

function updateCustomerUniquePromoCode(custId,uniquePromoCode,uniquePromoCodeId)
{
  try
  {
    //nlapiSubmitField('customer',custId,'custentity_promo_code',uniquePromoCode);
    nlapiSubmitField('customer',custId,['custentity_promo_code','custentity_promocode_id'],[uniquePromoCode,uniquePromoCodeId]);
    nlapiLogExecution("debug","Customer Id & Promo Code", "Customer Id  is :"+ custId +" & Promo Code is :"+uniquePromoCode+" & Promo Code id:"+uniquePromoCodeId);

  }
  catch(ex)
  {
    nlapiLogExecution("debug","Error raised on updatePromoCode function is :",ex.message);
  }
}

function YieldExecution() {
  if (nlapiGetContext().getRemainingUsage() <= 200) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } 
    else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
}
