// Storage Controller

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure (State)
  const state = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookie', calories: 120 },
      {id: 2, name: 'Eggs', calories: 300 }

    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function() {
      return state.items;
    },
    addItem: function(name, calories) {
      // Create ID
      let id;
      if(state.items.length > 0) {
        id = state.items[state.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      
      calories = parseInt(calories);

      // Create new Item
      const newItem = new Item(id, name, calories);
      state.items.push(newItem)

      return newItem;

    },
    logState: function() {
      return state;
    }
  }
})();

// UI Controller
const UICtrl = (function() {

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
  }

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
			  </li>`;
      });

      // Insert List Items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();


// App Controller
const App = (function(ItemCtrl, UICtrl) {
  // Load Event Listeners
  const loadEventListeners = function() {
    // GET UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item
    document.querySelector(UISelectors.addBtn).addEventListener('click', (e) => {
      // Add Item on Submit
      const input = UICtrl.getItemInput();
      // Check for name and calories
      if(input.name && input.calories){
        const newItem = ItemCtrl.addItem(input.name, input.calories);
      }
      e.preventDefault();
    });
  }

  // Public Methods
  return {
    init: function() {
      // Fetch Items from state
      const items = ItemCtrl.getItems();

      // Populate list w/ items
      UICtrl.populateItemList(items);

      // Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
