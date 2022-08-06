(function() {
    addEventListener('load', function() {
		let players = JSON.parse(sessionStorage.getItem('players') || '[]');
    	for( let player of players ) {
			const index = players.findIndex(elem => (elem.id===player.id)) + 1
			let template = ``
    		let tr = document.createElement('tr');
			let tdname = document.createElement('td')
			tdname.innerHTML = player.name
			tdname.dataset.player = player.id;
			tdname.addEventListener('click', ev => {
				document.querySelector('#style-user').innerHTML = "#user-body tr:nth-child("+index+"){font-weight: bold;}"
    			sessionStorage.setItem('currentUser', ev.target.dataset.player );
    		})
			tr.append(tdname)
			let tdmoney = document.createElement('td')
			tdmoney.innerHTML = player.money
			tr.append(tdmoney)
        	document.querySelector('.users-container tbody').appendChild(tr);
        };
    	let tr = document.createElement('tr');
    	tr.dataset.player = -1;
    	tr.innerHTML = `
            <td> <input type="text" class="name" style="width:100%;"></td>
            <td> <input type="number" class="money" style="width:100%;"></td>
    	`
        document.querySelector('.users-container tbody').appendChild(tr);
        document.querySelector('.users-container button').onclick = _ => {
			let players = JSON.parse(sessionStorage.getItem('players') || '[]');
			players.sort( (A, B) => B.id - A.id );
			id = players[0] ? players[0].id+1 : 1;
			let player = {
				id: id,
				name: document.querySelector('.users-container tbody tr input.name').value,
				money: +document.querySelector('.users-container tbody tr input.money').value
			}
			document.querySelector('.users-container tbody tr input.name').value = '';
			document.querySelector('.users-container tbody tr input.money').value = '';
			if( !player.name || !player.money ) return;
			players.push( player );
			sessionStorage.setItem('players', JSON.stringify(players));
			
    		let tr2 = document.createElement('tr');
    		tr2.dataset.player = player.id;
    		tr2.onclick = _ => {
    			sessionStorage.setItem('current-user', player.id );
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