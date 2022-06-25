<?php
$tag = WP_Rulette::get_var_meta('wp_rulette_tag') ? WP_Rulette::get_var_meta('wp_rulette_tag') : WP_Rulette::get_var_meta('wp_rulette_number');
?>
<input type="text" class="wp_rulette_tag" id="wp_rulette_tag" name="wp_rulette_tag" value="<?= $tag ?>" />