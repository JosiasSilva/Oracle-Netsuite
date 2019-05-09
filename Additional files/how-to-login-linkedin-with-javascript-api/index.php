<!doctype html>
<html>
<head>
    <title>How to Login LinkedIn with JavaScript API</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="//platform.linkedin.com/in.js">
        api_key: YOUR_APP_CLIENT_ID
        authorize: true
        onLoad: onLinkedInLoad
    </script>

    <script type="text/javascript">
        
        // Setup an event listener to make an API call once auth is complete
        function onLinkedInLoad() {
            IN.Event.on(IN, "auth", getProfileData);
        }
        
        // Logout user
        function logout(){
           IN.User.logout(onLogout);
        }

        function onLogout(){
          console.log('Logout successfully');
        }
        // Use the API call wrapper to request the member's basic profile data
        function getProfileData() {
          
            IN.API.Profile("me").fields("first-name", "last-name", "email-address","picture-url").result(function (data) {
            
                var userdata = data.values[0];

                $.ajax({
                    url: "saveuser.php",
                    type: "post",
                    data: {"social_type": "linkedin","fname": userdata.firstName,"lname": userdata.lastName,"email": userdata.emailAddress, "profile_image": userdata.pictureUrl },
                    success: function(response){

                        $('#tableUser').css('display','block');
                        $('#fullname').text( userdata.firstName + " " + userdata.lastName);
                        $('#email').text( userdata.emailAddress );
                        $('#profile_photo').attr( 'src',userdata.pictureUrl );
                        
                        // Logout user from linkedin account
                        logout();
                    }
                });

            }).error(function (data) {
                console.log(data);
            });
        }

    </script>
    </head>
    <body>
        <!-- LinkedIn signin button -->
        <script type="in/Login"></script>

        <table id='tableUser' style='display: none;'>
            <tr>
                <td>Name</td>
                <td><span id='fullname'></span></td>
            </tr>

            <tr>
                <td>Email</td>
                <td><span id='email'></span></td>
            </tr>

            <tr>
                <td>Profile image</td>
                <td><img src='' width='32' height='32' id='profile_photo'></td>
            </tr>
        </table>
    </body>
</html>
