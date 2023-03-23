import pokemon from 'pokemontcgsdk'

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'})

const GetCardSet = async() => {
    return await pokemon.set.all().then((sets) => {
        return sets;
    });
}

export { GetCardSet }
