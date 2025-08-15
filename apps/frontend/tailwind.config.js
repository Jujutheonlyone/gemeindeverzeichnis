module.exports = {
  content: ["./src/views/**/*.{html,js}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem !important",
        sm: "1rem !important",
        lg: "4rem !important",
        xl: "2rem !important",
        "2xl": "3rem !important",
      },
    },
    extend: {
      lineHeight: {
        6: "26px",
      },
      colors: {
        foreground: "#1F1A37",
        background: "#131022",
        bodygray: "#FAFAFA",
        gray: {
          50: "#F9FAFB",
          100: "#F2F4F7",
          200: "#E4E7EC",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },
        blue: {
          25: "#F5FAFF",
          50: "#EFF8FF",
          100: "#D1E9FF",
          200: "#B2DDFF",
          300: "#84CAFF",
          400: "#53B1FD",
          500: "#2E90FA",
          600: "#1570EF",
          700: "#175CD3",
          800: "#1849A9",
          900: "#194185",
        },
      },
      fontFamily: {
        inter: "'Inter', sans-serif",
      },
      boxShadow: {
        "front-1": " 0px 0px 7px rgba(16, 24, 40, 0.05);", //shadow
        "front-2": "2px 6px 15px rgba(16, 24, 40, 0.05);", //2
        "front-3": "0px 11px 30px rgba(16, 24, 40, 0.06);", //3
        "front-4": "7px 14px 50px rgba(16, 24, 40, 0.07);", //4
        "front-5": "8px 22px 60px rgba(16, 24, 40, 0.07);", //5
        "front-6": "8px 22px 60px rgba(16, 24, 40, 0.07);", //6
        "reverse-1": "-2px -6px 15px rgba(16, 24, 40, 0.05);",
        "reverse-2": " 0px -11px 30px rgba(16, 24, 40, 0.06);",
        "reverse-3": "-7px -14px 50px rgba(16, 24, 40, 0.07);",
        "reverse-4": "-8px -22px 60px rgba(16, 24, 40, 0.07);",
        "reverse-5": " -8px -30px 50px rgba(16, 24, 40, 0.08);",
        "reverse-6": "-10px -30px 60px rgba(16, 24, 40, 0.08);",
        input: "0px 1px 3px rgba(27, 35, 52, 0.04);",
        "inner-tabs": "-8px 14px 15px rgba(16, 24, 40, 0.05)",
        "glow-blue": "0px 11px 25px rgba(73, 123, 254, 0.3);",
        "small-content-1": "1px 7px 20px rgba(16, 24, 40, 0.06);",
        "search-bar": " 0px 6px 15px rgba(16, 24, 40, 0.05);",
      },
      dropShadow: {
        "primary-glow": "0px 11px 25px rgba(73, 123, 254, 0.3)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
