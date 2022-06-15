class Ruleta {
    constructor({
        callback_winner,
        canvasId
    } = {}) {
        let rulette_segments = Rulette_sectors
        .sort( (elemA, elemB) => {
            return elemA.order - elemB.order
        })
        .map( element => {
            return {
                'fillStyle': element.color,
                'text': element.number
            }
        });
        this.desfase = -4;
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
            this.innerWheel.rotationAngle += this.desfase;
            this.innerWheel.draw(false);
        }

        this.innerWheel.draw();

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.startSpin( )
        })
    }

    // This function is called after the outer wheel has drawn during the animation.
    drawInnerWheel( ) {
        this.outerWheel.rotationAngle = this.innerWheel.rotationAngle-this.desfase;
        this.outerWheel.draw( );
        this.innerWheel.draw(false);
    }

    // Called when the animation has finished.
    alertPrize( ) {
        var winningInnerSegment = +this.innerWheel.getIndicatedSegment().text;
        // var winningOuterSegment = this.outerWheel.getIndicatedSegment();

        this.wheelSpinning = false;
        this.callback_winner && this.callback_winner( Rulette_sectors[ winningInnerSegment -1 ] );
    }
    // -------------------------------------------------------
    // Click handler for spin button.
    // -------------------------------------------------------
    startSpin( ) {
        // Ensure that spinning can't be clicked again while already running.
        if ( this.wheelSpinning == false ) {
            // Reset things with inner and outer wheel so spinning will work as expected. Without the reset the
            // wheel will probably just move a small amount since the rotationAngle would be close to the targetAngle
            // figured out by the animation.
            // this.outerWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
            // this.outerWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
            // this.outerWheel.draw();                // Call draw to render changes to the wheel.
            this.innerWheel.rotationAngle = 0;
            this.innerWheel.draw();

            this.innerWheel.startAnimation();

            this.wheelSpinning = true;
        }
    }
}

addEventListener('load', ev => {
    new Ruleta({
        callback_winner: data => {
            console.log(data)
        }
    })
})
