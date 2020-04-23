// Copyright 2019-2020, University of Colorado Boulder

import BaseContainer from '../../common/model/BaseContainer';
import RangeWithValue from '../../../../dot/js/RangeWithValue';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties';


/**
 * @author Ofey Chan (Fudan University)
 */

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

    // TODO Build a divider
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