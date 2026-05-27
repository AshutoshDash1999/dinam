/** Default timeout for AI API requests (30 seconds). */
const AI_REQUEST_TIMEOUT_MS = 30_000

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
  timeoutMs?: number
}): Promise<ChatCompletionResponse> {
  const root = params.baseUrl.replace(/\/+$/, "")
  const url = `${root}/chat/completions`

  // Create AbortController for request cancellation
  const controller = new AbortController()
  const timeout = params.timeoutMs ?? AI_REQUEST_TIMEOUT_MS
  const timeoutId = window.setTimeout(() => controller.abort(), timeout)

  try {
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
      }),
      signal: controller.signal,
    })

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
  } catch (error) {
    // Handle AbortError (timeout) specifically
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `AI request timeout after ${timeout}ms. The server may be unresponsive or overloaded. Please try again or check your API endpoint.`
      )
    }
    throw error
  } finally {
    // Always clear timeout to prevent memory leaks
    window.clearTimeout(timeoutId)
  }
}
