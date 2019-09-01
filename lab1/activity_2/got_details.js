// DOM #main div element
var main = document.getElementById('main');

// **** Your JavaScript code goes here ****
let characters = [
	{
		name: 'Homer Simpson',
		status: 'Alive',
		current_location: 'Moe\'s',
		power_ranking: 5,
		house: 'Simpson',
		probability_of_survival: 15
	},
	{
		name: 'Radagast the Brown',
		status: 'Dead',
		current_location: 'Middle Earth',
		power_ranking: 8,
		house: 'Brown',
		probability_of_survival: 50
	},
	{
		name: 'Philip J. Fry',
		status: 'Alive',
		current_location: 'Earth, year 3001',
		power_ranking: 10,
		house: 'Fry',
		probability_of_survival: 100
	},
	{
		name: 'Hank Hill',
		status: 'Alive',
		current_location: 'Arlen, TX',
		power_ranking: 6,
		house: 'Hill',
		probability_of_survival: 75
	}
];

let halfSurvival = function(character) {
	return character.probability_of_survival / 2;
};

for (let i = 0; i < characters.length - 1; i++) {
	characters[i].probability_of_survival = halfSurvival(characters[i]);
}

let debugCharacters = function() {
	
	for (let i = 0; i < characters.length; i++) {
		console.log(characters[i].name + ', Chance of survival: ' + characters[i].probability_of_survival);
	}
};

debugCharacters();

let header = document.createElement('h3');
let hr = document.createElement('hr');
main.appendChild(header);
header.textContent = 'My Favorite Characters';
main.appendChild(hr);

let wrapper = document.createElement('div');
main.appendChild(wrapper);
wrapper.classList.add('wrapper');

characters.forEach(function(character, index) {
	let div = document.createElement('div');
	wrapper.appendChild(div);
	
	let name = document.createElement('h5');
	div.appendChild(name);
	name.textContent = 'Name: ' + character.name;
	
	let house = document.createElement('h5');
	div.appendChild(house);
	house.textContent = 'House: ' + character.house;
	
	let survival = document.createElement('h5');
	div.appendChild(survival);
	survival.textContent = 'Chance of survival: ' + character.probability_of_survival + '%';
	
	let status = document.createElement('h5');
	div.appendChild(status);
	status.textContent = 'Status: ' + character.status;
});