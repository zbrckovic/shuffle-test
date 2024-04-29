const themes = require("daisyui/src/theming/themes")
const daisyUI = require("daisyui")

const lightTheme = themes["light"]


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,tsx,jsx}',
    ],
    plugins: [daisyUI],
    daisyui: {
        themes: [
            {
                theme: {
                    ...lightTheme,
                    "primary": "#a5ebff",
                    "error": '#e43c3e',
                    "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
                    "--rounded-btn": "0.2rem", // border radius rounded-btn utility class, used in buttons and similar element
                    "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
                    "--tab-border": "1px", // border width of tabs
                    "--tab-radius": "0.5rem", // border radius of tabs,
                    ".modal-backdrop": {
                        'background-color': 'rgba(0, 0, 0, 0.5)'
                    }
                },
            }
        ],
    },
}

