const menu = document.querySelector('.navBar_menu')

const menuToggle = () => {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu')
  } else {
    menu.classList.add('openMenu')
  }
}
const closeMenu = () => {
  menu.classList.remove('openMenu')
}

export { menuToggle, closeMenu }
