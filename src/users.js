(function() {
    addEventListener('load', function() {
		let players = JSON.parse(sessionStorage.getItem('players') || '[{"id":1,"name":"moises","plays":[],"money":500},{"id":2,"name":"mario","plays":[],"money":400}]');
    	for( let player of players ) {
			let template = ``
    		let tr = document.createElement('tr');
    		tr.dataset.player = player.id;
    		tr.onclick = _ => {
    			sessionStorage.setItem('currentUser', player.id );
    		}
    		console.log(player)
			template += `
	                <td> ${player['name']} </td>
	                <td> ${player.money} </td>
            `
	        tr.innerHTML = template;
        	document.querySelector('.users-container tbody').appendChild(tr);
        };
    })                
})();