class scope {
	constructor( pack, sectors ) {
		this.pack = pack
		this.ruleta = new Ruleta({
			scope: this,
	        sectors: sectors,
	        radius: 180,
	        innerRadius: 90,
	        backRadius: 185,
	        backColor: 'yellow',
	        callback_winner: ( sectors, data ) => {
	        	let plays = this.query.getPlays( );
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

	    this.query = new Query({scope: this});

	    this.board = new Board({scope: this});

	    this.panel = new Panel({scope: this});
	}

	savePlay( ) {
		let tag = this.board.selected;
		let player_id = this.panel.selectedPlayer;
		let play = {
			tag: tag,
			mount: 150
		};
		if( tag && player_id ) this.query.savePlay( player_id, play );
	}

	deletePlay( player_id, play_tag ) {
		this.query.deletePlay( player_id, play_tag );
	}
}


addEventListener('load', async ev => {
    const pack = document.querySelector('canvas').dataset.pack
	const sectors = await fetch(location.origin+'/ruleta/wp-json/rulette/v1/sectors?pack='+pack).then(response=>response.json())
    const sound = new Audio(`${location.origin}/ruleta/wp-content/plugins/wp_rulette/audio.mp3`)

    new scope( pack, sectors );
})

