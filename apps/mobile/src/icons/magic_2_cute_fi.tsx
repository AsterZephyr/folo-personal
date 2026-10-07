// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Magic2CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m6.045 6.05l1.413 1.413M12 12l8.187 8.192M15.944 6.05l-1.411 1.412m-7.071 7.07L6.045 15.95M17.995 11h-2.05m-9.9 0h-2.05m7 7v-2.05m0-9.9V4"
    />
  </Svg>
)
