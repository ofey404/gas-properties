// Copyright 2018-2019, University of Colorado Boulder

/**
 * User interface for global options, shown in the 'Options' dialog, accessed from the PhET Menu.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesGlobalOptions = require( 'GAS_PROPERTIES/common/GasPropertiesGlobalOptions' );
  const ProjectorModeCheckbox = require( 'JOIST/ProjectorModeCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const pressureNoiseString = require( 'string!GAS_PROPERTIES/pressureNoise' );

  class GasPropertiesGlobalOptionsNode extends VBox {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = _.extend( {
        hasPressureNoiseCheckbox: true, // whether to include the 'Pressure Noise' checkbox

        // superclass options
        spacing: 12
      }, options );

      const children = [];

      // Projector Mode checkbox
      const projectorModeCheckbox = new ProjectorModeCheckbox( _.extend( {}, GasPropertiesConstants.CHECKBOX_OPTIONS, {
        font: GasPropertiesConstants.CONTROL_FONT,
        projectorModeEnabledProperty: GasPropertiesGlobalOptions.projectorModeEnabledProperty
      } ) );
      children.push( projectorModeCheckbox );

      // Pressure Noise checkbox
      if ( options.hasPressureNoiseCheckbox ) {
        const pressureNoiseCheckbox = new Checkbox(
          new Text( pressureNoiseString, { font: GasPropertiesConstants.CONTROL_FONT } ),
          GasPropertiesGlobalOptions.pressureNoiseProperty,
          GasPropertiesConstants.CHECKBOX_OPTIONS
        );
        children.push( pressureNoiseCheckbox );
      }

      assert && assert( !options.children, 'GasPropertiesGlobalOptionsNode sets children' );
      options.children = children;

      super( options );

      // Switch between default and projector color profiles.
      GasPropertiesGlobalOptions.projectorModeEnabledProperty.link( projectorModeEnabled => {
        GasPropertiesColorProfile.profileNameProperty.set( projectorModeEnabled ? 'projector' : 'default' );
      } );
    }
  }

  return gasProperties.register( 'GasPropertiesGlobalOptionsNode', GasPropertiesGlobalOptionsNode );
} );