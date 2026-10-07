import type { BizUIMessage, LocalContextSnapshot, SendingUIMessage } from "./types"

export function findLocalSnapshot(messages: BizUIMessage[], messageId: string) {
  return messages
    .flatMap((message) => message.parts)
    .filter((part) => part.type === "data-local-context")
    .findLast((part) => part.data.messageId === messageId)?.data
}

/** Keep evidence on the user turn before the SDK removes its assistant during regeneration. */
export function bindLocalSnapshotsToUsers(messages: BizUIMessage[]): BizUIMessage[] {
  const snapshots = new Map<string, LocalContextSnapshot>()
  for (const message of messages) {
    for (const part of message.parts) {
      if (part.type === "data-local-context") snapshots.set(part.data.messageId, part.data)
    }
  }
  return messages.map((message) => {
    const snapshot = snapshots.get(message.id)
    if (message.role !== "user" || !snapshot) return message
    const existing = message.parts.find((part) => part.type === "data-local-context")
    if (existing?.data === snapshot) return message
    return {
      ...message,
      parts: [
        ...message.parts.filter((part) => part.type !== "data-local-context"),
        { type: "data-local-context" as const, data: snapshot },
      ],
    }
  })
}

/** A retry has a new user ID but still refers to the original question's evidence. */
export function copyLocalSnapshotForRetry(
  retry: SendingUIMessage,
  originalId: string,
  messages: BizUIMessage[],
): SendingUIMessage {
  const snapshot = findLocalSnapshot(messages, originalId)
  if (!snapshot) return retry
  return {
    ...retry,
    parts: [
      ...retry.parts.filter((part) => part.type !== "data-local-context"),
      { type: "data-local-context", data: { ...snapshot, messageId: retry.id } },
    ],
  }
}
