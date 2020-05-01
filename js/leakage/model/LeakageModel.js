// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties';
import BaseModel from '../../common/model/BaseModel.js';
import LeakageContainer from './LeakageContainer.js';
import LeakageCollisionDetector from './LeakageCollisionDetector.js';
import ParticleUtils from '../../common/model/ParticleUtils.js';
import LeakageParticle from './LeakageParticle';
import Vector2 from '../../../../dot/js/Vector2.js';
import LeakageSettings from './LeakageSettings';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../../../axon/js/DerivedPropertyIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';


class LeakageModel extends BaseModel {
  /**
   * @param {Tandem} tandem
   */

   constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );
    
    super( tandem, {
      // Offset of the model's origin, in view coordinates. Determines where the container's bottom-right corner is.
      modelOriginOffset: new Vector2( 670, 520 ),

      // Stopwatch initial position (in view coordinates!), determined empirically.
      stopwatchPosition: new Vector2( 60, 50 )
    } );

    this.particles = [];

    this.container = new LeakageContainer( {
      tandem: tandem.createTandem( 'container' )
    } );

    // @public (read-only)
    this.collisionDetector = new LeakageCollisionDetector( this.container, this.particles );

    this.settings = new LeakageSettings( {
      tandem: tandem.createTandem( 'settings' )
    } );

    this.createLeakageParticle = options => new LeakageParticle( options );

    // Two bounds in which number of particles are kept as constant.
    this.vaccumCellBounds = new Bounds2(
      this.container.bounds.minX,
      this.container.bounds.minY,
      this.container.bounds.maxX - this.container.bounds.width * 2 / 3,
      this.container.bounds.maxY
    );

    this.outsideCellBounds = new Bounds2(
      this.container.bounds.minX + this.container.bounds.width * 2 / 3,
      this.container.bounds.minY,
      this.container.bounds.maxX,
      this.container.bounds.maxY
    );

    this.settings.vacuumCellNumberProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        this.vaccumCellBounds,
        this.settings,
        this.particles,
        this.createLeakageParticle,
        this.container.obstacleArray );
    } );

    this.settings.outsideCellNumberProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        this.outsideCellBounds,
        this.settings,
        this.particles,
        this.createLeakageParticle,
        this.container.obstacleArray );
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.settings.vacuumCellNumberProperty ],
      numberOfParticles => {
        return numberOfParticles;
      }, {
        numberType: 'Integer',
        isValidValue: value => value >= 0,
        valueType: 'number',
        phetioType: DerivedPropertyIO( NumberIO ),
        tandem: tandem.createTandem( 'numberOfParticlesProperty' ),
        phetioDocumentation: 'total number of particles in the container'
      } );
  }

  /**
   * Adjusts an array of particles, to have desired number of particle in given bounds.
   * @param {number} numberOfParticles - desired number of particles
   * @param {Bounds2} positionBounds - initial position will be inside this bounds
   * @param {LeakageSettings} settings
   * @param {Particle[]} particles - array of particles that corresponds to newValue and oldValue
   * @param {function(options:*):Particle} createParticle - creates a Particle instance
   * @private
   */
  updateNumberOfParticles( numberOfParticles, positionBounds, settings, particles, createParticle, obstacleArray ) {
    assert && assert( typeof numberOfParticles === 'number', `invalid numberOfParticles: ${numberOfParticles}` );
    assert && assert( positionBounds instanceof Bounds2, `invalid positionBounds: ${positionBounds}` );
    assert && assert( settings instanceof LeakageSettings, `invalid settings: ${settings}` );
    assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
    assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

    const delta = numberOfParticles - particleNumberInBounds( particles, positionBounds );
    if ( delta !== 0 ) {
      if ( delta > 0 ) {
        addParticles( delta, positionBounds, settings, particles, createParticle, obstacleArray );
      }
      else {
        removeParticlesInBounds( -delta, particles, positionBounds );
      }

      // If paused, update things that would normally be handled by step.
      if ( !this.isPlayingProperty.value ) {
        this.updateCenterOfMass();
        this.updateData();
      }
    }
  }

  /**
   * Update particle number in all bounds.
   */
  updateNumberOfParticlesInAllBounds() {
    this.updateNumberOfParticles( this.settings.vacuumCellNumberProperty.value,
      this.vaccumCellBounds,
      this.settings,
      this.particles,
      this.createLeakageParticle,
      this.container.obstacleArray );

    this.updateNumberOfParticles( this.settings.outsideCellNumberProperty.value,
      this.outsideCellBounds,
      this.settings,
      this.particles,
      this.createLeakageParticle,
      this.container.obstacleArray );
  }

  /**
   * Resets the model.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.container.reset();
    this.settings.reset();
    this.particles.splice( 0, this.particles.length );
  }

  /**
   * Steps the model using model time units. Order is very important here!
   * @param {number} dt - time delta, in ps
   * @protected
   * @override
   */
  stepModelTime( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

    super.stepModelTime( dt );

    // Step particles
    ParticleUtils.stepParticles( this.particles, dt );

    this.collisionDetector.update();

    this.updateNumberOfParticlesInAllBounds();
  }
}


