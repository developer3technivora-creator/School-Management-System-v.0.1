import { Role, StaffRole, EventCategory, Subject, MeetingType } from '../types';
import type { 
    Student, 
    StaffMember, 
    SchoolEvent, 
    AuthUser, 
    Announcement, 
    AttendanceRecord, 
    Invoice, 
    ChildProfile, 
    CourseGrade, 
    Course,
    Homework,
    Meeting,
    HealthRecord,
    ParentMessage,
    TimetableEntry,
    Vehicle, 
    BusRoute, 
    RouteStop, 
    TransportAlert
} from '../types';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const mockStudents: Student[] = [
    { 
        id: '1', 
        student_id: 'S-2024001',
        personal_info: { full_name: 'Alice Johnson', date_of_birth: '2008-05-12', gender: 'Female', address: '123 Oak Ave, Springfield' },
        academic_info: { grade: '10th Grade', enrollment_status: 'Enrolled' },
        contact_info: { 
            parent_guardian: { name: 'John Johnson', phone: '555-1234', email: 'j.johnson@email.com' },
            emergency_contact: { name: 'Jane Johnson', phone: '555-5678' }
        }
    },
    { 
        id: '2', 
        student_id: 'S-2024002',
        personal_info: { full_name: 'Alex Johnson', date_of_birth: '2011-02-20', gender: 'Male', address: '123 Oak Ave, Springfield' },
        academic_info: { grade: '8th Grade', enrollment_status: 'Enrolled' },
        contact_info: { 
            parent_guardian: { name: 'John Johnson', phone: '555-1234', email: 'j.johnson@email.com' },
            emergency_contact: { name: 'Jane Johnson', phone: '555-5678' }
        }
    },
    { 
        id: '3', 
        student_id: 'S-2024003',
        personal_info: { full_name: 'Charlie Brown', date_of_birth: '2007-11-30', gender: 'Male', address: '789 Pine Ln, Springfield' },
        academic_info: { grade: '11th Grade', enrollment_status: 'Withdrawn' },
        contact_info: { 
            parent_guardian: { name: 'David Brown', phone: '555-3456', email: 'd.brown@email.com' },
            emergency_contact: { name: 'Susan Brown', phone: '555-7890' }
        }
    },
];

export const mockStaff: StaffMember[] = [
    { id: 'st1', staffId: 'T-001', fullName: 'John Davis', role: StaffRole.Principal, email: 'j.davis@school.edu', phone: '555-0101', joiningDate: '2010-08-15', status: 'Active' },
    { id: 'st2', staffId: 'T-002', fullName: 'Emily White', role: StaffRole.Teacher, email: 'e.white@school.edu', phone: '555-0102', joiningDate: '2015-09-01', status: 'Active' },
    { id: 'st3', staffId: 'T-003', fullName: 'Michael Green', role: StaffRole.Counselor, email: 'm.green@school.edu', phone: '555-0103', joiningDate: '2018-03-10', status: 'Active' },
    { id: 'st4', staffId: 'T-004', fullName: 'Sarah Blue', role: StaffRole.Librarian, email: 's.blue@school.edu', phone: '555-0104', joiningDate: '2020-01-20', status: 'On Leave' },
    { id: 'st5', staffId: 'T-005', fullName: 'David Black', role: StaffRole.Teacher, email: 'd.black@school.edu', phone: '555-0105', joiningDate: '2019-07-22', status: 'Active' },
    { id: 'st6', staffId: 'T-006', fullName: 'Laura Grey', role: StaffRole.Admin, email: 'l.grey@school.edu', phone: '555-0106', joiningDate: '2021-02-11', status: 'Active' },
    { id: 'st7', staffId: 'T-007', fullName: 'Robert Brown', role: StaffRole.Teacher, email: 'r.brown@school.edu', phone: '555-0107', joiningDate: '2014-08-25', status: 'Terminated' },
    { id: 'st8', staffId: 'T-008', fullName: 'Clara Pink', role: StaffRole.Teacher, email: 'c.pink@school.edu', phone: '555-0108', joiningDate: '2022-08-25', status: 'Active' }, // Art
    { id: 'st9', staffId: 'T-009', fullName: 'Leo Indigo', role: StaffRole.Teacher, email: 'l.indigo@school.edu', phone: '555-0109', joiningDate: '2021-08-25', status: 'Active' }, // Music
];

export const mockEvents: SchoolEvent[] = [
    { id: 'evt1', title: 'Parent-Teacher Conference', description: 'Discuss student progress.', startDate: '2024-10-05', category: EventCategory.Meeting },
    { id: 'evt2', title: 'Science Fair', description: 'Annual school-wide science fair.', startDate: '2024-11-15', endDate: '2024-11-16', category: EventCategory.Academic },
    { id: 'evt3', title: 'Winter Break', description: 'School closed for winter break.', startDate: '2024-12-23', endDate: '2025-01-03', category: EventCategory.Holiday },
    { id: 'evt4', title: 'Championship Football Game', description: 'Go Tigers!', startDate: '2024-10-18', category: EventCategory.Sports },
    { id: 'evt5', title: 'Guest Speaker: AI in Education', description: 'Join us for an exciting talk in the auditorium.', startDate: getTodayDateString(), category: EventCategory.Academic },
];

