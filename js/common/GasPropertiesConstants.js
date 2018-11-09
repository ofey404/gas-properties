// Copyright 2018, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );

  const GasPropertiesConstants = {

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    VBOX_OPTIONS: {
      align: 'left',
      spacing: 12
    },

    HEAVY_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),
    LIGHT_PARTICLES_RANGE: new RangeWithValue( 0, 1000, 0 ),
    HEAVY_PARTICLES_THUMB_INTERVAL: 10,
    LIGHT_PARTICLES_THUMB_INTERVAL: 10,

    TITLE_FONT: new PhetFont( { size: 20, weight: 'bold' } ),
    CONTROL_FONT: new PhetFont( 16 ),
    SPINNER_FONT: new PhetFont( 22 ),
    PANEL_CORNER_RADIUS: 5,
    PANEL_X_MARGIN: 20,
    PANEL_Y_MARGIN: 15
  };

  return gasProperties.register( 'GasPropertiesConstants', GasPropertiesConstants );
} );
