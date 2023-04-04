import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'})

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
        for (let index = 0; index < level - matches; index++) {
            let card = res.content[Math.floor(Math.random() * res.content.length)];

            if (!response.find(c => c.id === card.name)) {
                response.push(card);
            }

        }

        while (matchesStatus < matches) {
            let Matchcard = response[Math.floor(Math.random() * response.length)];

            if (response.filter(x => x.id === Matchcard.id).length <= 1) {
                response.push(Matchcard);
                matchesStatus++;
            }
        }

        return response;

    })
}

export { GetCardSet, GetCard, SetUpGame}