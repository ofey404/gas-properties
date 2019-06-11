// Copyright 2019, University of Colorado Boulder

/**
 * Utility methods related to Particles and collections of Particles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesContainer = require( 'GAS_PROPERTIES/common/model/GasPropertiesContainer' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );

  const ParticleUtils = {

    /**
     * Steps a collection of particles.
     * @param {ObservableArray} particles
     * @param {number} dt - time step in ps
     * @public
     */
    stepParticles( particles, dt ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

      const array = particles.getArray(); // use raw array for performance
      for ( let i = 0; i < array.length; i++ ) {
        array[ i ].step( dt );
      }
    },

    /**
     * Removes a particle from an array and disposes it.
     * @param {Particle} particle
     * @param {ObservableArray} particles
     * @public
     */
    removeParticle: function( particle, particles ) {
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );

      assert && assert( particles.indexOf( particle ) !== -1, 'particle not found' );

      particles.remove( particle );
      particle.dispose();
    },

    /**
     * Removes the last n particles from an array and disposes them.
     * @param {number} n
     * @param {ObservableArray} particles
     * @public
     */
    removeParticles: function( n, particles ) {
      assert && assert( n <= particles.length,
        `attempted to remove ${n} particles, but we only have ${particles.length} particles` );
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );

      for ( let i = 0; i < n; i++ ) {
        const lastParticle = particles.get( particles.lengthProperty.value - 1 );
        ParticleUtils.removeParticle( lastParticle, particles );
      }
    },

    /**
     * Removes and disposes an entire collection of particles.
     * @param {ObservableArray} particles
     * @public
     */
    removeAllParticles: function( particles ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );

      ParticleUtils.removeParticles( particles.lengthProperty.value, particles );
    },

    /**
     * Removes particles that are above the specified bounds and disposes them.
     * @param {ObservableArray} particles
     * @param {Bounds2} bounds
     * @public
     */
    removeParticlesAboveBounds: function( particles, bounds ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );
      assert && assert( bounds instanceof Bounds2, `invalid bounds: ${bounds}` );

      const array = particles.getArray(); // use raw array for performance
      for ( let i = array.length - 1; i >= 0; i-- ) {
        const particle = array[ i ];
        if ( particle.bottom > bounds.maxY ) {
          ParticleUtils.removeParticle( particle, particles );
        }
      }
    },

    /**
     * Redistributes particles in the horizontal dimension.
     * @param {ObservableArray} particles
     * @param {number} scaleX - amount to scale the location's x component
     * @public
     */
    redistributeParticles: function( particles, scaleX ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );
      assert && assert( typeof scaleX === 'number' && scaleX > 0, `invalid scaleX: ${scaleX}` );

      const array = particles.getArray(); // use raw array for performance
      for ( let i = 0; i < array.length; i++ ) {
        const particle = array[ i ];
        particle.location.setX( scaleX * particle.location.x );
      }
    },

    /**
     * Heats or cools a collection of particles.
     * @param {ObservableArray} particles
     * @param {number} heatCoolFactor - (-1,1), heat=[0,1), cool=(-1,0]
     * @public
     */
    heatCoolParticles: function( particles, heatCoolFactor ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );
      assert && assert( typeof heatCoolFactor === 'number' && heatCoolFactor >= -1 && heatCoolFactor <= 1,
        `invalid heatCoolFactor: ${heatCoolFactor}` );

      const velocityScale = 1 + heatCoolFactor / GasPropertiesQueryParameters.heatCool;
      const array = particles.getArray(); // use raw array for performance/
      for ( let i = 0; i < array.length; i++ ) {
        array[ i ].scaleVelocity( velocityScale );
      }
    },

    /**
     * Identifies particles that have escaped via the opening in the top of the container, and
     * moves them from insideParticles to outsideParticles.
     * @param {GasPropertiesContainer} container
     * @param {NumberProperty} numberOfParticlesProperty - number of particles inside the container
     * @param {ObservableArray} insideParticles - particles inside the container
     * @param {ObservableArray} outsideParticles - particles outside the container
     * @public
     */
    escapeParticles: function( container, numberOfParticlesProperty, insideParticles, outsideParticles ) {
      assert && assert( container instanceof GasPropertiesContainer, `invalid container: ${container}` );
      assert && assert( numberOfParticlesProperty instanceof NumberProperty,
        `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );
      assert && assert( insideParticles instanceof ObservableArray, `invalid insideParticles: ${insideParticles}` );
      assert && assert( outsideParticles instanceof ObservableArray, `invalid outsideParticles: ${outsideParticles}` );

      const array = insideParticles.getArray(); // use raw array for performance
      for ( let i = array.length - 1; i >= 0; i-- ) {
        const particle = array[ i ];
        assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
        if ( particle.top > container.top &&
             particle.left > container.getOpeningLeft() &&
             particle.right < container.openingRight ) {
          insideParticles.remove( particle );
          numberOfParticlesProperty.value--;
          outsideParticles.push( particle );
        }
      }
    },

    /**
     * Gets the total kinetic energy of a collection of particles.
     * @param {ObservableArray} particles
     * @returns {number} in AMU * pm^2 / ps^2
     * @public
     */
    getTotalKineticEnergy: function( particles ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );

      let totalKineticEnergy = 0;
      const array = particles.getArray(); // use raw array for performance
      for ( let i = 0; i < array.length; i++ ) {
        totalKineticEnergy += array[ i ].getKineticEnergy();
      }
      return totalKineticEnergy;
    },

    /**
     * Gets the centerX of mass for a collection of particles.
     * @param {ObservableArray} particles
     * @returns {number|null} null if there are no particles and therefore no center of mass
     * @public
     */
    getCenterXOfMass: function( particles ) {
      assert && assert( particles instanceof ObservableArray, `invalid particles: ${particles}` );

      const array = particles.getArray(); // use raw array for performance
      if ( array.length > 0 ) {
        let numerator = 0;
        let totalMass = 0;
        for ( let i = 0; i < array.length; i++ ) {
          const particle = array[ i ];
          numerator += ( particle.mass * particle.location.x );
          totalMass += particle.mass;
        }
        return numerator / totalMass;
      }
      else {
        return null;
      }
    }
  };

  return gasProperties.register( 'ParticleUtils', ParticleUtils );
} );