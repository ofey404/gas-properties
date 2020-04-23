// Copyright 2019-2020, University of Colorado Boulder

import LeakageContainer from '../model/LeakageContainer';
import gasProperties from '../../gasProperties';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile';
import Rectangle from '../../../../scenery/js/nodes/Rectangle';
import merge from '../../../../phet-core/js/merge';
import Node from '../../../../scenery/js/nodes/Node.js';


/**
 *
 * @author Ofey Chan (Fudan University)
 */

class LeakageContainerNode extends Node {
  /**
   * @param {LeakageContainer} container
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( container, modelViewTransform, options ) {
    assert && assert( container instanceof LeakageContainer, `invalid container: ${container}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2,
      `invalid modelViewTransform: ${modelViewTransform}` );

    // Expand the container bounds to account for wall thickness.
    const viewBounds = modelViewTransform.modelToViewBounds( container.bounds )
    .dilated( modelViewTransform.modelToViewDeltaX( container.wallThickness / 2 ) );
    
    // Outside border of the container
    const borderNode = new Rectangle( viewBounds, {
      stroke: GasPropertiesColorProfile.containerBoundsStrokeProperty,
      lineWidth: modelViewTransform.modelToViewDeltaX( container.wallThickness )
    } );

    options = merge( {
      children: [ borderNode ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'LeakageContainerNode', LeakageContainerNode );
export default LeakageContainerNode;