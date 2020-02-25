// Copyright 2018-2020, University of Colorado Boulder

/**
 * NumberOfParticlesControl is a control for changing the number of particles for a specific type of particle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const FineCoarseSpinner = require( 'SCENERY_PHET/FineCoarseSpinner' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // const
  const X_SPACING = 8;

  class NumberOfParticlesControl extends VBox {

    /**
     * @param {Node} icon
     * @param {string} title
     * @param {NumberProperty} numberOfParticlesProperty
     * @param {Object} [options]
     */
    constructor( icon, title, numberOfParticlesProperty, options ) {
      assert && assert( icon instanceof Node, `invalid icon: ${icon}` );
      assert && assert( typeof title === 'string', `invalid title: ${title}` );
      assert && assert( numberOfParticlesProperty instanceof NumberProperty,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );

      options = merge( {

        // superclass options
        align: 'left',
        spacing: 10,

        // phet-io
        tandem: Tandem.REQUIRED
      }, options );

      assert && assert( numberOfParticlesProperty instanceof NumberProperty,
        'invalid numberOfParticlesProperty: ' + numberOfParticlesProperty );
      assert && assert( numberOfParticlesProperty.range,
        'numberOfParticlesProperty missing range' );

      const titleNode = new Text( title, {
        font: GasPropertiesConstants.CONTROL_FONT,
        fill: GasPropertiesColorProfile.textFillProperty,
        maxWidth: 150, // determined empirically,
        tandem: options.tandem.createTandem( 'titleNode' )
      } );

      const titleBox = new HBox( {
        spacing: X_SPACING,
        children: [ icon, titleNode ]
      } );

      const spinner = new FineCoarseSpinner( numberOfParticlesProperty, {
        deltaFine: 1,
        deltaCoarse: 50,
        numberDisplayOptions: {
          font: new PhetFont( 18 )
        },
        maxWidth: 190, // determined empirically
        tandem: options.tandem.createTandem( 'spinner' )
      } );

      // Limit width of text
      titleNode.maxWidth = spinner.width - icon.width - X_SPACING;

      assert && assert( !options.children, 'NumberOfParticlesControl sets children' );
      options = merge( {
        children: [ titleBox, spinner ]
      }, options );

      super( options );
    }
  }

  return gasProperties.register( 'NumberOfParticlesControl', NumberOfParticlesControl );
} );