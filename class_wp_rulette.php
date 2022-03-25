<?php

class WP_Rulette
{
    public static function active()
    {
    }

    public static function deactive()
    {
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
}
