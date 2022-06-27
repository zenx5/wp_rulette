<?php

/**
 * @package WP_Rulette_Kavav
 * @version 1.7.2
 */
/*
Plugin Name: WP Rullete by Kavav
Plugin URI: https://kavavdigital.com.ve
Description: Ruleta para juegos
Author: Octavio Martinez
Version: 1.0.0
Author URI: https://wa.me/19104468990
*/

require __DIR__ . '/vendor/autoload.php';

register_activation_hook(__FILE__, array('WP_Rulette', 'active'));
register_deactivation_hook(__FILE__, array('WP_Rulette', 'deactive'));


// register_uninstall_hook(__FILE__, array('WP_Rulette', 'uninstall') );

add_action('init', array('WP_Rulette', 'init'));