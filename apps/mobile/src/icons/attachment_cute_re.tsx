// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AttachmentCuteReIcon = ({
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
      d="m12.877 4.308l6.54 6.54a5.25 5.25 0 0 1-7.424 7.425l-7.954-7.954a3.501 3.501 0 1 1 4.952-4.952l7.953 7.953a1.751 1.751 0 1 1-2.477 2.477L7.22 8.55"
    />
  </Svg>
)
