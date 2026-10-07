// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FireCuteReIcon = ({
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
      d="M7 9.5C.714 14.948 5 20.5 9.5 21c-1-2-1.5-4.5 2.5-7c1 3 3 2.5 2 7c4.5-.5 6-3 6-6.5c0-3-2.5-6.5-4-8c-.5 1-.5 2-1.5 2.5c0-2-1-4.5-3.5-6c-.5 3-2.892 5.54-4 6.5Z"
    />
  </Svg>
)
