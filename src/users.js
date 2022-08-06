(function() {
	const currentUser = parseInt(sessionStorage.getItem("currentUser")) || null;
	const players = JSON.parse(sessionStorage.getItem('players') || '[]');
	const plays = JSON.parse(sessionStorage.getItem('plays') || '[]');
	const createRow = (player) => {
		const index = players.findIndex(elem => (elem.id===player.id)) + 1
		const tr = document.createElement('tr');
		const tdname = document.createElement('td')
		tdname.innerHTML = player.name
		tdname.dataset.player = player.id;
		tdname.addEventListener('click', ev => {
			document.querySelector('#style-user').innerHTML = "#user-body tr:nth-child("+index+"){font-weight: bold;}"
			sessionStorage.setItem('currentUser', index );
			document.querySelectorAll(".board-tag").forEach( elem => {
				elem.setAttribute("class", "board-tag")
			});
			plays.forEach( play => {
				if( play.player == index ){
					document.querySelector("[data-tag='"+play.tag+"']").setAttribute('class', 'board-tag selected')	
				}
			})
		})
		tr.append(tdname)
		const tdmoney = document.createElement('td')
		tdmoney.innerHTML = player.money
		tr.append(tdmoney)
		const tdaction = document.createElement('td')
		const button = document.createElement('button')
		button.innerText = "X"
		button.dataset.id = index
		button.addEventListener('click', ev => {
			const id = ev.target.dataset.id
			const newPlayers = players.filter(player => player.id != id)
			sessionStorage.setItem('players', JSON.stringify(newPlayers) )
			ev.target.parentElement.parentElement.remove()
		})
		tdaction.setAttribute('style', 'justify-content: center;align-items: center;display: flex;')
		tdaction.append(button)
		tr.append(tdaction)
		document.querySelector('.users-container tbody').appendChild(tr);		
	}

    addEventListener('load', function() {
		if( currentUser ){
			document.querySelector('#style-user').innerHTML = "#user-body tr:nth-child("+currentUser+"){font-weight: bold;}"
		}
    	for( let player of players ) {
			createRow(player)
        }    	
		        
		document
			.querySelector('.users-container #add')
			.addEventListener('click', ev => {
				const name = document.querySelector('.users-container tbody tr input.name').value
				const money = document.querySelector('.users-container tbody tr input.money').value
				const player = {
					id: players[players.length - 1]?.id + 1 || 1,
					name: name,
					money: money
				}
				players.push(player)
				sessionStorage.setItem('players', JSON.stringify(players))
				createRow(player)
				document.querySelector('.users-container tbody tr input.name').value = ''
				document.querySelector('.users-container tbody tr input.money').value = ''
			})
    })                
})();