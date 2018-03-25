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

      document
        .querySelector('#saveLocal')
        .addEventListener('click', saveLocal)

      window.addEventListener('keypress', autosave)
    }
  },
  'game-view': {
    'render': function () {
      console.log('>>>> Game')

      const localValue = localStorage.getItem('textInput')
      if (localValue) document.querySelector('#textInput').value = JSON.parse(localValue).text
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
    text: window.app.input.value,
    date: new Date()
  }
  localStorage.setItem('textInput', JSON.stringify(o))
}

// kui leht laetud käivitan app'i
window.onload = function () {
  const app = new MainApp()
  window.app = app
}
