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
import { Modal } from '@/components/ui/Modal';
import { FileUp, File, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function AddPatient() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', gender: 'Male',
        phone: '', email: '', injuryLevel: 'C1-C4', ais: 'AIS A',
        therapist: 'Dr. Sarah Chen', program: 'Acute Inpatient', notes: '', status: 'ACTIVE',
        reports: [] as { name: string, type: string, base64: string }[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportName, setReportName] = useState('');
    const [reportFile, setReportFile] = useState<File | null>(null);
    const [reportType, setReportType] = useState('pdf');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setReportFile(file);
            // Auto detect type based on file extension
            if (file.type.startsWith('image/')) {
                setReportType('photo');
            } else {
                setReportType('pdf');
            }
        }
    };

    const handleAddReport = () => {
        if (!reportName.trim()) {
            toast('Please enter a report name.', 'error');
            return;
        }
        if (!reportFile) {
            toast('Please select a file to upload.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(reportFile);
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                reports: [...prev.reports, { 
                    name: reportName, 
                    type: reportType, 
                    base64: reader.result as string 
                }]
            }));
            setReportName('');
            setReportFile(null);
            setIsModalOpen(false);
            toast('Report added successfully.', 'success');
        };
        reader.onerror = () => {
            toast('Failed to read file.', 'error');
        };
    };

    const handleRemoveReport = (index: number) => {
        setFormData(prev => ({
            ...prev,
            reports: prev.reports.filter((_, i) => i !== index)
        }));
    };

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

                {/* Reports Section */}
                <div className="bg-adm-card border border-adm-border rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-adm-border2">
                        <h2 className="text-xs font-bold uppercase tracking-wide text-adm-muted">Patient Reports</h2>
                        <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="h-8">
                            <FileUp className="w-3.5 h-3.5 mr-1.5" /> Add Report
                        </Button>
                    </div>

                    {formData.reports.length === 0 ? (
                        <div className="text-center py-6 text-adm-muted text-sm border border-dashed border-adm-border rounded-lg">
                            No reports added yet. Click "Add Report" to upload photos or PDFs.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {formData.reports.map((report, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-adm-surface border border-adm-border rounded-lg">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-md bg-adm-card flex items-center justify-center shrink-0">
                                            {report.type === 'photo' ? <ImageIcon className="w-4 h-4 text-blue-400" /> : <File className="w-4 h-4 text-red-400" />}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-sm font-medium text-adm-text truncate">{report.name}</p>
                                            <p className="text-xs text-adm-muted capitalize">{report.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveReport(idx)} className="p-1.5 text-adm-muted hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-2.5 justify-end">
                    <Link href="/admin/patients"><Button variant="ghost" disabled={isSubmitting}>Cancel</Button></Link>
                    <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register Patient'}
                    </Button>
                </div>
            </div>

            {/* Add Report Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Patient Report"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddReport}>Add Report</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-adm-muted mb-1.5">Report Name</label>
                        <input
                            type="text"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            placeholder="e.g., Initial MRI Scan"
                            className="w-full bg-adm-surface border border-adm-border rounded-md px-3 py-2 text-sm text-adm-text outline-none focus:border-adm-accent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-adm-muted mb-1.5">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full bg-adm-surface border border-adm-border rounded-md px-3 py-2 text-sm text-adm-text outline-none focus:border-adm-accent transition-colors"
                        >
                            <option value="pdf">PDF Document</option>
                            <option value="photo">Photo / Image</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-adm-muted mb-1.5">Upload File</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-adm-border border-dashed rounded-lg cursor-pointer bg-adm-surface hover:bg-adm-surface/80 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-6 h-6 mb-2 text-adm-muted" />
                                    <p className="mb-1 text-sm text-adm-text"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-adm-muted">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                            </label>
                        </div>
                        {reportFile && (
                            <div className="mt-2 text-xs text-adm-accent flex items-center">
                                <span className="truncate max-w-[250px]">Selected: {reportFile.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
