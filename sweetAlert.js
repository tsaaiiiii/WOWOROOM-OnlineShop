/* globals Swal */
const toastAlert = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: 'success',
    title: '成功加入購物車'
  })
}
// export { toastAlert }

const warningAlert = () => {
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
// export { warningAlert }

const confirmAlert = (fn) => {
  Swal.fire({
    title: '請確認',
    text: '一但刪除將無法回復',
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定刪除',
    cancelButtonText: '再想想'
  }).then((result) => {
    // console.log(result);
    if (result.isConfirmed) {
      fn()
      Swal.fire('已刪除', '您的檔案刪除成功', 'success')
    }
  })
}
export { toastAlert, warningAlert, confirmAlert }
