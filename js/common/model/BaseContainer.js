// Copyright 2018-2019, University of Colorado Boulder

/**
 * Base class for containers in all screens.
 * This is a rectangular container for particles, with fixed location, fixed height and depth, and mutable width.
 * The origin is at the bottom-right corner, and width expands to the left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  class BaseContainer {

    constructor( options ) {

      options = _.extend( {
        location: Vector2.ZERO, // location of the container's bottom right corner, in nm
        widthRange: new RangeWithValue( 5, 15, 10 ) // range and initial value of the contaner's width, in nm
      }, options );

      assert && assert( options.location instanceof Vector2, 'invalid location type: ' + options.location );
      assert && assert( options.widthRange instanceof RangeWithValue, 'invalid widthRange type: ' + options.widthRange );

      // @public (read-only)
      this.location = options.location;
      this.widthRange = options.widthRange;

      // @public width of the container, in nm
      this.widthProperty = new NumberProperty( this.widthRange.defaultValue, {
        range: this.widthRange,
        units: 'nm'
      } );

      // @public (read-only) height of the container, in nm
      this.height = 8.75;

      // @private (read-only) depth of the container, in nm
      this.depth = GasPropertiesQueryParameters.containerDepth;

      // @public (read-only) wall thickness, in nm
      this.wallThickness = 0.05;

      // @public (read-only) inside bounds, in nm
      this.bounds = new Bounds2(
        this.location.x - this.widthProperty.value, this.location.y,
        this.location.x, this.location.y + this.height
      );

      // Adjust bounds when width changes
      this.widthProperty.link( width => {
        this.bounds.setMinX( this.location.x - width );
      } );
    }

    // @public
    reset() {
      this.widthProperty.reset();
    }

    /**
     * Convenience getter for width.
     * @returns {number} in nm
     */
    get width() { return this.widthProperty.value; }

    /**
     * Convenience getters for inner bounds of the container, in model coordinate frame.
     * Bounds2 has similar getters, but uses view coordinate frame, where 'top' is minY and 'bottom' is maxY.
     * @returns {number} in nm
     * @public
     */
    get left() { return this.bounds.minX; }

    get right() { return this.bounds.maxX; }

    get bottom() { return this.bounds.minY; }

    get top() { return this.bounds.maxY; }

    /**
     * Gets the volume of the container.
     * @returns {number} in nm^3
     */
    get volume() { return this.widthProperty.value * this.height * this.depth; }

    /**
     * Determines whether the container surrounds a particle on all sides. Accounts for the particle's radius.
     * @param {Particle} particle
     * @returns {boolean}
     * @public
     */
    enclosesParticle( particle ) {

      // Util.toFixedNumber is a threshold comparison, necessary due to floating-point error.
      const decimalPlaces = 3;
      return Util.toFixedNumber( particle.left, decimalPlaces ) >= Util.toFixedNumber( this.left, decimalPlaces ) &&
             Util.toFixedNumber( particle.right, decimalPlaces ) <= Util.toFixedNumber( this.right, decimalPlaces ) &&
             Util.toFixedNumber( particle.top, decimalPlaces ) <= Util.toFixedNumber( this.top, decimalPlaces ) &&
             Util.toFixedNumber( particle.bottom, decimalPlaces ) >= Util.toFixedNumber( this.bottom, decimalPlaces );
    }
  }

  return gasProperties.register( 'BaseContainer', BaseContainer );
} );