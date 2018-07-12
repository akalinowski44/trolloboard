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

    let initialState = {
        boards: [],
        columns: [],
        cards: [],
        ids: [0]
    }

    let state = loadData();


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
        let boardName = event.target.elements["board-name"].value;

        let id = generateId();

        let board = {
            id: id,
            name: boardName
        }
        console.log(boardName);
        addBoard(board);
        boardName.value = "";
        boardModal.style.display = "none";
        state.boards.push(board);
        updateDatabase(state);
    });


    function addBoard(board) {
        let boardNode = cloneElement("board-template");
        
        let boardHeader = boardNode.querySelector(".board-header");
        boardHeader.innerText = board.name;

        let addColumnButton = boardNode.querySelector(".add-column");

        addColumnButton.addEventListener("click", ()=>{
            showColumnModal(board.id);
        });
        
        boardNode.setAttribute("id", board.id);

        let button = boardNode.querySelector(".remove-board");
        button.setAttribute("data-id", board.id);

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
        }

        let column = document.getElementById(columnId);
        let cardContainer = column.querySelector(".card-container");
        cardContainer.appendChild(cardNode);
        state.cards.push(card);   
    }

    function removeCard(id) {
        for (i = 0; i < state.cards.length; i++) {
            if (state.cards[i].id == id) {
                console.log(state.cards[i].id, id)
                //usuwamy element HTML
                let rmv = document.getElementById(id);
                console.log(rmv);
                parent = rmv.parentNode;
                parent.removeChild(rmv);
                //usuwamy kartę z tablicy kart
                state.cards.splice(i, 1);
                //usuwamy id karty z listy zajętych id
                let index = state.ids.indexOf(state.cards[i]);
                state.ids.splice(index, 1);
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
        for (i = 0; i < state.cards.length; i++) {
            if (state.cards[i].columnId == columnId) {
                removeCard(state.cards[i].id);
                i--;    //po usunięciu karty, następnik przyjmuje jej index w tablicy, należy więc cofnąć iterator
            }
        }
    }

    function removeColumn(id) {
        for (i = 0; i < state.columns.length; i++) {
            if (state.columns[i].id == id) {
                console.log(state.columns[i].id, id)
                //usuwamy wszystkie karty z tej kolumny
                removeCardsFromColumn(id);
                //usuwamy kolumnę z tablicy kolumn
                state.columns.splice(i, 1);
                //usuwamy id kolumny z listy zajętych id
                let index = state.ids.indexOf(state.columns[i]);
                state.ids.splice(index, 1);
                //usuwamy element HTML
                let col = document.getElementById(id);
                parent = col.parentNode;
                parent.removeChild(col);
                console.log("Column removed successfully! ID:", id);
                
            }
        }
        for (i = 0; i < state.cards.length; i++) {
            if (state.cards[i].columnId === id) {
                state.cards.splice(i, 1);
            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-column')) {
            removeColumn(event.target.dataset.id);
        }
    });


    function removeColumnsFromBoard(boardId){
        for (i = 0; i < state.columns.length; i++) {
            if (state.columns[i].boardId == boardId) {
                removeColumn(state.columns[i].id);
                i--; //patrz removeCardsFromColumn
            }
        }
    }

    function removeBoard(id) {
        for (i = 0; i < state.boards.length; i++) {
            if (state.boards[i].id == id) {
                //usuwamy wszystkie kolumny z tej tablicy
                removeColumnsFromBoard(id);
                //usuwamy tablicę z tablicy tablic XDDDDDD
                state.boards.splice(i, 1);
                //usuwamy id tablicy z listy zajętych id
                let index = state.ids.indexOf(state.boards[i]);
                state.ids.splice(index, 1);
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

    function loadData() {

        let state = getDatabase('state');

        for (let board of state.boards) {
            addBoard(board);
        }

        for (let column of state.columns) {
            addColumn(column);
        }
        return state;
    }

    function updateDatabase(state) {
        localStorage.setItem('state', JSON.stringify(state));
    }

    function getDatabase(key) {
        let state = localStorage.getItem(key);
        return JSON.parse(state) || initialState;
    }

    
    function changeCardOwner(cardId, columnId) {

    }
    
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
        //changeCardOwner(cardId, columnId); //to trzeba napisać
        
    }

    

})();