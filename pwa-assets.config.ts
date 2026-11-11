import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// Icon generation from public/logo.svg.
// Padding background in brand colour --green-700 instead of default white.
export default defineConfig({
  preset: {
    ...preset,
    maskable: { ...preset.maskable, resizeOptions: { background: '#075e46' } },
    apple: { ...preset.apple, resizeOptions: { background: '#075e46' } },
  },
  images: ['public/logo.svg'],
})