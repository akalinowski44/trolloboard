(function() {

    const columnContainer = document.getElementById("column-container");
    const addColumnButton = document.getElementById("add-column");
    const columnmodal = document.getElementById("modal");
    const form = document.getElementById("modal-form");
    const cardModal = document.getElementById("card-modal");
    const cardForm = document.getElementById("card-form");
    

    let columns = [];
    let cards = [];
    let ids = [0];


    function cloneElement(id) {
        let template = document.getElementById(id);
        let element = template.cloneNode(true);
        element.removeAttribute("id");
        return element;
    }

    function addColumn(columnName) {
        
        let columnNode = cloneElement("column-template");

        let columnHeader = columnNode.querySelector(".column-header");
        columnHeader.innerText = columnName;
        
        let cardContainer = columnNode.querySelector(".card-container");

        let addCardButton = columnNode.getElementsByClassName("add-card")[0];

        addCardButton.addEventListener("click", ()=>{

        showCardModal(columnName);

        });

        let id = generateId();
        columnNode.setAttribute("id", id);

        let button = columnNode.getElementsByClassName("remove-column")[0];
        button.setAttribute("data-id", id)

        let column = {
            id: id,
            name: columnName,
            el: columnNode,
            cardContainer: cardContainer
        };

        columnContainer.appendChild(columnNode);
        return column;
    }


    form.addEventListener("submit", (event)=>{
        event.preventDefault();
        let columnName = event.target.elements["modal-text"];
        columns.push(addColumn(columnName.value));
        columnName.value = "";

        modal.style.display = "none";
        
    });

    function showCardModal(columnName){
        cardModal.style.display = "block";
        cardForm.elements["column-name"].value = columnName;

        const inputName = document.getElementById("card-name");
        inputName.focus();
    }    

    cardForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        let name = event.target.elements["card-name"].value;
        let description = event.target.elements["card-description"].value;
        let columnName = event.target.elements["column-name"].value;
        addCard(name, description, columnName);
        cardModal.style.display = "none";
    });

    function addCard(name, description, columnName) {
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
            columnName: null,
            el: cardNode
        }

        addCardToColumn(card, columnName);
        cards.push(card);   
    }

    function addCardToColumn(card, columnName){
        if (card.columnName) {
            //remove from column
        } else {
            card.columnName = columnName;

            for (let column of columns) {
                if (column.name === columnName) {
                    column.cardContainer.appendChild(card.el);
                }
            }
        }
    }

    function removeCard(id) {
        for (i = 0; i < cards.length; i++) {
            if (cards[i].id == id) {
                cards.splice(i, 1);
                let index = ids.indexOf(cards[i]);
                ids.splice(index, 1);


                let rmv = document.getElementById(id);
                parent = rmv.parentNode;
                parent.removeChild(rmv);
                return 0;
            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-card')) {
            console.log("remove-ok", event.target.dataset.id);
            removeCard(event.target.dataset.id);
        }
    });

    function removeColumn(id) {
        for (i = 0; i < columns.length; i++) {
            if (columns[i].id == id) {
                columnName = columns[i].name;

                columns.splice(i, 1);
                let index = ids.indexOf(columns[i]);
                ids.splice(index, 1);
                let col = document.getElementById(id);
                parent = col.parentNode;
                parent.removeChild(col);
                
            }
        }
        for (i = 0; i < cards.length; i++) {
            console.log(columnName, cards[i].columnName);
            if (cards[i].columnName === columnName) {
                cards.splice(i, 1);
            }
        }
    }

    window.addEventListener("click", (event)=>{
        if (event.target.classList.contains('remove-column')) {
            console.log("remove-ok", event.target.dataset.id);
            removeColumn(event.target.dataset.id);
        }
    });

    addColumnButton.addEventListener("click", ()=>{
        modal.style.display = "block";
        const inputTitle = document.getElementById("modal-text");
        inputTitle.focus();
    });
    

    window.addEventListener("click", (event)=>{
        if (event.target == modal) {
            modal.style.display = "none";
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
    
})();