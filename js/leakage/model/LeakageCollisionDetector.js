// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import CollisionDetector from "../../common/model/CollisionDetector";

class LeakageCollisionDetector extends CollisionDetector {
  // TODO
  
  /**
   * @param {DiffusionContainer} container
   * @param {DiffusionParticle1[]} particles1
   * @param {DiffusionParticle2[]} particles2
   * @param {Object} [options]
   */
  constructor( container, particles1, particles2, options ) {
  }

  /**
   * Detects and handles particle-container collisions for the system for one time step.
   * @returns {number} the number of collisions
   * @protected
   * @override
   */
  updateParticleContainerCollisions() {
  }
}

gasProperties.register( 'LeakageCollisionDetector', LeakageCollisionDetector );
export default LeakageCollisionDetector;