/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = 5
  this.guessedWords = 0

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 1.8
    this.canvas.height = this.HEIGHT * 1.8

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))
  },

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]
    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)
    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()
      if (this.word.left.length === 0) {
        this.guessedWords += 1
        this.getScore()

        this.generateWord()
      }
      this.word.Draw()
    }
  },

  getScore: function () {
    console.log(this.guessedWords)
    document.querySelector('.currentScore').innerHTML = this.guessedWords
  }

}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Optima'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

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
      // window.addEventListener('keypress', autosave)
    }
  },
  'game-view': {
    'render': function () {
      console.log('>>>> Game')
      typer.start()

      const time = 5000

      if (timer) { clearTimeout(timer) }
      timer = window.setTimeout(function () {
        history.pushState(null, null, '#score-view')
        window.app.routeChange()
        document.querySelector('#game-view').style.display = 'none'
        document.querySelector('#score-view').style.display = 'block'
      }, time)
    }
  },
  'score-view': {
    'render': function () {
      addEntry()
      console.log('>>>> Score')
      document.querySelector('.endScore').innerHTML = typer.guessedWords

      const entries = JSON.parse(localStorage.getItem('allEntries'))
      const sortedEntries = entries.sort(function (a, b) {
        return b.score - a.score
      })

      const leaderboard = document.querySelector('.leaderboard')
      for (let entry of sortedEntries) {
        leaderboard.insertAdjacentHTML('beforeend', `<li>${entry.user} - ${entry.score}</li>`)
      }
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
      this.routes[this.currentRoute].render()
    } else {
      /// 404 - ei olnud
    }
  }
}

/* MAIN */

let timer // GLOBAL

function autosave () {
  // after typing init autosave
  const doneTypingInterval = 2500

  if (timer) { clearTimeout(timer) }
  timer = window.setTimeout(function () {
    saveLocal()
    console.log('autosave')
  }, doneTypingInterval)
}

function saveLocal () {
  console.log(window.app)

  history.pushState(null, null, '#game-view')
  window.app.routeChange()
  document.querySelector('#game-view').style.display = 'block'
  document.querySelector('#home-view').style.display = 'none'
}

function addEntry () {
  // Parse any JSON previously stored in allEntries
  let existingEntries = JSON.parse(localStorage.getItem('allEntries'))
  if (existingEntries == null) existingEntries = []

  const entry = {
    user: document.querySelector('#textInput').value,
    score: typer.guessedWords
  }
  localStorage.setItem('entry', JSON.stringify(entry))
  // Save allEntries back to local storage
  existingEntries.push(entry)
  localStorage.setItem('allEntries', JSON.stringify(existingEntries))
}

// kui leht laetud käivitan app'i
window.addEventListener('load', function (event) {
  const typer = new TYPER()
  window.typer = typer

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
