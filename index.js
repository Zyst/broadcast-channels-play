const GET_DATA = 'Give me the current list';
const GIVING_DATA = 'Sending you the current list';
const ADDING_ITEM = 'Adding an item to the list';

const channel = new BroadcastChannel('List');
let updateOwnList = () => {};

(() => {
  let list = [];

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

  updateOwnList = value => {
    list.push(value);
  };

  channel.onmessage = event => {
    console.log(event);

    switch (event.data.message) {
      case GIVING_DATA: {
        list = event.data.list;

        return updateList(list);
      }

      case GET_DATA: {
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

  channel.postMessage({
    message: GET_DATA
  });
})();

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
