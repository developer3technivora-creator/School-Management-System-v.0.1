import type { User as SupabaseUser } from '@supabase/supabase-js';

// Re-exporting SupabaseUser as User for local usage.
export type User = SupabaseUser;

// GENERAL TYPES
export type Theme = 'light' | 'dark';

export enum Role {
    School = 'School Administration',
    Parent = 'Parent/Guardian',
    Student = 'Student',
    Teacher = 'Teacher',
    Transport = 'Transport Staff',
    ECommerce = 'E-Commerce Operator',
}

// STUDENT INFORMATION MANAGEMENT SYSTEM (SIMS) TYPES
export interface Student {
    id: string;
    student_id: string;
    photo_url?: string;

    personal_info: {
        full_name: string;
        date_of_birth: string;
        gender: 'Male' | 'Female' | 'Other' | '';
        address: string;
    };

    academic_info: {
        grade: string;
        enrollment_status: 'Enrolled' | 'Withdrawn' | 'Graduated' | 'Pending';
        admission_status?: {
            schoolName: string;
            studentId: string;
            admissionDate: string;
        } | null;
    };

    contact_info: {
        parent_guardian: {
            name: string;
            phone: string;
            email: string;
        };
        emergency_contact: {
            name: string;
            phone: string;
        };
    };
}


export interface CourseGrade {
    id: string;
    courseName: string;
    semester: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
}

export interface HealthRecord {
    studentId: string;
    bloodType: string;
    allergies: string[];
    medicalConditions: string[];
    medications: { name: string; dosage: string; frequency: string; reason: string; }[];
    emergencyContact: { name: string; relationship: string; phone: string; };
    physician: { name: string; clinic: string; phone: string; };
    vaccinations: { id: string; vaccineName: string; dateAdministered: string; administeredBy: string; }[];
    lastHealthCheckupDate: string;
}

// ATTENDANCE TYPES
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    status: AttendanceStatus;
    notes?: string;
}

// FINANCIAL TYPES
export type FeeStatus = 'Paid' | 'Due' | 'Overdue';

export interface InvoiceItem {
    id: string;
    description: string;
    amount: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    studentId: string;
    status: FeeStatus;
    items: InvoiceItem[];
    totalAmount: number;
    issueDate: string;
    dueDate: string;
    paidDate?: string;
}

// ANNOUNCEMENT TYPES
export type AnnouncementAudience = Role;

export interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
    audience: AnnouncementAudience[];
}

// CALENDAR & EVENT TYPES
export enum EventCategory {
    Academic = 'Academic',
    Holiday = 'Holiday',
    Sports = 'Sports',
    Meeting = 'Meeting',
    Other = 'Other',
}

export interface SchoolEvent {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    category: EventCategory;
}

// TIMETABLE TYPES
export interface TimetableEntry {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    time: string;
    subject: Subject | 'Lunch' | 'Free Period';
    teacher: string;
    room: string;
}

// COURSE MANAGEMENT TYPES
export enum Subject {
    Mathematics = 'Mathematics',
    Science = 'Science',
    English = 'English',
    History = 'History',
    Art = 'Art',
    Music = 'Music',
    PhysicalEducation = 'Physical Education',
    ComputerScience = 'Computer Science',
    ForeignLanguage = 'Foreign Language',
}

export interface Course {
    id: string;
    courseName: string;
    courseCode: string;
    gradeLevel: string;
    subject: Subject;
    description?: string;
}

// HOMEWORK TYPES
export interface Homework {
    id: string;
    title: string;
    instructions: string;
    subject: Subject;
    gradeLevel: string;
    teacher: string;
    assignedDate: string;
    dueDate: string;
    attachmentLink?: string;
}

// ADMINISTRATION & STAFF TYPES
export enum StaffRole {
    Principal = 'Principal',
    Teacher = 'Teacher',
    Counselor = 'Counselor',
    Librarian = 'Librarian',
    Admin = 'Administrator',
}

export type EmploymentStatus = 'Active' | 'On Leave' | 'Terminated';

export interface StaffMember {
    id: string;
    staffId: string;
    fullName: string;
    role: StaffRole;
    email: string;
    phone: string;
    joiningDate: string;
    status: EmploymentStatus;
}

export interface AuthUser {
    id: string;
    displayName: string;
    email: string;
    provider: 'email' | 'google';
    createdAt: string;
    lastSignInAt: string;
}


