<?php
    $cont=0;
    // ciclo para recorrer el array de imagenes

    foreach ($_FILES["img_extra"]["name"] as $key => $value) {
        //Se copian los archivos de la carpeta temporal del servidor a su ubicación final
        move_uploaded_file($_FILES["img_extra"]["tmp_name"][$key], "img/".$_FILES["img_extra"]["name"][$key]);
        $cont++;
    }
?>