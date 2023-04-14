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

const confirmAlert = () => {
  Swal.fire({
    title: '要不要...',
    text: '看看其他商品呢？',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '一定要的吧',
    cancelButtonText: '當然沒問題'
  }).then((result) => {
    // console.log(result);
  })
}
export { toastAlert, warningAlert, confirmAlert }
