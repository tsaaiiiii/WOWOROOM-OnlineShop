/* global axios, validate */
import {
  toastAlert,
  successAlert,
  remindAlert,
  changeAlert,
  confirmAlert,
  errorAlert,
  createSuccessAlert,
  checkInputAlert
} from './sweetAlert.js'
import { closeMenu, menuToggle } from './navbar.js'
import { customerUrl } from './config.js'

const orderUrl = `${customerUrl}/orders`
const productUrl = `${customerUrl}/products`
const cartUrl = `${customerUrl}/carts`

// menu 切換
const menuOpenBtn = document.querySelector('.menu_toggle')
const linkBtn = document.querySelectorAll('.navBar_menu a')

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu)
})

menuOpenBtn.addEventListener('click', menuToggle)

// 取得產品列表
let data = []
const getProductList = () => {
  axios
    .get(`${productUrl}`)
    .then((res) => {
      data = res.data.products
      productListRender()
    })
    .catch((err) => {
      errorAlert(err.response.data.message)
    })
}

// DOM
const productList = document.querySelector('.products_list')
const shoppingCartTableContainer = document.querySelector(
  '.shoppingcart_tableContainer'
)
const productSelect = document.querySelector('.products_select')

// 產品列表渲染
const productListRender = () => {
  let itemList = ''
  data.forEach((item) => {
    itemList += `<li class="products_card">
          <h4 class="products_tag">新品</h4>
          <img
            src=${item.images}
            alt=""
          />
          <a href="#" class="addcart_btn" data-id = "${item.id}">加入購物車 </a>
          <h3>${item.title}</h3>
          <del class="products_originPrice">NT$${item.origin_price}</del>
          <p class="products_nowPrice">NT$${item.price}</p> 
        </li>`
  })

  productList.innerHTML = itemList
}

