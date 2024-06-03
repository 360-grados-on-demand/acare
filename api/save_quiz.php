<?php
if( !isset( $_POST["user"] )){
	return json_encode(array("error"=> true, "msg"=> 'Datos incompletos'));	
}
#Definimos la raíz del directorio
if ( !defined( "RAIZ" ) ) 
{
	define( "RAIZ", dirname( dirname( __FILE__ ) ) );
}
$user = json_decode($_POST["user"]);

require_once RAIZ . "/api/db.php";
require_once RAIZ . "/api/service.php";
$result = save_quiz( $user);
die(json_encode($result));	
