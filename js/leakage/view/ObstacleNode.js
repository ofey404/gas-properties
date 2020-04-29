// Copyright 2019-2020, University of Colorado Boulder

/**
 *
 * @author Ofey Chan (Fudan University)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import merge from '../../../../phet-core/js/merge.js';
import gasProperties from '../../gasProperties.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LeakageContainer from '../model/LeakageContainer.js';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile.js';

class ObstacleNode extends Node {
  /**
   * @param {LeakageContainer} container
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( container, modelViewTransform, options ) {
    assert && assert( container instanceof LeakageContainer, `invalid container: ${container}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    const borderNodeArray = [];
    for ( let i = container.obstacleArray.length - 1; i >= 0; i-- ) {
      // Expand the container bounds to account for wall thickness.
      const viewBounds = modelViewTransform.modelToViewBounds( container.obstacleArray[ i ] )
      .dilated( modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 ) );

      // Outside border of the container
      const borderNode = new Rectangle( viewBounds, {
        stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
        lineWidth: modelViewTransform.modelToViewDeltaX( container.wallThickness )
      } );

      borderNodeArray.push( borderNode );
    }

    options = merge( {
      children: borderNodeArray
    }, options );

    super( options );
  }
}

gasProperties.register( 'ObstacleNode', ObstacleNode );
export default ObstacleNode;