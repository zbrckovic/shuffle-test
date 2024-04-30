import {
    type BaseShuffleOptions, type Deck, random, type Shuffle, splitDeck, splitDeckWithUncertainty
} from './common'

export interface RiffleShuffleOptions extends BaseShuffleOptions {
    splitUncertaintyOffset: number
    riffleUncertainty: number
}

export const defaultRiffleShuffleOptions: RiffleShuffleOptions = {
    repetitionCount: 7,
    splitUncertaintyOffset: 2,
    riffleUncertainty: 2
}

export const createRiffleShuffle = (
    {
        repetitionCount,
        riffleUncertainty,
        splitUncertaintyOffset
    } = defaultRiffleShuffleOptions
): Shuffle => {
    const riffle = (deck: Deck): Deck => {
        let [left, right] = splitDeckWithUncertainty(deck, splitUncertaintyOffset)

        const result: Deck = []

        while (left.length > 0 || right.length > 0) {
            let leftBottom: number[]
            let rightBottom: number[]
            [left, leftBottom] = splitDeck(left, random(-riffleUncertainty, 1));
            [right, rightBottom] = splitDeck(right, random(-riffleUncertainty, 1))
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