/**
 * Adds n particles to the end of the specified array.
 * @param {number} n
 * @param {Bounds2} positionBounds - initial position will be inside this bounds
 * @param {LeakageSettings} settings
 * @param {Particle[]} particles
 * @param {function(options:*):Particle} createParticle - creates a Particle instance
 * @param {Bounds2[]} obstacleArray
 */
function addParticles( n, positionBounds, settings, particles, createParticle, obstacleArray ) {
  assert && assert( typeof n === 'number' && n > 0, `invalid n: ${n}` );
  assert && assert( positionBounds instanceof Bounds2, `invalid positionBounds: ${positionBounds}` );
  assert && assert( settings instanceof LeakageSettings, `invalid settings: ${settings}` );
  assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
  assert && assert( typeof createParticle === 'function', `invalid createParticle: ${createParticle}` );

  // Create n particles
  for ( let i = 0; i < n; i++ ) {

    const particle = createParticle( {
      mass: settings.massProperty.value,
      radius: settings.radiusProperty.value
    } );

    // Original position.
    let x = 0;
    let y = 0;
    
    let inObstacles = true;
    while ( inObstacles ) {
      // Position the particle at a random position within positionBounds, accounting for particle radius.
      x = phet.joist.random.nextDoubleBetween( positionBounds.minX + particle.radius, positionBounds.maxX - particle.radius );
      y = phet.joist.random.nextDoubleBetween( positionBounds.minY + particle.radius, positionBounds.maxY - particle.radius );
      
      inObstacles = false;
      for ( let i = obstacleArray.length - 1; i >= 0; i-- ) {
        if ( obstacleArray[ i ].containsCoordinates( x, y ) ) {
          inObstacles = true;
          break;
        }
      }
    }

    particle.setPositionXY( x, y );
    assert && assert( positionBounds.containsPoint( particle.position ), 'particle is outside of positionBounds' );

    // Set the initial velocity, based on initial temperature and mass.
    particle.setVelocityPolar(
      // |v| = sqrt( 3kT / m )
      Math.sqrt( 3 * GasPropertiesConstants.BOLTZMANN * settings.initialTemperatureProperty.value / particle.mass ),

      // Random angle
      phet.joist.random.nextDouble() * 2 * Math.PI
    );

    particles.push( particle );
  }
}


/**
 * Calculate particle number in given bounds.
 * 
 * @param {Particle} particles 
 * @param {Bounds2} bounds 
 */
function particleNumberInBounds( particles, bounds ) {
  let counter = 0;
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    const particle = particles[ i ];
    if ( bounds.containsPoint( particle.position ) ) {
      counter++;
    }
  }
  return counter;
}

/**
 * Remove delta number of particles in given bounds.
 * 
 * @param {number} delta - should be non-negative.
 * @param {Particle} particles 
 * @param {Bounds2} bounds 
 */
function removeParticlesInBounds( delta, particles, bounds ) {
  for ( let toBeRemovedCount = delta; toBeRemovedCount >= 0; toBeRemovedCount-- ) {
    removeOneParticleInBound( particles, bounds );
  }
}


/**
 * Remove a particle in given bounds.
 * 
 * @param {Partice[]} particles 
 * @param {Bounds2} bounds 
 */
function removeOneParticleInBound( particles, bounds ) {
  for ( let i = particles.length - 1; i >= 0; i-- ) {
    const particle = particles[ i ];
    if ( bounds.containsPoint( particle.position ) ) {
      particles.splice( i, 1 );
      break;
    }
  }
}

gasProperties.register( 'LeakageModel', LeakageModel );
export default LeakageModel;