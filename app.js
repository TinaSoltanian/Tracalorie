const StorageCtrl = (function(){

})();

const ItemCtrl = (function(){

    const item = function(id, name,  calorie){
        this.id = id;
        this.name = name;
        this.calorie = calorie;
    }

    const data ={
        items: [
            {id: 0, name: 'Salad', calorie: '350'},
            {id: 1, name: 'Sandwich', calorie: '700'},
            {id: 2, name: 'Eggs', calorie: '800'},
        ],
        currentItem: null,
        total: 0
    }

    return {
        getItems: function(){
            return data.items;
        },
        logData: function(){
            return data;
        }
    }
})();

const UICtrl = (function(){
    const itemList = "item-list";

    return{
        populateItems: function(items){
            let html = '';
            items.forEach(item => {
                
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calorie} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;

            });

            document.getElementById(itemList).innerHTML = html;
        }
    }
})();

const App = (function(ItemCtrl, UICtrl){
    
    return{
        init: function(){
            const items = ItemCtrl.getItems();
            UICtrl.populateItems(items);
        }
    }
})(ItemCtrl, UICtrl);

App.init();
