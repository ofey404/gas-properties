// Copyright 2019, University of Colorado Boulder

/**
 * Renders the particle system for the 'Ideal', 'Explore', and 'Energy' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const ParticlesNode = require( 'GAS_PROPERTIES/common/view/ParticlesNode' );
  const Property = require( 'AXON/Property' );

  class GasPropertiesParticlesNode extends ParticlesNode {

    /**
     * @param {GasPropertiesModel} model
     */
    constructor( model ) {

      // {Property.<HTMLCanvasElement>} generated images for the heavy and light particle types
      const heavyParticleImageProperty = new Property( null );
      const lightParticleImageProperty = new Property( null );

      // Create heavy particle image to match color profile.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      Property.multilink(
        [ GasPropertiesColorProfile.heavyParticleColorProperty, GasPropertiesColorProfile.heavyParticleHighlightColorProperty ],
        ( color, highlightColor ) => {
          const heavyParticle = new HeavyParticle();
          const particleNode = new ParticleNode( heavyParticle, model.modelViewTransform );
          particleNode.toCanvas( canvas => { heavyParticleImageProperty.value = canvas; } );
        } );

      // Create light particle image to match color profile.
      // The content is centered in the HTMLCanvasElement, and may have uniform padding around it.
      Property.multilink(
        [ GasPropertiesColorProfile.lightParticleColorProperty, GasPropertiesColorProfile.lightParticleHighlightColorProperty ],
        ( color, highlightColor ) => {
          const lightParticle = new LightParticle();
          const particleNode = new ParticleNode( lightParticle, model.modelViewTransform );
          particleNode.toCanvas( canvas => { lightParticleImageProperty.value = canvas; } );
        } );

      super(
        model.modelBoundsProperty,
        model.modelViewTransform,
        [ model.heavyParticles, model.lightParticles, model.heavyParticlesOutside, model.lightParticlesOutside ],
        [ heavyParticleImageProperty, lightParticleImageProperty, heavyParticleImageProperty, lightParticleImageProperty ]
      );
    }
  }

  return gasProperties.register( 'GasPropertiesParticlesNode', GasPropertiesParticlesNode );
} );