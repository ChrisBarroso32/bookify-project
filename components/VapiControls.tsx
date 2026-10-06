'use client';

import {AlertCircle, Clock, Mic, MicOff, X} from "lucide-react";
import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import useVapi, {CallStatus} from "@/hooks/useVapi";
import {VapiControlsProps} from "@/types";
import Image from "next/image";
import Transcript from "@/components/Transcript";
import {formatDuration} from "@/lib/utils";

const REDIRECT_DELAY_MS = 3000; // Time to read the limit message before leaving the page

const STATUS_DISPLAY: Record<CallStatus, { label: string; dotClass: string }> = {
    idle: { label: 'Ready', dotClass: 'vapi-status-dot-ready' },
    connecting: { label: 'Connecting...', dotClass: 'vapi-status-dot-connecting' },
    starting: { label: 'Starting...', dotClass: 'vapi-status-dot-connecting' },
    listening: { label: 'Listening', dotClass: 'vapi-status-dot-listening' },
    thinking: { label: 'Thinking...', dotClass: 'vapi-status-dot-thinking' },
    speaking: { label: 'Speaking', dotClass: 'vapi-status-dot-speaking' },
};

const VapiControls = ({ book, maxDurationMinutes }: VapiControlsProps) => {
    const router = useRouter();
    const {
        status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop,
        limitError, isBillingError, isTimeLimitReached, clearError, maxDurationSeconds, remainingSeconds, showTimeWarning,
    } = useVapi(book, maxDurationMinutes)

    useEffect(() => {
        if (!isTimeLimitReached) return;
        const timeout = setTimeout(() => router.push('/'), REDIRECT_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [isTimeLimitReached, router]);

    const statusDisplay = STATUS_DISPLAY[status];

    return (
        <>
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {limitError && (
                    <div className="error-banner !mb-0">
                        <div className="error-banner-content">
                            <AlertCircle className="error-banner-icon" />
                            <div className="flex-1">
                                <p className="text-red-700 font-medium">{limitError}</p>
                                {isBillingError && (
                                    <Link href="/subscriptions" className="error-banner-link">View plans</Link>
                                )}
                            </div>
                            <button onClick={clearError} className="error-banner-dismiss" aria-label="Dismiss">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {showTimeWarning && (
                    <div className="warning-banner !mb-0">
                        <div className="warning-banner-content">
                            <Clock className="warning-banner-icon" />
                            <p className="warning-banner-text">
                                {remainingSeconds} seconds left in this session.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header Card */}
                <div className="vapi-header-card">
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || "/images/book-placeholder.png"}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image !w-[120px] !h-auto"
                            priority
                        />
                        <div className="vapi-mic-wrapper relative">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting' || isTimeLimitReached}
                                aria-label={isActive ? "Stop voice assistant" : "Start voice assistant"}
                                title={isActive ? "Stop voice assistant" : "Start voice assistant"}
                                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            >
                                {isActive ? (
                                    <Mic className="size-7 text-white" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 flex-1">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b] mb-1">
                                {book.title}
                            </h1>
                            <p className="text-[#3d485e] font-medium">by {book.author}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="vapi-status-indicator">
                                <span className={`vapi-status-dot ${statusDisplay.dotClass}`} />
                                <span className="vapi-status-text">{statusDisplay.label}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">Voice: {book.persona || "Daniel"}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">
                                    {formatDuration(duration)}/{formatDuration(maxDurationSeconds)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="vapi-transcript-wrapper">
                <div className="transcript-container min-h-[400px]">
                    <Transcript
                        messages={messages}
                        currentMessage={currentMessage}
                        currentUserMessage={currentUserMessage}
                    />
                </div>
            </div>
            </div>
        </>
    )
}
export default VapiControls