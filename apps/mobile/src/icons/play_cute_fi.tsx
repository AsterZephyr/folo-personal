// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PlayCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.453 3.442 1.532 6.462 3.276c3.021 1.744 5.146 3.266 6.069 3.958c.788.59.79 1.763.001 2.355c-.914.687-3.013 2.191-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28a1.467 1.467 0 0 1-2.038-1.177c-.138-1.141-.396-3.734-.396-7.236c0-3.5.257-6.092.396-7.235"
      clipRule="evenodd"
    />
  </Svg>
)
