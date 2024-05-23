<?php
if( !isset( $_POST["nombre"] ) || !isset( $_POST["pass"] )){
	return json_encode(array("error"=> true, "msg"=> 'Datos incompletos'));	
}
#Definimos la raíz del directorio
if ( !defined( "RAIZ" ) ) 
{
	define( "RAIZ", dirname( dirname( __FILE__ ) ) );
}
$nombre = $_POST["nombre"];
$pass = $_POST["pass"];
require_once RAIZ . "/api/db.php";
require_once RAIZ . "/api/service.php";
$registro = crear_usuario( $nombre, $pass);
die(json_encode($registro));	
