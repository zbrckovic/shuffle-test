import React from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

const root = document.getElementById('root')
if (root === null) throw new Error('Root element not found!')

createRoot(root).render(<div>App</div>)
