const StorageCtrl = (function() {})();

const ItemCtrl = (function() {
  const item = function(id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };

  const data = {
    items: [
      { id: 0, name: "Salad", calorie: "350" },
      { id: 1, name: "Sandwich", calorie: "700" },
      { id: 2, name: "Eggs", calorie: "800" }
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
    logData: function() {
      return data;
    }
  };
})();

const UICtrl = (function() {
  const UISelector = {
    itemList: "item-list",
    addBtn: ".add-btn",
    inputName: "#item-name",
    inputCalorie: "#item-calories"
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

      document.getElementById(UISelector.itemList).innerHTML = html;
    },
    getItemInputs: function() {
      return {
        name: document.querySelector(UISelector.inputName).value,
        calorie: document.querySelector(UISelector.inputCalorie).value
      };
    },
    clearItemInputs(){
        document.querySelector(UISelector.inputName).value = "";
        document.querySelector(UISelector.inputCalorie).value = "";
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
      .querySelector(uiSelector.addBtn)
      .addEventListener("click", addItemClick);
  };

  function addItemClick(e) {
    const inputs = UICtrl.getItemInputs();

    if (inputs.name !== "" && inputs.calorie !== "") {
      ItemCtrl.addItem(inputs.name, inputs.calorie);
    }

    console.log(ItemCtrl.getItems());
    UICtrl.clearItemInputs();

    e.preventDefault();
  }

  return {
    init: function() {
      const items = ItemCtrl.getItems();
      UICtrl.populateItems(items);

      loadEvents();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
