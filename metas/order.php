<?php
$order = WP_Rulette::get_var_meta('wp_rulette_order');
?>
<input type="number" min="0" class="wp_rulette_order" id="wp_rulette_order" name="wp_rulette_order" value="<?= $order ?>" />