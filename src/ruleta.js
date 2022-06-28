class Ruleta {
    constructor({
        callback_winner,
        canvasId,
        jugadas,
        dificultad
    } = {}) {
        this.rulette_sectors = Rulette_sectors;
        this.rulette_segments = Rulette_sectors.map( elem => elem )
        Rulette_sectors.sort( (elemA, elemB) => {
            return elemA.tag - elemB.tag
        });

        console.log(Rulette_sectors)
        let rulette_segments = this.rulette_segments.sort( (elemA, elemB) => {
            return elemA.order - elemB.order
        })
        .map( element => {
            return {
                'fillStyle': element.color,
                'text': element.tag
            }
        });

        console.log(this.rulette_segments)
        this.wheelSpinning = false;
        this.callback_winner = callback_winner;
        this.dificultad = dificultad;
        this.jugadas = jugadas;
        this.innerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments' : rulette_segments.length,
            'outerRadius' : 180,
            'textFillStyle': 'white',
            'textAlignment': 'outer',
            // 'textOrientation': 'curved', 
            'segments': rulette_segments,
            // 'drawMode': 'image',
            'animation': {
              'type': 'spinToStop',                     // Define animation more or less as normal, except for the callbackAfter().
              'duration': 5,
              'spins': 8,
              'callbackAfter' : this.drawInnerWheel.bind( this ),     // Call back after each frame of the animation a function we can draw the inner wheel from.
              'callbackFinished': this.alertPrize.bind( this )
            }
        });

        this.outerWheel = new Winwheel({
            'numSegments'       : 1,                // Specify tag of segments.
            // 'innerRadius'       : 160,
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

        let LoadedImg = new Image( );
        LoadedImg.src = "http://localhost/ruleta/wp-content/plugins/wp_rulette/img/ruleta.png"
        LoadedImg.onload = _ => {
            this.outerWheel.wheelImage = LoadedImg;
            this.outerWheel.draw( );
            this.innerWheel.draw(false);
        }

        this.innerWheel.draw();

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.initSpin( )
        })
    }

    // This function is called after the outer wheel has drawn during the animation.
    drawInnerWheel( ) {
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
        this.callback_winner && this.callback_winner( Rulette_sectors[ winner ] );
    }
getRandomNumber( min , max , numDecimales=15 ) {
        return Math.random( )*( max - min ) + min;
    }

    initSpin( ) {
        let index;
        let array_temp;
        let value;
        switch( this.dificultad ) {
            case 'ease':
                index = null;
                break;

            case 'medium':
                array_temp = [ ...this.jugadas, ...this.rulette_sectors ];
                console.log(array_temp);
                value = Math.floor( getRandomNumber( 0, array_temp.length ) )
                index = value.tag;
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
        }
        this.startSpin( index );
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
            this.innerWheel.draw( );

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
        dificultad: 'hard'  //ease, medium, hard
    })
})