export const mockAuthUsers: AuthUser[] = [
    { id: '2e55fa3d-ea11-4c97-8b03-19328512a543', displayName: 'Sanjay Dutt Sharma', email: 'sdsajmer@gmail.com', provider: 'email', createdAt: '2025-10-12T13:06:34Z', lastSignInAt: '2025-10-12T13:06:48Z' },
    { id: '8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', displayName: 'Jane Doe', email: 'jane.doe@example.com', provider: 'google', createdAt: '2025-10-11T10:20:00Z', lastSignInAt: '2025-10-12T09:15:30Z' },
    { id: 'c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f', displayName: 'John Smith', email: 'john.smith@example.com', provider: 'email', createdAt: '2025-10-10T15:00:12Z', lastSignInAt: '2025-10-10T15:00:12Z' },
];

export const mockAnnouncements: Announcement[] = [
    { id: 'anc1', title: 'Welcome Back to School!', content: 'We are thrilled to welcome all students and staff back for the new academic year. Let\'s make it a great one!', author: 'Principal Thompson', date: '2024-08-15', audience: [Role.Student, Role.Parent, Role.Teacher] },
    { id: 'anc2', title: 'Parent-Teacher Conference Day', content: 'Parent-teacher conferences will be held on October 5th. Please sign up for a slot with your child\'s teachers.', author: 'Admin Office', date: '2024-09-20', audience: [Role.Parent, Role.Teacher] },
    { id: 'anc3', title: 'Upcoming Science Fair', content: 'The annual science fair is just around the corner! All students are encouraged to participate. Project submissions are due by November 1st.', author: 'Mr. Davis (Science Dept.)', date: '2024-09-25', audience: [Role.Student] },
    { id: 'anc4', title: 'School Picture Day', content: 'School picture day will be on October 30th. Remember to wear your school uniform!', author: 'Admin Office', date: '2024-10-10', audience: [Role.Student, Role.Parent] },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
    // For Alice (id: 1)
    { id: 'att_p1_1', studentId: '1', date: '2024-10-25', status: 'Present' },
    { id: 'att_p1_2', studentId: '1', date: '2024-10-24', status: 'Present' },
    { id: 'att_p1_3', studentId: '1', date: '2024-10-23', status: 'Absent', notes: 'Feeling unwell' },
    { id: 'att_p1_4', studentId: '1', date: '2024-10-22', status: 'Present' },
    { id: 'att_p1_5', studentId: '1', date: '2024-10-21', status: 'Late', notes: 'Arrived at 9:15 AM' },
    // For Alex (id: 2)
    { id: 'att_p2_1', studentId: '2', date: '2024-10-25', status: 'Present' },
    { id: 'att_p2_2', studentId: '2', date: '2024-10-24', status: 'Excused', notes: 'Doctor\'s appointment' },
    { id: 'att_p2_3', studentId: '2', date: '2024-10-23', status: 'Present' },
    // For Charlie (id: 3)
    { id: 'att3', studentId: '3', date: getTodayDateString(), status: 'Late', notes: 'Arrived at 9:15 AM' },
];

export const mockInvoices: Invoice[] = [
    { id: 'inv1', invoiceNumber: 'INV-2024-001', studentId: '1', status: 'Paid', items: [{id: 'i1', description: 'Annual Tuition Fee', amount: 5000}], totalAmount: 5000, issueDate: '2024-08-01', dueDate: '2024-09-01', paidDate: '2024-08-15' },
    { id: 'inv2', invoiceNumber: 'INV-2024-002', studentId: '2', status: 'Due', items: [{id: 'i2', description: 'Annual Tuition Fee', amount: 4800}, {id: 'i3', description: 'Lab Fee', amount: 150}], totalAmount: 4950, issueDate: '2024-08-01', dueDate: '2024-09-01' },
    { id: 'inv3', invoiceNumber: 'INV-2024-003', studentId: '3', status: 'Overdue', items: [{id: 'i4', description: 'Spring Semester Fee', amount: 2500}], totalAmount: 2500, issueDate: '2024-01-15', dueDate: '2024-02-15' },
    { id: 'inv4', invoiceNumber: 'INV-2024-004', studentId: '1', status: 'Paid', items: [{id: 'i5', description: 'Annual Tuition Fee', amount: 5000}], totalAmount: 5000, issueDate: '2024-08-01', dueDate: '2024-09-01', paidDate: '2024-08-15' },
    { id: 'inv5', invoiceNumber: 'INV-2024-005', studentId: '2', status: 'Due', items: [{id: 'i6', description: 'Annual Tuition Fee', amount: 4800}, {id: 'i7', description: 'Lab Fee', amount: 150}], totalAmount: 4950, issueDate: '2024-08-01', dueDate: '2024-09-01' },
    { id: 'inv6', invoiceNumber: 'INV-2024-006', studentId: '1', status: 'Overdue', items: [{id: 'i8', description: 'Spring Semester Fee', amount: 2500}], totalAmount: 2500, issueDate: '2024-01-15', dueDate: '2024-02-15' },
];

export const mockChildren: ChildProfile[] = [
    { id: 'child1', guardianId: 'user1', fullName: 'Alice Johnson', gender: 'Female', age: 15, grade: '10th Grade', hobbies: 'Reading, Painting', documents: [] },
    { id: 'child2', guardianId: 'user1', fullName: 'Alex Johnson', gender: 'Male', age: 13, grade: '8th Grade', hobbies: 'Soccer, Video Games', documents: [] },
];

