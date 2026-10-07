// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FastForwardCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.388 6.863a.328.328 0 0 1 .468-.263c.703.327 2.249 1.09 4.205 2.313a41 41 0 0 1 4 2.827a.33.33 0 0 1 0 .514c-.58.473-1.966 1.553-4 2.825c-1.982 1.24-3.51 1.993-4.206 2.316a.328.328 0 0 1-.467-.263c-.09-.804-.258-2.645-.258-5.135s.168-4.329.258-5.134Z"
    />
    <Path
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.388 6.863a.328.328 0 0 1 .468-.263c.703.327 2.249 1.09 4.206 2.313a41 41 0 0 1 3.999 2.827a.33.33 0 0 1 0 .514c-.58.473-1.966 1.553-4 2.825c-1.982 1.24-3.51 1.993-4.206 2.316a.328.328 0 0 1-.467-.263c-.09-.804-.258-2.645-.258-5.135s.168-4.329.258-5.134Z"
    />
  </Svg>
)
