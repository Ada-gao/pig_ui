const autoFocus = {}
autoFocus.install = Vue => {
  Vue.directive('autoFocus', {
    inserted(el) {
      el.childNodes[1].focus()
    }
  })
}

export default autoFocus

