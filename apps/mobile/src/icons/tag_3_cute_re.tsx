// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Tag3CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path fill={color} d="M8.59 10.92a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1" />
    <Path
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.259 10.777L12.774 3.29a1 1 0 0 0-.707-.29H7m1.59 7.921a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1M3.996 6.827v5.657a1 1 0 0 0 .293.707l7.485 7.485a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414L11.36 6.12a1 1 0 0 0-.707-.293H4.996a1 1 0 0 0-1 1"
    />
  </Svg>
)
