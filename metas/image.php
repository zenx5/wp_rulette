<?php
$image = WP_Rulette::get_var_meta('wp_rulette_image');
$image_file = WP_Rulette::get_var_meta('wp_rulette_image_file');
?>
<input type="file" class="wp_rulette_image" id="wp_rulette_image_file" name="wp_rulette_image_file" value="<?= $image_file ?>" />
<input type="hidden" class="wp_rulette_image" id="wp_rulette_image" name="wp_rulette_image" value="<?= $image ?>" />

<script type="text/javascript" >
	document.getElementById("wp_rulette_image").addEventListener("change", function( ) {
		console.log(this.files)
		updateImageDisplay(this.files)
		this.files[0]
		// window.file = this.files
	})

	function updateImageDisplay( input ) {

      	const curFiles = input;

        for(const file of curFiles) {
          	if(true || validFileType(file) ) {
	            const image = document.createElement('img');
	            console.log(file)
	            // image.src = '<?=str_replace(WP_PLUGIN_DIR, '', '/');?>'+'/wp_rulette/img/'+ file.name;
	            image.src = 'http://localhost/ruleta/wp-content/plugins/wp_rulette/img/'+ file.name;
	            console.log(image.src)
          	}

        }

    }

</script>