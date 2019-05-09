<?php
include "config.php";

$social = "";
if(isset($_POST['social_type'])){
   $social = $_POST['social_type'];
}

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$social_type = $_POST['social_type'];
$profile_image = $_POST['profile_image'];

// Check user
$user_check = mysqli_query($con, "select count(*) as allcount from users where social_type='".$social."' and email='".$email."'");
$usercheckData = mysqli_fetch_array($user_check);

if($usercheckData[0]['allcount'] == 0){
	mysqli_query($con,"insert into users(fname,lname,email,social_type,profile_image) values('".$fname."','".$lname."','".$email."','".$social_type."','".$profile_image."')");
	echo "Save successfully";
}else{
	echo "Update successfully";
}

exit;