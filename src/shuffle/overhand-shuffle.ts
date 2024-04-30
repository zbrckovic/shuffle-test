import { type BaseShuffleOptions, type Deck, type Shuffle } from './common'

export interface OverhandShuffleOptions extends BaseShuffleOptions {}

export const defaultOverhandShuffleOptions: OverhandShuffleOptions = {
    repetitionCount: 30
}

export const createOverhandShuffle = (
    {
        repetitionCount
    } = defaultOverhandShuffleOptions
): Shuffle => (permutation: Deck) => permutation
