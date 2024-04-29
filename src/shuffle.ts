import { encodePermutation } from './permutation-encoder'

export const createOverhandShuffle = (): Shuffle => (permutation => {
    return permutation
})

export const createRiffleShuffle = ({
                                        repetitionCount = 7,
                                        splitUncertaintyOffset = 2,
                                        riffleUncertainty = 2
                                    } = {}): Shuffle => {
    const riffle = (deck: Deck): Deck => {
        let [left, right] = splitDeckWithUncertainty(deck, splitUncertaintyOffset)

        const result: Deck = []

        while (left.length > 0 || right.length > 0) {
            let leftBottom: number[]
            let rightBottom: number[]
            [left, leftBottom] = splitDeck(left, random(-riffleUncertainty, 1));
            [right, rightBottom] = splitDeck(right, random(-riffleUncertainty, 1));
            result.push(...leftBottom, ...rightBottom)
        }

        return result
    }

    return (deck: Deck): Deck => {
        let result = deck
        for (let i = 0; i < repetitionCount; i++) {
            result = riffle(result)
        }
        return result
    }
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

const splitDeckWithUncertainty = (deck: Deck, maxRandomizationOffset: number): [Deck, Deck] => {
    const splitPointOffset = random(-maxRandomizationOffset, maxRandomizationOffset + 1)
    const deckHalf = Math.floor(deck.length / 2)
    const splitPoint = deckHalf + splitPointOffset
    return splitDeck(deck, splitPoint)
}

const splitDeck = (deck: Deck, i: number): [Deck, Deck] => {
    return [deck.slice(0, i), deck.slice(i)]
}

const random = (from: number, to: number): number => {
    const range = to - from
    return Math.floor(Math.random() * range) + from
}

type Deck = number[]
export type Shuffle = (deck: Deck) => Deck
export type RNG = () => number
