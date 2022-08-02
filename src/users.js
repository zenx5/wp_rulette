(function() {
    addEventListener('load', function() {
		let template = ``
		let players = JSON.parse(sessionStorage.getItem('players') || '[{"id":1,"name":"moises","plays":[]},{"id":2,"name":"mario","plays":[]}]');
    	for( let player of players ) {
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
        document.querySelector('.users-container tbody').innerHTML = template;
        let selectedPlayer = null;
        document.querySelectorAll('.users-container tbody tr').forEach( element => {
        	console.log(element)
            element.addEventListener('click', function ( ) {
		  //       document.querySelectorAll('tr').forEach( element => {
		  //       	element.classList.remove('selected');
		  //       });
				// element.classList.add('selected');
				let id_player= element.dataset.player;

				let plays = JSON.parse( sessionStorage.getItem('plays') );
			    let players = JSON.parse(sessionStorage.getItem('players') || '[{"id":1,"name":"moises","plays":[]},{"id":2,"name":"mario","plays":[]}]');
				let player = players.find( player => player.id == selectedPlayer ) || {};
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

				selectedPlayer = +id_player;
            });
        });
    })                
})();