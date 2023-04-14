/* globals axios */
import { toastAlert, warningAlert, confirmAlert } from './sweetAlert.js'

const apiPath = 'woowooyong'
const productUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`
const cartUrl = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`

// 取得產品列表
let data = []
const getProductList = () => {
  axios
    .get(`${productUrl}`)
    .then((res) => {
      console.log(res)
      data = res.data.products
      productListRender()
    })
    .catch((error) => {
      console.log(error)
    })
}

// DOM
const productList = document.querySelector('.products_List')
const shoppingCartTableContainer = document.querySelector(
  '.shoppingCart_tableContainer'
)
const productSelect = document.querySelector('.products_select')

// 產品列表渲染
const productListRender = () => {
  let itemList = ''
  // console.log(data);
  data.forEach((item) => {
    itemList += `<li class="products_card">
          <h4 class="productTag">新品</h4>
          <img
            src=${item.images}
            alt=""
          />
          <a href="#" class="addCartBtn" data-id = "${item.id}">加入購物車 </a>
          <h3>${item.title}</h3>
          <del class="originPrice" style="font-size:20px">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p> 
        </li>`
  })

  productList.innerHTML = itemList
}
getProductList()

// 篩選類別option
productSelect.addEventListener('change', function (event) {
  let itemList = ''
  data.filter((item) => {
    const content = `<li class="products_card">
          <h4 class="productTag">新品</h4>
          <img
            src=${item.images}
            alt=""
          />
          <a href="#" class="addCartBtn" data-id = "${item.id}">加入購物車 </a>
          <h3>${item.title}</h3>
          <del class="originPrice" style="font-size:20px">NT$${item.origin_price}</del>
          <p class="nowPrice">NT$${item.price}</p> 
        </li>`
    if (item.category === event.target.value || event.target.value === '全部') {
      itemList += content
      return true
    } else {
      return false
    }
  })
  productList.innerHTML = itemList
})

// 刪除購物車全部產品
const deleteAllCart = () => {
  axios
    .delete(`${cartUrl}`)
    .then((res) => {
      console.log(res)
      getCart()
    })
    .catch((error) => {
      console.log(error)
    })
}

// 購物車如果沒有商品會出現的警語
const cartNewData = () => {
  let num = 0
  cartData.forEach((item) => {
    num = num + 1
  })
  if (num === 0) {
    shoppingCartTableContainer.innerHTML = '<h2>目前購物車沒有商品😏</h2>'
  } else {
    shoppingCartTableContainer.style.display = 'block'
  }
}

// 購物車資料get
let cartData = []
let totalPrice

const getCart = () => {
  axios
    .get(`${cartUrl}`)
    .then((res) => {
      // console.log(res)
      cartData = res.data.carts
      totalPrice = res.data.finalTotal
      cartListRender()
      cartNewData()
    })
    .catch((error) => {
      console.log(error)
    })
}
getCart()

// 渲染購物車頁面
const cartListRender = () => {
  let cartList = ''
  cartData.forEach((item) => {
    cartList += `<tr class="shoppingCart_items"><td>
                   <div class="cartItem_title">
                    <img src="${
                      item.product.images
                    }" alt="" width = 80px height = 80px>
                      <p>${item.product.title}</p>
                     </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td style="text-align:left"><div>
      <select name="" class="productNum" style="width:50px" data-id="${
        item.id
      }">
       <option value="1" ${item.quantity === 1 ? 'selected' : ''}>1</option>
     <option value="2" ${item.quantity === 2 ? 'selected' : ''}>2</option>
      <option value="3" ${item.quantity === 3 ? 'selected' : ''}>3</option>
        <option value="4" ${item.quantity === 4 ? 'selected' : ''}>4</option>
      <option value="5" ${item.quantity === 5 ? 'selected' : ''}>5</option>
        <option value="6" ${item.quantity === 6 ? 'selected' : ''}>6</option>
       <option value="7" ${item.quantity === 7 ? 'selected' : ''}>7</option>
        <option value="8" ${item.quantity === 8 ? 'selected' : ''}>8</option>
        <option value="9" ${item.quantity === 9 ? 'selected' : ''}>9</option>
        <option value="10" ${item.quantity === 10 ? 'selected' : ''}>10</option>
      </select></div></td>
      
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${
                item.id
              }"> clear </a>
            </td><tr>`
  })

  shoppingCartTableContainer.innerHTML = `<table class="shoppingCart_table">
          <tr class="shoppingCart_header">
            <th width="35%">品項</th>
            <th width="20%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>
           ${cartList}
          <tr class="discard">
            <td style="padding-top:32px">
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
             <td class="totalPrice">${totalPrice}</td>
          </tr>
        </table>`
}
getCart()

// 點擊加入購物車的按鈕
productList.addEventListener('click', (e) => {
  const getProductId = e.target.getAttribute('data-id')
  if (e.target.getAttribute('class') === 'addCartBtn') {
    const existingItem = cartData.filter(
      (item) => item.product.id === getProductId
    )[0]
    if (existingItem) {
      // 已經存在
      warningAlert()
    } else {
      // 否則就使用 axios post 新增商品到購物車中
      axios
        .post(`${cartUrl}`, {
          data: {
            productId: `${getProductId}`,
            quantity: 1
          }
        })
        .then((res) => {
          console.log(res)
          toastAlert()
          getCart()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})
// 數量取值
shoppingCartTableContainer.addEventListener('change', (e) => {
  if (e.target.getAttribute('class') === 'productNum') {
    let newQuantity = e.target.value
    newQuantity = parseInt(newQuantity, 10)
    const getProductId = e.target.getAttribute('data-id')
    console.log(getProductId)
    console.log(newQuantity)
    const data = {
      id: `${getProductId}`,
      quantity: newQuantity
    }
    axios
      .patch(`${cartUrl}`, {
        data
      })
      .then((res) => {
        console.log(res)
        getCart()
      })
      .catch((error) => {
        console.log(error)
      })
  }
})

// 點擊刪除所有品項按鈕
shoppingCartTableContainer.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'discardAllBtn') {
    confirmAlert(deleteAllCart)
    cartNewData()
  }
})

// 刪除購物車特定產品
shoppingCartTableContainer.addEventListener('click', (e) => {
  const deleteId = e.target.getAttribute('data-id')
  if (e.target.getAttribute('class') === 'material-icons') {
    axios
      .delete(`${cartUrl}/${deleteId}`)
      .then((res) => {
        console.log(res)
        getCart()
        cartNewData()
      })
      .catch((error) => {
        console.log(error)
      })
  }
})
