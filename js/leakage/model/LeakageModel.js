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
import Particle from '../../common/model/Particle.js';

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

    this.settings = new LeakageSettings( {
      tandem: tandem.createTandem( 'settings' )
    } );

    // link some properties
    // TODO

    // @public (read-only)
    this.collisionDetector = new LeakageCollisionDetector( this.container, this.particles );

  }

  /**
   * Resets the model.
   * @public
   * @override
   */
  reset() {
    // TODO
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

    this.updateData();
  }

  /**
   * Remove particle by a filter function
   * @param {Particle[]} particles
   * @param {function(particle: Particle): Boolean} filter
   */
  removeParticleByFilter(particles, filter) {

  }

  /**
   * Remove particle in the vacuum pump cell
   */
  removeParticleInPumpCell() {
    
  }

  /**
   * 
   */
  updateData() {

  }
}

gasProperties.register( 'LeakageModel', LeakageModel );
export default LeakageModel;