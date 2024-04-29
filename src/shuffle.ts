import { encodePermutation } from './permutation-encoder'

export const createOverhandShuffle = (): Shuffle => (permutation => {
    return permutation
})

export const createRiffleShuffle = (): Shuffle => {

    return (permutation => {
        return permutation
    })
}

export const convertShuffleToRNG = (shuffle: Shuffle, n: number): RNG => {
    const startingDeck = createStartingDeck(n)

    return () => {
        const shuffledDeck = shuffle(startingDeck)
        return encodePermutation(shuffledDeck)
    }
}

export const createStartingDeck = (n: number): Deck => {
    const result: number[] = []
    for (let i = 0; i < n; i++) {
        result.push(i)
    }
    return result
}

type Deck = ReadonlyArray<number>
export type Shuffle = (deck: Deck) => Deck
export type RNG = () => number
