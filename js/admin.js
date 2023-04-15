/* global axios, c3 */
import { closeMenu, menuToggle } from './navbar.js'
import {
  toggleOrderAlert,
  errorAlert,
  delSingleOrderAlert,
  delAllOrdersAlert
} from './sweetAlert.js'
import { token, adminUrl } from './config.js'

const orderUrl = `${adminUrl}/orders`
const config = {
  headers: {
    Authorization: token
  }
}
const chart = document.querySelector('#chart')
const orderListTable = document.querySelector('.orderContainer')
const delAllBtnContainer = document.querySelector('.delAllBtnContainer')

let orderData = []

// 取得訂單資訊
const getOrderList = () => {
  axios
    .get(orderUrl, config)
    .then((res) => {
      if (res.data.status) {
        orderData = res.data.orders
        if (orderData.length > 0) {
          renderDelBtn()
          getChartData(orderData)
          renderOrderList(orderData)
        } else {
          chart.innerHTML = ''
          delAllBtnContainer.innerHTML = ''
          orderListTable.innerHTML = '<h2>目前還沒有訂單喔😓😓😓</h2>'
        }
      }
    })
    .catch((err) => {
      // console.log(err)
      errorAlert(err.response.data.message)
    })
}

// 渲染訂單資訊
const renderOrderList = (data) => {
  let str = ''
  data.forEach((order) => {
    const orderProducts = order.products.map((product) => {
      return `<p">${product.title}</p>`
    })
    const orderProductsHTML = orderProducts.join('')
    const { name, tel, address, email } = order.user
    str += `<tr>
                <td>${order.createdAt}</td>
                    <td>
                      <p>${name}</p>
                      <p>${tel}</p>
                        </td>
                    <td>${address}</td>
                    <td>${email}</td>
                    <td>
                      ${orderProductsHTML}
                    </td>
                    <td>${formatDate(order.createdAt)}</td>
                    <td class="orderStatus">
                    <a href="#" data-id=${order.id} class="status">
                    ${order.paid ? '已處理' : '未處理'}
                    </a>
                    </td>
                    <td>
                      <button type="button" class="delSingleBtn" data-id=${
                        order.id
                      }>
                      刪除
                      </button>
                    </td>
                </tr>`
  })
  const orderListTeaplate = `<table>
                                  <thead>
                                    <tr>
                                    <th>訂單編號</th>
                                    <th>聯絡人</th>
                                    <th>聯絡地址</th>
                                    <th>電子郵件</th>
                                    <th>訂單品項</th>
                                    <th>訂單日期</th>
                                    <th>訂單狀態</th>
                                    <th>操作</th>
                                    </tr>
                                  </thead>
                                <tbody>
                                ${str}
                                </tbody>
                             </table>`
  orderListTable.innerHTML = orderListTeaplate
}

// 渲染清除所有訂單按鈕
const renderDelBtn = () => {
  const str = '<button type="button" class="delAllBtn">清除全部訂單</button>'
  delAllBtnContainer.innerHTML = str
}

// 轉換日期格式
const formatDate = (dateNum) => {
  return new Date(dateNum * 1000).toISOString().slice(0, 10).replace('T', ' ')
}

// 編輯訂單付款狀態
const editOrderStatus = (e) => {
  e.preventDefault()
  const orderId = e.target.dataset.id
  let status = false
  if (e.target.innerText === '未處理') {
    status = true
  }
  const updatedOrder = {
    data: {
      id: orderId,
      paid: status
    }
  }
  axios
    .put(orderUrl, updatedOrder, config)
    .then((res) => {
      // console.log(res)
      getOrderList()
      toggleOrderAlert()
    })
    .catch((err) => {
      // console.log(err)
      errorAlert(err.response.data.message)
    })
}

// 刪除單筆訂單
const delSingleOrder = (orderId, successAlert) => {
  axios
    .delete(`${orderUrl}/${orderId}`, config)
    .then((res) => {
      // console.log(res)
      successAlert()
      getOrderList()
    })
    .catch((err) => {
      // console.log(err)
      errorAlert(err.response.data.message)
    })
}

// 刪除所有訂單
const delAllOrders = (alert) => {
  axios
    .delete(orderUrl, config)
    .then((res) => {
      // console.log(res)
      alert()
      getOrderList()
    })
    .catch((err) => {
      // console.log(err)
      errorAlert(err.response.data.message)
    })
}

orderListTable.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'status') {
    editOrderStatus(e)
  }
})

orderListTable.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'delSingleBtn') {
    const orderId = e.target.dataset.id
    delSingleOrderAlert(orderId, delSingleOrder)
  }
})

delAllBtnContainer.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'delAllBtn') {
    delAllOrdersAlert(delAllOrders)
  }
})

// 整理C3.js圖表需求資料
const getChartData = (orders) => {
  const obj = {}
  orders.forEach((order) => {
    for (const p of order.products) {
      if (!obj[p.category]) {
        obj[p.category] = p.quantity
      } else {
        obj[p.category] += p.quantity
      }
    }
  })
  const chartData = Object.entries(obj)
  chartData.sort((a, b) => b[1] - a[1])
  getC3Chart(chartData)
}

// 取得C3.js圓餅圖
const getC3Chart = (saleData) => {
  c3.generate({
    bindto: '#chart',
    data: {
      columns: saleData,
      type: 'pie'
    },
    color: {
      pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F']
    },
    size: {
      height: 350
    }
  })
}

getOrderList()

// menu 切換
const menuOpenBtn = document.querySelector('.menuToggle')
const linkBtn = document.querySelectorAll('.navBar_menu a')

linkBtn.forEach((item) => {
  item.addEventListener('click', closeMenu)
})

menuOpenBtn.addEventListener('click', menuToggle)
