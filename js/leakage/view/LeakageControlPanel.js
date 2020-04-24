// Copyright 2018-2020, University of Colorado Boulder


/**
 * @author Ofey Chan (Fudan University)
 */

import Panel from '../../../../sun/js/Panel';
import gasProperties from '../../gasProperties';
import FixedWidthNode from '../../common/view/FixedWidthNode';
import VBox from '../../../../scenery/js/nodes/VBox';
import HSeparator from '../../../../sun/js/HSeparator';
import LeakageSettingsNode from './LeakageSettingsNode';
import LeakageSettings from '../model/LeakageSettings';
import Property from '../../../../axon/js/Property';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem';
import GasPropertiesConstants from '../../common/GasPropertiesConstants';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile';


class LeakageControlPanel extends Panel {
  /**
   * @param {LeakageSettings} settings
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<number>} numberOfParticlesProperty
   * @param {Object} [options]
   */

  constructor( settings, modelViewTransform, numberOfParticlesProperty, options ) {
    assert && assert( settings instanceof LeakageSettings,
      `invalid settings: ${settings}` );
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

        // spinner
        new LeakageSettingsNode(settings, modelViewTransform),

        // ------------
        new HSeparator( contentWidth, {
          stroke: GasPropertiesColorProfile.separatorColorProperty,
          maxWidth: contentWidth
        } )
      ]
    } ) );

    super( content, options );

  }
}

gasProperties.register( 'LeakageControlPanel', LeakageControlPanel );
export default LeakageControlPanel;