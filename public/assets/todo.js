console.log('hello')

var button = document.querySelector(".deleteTodo")

button.addEventListener('click', (e) => {

  let data = e.target.id;

  var myHeaders = new Headers({
    'Content-Type': 'application/json'
  });

  let request = new Request(`/todos/${data}/delete`, {
    method: 'DELETE',
    headers: myHeaders
  })

  fetch(request)
    .then((res) => {
      window.location.replace('/todos');
      alert('Todo Removed')
    }).catch((e) => {
      console.log(e)
    })
})
