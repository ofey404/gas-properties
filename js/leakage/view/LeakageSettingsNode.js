// Copyright 2019-2020, University of Colorado Boulder


/**
 * @author Ofey Chan (Fudan University)
 */

import VBox from '../../../../scenery/js/nodes/VBox';
import gasProperties from '../../gasProperties';
import LeakageSettings from '../model/LeakageSettings';
import gasPropertiesStrings from '../../gasPropertiesStrings';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem';
import GasPropertiesSpinner from '../../diffusion/view/GasPropertiesSpinner';
import Text from '../../../../scenery/js/nodes/Text';
import GasPropertiesConstants from '../../common/GasPropertiesConstants';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile';

const numberOfParticlesString = gasPropertiesStrings.numberOfParticles;

class LeakageSettingsNode extends VBox {

  /**
   * @param {LeakageSettings} settings
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   */
  constructor( settings, modelViewTransform, options ) {
    assert && assert( settings instanceof LeakageSettings, `invalid settings: ${settings}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );

    options = merge( {

      // superclass options
      spacing: 20,
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const numberOfParticlesControl = new LeakageSettingControl( numberOfParticlesString, modelViewTransform,
      settings.numberOfParticlesProperty, {
        spinnerOptions: {
          deltaValue: LeakageSettings.DELTAS.numberOfParticles,
          decimalPlaces: 0
        },
        tandem: options.tandem.createTandem( 'numberOfParticlesControl' )
      } );

    assert && assert( !options.children, 'DiffusionSettingsNode sets children' );
    options = merge( {
      children: [
        numberOfParticlesControl
      ]
    }, options );

    super( options );
  }
}

gasProperties.register( 'LeakageSettingsNode', LeakageSettingsNode );

class LeakageSettingControl extends VBox {
  /**
   * @param {string} label
   * @param {ModelViewTransform2} modelViewTransform
   * @param {NumberProperty} property - quantity for the right side of the container
   * @param {Object} [options]
   */
  constructor( label, modelViewTransform, property, options ) {

    options = merge( {
      spinnerOptions: null, // {*} see NumberSpinner

      // VBox options
      spacing: 12,
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // label
    const labelNode = new Text( label, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColorProfile.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const spinner = new GasPropertiesSpinner( property, merge( {
      tandem: options.tandem.createTandem( 'spinner' )
    }, options.spinnerOptions ) );

    // label and controls
    assert && assert( !options.children, 'DataNode sets children' );

    options = merge( {
      children: [labelNode, spinner]
    }, options );

    super( options );
  }
}


export default LeakageSettingsNode;