// Copyright 2019, University of Colorado Boulder

//TODO maintain fixed width
/**
 * SpeedAccordionBox contains the speed histogram and related controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesCheckbox = require( 'GAS_PROPERTIES/common/view/GasPropertiesCheckbox' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesIconFactory = require( 'GAS_PROPERTIES/common/view/GasPropertiesIconFactory' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const SpeedHistogram = require( 'GAS_PROPERTIES/energy/view/SpeedHistogram' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const speedString = require( 'string!GAS_PROPERTIES/speed' );

  class SpeedAccordionBox extends AccordionBox {

    /**
     * @param {IdealModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {

      options = _.extend( {
        titleNode: new Text( speedString, {
          //TODO maxWidth
          font: GasPropertiesConstants.TITLE_FONT,
          fill: GasPropertiesColorProfile.textFillProperty
        } )
      }, GasPropertiesConstants.ACCORDION_BOX_OPTIONS, options );

      //TODO should these Properties live somewhere else?
      // @private
      const heavyVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );
      const lightVisibleProperty = new BooleanProperty( GasPropertiesQueryParameters.checked );

      const histogram = new SpeedHistogram( model, heavyVisibleProperty, lightVisibleProperty );

      const iconOptions = {
        align: 'center',
        spacing: 5
      };

      // Heavy particles checkbox
      const heavyCheckbox = new GasPropertiesCheckbox( heavyVisibleProperty, {
        icon: new HBox( _.extend( {
          children: [
            GasPropertiesIconFactory.createHeavyParticleIcon( model.modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.heavyParticleColorProperty )
          ]
        }, iconOptions ) )
      } );

      // Light particles checkbox
      const lightCheckbox = new GasPropertiesCheckbox( lightVisibleProperty, {
        icon: new HBox( _.extend( {
          children: [
            GasPropertiesIconFactory.createLightParticleIcon( model.modelViewTransform ),
            GasPropertiesIconFactory.createHistogramIcon( GasPropertiesColorProfile.lightParticleColorProperty )
          ]
        }, iconOptions ) )
      } );

      const checkboxes = new HBox( {
        children: [ heavyCheckbox, lightCheckbox ],
        align: 'center',
        spacing: 25
      } );

      //TODO use GasPropertiesConstants.VBOX_OPTIONS ?
      const contentNode = new VBox( _.extend( {}, GasPropertiesConstants.VBOX_OPTIONS, {
        align: 'center',
        children: [ histogram, checkboxes ]
      } ) );

      super( contentNode, options );

      // @private
      this.expandedProperty = options.expandedProperty;
      this.heavyVisibleProperty = heavyVisibleProperty;
      this.lightVisibleProperty = lightVisibleProperty;
    }

    // @public
    reset() {
      this.expandedProperty.reset();
      this.heavyVisibleProperty.reset();
      this.lightVisibleProperty.reset();
    }
  }

  return gasProperties.register( 'SpeedAccordionBox', SpeedAccordionBox );
} );