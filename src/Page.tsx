import React, { FC, useCallback, useEffect, useState } from 'react'
import { PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import { convertShuffleToRNG, createOverhandShuffle, createRiffleShuffle, Shuffle } from './shuffle'
import { factorial } from './utils'

const deckSize = 10
const permutationCount = factorial(deckSize)
const canvasSize = Math.ceil(Math.sqrt(permutationCount))
console.log(`Deck size: ${deckSize}`)
console.log(`Permutations: ${permutationCount}`)
console.log(`Canvas size: ${canvasSize}`)

type ShuffleName = 'Riffle' | 'Overhand'

const shuffleAlgorithms: Record<ShuffleName, Shuffle> = {
    Riffle: createRiffleShuffle(),
    Overhand: createOverhandShuffle(),
}

export const Page: FC = () => {
    const [shuffleName, setShuffleName] = useState<ShuffleName>(Object.keys(shuffleAlgorithms)[0] as ShuffleName)
    const [playing, setPlaying] = useState(false)
    const [dotCount, setDotCount] = useState(0)

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    const clearCanvas = useCallback(() => {
        if (ctx === undefined) return
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvasSize, canvasSize)
    }, [ctx])

    const stop = useCallback(() => {
        setPlaying(false)
        setDotCount(0)
        clearCanvas()
    }, [])

    const drawPixelDot = useCallback((x: number, y: number) => {
        if (ctx === undefined) return
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.fillRect(x, y, 1, 1)
    }, [ctx])

    useEffect(() => {
        if (ctx === undefined) return

        if (!playing) return

        const shuffle = shuffleAlgorithms[shuffleName]
        const rng = convertShuffleToRNG(shuffle, deckSize)

        const intervalId = setInterval(() => {
            const n = rng()
            const [x, y] = convertNumberToCoords(n)
            drawPixelDot(x, y)
            setDotCount(prev => prev + 1)
        })

        return () => clearInterval(intervalId)
    }, [ctx, playing, shuffleName])

    return <div className='grow flex flex-col items-center p-4'>
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
                <select
                    className='select'
                    value={shuffleName}
                    onChange={({ target: { value } }) => {
                        stop()
                        setShuffleName(value as ShuffleName)
                    }}
                >
                    {
                        Object
                            .keys(shuffleAlgorithms)
                            .map(name => <option key={name} value={name}>{name}</option>)
                    }
                </select>
                <button
                    className='btn'
                    onClick={() => setPlaying(prev => !prev)}
                >
                    {playing ? <PauseIcon className='w-6' /> : <PlayIcon className='w-6' />}
                </button>
                <button className='btn' onClick={stop}>
                    <StopIcon className='w-6' />
                </button>
                <div className='ms-auto w-56'>
                    <label className='font-bold'>Shuffle count:</label> <span>{dotCount}</span>
                </div>
            </div>
            <canvas
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
        </div>
    </div>
}

const convertNumberToCoords = (n: number): [number, number] => {
    const x = n % canvasSize
    const y = Math.floor(n / canvasSize)
    return [x, y]
}