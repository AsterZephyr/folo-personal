// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const VIP2CuteReIcon = ({
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
      d="M13 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3.03 16a2 2 0 0 0 1.865-1.278L21 10.706s-3.7.735-5.5-.206S12 6 12 6s-1.7 3.765-3.5 4.706s-5.5 0-5.5 0l3.105 8.016A2 2 0 0 0 7.97 20z"
    />
    <Path
      fill={color}
      d="M4 10a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m19 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"
    />
  </Svg>
)
