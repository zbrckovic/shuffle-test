import React, {
    forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState
} from 'react'
import { factorial, usePrevious } from './utils'
import { convertShuffleToRNG, type Shuffle } from './shuffle/common'

interface Props {
    deckSize: number
    shuffle?: Shuffle
    playing: boolean
    shuffleCountLimit: number
    onShuffle: () => void
}

export interface VisualizerHandle {
    download: () => void
}

const canvasSize = 1900

export const Visualizer = forwardRef<VisualizerHandle, Props>((
    {
        deckSize,
        shuffle,
        playing,
        onShuffle
    },
    ref
) => {
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)
    const ctx: CanvasRenderingContext2D | undefined = useMemo(
        () => canvasEl?.getContext('2d') ?? undefined,
        [canvasEl]
    )
    const prevShuffle = usePrevious(shuffle)
    const isShuffleNew = prevShuffle !== shuffle

    useImperativeHandle(ref, (): VisualizerHandle => ({
        download: () => {
            if (canvasEl === null) return
            const link = document.createElement('a');
            link.download = 'filename.png';
            link.href = canvasEl.toDataURL()
            link.click();
        }
    }), [canvasEl])

    const graphSize = useMemo(() => {
        const permutationCount = factorial(deckSize)
        return Math.ceil(Math.sqrt(permutationCount))
    }, [deckSize])

    const convertNumberToCanvasCoords = useCallback((n: number): [number, number] => {
        const x = n % graphSize
        const y = Math.floor(n / graphSize)
        return [(x / graphSize) * canvasSize, (y / graphSize) * canvasSize]
    }, [graphSize])

    useEffect(() => {
        if (ctx === undefined) return
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvasSize, canvasSize)
    }, [ctx])

    const drawMark = useCallback((x: number, y: number) => {
        if (ctx === undefined) return
        ctx.fillStyle = 'rgba(0,0,0,0.1)'
        ctx.fillRect(x, y, 1, 1)
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, 2 * Math.PI)
        ctx.fill()
    }, [ctx])

    useEffect(() => {
        if (shuffle === undefined) return
        if (!playing) return

        const rng = convertShuffleToRNG(shuffle, deckSize)

        const intervalId = setInterval(() => {
            const n = rng()
            const [x, y] = convertNumberToCanvasCoords(n)
            drawMark(x, y)
            onShuffle()
        })

        return () => { clearInterval(intervalId) }
    }, [shuffle, playing, isShuffleNew, drawMark, onShuffle])

    return <canvas
        className='border-solid border border-black'
        width={canvasSize}
        height={canvasSize}
        ref={setCanvasEl}
    />
})
Visualizer.displayName = 'Visualizer'
