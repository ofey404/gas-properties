// Copyright 2018-2020, University of Colorado Boulder

import GasPropertiesScreen from '../common/GasPropertiesScreen';
import gasProperties from '../gasProperties';
import GasPropertiesIconFactory from '../common/view/GasPropertiesIconFactory';
import Tandem from '../../../tandem/js/Tandem';
import LeakageModel from './model/LeakageModel';
import LeakageScreenView from './view/LeakageScreenView';

/**
 * @author Ofey Chan (Fudan University)
 */

class LeakageScreen extends GasPropertiesScreen {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );
    const createModel = () => new LeakageModel( tandem.createTandem( 'model' ) );
    const createView = model => new LeakageScreenView( model, tandem.createTandem( 'view' ) );

    super( createModel, createView, tandem, {
      name: 'test',
      homeScreenIcon: GasPropertiesIconFactory.createExploreScreenIcon()
    } );
  }
}

gasProperties.register( 'LeakageScreen', LeakageScreen );
export default LeakageScreen;