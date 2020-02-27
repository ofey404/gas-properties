// Copyright 2019, University of Colorado Boulder

/**
 * DiffusionContainer is the container in the 'Diffusion' screen.
 * It has a fixed width, no lid, and a removable vertical divider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BaseContainer from '../../common/model/BaseContainer.js';
import gasProperties from '../../gasProperties.js';

// constants
const CONTAINER_WIDTH = 16000; // pm

class DiffusionContainer extends BaseContainer {

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

    // @public (read-only) inside bounds for left and right sides of the container
    this.leftBounds = new Bounds2( this.left, this.bottom, this.dividerX, this.top );
    this.rightBounds = new Bounds2( this.dividerX, this.bottom, this.right, this.top );

    // @public whether the divider is in place
    this.hasDividerProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'hasDividerProperty' ),
      phetioDocumentation: 'whether the container\'s divider is in place'
    } );

    // Adjust the bounds of the left and right sides of the container to account for divider thickness
    this.hasDividerProperty.link( hasDivider => {
      const dividerOffset = hasDivider ? ( this.dividerThickness / 2 ) : 0;
      this.leftBounds.setMaxX( this.dividerX - dividerOffset );
      this.rightBounds.setMinX( this.dividerX + dividerOffset );
    } );
  }

  /**
   * Resets the container.
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.hasDividerProperty.reset();
  }
}

gasProperties.register( 'DiffusionContainer', DiffusionContainer );
export default DiffusionContainer;