// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Esta linha é vital!
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}