<?php
$image_name = WP_Rulette::get_var_meta('wp_rulette_image_name');
$image_file = WP_Rulette::get_var_meta('wp_rulette_image_file');
$image_path = WP_Rulette::get_var_meta('wp_rulette_image_path');
?>
<img id='wp_rulette_image' />
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

<script type="text/javascript">
	let image = document.querySelector("#wp_rulette_image");
	let imageName = '<?= $image_name ?>';
	let dirImages = '<?= str_replace('\\', '/', WP_PLUGIN_DIR); ?>' + '/wp_rulette/img/';
	let image_file = document.querySelector("#wp_rulette_image_file");
	let src;
	console.log('image', dirImages, imageName)
	//dirImages = dirImages.substr(dirImages.indexOf('htdocs')).replace('htdocs', 'http://localhost');
	console.log('image', dirImages, imageName)
	src = dirImages + imageName;
	image.src = src;

	document.querySelector("#wp_rulette_image").addEventListener('click', function(event) {
		image_file.click();
	});

	image_file.addEventListener("change", function() {
		console.log(this.files)
		updateImageDisplay(this.files)
	})

	function updateImageDisplay(files) {

		for (const file of files) {
			if (true) {
				let src = dirImages + file.name;
				image.src = src;
				document.querySelector('#wp_rulette_image_name').value = file.name;
				document.querySelector('#wp_rulette_image_path').value = src;
			}

		}

	}
</script>