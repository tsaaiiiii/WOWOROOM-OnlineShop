const menu = document.querySelector('.navbar_menu')

const menuToggle = () => {
  if (menu.classList.contains('open_menu')) {
    menu.classList.remove('open_menu')
  } else {
    menu.classList.add('open_menu')
  }
}
const closeMenu = () => {
  menu.classList.remove('open_menu')
}

export { menuToggle, closeMenu }
