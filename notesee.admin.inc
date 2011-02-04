<?php
// $Id$

/**
 * @file
 * Admin functions for notesee.
 *
 */
 
/**
 * Form builder for the notesee admin form.
 *
 * @see notesee_admin_form()
 * @ingroup forms
 */
function notesee_admin_form($form, &$form_state) {
  $form = array();
  $form['width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width'),
    '#default_value' => variable_get('notesee_config_width', 1024),
  );
  $form['zindex'] = array(
    '#type' => 'textfield',
    '#title' => t('Z-Index'),
    '#default_value' => variable_get('notesee_config_zindex', 400),
  );
  $form['center'] = array(
    '#type' => 'checkbox',
    '#title' => t('Is the webpage centered?'),
    '#default_value' => variable_get('notesee_config_center', TRUE),
  );

  $form['menu_top'] = array(
    '#type' => 'textfield',
    '#title' => t('Menu Top Location'),
    '#default_value' => variable_get('notesee_config_menu_top', 0),
  );
  $form['menu_left'] = array(
    '#type' => 'textfield',
    '#title' => t('Menu Left Location'),
    '#default_value' => variable_get('notesee_config_menu_left', 0),
  );
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Update'),
  );
  return $form;
}


/**
 * Form submission handler for notesee_admin_form().
 *
 * @see notesee_admin_form()
 */
function notesee_admin_form_submit($form, &$form_state) {
  variable_set('notesee_config_width', $form_state['values']['width']);
  variable_set('notesee_config_center', $form_state['values']['center']);
  variable_set('notesee_config_zindex', $form_state['values']['zindex']);
  variable_set('notesee_config_menu_top', $form_state['values']['menu_top']);
  variable_set('notesee_config_menu_left', $form_state['values']['menu_left']);
  drupal_set_message(t('Changes saved.'));
}
