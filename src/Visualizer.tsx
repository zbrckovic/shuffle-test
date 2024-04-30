import React, { type FC, useCallback, useEffect, useState } from 'react'
import { factorial, usePrevious } from './utils'
import { convertShuffleToRNG, type Shuffle } from './shuffle/common'

const deckSize = 10
const permutationCount = factorial(deckSize)
const canvasSize = Math.ceil(Math.sqrt(permutationCount))
console.log(`Deck size: ${deckSize}`)
console.log(`Permutations: ${permutationCount}`)
console.log(`Canvas size: ${canvasSize}`)

interface Props {
    shuffle?: Shuffle
    playing: boolean
    shuffleCountLimit: number
    onShuffle: () => void
}

export const Visualizer: FC<Props> = ({ shuffle, playing, onShuffle }) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    const prevShuffle = usePrevious(shuffle)
    const isShuffleNew = prevShuffle !== shuffle

    const clearCanvas = useCallback(() => {
        if (ctx === undefined) return
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvasSize, canvasSize)
    }, [ctx])

    const drawPixelDot = useCallback((x: number, y: number) => {
        if (ctx === undefined) return
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.fillRect(x, y, 1, 1)
    }, [ctx])

    useEffect(() => {
        if (shuffle === undefined) {
            clearCanvas()
            return
        }

        if (isShuffleNew) {
            clearCanvas()
        }

        if (!playing) return

        const rng = convertShuffleToRNG(shuffle, deckSize)

        const intervalId = setInterval(() => {
            const n = rng()
            const [x, y] = convertNumberToCoords(n)
            drawPixelDot(x, y)
            onShuffle()
        })

        return () => { clearInterval(intervalId) }
    }, [shuffle, playing, isShuffleNew, clearCanvas, drawPixelDot, onShuffle])

    return <canvas
        className='border-solid border border-black'
        width={canvasSize}
        height={canvasSize}
        ref={canvas => {
            if (canvas === null) return
            const ctx = canvas.getContext('2d')
            if (ctx === null) return
            setCtx(ctx)
        }}
    />
}

const convertNumberToCoords = (n: number): [number, number] => {
    const x = n % canvasSize
    const y = Math.floor(n / canvasSize)
    return [x, y]
}
