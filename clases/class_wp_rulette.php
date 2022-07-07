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
        add_action('add_meta_boxes_rulette_level', array('WP_Rulette', 'create_metas'));
        add_action('save_post', array('WP_Rulette', 'save_post'));
        add_action('publish_post', array('WP_Rulette', 'save_post'));
        add_action('draft_to_publish', array('WP_Rulette', 'save_post'));
        add_action('wp_head', array('WP_Rulette', 'head'));
        add_shortcode('rulette', array('WP_Rulette', 'render_rulette'));
        add_shortcode('rulette_board', array('WP_Rulette', 'board'));
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
                'tag' => $metas['wp_rulette_tag'][0],
                'color' => $metas['wp_rulette_color'][0],
                'order' => $metas['wp_rulette_order'][0],
                'image_file' => isset($metas['wp_rulette_image_file']) ? $metas['wp_rulette_image_file'][0] : '',
                'image_src' => isset($metas['wp_rulette_image_src']) ? $metas['wp_rulette_image_src'][0] : '',
                'image_name' => isset($metas['wp_rulette_image_name']) ? $metas['wp_rulette_image_file'][0] : ''
            );
            $datas[] = $data;
        };
        return $datas;
    }

    public static function get_level( ) {
        $datas = array( );
        $query = new WP_Query( array(
            'post_type' => 'rulette_level',
            'posts_per_page' => -1
        ));
        foreach( $query->posts as $post ) {
            $metas = get_post_meta( $post->ID );
            $data = array(
                'level' => $post->post_title,
                'restart' => $metas['wp_rulette_restart'][0]
            );
            $datas[] = $data;
        };
        return $datas;
    }

    public static function head()
    {
?>
        <style>
            .board-container {
                display: flex;
                flex-direction: column;
                align-items: center
            }

            .board-content {
                display: flex;
                width: 100%;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }

            .board-row {
                display: flex;
                flex-direction: row;
                width: 100%;
                justify-content: space-around;
            }

            .board-tag {
                border: 1px solid #0005;
                text-align: center;
                font-weight: bold;
                color: white;
                cursor: pointer;
                opacity: 0.6;
            }

            .board-tag.selected {
                opacity: 1;
            }
        </style>
        <link href="<?= WP_CONTENT_URL ?>/plugins/wp_rulette/src/main.css" />
        <script type="text/javascript">
            var Rulette_sectors = <?= json_encode(self::get_sectores()); ?>;
            var Rulette_levels = <?= json_encode(self::get_level()); ?>;
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
        $sectores = self::get_sectores();
        $byRow = 3;
        $columnCount = 0;
        $width = 100 / $byRow;
    ?>
        <div class="board-container">
            <div class="board-content">
                <h3>Board</h3>
            </div>
            <div class="board-content">
                <?php foreach ($sectores as $sector) {
                    $color = $sector['color'];
                    if ($columnCount == 0) {
                        echo "<div class='board-row'>";
                        echo "<div class='board-tag' style='width:$width%;background-color:$color;'>" . $sector['tag'] . "</div>";
                        $columnCount++;
                    } elseif ($columnCount == $byRow - 1) {
                        echo "<div class='board-tag' style='width:$width%;background-color:$color;'>" . $sector['tag'] . "</div>";
                        echo "</div>";
                        $columnCount = 0;
                    } else {
                        echo "<div class='board-tag' style='width:$width%;background-color:$color;'>" . $sector['tag'] . "</div>";
                        $columnCount++;
                    }
                } ?>
            </div>
        </div>
        <script>
            (function() {
                document.querySelector('.board-container')
                    .addEventListener('click', function(ev) {
                        const target = ev.target;
                        document.querySelectorAll('board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
                        if (target.className === 'board-tag') {
                            target.setAttribute('class', 'board-tag selected');
                        }
                    });



                /*
                AQUI LA CREACION DE LA JUGADA POR METODO POST
                    $.ajax({
                        method: 'post',
                        url: url de api,
                        data: {
                            tag: $(this).text(),
                            value: $('#value').val(),
                            user: $('#user').data('id')
                        }
                    })
                */

            })();
        </script>
<?php
    }

    public static function save_post($post_id, $post = null)
    {
        if("rulette_sector"  == get_post_type()) {
            update_post_meta($post_id, "wp_rulette_tag", $_POST['wp_rulette_tag']);
            update_post_meta($post_id, "wp_rulette_color", $_POST['wp_rulette_color']);
            update_post_meta($post_id, "wp_rulette_image_name", $_POST['wp_rulette_image_name']);
            update_post_meta($post_id, "wp_rulette_image_src", $_POST['wp_rulette_image_src']);
            update_post_meta($post_id, "wp_rulette_image_file", $_POST['wp_rulette_image_file']);
            update_post_meta($post_id, "wp_rulette_order", $_POST['wp_rulette_order']);
        }
        elseif( 'rulette_level' == get_post_type( ) ) {
            update_post_meta( $post_id, "wp_rulette_restart", $_POST['wp_rulette_restart']);
        }

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
            'taxonomies' => ['gamepack'],
            //'menu_icon'    => pods_svg_icon('pods'),
            //'menu_position' => 5,
            'show_in_nav_menus' => false,
        ]);

        self::create_type_post('rulette_level', 'Nivel de la ruleta', 'Niveles de la ruleta', [
            'description' => 'Define los diferentes niveles de dificulta de la ruleta',
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

        register_taxonomy(
            'gamepack',
            ['rulette_sector'],
            [
                'hierarchical'          => false,
                'labels'                => [
                    'name'                       => 'Juegos',
                    'singular_name'              => 'Juego',
                    'search_items'               => 'Buscar Juegos',
                    'popular_items'              => 'Juegos Comunes',
                    'all_items'                  => 'Todos los Juegos',
                    'parent_item'                => null,
                    'parent_item_colon'          => null,
                    'edit_item'                  => 'Editar Juego',
                    'update_item'                => 'Actualizar Juego',
                    'add_new_item'               => 'Agregar Nuevo Juego',
                    'new_item_name'              => 'Nuevo Juego Agregado',
                    'separate_items_with_commas' => 'Separar Juegos con comas',
                    'add_or_remove_items'        => 'Agregar o Remover Juegos',
                    'choose_from_most_used'      => 'Seleccionar Juegos mas usados',
                    'not_found'                  => 'Juego no encontrado',
                    'menu_name'                  => 'Juegos'
                ],
                'show_ui'               => true,
                'show_admin_column'     => true,
                'update_count_callback' => '_update_post_term_count',
                'query_var'             => true,
                'rewrite'               => array('slug' => 'gamepack')
            ]
        );
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
                'title' => 'Tag',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/tag.php';
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

        self::create_meta('rulette_level', [
            [
                'title' => 'Relanzamientos',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/restart.php';
                }
            ],
            [
                'title' => 'Función personalizada',
                'render_callback' => function () {
                    include WP_PLUGIN_DIR . '/wp_rulette/metas/custom_function.php';
                }
            ]
        ]);
    }
}