export const mockAcademicData: { [studentId: string]: CourseGrade[] } = {
    '1': [
        { id: 'g1', courseName: 'Algebra II', semester: 'Fall 2024', grade: 'A', score: 94 },
        { id: 'g2', courseName: 'English Literature', semester: 'Fall 2024', grade: 'B', score: 85 },
        { id: 'g3', courseName: 'World History', semester: 'Fall 2024', grade: 'A', score: 98 },
        { id: 'g4', courseName: 'Physics', semester: 'Spring 2024', grade: 'B', score: 89 },
        { id: 'g5', courseName: 'Chemistry', semester: 'Spring 2024', grade: 'C', score: 78 },
        { id: 'g6', courseName: 'Art', semester: 'Spring 2024', grade: 'A', score: 95 },
    ],
    '2': [
        { id: 'g5', courseName: 'Pre-Algebra', semester: 'Fall 2024', grade: 'B', score: 88 },
        { id: 'g6', courseName: 'Life Science', semester: 'Fall 2024', grade: 'A', score: 92 },
    ],
    '3': [],
    'student-rishabh-01': [
        { id: 'g7', courseName: 'Mathematics', semester: 'Fall 2024', grade: 'A', score: 95 },
        { id: 'g8', courseName: 'English', semester: 'Fall 2024', grade: 'A', score: 92 },
        { id: 'g9', courseName: 'Science', semester: 'Fall 2024', grade: 'B', score: 88 },
    ],
};

