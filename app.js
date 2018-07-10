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
        logData: function(){
            return data;
        }
    }
})();

const UICtrl = (function(){

})();

const App = (function(ItemCtrl, UICtrl){
    
    return{
        init: function(){
            console.log("Init");
        }
    }
})(ItemCtrl, UICtrl);

App.init();
