<?php 
/*
Plugin Name: Reclaim Headless Conference
Plugin URI:  https://
Description: JSON data feeding MBS's javascript display
Version:     1.0
Author:      Tom Woodward
Author URI:  https://bionicteaching.com
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: my-toolset

*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );


add_action('wp_enqueue_scripts', 'reclaim_headless_load_scripts');

function reclaim_headless_load_scripts() {                           
    $version= '1.0'; 
    $in_footer = true;
    wp_enqueue_script('new-jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js', '', '3.2.1', true); 
    
    wp_enqueue_script('mousewheel', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js', array('new-jquery'), '3.1.13', $in_footer);     
    wp_enqueue_script('luxon', 'https://watch.reclaimed.tech//js/luxon.js', array('new-jquery'), $version, $in_footer);     
    wp_enqueue_script('axios', 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js', array('new-jquery', 'luxon'), $version, $in_footer); 
    wp_enqueue_script('reclaim-app', plugin_dir_url( __FILE__) . 'js/app.js', array('new-jquery', 'axios'), $version, $in_footer); 

     $script_params = array(
           /* examples */
           'url' => site_url() . '/wp-json/wp/v2/presentation?per_page=99',
           //'users' => array( 1, 20, 2049 )
       );

       wp_localize_script( 'reclaim-app', 'scriptParams', $script_params );


    wp_enqueue_style( 'bulma-style', plugin_dir_url( __FILE__) . 'css/bulma.css');
    wp_enqueue_style( 'reclaim-style', plugin_dir_url( __FILE__) . 'css/roadshow.css');
}



// UnderStrap's includes directory.
$reclaim_headless_inc_dir = plugin_dir_path(__FILE__)  . 'inc';

$reclaim_headless_includes = array(
   '/custom-post-types.php',                          // Load custom post types and taxonomies
   '/acf.php'                          // Load custom post types and taxonomies
);


// Include files.
foreach ( $reclaim_headless_includes as $file ) {
   require_once $reclaim_headless_inc_dir . $file;
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

//LOGGER -- like frogger but more useful

if ( ! function_exists('write_log')) {
   function write_log ( $log )  {
      if ( is_array( $log ) || is_object( $log ) ) {
         error_log( print_r( $log, true ) );
      } else {
         error_log( $log );
      }
   }
}

// add_filter( 'acf/rest_api/presentation/get_fields', function( $data, $response ) {
//    if ( isset( $data['acf']['session_description'] ) ) {
//       // my change here
//       $data['acf']['session_description'] = apply_filters('wpautop', $data['acf']['session_description'] );
//    }

//    return $data;
// }, 10, 2 );


function reclaim_headless_display_data(){
   $template = include('template/content-base.php');
}

add_shortcode( 'display', 'reclaim_headless_display_data' );


//save acf json
add_filter('acf/settings/save_json', 'reclaim_headless_json_save_point');
 
function reclaim_headless_json_save_point( $path ) {
    
    // update path
    $path = plugin_dir_path(__FILE__) . '/acf-json'; //replace w get_stylesheet_directory() for theme
    
    write_log($path);
    // return
    return $path;
    
}


// load acf json
add_filter('acf/settings/load_json', 'reclaim_headless_json_load_point');

function reclaim_headless_json_load_point( $paths ) {
    
    // remove original path (optional)
    unset($paths[0]);
    
    
    // append path
    $paths[] = plugin_dir_path(__FILE__) . '/acf-json';//replace w get_stylesheet_directory() for theme
    
    
    // return
    return $paths;
    
}


//NAME speaker title to reflect first and last name fields
function speaker_rename ($post_id){
  $type = get_post_type($post_id);
  $last = get_field('last_name');
  $first = get_field('first_name');

  if ($type === 'speaker'){
    remove_action( 'save_post', 'speaker_rename' );
   
    $my_post = array(
        'ID'           => $post_id,
        'post_title'   => $last . ', ' . $first,      
    );

  // Update the post into the database
    wp_update_post( $my_post );
  }
}
add_action( 'save_post', 'speaker_rename' );



//from https://stackoverflow.com/questions/56473929/how-to-expose-all-the-acf-fields-to-wordpress-rest-api-in-both-pages-and-custom REMEMBER TO CHANGE PREPARE TO REFLECT CUSTOM POST TYPE

function acf_to_rest_api($response, $post, $request) {
    if (!function_exists('get_fields')) return $response;

    if (isset($post)) {
        $acf = get_fields($post->id);        
        $response->data['acf'] = $acf;       
    }
    return $response;
}
add_filter('rest_prepare_presentation', 'acf_to_rest_api', 10, 3);

function acf_to_rest_api_presenter($response, $post, $request) {
    if (!function_exists('get_fields')) return $response;

    if (isset($post)) {
        $acf = get_fields($post->id);
        $response->data['acf'] = $acf;
    }
    return $response;
}
add_filter('rest_prepare_speaker', 'acf_to_rest_api_presenter', 10, 3);


// menu json api via https://stackoverflow.com/a/66157232/3390935

function wp_menu_route() {
    $menuLocations = get_nav_menu_locations(); // Get nav locations set in theme, usually functions.php)
    return $menuLocations;
    }

    add_action( 'rest_api_init', function () {
        register_rest_route( 'custom', '/menu/', array(
        'methods' => 'GET',
        'callback' => 'wp_menu_route',
    ) );
} );

function wp_menu_single($data) {
    $menuID = $data['id']; // Get the menu from the ID
    $primaryNav = wp_get_nav_menu_items($menuID); // Get the array of wp objects, the nav items for our queried location.
    return $primaryNav;
    }

    add_action( 'rest_api_init', function () {
        register_rest_route( 'custom', '/menu/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'wp_menu_single',
    ) );
} );


//CORS 

function add_cors_http_header(){
    header("Access-Control-Allow-Origin: *");
}
add_action('init','add_cors_http_header');