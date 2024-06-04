<?php
if( !isset( $_POST["id"] ) || !isset( $_POST["view"] )){
	return json_encode(array("error"=> true, "msg"=> 'Datos incompletos'));	
}
#Definimos la raíz del directorio
if ( !defined( "RAIZ" ) ) 
{
	define( "RAIZ", dirname( dirname( __FILE__ ) ) );
}
$id = $_POST["id"];
$view = $_POST["view"];
$playList = $_POST["playList"];
require_once RAIZ . "/api/db.php";
require_once RAIZ . "/api/service.php";
$result = save_view( $id, $view, $playList);
die(json_encode($result));	
