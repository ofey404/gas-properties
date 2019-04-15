// Copyright 2019, University of Colorado Boulder

/**
 * Factory methods for creating the various icons that appear in the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const CollisionCounter = require( 'GAS_PROPERTIES/common/model/CollisionCounter' );
  const CollisionCounterNode = require( 'GAS_PROPERTIES/common/view/CollisionCounterNode' );
  const DiffusionParticle1 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle1' );
  const DiffusionParticle2 = require( 'GAS_PROPERTIES/diffusion/model/DiffusionParticle2' );
  const DimensionalArrowsNode = require( 'GAS_PROPERTIES/common/view/DimensionalArrowsNode' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HeavyParticle = require( 'GAS_PROPERTIES/common/model/HeavyParticle' );
  const LightParticle = require( 'GAS_PROPERTIES/common/model/LightParticle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Shape = require( 'KITE/Shape' );
  const Stopwatch = require( 'GAS_PROPERTIES/common/model/Stopwatch' );
  const StopwatchNode = require( 'GAS_PROPERTIES/common/view/StopwatchNode' );

  const GasPropertiesIconFactory = {

    /**
     * Creates an icon for a heavy particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createHeavyParticleIcon( modelViewTransform ) {
      return createParticleIcon( new HeavyParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for a light particle.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createLightParticleIcon( modelViewTransform ) {
      return createParticleIcon( new LightParticle(), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 1 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createDiffusionParticle1Icon( modelViewTransform ) {
      return createParticleIcon( new DiffusionParticle1(), modelViewTransform );
    },

    /**
     * Creates an icon for particle type 2 in the Diffusion screen.
     * @param {ModelViewTransform2} modelViewTransform
     * @returns {Node}
     * @public
     * @static
     */
    createDiffusionParticle2Icon( modelViewTransform ) {
      return createParticleIcon( new DiffusionParticle2(), modelViewTransform );
    },

    //TODO DESIGN create a less detailed icon for the stopwatch, that doesn't need stopwatch
    /**
     * Creates an icon for the stopwatch.
     * @returns {Node}
     * @public
     * @static
     */
    createStopwatchIcon() {
      const stopwatch = new Stopwatch( { visible: true } );
      return new StopwatchNode( stopwatch, {
        scale: 0.25,
        pickable: false
      } );
    },

    //TODO DESIGN create a less detailed icon for the collision counter, that doesn't need collisionCounter or comboBoxListParent
    /**
     * Creates an icon for the collision counter.
     * @returns {Node}
     * @public
     * @static
     */
    createCollisionCounterIcon() {
      const collisionCounter = new CollisionCounter( null /* CollisionDetector */, { visible: true } );
      const comboBoxListParent = new Node();
      return new CollisionCounterNode( collisionCounter, comboBoxListParent, {
        scale: 0.2,
        pickable: false
      } );
    },

    /**
     * Creates an icon for a histogram shape, used for the checkboxes on the Speed histogram.
     * @param {Property.<ColorDef>} strokeProperty
     * @public
     * @static
     */
    createHistogramIcon( strokeProperty ) {

      // unit shape
      const shape = new Shape()
        .moveTo( 0, 1 )
        .lineTo( 0, 0.25 )
        .lineTo( 0.25, 0.25 )
        .lineTo( 0.25, 0 )
        .lineTo( 0.5, 0 )
        .lineTo( 0.5, 0.5 )
        .lineTo( 0.75, 0.5 )
        .lineTo( 0.75, 0.75 )
        .lineTo( 1, 0.75 )
        .lineTo( 1, 1 )
        .transformed( Matrix3.scaling( 12, 12 ) );

      return new Path( shape, {
        stroke: strokeProperty,
        lineWidth: 1.5
      } );
    },

    /**
     * Creates the icon used on the 'Width' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createContainerWidthIcon() {
      return new DimensionalArrowsNode( new NumberProperty( 44 ), {
        color: GasPropertiesColorProfile.sizeArrowColorProperty,
        pickable: false
      } );
    },

    /**
     * Creates the icon used on the 'Center of Mass' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createCenterOfMassIcon() {

      const lineLength = 15;
      const lineWidth = 2;

      return new HBox( {
        spacing: 12,
        children: [
          new Line( 0, 0, 0, lineLength, {
            stroke: GasPropertiesColorProfile.diffusionParticle1ColorProperty,
            lineWidth: lineWidth
          } ),
          new Line( 0, 0, 0, lineLength, {
            stroke: GasPropertiesColorProfile.diffusionParticle2ColorProperty,
            lineWidth: lineWidth
          } )
        ]
      } );
    },

    /**
     * Creates the icon used on the 'Particle Flow Rate' checkbox.
     * @returns {Node}
     * @public
     * @static
     */
    createParticleFlowRateIcon() {

      const arrowOptions = {
        fill: GasPropertiesColorProfile.diffusionParticle1ColorProperty,
        stroke: null,
        headHeight: 10,
        headWidth: 10,
        tailWidth: 5
      };

      return new HBox( {
        spacing: 4,
        children: [
          new ArrowNode( 0, 0, -15, 0, arrowOptions ),
          new ArrowNode( 0, 0, 20, 0, arrowOptions )
        ]
      } );
    }
  };

  /**
   * Creates the icon for a particle.
   * @param {Particle} particle
   * @param {ModelViewTransform2} modelViewTransform
   * @returns {Node}
   * @public
   * @static
   */
  function createParticleIcon( particle, modelViewTransform ) {
    return new ParticleNode( particle, modelViewTransform );
  }

  return gasProperties.register( 'GasPropertiesIconFactory', GasPropertiesIconFactory );
} );