//"use strict"
(function () {
    const currentUser = parseInt(sessionStorage.getItem("currentUser")) || null;
    const plays = JSON.parse(sessionStorage.getItem("plays")) || []
  addEventListener("load", function () {    
    plays.forEach((play) => {
      if (parseInt(play.player) == currentUser) {
        document
          .querySelector("[data-tag='" + play.tag + "']")
          .setAttribute("class", "board-tag selected");
      }
    });    
    document
      .querySelector(".board-container")
      .addEventListener("click", function ({target}) {
        if (currentUser === null) {
          alert("debe seleccionar un usuario");
          return;
        }
        document.querySelectorAll("board-tag").forEach( elem => (elem.setAttribute("class", "board-tag")));

        if (target.className === "board-tag") {
          target.setAttribute("class", "board-tag selected");
          plays.push({
            tag: target.dataset.tag,
            player: currentUser
          });
        } else {
          target.setAttribute("class", "board-tag");
          plays = plays.filter( elem => (elem.tag !== target.dataset.tag));
        }
        sessionStorage.setItem("plays", JSON.stringify(plays));
      });
  });
})();
