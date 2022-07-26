class Board {
	constructor({scope}) {
		this.selected

        document.querySelector('.board-container')
            .addEventListener('click', this.registerClick.bind( this ) );

	}

	registerClick( event ) {
		const target = event.target;
        document.querySelectorAll('.board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
        if (target.className === 'board-tag') {
            target.setAttribute('class', 'board-tag selected');
            this.selected = +target.innerHTML;
        }
	}
}