// Copyright 2018-2019, University of Colorado Boulder

/**
 * CollisionCounter counts collisions between particles and the walls of a container.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CollisionDetector = require( 'GAS_PROPERTIES/common/model/CollisionDetector' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class CollisionCounter {

    /**
     * @param {CollisionDetector} collisionDetector - detects collisions between particles and the container
     * @param {Object} [options]
     */
    constructor( collisionDetector, options ) {
      assert && assert( collisionDetector instanceof CollisionDetector,
        `invalid collisionDetector: ${collisionDetector}` );

      options = _.extend( {
        location: Vector2.ZERO,
        visible: false
      }, options );

      // @private
      this.collisionDetector = collisionDetector;

      // @public location of the collision counter, in view coordinates
      this.locationProperty = new Vector2Property( options.location );

      // @public (read-only) the number of particle-container collisions
      this.numberOfCollisionsProperty = new NumberProperty( 0, {
        numberType: 'Integer',
        isValidValue: value => ( value >= 0 )
      } );

      // @public whether the collision counter is running
      this.isRunningProperty = new BooleanProperty( false );

      // @private time that the counter has been running, in ps
      this.timeRunning = 0;

      // @public whether the collision counter is visible
      this.visibleProperty = new BooleanProperty( options.visible );

      // @public (read-only) valid values for samplePeriodProperty, in ps
      this.samplePeriods = [ 5, 10, 20 ];

      // @public sample period for counting collisions
      // Actual sample period will be close to this value, but not exact (confirmed OK with @arouifar).
      this.samplePeriodProperty = new NumberProperty( this.samplePeriods[ 1 ], {
        numberType: 'Integer',
        validValues: this.samplePeriods,
        units: 'ps'
      } );

      // Changing the running state resets the collision count.
      // REVIEW: could omit the param and just use () => this.resetCount()
      this.isRunningProperty.link( isRunning => this.resetCount() );

      // Changing visibility or sample period stops the counter and resets the collision count.
      // REVIEW: could omit params in both linked function below.
      this.visibleProperty.link( visible => this.stopAndResetCount() );
      this.samplePeriodProperty.link( samplePeriod => this.stopAndResetCount() );
    }

    /**
     * Resets the collision counter.
     * @public
     */
    reset() {
      this.locationProperty.reset();
      this.numberOfCollisionsProperty.reset();
      this.isRunningProperty.reset();
      this.visibleProperty.reset();
      this.samplePeriodProperty.reset();
    }

    /**
     * Resets the collision count and set its run-time to zero.
     * @private
     */
    resetCount() {
      this.numberOfCollisionsProperty.value = 0;
      this.timeRunning = 0;
    }

    /**
     * Stops the collision counter and does resetCount.
     * @private
     */
    stopAndResetCount() {
      this.isRunningProperty.value = false;
      this.resetCount();
    }

    /**
     * Steps the collision counter.
     * @param {number} dt - time step, in ps
     * @public
     */
    step( dt ) {
      assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );
      if ( this.isRunningProperty.value ) {

        // record the number of collisions for this time step
        this.numberOfCollisionsProperty.value += this.collisionDetector.numberOfParticleContainerCollisions;

        // If we've come to the end of the sample period, stop the counter.
        // isRunningProperty is used by the Play/Reset toggle button, and changing its state resets the count.
        // So we need to save and restore the count here when modifying isRunningProperty.  This was simpler
        // than other solutions that were investigated.
        this.timeRunning += dt;
        if ( this.timeRunning >= this.samplePeriodProperty.value ) {
          phet.log && phet.log( `CollisionCounter sample period: desired=${this.samplePeriodProperty.value} actual=${this.timeRunning}` );
          const numberOfCollisions = this.numberOfCollisionsProperty.value;
          this.isRunningProperty.value = false;
          this.numberOfCollisionsProperty.value = numberOfCollisions;
        }
      }
    }
  }

  return gasProperties.register( 'CollisionCounter', CollisionCounter );
} );