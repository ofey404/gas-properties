// Copyright 2018-2019, University of Colorado Boulder

/**
 * Model of the pressure gauge. Adds a bit of jitter to the displayed values, to make the gauge look more realistic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesConstants = require( 'GAS_PROPERTIES/common/GasPropertiesConstants' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  // constants
  const SAMPLE_PERIOD = GasPropertiesQueryParameters.pressureGaugeSamplePeriod; // ps
  const MIN_JITTER = GasPropertiesQueryParameters.minJitter; // minimum amount of jitter, in kPa
  const MAX_JITTER = GasPropertiesQueryParameters.maxJitter; // maximum amount of jitter, in kPa
  assert && assert( MIN_JITTER < MAX_JITTER, 'MIN_JITTER must be < MAX_JITTER' );

  class PressureGauge {

    /**
     * @param {Property.<number|null>} pressureProperty - pressure in the container, in kPa
     * @param {Property.<number|null>} temperatureProperty - temperature in the container, in K
     */
    constructor( pressureProperty, temperatureProperty ) {

      // @public pressure in kilopascals (kPa) with jitter added. This is not derived from pressureProperty,
      // because it needs to jitter on step, not when pressureProperty changes.
      this.pressureKilopascalsProperty = new NumberProperty( pressureProperty.value, {
        units: 'kPa',
        isValidValue: value => value >= 0
      } );

      pressureProperty.link( pressure => {
        if ( pressure === 0 ) {
          this.pressureKilopascalsProperty.value = 0;
        }
      } );

      // @public pressure in atmospheres (atm) with jitter added
      this.pressureAtmospheresProperty = new DerivedProperty( [ this.pressureKilopascalsProperty ],
        pressureKilopascals => pressureKilopascals * GasPropertiesConstants.ATM_PER_KPA, {
          units: 'atm',
          isValidValue: value => value >= 0
        } );

      // @public (read-only) pressure range in kilopascals (kPa)
      this.pressureRange = new Range( 0, GasPropertiesQueryParameters.maxPressure );

      // @private amount of jitter in kPa is inversely proportional to pressure
      this.pressureJitterFunction = new LinearFunction( 0, this.pressureRange.max, MAX_JITTER, MIN_JITTER, true );

      // @private scale the amount of jitter based on temperature (K), so that jitter falls off at low temperatures
      this.scaleJitterFunction = new LinearFunction( 5, 50, 0, 1, true );

      // @public pressure units displayed by the pressure gauge
      this.unitsProperty = new EnumerationProperty( PressureGauge.Units, PressureGauge.Units.ATMOSPHERES );

      // @private
      this.pressureProperty = pressureProperty;
      this.temperatureProperty = temperatureProperty;
      this.dtAccumulator = 0;
    }

    // @public
    reset() {
      this.unitsProperty.reset();
      this.dtAccumulator = 0;
    }

    /**
     * Steps the pressure gauge.
     * @param {number} dt - time step, in ps
     * @param {boolean} jitterEnabled - whether jitter should be added to make the gauge look more realistic
     * @public
     */
    step( dt, jitterEnabled ) {

      this.dtAccumulator += dt;

      if ( this.dtAccumulator >= SAMPLE_PERIOD ) {

        // Add jitter (kPa) to the displayed value, more jitter with lower pressure.
        // Jitter is added if we're not holding pressure constant.
        let jitter = 0;
        if ( jitterEnabled ) {
          jitter = this.pressureJitterFunction( this.pressureProperty.value ) *
                   this.scaleJitterFunction( this.temperatureProperty.value ) *
                   phet.joist.random.nextDouble();
        }

        // random sign
        const sign = ( jitter >= this.pressureProperty.value || phet.joist.random.nextBoolean() ) ? 1 : -1;

        this.pressureKilopascalsProperty.value = this.pressureProperty.value + ( sign * jitter );
        this.dtAccumulator = 0;
      }
    }
  }

  // @public Choice of pressure units that the gauge can display
  PressureGauge.Units = new Enumeration( [ 'KILOPASCALS', 'ATMOSPHERES' ] );

  return gasProperties.register( 'PressureGauge', PressureGauge );
} );
 