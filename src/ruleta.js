class Ruleta {
    constructor({
        scope,
        callback_winner,
        canvasId,
        dificultad,
        levels,
        sectors,
        audio,
        radius,
        innerRadius,
        backColor,
        backRadius,
        duration
    } = {}) {

        this.callback_winner = callback_winner;
        this.dificultad = dificultad || "easy";
        this.levels = levels || [];
        this.rulette_sectors = sectors || []
        this.audio = audio;
        this.radius = radius || 180;
        this.innerRadius = innerRadius || 0;
        this.backColor = backColor||'yellow';
        this.backRadius = backRadius || this.radius;
        this.duration = duration || 5;

        this.previusPlays = [];
        this.wheelSpinning = false;

        this.rulette_sectors.sort( (elemA, elemB) => elemA.order - elemB.order );

        let rulette_segments = this.rulette_sectors.map( element => {
            return {
                'fillStyle': element.color,
                'text': element.tag
            }
        });

        this.innerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments' : rulette_segments.length,
            'outerRadius' : this.radius,
            'innerRadius' : this.innerRadius,
            'textFillStyle': 'white',
            'textAlignment': 'outer',
            // 'textOrientation': 'curved', 
            'segments': rulette_segments,
            'animation': {
                'type': 'spinToStop',
                'duration': this.duration,
                'spins': this.duration*1.5,
                'callbackAfter' : this.drawWheels.bind( this ),
                'callbackFinished': this.alertWinner.bind( this ),
                'callbackSound': this.playSound.bind( this ),
                'soundTrigger': 'pin'
            },
            'pins': {
                'number'     : this.rulette_sectors.length,
                'fillStyle'  : 'silver',
            }
        });

        this.back = new Winwheel({
            canvasId: canvasId || 'canvas',
            numSegments: 1,
            innerRadius: Math.max(this.innerRadius-8, 0),
            outerRadius: this.backRadius,
            fillStyle: this.backColor,
            segments: []
        })

        this.outerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments'       : 1,                // Specify tag of segments.
            'innerRadius'       : 0,
            'outerRadius'       : this.radius,
            'drawText'          : true,             // Code drawn text can be used with segment images.
            'textFontSize'      : 16,               // Set text options as desired.
            'fillStyle'         : 'white',
            'textOrientation'   : 'curved',
            'textAlignment'     : 'inner',
            'textMargin'        : 90,
            'textFontFamily'    : 'monospace',
            'textStrokeStyle'   : 'black',
            'textLineWidth'     : 3,
            'textFillStyle'     : 'white',
            'drawMode'          : 'image',
            'segments'          : [],
        });

        let image = this.generateImage( );
        let loadImage = new Image( )
        loadImage.src = image.toDataURL( )
        loadImage.onload = _ => {
            this.outerWheel.wheelImage = image;
            this.drawWheels( );
        }

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.initSpin( )
        })
    }

    playSound( ) {
        if( !this.audio ) return;
        this.audio.pause( );
        this.audio.currentTime = 0.5;
        this.audio.play( );
    }

    generateImage( ) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let scale = 4;
        canvas.width = this.radius*scale*2;
        canvas.height = this.radius*scale*2;
        let d_angle = (360/this.rulette_sectors.length)*Math.PI/180
        let dx = d_angle*this.radius;
        
        this.rulette_sectors.forEach( (element, index) => {
            let image = document.createElement('img');
            image.src = element.image_src;
            image.onload = _ => {
                ctx.save( )
                ctx.translate( this.radius*scale, this.radius*scale );
                ctx.rotate( d_angle*(+element.order-0.5) );
                ctx.drawImage( image, -dx/2, -(this.radius+dx+10 ), dx,dx )
                ctx.translate( -this.radius*scale, -this.radius*scale );
                ctx.restore( )
            }
        })
        return canvas;
    }
    // This function is called after the outer wheel has drawn during the animation.
    drawWheels( ) {
        this.outerWheel.rotationAngle = this.innerWheel.rotationAngle;
        this.back.draw( );
        this.outerWheel.draw(false);
        this.innerWheel.draw(false);
    }

    // Called when the animation has finished.
    alertWinner( ) {
        this.wheelSpinning = false;
        this.callback_winner && this.callback_winner( this.rulette_sectors, this.innerWheel.getIndicatedSegment() );
    }

    initSpin( ) {
        let index;
        let array_temp;
        let value;
        switch( this.dificultad ) {
            case 'easy':
                index = GetRandomInteger( 0, this.rulette_sectors.length );
                break;
                
            case 'hard':
                array_temp = [ ...this.rulette_sectors ];
                
                let array_arrays = [];
                while( array_temp.length ) {
                    let arr = [];
                    let element = array_temp.shift( );
                    arr.push( element );
                    let element_index = array_temp.findIndex( elem => elem.tag == element.tag );
                    while( element_index >= 0 ) {
                        arr.push( ...array_temp.splice( element_index, 1 ) );
                        element_index = array_temp.findIndex( elem => elem.tag == element.tag );
                    }
                    array_arrays.push( arr );
                }
                array_arrays.sort( (elemA, elemB ) => {
                    return elemA.length - elemB.length
                })
                
                index = array_arrays[0][0].tag;
                break;

            default :
                let level_index = this.levels.findIndex( element => element.level == this.dificultad );
                let level = this.levels[ level_index ];
                for( let i=0; i<level.restart; i++ ) {
                    index = GetRandomInteger( 0, this.rulette_sectors.length-1 );
                    
                }
                break;
        }
        this.startSpin( this.getSectorAngle( index ) );
    }

    getSectorAngle( value ) {
        let pos = this.rulette_sectors.findIndex( element => element.tag == value );
        let delta_angle = 360/this.rulette_sectors.length;
        let angle = getRandomNumber( pos*delta_angle, (pos+1)*delta_angle )
        return angle;
    }

    // -------------------------------------------------------
    // Click handler for spin button.
    // -------------------------------------------------------
    startSpin( value ) {
        // Ensure that spinning can't be clicked again while already running.
        if ( this.wheelSpinning == false ) {
            // Reset things with inner and outer wheel so spinning will work as expected. Without the reset the
            // wheel will probably just move a small amount since the rotationAngle would be close to the targetAngle
            // figured out by the animation.
            this.innerWheel.rotationAngle = 0;
            this.innerWheel.animation.stopAngle = value;

            this.innerWheel.startAnimation( );
            this.wheelSpinning = true;
        }
    }
}

function getRandomNumber( min, max ) {
    return Math.random( )*( max - min) + min;
}

function GetRandomInteger( min, max ) {
    return Math.floor( getRandomNumber( min, max+1 ) );
}
