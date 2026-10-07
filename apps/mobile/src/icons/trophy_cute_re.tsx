// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const TrophyCuteReIcon = ({
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
      d="M8 20h8M6 7H4.574a1.29 1.29 0 0 0-1.265 1.543l.299 1.496A2.44 2.44 0 0 0 6 12m12-5h1.426a1.29 1.29 0 0 1 1.265 1.543l-.299 1.496A2.44 2.44 0 0 1 18 12m-6 4v4m0-4c3.717 0 6.593-3.258 6.132-6.946l-.523-4.178A1 1 0 0 0 16.618 4H7.383a1 1 0 0 0-.992.876l-.523 4.178C5.408 12.742 8.283 16 12 16Z"
    />
  </Svg>
)
