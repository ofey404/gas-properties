// Copyright 2018-2020, University of Colorado Boulder

/**
 * LeakageScreen is the 'Leakage' screen.
 * 
 * @author Ofey Chan (Fudan University)
 */

import GasPropertiesScreen from '../common/GasPropertiesScreen';
import gasProperties from '../gasProperties';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory';
import Tandem from '../../../tandem/js/Tandem';
import LeakageModel from './model/LeakageModel';
import LeakageScreenView from './view/LeakageScreenView';
import gasPropertiesStrings from '../gasPropertiesStrings.js';


const leakageDiffusionString = gasPropertiesStrings.screen.leakage;

class LeakageScreen extends GasPropertiesScreen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

    const createModel = () => new LeakageModel( tandem.createTandem( 'model' ) );
    const createView = model => new LeakageScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: leakageDiffusionString,
      homeScreenIcon: GasPropertiesIconFactory.createLeakageScreenIcon()
    } );
  }
}

gasProperties.register( 'LeakageScreen', LeakageScreen );
export default LeakageScreen;