'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { patientSchema, PatientFormValues } from '@/lib/validations/patient';

// ── Infer types directly from Prisma queries ──
// We use Awaited<ReturnType<>> instead of importing types from '@prisma/client' 
// or manually defining them because:
// 1. Prisma v6 with custom output doesn't easily export flat model types
// 2. It automatically includes our specific relational `include` (like assessments)
// 3. It guarantees 100% sync with the actual query result without manual maintenance

/** A patient with their latest assessment included */
type GetPatientsResult = Awaited<ReturnType<typeof _getPatients>>;
async function _getPatients() {
    return prisma.patient.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            assessments: {
                orderBy: { date: 'desc' },
                take: 1,
            },
        },
    });
}

export type PatientWithAssessments = GetPatientsResult[number];
export type AssessmentData = PatientWithAssessments['assessments'][number];

/** A single activity entry */
type GetActivityResult = Awaited<ReturnType<typeof _getActivity>>;
async function _getActivity(limit: number) {
    return prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { patient: true },
    });
}

export type ActivityLogEntry = GetActivityResult[number];

/**
 * Fetches all patients with their latest assessment for the dashboard
 */
export async function getPatients(): Promise<
    { success: true; data: PatientWithAssessments[] } |
    { success: false; error: string }
> {
    try {
        const patients = await _getPatients();
        return { success: true, data: patients };
    } catch (error) {
        console.error('Error fetching patients:', error);
        return { success: false, error: 'Failed to fetch patients' };
    }
}

/**
 * Fetches a single patient by ID with all related data
 */
export async function getPatientById(id: number) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id },
            include: {
                assessments: { orderBy: { date: 'desc' } },
                appointments: { orderBy: { date: 'desc' } },
                emergencyContacts: true,
                assignedExercises: {
                    include: { exercise: true },
                },
            },
        });

        if (!patient) return { success: false as const, error: 'Patient not found' };

        return { success: true as const, data: patient };
    } catch (error) {
        console.error(`Error fetching patient ${id}:`, error);
        return { success: false as const, error: 'Failed to fetch patient' };
    }
}

/**
 * Fetches recent activity logs for the dashboard feed
 */
export async function getRecentActivity(limit = 10): Promise<
    { success: true; data: ActivityLogEntry[] } |
    { success: false; error: string }
> {
    try {
        const activities = await _getActivity(limit);
        return { success: true, data: activities };
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return { success: false, error: 'Failed to fetch activity logs' };
    }
}

/**
 * Creates a new patient
 */
export async function createPatient(data: PatientFormValues) {
    try {
        const validatedData = patientSchema.safeParse(data);
        if (!validatedData.success) {
            return { success: false as const, error: 'Invalid input data', issues: validatedData.error.issues };
        }

        const patient = await prisma.patient.create({
            data: {
                firstName: validatedData.data.firstName,
                lastName: validatedData.data.lastName,
                dob: new Date(validatedData.data.dob),
                gender: validatedData.data.gender,
                phone: validatedData.data.phone,
                email: validatedData.data.email,
                injuryLevel: validatedData.data.injuryLevel,
                ais: validatedData.data.ais,
                therapist: validatedData.data.therapist || null,
                program: validatedData.data.program || null,
                notes: validatedData.data.notes || null,
                status: validatedData.data.status,
                user: {
                    create: {
                        id: crypto.randomUUID(),
                        name: `${validatedData.data.firstName} ${validatedData.data.lastName}`,
                        email: validatedData.data.email,
                        role: 'patient',
                    }
                }
            }
        });

        revalidatePath('/admin/patients');
        return { success: true as const, data: patient };
    } catch (error) {
        console.error('Error creating patient:', error);
        return { success: false as const, error: 'Failed to create patient' };
    }
}

