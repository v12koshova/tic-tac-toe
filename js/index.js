const field = document.querySelector('#field')
const btns = document.getElementsByClassName('cell')
const newGame = document.querySelector('#newGame')
const root = document.querySelector('#root')
const modal = document.querySelector('#modal')
const initialModal = document.querySelector('#initial-modal')
const modalWrap = document.querySelector('.modal-wrap')
const initialModalWrap = document.querySelector('.initial-modal-wrap')
const modalText = document.querySelector('.modalText')
const winCounter_O = document.querySelector('.winCounter_O')
const winCounter_X = document.querySelector('.winCounter_X')
const winCounter_Draw = document.querySelector('.winCounter_Draw')
const resetResultsBtn = document.querySelector('#resetResults')
const gif = document.querySelector('.gif-hi')
const snd = document.getElementById("winnerAudio");
const congratsSound = document.getElementById("congratsSound");

function playSound(sound) {
    sound.currentTime = 0
    sound.play()
}
initialModal.show()


const winnerOptions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let computer = true
let isEnd = false
let turnO = true
let results = {}
let disabledBtnList = []

initializeCounter()
function resetResults() {
    results = {
        o: 0,
        x: 0,
        draw: 0,
        turn: 'o'
    }
}

function initializeCounter() {
        resetResults()
        setCounter()
}

function setCounter () {
    winCounter_O.textContent = results['o']
    winCounter_X.textContent = results['x']
    winCounter_Draw.textContent = results['draw']
    setTurn(results["turn"])
}

function startGame() {
    setCounter();
    [...btns].forEach(btn => {
            btn.classList.remove('x') || btn.classList.remove('o')
            btn.classList.remove('win')
            disabledBtn(btn)
    })
    disabledBtnList = []
    isEnd = false;
    if (computer && results.turn === 'x') {
        computerTurn()
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cell')) {
        playSound(snd)
        if (!turnO) {
            e.target.classList.add('x') 
        } else if (turnO) {
            e.target.classList.add('o')
        }
        disabledBtn(e.target)
        checkWinner(e.target.id)
        checkDraw()
        if (!isEnd) switchTurn()
        if (computer && !isEnd) {
            computerTurn()  
        } 
        
    } else if (e.target == newGame) {
        
        manageModal("hide")
        startGame()
    } else if (e.target == resetResultsBtn) {
        e.preventDefault()
        initializeCounter()
        startGame()
    }   else if (e.target.classList.contains('option-btn')) {
        e.preventDefault()
        if (e.target.id === "friend") {
          computer = false;
        } else {
          computer = true;
          document.documentElement.style.setProperty('--display_cat', 'block')
        }
        startGame()
        gif.style.display = "none"
        initialModal.close()
        initialModalWrap.style.display = 'none'
    }
    
})

function manageModal(action) {
    if (action === "show") {
        modalWrap.style.display = "block"
        root.style.position = "fixed"
        root.style.left = '50%';
        root.style.transform = 'translateX(-50%)'
        modal.show()
    } else if (action === "hide") {
        modalWrap.style.display = "none"
        root.style.position = "relative"
        root.style.left = '0';
        root.style.rigth = '0';
        root.style.transform = 'translate(0, 0)'
        modal.close()
    }
}

function disabledBtn(btn) {
    if (btn.classList.contains("x") || btn.classList.contains("o")) {
        btn.disabled = true
        disabledBtnList.push(btn)
    } else {
        btn.disabled = false
    }
}

function disableAllBtns(state) {
  [...btns].forEach((btn) => {
    if (!disabledBtnList.includes(btn)) {
      btn.disabled = state;
    }
  });
}


function switchTurn() {
    turnO = !turnO
    if (turnO) {
        field.classList.remove('turnX')
        field.classList.add('turnO')
    } else {
        field.classList.remove('turnO')
        field.classList.add('turnX')
    }
}

function setTurn(turn) {
    if (turn == 'o') {
        turnO = true
        field.classList.remove('turnX')
        field.classList.add('turnO')
    } else if (turn == 'x') {
        turnO = false
        field.classList.remove('turnO')
        field.classList.add('turnX')
}   }


function checkWinner(id) {
    let arrsToCheck = winnerOptions.filter(arr => arr.includes(+id))
    for (let arr of arrsToCheck) {

        if (btns[arr[0]].classList.value === btns[arr[1]].classList.value && btns[arr[1]].classList.value === btns[arr[2]].classList.value) {
            isEnd = true
            for (let i = 0; i < 3; i++) {
                btns[arr[i]].classList.add("win")

            }

            modalText.innerHTML = `<span class="${btns[id].classList[1]}"></span> <span class="modalCongrats">congratulations!</span>`
            setTimeout(() => {
                manageModal('show')
                playSound(congratsSound)
                fireStart()
                
            }, 1500)

            increaseCounter(btns[id].classList[1])
            setTurn(btns[id].classList[1])

            for (let btn of btns) {
                btn.disabled = true
            }
        }
    }
}

