// Copyright 2018-2020, University of Colorado Boulder

import IdealGasLawViewProperties from '../../common/view/IdealGasLawViewProperties';
import gasProperties from '../../gasProperties';

/**
 * @author Ofey Chan (Fudan University)
 */

class LeakageViewProperties extends IdealGasLawViewProperties {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );
  }
}

gasProperties.register( 'LeakageViewProperties', LeakageViewProperties );
export default LeakageViewProperties;