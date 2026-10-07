// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const InfoCircleFillIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m-1 8a1 1 0 1 0 0 2v5a1 1 0 0 0 1 1h.5a1 1 0 0 0 .5-1.865V11a1 1 0 0 0-1-1zm1-3a1 1 0 1 0 0 2h.002a1 1 0 0 0 0-2z"
    />
  </Svg>
)
