console.log('hello')

var button = document.querySelector(".deleteTodo")

button.addEventListener('click', (e) => {
  console.log(e);
  console.log(e.target.id)
  let data = e.target.id;

  let request = new Request(`/todos/${data}/delete`, {
    method: 'DELETE',
    body: data,
    headers: new Headers()
  })

  fetch(request)
    .then((res) => {
      window.location.replace('/todos');
      alert('Todo Removed')
    }).catch((e) => {
      console.log(e)
    })
})
