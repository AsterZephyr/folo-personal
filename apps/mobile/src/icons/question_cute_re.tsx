// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const QuestionCuteReIcon = ({
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
      d="M12 17h.002m-2.627-6.875a2.625 2.625 0 1 1 3.601 2.438c-.512.205-.976.635-.976 1.187V14m9-2a9 9 0 1 1-18 0a9 9 0 0 1 18 0"
    />
  </Svg>
)
