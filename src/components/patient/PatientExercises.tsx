'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface PatientExercisesProps {
    assignedExercises: any[];
}

export function PatientExercises({ assignedExercises }: PatientExercisesProps) {
    const [level, setLevel] = useState('All Exercises');
    const [activeVideo, setActiveVideo] = useState<number | null>(null);

    const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Exercises'];

    const filteredExercises = assignedExercises.filter(ex => {
        if (level === 'All Exercises') return true;
        return ex.exercise?.difficulty === level.toUpperCase();
    });

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <div className="lg:sticky lg:top-0 lg:z-50 shadow-md shrink-0">
                <div className="px-5.5 py-4 bg-gradient-to-br from-[#1c3557] to-[#1e4a7a] relative">
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <div className="text-10 text-white/50 font-medium tracking-[0.5px] uppercase mb-0.5">Physiotherapy</div>
                            <div className="text-20 font-extrabold text-white tracking-tight leading-tight">Exercise Program</div>
                        </div>
                        <div className="text-right">
                            <div className="text-22 font-extrabold text-white leading-none">
                                3 <span className="text-15 opacity-40 font-medium">/ 5</span>
                            </div>
                            <div className="text-9 text-white/50 uppercase tracking-[0.5px] mt-0.5">Completed</div>
                        </div>
                    </div>
                </div>
                <div className="flex overflow-x-auto bg-[#1c3557] px-3.5 pt-2.5 scrollbar-hide relative z-40 border-b border-[#1e4a7a]">
                    {levels.map(l => (
                        <button key={l} onClick={() => setLevel(l)} className={`px-3.5 py-2 rounded-t-lg text-11 font-bold whitespace-nowrap transition-all ${level === l ? 'bg-pat-bg text-pat-navy' : 'text-white/50 bg-transparent hover:text-white'}`}>
                            {l}
                            {l !== 'All Exercises' && <span className={`inline-block w-4 h-4 ml-1 rounded-full text-center leading-4 text-9 font-extrabold ${l === 'Beginner' ? 'bg-[#dcfce7] text-[#16a34a]' : l === 'Intermediate' ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-[#fee2e2] text-[#dc2626]'}`}>{assignedExercises.filter(ex => ex.exercise?.difficulty === l.toUpperCase()).length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-3.5 py-3 pb-20 lg:p-6 w-full max-w-container-xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-6 w-full">
                    {filteredExercises.map(ex => {
                        const exerciseInfo = ex.exercise || {};
                        // Helper to safely get the video ID
                        const getYoutubeId = (url: string) => {
                            if (!url) return null;
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                            const match = url.match(regExp);
                            return (match && match[2].length === 11) ? match[2] : null;
                        };
                        const videoId = getYoutubeId(exerciseInfo.youtubeUrl);
                        const thumbnailUrl = videoId 
                            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            : null;

                        return (
                            <div key={ex.id} className="bg-pat-card border-[1.5px] border-pat-border rounded-2xl overflow-hidden shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer" onClick={() => setActiveVideo(ex.id)}>
                                <div className="h-35 md:h-180px bg-gradient-to-br from-[#1c3557] to-[#1e4a7a] relative flex items-center justify-center group overflow-hidden">
                                    {thumbnailUrl && (
                                        <img src={thumbnailUrl} alt={exerciseInfo.name} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 z-10">
                                        <Play className="ml-0.5 text-pat-blue" fill="currentColor" size={20} />
                                    </div>
                                    <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-10 font-bold px-2 py-0.5 rounded-md uppercase tracking-[0.3px] z-10">{(exerciseInfo.category || 'Therapy').split('—')[0]}</div>
                                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-10 font-semibold px-7px py-0.5 rounded font-mono z-10">{ex.durationMins}:00</div>
                                </div>
                                <div className="p-3 lg:p-4">
                                    <div className="text-13 lg:text-14 font-extrabold text-pat-text mb-3px">{exerciseInfo.name}</div>
                                    <div className="text-11 lg:text-12 text-pat-muted truncate max-w-full mb-2" title={exerciseInfo.instructions}>{exerciseInfo.instructions}</div>
                                    <div className="flex gap-1.5 items-center mt-3">
                                        <span className="text-9 lg:text-10 font-bold uppercase py-1 px-2.5 bg-pat-bg rounded-md text-pat-muted tracking-[0.3px] border border-pat-border">{(exerciseInfo.target || '').split(',')[0]}</span>
                                        <button className="ml-auto bg-pat-blue text-white font-bold text-11 px-4 py-2 rounded-10px hover:scale-105 transition-transform z-10" onClick={(e) => { e.stopPropagation(); setActiveVideo(ex.id); }}>Start Exercise</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filteredExercises.length === 0 && (
                        <div className="text-center text-12 text-pat-muted mt-10 lg:col-span-2">No exercises found for this level.</div>
                    )}
                </div>
            </div>

            {activeVideo && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-[2px] animate-in fade-in">
                    <div className="bg-pat-card w-450px max-w-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 font-sora relative z-[101]">
                        <div className="h-250px bg-[#0d1117] relative flex flex-col items-center justify-center gap-3">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]" />
                            <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform z-10">
                                <Play className="ml-1 text-white" fill="white" size={24} />
                            </div>
                            <div className="text-white text-14 font-bold z-10 text-center px-4">{assignedExercises.find(e => e.id === activeVideo)?.exercise?.name}</div>
                        </div>
                        <div className="p-5">
                            <div className="text-15 font-extrabold text-pat-text mb-2">Exercise Details</div>
                            <div className="text-12 text-pat-muted mb-4 leading-relaxed max-h-30 overflow-y-auto pr-2 scrollbar-hide">
                                {assignedExercises.find(e => e.id === activeVideo)?.exercise?.instructions}
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 p-3 bg-pat-green rounded-xl text-white text-13 font-bold hover:bg-green-700 transition-colors shadow-sm" onClick={() => setActiveVideo(null)}>✓ Mark Complete</button>
                                <button className="px-4 py-3 bg-pat-blue-soft rounded-xl text-pat-blue text-13 font-bold hover:bg-blue-200 transition-colors shadow-sm" onClick={() => setActiveVideo(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
