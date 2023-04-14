/* global axios, validate */
import { closeMenu, menuToggle } from './navbar.js'
const apiPath = 'woowooyong'
const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}`

// menu 切換
const menuOpenBtn = document.querySelector('.menuToggle')
const linkBtn = document.querySelectorAll('.navBar_menu a')

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu)
})

menuOpenBtn.addEventListener('click', menuToggle)

// 送出訂單表單
const orderInfoForm = document.querySelector('.orderInfo_form')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')
const submitBtn = document.querySelector('.orderInfoBtn')

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
      message: '^請輸入10碼手機號碼'
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
  console.log(order.data.user)
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
    alert('請輸入正確資料')
  } else {
    axios
      .post(`${url}/orders`, order)
      .then((res) => {
        console.log(res)
        orderInfoForm.reset()
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

submitBtn.addEventListener('click', () => {
  createOrder()
})

// 好評
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
