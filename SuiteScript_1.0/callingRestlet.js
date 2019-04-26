/**  
 *      custom id = (id=2640)
 * 
 *      TYPE ---> RESTlet
        NAME ---> callingRestlet
        ID -----> customscript_callingrestlet
 */


function rest(request) {
    var d=reqest.datain;
    
    var data = JSON.stringify({ 
        id:"22",
        firstName: "avinash",
        lastName: "singh",
        company: "xyz"
    });

    return data;
}