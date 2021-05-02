/* Firebase --------------------------------------------------------------------*/
const firebaseConfig = {
    apiKey: "AIzaSyAL0H8SCFiMnpy8VSDw1noEvCWzabAvq-k",
    authDomain: "top-library-bc6f3.firebaseapp.com",
    databaseURL: "https://top-library-bc6f3-default-rtdb.firebaseio.com",
    projectId: "top-library-bc6f3",
    storageBucket: "top-library-bc6f3.appspot.com",
    messagingSenderId: "1033820394153",
    appId: "1:1033820394153:web:cd3dcd82ffa5eec7b94fb8"
};

firebase.initializeApp(firebaseConfig);
const books = firebase.database().ref('books');
/*------------------------------------------------------------------------------*/

const newBookButton = document.querySelector('#new-book-button');
const newBookDialog = document.querySelector('#new-book-dialog');
const newBookDialogForm = document.querySelector('#new-book-dialog__form');
const newBookDialogTitleInput = document.querySelector('#new-book-dialog__title-input');
const newBookDialogAuthorInput = document.querySelector('#new-book-dialog__author-input');
const newBookDialogPagesInput = document.querySelector('#new-book-dialog__pages-input');
const newBookDialogReadInput = document.querySelector('#new-book-dialog__read-input');
const newBookDialogCancelButton = document.querySelector('#new-book-dialog__cancel-button');

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

newBookButton.addEventListener('click', () => {
    newBookDialogTitleInput.value = '';
    newBookDialogAuthorInput.value = '';
    newBookDialogPagesInput.value = '???';
    newBookDialogReadInput.checked = false;
    newBookDialog.style.display = 'block';
});

newBookDialogForm.addEventListener('submit', () => {
    const book = new Book(
        newBookDialogTitleInput.value,
        newBookDialogAuthorInput.value,
        newBookDialogPagesInput.value,
        newBookDialogReadInput.checked
    );
    const bookRef = books.push(); // CREATE database item with generated key
    bookRef.set(book);  // WRITE object in database item
    newBookDialog.style.display = 'none';
});

newBookDialogCancelButton.addEventListener('click', e => {
    e.preventDefault();
    newBookDialog.style.display = 'none';
});

function displayBook(item) {
    const book = item.val();
    const key = item.key;
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
            <h2>${book.title}</h2>
            <table>
                <tr>
                    <th>Author:</th>
                    <td>${book.author}</td>
                </tr>
                <tr>
                    <th>Pages:</th>
                    <td>${book.pages}</td>
                </tr>
            </table>
            <div>
                <span>Read:</span>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider"></span>
                </label>
                <button>DELETE</button>
            </div>`;
    const checkbox = card.querySelector('input');
    if (book.read == true) {
        card.classList.add('read');
        checkbox.checked = true;
    }
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            books.child(key).update({ read: true }); // UPDATE database item
        } else {
            books.child(key).update({ read: false });
        }
    });
    card.querySelector('button').addEventListener('click', () => deleteBookDialog(book.title, key));
    document.body.appendChild(card);
}

function deleteBookDialog(title, key) {
    const dialog = document.createElement('div');
    dialog.classList.add('dialog');
    dialog.innerHTML = `
        <div class="delete-book-dialog__grid">
            <p class="delete-book-dialog__msg">Delete ${title}?</p>
            <button class="delete-book-dialog__yes-button dialog-button">Yes</button>
            <button class="delete-book-dialog__no-button dialog-button">No</button>
        </div>`;
    dialog.querySelector('.delete-book-dialog__yes-button').addEventListener('click', () => {
        books.child(key).remove(); // DELETE database item
        document.body.removeChild(dialog);
    });
    dialog.querySelector('.delete-book-dialog__no-button').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
    dialog.style.display = 'block';
    document.body.appendChild(dialog);
}

/* READ database
   eventListener called every time a database value change */
books.on('value', snapshot => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => document.body.removeChild(card));
    snapshot.forEach(displayBook);
});