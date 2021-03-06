<?php
$image_name = WP_Rulette::get_var_meta('wp_rulette_image_name');
$image_file = WP_Rulette::get_var_meta('wp_rulette_image_file');
$image_src = WP_Rulette::get_var_meta('wp_rulette_image_src');
?>
<body>

<input type="file" accept="image/*" class="wp_rulette_image_file" id="wp_rulette_image_file" name="wp_rulette_image_file[]" />

<input type="hidden" class="wp_rulette_image_name" id="wp_rulette_image_name" name="wp_rulette_image_name" value="<?= $image_name ?>" />
<input type="hidden" class="wp_rulette_image_src" id="wp_rulette_image_src" name="wp_rulette_image_src" value="<?= $image_src ?>" />
<image id='wp_rulette_image' class="img_galeria" />

</body>
<script
  src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
  crossorigin="anonymous"></script>

<script>
	let image = document.querySelector("#wp_rulette_image");
	let imageName = '<?= $image_name ?>' || 'default.png';
    let dirImages = '<?=str_replace( '\\', '/', WP_PLUGIN_DIR );?>'+'/wp_rulette/img/';
    let image_file = document.querySelector("#wp_rulette_image_file");
    image.src = '<?=$image_src;?>' || 'default.png';

	function updateImageDisplay(evt) {
        var files = this.files;
        for (var i = 0, f; f = files[i]; i++) {
          	if (!f.type.match('image.*')) {
            	continue;
          	}

          	var reader = new FileReader( );
          	reader.onload = (function(theFile) {
            	return function(e) {
		            let src = dirImages + theFile.name;

              		image.title = theFile.name;
              		image.src = e.target.result;
		            document.querySelector('#wp_rulette_image_name').value = theFile.name;
		            document.querySelector('#wp_rulette_image_src').value = e.target.result;
            	};
          	})(f);
          	reader.readAsDataURL(f);
        }
	}

    document.querySelector("#wp_rulette_image").addEventListener( 'click', function( event ) {
    	image_file.click( );
    });
	image_file.addEventListener('change', updateImageDisplay );
</script>

<style>
	#wp_rulette_image_file {
		display: none;
	}
	#wp_rulette_image {
		width: 30%;
		height: auto;
	}
	img, object, embed, video {max-width: 100%;}


</style>
 
