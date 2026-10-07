// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Comment2CuteReIcon = ({
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
      d="M18.419 9A8.003 8.003 0 0 0 3 12c0 1.65.5 3.184 1.356 4.457l-.912 3.099l3.099-.912A7.95 7.95 0 0 0 10 19.938m2-3.438a4.5 4.5 0 0 0 7.007 3.737l1.743.513l-.513-1.743A4.5 4.5 0 1 0 12 16.5"
    />
  </Svg>
)
