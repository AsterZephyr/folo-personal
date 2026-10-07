import { useEffect, useMemo } from "react"

import { useLocalAIConfig } from "~/lib/local-ai"

import { setAIModelState, useAIModelState } from "../atoms/session"
import { useAIConfiguration } from "./useAIConfiguration"

export const useAIModel = () => {
  const { data: configuration, isLoading } = useAIConfiguration()
  const modelState = useAIModelState()
  const localAI = useLocalAIConfig()

  // Validate and sync persistent model with available models
  useEffect(() => {
    if (localAI.enabled || !configuration || isLoading) return

    const { selectedModel } = modelState
    const { defaultModel, availableModels = [] } = configuration

    // If no model is selected or selected model is not available, use default
    if (!selectedModel || !availableModels.includes(selectedModel)) {
      setAIModelState({
        selectedModel: defaultModel || null,
      })
    }
  }, [configuration, isLoading, modelState, localAI.enabled])

  // Get current effective model
  const currentModel = useMemo(() => {
    if (!configuration) return null

    const { selectedModel } = modelState
    const { defaultModel, availableModels = [] } = configuration

    // Return selected model if valid, otherwise fallback to default
    if (selectedModel && availableModels.includes(selectedModel)) {
      return selectedModel
    }

    return defaultModel || null
  }, [configuration, modelState])

  const changeModel = (model: string) => {
    if (!configuration?.availableModels?.includes(model)) {
      console.warn(`Model ${model} is not available in current configuration`)
      return
    }

    setAIModelState({
      selectedModel: model,
    })
  }

  if (localAI.enabled)
    return {
      data: {
        defaultModel: localAI.model,
        availableModels: [localAI.model],
        availableModelsMenu: [],
        currentModel: localAI.model,
      },
      isLoading: false,
      changeModel: () => undefined,
    }

  return {
    data: {
      defaultModel: configuration?.defaultModel,
      availableModels: configuration?.availableModels,
      availableModelsMenu: configuration?.availableModelsMenu,
      currentModel,
    },
    isLoading,
    changeModel,
  }
}
