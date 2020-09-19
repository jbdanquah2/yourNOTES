// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function (registration) {
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

title.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveNotes()
        }
});

editor.addEventListener('keypress', function (e) {
    
        if (e.key === 'Enter') {
            saveNotes();       
    }
});

submit.addEventListener('click', saveNotes);

async function saveNotes (e) {
    if (!title.value) throw alert('Please enter title');
    else if (!editor.value ) throw alert('Please enter notes first');
    const date =  new Date().toLocaleString();
    console.log('dsat:', date);
    const st = { 
        date: date,
        title: title.value,
        editor: editor.value
     }  
     data.push(st);
     await localStorage.setItem("noteObj", JSON.stringify(data));
     title.value = '';
     editor.value ='';
     displayNotes(data);
     console.log('st: ',st);  
 }

 async function displayNotes (data){
   data = data.sort(compareValues('date', 'desc'));

    const noteItem = data.map(setNotes);
    notesArea.innerHTML = noteItem;    
}

const setNotes = note => {
    const output = `
            <div class="col-lg-3 col-sm-12">
                <div class="notes shadow">
                    <h4 aria-label="topic">${note.title}</h4>
                    <p aria-label="notes">${ note.editor}
                    </p>
                </div>
            </div>
    `
    return output;
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