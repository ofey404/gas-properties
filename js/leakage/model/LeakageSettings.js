// Copyright 2018-2020, University of Colorado Boulder

/**
 * @author Ofey Chan (Fudan University)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GasPropertiesConstants from '../../common/GasPropertiesConstants.js';
import gasProperties from '../../gasProperties.js';


class LeakageSettings {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.numberOfParticlesProperty =
    new NumberProperty( GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE.defaultValue + 10, {  // TODO Temporary add 10 particle for debug.
      numberType: 'Integer',
      range: GasPropertiesConstants.NUMBER_OF_PARTICLES_RANGE,
      isValidValue: value => ( value % LeakageSettings.DELTAS.numberOfParticles === 0 ),
      tandem: options.tandem.createTandem( 'numberOfParticlesProperty' ),
      phetioStudioControl: false // because value must be a multiple of delta
    } );

    // @public mass, in AMU
    this.massProperty = new NumberProperty( GasPropertiesConstants.MASS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.MASS_RANGE,
      units: 'AMU',
      isValidValue: value => ( value % LeakageSettings.DELTAS.mass === 0 ),
      tandem: options.tandem.createTandem( 'massProperty' ),
      phetioStudioControl: false // because value must be a multiple of delta
    } );

    // @public radius, in pm
    this.radiusProperty = new NumberProperty( GasPropertiesConstants.RADIUS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: GasPropertiesConstants.RADIUS_RANGE,
      units: 'pm',
      isValidValue: value => ( value % LeakageSettings.DELTAS.radius === 0 ),
      tandem: options.tandem.createTandem( 'radiusProperty' ),
      phetioStudioControl: false // because value must be a multiple of delta
    } );

    // @public initial temperature, in K, used to compute initial velocity
    this.initialTemperatureProperty =
      new NumberProperty( GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE.defaultValue, {
        numberType: 'Integer',
        range: GasPropertiesConstants.INITIAL_TEMPERATURE_RANGE,
        units: 'K',
        isValidValue: value => ( value % LeakageSettings.DELTAS.initialTemperature === 0 ),
        tandem: options.tandem.createTandem( 'initialTemperatureProperty' ),
        phetioStudioControl: false, // because value must be a multiple of delta
        phetioDocumentation: 'temperature used to determine initial speed of particles'
      } );
  }

  /**
   * Resets the settings.
   * @public
   */
  reset() {
    this.numberOfParticlesProperty.reset();
    this.massProperty.reset();
    this.radiusProperty.reset();
    this.initialTemperatureProperty.reset();
  }

  /**
   * Restarts an experiment with the same settings.
   * This forces the current set of particles to be deleted, and a new set of particles to be created.
   * @public
   */
  restart() {
    const numberOfParticles = this.numberOfParticlesProperty.value;
    this.numberOfParticlesProperty.value = 0;
    this.numberOfParticlesProperty.value = numberOfParticles;
  }
}

// @public (read-only) values must be a multiple of these deltas
LeakageSettings.DELTAS = {
  numberOfParticles: 10,
  mass: 1, // AMU
  radius: 5, // pm
  initialTemperature: 50 // K
};


gasProperties.register( 'LeakageSettings', LeakageSettings );
export default LeakageSettings;