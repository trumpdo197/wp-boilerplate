<?php
// Frontend Theme Setup
if (!is_admin()) {
  // Init Stylesheets & JS
  // --------------
  // STYLESHEET
  // --------------
  //
  function register_script()
  {
    // wp_deregister_script('jquery');
    wp_enqueue_script('mainjs', get_template_directory_uri() . '/dist/scripts/main.bundle.js', array(), false, true);

    if (is_front_page()) {
      wp_enqueue_script('home', get_template_directory_uri() . '/dist/scripts/home.bundle.js', array(), false, true);
    }
  }
  add_action('wp_enqueue_scripts', 'register_script');
}

//----------------//
// Core
// ---------------//

function page_setup()
{
  // Custom logo
  add_theme_support('custom-logo', array());

  // Post image
  add_theme_support('post-thumbnails');

  // Post exceprt
  add_theme_support('post-exceprt');
}

add_action('after_setup_theme', 'page_setup');

function register_my_menus()
{
  register_nav_menus(
    array(
      'header-menu' => __('Header Menu'),
      'footer-menu' => __('Footer Menu')
    )
  );
}
add_action('init', 'register_my_menus');

function add_acf_option_page()
{
  function_exists('acf_add_options_page') && acf_add_options_page(['menu_title' => 'Cài đặt']);
}

add_action('init', 'add_acf_option_page');
