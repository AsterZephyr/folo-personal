// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const RewindBackward15CuteReIcon = ({
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
      d="M3 11.997a9 9 0 0 0 7.024 8.758a9 9 0 1 0-5.03-14.43L5.5 2l.503 2.502m9.76 3.998h-3.5v3.063s.875-.438 1.75-.438c1.313 0 2.188.98 2.188 2.188a2.187 2.187 0 0 1-4.193.874M7.5 9.5l1.5-1v7"
    />
  </Svg>
)
