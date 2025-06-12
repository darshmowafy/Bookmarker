document.addEventListener('DOMContentLoaded', () => {
    const bookmarkForm = document.getElementById('bookmarkForm');
    const siteNameInput = document.getElementById('siteName');
    const siteURLInput = document.getElementById('siteURL');
    const bookmarksList = document.getElementById('bookmarksList');
    const siteNameValidationIcon = document.getElementById('siteNameValidation');
    const siteURLValidationIcon = document.getElementById('siteURLValidation');

    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    let currentIndex = bookmarks.length > 0 ? Math.max(...bookmarks.map(b => b.id)) + 1 : 1;

    function saveBookmarks() {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function displayBookmarks() {
        bookmarksList.innerHTML = '';
        if (bookmarks.length === 0) {
            bookmarksList.innerHTML = `<tr><td colspan="4">No bookmarks added yet.</td></tr>`;
            return;
        }

        bookmarks.forEach((bookmark, index) => {
            const row = bookmarksList.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = bookmark.name;
            const visitCell = row.insertCell();
            const visitLink = document.createElement('a');
            visitLink.href = bookmark.url;
            visitLink.target = '_blank';
            visitLink.className = 'btn btn-visit';
            visitLink.textContent = 'Visit';
            visitCell.appendChild(visitLink);

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-delete';
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteBookmark(bookmark.id);
            deleteCell.appendChild(deleteButton);
        });
    }

    function addBookmark(name, url) {
        const newBookmark = {
            id: currentIndex++,
            name: name,
            url: url
        };
        bookmarks.push(newBookmark);
        saveBookmarks();
        displayBookmarks();
    }

    function deleteBookmark(id) {
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        saveBookmarks();
        displayBookmarks();
    }

    function isValidSiteName(name) {
        return name.trim().length > 0;
    }

    function isValidURL(url) {
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(url);
    }

    function validateInput(inputElement, validationIconElement, validatorFn) {
        const value = inputElement.value;
        const isValid = validatorFn(value);
        inputElement.classList.remove('is-valid', 'is-invalid');
        validationIconElement.innerHTML = ''; 

        if (isValid) {
            inputElement.classList.add('is-valid');
            validationIconElement.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else {
            inputElement.classList.add('is-invalid');
            if (value.trim().length > 0) { 
                validationIconElement.innerHTML = '<i class="fas fa-times-circle"></i>';
            }
        }
    }


    bookmarkForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const siteName = siteNameInput.value.trim();
        let siteURL = siteURLInput.value.trim();

        const isNameValid = isValidSiteName(siteName);
        const isURLValid = isValidURL(siteURL);

        validateInput(siteNameInput, siteNameValidationIcon, isValidSiteName);
        validateInput(siteURLInput, siteURLValidationIcon, isValidURL);

        if (isNameValid && isURLValid) {
            if (!siteURL.startsWith('http://') && !siteURL.startsWith('https://')) {
                siteURL = 'https://' + siteURL;
            }
            addBookmark(siteName, siteURL);
            bookmarkForm.reset(); 
            siteNameInput.classList.remove('is-valid', 'is-invalid');
            siteURLInput.classList.remove('is-valid', 'is-invalid');
            siteNameValidationIcon.innerHTML = '';
            siteURLValidationIcon.innerHTML = '';
        }
    });

    siteNameInput.addEventListener('input', () => {
        validateInput(siteNameInput, siteNameValidationIcon, isValidSiteName);
    });

    siteURLInput.addEventListener('input', () => {
        validateInput(siteURLInput, siteURLValidationIcon, isValidURL);
    });
    displayBookmarks();
});