export const mockCourses: Course[] = [
  { id: 'C011', courseName: 'English', courseCode: 'ENG-011', gradeLevel: '1st Grade', subject: Subject.English, description: 'Introduces basic phonics, reading, and writing skills for first graders.' },
  { id: 'C012', courseName: 'English Composition', courseCode: 'ENG-012', gradeLevel: '1st Grade', subject: Subject.English, description: 'Focuses on forming simple sentences and basic storytelling.' },
  { id: 'C013', courseName: 'Hindi', courseCode: 'HIN-013', gradeLevel: '1st Grade', subject: Subject.ForeignLanguage, description: 'Introduction to Hindi alphabet and basic vocabulary.' },
  { id: 'C014', courseName: 'Mathematics', courseCode: 'MATH-014', gradeLevel: '1st Grade', subject: Subject.Mathematics, description: 'Covers counting, addition, subtraction, and basic shapes.' },
  { id: 'C015', courseName: 'Science', courseCode: 'SCI-015', gradeLevel: '1st Grade', subject: Subject.Science, description: 'Exploration of the natural world, including plants, animals, and weather.' },
  { id: 'C016', courseName: 'Social Studies', courseCode: 'SS-016', gradeLevel: '1st Grade', subject: Subject.History, description: 'Introduces concepts of family, community, and holidays.' },
  { id: 'C017', courseName: 'Technology & Computer', courseCode: 'CS-017', gradeLevel: '1st Grade', subject: Subject.ComputerScience, description: 'Basic computer use and digital literacy skills.' },
  { id: 'C021', courseName: 'English', courseCode: 'ENG-021', gradeLevel: '2nd Grade', subject: Subject.English, description: 'Builds on reading fluency and comprehension skills.' },
  { id: 'C022', courseName: 'English Composition', courseCode: 'ENG-022', gradeLevel: '2nd Grade', subject: Subject.English, description: 'Develops paragraph writing and more complex sentence structures.' },
  { id: 'C023', courseName: 'Hindi', courseCode: 'HIN-023', gradeLevel: '2nd Grade', subject: Subject.ForeignLanguage, description: 'Continues with Hindi script, vocabulary, and simple conversation.' },
  { id: 'C024', courseName: 'Mathematics', courseCode: 'MATH-024', gradeLevel: '2nd Grade', subject: Subject.Mathematics, description: 'Introduction to multiplication, place value, and measurement.' },
  { id: 'C025', courseName: 'Science', courseCode: 'SCI-025', gradeLevel: '2nd Grade', subject: Subject.Science, description: 'Study of life cycles, matter, and the solar system.' },
  { id: 'C026', courseName: 'Social Studies', courseCode: 'SS-026', gradeLevel: '2nd Grade', subject: Subject.History, description: 'Learning about neighborhoods, maps, and historical figures.' },
  { id: 'C027', courseName: 'Technology & Computer', courseCode: 'CS-027', gradeLevel: '2nd Grade', subject: Subject.ComputerScience, description: 'Introduction to keyboarding and using educational software.' },
  { id: 'C031', courseName: 'English', courseCode: 'ENG-031', gradeLevel: '3rd Grade', subject: Subject.English, description: 'Develops reading comprehension, vocabulary, and grammar skills.' },
  { id: 'C032', courseName: 'English Composition', courseCode: 'ENG-032', gradeLevel: '3rd Grade', subject: Subject.English, description: 'Focuses on writing different types of paragraphs and short stories.' },
  { id: 'C033', courseName: 'Hindi', courseCode: 'HIN-033', gradeLevel: '3rd Grade', subject: Subject.ForeignLanguage, description: 'Enhances Hindi reading, writing, and conversational abilities.' },
  { id: 'C034', courseName: 'Mathematics', courseCode: 'MATH-034', gradeLevel: '3rd Grade', subject: Subject.Mathematics, description: 'Covers multiplication, division, fractions, and geometry.' },
  { id: 'C035', courseName: 'Science', courseCode: 'SCI-035', gradeLevel: '3rd Grade', subject: Subject.Science, description: 'Topics include ecosystems, energy, and simple machines.' },
  { id: 'C036', courseName: 'Social Studies', courseCode: 'SS-036', gradeLevel: '3rd Grade', subject: Subject.History, description: 'Study of communities, government, and local history.' },
  { id: 'C037', courseName: 'Technology & Computer', courseCode: 'CS-037', gradeLevel: '3rd Grade', subject: Subject.ComputerScience, description: 'Basic research skills and introduction to presentation software.' },
  { id: 'C038', courseName: 'Art', courseCode: 'ART-038', gradeLevel: '3', subject: Subject.Art, description: 'Exploring different mediums like painting and sculpture.' },
  { id: 'C039', courseName: 'Music', courseCode: 'MUS-039', gradeLevel: '3', subject: Subject.Music, description: 'Introduction to musical instruments and reading notes.' },
  { id: 'C041', courseName: 'English', courseCode: 'ENG-041', gradeLevel: '4th Grade', subject: Subject.English, description: 'Focus on analyzing texts, figurative language, and complex vocabulary.' },
  { id: 'C042', courseName: 'English Composition', courseCode: 'ENG-042', gradeLevel: '4th Grade', subject: Subject.English, description: 'Writing multi-paragraph essays and reports.' },
  { id: 'C043', courseName: 'Hindi', courseCode: 'HIN-043', gradeLevel: '4th Grade', subject: Subject.ForeignLanguage, description: 'Advanced grammar and composition in Hindi.' },
  { id: 'C044', courseName: 'Mathematics', courseCode: 'MATH-044', gradeLevel: '4th Grade', subject: Subject.Mathematics, description: 'Covers long division, decimals, and problem-solving strategies.' },
  { id: 'C045', courseName: 'Science', courseCode: 'SCI-045', gradeLevel: '4th Grade', subject: Subject.Science, description: 'Exploration of electricity, geology, and the human body.' },
  { id: 'C046', courseName: 'Social Studies', courseCode: 'SS-046', gradeLevel: '4th Grade', subject: Subject.History, description: 'Focus on state history and regional geography.' },
  { id: 'C047', courseName: 'Technology & Computer', courseCode: 'CS-047', gradeLevel: '4th Grade', subject: Subject.ComputerScience, description: 'Internet safety, digital citizenship, and coding basics.' },
  { id: 'C051', courseName: 'English', courseCode: 'ENG-051', gradeLevel: '5th Grade', subject: Subject.English, description: 'Advanced reading comprehension, literary analysis, and vocabulary.' },
  { id: 'C052', courseName: 'English Composition', courseCode: 'ENG-052', gradeLevel: '5th Grade', subject: Subject.English, description: 'Developing persuasive and expository writing skills.' },
  { id: 'C053', courseName: 'Hindi', courseCode: 'HIN-053', gradeLevel: '5th Grade', subject: Subject.ForeignLanguage, description: 'Study of Hindi literature and advanced conversation.' },
  { id: 'C054', courseName: 'Mathematics', courseCode: 'MATH-054', gradeLevel: '5th Grade', subject: Subject.Mathematics, description: 'Covers fractions, decimals, percentages, and pre-algebra concepts.' },
  { id: 'C055', courseName: 'Science', courseCode: 'SCI-055', gradeLevel: '5th Grade', subject: Subject.Science, description: 'Introduction to chemistry, physics concepts, and ecosystems.' },
  { id: 'C056', courseName: 'Social Studies', courseCode: 'SS-056', gradeLevel: '5th Grade', subject: Subject.History, description: 'Study of American history and government.' },
  { id: 'C057', courseName: 'Technology & Computer', courseCode: 'CS-057', gradeLevel: '5th Grade', subject: Subject.ComputerScience, description: 'Introduction to spreadsheets, databases, and multimedia projects.' },
  { id: 'C061', courseName: 'English', courseCode: 'ENG-061', gradeLevel: '6th Grade', subject: Subject.English, description: 'Analysis of literature, including novels, poetry, and drama.' },
  { id: 'C062', courseName: 'English Composition', courseCode: 'ENG-062', gradeLevel: '6th Grade', subject: Subject.English, description: 'Focus on research papers and argumentative essays.' },
  { id: 'C063', courseName: 'Hindi', courseCode: 'HIN-063', gradeLevel: '6th Grade', subject: Subject.ForeignLanguage, description: 'Advanced Hindi for fluent communication and literary analysis.' },
  { id: 'C064', courseName: 'Mathematics', courseCode: 'MATH-064', gradeLevel: '6th Grade', subject: Subject.Mathematics, description: 'Ratios, proportions, and an introduction to algebraic expressions.' },
  { id: 'C065', courseName: 'Science', courseCode: 'SCI-065', gradeLevel: '6th Grade', subject: Subject.Science, description: 'Earth science, including geology, meteorology, and astronomy.' },
  { id: 'C066', courseName: 'Social Studies', courseCode: 'SS-066', gradeLevel: '6th Grade', subject: Subject.History, description: 'Study of ancient world history and civilizations.' },
  { id: 'C067', courseName: 'Technology & Computer', courseCode: 'CS-067', gradeLevel: '6th Grade', subject: Subject.ComputerScience, description: 'Intermediate coding, web design, and digital media production.' },
  { id: 'C071', courseName: 'English', courseCode: 'ENG-071', gradeLevel: '7th Grade', subject: Subject.English, description: 'Critical reading and analysis of diverse literary genres.' },
  { id: 'C072', courseName: 'English Composition', courseCode: 'ENG-072', gradeLevel: '7th Grade', subject: Subject.English, description: 'Advanced essay structures and research techniques.' },
  { id: 'C073', courseName: 'Hindi', courseCode: 'HIN-073', gradeLevel: '7th Grade', subject: Subject.ForeignLanguage, description: 'Focus on fluency and cultural aspects of the Hindi language.' },
  { id: 'C074', courseName: 'Mathematics', courseCode: 'MATH-074', gradeLevel: '7th Grade', subject: Subject.Mathematics, description: 'Pre-Algebra concepts including integers, expressions, and inequalities.' },
  { id: 'C075', courseName: 'Science', courseCode: 'SCI-075', gradeLevel: '7th Grade', subject: Subject.Science, description: 'Life science, including cell biology, genetics, and human anatomy.' },
  { id: 'C076', courseName: 'Social Studies', courseCode: 'SS-076', gradeLevel: '7th Grade', subject: Subject.History, description: 'Medieval world history and the rise of empires.' },
  { id: 'C077', courseName: 'Technology & Computer', courseCode: 'CS-077', gradeLevel: '7th Grade', subject: Subject.ComputerScience, description: 'Introduction to programming languages like Python or JavaScript.' },
  { id: 'C081', courseName: 'English', courseCode: 'ENG-081', gradeLevel: '8th Grade', subject: Subject.English, description: 'In-depth literary analysis and preparation for high school English.' },
  { id: 'C082', courseName: 'English Composition', courseCode: 'ENG-082', gradeLevel: '8th Grade', subject: Subject.English, description: 'Refining research and citation skills for academic writing.' },
  { id: 'C083', courseName: 'Hindi', courseCode: 'HIN-083', gradeLevel: '8th Grade', subject: Subject.ForeignLanguage, description: 'Advanced conversational Hindi and study of modern literature.' },
  { id: 'C084', courseName: 'Mathematics', courseCode: 'MATH-084', gradeLevel: '8th Grade', subject: Subject.Mathematics, description: 'Algebra I foundations, including linear functions and systems of equations.' },
  { id: 'C085', courseName: 'Science', courseCode: 'SCI-085', gradeLevel: '8th Grade', subject: Subject.Science, description: 'Physical science, including chemistry, physics, and earth science.' },
  { id: 'C086', courseName: 'Social Studies', courseCode: 'SS-086', gradeLevel: '8th Grade', subject: Subject.History, description: 'U.S. history from colonization through the Civil War.' },
  { id: 'C087', courseName: 'Technology & Computer', courseCode: 'CS-087', gradeLevel: '8th Grade', subject: Subject.ComputerScience, description: 'Project-based programming and an introduction to data science.' },
  { id: 'C091', courseName: 'English I', courseCode: 'ENG-091', gradeLevel: '9th Grade', subject: Subject.English, description: 'Foundational high school course in literature and composition.' },
  { id: 'C092', courseName: 'English Composition', courseCode: 'ENG-092', gradeLevel: '9th Grade', subject: Subject.English, description: 'Focuses on formal essay writing and literary analysis.' },
  { id: 'C093', courseName: 'Hindi I', courseCode: 'HIN-093', gradeLevel: '9th Grade', subject: Subject.ForeignLanguage, description: 'Beginning high school Hindi, focusing on grammar and conversation.' },
  { id: 'C094', courseName: 'Algebra I', courseCode: 'MATH-094', gradeLevel: '9th Grade', subject: Subject.Mathematics, description: 'Covers linear equations, inequalities, functions, and polynomials.' },
  { id: 'C095', courseName: 'Biology', courseCode: 'SCI-095', gradeLevel: '9th Grade', subject: Subject.Science, description: 'A comprehensive study of living organisms and their processes.' },
  { id: 'C096', courseName: 'World Geography', courseCode: 'SS-096', gradeLevel: '9th Grade', subject: Subject.History, description: 'Examines the physical and human geography of the world.' },
  { id: 'C097', courseName: 'Introduction to Computer Science', courseCode: 'CS-097', gradeLevel: '9th Grade', subject: Subject.ComputerScience, description: 'An introduction to programming principles and computational thinking.' },
  { id: 'C101', courseName: 'English II', courseCode: 'ENG-101', gradeLevel: '10th Grade', subject: Subject.English, description: 'A survey of world literature and advanced composition.' },
  { id: 'C102', courseName: 'English Composition', courseCode: 'ENG-102', gradeLevel: '10th Grade', subject: Subject.English, description: 'Focuses on research methods and writing analytical papers.' },
  { id: 'C103', courseName: 'Hindi II', courseCode: 'HIN-103', gradeLevel: '10th Grade', subject: Subject.ForeignLanguage, description: 'Intermediate study of Hindi language and literature.' },
  { id: 'C104', courseName: 'Geometry', courseCode: 'MATH-104', gradeLevel: '10th Grade', subject: Subject.Mathematics, description: 'Study of points, lines, angles, and shapes in two and three dimensions.' },
  { id: 'C105', courseName: 'Chemistry', courseCode: 'SCI-105', gradeLevel: '10th Grade', subject: Subject.Science, description: 'Introduction to atomic structure, chemical bonding, and reactions.' },
  { id: 'C106', courseName: 'World History', courseCode: 'SS-106', gradeLevel: '10th Grade', subject: Subject.History, description: 'A survey of major global events from the Renaissance to the modern era.' },
  { id: 'C107', courseName: 'AP Computer Science Principles', courseCode: 'CS-107', gradeLevel: '10th Grade', subject: Subject.ComputerScience, description: 'Introduces students to the foundational concepts of computer science.' },
];

