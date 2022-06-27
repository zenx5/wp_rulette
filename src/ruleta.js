class Ruleta {
    constructor({
        callback_winner,
        canvasId
    } = {}) {
        this.rulette_segments = Rulette_sectors.map( elem => elem )
        Rulette_sectors.sort( (elemA, elemB) => {
            return elemA.number - elemB.number
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
            'numSegments'       : 1,                // Specify number of segments.
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
        this.startSpin( this.getAnimalAngle(5) )
    }

    getAnimalAngle( value ) {
        let pos = this.rulette_segments.findIndex( element => element.number == value );
        let delta_angle = 360/this.rulette_segments.length;
        let angle = this.getRandomNumber( pos*delta_angle, (pos+1)*delta_angle )
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

addEventListener('load', ev => {
    new Ruleta({
        callback_winner: function( data ) {
            console.log(data)
        }
    })
})
