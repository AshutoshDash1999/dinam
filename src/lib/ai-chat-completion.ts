export type ChatToolCall = {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

export type ChatCompletionAssistantMessage = {
  role: "assistant"
  content: string | null
  tool_calls?: ChatToolCall[]
}

export type ChatCompletionResponse = {
  choices?: {
    message: ChatCompletionAssistantMessage
    finish_reason?: string
  }[]
  error?: { message?: string }
}

export async function requestChatCompletion(params: {
  baseUrl: string
  apiKey: string
  model: string
  messages: Record<string, unknown>[]
  tools: Record<string, unknown>[]
  onChunk?: (text: string) => void
  signal?: AbortSignal
}): Promise<ChatCompletionResponse> {
  const root = params.baseUrl.replace(/\/+$/, "")
  const url = `${root}/chat/completions`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      tools: params.tools,
      tool_choice: "auto",
      temperature: 0.4,
      stream: params.onChunk ? true : undefined,
    }),
    signal: params.signal,
  })

  const contentType = res.headers.get("content-type") || ""
  const isStream = params.onChunk && contentType.includes("text/event-stream")

  if (!isStream || !res.ok) {
    const json: unknown = await res.json().catch(() => ({}))
    const body = json as ChatCompletionResponse

    if (!res.ok) {
      const msg =
        body.error?.message ??
        (typeof json === "object" &&
        json !== null &&
        "message" in json &&
        typeof (json as { message?: unknown }).message === "string"
          ? (json as { message: string }).message
          : `HTTP ${res.status}`)
      throw new Error(msg)
    }

    return body
  }

  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error("No response body available for streaming")
  }

  let accumulatedContent = ""
  const accumulatedToolCalls: ChatToolCall[] = []
  let finishReason: string | undefined

  const decoder = new TextDecoder("utf-8")
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith("data:")) continue

        const dataStr = trimmed.slice(5).trim()
        if (dataStr === "[DONE]") {
          break
        }

        try {
          const parsed = JSON.parse(dataStr) as {
            choices?: {
              delta?: {
                content?: string | null
                tool_calls?: {
                  index?: number
                  id?: string
                  type?: "function"
                  function?: {
                    name?: string
                    arguments?: string
                  }
                }[]
              }
              finish_reason?: string
            }[]
          }

          const choice = parsed.choices?.[0]
          if (choice) {
            if (choice.finish_reason) {
              finishReason = choice.finish_reason
            }
            const delta = choice.delta
            if (delta) {
              if (delta.content) {
                accumulatedContent += delta.content
                if (params.onChunk) {
                  params.onChunk(delta.content)
                }
              }
              if (delta.tool_calls) {
                for (const tc of delta.tool_calls) {
                  const idx = tc.index
                  if (idx !== undefined) {
                    if (!accumulatedToolCalls[idx]) {
                      accumulatedToolCalls[idx] = {
                        id: "",
                        type: "function",
                        function: { name: "", arguments: "" },
                      }
                    }
                    const existing = accumulatedToolCalls[idx]
                    if (tc.id) existing.id = tc.id
                    if (tc.type) existing.type = tc.type
                    if (tc.function) {
                      if (tc.function.name) existing.function.name += tc.function.name
                      if (tc.function.arguments) existing.function.arguments += tc.function.arguments
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.warn("Failed to parse SSE JSON chunk:", dataStr, err)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return {
    choices: [
      {
        message: {
          role: "assistant",
          content: accumulatedContent || null,
          tool_calls: accumulatedToolCalls.length > 0 ? accumulatedToolCalls : undefined,
        },
        finish_reason: finishReason,
      },
    ],
  }
}
