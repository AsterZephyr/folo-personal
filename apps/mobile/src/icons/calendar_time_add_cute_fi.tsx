// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const CalendarTimeAddCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M16 3a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v5.528A6 6 0 0 0 12.53 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a1 1 0 0 1 2 0v1h6V4a1 1 0 0 1 1-1m1 10a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 1.5a1 1 0 0 0-1 1V17a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-.5a1 1 0 0 0-1-1M8 14a1 1 0 1 0 0 2h.5a1 1 0 1 0 0-2zm0-4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z"
    />
  </Svg>
)
