// Copyright 2019-2020, University of Colorado Boulder

import DiffusionParticle1 from '../../diffusion/model/DiffusionParticle1';
import gasProperties from '../../gasProperties';

/**
 * 
 * @author Ofey Chan (Fudan University)
 */

 class LeakageParticle extends DiffusionParticle1 {

    /**
     * @param {Object} [options] see Particle
     */
    constructor( options ) {
        super( options );
    }
 }

 gasProperties.register( 'LeakageParticle', LeakageParticle );
 export default LeakageParticle;