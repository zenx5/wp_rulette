class Ruleta {
    constructor({
        callback_winner,
        canvasId,
        jugadas,
        dificultad,
        levels,
        sectors,
        audio
    } = {}) {
        this.rulette_sectors = sectors || []
        this.rulette_segments = sectors.map( elem => elem );

        this.rulette_sectors.sort( (elemA, elemB) => elemA.tag - elemB.tag );
        this.rulette_segments.sort( (elemA, elemB) => elemA.order - elemB.order )

        let rulette_segments = this.rulette_segments.map( element => {
            return {
                'fillStyle': element.color,
                'text': element.tag
            }
        });

        this.levels = levels || [];
        this.wheelSpinning = false;
        this.callback_winner = callback_winner;
        this.dificultad = dificultad || "easy";
        this.jugadas = jugadas || [];
        this.radius = 180;
        this.audio = audio;

        this.innerWheel = new Winwheel({
            'canvasId': canvasId || 'canvas',
            'numSegments' : rulette_segments.length,
            'outerRadius' : this.radius,
            'innerRadius' : this.radius/2,
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
            },
            'pins': {
                'number'     : 24,
                'fillStyle'  : 'silver',
            }
        });

        this.ss = new Winwheel({
            canvasId: canvasId || 'canvas',
            numSegments: 1,
            innerRadius: this.radius/2-8,
            outerRadius: this.radius+5,
            fillStyle: 'yellow',
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
            this.drawWheels( )

        }

        document.querySelector('#btn_spin').addEventListener( 'click', event => {
            this.initSpin( )
        })
    }
    
    playSound( ) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.play();
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
        this.ss.draw( );
        this.outerWheel.draw(false);
        this.innerWheel.draw(false);
    }

    // Called when the animation has finished.
    alertPrize( ) {
        var winningInnerSegment = this.innerWheel.getIndicatedSegment().text;
        let winner = this.rulette_sectors.findIndex( element => element.tag === winningInnerSegment )

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
                array_temp = [ ...this.jugadas, ...this.rulette_sectors ];
                
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
                    
                    if( this.jugadas.findIndex( element => element.tag == index ) == -1 ) {
                        
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

function getRandomNumber( min, max ) {
    return Math.random( )*( max - min) + min;
}

function GetRandomInteger( min, max ) {
    return Math.floor( getRandomNumber( min, max+1 ) );
}

addEventListener('load', async ev => {
    const pack = document.querySelector('canvas').dataset.pack
    console.log( pack )
    const sectors = await fetch(location.origin+'/wp-json/rulette/v1/sectors?pack='+pack).then(response=>response.json()) 
    console.log( sectors )
    console.log(`${location.origin}/ruleta/wp-json/rulette/v1/plays`)
    new Ruleta({
        callback_winner: data => {
            console.log(data);
            $.ajax({
                url: `${location.origin}/wp-json/rulette/v1/plays`,
                type: 'post',
                data: {
                    play: data
                },
                success: _ => {
                    console.log(_)
                },
                error: _ => {
                    console.log(_)
                }
            })
        },
        sectors: sectors
    })
})
