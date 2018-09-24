const GET_DATA = 'Give me the current list';
const GIVING_DATA = 'Sending you the current list';
const ADDING_ITEM = 'Adding an item to the list';

const channel = new BroadcastChannel('List');

// The list that holds the elements we render in HTML
let list = [];

// Takes a list, and updates the HTML
const updateList = list => {
  const createListString = list => {
    let result = '';

    list.forEach(entry => {
      result += `<li>${entry}</li>`;
    });

    return result;
  };

  const htmlList = document.getElementById('main');

  htmlList.innerHTML = createListString(list);
};

// Updates the list with a value, and updates the HTML
const updateOwnList = value => {
  list.push(value);

  return updateList(list);
};

channel.onmessage = event => {
  console.log(event);

  switch (event.data.message) {
    case GIVING_DATA: {
      // We assign the list to the incoming list
      list = event.data.list;

      return updateList(list);
    }

    case GET_DATA: {
      // When we get a GET_DATA request we post our list
      return channel.postMessage({
        message: GIVING_DATA,
        list
      });
    }

    case ADDING_ITEM: {
      return updateOwnList(event.data.entry);
    }
  }
};

// We request the existing data on load
channel.postMessage({
  message: GET_DATA
});

// Get the input data, update our lists, and reset input value
listSubmit = () => {
  const input = document.getElementById('list-input');

  channel.postMessage({
    message: ADDING_ITEM,
    entry: input.value
  });

  updateOwnList(input.value);

  input.value = '';

  return false;
};
