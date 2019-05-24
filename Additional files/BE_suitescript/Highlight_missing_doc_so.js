function beforeLoad(type,form)
{
  try
  {
    if(nlapiGetContext().getExecutionContext() == 'userinterface')
    {
      var inner_html = '';
      var so_id=nlapiGetRecordId()
      var obj_so= nlapiLoadRecord('salesorder',so_id);
      
      //Highlight Fraud Message
       var fraudCheckVal = obj_so.getFieldValue('custbodyfraud_check_new');
       	if(fraudCheckVal=='4')
		{
             if (inner_html) {
                inner_html = inner_html +'<h1 class="uir-record-type" style="background-color:red;color:black;font-size:14px">FRAUD QUESTIONS REQUIRED, SEE FRAUD NOTES</h1>';
              } else {
                inner_html = '<h1 class="uir-record-type" style="background-color:red;color:black;font-size:14px">FRAUD QUESTIONS REQUIRED, SEE FRAUD NOTES</h1>';
              }
        }

      //Highlight charge back
      var chargeback_count=obj_so.getLineItemCount('recmachcustrecordsales_order_chargeback');
      nlapiLogExecution("Debug","Chargeback",chargeback_count);
      if(chargeback_count>0)
      {
        //nlapiLogExecution("Debug","Chargeback",chargeback_count);
        if (inner_html) {
          inner_html = inner_html +'<h1 class="uir-record-type" style="background-color:orange">Chargeback</h1>';
        } else {
          inner_html = '<h1 class="uir-record-type" style="background-color:orange">Chargeback</h1>';
        }
      }


      //‘Attach Affidavit’ Banner
      var signedAffdvt=obj_so.getFieldValue('custbody125');
     // var signAffdvt2=obj_so.getFieldValue('custbodysigned_affidavit');
      if(signedAffdvt == 3 || signedAffdvt== 4 || signedAffdvt ==5 || signedAffdvt ==6)
      {
        if(inner_html)
        {
          inner_html=inner_html+ '<h1 class="uir-record-type" style="background-color:#23C920">Affidavit Needed</h1>';
        }
        else{
          inner_html = '<h1 class="uir-record-type" style="background-color:#23C920">Affidavit Needed</h1>';
        }
      }

      //-	‘WF Doc Missing’ Banner
      var search=nlapiSearchRecord('customerdeposit',null,[new nlobjSearchFilter('salesorder',null,'anyof',so_id),new nlobjSearchFilter('paymentmethod',null,'anyof',21)]);

      if(search)
      {
        var custbody128= obj_so.getFieldValue('custbody128');
      //  var custbody159= obj_so.getFieldValue('custbody159');

        if( custbody128==1 || custbody128==4 )
        {
          //Showbanner
          if(inner_html)
          {
            inner_html=inner_html+ '<h1 class="uir-record-type" style="background-color:#33CECB">WF Receipt Needed</h1>';
          }else{
            inner_html= '<h1 class="uir-record-type" style="background-color:#33CECB">WF Receipt Needed</h1>';
          }
        }
      }

      //-	‘Shippers Dec Missing’ Banner

      var shipperDecStatus=obj_so.getFieldValue('custbody297');
      //var shippersDec=obj_so.getFieldValue('custbody320');
      if(shipperDecStatus==1 || shipperDecStatus==4 || shipperDecStatus==7)
      {
        //showbanner
        if(inner_html)
        {
          inner_html=inner_html+ '<h1 class="uir-record-type" style="background-color:#F4FC70">Shippers Dec Needed</h1>';
        }
        else{
          inner_html= '<h1 class="uir-record-type" style="background-color:#F4FC70">Shippers Dec Needed</h1>';
        }
      }

      //-	‘Showroom Order’ Banner
      var showroomOrder=obj_so.getFieldValue('custbody_showroom_order');
      if(showroomOrder==2)
      {
        //showbanner
        if(inner_html)
        {
          inner_html=inner_html+ '<h1 class="uir-record-type" style="background-color:#D6D6D5">Showroom Order</h1>';
        }
        else{
          inner_html= '<h1 class="uir-record-type" style="background-color:#D6D6D5">Showroom Order</h1>';
        }
      }

      highlightMissingDocsOnSO(form,type,inner_html);

    }

  }
  catch(ex)
  {
    nlapiLogExecution("Error","Error", ex.message);
  }
}

function highlightMissingDocsOnSO(form,type,inner_html) {
  // var inner_html = '<h1 class="uir-record-type" style="background-color:orange">Chargeback</h1>';
  var missing_doc_highlight = form.addField("custpage_highlight_missingdoc", "inlinehtml", "MissingDoc");
  var html="<script type='text/javascript'>\
document.onreadystatechange = function(){\
if(document.readyState === 'complete'){";
  html+="var div_h = document.getElementsByClassName('uir-page-title-firstline');";
  html+="div_h[0].innerHTML=div_h[0].innerHTML+'"+inner_html+"'";
  html+="}}</script>";
  missing_doc_highlight.setDefaultValue(html);
}
