// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const StopwatchCuteReIcon = ({
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
      d="M12 9v4M9.5 3.285a11.1 11.1 0 0 1 5 0m3.816 2.399l-1.195 1.195M20 13a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"
    />
  </Svg>
)
