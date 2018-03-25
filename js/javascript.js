const MainApp = function () {
  if (MainApp.instance) {
    return MainApp.instance
  }
  MainApp.instance = this

  this.routes = MainApp.routes
  this.currentRoute = null

  this.init()
}

MainApp.routes = {
  'home-view': {
    'render': function () {
      console.log('>>>> Home')

      const localValue = localStorage.getItem('textInput')
      if (localValue) document.querySelector('#textInput').value = JSON.parse(localValue).text

      document
        .querySelector('#saveLocal')
        .addEventListener('click', saveLocal)

      window.addEventListener('keypress', autosave)
    }
  },
  'game-view': {
    'render': function () {
      console.log('>>>> Game')
    }
  }
}

MainApp.prototype = {
  init: function () {
    console.log('Rakendus läks tööle')

    window.addEventListener('hashchange', this.routeChange.bind(this))

    if (!window.location.hash) {
      window.location.hash = 'home-view'
    } else {
      this.routeChange()
    }
  },

  routeChange: function (event) {
    this.currentRoute = location.hash.slice(1)
    if (this.routes[this.currentRoute]) {
      this.updateMenu()

      this.routes[this.currentRoute].render()
    } else {
      /// 404 - ei olnud
    }
  },

  updateMenu: function () {
    // http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
    document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '')
    document.querySelector('.' + this.currentRoute).className += ' active-menu'
  }
}

/* MAIN */

let timer // GLOBAL

function autosave () {
  // after typing init autosave
  const doneTypingInterval = 2500

  if (timer) { clearTimeout(timer) }
  timer = window.setTimeout(function () {
    // TODO check if really changed
    saveLocal()
    console.log('autosave')
  }, doneTypingInterval)
}

function saveLocal () {
  console.log(window.app)
  const o = {
    text: document.querySelector('#textInput').value,
    date: new Date()
  }
  localStorage.setItem('textInput', JSON.stringify(o))

  history.pushState(null, null, '#game-view')
  // window.app.routeChange()
  document.querySelector('#game-view').style.display = 'block'
  document.querySelector('#home-view').style.display = 'none'
}

// kui leht laetud käivitan app'i
window.addEventListener('load', function (event) {
  const app = new MainApp()
  window.app = app

  document.querySelector('.goDark').addEventListener('click', function () {
    chBackcolor('#142638')
  })
})

// button function for dark mode (krislyn)
function chBackcolor (color) {
  document.body.style.background = color
}
