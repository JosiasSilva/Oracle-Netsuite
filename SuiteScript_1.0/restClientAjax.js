/**  
 *      custom id = (id=2641)
 * 
 *      TYPE ---> Client
        NAME ---> restClientAjax
        ID -----> customscript_restclientajax
 */


var data = { id: '000' };

jQuery.ajax({
    type: "GET",
    url: "/app/site/hosting/restlet.nl?script=2640&deploy=1", 
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    cache: false,
    dataType: 'json',
    success: function (data) {
       console.log(JSON.parse(data));
    },
    error: function () {
        alert("error");
    },
    beforeSend: function () {
    }
});