export const mockHomeworks: Homework[] = [
    { id: 'HW1', title: 'Algebra Worksheet Chapter 3', instructions: 'Complete all odd-numbered problems from the worksheet attached.', subject: Subject.Mathematics, gradeLevel: '3rd Grade', teacher: 'David Black', assignedDate: '2024-10-20', dueDate: getTodayDateString(), attachmentLink: 'https://example.com/worksheet.pdf' },
    { id: 'HW2', title: 'Essay: The Great Gatsby', instructions: 'Write a 500-word essay on the symbolism of the green light in The Great Gatsby.', subject: Subject.English, gradeLevel: '10th Grade', teacher: 'Emily White', assignedDate: '2024-10-18', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'HW3', title: 'Lab Report: Photosynthesis', instructions: 'Submit your lab report based on last week\'s experiment.', subject: Subject.Science, gradeLevel: '9th Grade', teacher: 'Dr. Chen', assignedDate: '2024-10-22', dueDate: '2024-10-29' },
    { id: 'HW4', title: 'World History Reading', instructions: 'Read Chapter 5 and answer the questions at the end.', subject: Subject.History, gradeLevel: '10th Grade', teacher: 'Laura Grey', assignedDate: '2024-10-25', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'HW5', title: 'Past Due: Physics Problems', instructions: 'Complete problems 1-10 on page 50.', subject: Subject.Science, gradeLevel: '10th Grade', teacher: 'Dr. Chen', assignedDate: '2024-10-15', dueDate: '2024-10-22' },
];

