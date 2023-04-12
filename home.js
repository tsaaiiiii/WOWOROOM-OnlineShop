/* globals axios */
// UID: TPZHZLqfSOaqH1KzCtvwfSqAF1g2;
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
const productList = document.querySelector('.productList')
const shoppingCartTableContainer = document.querySelector(
  '.shoppingCart_tableContainer'
)
const productSelect = document.querySelector('.productSelect')

// 產品列表渲染
const productListRender = () => {
  let itemList = ''
  // console.log(data);
  data.forEach((item) => {
    itemList += `<li class="productCard">
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
// 篩選option

productSelect.addEventListener('change', function (event) {
  console.log(event.target.value)
  const selectvalue = data.filter((item) => {
    return item.category === event.target.value
  })
  console.log(selectvalue)
  let itemList = ''
  selectvalue.forEach((item) => {
    itemList += `<li class="productCard">
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
})

// // // 編輯購物車產品數量
// const patchCart = () => {
//   axios
//     .patch(`${cartUrl}`, {
//       data: {
//         id: '1RriLvsFh5axZjbsnUfA',
//         quantity: 6
//       }
//     })
//     .then((res) => {
//       console.log(res)
//     })
//     .catch((error) => {
//       console.log(error)
//     })
// }
// patchCart()

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

// 購物車API
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
    })
    .catch((error) => {
      console.log(error)
    })
}

// 渲染購物車頁面
const cartListRender = () => {
  let cartList = ''
  let allPrice = 0
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
            <td style="text-align:left">${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${
                item.id
              }"> clear </a>
            </td><tr>`
    allPrice += item.product.price * item.quantity
  })
  // console.log(allPrice)
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
    // console.log(getProductId)
    axios
      .post(`${cartUrl}`, {
        data: {
          productId: `${getProductId}`,
          quantity: 1
        }
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
    deleteAllCart()
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
      })
      .catch((error) => {
        console.log(error)
      })
  }
})
