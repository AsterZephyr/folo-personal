// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const VolumeOffCuteReIcon = ({
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
      strokeWidth={2}
      d="M17 9.764A3 3 0 0 1 18 12c0 .888-.386 1.687-1 2.236m2-6.708A6 6 0 0 1 21 12a6 6 0 0 1-2 4.472M8.16 8.161L14 4v10M4 9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.68a1 1 0 0 1 .58.186L14 20v-1M4.222 4.223l15.556 15.556"
    />
  </Svg>
)
