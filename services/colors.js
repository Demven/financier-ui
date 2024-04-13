function getColorIntensity ([red, green, blue]) {
  const hex = ''
    + Number(red).toString(16)
    + Number(green).toString(16)
    + Number(blue).toString(16);


  const rgb = parseInt(hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const COLOR_INTENSITY_NAME = {
  LIGHT: 'light',
  SEMI_DARK: 'semi-dark',
  DARK: 'dark',
};

export function getColorIntensityName ([red, green, blue]) {
  const intensity = getColorIntensity([red, green, blue]);

  let txt = COLOR_INTENSITY_NAME.LIGHT;

  if (intensity >= 80 && intensity <= 100){
    txt = COLOR_INTENSITY_NAME.SEMI_DARK;
  } else if (intensity < 80){
    txt = COLOR_INTENSITY_NAME.DARK;
  }

  return txt;
}
