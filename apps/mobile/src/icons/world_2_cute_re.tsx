// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const World2CuteReIcon = ({
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
      d="m14.165 3.262l-.406 1.977a2 2 0 0 1-1.514 1.548l-.408.093a2 2 0 0 0-1.527 2.28l.175 1.048a1 1 0 0 1-1.28 1.12l-1.29-.394A2 2 0 0 1 6.5 9.02V4.876M15 20.5l-.858-3.002a2 2 0 0 0-.508-.864l-1.239-1.239a.5.5 0 0 1 .041-.744L14 13.4a1 1 0 0 1 1.072-.114l1.481.74a2 2 0 0 1 1.088 1.523l.418 3.106M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
    />
  </Svg>
)
