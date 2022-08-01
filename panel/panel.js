class Panel {
	constructor({ scope }) {
		this.scope = scope;
		this.selectedPlayer = null;

		this.render( );
        // document.querySelector("#btn_save_play").addEventListener('click', event => {
        // 	this.scope.savePlay( );
        // 	this.render( )
        // })

        document.querySelectorAll('panel-container tbody tr').forEach( element => {
            element.addEventListener('click', this.selectPlayer.bind( this, element ) );
        });

	}

	set select( newValue ) {
		this.selectedPlayer = +newValue;
	}

	selectPlayer( element ) {
        document.querySelectorAll('tr').forEach( element => {
        	element.classList.remove('selected');
        });
		element.classList.add('selected');
		let id_player= element.dataset.player;
		this.select = id_player;

	}

	render( ) {
		let template = ``
    	for( let player of this.scope.query.getPlayers() ) {
			template += `
	            <tr data-player="${player['id']}" >
	                <td> ${player['name']} </td>
	                <td>
        	`
                    player.plays.forEach( (play, index) => {
                    	template += `
                        	<p> jugado el ${play['tag']} por ${play.mount} <button class="btn-delete-play" data-player="${player.id}" data-tag="${play.tag}">X</button> </p>
                    	`
                    })
            template += `
	                </td>
	            </tr>
            `
        }
        document.querySelector('.panel-container tbody').innerHTML = template
		// document.querySelectorAll(`p .btn-delete-play`).forEach( element => {
	 //        element.addEventListener('click', event => {
	 //        	this.scope.deletePlay( element.dataset.player, element.dataset.tag );
	 //        	this.render( )
	 //        })
	 //    })
    }
}