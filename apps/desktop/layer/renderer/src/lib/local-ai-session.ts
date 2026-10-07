const LOCAL_CHAT_IDS_KEY = "folo-personal-local-chat-ids"
export function isLocalAIChat(chatId: string) {
  const ids: unknown = JSON.parse(localStorage.getItem(LOCAL_CHAT_IDS_KEY) || "[]")
  return Array.isArray(ids) && ids.includes(chatId)
}
export function markLocalAIChat(chatId: string) {
  const stored: unknown = JSON.parse(localStorage.getItem(LOCAL_CHAT_IDS_KEY) || "[]")
  const ids = Array.isArray(stored)
    ? stored.filter((id): id is string => typeof id === "string")
    : []
  localStorage.setItem(LOCAL_CHAT_IDS_KEY, JSON.stringify([...new Set([...ids, chatId])]))
}
