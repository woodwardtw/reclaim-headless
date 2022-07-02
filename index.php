<?php 
/*
Plugin Name: ALT OER Conference
Plugin URI:  https://
Description: Allowing the creation of JSON through ACF Structures for MBS's javascript ingestion
Version:     1.0
Author:      Tom Woodward
Author URI:  https://bionicteaching.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: my-toolset

*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


// UnderStrap's includes directory.
$alt_conf_inc_dir = plugin_dir_path(__FILE__)  . 'inc';

$alt_conf_includes = array(
   '/custom-post-types.php',                          // Load custom post types and taxonomies
   '/acf.php'                          // Load custom post types and taxonomies
);


// Include files.
foreach ( $alt_conf_includes as $file ) {
   require_once $alt_conf_inc_dir . $file;
}

function acf_to_rest_api_presentation($response, $post, $request) {
    if (!function_exists('get_fields')) return $response;

    if (isset($post)) {
        $acf = get_fields($post->id);
        $response->data['mbs'] = $acf;
    }
    return $response;
}
add_filter('rest_prepare_presentation', 'acf_to_rest_api_presentation', 10, 3);



// add_filter( 'acf/rest_api/presentation/get_fields', function( $data, $response ) {
//    if ( isset( $data['acf']['session_description'] ) ) {
//       // my change here
//       $data['acf']['session_description'] = apply_filters('wpautop', $data['acf']['session_description'] );
//    }

//    return $data;
// }, 10, 2 );

