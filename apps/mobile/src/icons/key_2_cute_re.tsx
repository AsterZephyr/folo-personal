// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Key2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path fill={color} d="M16.24 8.26a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0" />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.633 13.913a5.502 5.502 0 0 0 6.29-8.84a5.5 5.5 0 0 0-9.122 5.587l-6.08 6.081v2.829h4.242v-2.83h2.828v-2.828z"
      clipRule="evenodd"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16.24 8.26a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
