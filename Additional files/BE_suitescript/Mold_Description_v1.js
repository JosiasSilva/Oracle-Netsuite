nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Add_Mold_Description(type)
{
	    try
	    {
          var Dimensions_shape='';
         var shape=nlapiGetFieldText('custrecord_shape');
          nlapiLogExecution("debug","shape",shape);

         var length=nlapiGetFieldValue('custrecord_length');
          nlapiLogExecution("debug","length",length);

         var width=nlapiGetFieldValue('custrecord_width');
         nlapiLogExecution("debug","width",width);

         var depth=nlapiGetFieldValue('custrecord_depth');
          nlapiLogExecution("debug","depth",depth);

          var ringsize=nlapiGetFieldValue('custrecord_ring_size');
          nlapiLogExecution("debug","ring size",ringsize);

         
	          if(depth =='' || depth== null) 
              {
                  Dimensions_shape=length +'x'+ width +' ' + shape +' '+'Size'+' '+ringsize;
                  nlapiLogExecution("debug","Dimensions_shape",Dimensions_shape);
               
              }
              else
              {
                   Dimensions_shape=length + 'x' + width + 'x' + depth +' '+ shape +' '+'Size'+' '+ringsize;
                   nlapiLogExecution("debug","Dimensions_shape",Dimensions_shape);
                
              }
                 var moldID =nlapiGetRecordId();
                 nlapiLogExecution("debug","internal id",moldID);
                 var loadData=nlapiLoadRecord('customrecord_mold',moldID);
                 loadData.setFieldValue('custrecord178', Dimensions_shape);
                 nlapiSubmitRecord(loadData);

          }
          catch(e)
          {
               nlapiLogExecution("debug","error",e.message);
          }
}