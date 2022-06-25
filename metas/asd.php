<?php
$image_name = WP_Rulette::get_var_meta('wp_rulette_image_name');
$image_file = WP_Rulette::get_var_meta('wp_rulette_image_file');
$image_path = WP_Rulette::get_var_meta('wp_rulette_image_path');
?>
<image id='wp_rulette_image' />
<input type="file" accept="image/*" class="wp_rulette_image_file" id="wp_rulette_image_file" name="wp_rulette_image_file" />
<input type="hidden" class="wp_rulette_image_name" id="wp_rulette_image_name" name="wp_rulette_image_name" value="<?= $image_name ?>" />
<input type="hidden" class="wp_rulette_image_path" id="wp_rulette_image_path" name="wp_rulette_image_path" value="<?= $image_path ?>" />

<style>
	#wp_rulette_image_file {
		display: none;
	}
	#wp_rulette_image {
		width: 30%;
		height: auto;
	}

</style>

<script type="text/javascript" >

	let image = document.querySelector("#wp_rulette_image");
	let imageName = '<?= $image_name ?>' || 'default.png';
    let dirImages = '<?=str_replace( '\\', '/', WP_PLUGIN_DIR );?>'+'/wp_rulette/img/';
    let image_file = document.querySelector("#wp_rulette_image_file");
    let src;

    dirImages = dirImages.substr( dirImages.indexOf('htdocs') ).replace( 'htdocs', 'http://localhost');
    src = dirImages + imageName;
    image.src = src;

    document.querySelector("#wp_rulette_image").addEventListener( 'click', function( event ) {
    	image_file.click( );
    });

	image_file.addEventListener("change", function( ) {
		console.log(this.files)
		updateImageDisplay(this.files)
	})

	function updateImageDisplay( files ) {

        for(const file of files) {
          	if( true ) {
	            let src = dirImages + file.name;
	            image.src = src;
	            document.querySelector('#wp_rulette_image_name').value = file.name;
	            document.querySelector('#wp_rulette_image_path').value = src;
          	}

        }

    }

</script>

<?php
 
 
 $directorio = str_replace( '\\', '/', WP_PLUGIN_DIR ) . '/wp_rulette/img/';
 $aleatorio = mt_rand(100, 999);
 $ruta = "vistas/imagenes/usuarios/".$aleatorio.".png";
 
$nombre = $_FILES['hojaDeVida']['name'];
 
$guardado=$_FILES['hojaDeVida']['tmp_name'];
 
 
 
if(!file_exists($directorio )){
	mkdir($directorio ,0777,true);
	if(file_exists($directorio )){
 
		if(move_uploaded_file($guardado, 'archivos/'.$nombre)){
			echo "Archivo guardado con exito";
		}else{
			echo "Archivo no se pudo guardar";
		}
	}
}else{
		if(move_uploaded_file($guardado, $directorio.$aleatorio.".png")){
		echo "Archivo guardado con exito";
 
	}elseif(move_uploaded_file($guardado, $directorio.$aleatorio.".pdf")){
		echo "Archivo guardado con exito";
	}else{
		echo "Archivo no se pudo guardar";
	}
 
	var_dump($ruta);
 
}
 
 
 
?>