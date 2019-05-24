function poDescription(type){
  try{
    var get_record_type=nlapiGetRecordType ( ) ;

    if(get_record_type=='purchaseorder')
    {
      nlapiLogExecution('debug','Description -Submit PO',nlapiLoadRecord('purchaseorder',16194849).getLineItemValue('item','description',1));
      //nlapiLogExecution('debug','Description' ,nlapiLoadRecord('purchaseorder',nlapiGetRecordId ( )).getLineItemValue('item','description',1));
    }
    else
    {
      nlapiLogExecution('debug','Description -Submit SO',nlapiLoadRecord('purchaseorder',16194849).getLineItemValue('item','description',1));
    }



    if( (get_record_type=='salesorder' &&  type=="edit"  ) || (get_record_type=='purchaseorder' && ( type=='specialorder' || type=='dropship' ||  type=='edit')))
    {
      var internalid;
      if(get_record_type=='salesorder')
      {	
        internalid=nlapiGetRecordId ( ) ;
      }
      else
      {
        var so_id=nlapiLookupField ( 'purchaseorder' , nlapiGetRecordId ( ) , 'createdfrom' ) 
        if(so_id)
        {
          internalid=so_id;
        }
      }
      if(internalid)
      {
        var filter=[];
        var column=[];
        filter.push(new nlobjSearchFilter('internalid',null,'anyof',internalid));
        if(!(get_record_type=='purchaseorder' && ( type=='specialorder' || type=='dropship')))
        {
          filter.push(new nlobjSearchFilter('item',null,'noneof',['1087131','1093360']));
          filter.push(new nlobjSearchFilter('formulanumeric',null,'any',1).setFormula('CASE WHEN {memo}!={applyingtransaction.memo} THEN 1 ELSE 0 END'));
        }
        filter.push(new nlobjSearchFilter('type','applyingtransaction','anyof','PurchOrd'));
        column.push(new nlobjSearchColumn('memo'));
        column.push(new nlobjSearchColumn('lineuniquekey','applyingtransaction'));
        column.push(new nlobjSearchColumn('applyingtransaction'));
        column.push(new nlobjSearchColumn('item'));
        var search_record=nlapiSearchRecord('salesorder',null,filter,column);
        if(search_record)
        {
          var purchase_ord=[];
          var get_po_obj=[];
          for(var a=0;a<search_record.length;a++)
          {
            var get_po=search_record[a].getValue('applyingtransaction');
            var index_no=get_po_obj.indexOf(get_po);
            if(index_no==-1)
            {
              get_po_obj.push(get_po);
              purchase_ord.push({internalid:get_po,get_line:[]});
              index_no=purchase_ord.length-1;
            }
            purchase_ord[index_no].get_line.push({
              memo:search_record[a].getValue('memo'),
              line_number:search_record[a].getValue('lineuniquekey','applyingtransaction'),
              item:search_record[a].getValue('item'),
            });
          }


          for(var a=0;a<purchase_ord.length;a++)
          {
            var po_load=nlapiLoadRecord('purchaseorder',purchase_ord[a].internalid);
            var get_line= purchase_ord[a].get_line;
            for(var b=0;b<get_line.length;b++)
            {
              var find_index=po_load.findLineItemValue ('item' , 'lineuniquekey' , get_line[b].line_number ) ;
              if( !(get_line[b].item=='1087131' ||  get_line[b].item=='1093360'))
              {
             po_load.setLineItemValue('item','description',find_index,get_line[b].memo);
              }
              
            }
            nlapiSubmitRecord ( po_load , true , true ) ;

          }
        }

      }
    }
  }
  catch(ex){
    nlapiLogExecution('debug','test' ,ex.message)
  }
}