// 篩選類別option
productSelect.addEventListener('change', (event) => {
  let itemList = ''
  data.filter((item) => {
    const content = `<li class="products_card">
          <h4 class="products_tag">新品</h4>
          <img
            src=${item.images}
            alt=""
          />
          <a href="#" class="addcart_btn" data-id="${item.id}">加入購物車 </a>
          <h3>${item.title}</h3>
          <del class="products_originPrice">NT$${item.origin_price}</del>
          <p class="products_nowPrice">NT$${item.price}</p> 
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
const deleteAllCart = (alert) => {
  axios
    .delete(`${cartUrl}`)
    .then((res) => {
      alert()
      getCart()
    })
    .catch((err) => {
      errorAlert(err.message)
    })
}

// 購物車如果沒有商品會出現的警語
const cartNewData = () => {
  let num = 0
  cartData.forEach((item) => {
    num = num + 1
  })
  if (num === 0) {
    shoppingCartTableContainer.innerHTML = '<h4>目前購物車沒有商品😏</h4>'
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
      cartData = res.data.carts
      totalPrice = res.data.finalTotal
      cartListRender()
      cartNewData()
      updateSubmitBtn()
    })
    .catch((err) => {
      errorAlert(err.response.data.message)
    })
}

// 渲染購物車頁面
const cartListRender = () => {
  let cartList = ''
  cartData.forEach((item) => {
    cartList += `<tr class="shoppingcart_items"><td>
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
            <td class="discard_btn">
              <a href="#" class="material-icons" data-id="${
                item.id
              }"> clear </a>
            </td><tr>`
  })

  shoppingCartTableContainer.innerHTML = `<table class="shoppingcart_table">
          <tr class="shoppingcart_header">
            <th width="35%">品項</th>
            <th width="20%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>
           ${cartList}
          <tr class="discard">
            <td style="padding-top:32px">
              <a href="#" class="discardAll_btn">刪除所有品項</a>
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

// 點擊加入購物車的按鈕
productList.addEventListener('click', (e) => {
  e.preventDefault()
  const getProductId = e.target.getAttribute('data-id')
  if (e.target.getAttribute('class') === 'addcart_btn') {
    const existingItem = cartData.filter(
      (item) => item.product.id === getProductId
    )[0]
    if (existingItem) {
      // 已經存在
      successAlert()
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
          toastAlert()
          getCart()
        })
        .catch((err) => {
          errorAlert(err.response.data.message)
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
    const data = {
      id: `${getProductId}`,
      quantity: newQuantity
    }
    axios
      .patch(`${cartUrl}`, {
        data
      })
      .then((res) => {
        changeAlert()
        getCart()
      })
      .catch((err) => {
        errorAlert(err.response.data.message)
      })
  }
})

// 點擊刪除所有品項按鈕
shoppingCartTableContainer.addEventListener('click', (e) => {
  e.preventDefault()
  if (e.target.getAttribute('class') === 'discardAll_btn') {
    confirmAlert(deleteAllCart)
    cartNewData()
  }
})

// 刪除購物車特定產品
shoppingCartTableContainer.addEventListener('click', (e) => {
  e.preventDefault()
  const deleteId = e.target.getAttribute('data-id')
  if (e.target.getAttribute('class') === 'material-icons') {
    axios
      .delete(`${cartUrl}/${deleteId}`)
      .then((res) => {
        if (res.data.status) {
          remindAlert()
          getCart()
          cartNewData()
        } else {
          errorAlert(res.data.message)
        }
      })
      .catch((err) => {
        errorAlert(err.message)
      })
  }
})

const init = () => {
  getProductList()
  getCart()
}

init()

// 送出訂單表單
const orderInfoForm = document.querySelector('.orderInfo_form')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')
const submitBtn = document.querySelector('.orderInfo_btn')

// 控制提交表單按鈕是否可以點擊
const updateSubmitBtn = () => {
  if (cartData.length > 0) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
}

// validate.js
// 送出訂單表單驗證
const inputs = document.querySelectorAll('input')
let errors

// 驗證規則
const orderInfoConstraints = {
  name: {
    presence: {
      message: '^請輸入姓名'
    }
  },
  tel: {
    presence: {
      message: '^請輸入電話'
    },
    format: {
      pattern: '^09\\d{8}$',
      message: '^請輸入09開頭的手機號碼(共10碼)'
    }
  },
  email: {
    presence: {
      message: '^請輸入Email'
    },
    email: {
      message: '^不符合Email格式'
    }
  },
  address: {
    presence: {
      message: '^請輸入地址'
    }
  }
}

// 觸發input事件時，驗證填寫是否正確
for (const input of inputs) {
  input.addEventListener('input', () => {
    errors = validate(orderInfoForm, orderInfoConstraints)
    resetErrorMsg(input.parentElement)
    if (errors) {
      handleErrorMsg(input, errors[input.name])
    }
  })
}

// 表單驗證顯示錯誤訊息
const handleErrorMsg = (input, error) => {
  const parentNode = input.parentNode
  if (error) {
    const span = document.createElement('span')
    span.classList.add('orderInfo_errorMsg')
    span.textContent = error
    parentNode.appendChild(span)
  } else {
    resetErrorMsg(parentNode)
  }
}

// 清除錯誤訊息
const resetErrorMsg = (parentNode) => {
  const span = parentNode.querySelector('span')
  if (span) {
    parentNode.removeChild(span)
  }
}

// 取得表單資料
const getOrderInfo = () => {
  return {
    data: {
      user: {
        name: customerName.value,
        tel: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value,
        payment: tradeWay.value
      }
    }
  }
}

// 檢查input是否有填寫
const checkIsEmpty = (order) => {
  const arr = Object.values(order.data.user)
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === '') {
      return true
    }
  }
  return false
}

// 送出訂單資料
const createOrder = () => {
  const order = getOrderInfo()
  if (checkIsEmpty(order) || errors) {
    checkInputAlert()
  } else {
    axios
      .post(orderUrl, order)
      .then((res) => {
        createSuccessAlert()
        orderInfoForm.reset()
        getCart()
      })
      .catch((err) => {
        errorAlert(err.response.data.message)
      })
  }
}

submitBtn.addEventListener('click', createOrder)

// 好評推薦
document.addEventListener('DOMContentLoaded', function () {
  const ele = document.querySelector('.recommendation_wall')
  ele.style.cursor = 'grab'
  let pos = { top: 0, left: 0, x: 0, y: 0 }
  const mouseDownHandler = function (e) {
    ele.style.cursor = 'grabbing'
    ele.style.userSelect = 'none'

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }
  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y

    // Scroll the element
    ele.scrollTop = pos.top - dy
    ele.scrollLeft = pos.left - dx
  }
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab'
    ele.style.removeProperty('user-select')

    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
  }
  // Attach the handler
  ele.addEventListener('mousedown', mouseDownHandler)
})
