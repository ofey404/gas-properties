// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import CollisionDetector from '../../common/model/CollisionDetector';
import gasProperties from '../../gasProperties';
import BooleanProperty from '../../../../axon/js/BooleanProperty';
import Bounds2 from '../../../../dot/js/Bounds2';


class LeakageCollisionDetector extends CollisionDetector {
  
  /**
   * @param {LeakageContainer} container
   * @param {LeakageParticle[]} particles
   * @param {Object} [options]
   */
  constructor( container, particles, options ) {
    super( container, [ particles ], new BooleanProperty( true ), options );

    this.particles = particles;
    this.obstacleArray = container.obstacleArray;

    this.numberOfParticleBarrierCollisions = 0;
  }

  /**
   * Detect and handles particle-barrier collisions. 
   * O(BarrierNumber * ParticleNumber), not very effective.
   */
  updateParticleBarrierCollsions() {
    let numberOfParticleBarrierCollisions = 0;
    for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {
      for ( let j = this.obstacleArray.length - 1; j>= 0; j-- ) {
        numberOfParticleBarrierCollisions += doParticleBarrierCollisions( this.particleArrays[ i ],
          this.obstacleArray[ j ]);
      }
    }
    return numberOfParticleBarrierCollisions;
  }

  /**
   * Override collision updater.
   * Add delta t in order to handle barrier. 
   * 
   * @override
   */
  update() {
    
    super.update();
      
    if( this.particleParticleCollisionsEnabledProperty.value ) {
      this.numberOfParticleBarrierCollisions = this.updateParticleBarrierCollsions();
    }
  }
}

/**
 * Detect and handle partile-obstacle collisions. These collisions occur only outside
 * the given bounds of obstacle.
 * 
 * @param {Particle[]} particles 
 * @param {Bounds2} obstacleBounds - outline of obstacles.
 * @param {number} dt - time delta, in ps, to calculate which particles would hit the barrior.
 * @returns {number} number of collisions
 */
function doParticleBarrierCollisions( particles, obstacleBounds ) {
  assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
  assert && assert( obstacleBounds instanceof Bounds2, `invalid obstacleBounds: ${obstacleBounds}` );

  let numberOfCollisions = 0;
  
  for ( let i = particles.length - 1; i>= 0; i-- ) {
    
    const particle = particles[ i ];
    let collided = false;

    const collisionBounds = new Bounds2(
      obstacleBounds.minX - particle.radius,
      obstacleBounds.minY - particle.radius,
      obstacleBounds.maxX + particle.radius,
      obstacleBounds.maxY + particle.radius
    );

    if ( !collisionBounds.containsPoint( particle.position ) ) {
      continue;
    }

    const closest = closestEdge( particle.position, collisionBounds );
    
    if ( closest === CLOSEST_EDGE.LEFT ) {
      particle.right = obstacleBounds.minX;
      particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
      collided = true;
    } else if ( closest === CLOSEST_EDGE.RIGHT ) {
      particle.left = obstacleBounds.maxX;
      particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
      collided = true;
    } else if ( closest === CLOSEST_EDGE.TOP ) {
      particle.top = obstacleBounds.minY;
      particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
      collided = true;
    } else if ( closest === CLOSEST_EDGE.BOTTOM ) {
      particle.bottom = obstacleBounds.maxY;
      particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
      collided = true;
    }
  
    if ( collided ) {
      numberOfCollisions++;
    }
  }

  return numberOfCollisions;
}

// ^ Y
// |        TOP
// |         v
// | LEFT -> □ <- RIGHT
// |         ^
// |       BOTTOM
// 0-----------------------> X
// Simulate a enum marked first intersection place of a particle track and bound.
// Use in particleTrackIntersectBounds().
const CLOSEST_EDGE = {
  LEFT: 1,
  RIGHT: 2,
  BOTTOM: 3,
  TOP: 4
};

/**
 * Return closest edge of given position.
 * 
 * @param {Vector2} position 
 * @param {Bounds2} bounds 
 */
function closestEdge( position, bounds ) {
  const distanceArray = [
    [ Math.abs( position.x - bounds.left ), CLOSEST_EDGE.LEFT ],
    [ Math.abs( position.x - bounds.right ), CLOSEST_EDGE.RIGHT ],
    [ Math.abs( position.y - bounds.bottom ), CLOSEST_EDGE.BOTTOM ],
    [ Math.abs( position.y - bounds.top ), CLOSEST_EDGE.TOP ]
  ];

  let minimal = distanceArray[ 0 ];
  for ( let i = 1; i <= 3; i++ ) {
    const compare = distanceArray[ i ];
    if ( minimal[ 0 ] > compare[ 0 ] ) {
      minimal = compare;
    }
  }
  return minimal[ 1 ];
}


gasProperties.register( 'LeakageCollisionDetector', LeakageCollisionDetector );
export default LeakageCollisionDetector;