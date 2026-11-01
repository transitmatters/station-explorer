import { useMediaQuery } from 'react-responsive';

// Keep in sync with the --breakpoint-* values in the @theme block of src/index.css
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export function useBreakpoint(breakpointKey: keyof typeof breakpoints) {
  return useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
}
