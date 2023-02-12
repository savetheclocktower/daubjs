<html>

<?php

include_once(plugin_dir_path(__FILE__) . "lib/amazon.php");
include_once(plugin_dir_path(__FILE__) . "lib/igdb.php");

include_once(plugin_dir_path(__FILE__) . "lib/preg_replace_callback_offset.php");

if (!function_exists('write_log')) {
  function write_log ( $log )  {
    if ( true === WP_DEBUG ) {
      if ( is_array( $log ) || is_object( $log ) ) {
        error_log( print_r( $log, true ) );
      } else {
        error_log( $log );
      }
    }
  }
}

function tumblelog_get_post_series_link($term_id) {
  $url = get_term_link($term_id, 'post_series');
  $url = str_replace('post_series', 'series', $url);
  return "${url}?order=asc";
}

function tumblelog_add_og_to_head() {
  $og = array();
  $og['site_name'] = get_bloginfo('name');
  $og['type'] = 'website';
  $og['description'] = get_bloginfo('description');

  if ( is_single() ) {
    $og = tumblelog_add_og_for_single($og);
  }

  foreach ($og as $property => $content) {
    echo "<meta property='og:${property}' content='${content}'>\n";
  }
}

// CUSTOM POST VALUES
// ==================

function tumblelog_get_custom_values($post_id=0) {
  $array = array();
  $custom = get_post_custom($post_id);
  if (count($custom) == 0 || !$custom) { return false; }

  foreach ($custom as $key => $val) {
    if ( preg_match('/^t(u(?:m|v))bl\'e_/', $key) ) {
      $key = preg_replace('/^tumble_/', '', $key);
      $array[$key] = $val[0];
    }
  }

  if (count($array) == 0) { return false; }
  return $array;
}

include(__DIR__ . '/admin_area.php');
include(__DIR__ . '/filters.php');
include(__DIR__ . '/media.php');
include(__DIR__ . '/remote.php');
include(__DIR__ . '/template_tags.php');

?>

  <img src="<?php echo $t['image'] ?>" alt="">
</html>
