/// <reference types="vite/client" />

/** Web Speech API typings (Chromium voice search). */
export {}

declare global {
    interface SpeechRecognitionEvent extends Event {
        readonly resultIndex: number
        readonly results: SpeechRecognitionResultList
    }

    interface SpeechRecognitionResultList {
        readonly length: number
        item(index: number): SpeechRecognitionResult
        [index: number]: SpeechRecognitionResult
    }

    interface SpeechRecognitionResult {
        readonly length: number
        item(index: number): SpeechRecognitionAlternative
        [index: number]: SpeechRecognitionAlternative
        readonly isFinal: boolean
    }

    interface SpeechRecognitionAlternative {
        readonly transcript: string
        readonly confidence: number
    }

    interface SpeechRecognition extends EventTarget {
        lang: string
        interimResults: boolean
        continuous: boolean
        start(): void
        stop(): void
        abort(): void
        onresult:
            | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
            | null
        onerror: ((this: SpeechRecognition, ev: Event) => void) | null
        onend: ((this: SpeechRecognition, ev: Event) => void) | null
    }

    interface SpeechRecognitionConstructor {
        new (): SpeechRecognition
    }

    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor
        webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
}
