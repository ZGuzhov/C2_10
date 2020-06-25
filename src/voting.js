const cats = document.querySelector('.cats')
const parrots = document.querySelector('.parrots')
const dogs = document.querySelector('.dogs')
const b_cats = document.querySelector('.b-cats')
const b_parrots = document.querySelector('.b-parrots')
const b_dogs = document.querySelector('.b-dogs')

const vote_s = document.querySelector('.vote-stats')
const vote_t = document.querySelector('.vote-text')

const header = new Headers({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*'
})

function vote(enimal) {
    fetch(`https://sf-pyw.mosyag.in/sse/vote/${enimal}`, {method: 'POST'})
}

function voteDone() {
	vote_s.style.cssText = `display: block;`
	b_cats.style.cssText = `display: none;`
	b_parrots.style.cssText = `display: none;`
	b_dogs.style.cssText = `display: none;`
	vote_t.textContent = 'Результаты голосования'
}

b_cats.onclick = () =>{
	vote('cats')
	voteDone()
}
b_parrots.onclick = () =>{
	vote('parrots')
	voteDone()
}
b_dogs.onclick = () =>{
	vote('dogs')
	voteDone()
}

const urlStats = new URL('https://sf-pyw.mosyag.in/sse/vote/stats')
const ES = new EventSource(urlStats, header)

ES.onerror = error => {
    ES.readyState ? progress.textContent = "Some error" : null;
}

function make_russian(n){
	let vote_rus = ""
	x = n % 100
	if (x > 10 && x < 20) {
		vote_rus = " голосов"
	} else {
		x = n % 10
		if (x === 1) {
			vote_rus = " голос"
		} else if (x > 1 && x < 5) {
			vote_rus = " голоса"
		} else {
			vote_rus = " голосов"
		}
	}
	return vote_rus
}

ES.onmessage = message => {
    const votes = JSON.parse(message.data)
    const sum = votes["cats"] + votes["parrots"] + votes["dogs"]
    let cats_p = votes["cats"]/sum*100
    cats_p = cats_p.toFixed(2)
    let parrots_p = votes["parrots"]/sum*100
    parrots_p = parrots_p.toFixed(2)
    let dogs_p = votes["dogs"]/sum*100
    dogs_p = dogs_p.toFixed(2)
    cats.style.cssText = `width: ${cats_p}%;`
    cats.textContent = `${votes["cats"]}${make_russian(votes["cats"])} - ${cats_p}%`
    parrots.style.cssText = `width: ${parrots_p}%;`
    parrots.textContent = `${votes["parrots"]}${make_russian(votes["parrots"])} - ${parrots_p}%`
    dogs.style.cssText = `width: ${dogs_p}%;`
    dogs.textContent = `${votes["dogs"]}${make_russian(votes["dogs"])} - ${dogs_p}%`
}