/* global axios, c3 */
const apiPath = 'woowooyong'
const token = 'TPZHZLqfSOaqH1KzCtvwfSqAF1g2'
const orderUrl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`
const orderListTable = document.querySelector('.orderContainer')

let orderData = []

const getOrderList = () => {
  axios
    .get(orderUrl, {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      if (res.status === 200) {
        orderData = res.data.orders
        if (orderData.length > 0) {
          getChartData(orderData)
          renderOrderList(orderData)
        } else {
          orderListTable.innerHTML = '<h2>目前還沒有訂單喔😓😓😓</h2>'
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const renderOrderList = (data) => {
  let str = ''
  data.forEach((order) => {
    const orderProducts = order.products.map((product) => {
      return `<p class="orderItem">${product.title}</p>`
    })
    const orderProductsHTML = orderProducts.join('')
    const { name, tel, address, email } = order.user
    str += `<tr>
                <td>10088377474</td>
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
  const orderListTeaplate = `<button type="button" class="delAllBtn">清除全部訂單</button>
                            <table>
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
    .put(orderUrl, updatedOrder, {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      console.log(res)
      getOrderList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 刪除單筆訂單
const delSingleOrder = (e) => {
  const orderId = e.target.dataset.id
  axios
    .delete(`${orderUrl}/${orderId}`, {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      console.log(res)
      getOrderList()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 刪除所有訂單
const delAllOrders = () => {
  axios
    .delete(orderUrl, {
      headers: {
        Authorization: token
      }
    })
    .then((res) => {
      console.log(res)
      getOrderList()
    })
    .catch((err) => {
      console.log(err)
    })
}

orderListTable.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'status') {
    editOrderStatus(e)
  }
})

orderListTable.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'delSingleBtn') {
    delSingleOrder(e)
  }
})

orderListTable.addEventListener('click', (e) => {
  if (e.target.getAttribute('class') === 'delAllBtn') {
    delAllOrders()
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
      type: 'pie',
      columns: saleData
    },
    color: {
      pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F']
    }
  })
}

getOrderList()
