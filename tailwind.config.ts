import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f1720",
        mist: "#e7edf3",
        ember: "#f47c48",
        gold: "#f4c95d",
        teal: "#49b6b1"
      },
      boxShadow: {
        glow: "0 24px 60px rgba(15, 23, 32, 0.28)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(244, 201, 93, 0.16), transparent 28%), radial-gradient(circle at 80% 0%, rgba(73, 182, 177, 0.18), transparent 32%), linear-gradient(135deg, #091018 0%, #102436 40%, #15334a 100%)"
      }
    }
  },
  plugins: []
};

export default config;
