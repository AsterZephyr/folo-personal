import { useQuery } from "@tanstack/react-query"

import { followApi } from "~/lib/api-client"
import { useLocalAIConfig } from "~/lib/local-ai"

export const useAIConfiguration = () => {
  const localAI = useLocalAIConfig()
  return useQuery({
    enabled: !localAI.enabled,
    queryKey: ["aiConfiguration"],
    queryFn: async () => {
      return followApi.ai.config()
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}
