import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'})

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

const GetCardSet = async(action = '', params = {}) => {

    switch (action) {
        case 'filter_id':
            return await pokemon.set.find(params.id).then(async(setData) => {
                return await pokemon.card.all({q: 'set.id:' + params.id}).then(result => {
                    return {name: setData.name, content: result};
                });
            });
        default:
            return await pokemon.set.all().then(sets => {
                return sets;
            });
    }

}

const GetCard = async(card) => {
    return await pokemon.card.where({q: 'id:' + card}).then(result => {
        return result.data[0];
    })
}

const SetUpGame = async(set, level, matches) => {
    return await GetCardSet('filter_id', { id : set}).then((res) => {
        let response = [];
        let matchesStatus = 0;
        for (let index = 0; index < level - (matches * 2); index++) {
            let card = res.content[Math.floor(Math.random() * res.content.length)];

            if (!response.find(c => c.id === card.name)) {
                response.push(card);
            }

        }

        while (matchesStatus < matches) {
            // let Matchcard = response[Math.floor(Math.random() * response.length)];
            let Matchcard = res.content[Math.floor(Math.random() * response.length)];
            let MatchcardClone = Matchcard;

            if (response.find(x => x.id === Matchcard.id) === undefined) {
                response.push(Matchcard);
                response.push(MatchcardClone);
                matchesStatus++;
            }
        }

        return shuffle(response);

    })
}

export { GetCardSet, GetCard, SetUpGame}