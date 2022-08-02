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
			template += `
	                <td> ${player['name']} </td>
	                <td> ${player.money} </td>
            `
	        tr.innerHTML = template;
        	document.querySelector('.users-container tbody').appendChild(tr);
        };
    	let tr = document.createElement('tr');
    	tr.dataset.player = -1;
    	tr.innerHTML = `
            <td> <input type="text" class="name" > </td>
            <td> <input type="number" class="money" > </td>
    	`
        document.querySelector('.users-container tbody').appendChild(tr);
        document.querySelector('.users-container button').onclick = _ => {
			let players = JSON.parse(sessionStorage.getItem('players') || '[{"id":1,"name":"moises","plays":[],"money":500},{"id":2,"name":"mario","plays":[],"money":400}]');
			let id = players.sort( (A, B) => B.id - A.id )[0].id + 1;
			let player = {
				id: id,
				name: document.querySelector('.users-container tbody tr input.name').value,
				money: +document.querySelector('.users-container tbody tr input.money').value
			}
			console.log(!player.name , !player.money)
			console.log(player)
			if( !player.name || !player.money ) return;
			players.push( player );
			sessionStorage.setItem('players', JSON.stringify(players));
			
    		let tr2 = document.createElement('tr');
    		tr2.dataset.player = player.id;
    		tr2.onclick = _ => {
    			sessionStorage.setItem('currentUser', player.id );
    		}
			let template = `
	                <td> ${player.name} </td>
	                <td> ${player.money} </td>
            `
	        tr2.innerHTML = template;
        	document.querySelector('.users-container tbody').insertBefore( tr2, tr );
        }
    })                
})();