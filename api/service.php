<?php

function usuario_existe($nombre_de_usuario, $id = false)
{
    global $base_de_datos;
    if($id !== false){
        $sentencia = $base_de_datos->prepare("SELECT count(nombre) AS count FROM usuarios WHERE nombre = ? AND id != ?;");    
        $sentencia->execute([$nombre_de_usuario, $id]);
    }else{
        $sentencia = $base_de_datos->prepare("SELECT count(nombre) AS count FROM usuarios WHERE nombre = ?;");    
        $sentencia->execute([$nombre_de_usuario]);
    }    
    $fila = $sentencia->fetch();
    return ($fila["count"] >= 1);
}


function crear_usuario($nombre, $pass)
{
    if (usuario_existe($nombre, false)){
        return array(
            "error" => true,
            "msg" => "El usuario ya existe"
        );
    }

    $nombre = strtolower($nombre);
    global $base_de_datos;
    $pass_enc = password_hash($pass, PASSWORD_DEFAULT);
    $sentencia = $base_de_datos->prepare("INSERT INTO usuarios (nombre, pass) VALUES (?,?)");
    return $sentencia->execute([$nombre, $pass_enc]);
}


function comprobar_datos($nombre, $pass)
{
    global $base_de_datos;
    $nombre = strtolower($nombre);
    $sentencia = $base_de_datos->prepare("SELECT * FROM usuarios WHERE nombre = ?;");
    $sentencia->execute([$nombre]);
    $fila = $sentencia->fetch();
    if(!$fila){
        return false;
    }
    $pass_encriptada = $fila["pass"];
    if (password_verify($pass, $pass_encriptada)) {        
        return $fila;
    } else {
        return false;
    }

}

function save_view($id, $view)
{
    global $base_de_datos;
    $id = strtolower($id);
    $sentencia = $base_de_datos->prepare('UPDATE usuarios SET v_'.$view.' = true WHERE id = ?');    
    return $sentencia->execute([$id]);    
}

function save_quiz($usuario){
    global $base_de_datos;
    $todo_correcto = true;    
    $sentencia = $base_de_datos->prepare('UPDATE usuarios SET q_1 = ?, q_2 = ?, q_3 = ?, q_4 = ?, q_5 = ? WHERE id = ?');    
    $todo_correcto = $todo_correcto && $sentencia->execute([$usuario->q_1,$usuario->q_2,$usuario->q_3,$usuario->q_4,$usuario->q_5,$usuario->id]);        
    return $todo_correcto;
}

?>