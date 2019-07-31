// Copyright 2019, University of Colorado Boulder

/**
 * ParticlesNode is the base class for rendering a collection of particles using Canvas. It is used in all screens.
 * Do not transform this Node! It's origin must be at the origin of the view coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Particle = require( 'GAS_PROPERTIES/common/model/Particle' );
  const ParticleNode = require( 'GAS_PROPERTIES/common/view/ParticleNode' );
  const Property = require( 'AXON/Property' );
  const Sprite = require( 'SCENERY/util/Sprite' );
  const SpriteImage = require( 'SCENERY/util/SpriteImage' );
  const SpriteInstance = require( 'SCENERY/util/SpriteInstance' );
  const Sprites = require( 'SCENERY/nodes/Sprites' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const IMAGE_SCALE = 2; // scale images to improve quality, see https://github.com/phetsims/gas-properties/issues/55
  const IMAGE_PADDING = 2;

  class ParticlesNode extends Sprites {

    /**
     * @param {Particle[][]} particleArrays - arrays of particles to render
     * @param {Property.<HTMLCanvasElement>[]} imageProperties - an image for each array in particleArrays
     * @param {ModelViewTransform2} modelViewTransform
     * @param {ColorDef} debugFill - fill the canvas when ?canvasBounds, for debugging
     */
    constructor( particleArrays, imageProperties, modelViewTransform, debugFill ) {

      assert && assert( Array.isArray( particleArrays ) && particleArrays.length > 0,
        `invalid particleArrays: ${particleArrays}` );
      assert && assert( particleArrays.length === imageProperties.length,
        'must supply an image Property for each particle array' );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( ColorDef.isColorDef( debugFill ), `invalid debugFill: ${debugFill}` );

      const sprites = imageProperties.map( imageProperty => {
        const imageToSpriteImage = image => {
          return new SpriteImage( image, new Vector2( image.width / 2, image.height / 2 ) );
        };
        const sprite = new Sprite( imageToSpriteImage( imageProperty.value ) );
        imageProperty.lazyLink( image => {
          sprite.imageProperty.value = imageToSpriteImage( image );
        } );
        return sprite;
      } );

      const spriteInstances = [];

      super( {
        sprites: sprites,
        spriteInstances: spriteInstances,
        renderer: 'webgl'
      } );

      // @private
      this.sprites = sprites;
      this.spriteInstances = spriteInstances;

      // @private
      this.modelViewTransform = modelViewTransform;
      this.particleArrays = particleArrays;
      this.imageProperties = imageProperties;
      this.debugFill = debugFill;

      // If any image changes while the sim is paused, redraw the particle system.
      Property.multilink( imageProperties, () => { this.update(); } );
    }

    /**
     * Redraws the particle system.
     * @public
     */
    update() {
      let index = 0;

      for ( let i = this.particleArrays.length - 1; i >= 0; i-- ) {
        const particleArray = this.particleArrays[ i ];
        const sprite = this.sprites[ i ];

        for ( let j = particleArray.length - 1; j >= 0; j-- ) {
          const particle = particleArray[ j ];

          if ( this.spriteInstances.length === index ) {
            const newInstance = SpriteInstance.dirtyFromPool();
            newInstance.isTranslation = false;
            newInstance.alpha = 1;
            newInstance.matrix.setToAffine( 1 / IMAGE_SCALE, 0, 0, 0, 1 / IMAGE_SCALE, 0 );
            this.spriteInstances.push( newInstance );
          }

          const spriteInstance = this.spriteInstances[ index++ ];
          spriteInstance.sprite = sprite;
          spriteInstance.matrix.set02( this.modelViewTransform.modelToViewX( particle.location.x ) );
          spriteInstance.matrix.set12( this.modelViewTransform.modelToViewY( particle.location.y ) );
        }
      }

      while ( this.spriteInstances.length > index ) {
        this.spriteInstances.pop().freeToPool();
      }

      this.invalidatePaint(); // results in a call to paintCanvas
    }

    /**
     * Converts a Particle to an HTMLCanvasElement.
     * @param {Particle} particle
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<HTMLCanvasElement>} particleImageProperty
     * @public
     */
    static particleToCanvas( particle, modelViewTransform, particleImageProperty ) {
      assert && assert( particle instanceof Particle, `invalid particle: ${particle}` );
      assert && assert( modelViewTransform instanceof ModelViewTransform2,
        `invalid modelViewTransform: ${modelViewTransform}` );
      assert && assert( particleImageProperty instanceof Property,
        `invalid particleImageProperty: ${particleImageProperty}` );

      // Create a particle Node, scaled up to improve quality.
      const particleNode = new ParticleNode( particle, modelViewTransform );
      particleNode.setScaleMagnitude( IMAGE_SCALE, IMAGE_SCALE );

      // Provide our own integer width and height, so that we can reliably center the image
      const canvasWidth = Math.ceil( particleNode.width + IMAGE_PADDING );
      const canvasHeight = Math.ceil( particleNode.height + IMAGE_PADDING );

      // Convert the particle Node to an HTMLCanvasElement
      particleNode.toCanvas( canvas => { particleImageProperty.value = canvas; },
        canvasWidth / 2, canvasHeight / 2, canvasWidth, canvasHeight );
    }
  }

  return gasProperties.register( 'ParticlesNode', ParticlesNode );
} );