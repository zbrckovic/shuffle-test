import { encodePermutation } from './permutation-encoder'

export const createOverhandShuffle = (): Shuffle => (permutation => {
    return permutation
})

export const createRiffleShuffle = (): Shuffle => (permutation => {
    return permutation
})

export const convertShuffleToRNG = (shuffle: Shuffle, n: number): RNG => {
    const startingPermutation = createStartingPermutation(n)

    return () => {
        const shuffledPermutation = shuffle(startingPermutation)
        return encodePermutation(shuffledPermutation)
    }
}

export const createStartingPermutation = (n: number): Permutation => {
    const permutation: number[] = []
    for (let i = 0; i < n; i++) {
        permutation.push(i)
    }
    return permutation
}

type Permutation = ReadonlyArray<number>
export type Shuffle = (permutation: Permutation) => Permutation
export type RNG = () => number
