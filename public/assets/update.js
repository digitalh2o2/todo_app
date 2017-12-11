console.log("hello");

let title = document.querySelector('#title');
let info = document.querySelector('#info');
let button = document.querySelector(".updateTodo");

info.addEventListener('keyup', (e) => {
  info = e.target.value;
});

title.addEventListener('keyup', (e) => {
  title = e.target.innerHTML;
});

button.addEventListener('click', (e) => {
  getPromise(e);
});

function getPromise(e){
  var id = e.target.id;

  let data = {
    title: title,
    todoinfo: info
  }

  var myHeaders = new Headers({
    'Content-Type': 'application/json'
  });

  let request = new Request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: myHeaders
  });

  fetch(request)
    .then((res) => {
      window.location.replace('/todos')
    })
    .catch((e) => {
      console.log(e)
    })
};

document.addEventListener("DOMContentLoaded", function(event) {
  info = info.textContent;
  title = title.textContent;
});
