class scope {
	constructor( pack, sectors ) {
		this.pack = pack
		this.ruleta = new Ruleta({
	        sectors: sectors,
	        radius: 180,
	        innerRadius: 90,
	        backRadius: 185,
	        backColor: 'yellow',
	        callback_winner: ( sectors, data, plays ) => {
	            let winnerIndex = sectors.findIndex( element => element.tag === data.text );
	            let winner = sectors[ winnerIndex ];
	            let datas = {
	                winner: winner,
	                plays: plays,
	                date: new Date( )
	            };
	            $.ajax({
	                url: `${location.origin}/ruleta/wp-json/rulette/v1/plays`,
	                type: 'post',
	                data: {
	                    data: datas
	                },
	                success: _ => {
	                    console.log(_)
	                },
	                error: _ => {
	                    console.log(_)
	                }
	            })
	        },
	    });

	    this.board = new Board( );

	    //datos de prueba
	    let players = [
	    	{
	    		id: 1,
	    		name: 'moises',
	    		plays: [
		    		{
		    			tag: 10,
		    			mount: 100
		    		},
		    		{
		    			tag: 15,
		    			mount: 150
		    		}
	    		]
	    	}
	    ]
	    this.panel = new Panel( players );
	}
}


addEventListener('load', async ev => {
    const pack = document.querySelector('canvas').dataset.pack
	const sectors = await fetch(location.origin+'/ruleta/wp-json/rulette/v1/sectors?pack='+pack).then(response=>response.json())
    const sound = new Audio(`${location.origin}/ruleta/wp-content/plugins/wp_rulette/audio.mp3`)

    new scope( pack, sectors );
})

