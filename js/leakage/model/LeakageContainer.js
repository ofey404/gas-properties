// Copyright 2019-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import BaseContainer from '../../common/model/BaseContainer';
import RangeWithValue from '../../../../dot/js/RangeWithValue';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties';
import Bounds2 from '../../../../dot/js/Bounds2';

// constants
const CONTAINER_WIDTH = 16000; // pm

 class LeakageContainer extends BaseContainer {
  
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super( {
      widthRange: new RangeWithValue( CONTAINER_WIDTH, CONTAINER_WIDTH, CONTAINER_WIDTH ) // effectively fixed width
    } );

    // In case clients attempt to use this feature of the base class
    this.widthProperty.lazyLink( width => {
      throw new Error( 'container width is fixed in the Diffusion screen' );
    } );

    // Place a obstacle.
    this.obstacleArray = [
      new Bounds2(
        this.position.x - this.width * 3 / 4, this.position.y + this.height / 4,
        this.position.x - this.width / 4, this.position.y + this.height * 3 / 4
      )
    ];

  }
  /**
    * Resets the container.
    * @public
    * @override
    */
    reset() {
      super.reset();
    }
}


gasProperties.register( 'LeakageContainer', LeakageContainer );
export default LeakageContainer;