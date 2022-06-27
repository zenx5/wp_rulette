<?php
$restart = WP_Rulette::get_var_meta('wp_rulette_restart');
?>
<input type="number" min="0" class="wp_rulette_restart" id="wp_rulette_restart" name="wp_rulette_restart" value="<?= $restart ?>" />