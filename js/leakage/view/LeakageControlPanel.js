// Copyright 2018-2020, University of Colorado Boulder


/**
 * @author Ofey Chan (Fudan University)
 */

import Panel from '../../../../sun/js/Panel';
import gasProperties from '../../gasProperties';
import FixedWidthNode from '../../common/view/FixedWidthNode';
import VBox from '../../../../scenery/js/nodes/VBox';
import HSeparator from '../../../../sun/js/HSeparator';
import Property from '../../../../axon/js/Property';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem';
import GasPropertiesConstants from '../../common/GasPropertiesConstants';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile';
import LeakageSpinnerNode from './LeakageSpinnerNode';
import gasPropertiesStrings from '../../gasPropertiesStrings';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import LeakageModel from '../model/LeakageModel';
import PhetFont from '../../../../scenery-phet/js/PhetFont';


const vacuumCellNumberOfParticleString = gasPropertiesStrings.vacuumCellNumberOfParticles;
const outsideCellNumberOfParticleString = gasPropertiesStrings.outsideCellNumberOfParticles;
const addParticleToMiddleString = gasPropertiesStrings.addParticleToMiddleString;

class LeakageControlPanel extends Panel {
  /**
   * @param {LeakageModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<number>} numberOfParticlesProperty
   * @param {Object} [options]
   */

  constructor( model, modelViewTransform, numberOfParticlesProperty, options ) {
    assert && assert( model instanceof LeakageModel,
      `invalid model: ${model}` );
    assert && assert( numberOfParticlesProperty instanceof Property,
      `invalid numberOfParticlesProperty: ${numberOfParticlesProperty}` );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, GasPropertiesConstants.PANEL_OPTIONS, options );
  
    const contentWidth = options.fixedWidth - ( 2 * options.xMargin );

    const content = new FixedWidthNode( contentWidth, new VBox( {
      align: 'left',
      spacing: 18,
      children: [  // All elements in the control panel

        // Spinner of vaccum cell number of particles.
        new LeakageSpinnerNode(
          model.settings.vacuumCellNumberProperty,
          modelViewTransform,
          vacuumCellNumberOfParticleString
        ),
        
        // Spinner of outside cell number of particles.
        new LeakageSpinnerNode(
          model.settings.outsideCellNumberProperty,
          modelViewTransform,
          outsideCellNumberOfParticleString
        ),

        // ------------
        new HSeparator( contentWidth, {
          stroke: GasPropertiesColorProfile.separatorColorProperty,
          maxWidth: contentWidth
        } ),

        new TextPushButton( addParticleToMiddleString, {
          font: new PhetFont( 16 ),
          baseColor: 'yellow',
          xMargin: 10,
          listener: () => {
            model.addParticlesToMiddleBound( 10 );
          }
        } )
      ]
    } ) );

    super( content, options );

  }
}

gasProperties.register( 'LeakageControlPanel', LeakageControlPanel );
export default LeakageControlPanel;