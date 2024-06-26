import { encodePermutation } from '../shuffle/permutation-encoder'

test.each([
    [[0, 1, 2, 3], 0],
    [[0, 1, 3, 2], 1],
    [[0, 2, 1, 3], 2],
    [[0, 2, 3, 1], 3],
    [[0, 3, 1, 2], 4],
    [[0, 3, 2, 1], 5],
    [[1, 0, 2, 3], 6],
    [[1, 0, 3, 2], 7],
    [[1, 2, 0, 3], 8],
    [[1, 2, 3, 0], 9],
    [[1, 3, 0, 2], 10],
    [[1, 3, 2, 0], 11],
    [[2, 0, 1, 3], 12],
    [[2, 0, 3, 1], 13],
    [[2, 1, 0, 3], 14],
    [[2, 1, 3, 0], 15],
    [[2, 3, 0, 1], 16],
    [[2, 3, 1, 0], 17],
    [[3, 0, 1, 2], 18],
    [[3, 0, 2, 1], 19],
    [[3, 1, 0, 2], 20],
    [[3, 1, 2, 0], 21],
    [[3, 2, 0, 1], 22],
    [[3, 2, 1, 0], 23]
])('.encodePermutation(%s) gives %s', (permutation: number[], expectedCode) => {
    const code = encodePermutation(permutation)
    expect(code).toBe(expectedCode)
})
