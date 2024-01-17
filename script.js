var email = JSON.parse(localStorage.getItem('authentication')) || '';
const users = JSON.parse(localStorage.getItem('users')) || [];

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveAuthentication(inputEmail) {
    email = inputEmail;
    localStorage.setItem('authentication', JSON.stringify(email));
}

function deleteAuthentication(){
    localStorage.removeItem('authentication');
}

function createUser(inputEmail) {
    const newUser = {
        email: inputEmail,
        accesses: 0,
        lastAccess: new Date().toLocaleString(),
        previousAccess: null
    }
    users.push(newUser);
    saveUsers();
}

function login(inputEmail) {
    let user = users.find((element) => element.email == inputEmail);
    if(!!user){
        //se lo user esiste già
        saveAuthentication(inputEmail);
        user.accesses += 1;
        user.previousAccess = user.lastAccess;
        user.lastAccess = new Date().toLocaleString();
        saveUsers();
        console.log('Bentornato');
    } else {
        //se lo user ancora non esiste
        createUser(inputEmail);
        saveAuthentication(inputEmail);
        user = users.find((element) => element.email == inputEmail);
        user.accesses += 1;
        user.lastAccess = new Date().toLocaleString();
        saveUsers();
        console.log('Benvenuto');
    }
}

function logout() {
    deleteAuthentication();
}

function logoutPageDOM() {
    let root = document.getElementById('root');
    let header = document.getElementById('header');
    let user = users.find((element) => element.email == email);
    if(user.accesses == 1) {
        //Primo accesso
        root.innerHTML = `
        <h1>Benvenut* ${email}</h1>
        <input type="submit" value="logout" id="submitLogout">`
    } else {
        header.innerHTML = `
        <h2 id="accesses">${user.accesses}</h2>
        <h3 id="previousAccess">Ultimo accesso rilevato: ${user.previousAccess}</h3>`;
        root.innerHTML = `
        <h1>Bentornat* ${email}</h1>
        <input type="submit" value="Logout" id="submitLogout">`
    }
    document.getElementById('submitLogout').addEventListener('click', (event) => {
        saveUsers();
        event.preventDefault();
        logout();
        header.innerHTML = '';
        loginPageDOM();
    })
}

function loginPageDOM() {
    let root = document.getElementById('root');
    root.innerHTML = `
    <form>
        <label for="email" id="labelEmail"></label>
        <input type="email" name="email" id="inputEmail" required>
        <input type="submit" value="Login" id="submitLogin">
    </form>`;
    document.getElementById('submitLogin').addEventListener('click', (event) => {
        event.preventDefault();
        let inputEmail = document.getElementById('inputEmail').value;
        login(inputEmail);
        logoutPageDOM();
    });
}

window.onload = () => {
    if(!!email){
        logoutPageDOM();
    } else {
        loginPageDOM();
    }
}