// Storage Controller
const StorageCtrl = (function () {
	// Public Methods
	return {
		storeItem: function (item) {
			let items;
			// Check if any items in LS
			if (localStorage.getItem('items') === null) {
				items = [];
				//Push new item
				items.push(item);
				// Set LS
				localStorage.setItem('items', JSON.stringify(items));
			} else {
				// Retrieve items from LS
				items = JSON.parse(localStorage.getItem('items'));

				// Push new item
				items.push(item);

				// Reset LS
				localStorage.setItem('items', JSON.stringify(items));
			}
		},
		getItemsFromLS: function () {
			let items;
			if (localStorage.getItem('items') === null) {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem('items'));
			}

			return items;
		},
		updateItemFromLS: function (updatedItem) {
			let items = JSON.parse(localStorage.getItem('items'));

			items.forEach((item, index) => {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});
			// Set LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		deleteItemFromLS: function (id) {
			let items = JSON.parse(localStorage.getItem('items'));

			items = items.filter(item => id !== item.id);

			// Set LS
			localStorage.setItem('items', JSON.stringify(items));
		},
		clearItemsFromLS: function () {
			localStorage.removeItem('items');
		}
	}
})();

// Item Controller
const ItemCtrl = (function () {
	// Item Constructor
	const Item = function (id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	}

	// Data Structure (State)
	const state = {
		items: StorageCtrl.getItemsFromLS(),
		currentItem: null,
		totalCalories: 0
	}

	// Public Methods
	return {
		getItems: function () {
			return state.items;
		},
		addItem: function (name, calories) {
			// Create ID
			let id;
			if (state.items.length > 0) {
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
				if (item.id === id) {
					found = item;
				}
			});

			return found;
		},
		updateItem: function (name, calories) {
			// Calories to number
			let found = null;

			state.items.forEach(item => {
				if (item.id === state.currentItem.id) {
					item.name = name;
					item.calories = parseInt(calories);
					found = item;
				}
			});

			return found;
		},
		deleteItem: function (id) {
			// Get ids
			const ids = state.items.map(item => item.id);

			// Get index
			const index = ids.indexOf(id);

			// Remove Item
			state.items.splice(index, 1);
		},
		clearAllItems: function () {
			state.items = [];
		},
		setCurrentItem: function (item) {
			state.currentItem = item;
		},
		getCurrentItem: function () {
			return state.currentItem;
		},
		getTotalCalories: function () {
			let total = 0;
			state.items.forEach(item => total += item.calories);
			// Set total
			state.totalCalories = total;

			return state.totalCalories;
		},
		logState: function () {
			return state;
		}
	}
})();

// UI Controller
const UICtrl = (function () {

	const UISelectors = {
		itemList: '#item-list',
		listItems: '#item-list li',
		addBtn: '.add-btn',
		updateBtn: '.update-btn',
		clearBtn: '.clear-btn',
		deleteBtn: '.delete-btn',
		backBtn: '.back-btn',
		itemNameInput: '#item-name',
		itemCaloriesInput: '#item-calories',
		totalCalories: '.total-calories'
	}

	// Public Methods
	return {
		populateItemList: function (items) {
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
		getItemInput: function () {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput).value
			}
		},
		addListItem: function (item) {
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
		updateListItem: function (item) {
			document.querySelector(`#item-${item.id}`).innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
		},
		deleteListItem: function (id) {
			document.querySelector(`#item-${id}`).remove();
		},
		clearInput: function () {
			document.querySelector(UISelectors.itemNameInput).value = '';
			document.querySelector(UISelectors.itemCaloriesInput).value = '';
		},
		addItemToForm: function () {
			document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
			document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
			UICtrl.showEditState();
		},
		removeItems: function () {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// Turn Node list into arra
			listItems = [...listItems];
			listItems.forEach(item => {
				item.remove();
			});
		},
		hideList: function () {
			document.querySelector(UISelectors.itemList).style.display = 'none';
		},
		showTotalCalories: function (totalCalories) {
			document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
		},
		clearEditState: function () {
			UICtrl.clearInput();
			document.querySelector(UISelectors.updateBtn).style.display = 'none';
			document.querySelector(UISelectors.deleteBtn).style.display = 'none';
			document.querySelector(UISelectors.backBtn).style.display = 'none';
			document.querySelector(UISelectors.addBtn).style.display = 'inline';
		},
		showEditState: function () {
			document.querySelector(UISelectors.updateBtn).style.display = 'inline';
			document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
			document.querySelector(UISelectors.backBtn).style.display = 'inline';
			document.querySelector(UISelectors.addBtn).style.display = 'none';
		},
		getSelectors: function () {
			return UISelectors;
		}
	}
})();


// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
	// Load Event Listeners
	const loadEventListeners = function () {
		// GET UI Selectors
		const UISelectors = UICtrl.getSelectors();

		// Add Item
		document.querySelector(UISelectors.addBtn).addEventListener('click', (e) => {
			// Add Item on Submit
			const input = UICtrl.getItemInput();
			// Check for name and calories
			if (input.name && input.calories) {
				// Add Item
				const newItem = ItemCtrl.addItem(input.name, input.calories);

				// Add Item to UI List
				UICtrl.addListItem(newItem);

				// Get Total Calories
				const totalCalories = ItemCtrl.getTotalCalories();

				// Add total calories to UI
				UICtrl.showTotalCalories(totalCalories);

				// Store in localStorage
				StorageCtrl.storeItem(newItem);

				// Clear Inputs
				UICtrl.clearInput();

			}
			e.preventDefault();
		});

		// Disable submit on enter
		document.addEventListener('keypress', (e) => {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
				return false;
			}
		});

		// Click edit item
		document.querySelector(UISelectors.itemList).addEventListener('click', (e) => {
			if (e.target.classList.contains('edit-item')) {
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

		// Update Item event
		document.querySelector(UISelectors.updateBtn).addEventListener('click', (e) => {
			// Get Item input
			const input = UICtrl.getItemInput();

			// Update item
			const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

			// Update UI
			UICtrl.updateListItem(updatedItem);

			// Get Total Calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to UI
			UICtrl.showTotalCalories(totalCalories);

			// Update local storage
			StorageCtrl.updateItemFromLS(updatedItem);

			UICtrl.clearEditState();

			e.preventDefault();
		});

		// Delete item event
		document.querySelector(UISelectors.deleteBtn).addEventListener('click', (e) => {
			// Get current item
			const currentItem = ItemCtrl.getCurrentItem();

			// Delete from data structure
			ItemCtrl.deleteItem(currentItem.id);

			// Delete from the UI
			UICtrl.deleteListItem(currentItem.id);

			// Get Total Calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to UI
			UICtrl.showTotalCalories(totalCalories);

			// Delete from LS
			StorageCtrl.deleteItemFromLS(currentItem.id);

			UICtrl.clearEditState();

			e.preventDefault();
		});


		// Clear item event
		document.querySelector(UISelectors.clearBtn).addEventListener('click', (e) => {
			// Delete all items from state
			ItemCtrl.clearAllItems();

			// Get Total Calories
			const totalCalories = ItemCtrl.getTotalCalories();

			// Add total calories to UI
			UICtrl.showTotalCalories(totalCalories);

			// Remove from UI
			UICtrl.removeItems();

			// Clear from LS
			StorageCtrl.clearItemsFromLS();

			// Hide UL
			UICtrl.hideList();

			e.preventDefault();
		});

		// Back button event
		document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
	}

	// Public Methods
	return {
		init: function () {
			// Clear edit state / set intial state
			UICtrl.clearEditState();

			// Fetch Items from state
			const items = ItemCtrl.getItems();

			// Check if any items
			if (items.length === 0) {
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
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();
