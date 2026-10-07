// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const RewindForward30CuteReIcon = ({
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
      d="m7.214 9.51l.012-.028A1.61 1.61 0 0 1 8.71 8.5h.07a1.72 1.72 0 0 1 1.211 2.942l-.106.105a1.56 1.56 0 0 1-1.1.453m-1.57 2.428l.011.027c.253.596.837.982 1.484.982h.094a1.696 1.696 0 0 0 1.152-2.94l-.228-.212A1.07 1.07 0 0 0 9 12m12-.003c-.007 4.11-2.845 7.817-7.024 8.758a9 9 0 1 1 5.03-14.43L18.5 2l-.503 2.502M15 15.5a1.5 1.5 0 0 1-1.5-1.5v-4a1.5 1.5 0 0 1 3 0v4a1.5 1.5 0 0 1-1.5 1.5"
    />
  </Svg>
)
