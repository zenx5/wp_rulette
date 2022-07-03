class Ruleta {
    constructor({
        callback_winner,
        canvasId,
        jugadas,
        dificultad,
        levels
    } = {}) {
        this.rulette_sectors = Rulette_sectors.map( elem => elem );
        this.rulette_segments = Rulette_sectors.map( elem => elem );

        this.rulette_sectors.sort( (elemA, elemB) => elemA.tag - elemB.tag );
        this.rulette_segments.sort( (elemA, elemB) => elemA.order - elemB.order )

        let rulette_segments = this.rulette_segments.map( element => {
            return {
                'fillStyle': element.color,
                'text': element.tag
            }
        });

        this.levels = levels;
        this.wheelSpinning = false;
        this.callback_winner = callback_winner;
        this.dificultad = dificultad;
        this.jugadas = jugadas;
        this.radius = 180

        this.innerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments' : rulette_segments.length,
            'outerRadius' : this.radius,
            'textFillStyle': 'white',
            'textAlignment': 'outer',
            // 'textOrientation': 'curved', 
            'segments': rulette_segments,
            // 'drawMode': 'image',
            'animation': {
                'type': 'spinToStop',                     // Define animation more or less as normal, except for the callbackAfter().
                'duration': 5,
                'spins': 8,
                'callbackAfter' : this.drawWheels.bind( this ),     // Call back after each frame of the animation a function we can draw the inner wheel from.
                'callbackFinished': this.alertPrize.bind( this )
            }
        });

        console.log(this.rulette_segments)

        this.outerWheel = new Winwheel({
            'numSegments'       : 1,                // Specify tag of segments.
            'innerRadius'       : this.radius,
            'outerRadius'       : 180,
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
        let LoadedImg = new Image( );
        LoadedImg.src = image.toDataURL( );
        LoadedImg.onload = _=> {
            this.outerWheel.wheelImage = image;
            this.drawWheels( )
        }

        this.drawWheels( );

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.initSpin( )
        })
    }

    generateImage( ) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let scale = 4;
        canvas.width = this.radius*scale*2;
        canvas.height = this.radius*scale*2;
        let d_angle = (360/this.rulette_segments.length)*Math.PI/180
        let dx = d_angle*this.radius;
        
        this.rulette_sectors.forEach( (element, index) => {
            let image = document.createElement('img');
            image.src = element.image_src;
            image.onload = _ => {
                ctx.save( )
                ctx.translate( this.radius*scale, this.radius*scale );
                ctx.rotate( d_angle*(+element.order-0.5) );
                ctx.drawImage( image, -dx/2, -(this.radius+dx ), dx,dx )
                ctx.translate( -this.radius*scale, -this.radius*scale );
                ctx.restore( )
            }
        })
        return canvas;
    }
    // This function is called after the outer wheel has drawn during the animation.
    drawWheels( ) {
        this.outerWheel.rotationAngle = this.innerWheel.rotationAngle;
        this.outerWheel.draw( );
        this.innerWheel.draw(false);
    }

    // Called when the animation has finished.
    alertPrize( ) {
        var winningInnerSegment = +this.innerWheel.getIndicatedSegment().text;
        let winner;
        console.log(winningInnerSegment)
        winner = winningInnerSegment;

        this.wheelSpinning = false;
        this.callback_winner && this.callback_winner( this.rulette_sectors[ winner ] );
    }

    initSpin( ) {
        let index;
        let array_temp;
        let value;
        switch( this.dificultad ) {
            case 'ease':
                index = null;
                break;
                
            case 'hard':
                array_temp = [ ...this.jugadas, ...this.rulette_sectors ];
                console.log(array_temp)
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
                console.log(array_arrays)
                index = array_arrays[0][0].tag;
                break;

            default :
                let level_index = this.levels.findIndex( element => element.level == this.dificultad );
                let level = this.levels[ level_index ];
                for( let i=0; i<level.restart; i++ ) {
                    index = GetRandomInteger( 0, this.rulette_sectors.length-1 );
                    console.log(index)
                    if( this.jugadas.findIndex( element => element.tag == index ) == -1 ) {
                        console.log("break")
                        break;
                    }
                }
                break;
        }
        this.startSpin( this.getAnimalAngle( index ) );
    }

    getAnimalAngle( value ) {
        let pos = this.rulette_segments.findIndex( element => element.tag == value );
        let delta_angle = 360/this.rulette_segments.length;
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

function GetRandomInteger( min, max ) {
	return Math.round( Math.random( )*( max - min ) + min );
}
function getRandomNumber( min , max , numDecimales=15 ) {
    return Math.random( )*( max - min ) + min;
}

addEventListener('load', ev => {
    Array.prototype.suffle = function ( ) {
        let ArrayTemp = this.map( element => element );
        for( let max = this.length-1 , i = 0 ; max >= 0 ; max-- , i++ ) {
            let Random = GetRandomInteger( 0 , max );
            this[i] = ArrayTemp[ Random ];
            ArrayTemp[ Random ] = ArrayTemp[ max ];
        };
        return this;
    };

    let jugadas = [];
    Rulette_sectors.sort( (elemA, elemB) => {
        return elemA.tag - elemB.tag
    });
    ///////////////////Aqui se crea un array con jugadas e pruebas//////////////////////////
    for( let i=0; i<Rulette_sectors.length; i++ ) {
        for( let f=0; f<=i; f++ ) {
            jugadas.push( Rulette_sectors[i] )
        }
    }
    //////////////////////////////////////////////////////////////////////////////////
    jugadas.suffle( )
    new Ruleta({
        callback_winner: function( data ) {
            console.log(data)
        },
        jugadas: jugadas,
        levels: Rulette_levels,
        dificultad: 'medium'  //ease, medium, hard
    })
})
