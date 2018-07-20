const StorageCtrl = (function() {})();

const ItemCtrl = (function() {
  const item = function(id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };

  const data = {
    items: [
      // { id: 0, name: "Salad", calorie: "350" },
      // { id: 1, name: "Sandwich", calorie: "700" },
      // { id: 2, name: "Eggs", calorie: "800" }
    ],
    currentItem: null,
    total: 0
  };

  return {
    getItems: function() {
      return data.items;
    },
    addItem(name, calorie) {
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newItem = new item(ID, name, calorie);
      data.items.push(newItem);
      return newItem;
    },
    updateItem(name, calorie) {
      let updatedItem = null;
      data.items.forEach(item=>{
        if (item.id === data.currentItem.id){
           updatedItem = item;

          item.name = name;
          item.calorie =calorie;          
        }
      })

      return updatedItem;
    },    
    getCurrentItem(){
      return data.currentItem;
    },
    getTotalCalories() {
      let total = 0;

      data.items.forEach(item => {
        total += item.calorie;
      });

      data.total = total;
      return data.total;
    },
    getCurrentItemById: function(id) {
      let found = null;

      data.items.forEach(item => {
        if (item.id == id) {
          found = item;
        }
      });

      return found;
    },
    setCurrentItem(item) {
      data.currentItem = item;
    },
    logData: function() {
      return data;
    }
  };
})();

const UICtrl = (function() {
  const UISelector = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    inputName: "#item-name",
    inputCalorie: "#item-calories",
    totalCalories: ".total-calories"
  };

  return {
    populateItems: function(items) {
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${
          item.calorie
        } Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
      });

      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    getItemInputs: function() {
      return {
        name: document.querySelector(UISelector.inputName).value,
        calorie: parseInt(document.querySelector(UISelector.inputCalorie).value)
      };
    },
    clearInputState() {
      UICtrl.clearItemInputs();
      document.querySelector(UISelector.addBtn).style.display = "inline";
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
    },
    showInputState() {
      document.querySelector(UISelector.addBtn).style.display = "none";
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
    },
    clearItemInputs() {
      document.querySelector(UISelector.inputName).value = "";
      document.querySelector(UISelector.inputCalorie).value = "";
    },
    updateFormWithCurrentItem(){
      document.querySelector(UISelector.inputName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.inputCalorie).value = ItemCtrl.getCurrentItem().calorie;
    },
    addNewListItem(item) {
      document.querySelector(UISelector.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}: </strong> <em>${
        item.calorie
      } Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>`;

      document
        .querySelector(UISelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateItemList(item){
      const edited = document.getElementById(`item-`+item.id);

      if (edited!=null){
        edited.innerHTML = `<strong>${item.name}: </strong> <em>${
          item.calorie
        } Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`
      }
    },
    updateTotalCalories(calories) {
      document.querySelector(UISelector.totalCalories).textContent = calories;
    },
    hideList() {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    getSelector: function() {
      return UISelector;
    }
  };
})();

const App = (function(ItemCtrl, UICtrl) {
  const loadEvents = function() {
    const uiSelector = UICtrl.getSelector();

    document
      .querySelector(uiSelector.itemList)
      .addEventListener("click", editCurrentItem);

    document
      .querySelector(uiSelector.addBtn)
      .addEventListener("click", addItemClick);

      document
      .querySelector(uiSelector.backBtn)
      .addEventListener("click", backBtnClick);      

      document
      .querySelector(uiSelector.updateBtn)
      .addEventListener("click", updateCurrentItemClick);           
  };

  function editCurrentItem(e) {
    if (e.target.classList.contains("edit-item")) {
      // this retuns the whole id like item-0,item1
      const itemId = e.target.parentNode.parentNode.id;

      // break the itemId to get the actual id
      const id = itemId.split("-")[1];

      const item = ItemCtrl.getCurrentItemById(id);
      ItemCtrl.setCurrentItem(item);
      UICtrl.updateFormWithCurrentItem();
      UICtrl.showInputState();
    }

    e.preventDefault();
  }

  function backBtnClick(e){

    UICtrl.clearInputState();

    e.preventDefault();
  }

  function updateCurrentItemClick(e){

    const inputs = UICtrl.getItemInputs();    

    if (inputs.name !== "" && inputs.calorie !== "") {
      const item = ItemCtrl.updateItem(inputs.name, inputs.calorie);


      UICtrl.clearItemInputs();
      UICtrl.updateItemList(item);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);      
    }

    e.preventDefault();
  }

  function addItemClick(e) {
    const inputs = UICtrl.getItemInputs();

    if (inputs.name !== "" && inputs.calorie !== "") {
      const item = ItemCtrl.addItem(inputs.name, inputs.calorie);

      UICtrl.clearItemInputs();
      UICtrl.addNewListItem(item);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);
    }

    e.preventDefault();
  }

  return {
    init: function() {
      // clear all bttons
      UICtrl.clearInputState();

      const items = ItemCtrl.getItems();

      if (ItemCtrl.getItems().length == 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItems(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);
      loadEvents();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
