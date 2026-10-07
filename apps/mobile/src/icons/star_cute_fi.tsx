// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const StarCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M10.92 2.37a1.25 1.25 0 0 1 2.16 0l2.795 4.8l5.428 1.175a1.25 1.25 0 0 1 .667 2.054l-3.7 4.142l.56 5.525a1.25 1.25 0 0 1-1.748 1.27L12 19.096l-5.082 2.24a1.25 1.25 0 0 1-1.747-1.27l.559-5.525l-3.7-4.142a1.25 1.25 0 0 1 .667-2.054L8.125 7.17z"
    />
  </Svg>
)
