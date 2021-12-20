const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const peoples = JSON.parse(localStorage.getItem('favoritePeople')) || []
const PeoplePerPage = 16
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')

// render dataPanelHTML
function renderPeopleList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `
       <div class="col-sm-3"> 
       <div class="mb-4">
       <div class="card bg-dark text-white">
        <div class="card-avatar ">
          <img src="${item.avatar}" class="card-img-top" alt="..." class="card-img-top rounded">
          </div>
          
          <div class="card-title">
            <p class="card-title-region text-decoration-none fw-light fs-6 border-bottom ">${item.region}</p>
            <p class="card-title-name text-decoration-none fw-normal fs-6 border-bottom">${item.name} ${item.surname}</p>
            <p class="card-title-gender text-decoration-none fw-light fs-6 border-bottom">${item.gender}</p>
            <p class="card-title-age text-decoration-none fw-light fs-6 border-bottom">${item.age}</p>
            </div>
            
            <div class="card-footer text-center">
            <button type="button" class="btn btn-more bg-warning btn-sm " data-bs-toggle="modal" data-bs-target="#people-modal" data-id="${item.id}">
            more</button>
            <button type="button" class="btn btn-danger text-light btn-remove-favorite btn-sm " data-bs-toggle="modal" data-bs-target="#" data-id="${item.id}">
            X</button>
            </div> 
          </div>
          </div> 
       </div>
  </div>
   `
  })

  dataPanel.innerHTML = rawHTML
}
// 
axios.get(INDEX_URL)
  .then((response) => {
    renderPaginator(peoples.length) // 所有分頁
    renderPeopleList(getPeopleByPage(1)) // 每個分頁會出現的人
    // renderPeopleList(peoples)
  })
  .catch((err) => console.log(err))

// render Modal
function showPeopleModal(id) {
  const peopleModalName = document.querySelector('#people-modal-name')
  const peopleModalRegion = document.querySelector('#people-modal-region')
  const peopleModalGender = document.querySelector('#people-modal-gender')
  const peopleModalAge = document.querySelector('#people-modal-age')
  const peopleModalBirthday = document.querySelector('#people-modal-birthday')
  const peopleModalEmail = document.querySelector('#people-modal-email')
  // get id-API:peopleModal-info
  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      peopleModalName.innerText = `${data.name}  ${data.surname}`
      peopleModalRegion.innerText = `Region: ` + data.region
      peopleModalGender.innerText = `Gender: ` + data.gender
      peopleModalAge.innerText = `Age: ` + data.age
      peopleModalBirthday.innerText = `Birthday: ` + data.birthday
      peopleModalEmail.innerText = `Email: ` + data.email
    })
}

// addEventListener
dataPanel.addEventListener('click', function clickPanel(event) {
  if (event.target.matches('.btn-more')) {
    showPeopleModal(event.target.dataset.id)
  }
  else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// paginator
// 1. 一頁要取出的電影數量。
function getPeopleByPage(page) {
  const data = peoples // 接住切割後的陣列
  //計算起始 index 
  const startIndex = (page - 1) * PeoplePerPage
  //回傳切割後的陣列給 data
  return data.slice(startIndex, startIndex + PeoplePerPage)
}
// 2. 該分幾個分頁，寫入HTML裡。
function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / PeoplePerPage)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item "><a class="page-link text-dark" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}
// 3. 點擊該分頁，印刷出該頁的電影項目
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') { return }

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderPeopleList(getPeopleByPage(page))
})

// 刪除功能
function removeFromFavorite(id) {
  if (!peoples || !peoples.length) return //透過 id 找到要刪除電影的 index
  const peopleIndex = peoples.findIndex((people) => people.id === id)
  if (peopleIndex === -1) return
  //刪除該筆電影
  peoples.splice(peopleIndex, 1)
  //存回 local storage
  localStorage.setItem('favoritePeople', JSON.stringify(peoples))
  //更新頁面
  renderPeopleList(peoples)
}

renderPeopleList(peoples) 