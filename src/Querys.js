class Query {
	construtor({scope}) {
		this.scope = scope
	}

	getPlayers( ) {
	    let players = sessionStorage.getItem('players') || '[{"id":1,"name":"moises","plays":[]}]';
	    return JSON.parse( players )
	}

	getPlays( ) {
		let players = this.getPlayers( );
		let plays = [];
		for( let player of players ) {
			for( let play of player.plays) {
				play.player_id = player.id;
				plays.push( play );
			}
		}
		return plays;
	}

	savePlay( player_id, play ) {
		let players = this.getPlayers( );
		let player = players.find( player => player.id == player_id );
		let plays = player.plays.push( play );
		sessionStorage.setItem('players', JSON.stringify( players ) );
	}

	deletePlay( player_id, play_tag ) {
		console.log(player_id,play_tag)
		let players = this.getPlayers( );
		let player = players.find( player => player.id == player_id );
		console.log(players)
		console.log(player)

		let playindex = player.plays.findIndex( play => play.tag == play_tag );
		player.plays.splice( playindex, 1 );
		console.log(player)
		sessionStorage.setItem('players', JSON.stringify( players ) );
	}
}