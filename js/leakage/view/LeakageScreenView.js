// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import gasProperties from '../../gasProperties.js';
import LeakageModel from '../model/LeakageModel';
import BaseScreenView from '../../common/view/BaseScreenView.js';
import LeakageViewProperties from './LeakageViewProperties';
import LeakageContainerNode from './LeakageContainerNode';
import LeakageParticleSystemNode from './LeakageParticleSystemNode';
import merge from '../../../../phet-core/js/merge.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import LeakageControlPanel from './LeakageControlPanel.js';
import ObstacleNode from './ObstacleNode.js';

class LeakageScreenView extends BaseScreenView {

  /**
   * @param {LeakageModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem, options ) {
    assert && assert( model instanceof LeakageModel, `invalid model: ${model}` );
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    options = merge( {

      // superclass options
      hasSlowMotion: true // adds Normal/Slow radio buttons to the time controls
    }, options );

    super( model, tandem, options );

    const viewProperties = new LeakageViewProperties( tandem.createTandem( 'viewProperties' ) );

    const containerNode = new LeakageContainerNode( model.container, model.modelViewTransform, {} );

    const particleSystemNode = new LeakageParticleSystemNode( model );

    const obstacleNode = new ObstacleNode( model.container, model.modelViewTransform, {} );

    const controlPanel = new LeakageControlPanel( model,
       model.modelViewTransform,
       model.numberOfParticlesProperty, {
        fixedWidth: 300,
        right: this.layoutBounds.right - GasPropertiesConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'controlPanel' )
       } );

    model.numberOfParticlesProperty.link( () => {
      if ( !this.model.isPlayingProperty.value ) {
        particleSystemNode.update();
      }
    } );

    this.addChild( containerNode );
    this.addChild( particleSystemNode );
    this.addChild( obstacleNode );
    this.addChild( controlPanel );

    // Position the time controls
    this.timeControlNode.mutate( {
      left: this.layoutBounds.left,
      bottom: this.layoutBounds.bottom - GasPropertiesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    
    // @private
    this.model = model;
    this.viewProperties = viewProperties;
    this.particleSystemNode = particleSystemNode;
  }

  /**
   * Resets the screen.
   * @protected
   * @override
   */
  reset() {
    super.reset();
    this.viewProperties.reset();
  }

  /**
   * Steps the view using real time units.
   * @param {number} dt - time delta, in seconds
   * @public
   * @override
   */
  stepView( dt ) {
    assert && assert( typeof dt === 'number' && dt >= 0, `invalid dt: ${dt}` );
    super.stepView( dt );
    this.particleSystemNode.update();
  }
}

gasProperties.register( 'LeakageScreenView', LeakageScreenView );
export default LeakageScreenView;