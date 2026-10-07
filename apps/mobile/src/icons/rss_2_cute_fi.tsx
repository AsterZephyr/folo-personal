// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Rss2CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M5.5 6.5q-.225 0-.445.008a1.5 1.5 0 1 1-.11-2.998q.277-.01.555-.01c8.284 0 15 6.716 15 15q0 .278-.01.555a1.5 1.5 0 1 1-2.998-.11q.008-.221.008-.445c0-6.627-5.373-12-12-12m0 7q-.195 0-.386.015a1.5 1.5 0 1 1-.228-2.992q.305-.023.614-.023a8 8 0 0 1 7.977 8.614a1.5 1.5 0 1 1-2.992-.228q.015-.19.015-.386a5 5 0 0 0-5-5m-2 5a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
      clipRule="evenodd"
    />
  </Svg>
)
