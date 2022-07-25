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
		console.log(player_id, play)
		let players = this.getPlayers( );
		let player = players.find( player => player.id == player_id );
		let plays = player.plays.push( play );
		sessionStorage.setItem('players', JSON.stringify( players ) );
	}
}