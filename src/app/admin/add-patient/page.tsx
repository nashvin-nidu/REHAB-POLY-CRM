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
import { PersonalInfo } from '@/components/admin/add-patient/personal-info';
import { ClinicalDetails } from '@/components/admin/add-patient/clinical-details';

export default function AddPatient() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', gender: 'Male',
        phone: '', email: '', injuryLevel: 'C1-C4', ais: 'AIS A',
        therapist: 'Dr. Sarah Chen', program: 'Acute Inpatient', notes: '', status: 'ACTIVE'
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

    const getInputClass = (fieldName: string, isSelect?: boolean) => {
        return `w-full bg-adm-surface border ${errors[fieldName] ? 'border-red-500' : 'border-adm-border'} rounded-md px-3 py-2 text-xs text-adm-text outline-none focus:border-adm-accent transition-colors font-sora`;
    };

    const getIconClass = (fieldName: string) => '';

    return (
        <div className="p-6 pb-20">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-20 font-bold text-adm-text tracking-tight">Register New Patient</h1>
                </div>
                <Link href="/admin/patients">
                    <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <PersonalInfo
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    getInputClass={getInputClass}
                    getIconClass={getIconClass}
                />

                <ClinicalDetails
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    getInputClass={getInputClass}
                    getIconClass={getIconClass}
                />

                <div className="flex gap-2.5 justify-end">
                    <Link href="/admin/patients"><Button variant="ghost" disabled={isSubmitting}>Cancel</Button></Link>
                    <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register Patient'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
