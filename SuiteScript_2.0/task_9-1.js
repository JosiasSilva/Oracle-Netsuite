/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */

define(['N/record', 'N/error', 'N/log', 'N/search', 'N/task'],
    function (record, error, log, search, task) {
        function post(request) {
            var d = reqest.datain;

            var data = JSON.stringify({
                id: "22",
                firstName: "avinash",
                lastName: "singh",
                company: "xyz"
            });

            return data;
        }
        return {
            post: post
        }
    });