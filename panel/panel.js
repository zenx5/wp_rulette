class Panel {
	constructor({ scope }) {
		this.scope = scope;
		this.selectedPlayer = null;

		this.render( );
        // document.querySelector("#btn_save_play").addEventListener('click', event => {
        // 	this.scope.savePlay( );
        // 	this.render( )
        // })

        document.querySelectorAll('.panel-container tbody tr').forEach( element => {
        	console.log(element)
            element.addEventListener('click', this.selectPlayer.bind( this, element ) );
        });

	}

	set select( newValue ) {
		this.selectedPlayer = +newValue;
	}

	selectPlayer( element ) {
        // document.querySelectorAll('tr').forEach( element => {
        // 	element.classList.remove('selected');
        // });
		element.classList.add('selected');
		let id_player= element.dataset.player;
		console.log(this.selectedPlayer)

		let plays = JSON.parse( sessionStorage.getItem('plays') );
		let players = this.scope.query.getPlayers( );
		let player = players.find( player => player.id == this.selectedPlayer ) || {};
		console.log(player)
		player.plays = plays;
		sessionStorage.setItem('players', JSON.stringify( players ) );
		player = players.find( player => player.id == id_player );
		sessionStorage.setItem('plays', JSON.stringify( player.plays ) );
		console.log(id_player)
        document.querySelectorAll('.board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
        player.plays.forEach( play => {
            document.querySelector("[data-tag='"+play.tag+"']").setAttribute('class','board-tag selected')
        })

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
                        	<p> jugado el ${play['tag']} por ${play.mount} <button class="btn-delete-play" data-player="${player.id}">X</button> </p>
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