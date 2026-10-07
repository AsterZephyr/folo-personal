// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AiCuteReIcon = ({
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
      d="M10.054 5.771c.308-.902 1.584-.902 1.892 0l.806 2.36a5 5 0 0 0 3.116 3.117l2.36.806c.903.308.903 1.584 0 1.892l-2.36.806a5 5 0 0 0-3.116 3.116l-.806 2.36c-.308.903-1.584.903-1.892 0l-.806-2.36a5 5 0 0 0-3.116-3.116l-2.36-.806c-.903-.308-.903-1.584 0-1.892l2.36-.806a5 5 0 0 0 3.116-3.116zM19 3l.51 1.49L21 5l-1.49.51L19 7l-.51-1.49L17 5l1.49-.51z"
    />
  </Svg>
)
