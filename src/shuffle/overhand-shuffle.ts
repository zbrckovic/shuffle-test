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
            let leftHand: Deck = deck
            let rightHand: Deck = []

            while (leftHand.length > 0) {
                let rightHandAddition
                [leftHand, rightHandAddition] = splitDeck(leftHand, random(-pickUncertainty, 0))
                console.log(leftHand)
                rightHand.push(...rightHandAddition)
            }

            return rightHand
        },
        repetitionCount
    )

