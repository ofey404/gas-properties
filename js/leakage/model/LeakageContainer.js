// Copyright 2019-2020, University of Colorado Boulder

import BaseContainer from "../../common/model/BaseContainer";
import RangeWithValue from "../../../../dot/js/RangeWithValue";
import merge from "../../../../phet-core/js/merge";
import Bounds2 from "../../../../dot/js/Bounds2";

/**
 * @author Ofey Chan (Fudan University)
 */

 // constants
const CONTAINER_WIDTH = 16000; // pm

 class LeakageContainer extends BaseContainer {
  // TODO
  
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

    // @public (read-only) divider thickness, in pm
    this.dividerThickness = 100;

    // @public (read-only) divider is horizontally centered, but no code assumes that
    this.dividerX = this.left + ( this.width / 2 );
    assert && assert(
    ( this.dividerX + this.dividerThickness / 2 > this.left ) &&
    ( this.dividerX - this.dividerThickness / 2 < this.right ),
      `dividerX is not in the container: ${this.dividerX}` );

    // Build a barrier.
    // TODO
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