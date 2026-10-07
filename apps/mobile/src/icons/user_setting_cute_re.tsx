// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const UserSettingCuteReIcon = ({
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
      d="M12.21 14.064A12 12 0 0 0 11 14c-4.418 0-8 2.567-8 4.5S6.582 21 11 21q.339 0 .672-.005M19 19.732a2 2 0 1 0-2-3.464m2 3.464a2 2 0 1 1-2-3.464m2 3.464l.75 1.299M17 16.268l-.75-1.3M16 18h-1.5m7 0H20m-1-1.732l.75-1.3m-3.5 6.063l.75-1.3M15 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0"
    />
  </Svg>
)
