// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import CollisionDetector from '../../common/model/CollisionDetector';
import gasProperties from '../../gasProperties';
import BooleanProperty from '../../../../axon/js/BooleanProperty';
import Bounds2 from '../../../../dot/js/Bounds2';
import Particle from '../../common/model/Particle';
import Vector2 from '../../../../dot/js/Vector2';


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
   * @param {number} dt 
   */
  updateParticleBarrierCollsions( dt ) {
    let numberOfParticleBarrierCollisions = 0;
    for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {
      for ( let j = this.obstacleArray.length - 1; j>= 0; j-- ) {
        numberOfParticleBarrierCollisions += doParticleBarrierCollisions( this.particleArrays[ i ],
          this.obstacleArray[ j ], dt );
      }
    }
    return numberOfParticleBarrierCollisions;
  }

  /**
   * Override collision updater.
   * Add delta t in order to handle barrier. 
   * 
   * @param {number} dt - time delta, in ps
   * @override
   */
  update( dt ) {
    
    super.update();
      
    if( this.particleParticleCollisionsEnabledProperty.value ) {
      this.numberOfParticleBarrierCollisions = this.updateParticleBarrierCollsions( dt );
    }
        
    // for ( let i = this.obstacleArray.length - 1; i >= 0; i-- ) {
    //   const obstacle = this.obstacleArray[ i ];
    //   for (let j = this.particleArrays.length - 1; j >= 0; j-- ) {
    //     const particleArray = this.particleArrays[ j ];
    //     for (let k = particleArray.length - 1; k >= 0; k-- ) {

    //       assert && assert( obstacle.containsPoint( particleArray[ k ].position ),
    //       'particles have infiltrated the barriers' );
    //     }
    //   }
    // }
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
function doParticleBarrierCollisions( particles, obstacleBounds, dt ) {
  assert && assert( Array.isArray( particles ), `invalid particles: ${particles}` );
  assert && assert( obstacleBounds instanceof Bounds2, `invalid obstacleBounds: ${obstacleBounds}` );

  let numberOfCollisions = 0;

  for ( let i = particles.length - 1; i>= 0; i-- ) {

    const particle = particles[ i ];
    let collided = false;
    
    const intersection = particleTrackIntersectBounds(particle, obstacleBounds, dt);
    // const intersection = FIRST_INTERSECTION.LEFT;

    if ( intersection === FIRST_INTERSECTION.LEFT ) {
      particle.right = obstacleBounds.minX;
      particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
      collided = true;
    } else if ( intersection === FIRST_INTERSECTION.RIGHT ) {
      particle.left = obstacleBounds.maxX;
      particle.setVelocityXY( -particle.velocity.x, particle.velocity.y );
      collided = true;
    } else if ( intersection === FIRST_INTERSECTION.BOTTOM ) {
      particle.top = obstacleBounds.minY;
      particle.setVelocityXY( particle.velocity.x, -particle.velocity.y );
      collided = true;
    } else if ( intersection === FIRST_INTERSECTION.TOP ) {
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
const FIRST_INTERSECTION = {
  NO: 0,
  LEFT: 1,
  RIGHT: 2,
  BOTTOM: 3,
  TOP: 4
};
Object.freeze(FIRST_INTERSECTION);

/**
 * Whether the track of particle in past dt would intersect the given bound.
 * Return a enum value of FIRST_INTERSECTION.
 * 
 * @param {Particle} particle 
 * @param {Bounds2} obstacleBounds 
 * @param {number} dt 
 * @returns {number} - Enum of FIRST_INTERSECTION!!!
 */
function particleTrackIntersectBounds( particle, obstacleBounds, dt ) {
  assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
  assert && assert( obstacleBounds instanceof Bounds2, `invalid Bounds2: ${obstacleBounds}` );

  const currentPosition = new Vector2( particle.position.x, particle.position.y );
  const dtAgoPosition = new Vector2( particle.position.x - particle.velocity.x*dt*10, particle.position.y - particle.velocity.y*dt*10 );
  
  // Slope and dx mark the direction of speed.
  // | slope \ dx | + | - |
  // |     +      | ↗️ | ↖ |
  // |     -      | ↘ | ↙ |
  const dx = currentPosition.x - dtAgoPosition.x;
  let slope = 0;
  if ( dx !== 0 ) {
    slope = ( currentPosition.y - dtAgoPosition.y ) / ( currentPosition.x - dtAgoPosition.x );
  } else {
    // Slope is just to mark the direction of speed of particle, in order to 
    // check which two bounds out of four are possible to be intersected.
    // So while the speed is perpendicular to X axis, we could effectively pick
    // the slope like below.
    slope = ( currentPosition.y - dtAgoPosition.y );
  }
  
  // [ beginPoint, endPoint, identifier ] of an bound.
  const topBound = [ new Vector2( obstacleBounds.minX, obstacleBounds.maxY ), new Vector2( obstacleBounds.maxX, obstacleBounds.maxY ), FIRST_INTERSECTION.TOP ];
  const bottomBound = [ new Vector2( obstacleBounds.minX, obstacleBounds.minY ), new Vector2( obstacleBounds.maxX, obstacleBounds.minY ), FIRST_INTERSECTION.BOTTOM ];
  const leftBound = [ new Vector2( obstacleBounds.minX, obstacleBounds.minY ), new Vector2( obstacleBounds.minX, obstacleBounds.maxY ), FIRST_INTERSECTION.LEFT ];
  const rightBound = [ new Vector2( obstacleBounds.maxX, obstacleBounds.minY ), new Vector2( obstacleBounds.maxX, obstacleBounds.maxY ), FIRST_INTERSECTION.RIGHT ];

  const possibleHorizontalBound = slope > 0 ? bottomBound : topBound;
  const possibleVerticalBound = dx > 0 ? leftBound : rightBound;

  if ( lineSegmentIntersection( dtAgoPosition, currentPosition, possibleHorizontalBound[0], possibleHorizontalBound[1] ) ) {
    // Intersect the horizontal bound.
    return possibleHorizontalBound[2];  // Return Identifier
  } else if ( lineSegmentIntersection( dtAgoPosition, currentPosition, possibleVerticalBound[0], possibleVerticalBound[1] ) ) {
    // Intersect the vertical bound.
    return possibleVerticalBound[2];  // Return Identifier
  } else {
    // No intersection.
    return FIRST_INTERSECTION.NO;
  }
}


/**
 * Whether two line segment intersects, including two endpoints.
 * Checking algorithm is from Jason Cohen, https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
 * 
 * @param {Vector2} begin1 - begin of line segment 1
 * @param {Vector2} end1 - end of line segment 1
 * @param {Vector2} begin2 - begin of line segment 2
 * @param {Vector2} end2 - end of line segment 2
 * @returns {Boolean}
 */
function lineSegmentIntersection( begin1, end1, begin2, end2 ) {
  const vector1 = end1.minus( begin1 );
  const vector2 = end2.minus( begin2 );

  const perpendicularToVector1 = new Vector2( -vector1.y, vector1.x );
  const beginDistance = begin1.minus( begin2 );
  if ( vector2.dot(perpendicularToVector1) ) {
    return false;  // vector1 and 2 are parallel.
  }
  const intersectionLengthRatio = ( beginDistance.dot( perpendicularToVector1 ) / vector2.dot( perpendicularToVector1 ) );
  
  if ( intersectionLengthRatio >= 0 && intersectionLengthRatio <= 1 ) {
    return true;  // intersected. Include the endpoints.
  } else {
    return false;
  }
}


gasProperties.register( 'LeakageCollisionDetector', LeakageCollisionDetector );
export default LeakageCollisionDetector;