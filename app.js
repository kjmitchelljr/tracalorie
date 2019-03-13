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
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 120 },
      // {id: 2, name: 'Eggs', calories: 300 }
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
    getItemById: function (id) {
      let found = null;
      state.items.forEach(item => {
        if(item.id === id) {
          found = item;
        }
      });

      return found;
    },
    setCurrentItem: function(item) {
      state.currentItem = item;
    },
    getCurrentItem: function() {
      return state.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      state.items.forEach(item => total += item.calories);
      // Set total
      state.totalCalories = total;

      return state.totalCalories;
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
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      // Insert
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

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
        // Add Item
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        // Add Item to UI List
        UICtrl.addListItem(newItem);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear Inputs
        UICtrl.clearInput();

      }
      e.preventDefault();
    });

    // Update item submit
    document.querySelector(UISelectors.itemList).addEventListener('click', (e) => {
      if(e.target.classList.contains('edit-item')) {
        // Get list item id (item-id)
        const listId = e.target.parentNode.parentNode.id;

        // Break it into an array
        const listIdArray = listId.split('-');

        // Get ID
        const id = parseInt(listIdArray[1]);

        // Get Item
        const itemToEdit = ItemCtrl.getItemById(id);

        // Set Current Item
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add Item to form
        UICtrl.addItemToForm();
      }
      e.preventDefault();
    });
  }

  // Public Methods
  return {
    init: function() {
      // Clear edit state / set intial state
      UICtrl.clearEditState();

      // Fetch Items from state
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list w/ items
        UICtrl.populateItemList(items);
      }
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Load Event Listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

// Initialize App
App.init();
