<?php

require('class_plugink.php');

class WP_Rulette extends PluginK
{
    public static function active()
    {
        //add_action('init', array('WP_Subsk', 'create_subs_type'));
        //add_action('admin_head', array('WP_Subsk', 'insert_uicomponents'));
        //add_action('add_meta_boxes_subs_types', array('WP_Subsk', 'create_metas'));
    }

    public static function deactive()
    {
    }

    public static function init(){
        self::create_rulette_type();
        add_action('add_meta_boxes_rulette_sector', array('WP_Rulette', 'create_metas'));
        add_action('publish_post', array('WP_Rulette', 'save_post'));
        add_action('draft_to_publish', array('WP_Rulette', 'save_post'));
        // self::save_post( );
    }

    public static function render_rulette()
    {
        ob_start( );
        ?>
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td>
                        <div class="power_controls">
                            <br />
                            <button id="btn_spin" >lanzar</button>
                        </div>
                    </td>
                    <td width="438" height="582" class="the_wheel" align="center" valign="center">
                        <canvas id="canvas" width="434" height="434">
                            <p style="{color: white}" align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
                        </canvas>
                    </td>
                    <link href="main.css" />
                    <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
                    <script type="text/javascript" src="http://localhost/ruleta/wp-content/plugins/wp_rulette/Winwheel.min.js"></script>
                    <script src="http://localhost/ruleta/wp-content/plugins/wp_rulette/ruleta.js" ></script>
                </tr>
            </table>
        <?php
        $html = ob_get_contents( );
        ob_end_clean( );
        return $html;
    }

    public static function save_post( $id, $post ) {
        echo '<pre>'; print_r( $post ); echo '<br />';
        $meta = get_post_meta( $post->ID ); print_r( $meta ); echo '</pre>';
        $Post = get_post( $id );
        echo $meta;
        echo "<h1>".$_POST['wp_rulette_number']."</h1>";
        die();
        
    }

    public static function create_rulette_type()
    {
        self::create_type_post('rulette_sector', 'sector de la ruleta', 'sectores de la ruleta', [
            'description' => 'Define los diferentes sectores de la ruleta',
            'public'       => false,
            'can_export'   => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'query_var'    => false,
            'rewrite'      => false,
            'has_archive'  => false,
            'hierarchical' => false,
            'supports'     => array('title'),
            //'menu_icon'    => pods_svg_icon('pods'),
            //'menu_position' => 5,
            'show_in_nav_menus' => false,
        ]);
    }

    public static function create_metas()
    {
        
        self::create_meta('rulette_sector',[
            [
                'title' => 'color',
                'render_callback' => function () {
                    include 'metas/color.php';
                }
            ],
            [
                'title' => 'numero',
                'render_callback' => function () {
                    include 'metas/number.php';
                }
            ],
            [
                'title' => 'img',
                'render_callback' => function () {
                    include 'metas/img.php';
                }
            ]

        ]);
    
    }
}
