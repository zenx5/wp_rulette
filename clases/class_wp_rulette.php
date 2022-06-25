<?php

class WP_Rulette extends Plugink
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

    public static function init()
    {
        self::create_types();
        add_action('add_meta_boxes_rulette_sector', array('WP_Rulette', 'create_metas'));
        add_action('save_post', array('WP_Rulette', 'save_post'));
        add_action('publish_post', array('WP_Rulette', 'save_post'));
        add_action('draft_to_publish', array('WP_Rulette', 'save_post'));
        add_action('wp_head', array('WP_Rulette', 'get_sectores'));
        add_shortcode('rulette', array('WP_Rulette', 'render_rulette'));
        add_shortcode('sector_board', array('WP_Rulette', 'board'));
        // self::save_post( );
    }

    public static function get_sectores()
    {
        $datas = array();
        $query = new WP_Query(array(
            'post_type' => 'rulette_sector',
            'posts_per_page' => -1
        ));
        foreach ($query->posts as $post) {
            $metas = get_post_meta($post->ID);
            $data = array(
                'name' => $post->post_title,
                'number' => $metas['wp_rulette_number'][0],
                'color' => $metas['wp_rulette_color'][0],
                'order' => $metas['wp_rulette_order'][0],
                'image_file' => $metas['wp_rulette_image_file'][0],
                'image_path' => $metas['wp_rulette_image_path'][0],
                'image_name' => $metas['wp_rulette_image_name'][0]
            );
            $datas[] = $data;
        };
?>
        <link href="<?= WP_CONTENT_URL ?>/plugins/wp_rulette/src/main.css" />
        <script type="text/javascript">
            var Rulette_sectors = <?= json_encode($datas); ?>;
            console.log(Rulette_sectors)
        </script>
        <script type="text/javascript" src="<?= WP_CONTENT_URL ?>/plugins/wp_rulette/src/Winwheel.min.js"></script>
        <script src="<?= WP_CONTENT_URL ?>/plugins/wp_rulette/src/TweenMax.min.js"></script>
        <script src="<?= WP_CONTENT_URL ?>/plugins/wp_rulette/src/ruleta.js"></script>
    <?php
    }

    public static function render_rulette()
    {
        ob_start();
    ?>
        <table cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <div class="power_controls">
                        <br />
                        <button id="btn_spin">lanzar</button>
                    </div>
                </td>
                <td width="438" height="582" class="the_wheel" style="text-align:center" valign="center">
                    <canvas id="canvas" width="434" height="434">
                        <p style="color: white; text-align:center">Sorry, your browser doesn't support canvas. Please try another.</p>
                    </canvas>
                </td>
            </tr>
        </table>
    <?php
        $html = ob_get_contents();
        ob_end_clean();
        return $html;
    }

    public static function board()
    {
    ?>
        <table>
            <tr>
                <th>Animalitos</th>
            </tr>
            <tr>
                <td></td>
            </tr>
        </table>

<?php
    }

    public static function save_post($post_id, $post = null)
    {
        update_post_meta($post_id, "wp_rulette_number", $_POST['wp_rulette_number']);
        update_post_meta($post_id, "wp_rulette_color", $_POST['wp_rulette_color']);
        update_post_meta($post_id, "wp_rulette_image_name", $_POST['wp_rulette_image_name']);
        update_post_meta($post_id, "wp_rulette_image_path", $_POST['wp_rulette_image_path']);
        update_post_meta($post_id, "wp_rulette_image_file", $_POST['wp_rulette_image_file']);
        update_post_meta($post_id, "wp_rulette_order", $_POST['wp_rulette_order']);
        //die();
    }

    public static function create_types()
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

        self::create_meta('rulette_sector', [
            [
                'title' => 'color',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/color.php';
                }
            ],
            [
                'title' => 'numero',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/number.php';
                }
            ],
            [
                'title' => 'image',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/image.php';
                }
            ],
            [
                'title' => 'order',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/order.php';
                }
            ]
        ]);
    }
}
