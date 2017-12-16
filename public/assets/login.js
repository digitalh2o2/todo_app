console.log('hi')
let email = document.querySelector('.email');
let password = document.querySelector('.password');
const login = document.querySelector('.loginButton');

email.addEventListener('keyup', (e) => {
  email = e.target.value
})

password.addEventListener('keyup', (e) => {
  password = e.target.value
})

login.addEventListener('click', (e) => {
  getLogin(e);
})


function getLogin(e){
  let data = {
    email: email,
    password: password
  }

  var myHeaders = new Headers({
    'Content-Type': 'application/json',
    'auth': 'cookie'
  });

  let request = new Request(`/users/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: myHeaders
  });

  fetch(request)
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e)
    })
};

// document.addEventListener("DOMContentLoaded", function(event) {
//   email = email.textContent;
//   password = password.textContent;
//
//   login.addEventListener('click', () => {
//     console.log(email)
//     console.log(password.textContent);
//   })
// });
