import React, { FC, useCallback, useEffect, useState } from 'react'
import { PlayIcon, StopIcon, PauseIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 768

export const Page: FC = () => {
    const [playing, setPlaying] = useState(false)
    const [dotCount, setDotCount] = useState(0)

    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()

    const clearCanvas = useCallback(() => {
        if (ctx === undefined) return
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }, [ctx])

    const drawPixelDot = useCallback((x: number, y: number) => {
        if (ctx === undefined) return
        ctx.fillStyle = 'rgba(255,0,0,0.5)'
        ctx.fillRect(x, y, 1, 1)
    }, [ctx])

    useEffect(() => {
        if (ctx === undefined) return

        if (!playing) return

        const intervalId = setInterval(() => {
            const x = Math.floor(Math.random() * CANVAS_WIDTH)
            const y = Math.floor(Math.random() * CANVAS_HEIGHT)
            drawPixelDot(x, y)
            setDotCount(prev => prev + 1)
        })

        return () => clearInterval(intervalId)
    }, [ctx, playing])

    return <div className='grow flex flex-col items-center p-4'>
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-1'>
                <select>
                    
                </select>
                <button
                    className='btn'
                    onClick={() => setPlaying(prev => !prev)}
                >
                    {playing ? <PauseIcon className='w-6' /> : <PlayIcon className='w-6' />}
                </button>
                <button className='btn' onClick={() => {
                    setPlaying(false)
                    setDotCount(0)
                    clearCanvas()
                }}>
                    <StopIcon className='w-6' />
                </button>
                <div className='ms-auto'>
                    <label className='font-bold'>Dot count:</label> <span>{dotCount}</span>
                </div>
            </div>
            <canvas
                className='border-solid border border-black'
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
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