function checkDraw() {
    if ([...btns].every(btn => btn.classList.length == 2)) {
        isEnd = true
        modalText.textContent = "Draw!"
        manageModal('show')
        increaseCounter('draw')
    }
}

function increaseCounter(id) {
    document.querySelector('.gif-result').style.display = 'block'
    if (id == 'o') {
        winCounter_O.textContent = ++results['o']
        computer ? document.querySelector('.result-gif').src = `./i/sad${Math.floor(Math.random() * 6)}.gif` : document.querySelector('.result-gif').style.display = 'none'
        results["turn"] = "o"
    } else if (id == 'x') {
        winCounter_X.textContent = ++results['x']
        computer ? document.querySelector('.result-gif').src = `./i/happy${Math.floor(Math.random() * 6)}.gif` : document.querySelector('.result-gif').style.display = 'none'
        results["turn"] = "x"
    } else {
        winCounter_Draw.textContent = ++results['draw']
        computer ? document.querySelector('.result-gif').src = `./i/waiting${Math.floor(Math.random() * 6)}.gif` : document.querySelector('.result-gif').style.display = 'none'
    }
}

function wait() {
    return new Promise(res => setTimeout(res, 1500))
}

async function computerTurn() {
    disableAllBtns(true)
    document.querySelector('.gif-think').style.display = "block"
    await wait()
  let place = checkWinnerOptions()
  if (!place) {
    place = randomPlaceForComputerTurn()
  }
    playSound(snd);
    place.classList.add("x");
    checkWinner(place.id);
    checkDraw();
    document.querySelector('.gif-think').style.display = "none"
    disableAllBtns(false)
    disabledBtn(place);
    if (!isEnd) switchTurn()
}

function randomPlaceForComputerTurn() {
    let random = Math.floor(Math.random() * 9)
    let randomPlace = btns[random]
    if (!randomPlace.classList.contains('x') && !randomPlace.classList.contains('o')) {
        return randomPlace
    } else {
        return randomPlaceForComputerTurn()
    }
}

function checkWinnerOptions() {
    let place 
    for (let i = 0; i < winnerOptions.length; i++) {
        let [a, b, c] = winnerOptions[i];
        if (
          (btns[a].classList[1] === 'x' && btns[a].classList[1] === btns[b].classList[1] &&
            btns[a].classList[1] !== undefined && btns[c].classList[1] === undefined) ||
          (btns[a].classList[1]  === 'x' && btns[a].classList[1] === btns[c].classList[1] &&
            btns[a].classList[1] !== undefined && btns[b].classList[1] === undefined) ||
          (btns[b].classList[1]  === 'x' && btns[b].classList[1] === btns[c].classList[1] &&
            btns[b].classList[1] !== undefined && btns[a].classList[1] === undefined)
        ) { place =
            btns[a].classList[1] === btns[b].classList[1] ? btns[c]
              : btns[a].classList[1] === btns[c].classList[1]  ? btns[b]
              : btns[a]
            return place;
         }
            
      }
    for (let i = 0; i < winnerOptions.length; i++) {
        let [a, b, c] = winnerOptions[i];
        if (
          (btns[a].classList[1] === btns[b].classList[1] &&
            btns[a].classList[1] !== undefined && btns[a].classList[1] === 'o' && btns[c].classList[1] === undefined) ||
          (btns[a].classList[1] === btns[c].classList[1] &&
            btns[a].classList[1] !== undefined && btns[a].classList[1]  === 'o' && btns[b].classList[1] === undefined) ||
          (btns[b].classList[1] === btns[c].classList[1] &&
            btns[b].classList[1] !== undefined && btns[b].classList[1]  === 'o' && btns[a].classList[1] === undefined)
        ) { place =
            btns[a].classList[1] === btns[b].classList[1] ? btns[c]
              : btns[a].classList[1] === btns[c].classList[1]  ? btns[b]
              : btns[a]
            break
         }
            
      }
   
      return place
}


document.getElementById('computer').addEventListener('mouseover', function() {
    gif.style.transform = 'translate(300%, 0%)';
});

document.getElementById('computer').addEventListener('mouseout', function() {
    gif.style.transform = 'translate(300%, 100%)';
});
