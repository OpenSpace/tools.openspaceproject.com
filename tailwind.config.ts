import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{jsx,tsx}",
    "./src/components/**/*.{jsx,tsx}",
    "./src/app/**/*.{jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      }
    }
  },
  plugins: []
}

export default config
