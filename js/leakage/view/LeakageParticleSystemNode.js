// Copyright 2019-2020, University of Colorado Boulder

import ParticlesNode from '../../common/view/ParticlesNode';
import LeakageModel from '../model/LeakageModel';
import gasProperties from '../../gasProperties';
import ParticleImageProperty from '../../common/view/ParticleImageProperty';
import LeakageParticle from '../model/LeakageParticle';

// constants
const DEBUG_FILL = 'rgba( 255, 0, 0, 0.1 )';

/**
 * @author Ofey Chan (Fudan University)
 */

class LeakageParticleSystemNode extends ParticlesNode {
  /**
   * @param {LeakageModel} model - passing in the entire model since we use so much of its public API
   */
  constructor( model ) {
    assert && assert( model instanceof LeakageModel, `invalid model: ${model}` );

    const particleImageProperty = new ParticleImageProperty(
      options => new LeakageParticle( options ),
      model.modelViewTransform,
      model.settings.radiusProperty
    );

    const particleArrays = [ model.particles ];

    const imageProperties = [ particleImageProperty ];

    super( particleArrays, imageProperties, model.modelViewTransform, DEBUG_FILL );

    this.setCanvasBounds( model.modelViewTransform.modelToViewBounds( model.container.bounds ) );
  }
}

gasProperties.register( 'LeakageParticleSystemNode', LeakageParticleSystemNode );
export default LeakageParticleSystemNode;