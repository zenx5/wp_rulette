class Panel {
	constructor( players ) {
		this.players = players;
		this.selectedPlayer = null;

		document.querySelector('#container-panel').innerHTML = this.render( )

        document.querySelectorAll('tr').forEach( element => {
            element.addEventListener('click', this.selectPlayer.bind( this, element ) );
        });

	}

	set select( newValue ) {
		this.selectedPlayer = newValue;
	}

	selectPlayer( element ) {
        document.querySelectorAll('tr').forEach( element => {
        	element.classList.remove('selected');
        });
		element.classList.add('selected');
		this.select = element.dataset.player
	}

	render( ) {
		console.log(this)
		let template = `
			<table>
	            <thead>
	                <tr>
	                    <th>Players</th>
	                    <th>Jugadas</th>
	                </tr>
	            </thead>
	            <tbody>
	     `
    	for( let player of this.players ) {
    		console.log(player)
			template += `
	            <tr data-player="${player['id']}" >
	                <td> ${player['name']} </td>
	                <td>
        	`
                    for( let play of player.plays ) {
                    	template += `
                        	<p> jugado el ${play['tag']} por ${play.mount} </p>
                    	`
                    }
            template += `
	                </td>
	            </tr>
            `
        }
        template += `
			    </tbody>
			</table>
			<button id="btn_save_play" >Jugar</button>
        `
        return template;
    }
}