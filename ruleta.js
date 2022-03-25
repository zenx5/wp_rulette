class Ruleta {
    constructor({
        callback_winner,
        canvasId
    } = {}) {
        this.wheelSpinning = false;
        this.callback_winner = callback_winner;
        this.innerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments' : 38,
            'outerRadius' : 160,        // Set the outer radius to make the wheel smaller than the outer wheel.
            'textFillStyle': 'white',
            'textAlignment': 'outer',
            'segments': [
                {'fillStyle' : 'green', 'text' : '0'},
                {'fillStyle' : 'black', 'text' : '28'},
                {'fillStyle' : 'red', 'text' : '9'},
                {'fillStyle' : 'black', 'text' : '26'},
                {'fillStyle' : 'red', 'text' : '30'},
                {'fillStyle' : 'black', 'text' : '11'},
                {'fillStyle' : 'red', 'text' : '7'},
                {'fillStyle' : 'black', 'text' : '20'},
                {'fillStyle' : 'red', 'text' : '32'},
                {'fillStyle' : 'black', 'text' : '17'},
                {'fillStyle' : 'red', 'text' : '5'},
                {'fillStyle' : 'black', 'text' : '22'},
                {'fillStyle' : 'red', 'text' : '34'},
                {'fillStyle' : 'black', 'text' : ' 15'},
                {'fillStyle' : 'red', 'text' : '3'},
                {'fillStyle' : 'black', 'text' : '24'},
                {'fillStyle' : 'red', 'text' : '36'},
                {'fillStyle' : 'black', 'text' : '13'},
                {'fillStyle' : 'red', 'text' : '1'},
                {'fillStyle' : 'green', 'text' : '00'},
                {'fillStyle' : 'red', 'text' : '27'},
                {'fillStyle' : 'black', 'text' : '10'},
                {'fillStyle' : 'red', 'text' : '25'},
                {'fillStyle' : 'black', 'text' : '29'},
                {'fillStyle' : 'red', 'text' : '12'},
                {'fillStyle' : 'black', 'text' : '8'},
                {'fillStyle' : 'red', 'text' : '19'},
                {'fillStyle' : 'black', 'text' : '31'},
                {'fillStyle' : 'red', 'text' : '18'},
                {'fillStyle' : 'black', 'text' : '6'},
                {'fillStyle' : 'red', 'text' : '21'},
                {'fillStyle' : 'black', 'text' : '33'},
                {'fillStyle' : 'red', 'text' : '16'},
                {'fillStyle' : 'black', 'text' : '4'},
                {'fillStyle' : 'red', 'text' : '23'},
                {'fillStyle' : 'black', 'text' : '35'},
                {'fillStyle' : 'red', 'text' : '14'},
                {'fillStyle' : 'black', 'text' : '2'}
            
            ]
        });

        this.outerWheel = new Winwheel({
            'numSegments'       : 9,                // Specify number of segments.
            'outerRadius'       : 200,              // Set outer radius so wheel fits inside the background.
            'drawText'          : true,             // Code drawn text can be used with segment images.
            'textFontSize'      : 16,               // Set text options as desired.
            'fillStyle': 'white',
            'textOrientation'   : 'curved',
            'textAlignment'     : 'inner',
            'textMargin'        : 90,
            'textFontFamily'    : 'monospace',
            'textStrokeStyle'   : 'black',
            'textLineWidth'     : 3,
            'textFillStyle'     : 'white',
            'segments'          :                    // Define segments including image and text.
            [
               {'image' : 'img/animales/pescado.png',  'text' : 'Jane'},
               {'image' : 'img/animales/pescado.png',   'text' : 'Tom'},
               {'image' : 'img/animales/pescado.png',  'text' : 'Mary'},
               {'image' : 'img/animales/pescado.png',  'text' : 'Alex'},
               {'image' : 'img/animales/pescado.png', 'text' : 'Sarah'},
               {'image' : 'img/animales/pescado.png', 'text' : 'Bruce'},
               {'image' : 'img/animales/pescado.png',  'text' : 'Rose'},
               {'image' : 'img/animales/pescado.png', 'text' : 'Steve'},
               {'image' : 'img/animales/pescado.png', 'text' : 'Steve'}
            ],
            'animation':
            {
              'type': 'spinToStop',                     // Define animation more or less as normal, except for the callbackAfter().
              'duration': 5,
              'spins': 8,
              'callbackAfter' : this.drawInnerWheel.bind( this ),     // Call back after each frame of the animation a function we can draw the inner wheel from.
              'callbackFinished': this.alertPrize.bind( this )
            }
        });

        // Call draw on the outerWheel then the inner wheel to ensure that both are rendered on the canvas.
        this.outerWheel.draw(false);
        this.innerWheel.draw(false);   // Pass false to stop it clearing the canvas and wiping the outer wheel.

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.startSpin( )
        })
    }

        // This function is called after the outer wheel has drawn during the animation.
    drawInnerWheel( ) {
        // Update the rotationAngle of the innnerWheel to match that of the outer wheel - this is a big part of what
        // links them to appear as one 2-part wheel. Call the draw function passing false so the outer wheel is not wiped.
        this.innerWheel.rotationAngle = this.outerWheel.rotationAngle;
        this.innerWheel.draw(false);
    }

        // Called when the animation has finished.
    alertPrize( ) {
        // The the indicated segments from the 2 wheels.
        var winningInnerSegment = this.innerWheel.getIndicatedSegment();
        var winningOuterSegment = this.outerWheel.getIndicatedSegment();

        // Alert the combination of prizes won.
        alert('You won ' + winningInnerSegment.text + ', ' + winningOuterSegment.text);

        // Set things so power and spin button can be clicked again.
        this.wheelSpinning = false;

        this.callback_winner && this.callback_winner( winningInnerSegment );
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
            this.outerWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
            this.outerWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
            this.outerWheel.draw();                // Call draw to render changes to the wheel.
            this.innerWheel.rotationAngle = 0;
            this.innerWheel.draw(false);

            // Based on the power level selected adjust the number of spins for the wheel, the more times is has
            // to rotate with the duration of the animation the quicker the wheel spins.
            if (true)
            {
                this.outerWheel.animation.spins = 3;     // Number of spins and/or duration can be altered to make the wheel
                this.outerWheel.animation.duration = 7;  // appear to spin faster or slower.
            }
            // Begin the spin animation by calling startAnimation on the wheel object.
            this.outerWheel.startAnimation();

            // Set to true so that power can't be changed and spin button re-enabled during
            // the current animation. The user will have to reset before spinning again.
            this.wheelSpinning = true;
        }
    }
}
new Ruleta( )