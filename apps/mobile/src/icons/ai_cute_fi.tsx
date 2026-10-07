// Adapted to React Native by Folo Personal from Apache-2.0 MingCute; see icons/mingcute-free/NOTICE.md.
import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

export const AiCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
  ...props
}: SvgProps & { width?: number; height?: number; color?: string }) => (
  <Svg {...props} width={width} height={height} fill={color} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M19 2a1 1 0 0 1 .946.677l.35 1.026l1.027.35a1 1 0 0 1 0 1.893l-1.026.35l-.35 1.027a1 1 0 0 1-1.893 0l-.35-1.026l-1.027-.35a1 1 0 0 1 0-1.893l1.026-.35l.35-1.027A1 1 0 0 1 19 2M9.107 5.448c.617-1.805 3.17-1.805 3.786 0l.806 2.36a4 4 0 0 0 2.493 2.493l2.36.806c1.805.617 1.805 3.17 0 3.786l-2.36.806a4 4 0 0 0-2.493 2.493l-.806 2.36c-.617 1.805-3.17 1.805-3.786 0l-.806-2.36a4 4 0 0 0-2.492-2.493l-2.36-.806c-1.806-.617-1.806-3.17 0-3.786l2.36-.806A4 4 0 0 0 8.3 7.81z"
      clipRule="evenodd"
    />
  </Svg>
)