export const mockMeetings: Meeting[] = [
    { id: 'M1', title: 'Q3 Board Meeting', date: '2024-09-15', time: '10:00', type: MeetingType.Board, locationOrLink: 'Conference Room 1', attendees: [{id: '1', name: 'Principal Thompson', role: 'Admin'}, {id: '2', name: 'Board Members', role: 'Admin'}]},
    { id: 'M2', title: 'Parent-Teacher Conferences - 10th Grade', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:00', type: MeetingType.ParentTeacher, locationOrLink: 'Various Classrooms', attendees: [{id: '3', name: '10th Grade Teachers', role: 'Teacher'}, {id: '4', name: 'Parents', role: 'Parent'}]},
    { id: 'M3', title: 'Weekly Staff Sync', date: getTodayDateString(), time: '08:30', type: MeetingType.Staff, locationOrLink: 'Staff Lounge', attendees: [{id: '5', name: 'All Staff', role: 'Teacher'}]},
    { id: 'M4', title: 'Past IEP Meeting for C. Brown', date: '2024-05-20', time: '13:00', type: MeetingType.IEP, locationOrLink: 'Counseling Office', attendees: [{id: '6', name: 'Mr. Green', role: 'Teacher'}, {id: '7', name: 'David Brown', role: 'Parent'}]},
];

export const mockHealthData: { [studentId: string]: HealthRecord } = {
    '1': {
        studentId: '1',
        bloodType: 'O+',
        allergies: ['Peanuts', 'Penicillin'],
        medicalConditions: ['Asthma (Mild)'],
        medications: [{ name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', reason: 'Asthma' }],
        emergencyContact: { name: 'Jane Johnson', relationship: 'Mother', phone: '555-5678' },
        physician: { name: 'Dr. Emily Carter', clinic: 'Springfield Pediatrics', phone: '555-8765' },
        vaccinations: [
            { id: 'v1', vaccineName: 'MMR', dateAdministered: '2010-06-01', administeredBy: 'Dr. Carter' },
            { id: 'v2', vaccineName: 'DTaP', dateAdministered: '2010-06-01', administeredBy: 'Dr. Carter' },
            { id: 'v3', vaccineName: 'Hepatitis B', dateAdministered: '2012-08-15', administeredBy: 'Dr. Carter' },
        ],
        lastHealthCheckupDate: '2023-08-20',
    },
    '2': {
        studentId: '2',
        bloodType: 'A-',
        allergies: ['None known'],
        medicalConditions: ['None known'],
        medications: [],
        emergencyContact: { name: 'Tom Williams', relationship: 'Father', phone: '555-6789' },
        physician: { name: 'Dr. Alan Grant', clinic: 'City Health Clinic', phone: '555-4321' },
        vaccinations: [
            { id: 'v4', vaccineName: 'MMR', dateAdministered: '2011-03-10', administeredBy: 'Dr. Grant' },
            { id: 'v5', vaccineName: 'Varicella', dateAdministered: '2011-03-10', administeredBy: 'Dr. Grant' },
        ],
        lastHealthCheckupDate: '2024-01-15',
    },
    '3': {
        studentId: '3',
        bloodType: 'B+',
        allergies: ['Lactose Intolerance'],
        medicalConditions: [],
        medications: [],
        emergencyContact: { name: 'Susan Brown', relationship: 'Mother', phone: '555-7890' },
        physician: { name: 'Dr. Emily Carter', clinic: 'Springfield Pediatrics', phone: '555-8765' },
        vaccinations: [],
        lastHealthCheckupDate: '2023-05-10',
    }
};

export const mockTeachers = [
    { id: 't1', name: 'Ms. Davis', subject: 'English' },
    { id: 't2', name: 'Mr. Smith', subject: 'Mathematics' },
    { id: 't3', name: 'Mrs. Jones', subject: 'History' },
    { id: 't4', name: 'Dr. Chen', subject: 'Science' },
];

export const mockConversations: Record<string, {id: string, sender: 'student' | 'teacher', text: string, timestamp: string}[]> = {
    't1': [
        { id: 'c1', sender: 'teacher', text: "Hi Alice, just a reminder your essay is due on Friday. Let me know if you have any questions!", timestamp: '2024-10-28T14:30:00Z' },
        { id: 'c2', sender: 'student', text: "Thanks, Ms. Davis! I'm almost finished with it.", timestamp: '2024-10-28T15:05:00Z' },
    ],
    't2': [
        { id: 'c3', sender: 'student', text: "Mr. Smith, I'm having trouble with question 5 on the worksheet.", timestamp: '2024-10-27T18:00:00Z' },
    ],
    't3': [],
    't4': [],
};

export const subjectColors: { [key in Subject]: string } = {
    [Subject.Mathematics]: 'from-blue-100 to-blue-200 text-blue-900 dark:from-blue-900/50 dark:to-blue-900/80 dark:text-blue-200',
    [Subject.Science]: 'from-green-100 to-green-200 text-green-900 dark:from-green-900/50 dark:to-green-900/80 dark:text-green-200',
    [Subject.English]: 'from-purple-100 to-purple-200 text-purple-900 dark:from-purple-900/50 dark:to-purple-900/80 dark:text-purple-200',
    [Subject.History]: 'from-amber-100 to-amber-200 text-amber-900 dark:from-amber-900/50 dark:to-amber-900/80 dark:text-amber-200',
    [Subject.Art]: 'from-pink-100 to-pink-200 text-pink-900 dark:from-pink-900/50 dark:to-pink-900/80 dark:text-pink-200',
    [Subject.Music]: 'from-indigo-100 to-indigo-200 text-indigo-900 dark:from-indigo-900/50 dark:to-indigo-900/80 dark:text-indigo-200',
    [Subject.PhysicalEducation]: 'from-orange-100 to-orange-200 text-orange-900 dark:from-orange-900/50 dark:to-orange-900/80 dark:text-orange-200',
    [Subject.ComputerScience]: 'from-teal-100 to-teal-200 text-teal-900 dark:from-teal-900/50 dark:to-teal-900/80 dark:text-teal-200',
    [Subject.ForeignLanguage]: 'from-rose-100 to-rose-200 text-rose-900 dark:from-rose-900/50 dark:to-rose-900/80 dark:text-rose-200',
};

export const subjectIcons: { [key in Subject]: string } = {
    [Subject.Mathematics]: 'AcademicCapIcon',
    [Subject.Science]: 'BeakerIcon',
    [Subject.English]: 'BookOpenIcon',
    [Subject.History]: 'BuildingLibraryIcon',
    [Subject.Art]: 'PaintBrushIcon',
    [Subject.Music]: 'MusicalNoteIcon',
    [Subject.PhysicalEducation]: 'TrophyIcon',
    [Subject.ComputerScience]: 'ComputerDesktopIcon',
    [Subject.ForeignLanguage]: 'LanguageIcon',
};

export const mockStudentTimetable: TimetableEntry[] = [
  // Monday
  { day: 'Monday', time: '09:00 - 10:00', subject: Subject.Mathematics, teacher: 'David Black', room: '101' },
  { day: 'Monday', time: '10:00 - 11:00', subject: Subject.English, teacher: 'Emily White', room: '203' },
  { day: 'Monday', time: '11:00 - 12:00', subject: Subject.Science, teacher: 'Dr. Chen', room: 'Lab A' },
  { day: 'Monday', time: '12:00 - 01:00', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
  { day: 'Monday', time: '01:00 - 02:00', subject: Subject.History, teacher: 'Laura Grey', room: '205' },
  { day: 'Monday', time: '02:00 - 03:00', subject: Subject.Art, teacher: 'Clara Pink', room: 'Art Studio' },
  // Tuesday
  { day: 'Tuesday', time: '09:00 - 10:00', subject: Subject.ForeignLanguage, teacher: 'Priya Sharma', room: '301' },
  { day: 'Tuesday', time: '10:00 - 11:00', subject: Subject.Mathematics, teacher: 'David Black', room: '101' },
  { day: 'Tuesday', time: '11:00 - 12:00', subject: Subject.Music, teacher: 'Leo Indigo', room: 'Music Room' },
  { day: 'Tuesday', time: '12:00 - 01:00', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
  { day: 'Tuesday', time: '01:00 - 02:00', subject: Subject.English, teacher: 'Emily White', room: '203' },
  { day: 'Tuesday', time: '02:00 - 03:00', subject: Subject.PhysicalEducation, teacher: 'Coach Hopper', room: 'Gym' },
  // Wednesday
  { day: 'Wednesday', time: '09:00 - 10:00', subject: Subject.Science, teacher: 'Dr. Chen', room: 'Lab A' },
  { day: 'Wednesday', time: '10:00 - 11:00', subject: Subject.History, teacher: 'Laura Grey', room: '205' },
  { day: 'Wednesday', time: '11:00 - 12:00', subject: Subject.Mathematics, teacher: 'David Black', room: '101' },
  { day: 'Wednesday', time: '12:00 - 01:00', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
  { day: 'Wednesday', time: '01:00 - 02:00', subject: Subject.ComputerScience, teacher: 'Robert Brown', room: 'Tech Lab' },
  { day: 'Wednesday', time: '02:00 - 03:00', subject: 'Free Period', teacher: '', room: 'Library' },
  // Thursday
  { day: 'Thursday', time: '09:00 - 10:00', subject: Subject.English, teacher: 'Emily White', room: '203' },
  { day: 'Thursday', time: '10:00 - 11:00', subject: Subject.Art, teacher: 'Clara Pink', room: 'Art Studio' },
  { day: 'Thursday', time: '11:00 - 12:00', subject: Subject.ForeignLanguage, teacher: 'Priya Sharma', room: '301' },
  { day: 'Thursday', time: '12:00 - 01:00', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
  { day: 'Thursday', time: '01:00 - 02:00', subject: Subject.Science, teacher: 'Dr. Chen', room: 'Lab A' },
  { day: 'Thursday', time: '02:00 - 03:00', subject: Subject.Mathematics, teacher: 'David Black', room: '101' },
  // Friday
  { day: 'Friday', time: '09:00 - 10:00', subject: Subject.PhysicalEducation, teacher: 'Coach Hopper', room: 'Gym' },
  { day: 'Friday', time: '10:00 - 11:00', subject: Subject.History, teacher: 'Laura Grey', room: '205' },
  { day: 'Friday', time: '11:00 - 12:00', subject: Subject.English, teacher: 'Emily White', room: '203' },
  { day: 'Friday', time: '12:00 - 01:00', subject: 'Lunch', teacher: '', room: 'Cafeteria' },
  { day: 'Friday', time: '01:00 - 02:00', subject: 'Free Period', teacher: '', room: 'Library' },
  { day: 'Friday', time: '02:00 - 03:00', subject: Subject.Music, teacher: 'Leo Indigo', room: 'Music Room' },
];

export const mockParentMessages: ParentMessage[] = [
    {
        id: 'msg1',
        parentId: 'p1',
        parentName: 'John Johnson (Alice\'s Father)',
        conversation: [
            { id: 'c1', sender: 'parent', text: 'Good morning, I have a question about the upcoming field trip.', timestamp: '2024-10-25T09:05:00Z' },
            { id: 'c2', sender: 'school', text: 'Of course, how can I help?', timestamp: '2024-10-25T09:07:00Z' },
        ],
    },
    {
        id: 'msg2',
        parentId: 'p2',
        parentName: 'Sarah Williams (Bob\'s Mother)',
        conversation: [
            { id: 'c3', sender: 'parent', text: 'Hi, I wanted to report that Bob will be absent today due to a doctor\'s appointment.', timestamp: '2024-10-24T08:15:00Z' },
            { id: 'c4', sender: 'school', text: 'Thank you for letting us know. We have marked him as excused. We hope he feels better soon!', timestamp: '2024-10-24T08:16:00Z' },
        ],
    },
];

export const mockVehicles: Vehicle[] = [
    { id: 'v1', vehicleNumber: 'BUS-001', model: 'Tata Marcopolo', capacity: 40, status: 'Active', nextServiceDate: '2025-12-01', driverName: 'Suresh Kumar' },
    { id: 'v2', vehicleNumber: 'BUS-002', model: 'Ashok Leyland', capacity: 40, status: 'Active', nextServiceDate: '2026-02-15', driverName: 'Ramesh Singh' },
    { id: 'v3', vehicleNumber: 'VAN-001', model: 'Force Traveller', capacity: 15, status: 'Under Maintenance', nextServiceDate: '2025-11-10', driverName: 'Amit Patel' },
];

export const mockRouteStops: RouteStop[] = [
    { id: 's1', name: 'Greenwood Park', pickupTime: '07:10 AM', dropoffTime: '04:50 PM', assignedStudents: [{id: '1', name: 'Alice Johnson'}] },
    { id: 's2', name: 'Oak Street Corner', pickupTime: '07:25 AM', dropoffTime: '04:35 PM', assignedStudents: [{id: '2', name: 'Alex Johnson'}] },
    { id: 's3', name: 'Pine Lane Plaza', pickupTime: '07:40 AM', dropoffTime: '04:20 PM', assignedStudents: [{id: '3', name: 'Charlie Brown'}] },
];

export const mockRoutes: BusRoute[] = [
    { id: 'r1', routeName: 'North Route', routeNumber: 'A1', vehicleId: 'v1', stops: [mockRouteStops[0], mockRouteStops[1]] },
    { id: 'r2', routeName: 'South Route', routeNumber: 'B2', vehicleId: 'v2', stops: [mockRouteStops[2]] },
];

export const mockTransportAlerts: TransportAlert[] = [
    { id: 'a1', routeId: 'r1', message: 'Route A1 is running 15 minutes late due to traffic.', timestamp: new Date().toISOString(), severity: 'Warning' },
];