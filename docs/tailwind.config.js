module.exports = {
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#89a9e7",
        "primary-hover": "#6c9fd6",
        secondary: "#901d8c",
        "secondary-hover": "#7a1a7e",
        accent: "#db499a",
        text: "#d7e0f7",
        "text-darker": "#c4d0f0",
        background: "#050b18",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
