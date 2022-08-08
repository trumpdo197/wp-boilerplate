/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  purge: {
    enabled: true,
    content: ['../*.php', '../partials/*.php', '../pages/*.php'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionDuration: {
        DEFAULT: '250ms',
      },
      colors: {},
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
        },
      },
      screens: {
        xl: '1140px',
        '2xl': '1140px',
      },
    },
  },
  variants: {
    extend: {
      // fontWeight: ['hover'],
      width: ['responsive'],
    },
  },
  separator: ':',
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    gridTemplateRows: false,
    gridAutoFlow: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
  },
};
