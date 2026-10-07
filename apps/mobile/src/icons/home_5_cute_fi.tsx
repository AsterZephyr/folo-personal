// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const Home5CuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M13.228 2.688a2 2 0 0 0-2.456 0l-8.384 6.52C1.636 9.795 2.05 11 3.003 11h1.092l.82 8.199a2 2 0 0 0 1.99 1.8h10.19a2 2 0 0 0 1.99-1.8l.82-8.2h1.092c.952 0 1.368-1.205.615-1.79zM12 16a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
      clipRule="evenodd"
    />
  </Svg>
)
