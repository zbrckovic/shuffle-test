import { createRiffleShuffle } from '../shuffle'

describe('riffleShuffle', () => {
    it('produces some permutation with valid elements', () => {
        const shuffle = createRiffleShuffle()
        const initialDeck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const result = shuffle(initialDeck)
        expect(result.length).toBe(initialDeck.length)
        expect(new Set(result)).toEqual(new Set(initialDeck))
    })
})
