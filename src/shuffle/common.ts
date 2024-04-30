import { encodePermutation } from './permutation-encoder'

export type Deck = number[]
export type Shuffle = (deck: Deck) => Deck
export type RNG = () => number

export interface BaseShuffleOptions {
    repetitionCount: number
}

// region Helper functions
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

export const splitDeckWithUncertainty = (
    deck: Deck,
    maxRandomizationOffset: number
): [Deck, Deck] => {
    const splitPointOffset = random(-maxRandomizationOffset, maxRandomizationOffset + 1)
    const deckHalf = Math.floor(deck.length / 2)
    const splitPoint = deckHalf + splitPointOffset
    return splitDeck(deck, splitPoint)
}

export const splitDeck = (deck: Deck, i: number): [Deck, Deck] => {
    return [deck.slice(0, i), deck.slice(i)]
}

export const random = (from: number, to: number): number => {
    const range = to - from
    return Math.floor(Math.random() * range) + from
}
// endregion
