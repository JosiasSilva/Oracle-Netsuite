function Data_Save(datain) {
  try {


    nlapiLogExecution('DEBUG',"JSON ", JSON.stringify(datain));	
    //var update_data = JSON.parse(datain);	 
    if(datain)	
    {	
      var po_id= datain.custpage_po_id;
      var dropship= datain.custpage_dropship;
      nlapiLogExecution('debug', 'Dropship value', dropship);
      var custbody39=null;
      if(dropship=='Yes')
      {
        var date=new Date();
        var month=date.getMonth()+1;
        var day=date.getDate();
        var year=date.getFullYear();
        var today_date=month+'/'+day+'/'+year;
        custbody39=today_date;
      }
      else
      {
        custbody39=null;
      }
      nlapiSubmitField ( 'purchaseorder' , po_id , ['custbody_receive_po','custbody39'] , ['T',custbody39] )
      nlapiLogExecution('debug', 'successfully', 'updated');
    }

  } catch (er) {
    nlapiLogExecution('debug', 'error', er.message);
  }
  return 'success';
}

