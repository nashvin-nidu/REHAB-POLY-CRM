'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { patientSchema } from '@/lib/validations/patient';
import { createPatient } from '@/actions/patient';
import { z } from 'zod';

export default function AddPatient() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', gender: 'Male',
        phone: '', email: '', injuryLevel: 'C1-C4', ais: 'AIS A',
        therapist: 'Dr. Sarah Chen', program: 'Acute Inpatient', notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        }
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            setErrors({});

            const validatedData = patientSchema.parse(formData);
            const result = await createPatient(validatedData);

            if (!result.success) {
                if (result.issues) {
                    const formattedErrors: Record<string, string> = {};
                    result.issues.forEach(issue => {
                        if (issue.path[0]) {
                            formattedErrors[issue.path[0].toString()] = issue.message;
                        }
                    });
                    setErrors(formattedErrors);
                    toast('Please fix the errors in the form.', 'error');
                } else {
                    toast(result.error || 'Failed to register patient.', 'error');
                }
                return;
            }

            toast('Patient registered successfully.', 'success');
            router.push('/admin/patients');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.issues.forEach((err: z.core.$ZodIssue) => {
                    if (err.path[0]) {
                        formattedErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(formattedErrors);
                toast('Please fill all required fields correctly.', 'error');
            } else {
                toast('An unexpected error occurred.', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 pb-20 max-w-4xl">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-20 font-bold text-adm-text tracking-tight">Register New Patient</h1>
                </div>
                <Link href="/admin/patients">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                </Link>
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl p-6 mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-adm-muted mb-4 pb-2.5 border-b border-adm-border2">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">First Name *</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={`w-full bg-adm-surface border ${errors.firstName ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`} />
                        {errors.firstName && <span className="text-red-500 text-[10px] mt-1 block">{errors.firstName}</span>}
                    </div>
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Last Name *</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Mitchell" className={`w-full bg-adm-surface border ${errors.lastName ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`} />
                        {errors.lastName && <span className="text-red-500 text-[10px] mt-1 block">{errors.lastName}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Date of Birth *</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.dob ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`} />
                        {errors.dob && <span className="text-red-500 text-[10px] mt-1 block">{errors.dob}</span>}
                    </div>
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.gender ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`}>
                            <option>Male</option><option>Female</option><option>Non-binary</option>
                        </select>
                        {errors.gender && <span className="text-red-500 text-[10px] mt-1 block">{errors.gender}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Phone *</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 555-000-0000" className={`w-full bg-adm-surface border ${errors.phone ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`} />
                        {errors.phone && <span className="text-red-500 text-[10px] mt-1 block">{errors.phone}</span>}
                    </div>
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="patient@email.com" className={`w-full bg-adm-surface border ${errors.email ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`} />
                        {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
                    </div>
                </div>
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl p-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wide text-adm-muted mb-4 pb-2.5 border-b border-adm-border2">SCI Clinical Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Injury Level *</label>
                        <select name="injuryLevel" value={formData.injuryLevel} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.injuryLevel ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`}>
                            <option>C1-C4</option><option>C5-C8</option><option>T1-T6</option><option>T7-T12</option><option>L1-L5</option><option>S1-S5</option>
                        </select>
                        {errors.injuryLevel && <span className="text-red-500 text-[10px] mt-1 block">{errors.injuryLevel}</span>}
                    </div>
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">AIS Classification *</label>
                        <select name="ais" value={formData.ais} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.ais ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`}>
                            <option>AIS A</option><option>AIS B</option><option>AIS C</option><option>AIS D</option><option>AIS E</option>
                        </select>
                        {errors.ais && <span className="text-red-500 text-[10px] mt-1 block">{errors.ais}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3.5">
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Assigned Therapist</label>
                        <select name="therapist" value={formData.therapist} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.therapist ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`}>
                            <option>Dr. Sarah Chen</option><option>Mark Rivera, PT</option><option>Dr. Priya Nair</option><option>James Wong, OT</option>
                        </select>
                        {errors.therapist && <span className="text-red-500 text-[10px] mt-1 block">{errors.therapist}</span>}
                    </div>
                    <div>
                        <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Program</label>
                        <select name="program" value={formData.program} onChange={handleChange} className={`w-full bg-adm-surface border ${errors.program ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`}>
                            <option>Acute Inpatient</option><option>Sub-acute Rehab</option><option>Outpatient PT</option><option>Home-based</option>
                        </select>
                        {errors.program && <span className="text-red-500 text-[10px] mt-1 block">{errors.program}</span>}
                    </div>
                </div>
                <div>
                    <label className="block text-11 font-semibold text-adm-muted mb-1.5 uppercase tracking-wide">Clinical Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="ASIA scores, precautions, assistive devices..." className={`w-full bg-adm-surface border ${errors.notes ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors min-h-20 font-sora`} />
                    {errors.notes && <span className="text-red-500 text-[10px] mt-1 block">{errors.notes}</span>}
                </div>
            </div>

            <div className="flex gap-2.5 justify-end">
                <Link href="/admin/patients"><Button variant="ghost" disabled={isSubmitting}>Cancel</Button></Link>
                <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register Patient'}
                </Button>
            </div>
        </div>
    );
}
