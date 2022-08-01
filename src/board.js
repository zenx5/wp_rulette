(function() {
    addEventListener('load', function() {
        JSON.parse( sessionStorage.getItem('plays') ).forEach( play => {
            document.querySelector("[data-tag='"+play.tag+"']").setAttribute('class','board-tag selected')
        })
        document.querySelector('.board-container')
            .addEventListener('click', function(ev) {
                const target = ev.target;
                let plays = JSON.parse( sessionStorage.getItem('plays') ) || []
                document.querySelectorAll('board-tag').forEach(e => e.setAttribute('class', 'board-tag'));
                if (target.className === 'board-tag') {
                    target.setAttribute('class', 'board-tag selected');
                    plays.push({
                        tag: target.dataset.tag,
                        player: 'user'
                    })
                }else{
                    target.setAttribute('class', 'board-tag');
                    plays = plays.filter( elem => elem.tag !== target.dataset.tag )
                }
                sessionStorage.setItem( 'plays', JSON.stringify(plays) );
            });
    })                
})();