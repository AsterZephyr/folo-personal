// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Emoji2CuteReIcon = ({
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
      d="m15 8l-1 1l1 1M9 8v2m12 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-9 6a4 4 0 0 1-4-4v-.167c0-.46.373-.833.833-.833h6.334c.46 0 .833.373.833.833V14a4 4 0 0 1-4 4"
    />
  </Svg>
)
