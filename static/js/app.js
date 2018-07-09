(function() {

    const columnContainer = document.getElementById("column-container");
    const addColumnButton = document.getElementById("add-column");
    const modal = document.getElementById("modal");
    const form = document.getElementById("modal-form");
    const cardModal = document.getElementById("card-modal");
    const cardForm = document.getElementById("card-form");
    

    let columns = [];
    let cards = [];

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
    }

    function cloneElement(id) {
        let template = document.getElementById(id);
        let element = template.cloneNode(true);
        element.removeAttribute("id");
        return element;
    }

    function addCard(name, description, columnName) {
        let cardNode = cloneElement("card-template");
        let cardName = cardNode.querySelector(".card-name");
        let cardDescription = cardNode.querySelector(".card-description");

        cardName.innerText = name;
        cardDescription.innerText = description;

        let card = {
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

    cardForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        let name = event.target.elements["card-name"].value;
        let description = event.target.elements["card-description"].value;
        let columnName = event.target.elements["column-name"].value;
        addCard(name, description, columnName);
        cardModal.style.display = "none";
    });

    function addColumn(columnName) {
        
        let columnNode = cloneElement("column-template");

        let columnHeader = columnNode.querySelector(".column-header");
        columnHeader.innerText = columnName;
        
        let cardContainer = columnNode.querySelector(".card-container");

        let addCardButton = columnNode.getElementsByClassName("add-card")[0];

        addCardButton.addEventListener("click", ()=>{

            showCardModal(columnName);

        });
        let column = {
            name: columnName,
            el: columnNode,
            cardContainer: cardContainer
        };

        columnContainer.appendChild(columnNode);
        return column;
    }


    
})();