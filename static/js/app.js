(function() {

    const project = document.getElementById("project");
    const addBoardButton = document.getElementById("add-board");
    const boardModal = document.getElementById("board-modal");
    const boardForm = document.getElementById("board-form");
    const columnModal = document.getElementById("column-modal");
    const columnForm = document.getElementById("column-form");
    const cardModal = document.getElementById("card-modal");
    const cardForm = document.getElementById("card-form");
    
    let boards = [];
    let columns = [];
    let cards = [];
    let ids = [0];


    function cloneElement(id) {
        let template = document.getElementById(id);
        let element = template.cloneNode(true);
        element.removeAttribute("id");
        return element;
    }


    addBoardButton.addEventListener("click", ()=>{
        showBoardModal();
    });

    function showBoardModal() {
        boardModal.style.display = "block";
        const inputName = document.getElementById("board-name");
        inputName.focus();
    }

    boardForm.addEventListener("submit", ()=>{
        event.preventDefault();
        let boardName = event.target.elements["board-name"];
        addBoard(boardName.value);
        boardName.value = "";
        boardModal.style.display = "none";
    });


    function addBoard(boardName) {
        let boardNode = cloneElement("board-template");

        let id = generateId();
        
        let boardHeader = boardNode.querySelector(".board-header");
        boardHeader.innerText = boardName;

        let addColumnButton = boardNode.querySelector(".add-column");

        addColumnButton.addEventListener("click", ()=>{
            showColumnModal(id);
        });

        
        boardNode.setAttribute("id", id);

        let button = boardNode.querySelector(".remove-board");
        button.setAttribute("data-id", id);

        let columnContainer = boardNode.querySelector(".column-container");

        let board = {
            id: id,
            name: boardName,
            el: boardNode,
            columnContainer: columnContainer
        }

        boards.push(board);
        project.appendChild(boardNode);
    }

    function showColumnModal(boardId){
        columnModal.style.display = "block";
        const inputName = document.getElementById("column-name");
        columnForm.elements["board-id"].value = boardId;
        inputName.focus();
    }

    columnForm.addEventListener("submit", ()=>{
        event.preventDefault();
        let boardId = event.target.elements["board-id"].value;
        let columnName = event.target.elements["column-name"].value;
        addColumn(columnName, boardId);
        columnName.value = "";
        columnModal.style.display = "none";
    });



    function addColumn(columnName, boardId) {
        
        let columnNode = cloneElement("column-template");

        let id = generateId();

        let columnHeader = columnNode.querySelector(".column-header");
        columnHeader.innerText = columnName;
        
        let cardContainer = columnNode.querySelector(".card-container");

        let addCardButton = columnNode.querySelector(".add-card");

        addCardButton.addEventListener("click", ()=>{

            showCardModal(id);

        });

        
        columnNode.setAttribute("id", id);

        let button = columnNode.querySelector(".remove-column");
        button.setAttribute("data-id", id);

        let column = {
            id: id,
            name: columnName,
            el: columnNode,
            cardContainer: cardContainer,
            boardId: boardId
        };

        let board = document.getElementById(boardId);
        let columnContainer = board.querySelector(".column-container");
        columnContainer.appendChild(columnNode);
        columns.push(column);
    }

    function showCardModal(columnId){
        cardModal.style.display = "block";
        cardForm.elements["column-id"].value = columnId;

        const inputName = document.getElementById("card-name");
        inputName.focus();
    }    

    cardForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        let name = event.target.elements["card-name"].value;
        let description = event.target.elements["card-description"].value;
        let columnName = event.target.elements["column-id"].value;
        addCard(name, description, columnName);
        cardModal.style.display = "none";
    });

    function addCard(name, description, columnId) {
        let cardNode = cloneElement("card-template");
        let cardName = cardNode.querySelector(".card-name");
        let cardDescription = cardNode.querySelector(".card-description");

        cardName.innerText = name;
        cardDescription.innerText = description;

        let id = generateId();

        cardNode.setAttribute("id", id);

        let button = cardNode.getElementsByClassName("remove-card")[0];
        button.setAttribute("data-id", id)

        let card = {
            id: id,
            name: name,
            description: description,
            columnId: columnId,
            el: cardNode
        }

        let column = document.getElementById(columnId);
        let cardContainer = column.querySelector(".card-container");
        cardContainer.appendChild(cardNode);
        cards.push(card);   
    }




    function removeCard(id) {
        for (i = 0; i < cards.length; i++) {
            if (cards[i].id == id) {
                //usuwamy element HTML
                let rmv = document.getElementById(id);
                parent = rmv.parentNode;
                parent.removeChild(rmv);
                //usuwamy kartę z tablicy kart
                cards.splice(i, 1);
                //usuwamy id karty z listy zajętych id
                let index = ids.indexOf(cards[i]);
                ids.splice(index, 1);
                console.log("Card removed successfully! ID:", id);
                return;
            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-card')) {
            
            removeCard(event.target.dataset.id);
        }
    });

    function removeCardsFromColumn(columnId) {
        for (i = 0; i < cards.length; i++) {
            if (cards[i].columnId == columnId) {
                removeCard(cards[i].id);
                i--;    //po usunięciu karty, następnik przyjmuje jej index w tablicy, należy więc cofnąć iterator
            }
        }
    }

    function removeColumn(id) {
        for (i = 0; i < columns.length; i++) {
            if (columns[i].id == id) {
                //usuwamy wszystkie karty z tej kolumny
                removeCardsFromColumn(id);
                //usuwamy kolumnę z tablicy kolumn
                columns.splice(i, 1);
                //usuwamy id kolumny z listy zajętych id
                let index = ids.indexOf(columns[i]);
                ids.splice(index, 1);
                //usuwamy element HTML
                let col = document.getElementById(id);
                parent = col.parentNode;
                parent.removeChild(col);
                console.log("Column removed successfully! ID:", id);
                
            }
        }
        for (i = 0; i < cards.length; i++) {
            if (cards[i].columnId === id) {
                cards.splice(i, 1);
            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-column')) {
            removeColumn(event.target.dataset.id);
        }
    });


    function removeColumnsFromBoard(boardId){
        for (i = 0; i < columns.length; i++) {
            if (columns[i].boardId == boardId) {
                removeColumn(columns[i].id);
                i--; //patrz removeCardsFromColumn
            }
        }
    }

    function removeBoard(id) {
        for (i = 0; i < boards.length; i++) {
            if (boards[i].id == id) {
                //usuwamy wszystkie kolumny z tej tablicy
                removeColumnsFromBoard(id);
                //usuwamy tablicę z tablicy tablic XDDDDDD
                boards.splice(i, 1);
                //usuwamy id tablicy z listy zajętych id
                let index = ids.indexOf(boards[i]);
                ids.splice(index, 1);
                //usuwamy element HTML
                let brd = document.getElementById(id);
                parent = brd.parentNode;
                parent.removeChild(brd);
                console.log("Board removed successfully! ID:", id);

            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-board')) {
            removeBoard(event.target.dataset.id);
        }
    });

 /*   addColumnButton.addEventListener("click", ()=>{
        modal.style.display = "block";
        const inputTitle = document.getElementById("modal-text");
        inputTitle.focus();
    });*/
    

    window.addEventListener("click", (event)=>{
        if (event.target == boardModal) {
            boardModal.style.display = "none";
        } else if (event.target == columnModal) {
            columnModal.style.display = "none";
        } else if (event.target == cardModal) {
            cardModal.style.display = "none";
        }

    });

    function generateId() {
        if (ids) {
            let last = ids[ids.length-1];
            let newId = last + 1;
            ids.push(newId);
            return newId;
        } else {
            ids.push(1);
            return 1;
        }
    }

    




    localStorage.setItem('tekst', 'costamcostam');
    localStorage.setItem('tab', [1,2,3,4]);
//    console.log(localStorage.getItem('tekst'), localStorage.getItem('tab'));
    
    
})();

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("dragged card's id:", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let cardId = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(cardId));

    let columnId = ev.target.parentElement.id;
    console.log("dropped column's id:", columnId);
    //changeCardOwner(cardId, columnId); //to trzeba napisać
    
}