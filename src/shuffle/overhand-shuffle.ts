import {
    type BaseShuffleOptions, createRepetitiveShuffle, type Deck, random, type Shuffle, splitDeck
} from './common'

export interface OverhandShuffleOptions extends BaseShuffleOptions {
    pickUncertainty: number
}

export const defaultOverhandShuffleOptions: OverhandShuffleOptions = {
    repetitionCount: 30,
    /**
     * How many cards (at most) will land from left hand to right hand. Must be between 1 and N
     * where N is the deck size.
     */
    pickUncertainty: 3
}

export const createOverhandShuffle = (
    {
        repetitionCount,
        pickUncertainty
    } = defaultOverhandShuffleOptions
): Shuffle =>
    createRepetitiveShuffle(
        deck => {
            let topHand: Deck = deck
            const bottomHand: Deck = []

            while (topHand.length > 0) {
                let rightHandAddition
                [topHand, rightHandAddition] = splitDeck(topHand, random(-pickUncertainty, 0))
                console.log(topHand)
                bottomHand.push(...rightHandAddition)
            }

            return bottomHand
        },
        repetitionCount
    )
