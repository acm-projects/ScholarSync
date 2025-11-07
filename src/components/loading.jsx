"use client";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#3D110F] text-[#EEEef0]">
            <div className="flex flex-col items-center gap-5">
                <div className="w-24 h-24 rounded-full border-8 border-[#EEEef0]/25 border-t-[#EEEef0] animate-spin"/>
                <div className="test-3xl font-semibold tracking-wide">Loading</div>
            </div>
        </div>
    )
}