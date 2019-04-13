// Copyright 2018-2019, University of Colorado Boulder

/**
 * Checkbox to show/hide the width of the container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );

  // strings
  const widthString = require( 'string!GAS_PROPERTIES/width' );

  class WidthCheckbox extends GasPropertiesCheckbox {

    /**
     * @param {BooleanProperty} sizeVisibleProperty
     * @param {Object} [options]
     */
    constructor( sizeVisibleProperty, options ) {

      if ( options ) {
        assert && assert( !options.text, 'WidthCheckbox sets text' );
        assert && assert( !options.icon, 'WidthCheckbox sets icon' );
      }

      options = _.extend( {
        text: widthString,
        icon: GasPropertiesIconFactory.createContainerWidthIcon()
      }, options );

      super( sizeVisibleProperty, options );
    }
  }

  return gasProperties.register( 'WidthCheckbox', WidthCheckbox );
} );