// PARENTAL COMMUNICATION & PROFILE TYPES
export interface ParentMessage {
    id: string;
    parentId: string;
    parentName: string;
    conversation: {
        id: string;
        sender: 'parent' | 'school';
        text: string;
        timestamp: string;
    }[];
}

export enum GuardianRelation {
    Father = 'Father',
    Mother = 'Mother',
    Guardian = 'Legal Guardian',
}

export interface GuardianProfile {
    id: string;
    userId: string;
    isPrimary: boolean;
    relation: GuardianRelation | '';
    fullName: string;
    email: string | undefined;
    phone: string;
    address: string;
}

export interface ChildDocument {
    id: string;
    type: string;
    name: string;
    url?: string;
    file: File;
    uploadProgress?: number;
    error?: string;
}

export interface ChildProfile {
    id: string;
    guardianId: string;
    fullName: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    age: number | '';
    grade: string;
    hobbies: string;
    documents: ChildDocument[];
    admissionStatus?: {
        schoolName: string;
        studentId: string;
        admissionDate: string;
    } | null;
}

// SHAREABLE CODE TYPES
export type ShareCodeType = 'enquiry' | 'admission';

export interface ShareableCode {
    id: string;
    code: string;
    type: ShareCodeType;
    user_id: string; // parent's user id
    child_id: string; // associated child id
    is_active: boolean;
    expires_at?: string;
    created_at: string;
}

export interface ChildForCodeSelection {
    id: string;
    fullName: string;
}

export interface CodeLookupResult {
    parent: {
        full_name: string;
        email: string;
        phone: string;
        address: string;
        relation: GuardianRelation | '';
    };
    child: {
        full_name: string;
        grade: string;
        age: number;
        gender: 'Male' | 'Female' | 'Other' | '';
        hobbies: string;
        documents: { type: string, name: string, url: string }[];
    };
    code: ShareableCode;
}

// SCHOOL TYPES
export interface School {
    id: string;
    user_id: string;
    name: string;
    code: string;
    admin_username: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    created_at: string;
    // New detailed profile fields
    city?: string | null;
    state?: string | null;
    country?: string | null;
    school_type?: string | null;
    board?: string | null;
    principal_name?: string | null;
    logo_url?: string | null;
    is_active?: boolean;
}

export interface SchoolStudent {
    id: string;
    school_id: string;
    student_id: string;
    student_unique_id: string;
    parent_user_id: string;
    added_date: string;
    source_code?: string;
}

export interface CodeLookupLog {
    id: string;
    school_user_id: string;
    code: string;
    result_status: 'Success' | 'Invalid' | 'Expired';
    code_type?: 'enquiry' | 'admission';
    lookup_time: string;
}

export interface AdmittedStudentView {
    enrollment_id: string;
    unique_student_id: string;
    admission_date: string;
    student_name: string;
    student_grade: string;
    student_age: number | '';
    parent_name: string;
    parent_email?: string | null;
    parent_phone?: string | null;
}

// MEETING MANAGEMENT TYPES
export enum MeetingType {
    ParentTeacher = 'Parent-Teacher',
    Staff = 'Staff',
    Board = 'Board',
    IEP = 'IEP', // Individualized Education Program
    Other = 'Other',
}

export interface Attendee {
    id: string;
    name: string;
    role: string; // Can be Teacher, Parent, Student, Admin, etc.
}

export interface Meeting {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    type: MeetingType;
    locationOrLink: string;
    attendees: Attendee[];
    agenda?: string;
}

// TRANSPORT MANAGEMENT TYPES
export interface Vehicle {
    id: string;
    vehicleNumber: string;
    model: string;
    capacity: number;
    status: 'Active' | 'Under Maintenance' | 'Inactive';
    nextServiceDate: string;
    driverName: string; 
}

export interface RouteStop {
    id: string;
    name: string;
    pickupTime: string;
    dropoffTime: string;
    assignedStudents: { id: string; name: string }[];
}

export interface BusRoute {
    id: string;
    routeName: string;
    routeNumber: string;
    vehicleId: string;
    stops: RouteStop[];
}

export interface TransportAlert {
    id: string;
    routeId: string;
    message: string;
    timestamp: string;
    severity: 'Info' | 'Warning' | 'Critical';
}