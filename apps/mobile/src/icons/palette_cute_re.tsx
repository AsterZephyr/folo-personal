// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const PaletteCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M8 12.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m2-4a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m5 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"
    />
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M17.902 15.484c1.322.22 2.682-.458 2.936-1.773a9 9 0 1 0-8.469 7.282c1.292-.053 1.891-1.472 1.313-2.63a2.115 2.115 0 0 1 .396-2.44l.089-.09a2.29 2.29 0 0 1 1.995-.64z"
    />
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M8 12.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm2-4a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Zm5 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0Z"
    />
  </Svg>
)
