// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const FolderOpenCuteReIcon = ({
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
      d="M18 20H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5.52a1 1 0 0 1 .78.375l1.4 1.75a1 1 0 0 0 .78.375H19a1 1 0 0 1 1 1V10M4.353 20h13.903a1 1 0 0 0 .958-.713l2.4-8A1 1 0 0 0 20.656 10H6.745a1 1 0 0 0-.958.713l-2.392 8A1 1 0 0 0 4.353 20Z"
    />
  </Svg>
)
