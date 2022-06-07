<?php
$number = WP_Rulette::get_var_meta('wp_rulette_number');
?>
<input type="number" min="0" class="wp_rulette_number" id="wp_rulette_number" name="wp_rulette_number" value="<?= $number ?>" />