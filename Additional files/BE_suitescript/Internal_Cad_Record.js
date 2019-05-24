nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Add_Internal_Cad_Record(type)
{
	    try
	    {
          var Dimensions_shape='';
         var shape=nlapiGetFieldText('custrecord_icr_shape');
          nlapiLogExecution("debug","shape",shape);

         var length=nlapiGetFieldValue('custrecord_icr_length');
          nlapiLogExecution("debug","length",length);

         var width=nlapiGetFieldValue('custrecord_icr_width');
         nlapiLogExecution("debug","width",width);

         var depth=nlapiGetFieldValue('custrecord_icr_depth');
          nlapiLogExecution("debug","depth",depth);

          var ringsize=nlapiGetFieldValue('custrecord_icr_ring_size');
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
                 var icrID =nlapiGetRecordId();
                 nlapiLogExecution("debug","internal id",icrID);
                 var loadData=nlapiLoadRecord('customrecord_internal_cad',icrID);
                 loadData.setFieldValue('custrecord_dimensions_n_shape', Dimensions_shape);
                 nlapiSubmitRecord(loadData);

          }
          catch(e)
          {
               nlapiLogExecution("debug","error",e.message);
          }
}