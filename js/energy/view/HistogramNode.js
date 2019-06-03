// Copyright 2019, University of Colorado Boulder

/**
 * Base class for the Speed and Kinetic Energy histograms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BarPlotNode = require( 'GAS_PROPERTIES/energy/view/BarPlotNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ColorDef = require( 'SCENERY/util/ColorDef' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Emitter = require( 'AXON/Emitter' );
  const gasProperties = require( 'GAS_PROPERTIES/gasProperties' );
  const GasPropertiesColorProfile = require( 'GAS_PROPERTIES/common/GasPropertiesColorProfile' );
  const GasPropertiesQueryParameters = require( 'GAS_PROPERTIES/common/GasPropertiesQueryParameters' );
  const LinePlotNode = require( 'GAS_PROPERTIES/energy/view/LinePlotNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  class HistogramNode extends Node {

    /**
     * @param {number} numberOfBins
     * @param {number} binWidth
     * @param {Property.<number[]>} allBinCountsProperty
     * @param {Property.<number[]>} heavyBinCountsProperty
     * @param {Property.<number[]>} lightBinCountsProperty
     * @param {NumberProperty} maxBinCountProperty
     * @param {Emitter} binCountsUpdatedEmitter
     * @param {Node} xAxisLabel - label on the x axis
     * @param {Node} yAxisLabel - label on the y axis
     * @param {BooleanProperty} heavyPlotVisibleProperty
     * @param {BooleanProperty} lightPlotVisibleProperty
     * @param {Object} [options]
     */
    constructor( numberOfBins, binWidth,
                 allBinCountsProperty, heavyBinCountsProperty, lightBinCountsProperty,
                 maxBinCountProperty,
                 binCountsUpdatedEmitter,
                 xAxisLabel, yAxisLabel,
                 heavyPlotVisibleProperty, lightPlotVisibleProperty,
                 options ) {
      assert && assert( typeof numberOfBins === 'number' && numberOfBins > 0, `invalid numberOfBins: ${numberOfBins}` );
      assert && assert( typeof binWidth === 'number' && binWidth > 0, `invalid binWidth: ${binWidth}` );
      assert && assert( allBinCountsProperty instanceof Property,
        `invalid allBinCountsProperty: ${allBinCountsProperty}` );
      assert && assert( heavyBinCountsProperty instanceof Property,
        `invalid heavyBinCountsProperty: ${heavyBinCountsProperty}` );
      assert && assert( lightBinCountsProperty instanceof Property,
        `invalid lightBinCountsProperty: ${lightBinCountsProperty}` );
      assert && assert( maxBinCountProperty instanceof NumberProperty,
        `invalid maxBinCountProperty: ${maxBinCountProperty}` );
      assert && assert( binCountsUpdatedEmitter instanceof Emitter,
        `invalid binCountsUpdatedEmitter: ${binCountsUpdatedEmitter}` );
      assert && assert( xAxisLabel instanceof Node, `invalid xAxisLabel: ${xAxisLabel}` );
      assert && assert( yAxisLabel instanceof Node, `invalid yAxisLabel: ${yAxisLabel}` );
      assert && assert( heavyPlotVisibleProperty instanceof BooleanProperty,
        `invalid heavyPlotVisibleProperty: ${heavyPlotVisibleProperty}` );
      assert && assert( lightPlotVisibleProperty instanceof BooleanProperty,
        `invalid lightPlotVisibleProperty: ${lightPlotVisibleProperty}` );

      options = _.extend( {
        chartSize: new Dimension2( 150, 130 ),   // size of the Rectangle that is the histogram background
        backgroundFill: 'black', // {ColorDef} histogram background color
        borderStroke: GasPropertiesColorProfile.panelStrokeProperty,// {ColorDef}
        borderLineWidth: 1,
        plotLineWidth: 2, // lineWidth for line segment plots
        barColor: 'white', // {ColorDef}

        // options for the horizontal interval lines
        intervalLinesSpacing: 20, // {number} a horizontal line will be drawn at intervals of this value
        intervalLineOptions: {
          stroke: 'white', // {ColorDef}
          opacity: 0.5, // (0,1)
          lineWidth: 0.5
        }

      }, options );

      assert && assert( options.barColor !== null && ColorDef.isColorDef( options.barColor ),
        `invalid barColor: ${options.barColor}` );
      assert && assert( options.intervalLinesSpacing > 0 && Util.isInteger( options.intervalLinesSpacing ),
        'intervalLinesSpacing must be a positive integer: ' + options.intervalLinesSpacing );

      // Background appears behind plotted data
      const background = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        fill: options.backgroundFill
      } );

      // Outside border appears on top of plotted data
      const border = new Rectangle( 0, 0, options.chartSize.width, options.chartSize.height, {
        stroke: options.borderStroke,
        lineWidth: options.borderLineWidth
      } );

      // The main plot, for all particles
      const allPlotNode = new BarPlotNode( options.barColor, options.chartSize,
        options.intervalLinesSpacing, maxBinCountProperty );

      // Species-specific plots
      const heavyPlotNode = new LinePlotNode( GasPropertiesColorProfile.heavyParticleColorProperty,
        options.plotLineWidth, options.chartSize, options.intervalLinesSpacing, maxBinCountProperty );
      const lightPlotNode = new LinePlotNode( GasPropertiesColorProfile.lightParticleColorProperty,
        options.plotLineWidth, options.chartSize, options.intervalLinesSpacing, maxBinCountProperty );

      // parent Node for all plotted data, clipped to the background
      const plotNodesParent = new Node( {
        children: [ allPlotNode, heavyPlotNode, lightPlotNode ],
        clipArea: Shape.rect( 0, 0, options.chartSize.width, options.chartSize.height )
      } );

      // horizontal lines that appear at equally-spaced intervals based on y-axis scale
      const intervalLines = new Path( null, options.intervalLineOptions );

      // position the x-axis label
      xAxisLabel.maxWidth = 0.65 * background.width; // leave room for out-of-range ellipsis!
      xAxisLabel.centerX = background.centerX;
      xAxisLabel.top = background.bottom + 5;

      // rotate and position the y-axis label
      yAxisLabel.rotation = -Math.PI / 2;
      yAxisLabel.maxWidth = 0.85 * background.height;
      yAxisLabel.right = background.left - 8;
      yAxisLabel.centerY = background.centerY;

      // Options shared by both out-of-range indicators
      const outOfRangeOptions = {
        font: new PhetFont( { size: 20, weight: 'bold' } ),
        fill: 'white',
        visible: false
      };

      // indicates that y-axis has data that is out of range, up arrow
      const yOutOfRangeNode = new Text( '\u2191', _.extend( {}, outOfRangeOptions, {
        right: background.right - 2,
        top: background.top
      } ) );

      // indicates that x-axis has data that is out of range, right arrow
      const xOutOfRangeNode = new Text( '\u2192', _.extend( {}, outOfRangeOptions, {
        right: yOutOfRangeNode.left - 2,
        top: background.top
      } ) );

      assert && assert( !options.children, 'HistogramNode sets children' );
      options = _.extend( {
        children: [ background, intervalLines, plotNodesParent, border, xAxisLabel, yAxisLabel ]
      }, options );

      super( options );

      // out-of-range indicators, for debugging
      if ( GasPropertiesQueryParameters.outOfRangeIndicators ) {
        this.addChild( xOutOfRangeNode );
        this.addChild( yOutOfRangeNode );
      }

      heavyPlotVisibleProperty.link( visible => {
        heavyPlotNode.visible = visible;
      } );

      lightPlotVisibleProperty.link( visible => {
        lightPlotNode.visible = visible;
      } );

      // Update plots to display the current bin counts.
      const updatePlots = () => {
        allPlotNode.plot( allBinCountsProperty.value );
        heavyPlotNode.plot( heavyBinCountsProperty.value );
        lightPlotNode.plot( lightBinCountsProperty.value );
      };

      // Update the interval lines if the y-axis scale has changed.
      let previousMaxY = null;
      const updateIntervalLines = () => {
        const maxY = maxBinCountProperty.value;
        if ( previousMaxY === null || previousMaxY !== maxY ) {

          const shape = new Shape();

          const numberOfLines = Math.floor( maxY / options.intervalLinesSpacing );
          const ySpacing = ( options.intervalLinesSpacing / maxY ) * options.chartSize.height;

          for ( let i = 1; i <= numberOfLines; i++ ) {
            const y = options.chartSize.height - ( i * ySpacing );
            shape.moveTo( 0, y ).lineTo( options.chartSize.width, y );
          }

          intervalLines.shape = shape;

          previousMaxY = maxY;
        }
      };

      // Update the histogram when the bin counts have been updated.
      binCountsUpdatedEmitter.addListener( () => {
        updatePlots();
        updateIntervalLines();
      } );

      //TODO #52 handle out-of-range indicators
      this.xOutOfRangeNode = xOutOfRangeNode;
      this.yOutOfRangeNode = yOutOfRangeNode;
    }
  }

  return gasProperties.register( 'HistogramNode', HistogramNode );
} );