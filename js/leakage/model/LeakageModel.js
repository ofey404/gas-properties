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

    const createLeakageParticle = options => new LeakageParticle( options );
    this.settings.numberOfParticlesProperty.link( numberOfParticles => {
      this.updateNumberOfParticles( numberOfParticles,
        this.container.bounds,
        this.settings,
        this.particles,
        createLeakageParticle,
        this.container.obstacleArray );
    } );

    this.numberOfParticlesProperty = new DerivedProperty(
      [ this.settings.numberOfParticlesProperty ],
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
   * Adjusts an array of particles to have the desired number of elements.
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

    const delta = numberOfParticles - particles.length;
    if ( delta !== 0 ) {
      if ( delta > 0 ) {
        addParticles( delta, positionBounds, settings, particles, createParticle, obstacleArray );
      }
      else {
        ParticleUtils.removeLastParticles( -delta, particles );
      }

      // If paused, update things that would normally be handled by step.
      if ( !this.isPlayingProperty.value ) {
        this.updateCenterOfMass();
        this.updateData();
      }
    }
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

gasProperties.register( 'LeakageModel', LeakageModel );
export default LeakageModel;