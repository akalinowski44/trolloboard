(function() {

    const project = document.getElementById("project");
    const addBoardButton = document.getElementById("add-board");
    const boardModal = document.getElementById("board-modal");
    const boardForm = document.getElementById("board-form");
    const columnModal = document.getElementById("column-modal");
    const columnForm = document.getElementById("column-form");
    const cardModal = document.getElementById("card-modal");
    const cardForm = document.getElementById("card-form");

    let initialState = {
        boards: [{id: 1, name: "Test Board"}],
        columns: [{id: 2, name: "To do", boardId: 1},
                  {id: 3, name: "Doing", boardId: 1},
                  {id: 4, name: "Done", boardId: 1}],
        cards: [{id: 5, name: "Task 1", description: "Description", columnId: 2},
                {id: 6, name: "Task 2", description: "Description", columnId: 3},
                {id: 7, name: "Task 3", description: "Description", columnId: 4}],
        ids: [0,1,2,3,4,5,6,7]
    }

    let state = loadData('state');

    function cloneElement(id) {
        let template = document.getElementById(id);
        let element = template.cloneNode(true);
        element.removeAttribute("id");
        return element;
    }

    function generateId() {
        if (state.ids) {
            let last = state.ids[state.ids.length-1];
            let newId = last + 1;
            state.ids.push(newId);
            return newId;
        } else {
            state.ids.push(1);
            return 1;
        }
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

        let boardName = event.target.elements["board-name"].value;
        let id = generateId();

        let board = {
            id: id,
            name: boardName
        }

        addBoard(board);
        state.boards.push(board);
        updateDatabase(state);

        boardName.value = "";
        boardModal.style.display = "none";

    });

    function addBoard(board) {
        let boardNode = cloneElement("board-template");
        boardNode.setAttribute("id", board.id);
    
        let boardHeader = boardNode.querySelector(".board-header");
        boardHeader.innerText = board.name;

        let addColumnButton = boardNode.querySelector(".add-column");
        let hideBoardButton = boardNode.querySelector(".hide-board");

        addColumnButton.addEventListener("click", ()=>{
            showColumnModal(board.id);
        });

        hideBoardButton.addEventListener("click", ()=>{
            changeVisibility(board.id);
        });
        
        let button = boardNode.querySelector(".remove-board");
        button.setAttribute("data-id", board.id);

        project.appendChild(boardNode);
        
    }

    function changeVisibility(boardId) {
        let board = document.getElementById(boardId);
        let columnContainer = board.querySelector(".column-container");

        if (columnContainer.style.display == "none") {
            columnContainer.style.display = "flex";
        } else {
            columnContainer.style.display = "none";
        }
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

        let id = generateId();

        let column = {
            id: id,
            name: columnName,
            boardId: boardId
        };

        addColumn(column);
        state.columns.push(column);
        updateDatabase(state);

        columnName.value = "";
        columnModal.style.display = "none";
    });

    function addColumn(column) {
        
        let columnNode = cloneElement("column-template");        

        let columnHeader = columnNode.querySelector(".column-header");
        columnHeader.innerText = column.name;
        
        let cardContainer = columnNode.querySelector(".card-container");

        let addCardButton = columnNode.querySelector(".add-card");

        addCardButton.addEventListener("click", ()=>{

            showCardModal(column.id);

        });
        
        columnNode.setAttribute("id", column.id);

        let button = columnNode.querySelector(".remove-column");
        button.setAttribute("data-id", column.id);

        let board = document.getElementById(column.boardId);
        let columnContainer = board.querySelector(".column-container");
        columnContainer.appendChild(columnNode);
        
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
        let columnId = event.target.elements["column-id"].value;

        let id = generateId();

        let card = {
            id: id,
            name: name,
            description: description,
            columnId: columnId,
        }

        addCard(card);
        state.cards.push(card);   
        updateDatabase(state);
        cardModal.style.display = "none";
    });

    function addCard(card) {
        let cardNode = cloneElement("card-template");
        let cardName = cardNode.querySelector(".card-name");
        let cardDescription = cardNode.querySelector(".card-description");

        cardName.innerText = card.name;
        cardDescription.innerText = card.description;

        cardNode.setAttribute("id", card.id);

        let button = cardNode.getElementsByClassName("remove-card")[0];
        button.setAttribute("data-id", card.id)

        let column = document.getElementById(card.columnId);
        let cardContainer = column.querySelector(".card-container");
        cardContainer.appendChild(cardNode);
        
    }

    function removeCard(id) {
        for (let i = 0; i < state.cards.length; i++) {
            if (state.cards[i].id == id) {
                //usuwamy element HTML
                let rmv = document.getElementById(id);
                parent = rmv.parentNode;
                parent.removeChild(rmv);
                //usuwamy kartę z tablicy kart
                state.cards.splice(i, 1);
                //usuwamy id karty z listy zajętych id
                let index = state.ids.indexOf(state.cards[i]);
                state.ids.splice(index, 1);
                console.log("Card removed successfully! ID:", id);
                updateDatabase(state);
                return;
            }
        }
    }

    function removeCardsFromColumn(columnId) {
        for (let i = 0; i < state.cards.length; i++) {
            if (state.cards[i].columnId == columnId) {
                removeCard(state.cards[i].id);
                i--;    //po usunięciu karty, następnik przyjmuje jej indeks w tablicy,
                        //należy więc cofnąć iterator, aby sprawdzić ten element
            }
        }
    }

    function removeColumn(id) {
        for (let i = 0; i < state.columns.length; i++) {
            if (state.columns[i].id == id) {
                //usuwamy wszystkie karty z tej kolumny
                removeCardsFromColumn(id);
                //usuwamy id kolumny z listy zajętych id
                let index = state.ids.indexOf(state.columns[i]);
                state.ids.splice(index, 1);
                //usuwamy kolumnę z tablicy kolumn
                state.columns.splice(i, 1);
                //usuwamy element HTML
                let col = document.getElementById(id);
                parent = col.parentNode;
                parent.removeChild(col);
                updateDatabase(state);
                console.log("Column removed successfully! ID:", id);
                
            }
        }
        for (let i = 0; i < state.cards.length; i++) {
            if (state.cards[i].columnId === id) {
                state.cards.splice(i, 1);
            }
        }
    }

    function removeColumnsFromBoard(boardId){
        for (let i = 0; i < state.columns.length; i++) {
            if (state.columns[i].boardId == boardId) {
                removeColumn(state.columns[i].id);
                i--; //patrz removeCardsFromColumn
            }
        }
    }

    function removeBoard(id) {
        for (let i = 0; i < state.boards.length; i++) {
            if (state.boards[i].id == id) {
                //usuwamy wszystkie kolumny z tej tablicy
                removeColumnsFromBoard(id);
                //usuwamy id tablicy z listy zajętych id
                let index = state.ids.indexOf(state.boards[i]);
                state.ids.splice(index, 1);
                //usuwamy tablicę z tablicy tablic XDDDDDD
                state.boards.splice(i, 1);
                //usuwamy element HTML
                let brd = document.getElementById(id);
                parent = brd.parentNode;
                parent.removeChild(brd);
                updateDatabase(state);
                console.log("Board removed successfully! ID:", id);

            }
        }
    }

    window.addEventListener("click", (event)=>{

        //Handle remove buttons
        if (event.target.classList.contains('remove-board')) {
            removeBoard(event.target.dataset.id);
        } else if (event.target.classList.contains('remove-column')) {
            removeColumn(event.target.dataset.id);
        } else if (event.target.classList.contains('remove-card')) {
            removeCard(event.target.dataset.id);
        } 
        //Hide modal on click outside
        else if (event.target == boardModal) {
            boardModal.style.display = "none";
        } else if (event.target == columnModal) {
            columnModal.style.display = "none";
        } else if (event.target == cardModal) {
            cardModal.style.display = "none";
        }
    });

/****************Drag & Drop******************/

    window.allowDrop = function(ev) {
        ev.preventDefault();
    }

    window.drag = function(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
        console.log("dragged card's id:", ev.target.id);
    }

    window.drop = function(ev) {
        ev.preventDefault();
        let cardId = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(cardId));

        let columnId = ev.target.parentElement.id;

        console.log("dropped column's id:", columnId);
        changeCardOwner(cardId, columnId); 
        updateDatabase(state);
        
    }

    function changeCardOwner(cardId, columnId) {
        for (let card of state.cards) {
            if (card.id == cardId) {
                card.columnId = columnId;
            }
        }
    }


/****************DATA HANDLER*****************/


    function updateDatabase(state) {
        localStorage.setItem('state', JSON.stringify(state));
    }

    function getDatabase(key) {
        let state = localStorage.getItem(key);
        return JSON.parse(state) || initialState;
    }

    function loadData(key) {

        let state = getDatabase(key);

        for (let board of state.boards) {
            addBoard(board);
        }

        for (let column of state.columns) {
            addColumn(column);
        }
        for (let card of state.cards) {
            addCard(card);
        }
        return state;
    }

})();