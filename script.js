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
const caption = document.querySelector('#title');
const editor = document.querySelector('#editor');
const submit = document.querySelector('#submit');


let data = [];
window.onload = () => {
  data = localStorage.getItem('noteObj') ? JSON.parse(localStorage.getItem('noteObj')) : [];
  editor.value = '';
  if (data.length === 0) return 0;
  displayNotes(data); 
}

submit.addEventListener('click', saveNotes);

//function to save notes to local storage//
async function saveNotes(e) {
  if (!caption.value) throw alert('Please enter caption');
  else if (!editor.value) throw alert('Please enter notes first');
  else {
    const date = new Date().toLocaleString();
    console.log('dsat:', date);
    const notes = {
      date: date,
      title: caption.value,
      editor: editor.value
    }
    data.push(notes);
    await localStorage.setItem("noteObj", JSON.stringify(data));
    caption.value = '';
    editor.value = '';
    displayNotes(data);
    console.log('st: ', notes);
  }
}

//function to displat saved notes from local storage
async function displayNotes(data) {
  data = await data.sort(compareValues('date', 'desc'));

  const noteItem = data.map(setNotes);
  notesArea.innerHTML = noteItem;
}

//callback function for the map on the stored data array of objects
const setNotes = (note, index) => {
  const output = 
    `<div onclick="showing(this)" tabindex="0" id="detail_${index}" class="notes clearfix">
        <small><p class="mb-0 pl-0 pb-0 text-danger text-left">${note.date}
        <span  id="edit_${index}" onclick="editNote(this)" tabindex="0" class="float-right pt-0 pl-1 pr-1">edit</span>
        <span id="close_${index}" onclick="closing(this)" tabindex="0" class="float-right pt-0 pl-1 pr-1">close</span>
        </p></small>
        <h5 class="text-left" aria-label="topic">${note.title.toUpperCase()}</h5>
        <p class="detail detail_${index}" aria-label="notes">${note.editor}</p>
    </div>`;
  return output;
}

//function to edit the saved notes
const editNote = (e) => {
  const editId = e.id.substring(e.id.lastIndexOf('_') + 1);
  const note = data[editId];
  caption.value = note.title;
  editor.value = note.editor;
  const id = 'detail_'+editId;
  console.log(id);
  closing(e);

}

//function to display the hidden body of the saved notes
const showing = (e) => {
  const detail_id = '.' + e.id;
  const spanId = e.id.substring(e.id.lastIndexOf('_') + 1);
  const detail = document.querySelector(detail_id);

  console.log('mains: ', spanId);
  if (detail.classList.contains("detail")) {
    detail.classList.remove("detail");
    // console.log(e.id.substring(e.id.lastIndexOf('_')+1));
  } else {
    detail.classList.add("detail");
  }
}

//close a save note by removing from the locally stored object
const closing = (e) => {
  console.log('eyooo: ', e.id);
  const closeId = e.id.substring(e.id.lastIndexOf('_') + 1);
  data.splice(closeId, 1);
  displayNotes(data);
  localStorage.setItem("noteObj", JSON.stringify(data));
  console.log(data);
}

//function to check if an object is not empty
const checkObj = (obj) => {
  for (var i in obj) return true;
  return false;
}

//function to reoder the objects in an array
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


// console
//   let  detail_id ;
//   if (e.substring(1, e.lastIndexOf('_')) === 'd') detail_id = '.'+e;
//   else detail_id = '.' + e.id;