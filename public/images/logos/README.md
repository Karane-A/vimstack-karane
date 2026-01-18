# Vimstack Logo Assets

This directory contains the Vimstack branding assets.

## SVG Files

- `logo-light.svg` - Logo for dark backgrounds (white text)
- `logo-dark.svg` - Logo for light backgrounds (dark text)
- `favicon.svg` - Favicon icon

## PNG Conversion

The SVG files should be converted to PNG format for better browser compatibility:

### Required PNG Sizes:

1. **logo-light.png** - For dark mode backgrounds
   - Recommended: 200x60px (or 2x: 400x120px for retina)
   - Format: PNG with transparency

2. **logo-dark.png** - For light mode backgrounds
   - Recommended: 200x60px (or 2x: 400x120px for retina)
   - Format: PNG with transparency

3. **favicon.ico** - Browser favicon
   - Recommended sizes: 16x16, 32x32, 48x48
   - Format: ICO or PNG

### Conversion Tools:

You can use the following tools to convert SVG to PNG:

- **Online**: https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
- **Command Line**: Using ImageMagick or Inkscape
- **Design Tools**: Adobe Illustrator, Figma, or Canva

### Instructions:

1. Open the SVG file in your preferred tool
2. Export as PNG with the recommended dimensions
3. Ensure transparency is preserved
4. Replace the existing PNG files in this directory

## Current Default Paths

The application references these logos at:
- `/images/logos/logo-light.png` - Light logo
- `/images/logos/logo-dark.png` - Dark logo
- `/images/logos/favicon.ico` - Favicon

Note: The SVG versions are provided as source files. PNG versions should be generated from these SVGs for production use.
