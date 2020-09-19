// register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// selected elements
const notesArea = document.querySelector('#notes-area');
const title = document.querySelector('#title');
const editor = document.querySelector('#editor');
const submit = document.querySelector('#submit');


let data = [];
window.onload = () => {
  data = localStorage.getItem('noteObj') ? JSON.parse(localStorage.getItem('noteObj')) : [];
  displayNotes(data);
}

submit.addEventListener('click', saveNotes);

async function saveNotes(e) {
  if (!title.value) throw alert('Please enter title');
  else if (!editor.value) throw alert('Please enter notes first');
  else {
    const date = new Date().toLocaleString();
    console.log('dsat:', date);
    const st = {
      date: date,
      title: title.value,
      editor: editor.value
    }
    data.push(st);
    await localStorage.setItem("noteObj", JSON.stringify(data));
    title.value = '';
    editor.value = '';
    displayNotes(data);
    console.log('st: ', st);
  }
}

async function displayNotes(data) {
  data = data.sort(compareValues('date', 'desc'));

  const noteItem = data.map(setNotes);
  notesArea.innerHTML = noteItem;
}

const setNotes = (note, index) => {
  const output = `
            
                <div onclick="showing(this)" tabindex="0" id="detail_${index}" class="notes">
                    <small><p class="mb-0 pl-0 pb-0 text-danger text-left">${note.date} <span id="${index}" onclick="closing(this)" tabindex="0" class="float-right pt-0 pl-1 pr-1">x</span></p></small>
                    <h5 class="text-left" aria-label="topic">${note.title.toUpperCase()}</h5>
                    <p class="detail detail_${index}" aria-label="notes">${note.editor}</p>
                </div>
            `;
  return output;
}

const showing = (e) => {
  const detail_id = '.'+e.id;
  const detail = document.querySelector(detail_id);
  console.log(detail);
  if (detail.classList.contains("detail") ) {
    detail.classList.remove("detail");
  }else {
    detail.classList.add("detail");
  }
}

const closing = (e) => {
  console.log('eyooo: ', e.id);
  data.splice(e.id, 1);
  displayNotes(data);
  // localStorage.removeItem("noteObj");
  localStorage.setItem("noteObj", JSON.stringify(data));
  console.log(data);
}

const checkObj = (obj) => {
  for (var i in obj) return true;
  return false;
}

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}