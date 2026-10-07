// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const TrainCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M1 7c0-1.101.89-2 1.998-2H12c3.224 0 5.942 1.075 7.868 2.589C21.759 9.075 23 11.085 23 13c0 .842-.258 1.56-.713 2.14c-.443.566-1.034.95-1.636 1.214c-1.186.518-2.597.646-3.651.646H2.994A1.995 1.995 0 0 1 1 15zm2 3h4V7H3zm10 0H9V7h3q.51 0 1 .04zm2 0h4.551a8 8 0 0 0-.919-.839c-.962-.756-2.19-1.395-3.632-1.778z"
      clipRule="evenodd"
    />
    <Path fill={color} d="M1 19a1 1 0 0 1 1-1h19a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1" />
  </Svg>
)
