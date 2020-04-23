// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import CollisionDetector from '../../common/model/CollisionDetector';
import gasProperties from '../../gasProperties';
import BooleanProperty from '../../../../axon/js/BooleanProperty';

class LeakageCollisionDetector extends CollisionDetector {
  
  /**
   * @param {LeakageContainer} container
   * @param {LeakageParticle[]} particles
   * @param {Object} [options]
   */
  constructor( container, particles, options ) {
    // TODO Make own detector
    super( container, [particles], new BooleanProperty( true ), options);
  }
}

gasProperties.register( 'LeakageCollisionDetector', LeakageCollisionDetector );
export default LeakageCollisionDetector;