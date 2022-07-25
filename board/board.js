class Board {
	constructor( ) {
		this.selected

        document.querySelector('.board-container')
            .addEventListener('click', this.registerClick.bind( this ) );



        /*
        AQUI LA CREACION DE LA JUGADA POR METODO POST
            $.ajax({
                method: 'post',
                url: url de api,
                data: {
                    tag: $(this).text(),
                    value: $('#value').val(),
                    user: $('#user').data('id')
                }
            })
        */
	}

	registerClick( event ) {
		const target = event.target;
        document.querySelectorAll('.board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
        if (target.className === 'board-tag') {
            target.setAttribute('class', 'board-tag selected');
            this.selected = target;
        }
	}
}