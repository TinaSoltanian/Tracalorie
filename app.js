const StorageCtrl = (function() {
  return {
    getAllItems: function(){
      let items = [];
      if (localStorage.getItem('items') !== null) {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },
    storeItem: function(item) {
      let items = [];

      if (localStorage.getItem("items") === null) {
        items.push(item);
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
      }
      localStorage.setItem("items", JSON.stringify(items));
    },

    editItem: function(item) {
      if (localStorage.getItem("items") !== null) {
        items = JSON.parse(localStorage.getItem("items"));        

        const index = items.findIndex(obj => obj.id == item.id);
        items[index].calorie = item.calorie;
        items[index].name = item.name;

        console.log(items, item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    deleteItem: function(item){
      if (localStorage.getItem("items") !== null) {
        items = JSON.parse(localStorage.getItem("items"));        

        const index = items.findIndex(obj => obj.id == item.id);
        items.splice(index,1);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    clearAll(){
      localStorage.removeItem('items');
    }
  };
})();

const ItemCtrl = (function(StorageCtrl) {
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

      data.items = StorageCtrl.getAllItems();
      return data.items;
    },
    addItem(name, calorie) {
      let ID = parseInt(0);
      if (data.items.length > 0) {
        ID = parseInt(data.items[data.items.length - 1].id) + parseInt(1);
      } else {
        ID = 0;
      }

      newItem = new item(ID, name, calorie);
      data.items.push(newItem);
      return newItem;
    },
    updateItem(name, calorie) {
      let updatedItem = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          updatedItem = item;

          item.name = name;
          item.calorie = calorie;
        }
      });

      return updatedItem;
    },
    deleteCurrentEditedItem() {
      const selectedItem = data.currentItem;

      const index = data.items.indexOf(selectedItem);
      data.items.splice(index, 1);

      data.currentItem = null;
      return selectedItem;
    },
    getCurrentItem() {
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
    clearAllItems() {
      data.items = [];
      data.totalCalories = 0;
      data.currentItem = null;
    },
    logData: function() {
      return data;
    }
  };
})(StorageCtrl);

const UICtrl = (function() {
  const UISelector = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    inputName: "#item-name",
    inputCalorie: "#item-calories",
    totalCalories: ".total-calories",
    clearBtn: ".clear-btn"
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
    updateFormWithCurrentItem() {
      document.querySelector(
        UISelector.inputName
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelector.inputCalorie
      ).value = ItemCtrl.getCurrentItem().calorie;
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
    updateItemList(item) {
      const edited = document.getElementById(`item-` + item.id);

      if (edited != null) {
        edited.innerHTML = `<strong>${item.name}: </strong> <em>${
          item.calorie
        } Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
      }
    },
    clearAllItems() {
      document.querySelector(UISelector.itemList).innerHTML = "";
      UICtrl.hideList();
      UICtrl.updateTotalCalories(0);
    },
    updateTotalCalories(calories) {
      document.querySelector(UISelector.totalCalories).textContent = calories;
    },
    removeDeleted(item) {
      const listItem = document.getElementById(`item-${item.id}`);
      document.querySelector(UISelector.itemList).removeChild(listItem);
    },
    hideList() {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    getSelector: function() {
      return UISelector;
    }
  };
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
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

    document
      .querySelector(uiSelector.deleteBtn)
      .addEventListener("click", deleteBtnClick);

    document
      .querySelector(uiSelector.clearBtn)
      .addEventListener("click", clearBtnClick);
  };

  const editCurrentItem = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // this retuns the whole id like item-0,item1
      const itemId = e.target.parentNode.parentNode.id;

      // break the itemId to get the actual id
      const id = itemId.split("-")[1];

      const item = ItemCtrl.getCurrentItemById(id);
      item.id = id;
      ItemCtrl.setCurrentItem(item);
      UICtrl.updateFormWithCurrentItem();
      UICtrl.showInputState();
    }

    e.preventDefault();
  };

  const clearBtnClick = function(e) {
    UICtrl.clearInputState();
    ItemCtrl.clearAllItems();
    UICtrl.clearAllItems();
    StorageCtrl.clearAll();
    e.preventDefault();
  };
  const deleteBtnClick = function(e) {
    const selectedItem = ItemCtrl.deleteCurrentEditedItem();

    UICtrl.removeDeleted(selectedItem);
    UICtrl.clearInputState();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    StorageCtrl.deleteItem(selectedItem);

    e.preventDefault();
  };

  const backBtnClick = function(e) {
    UICtrl.clearInputState();

    e.preventDefault();
  };

  const updateCurrentItemClick = function(e) {
    const inputs = UICtrl.getItemInputs();

    if (inputs.name !== "" && inputs.calorie !== "") {
      const item = ItemCtrl.updateItem(inputs.name, inputs.calorie);

      UICtrl.clearItemInputs();
      UICtrl.updateItemList(item);

      StorageCtrl.editItem(item);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);
    }

    e.preventDefault();
  };

  const addItemClick = function(e) {
    const inputs = UICtrl.getItemInputs();

    if (inputs.name !== "" && !isNaN(inputs.calorie)) {
      const item = ItemCtrl.addItem(inputs.name, inputs.calorie);

      UICtrl.clearItemInputs();
      UICtrl.addNewListItem(item);

      StorageCtrl.storeItem(item);

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);
    }

    e.preventDefault();
  };

  return {
    init: function() {
      // clear all bttons
      UICtrl.clearInputState();

      const items = ItemCtrl.getItems();

      if (items.length == 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItems(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.updateTotalCalories(totalCalories);
      loadEvents();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
