/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/runtime','N/https'],
    /**
     * @param {serverWidget} serverWidget
     */
    function( search, record, runtime, https) {
	function getInputData() {
    	log.debug("Inside  getInputData",'====START====');
    	
		return search.load({
    		//id: 'customsearch10649'
    		id: 'customsearch10667'
    	});
    }
	
	function map(context) {
		log.debug("Inside  Everledger",'====START====');
    	try {
    		
    		var searchResults = JSON.parse(context.value);
            log.debug("Inside  Everledger","Search Results ="+JSON.stringify(context.value)); 
            var transId       = searchResults.id;
            var tranType = searchResults.values.type.text;
            log.debug("Inside Everledger",'Transaction Id ='+transId+'/Transaction Type ='+tranType); 
            var everledgerUrl = 'https://provenance.devx.rancher.playground.everledger.io/api/registrations/login';     
            //Setting up Headers
            var headers = new Array();
            //headers['Accept'] = 'application/json';         
            headers['Content-Type'] = 'application/json';
            var jsonobj = {
              "email":   "blockchain@brilliantearth.com",
              "password" :   "e4Au6XX4uZFXkaSXmgP"
            }
      
            log.debug("Inside Everledger", jsonobj);
            var response = https.post({
      			url: everledgerUrl,
      			body: JSON.stringify(jsonobj),
      			headers: headers
      		});
            if(response.code == 200)
            {
              var responsebody = JSON.parse(response.body);
              log.debug("Inside Everledger", responsebody.message);

            }
            else
            {
              log.debug("Portal error response is : ", response.body);
            }
        
			log.debug("Inside  Everledger",'====END====');	
		} catch (e) {
			// TODO: handle exception
			log.debug("Inside  map",'Error ='+e);
		}
	}
	
	
	return {
        getInputData: getInputData,
        map: map
    };
});

