// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FacebookCuteReIcon = ({
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
      strokeWidth={2}
      d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18Zm0 0v-8m2.5-5H14a2 2 0 0 0-2 2v3m0 0h-2m2 0h2"
    />
  </Svg>
)
