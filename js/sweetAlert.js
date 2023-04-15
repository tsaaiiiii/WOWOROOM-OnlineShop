/* globals Swal */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const Error = Swal.mixin({
  icon: 'error',
  title: '有某個地方出錯了...'
})

const Confirm = Swal.mixin({
  title: '請確認',
  icon: 'error',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: '確定刪除',
  cancelButtonText: '再想想'
})

const errorAlert = (msg = '請聯絡客服處理') => {
  Error.fire({
    text: msg
  })
}

const toastAlert = () => {
  Toast.fire({
    icon: 'success',
    title: '成功加入購物車'
  })
}

const remindAlert = () => {
  Toast.fire({
    icon: 'success',
    title: '成功刪除'
  })
}

const checkInputAlert = () => {
  Swal.fire('錯誤！', '請先填寫正確資料', 'error')
}

const successAlert = () => {
  Swal.fire({
    title: 'Hello~',
    text: '您的商品已加入購物車裡囉!',
    imageWidth: 180,
    imageHeight: 120,
    width: 280,
    imageUrl:
      'https://i.pinimg.com/originals/c5/cb/dd/c5cbddaaf58c3094d05c08357c6b6149.gif'
  })
}

const createSuccessAlert = () => {
  Swal.fire({
    icon: 'success',
    iconColor: '#3bafe5',
    title: '成功送出訂單！',
    text: '將儘速為您處理',
    confirmButtonText: '繼續逛逛'
  })
}

const confirmAlert = (fn) => {
  Confirm.fire({
    text: '一但刪除將無法回復'
  }).then((result) => {
    if (result.isConfirmed) {
      fn()
      Swal.fire('刪除成功', '已清除購物車內所有商品', 'success')
    }
  })
}

// 後台頁面
const toggleOrderAlert = () => {
  Toast.fire({
    icon: 'success',
    title: '成功修改訂單狀態'
  })
}

const delSingleOrderAlert = (orderId, fn) => {
  Confirm.fire({
    text: '是否確定刪除此筆訂單？'
  }).then((result) => {
    const success = () => {
      Swal.fire('刪除成功', '訂單已刪除', 'success')
    }
    if (result.isConfirmed) {
      fn(orderId, success)
    }
  })
}

const delAllOrdersAlert = (fn) => {
  Confirm.fire({
    text: '是否確定刪除全部訂單？'
  }).then((result) => {
    const success = () => {
      Swal.fire('刪除成功', '訂單已全部清除', 'success')
    }
    if (result.isConfirmed) {
      fn(success)
    }
  })
}

export {
  toastAlert,
  successAlert,
  remindAlert,
  confirmAlert,
  errorAlert,
  createSuccessAlert,
  checkInputAlert,
  toggleOrderAlert,
  delSingleOrderAlert,
  delAllOrdersAlert
}
