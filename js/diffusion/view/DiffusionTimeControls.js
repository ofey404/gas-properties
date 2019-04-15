// Copyright 2019, University of Colorado Boulder

/**
 * Time controls for the 'Diffusion' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const TimeControls = require( 'GAS_PROPERTIES/common/view/TimeControls' );
  const TimescaleControl = require( 'GAS_PROPERTIES/diffusion/view/TimescaleControl' );

  class DiffusionTimeControls extends HBox {

    /**
     * @param {DiffusionModel} model narrower interface?
     * @param {Object} [options]
     * @constructor
     */
    constructor( model, options ) {

      options = _.extend( {
        spacing: 35,
        align: 'center'
      }, options );

      const timeControls = new TimeControls( model );

      const timescaleControl = new TimescaleControl( model.timescaleProperty );

      assert && assert( !options.children, 'DiffusionTimeControls sets children' );
      options = _.extend( {
        children: [ timeControls, timescaleControl ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'DiffusionTimeControls', DiffusionTimeControls );
} );