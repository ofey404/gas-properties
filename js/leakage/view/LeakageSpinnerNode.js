// Copyright 2019-2020, University of Colorado Boulder


/**
 * @author Ofey Chan (Fudan University)
 */

import VBox from '../../../../scenery/js/nodes/VBox';
import gasProperties from '../../gasProperties';
import LeakageSettings from '../model/LeakageSettings';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2';
import merge from '../../../../phet-core/js/merge';
import Tandem from '../../../../tandem/js/Tandem';
import GasPropertiesSpinner from '../../diffusion/view/GasPropertiesSpinner';
import Text from '../../../../scenery/js/nodes/Text';
import GasPropertiesConstants from '../../common/GasPropertiesConstants';
import GasPropertiesColorProfile from '../../common/GasPropertiesColorProfile';
import NumberProperty from '../../../../axon/js/NumberProperty';

class LeakageSpinnerNode extends VBox {

  /**
   * @param {NumberProperty} numberProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {String} label
   * @param {Object} [options]
   */
  constructor( numberProperty, modelViewTransform, label, options ) {
    assert && assert( numberProperty instanceof NumberProperty, `invalid numberProperty: ${numberProperty}` );
    assert && assert( modelViewTransform instanceof ModelViewTransform2, `invalid modelViewTransform: ${modelViewTransform}` );
    
    options = merge( {

    // superclass options
    spacing: 20,
    align: 'left',

    // phet-io
    tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.children, 'LeakageSpinnerNode sets children' );

    // A combinating Node of a title and a spinner.
    const numberPropertyControl = new SpinnerWithLabel( numberProperty, label, modelViewTransform, {
      spinnerOptions: {
        deltaValue: LeakageSettings.DELTAS.numberOfParticles,
        decimalPlaces: 0
      },
      tandem: options.tandem.createTandem( 'NumberPropertyControl' )
    } );

    options = merge( {
      children: [
        numberPropertyControl
      ]
    }, options );

    super( options );
  }
}

class SpinnerWithLabel extends VBox {
  /**
   * 
   * @param {NumberProperty} numberProperty 
   * @param {String} label 
   * @param {ModelViewTransform2} modelViewTransform 
   */
  constructor( numberProperty, label, modelViewTransform, options ) {
    options = merge( {
      spinnerOptions: null, // {*} see NumberSpinner

      // VBox options
      spacing: 12,
      align: 'left',

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );
    
    const labelNode = new Text( label, {
      font: GasPropertiesConstants.CONTROL_FONT,
      fill: GasPropertiesColorProfile.textFillProperty,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'labelNode' )
    } );

    const spinner = new GasPropertiesSpinner( numberProperty, merge( {
      tandem: options.tandem.createTandem( 'spinner' )
    }, options.spinnerOptions ) );

    // label and controls
    assert && assert( !options.children, 'FatherNode sets children' );

    options = merge( {
      children: [ labelNode, spinner ]
    }, options );

    super( options );
  }

}

gasProperties.register( 'LeakageSpinnerNode', LeakageSpinnerNode );
export default LeakageSpinnerNode;
