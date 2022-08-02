(function() {
    addEventListener('load', function() {
        JSON.parse( sessionStorage.getItem('plays') ).forEach( play => {
            const currentUser = sessionStorage.getItem('current-user') || ''
            if( play.player === currentUser ){
                document.querySelector("[data-tag='"+play.tag+"']").setAttribute('class','board-tag selected')
            }
        })
        document.querySelector('.board-container')
            .addEventListener('click', function(ev) {
                const currentUser = sessionStorage.getItem('current-user') || ''
                const target = ev.target;
                if( currentUser === '' ){
                    alert('debe seleccionar un usuario')
                    return;
                }
                let plays = JSON.parse( sessionStorage.getItem('plays') ) || []
                document.querySelectorAll('board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
                if (target.className === 'board-tag') {
                    target.setAttribute('class', 'board-tag selected');
                    plays.push({
                        tag: target.dataset.tag,
                        player: currentUser
                    })
                }else{
                    target.setAttribute('class', 'board-tag');
                    plays = plays.filter( elem => elem.tag !== target.dataset.tag )
                }
                sessionStorage.setItem( 'plays', JSON.stringify(plays) );
            });
    })                
})();
