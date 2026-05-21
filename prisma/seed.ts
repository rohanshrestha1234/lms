import { PrismaClient, Role, Gender, AttendanceStatus, PaymentStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

// 1. Manually parse .env.local to resolve DATABASE_URL on Windows safely
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8')
      for (const line of envFile.split('\n')) {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/)
        if (match) {
          const key = match[1].trim()
          let val = match[2].trim()
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1)
          }
          process.env[key] = val
        }
      }
      console.log('Loaded database configuration from .env.local')
    }
  } catch (e) {
    console.error('Error loading .env.local:', e)
  }
}

loadEnv()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not defined.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seeding...')

  const schoolId = 'mock-school-id'

  // 2. Clean up existing mock records in dependent order to allow clean re-runs
  console.log('Cleaning up existing database records...')
  await prisma.payment.deleteMany({ where: { feeInvoice: { student: { schoolId } } } }).catch(() => {})
  await prisma.feeInvoice.deleteMany({ where: { student: { schoolId } } }).catch(() => {})
  await prisma.feeCategory.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.examResult.deleteMany({ where: { student: { schoolId } } }).catch(() => {})
  await prisma.exam.deleteMany({ where: { subject: { class: { schoolId } } } }).catch(() => {})
  await prisma.submission.deleteMany({ where: { student: { schoolId } } }).catch(() => {})
  await prisma.homework.deleteMany({ where: { subject: { class: { schoolId } } } }).catch(() => {})
  await prisma.attendance.deleteMany({ where: { student: { schoolId } } }).catch(() => {})
  await prisma.timetable.deleteMany({ where: { section: { class: { schoolId } } } }).catch(() => {})
  await prisma.subject.deleteMany({ where: { class: { schoolId } } }).catch(() => {})
  await prisma.section.deleteMany({ where: { class: { schoolId } } }).catch(() => {})
  await prisma.student.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.teacher.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.parent.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.class.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.academicYear.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.notice.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.user.deleteMany({ where: { schoolId } }).catch(() => {})
  await prisma.school.deleteMany({ where: { id: schoolId } }).catch(() => {})

  console.log('Previous records cleared.')

  // 3. Create School
  console.log('Creating school record...')
  const school = await prisma.school.create({
    data: {
      id: schoolId,
      name: 'Apex International Academy',
      subdomain: 'demo',
      address: 'Kathmandu, Nepal',
      contactEmail: 'admin@apex.edu.np',
      contactPhone: '+977-1-4444444',
    },
  })
  console.log(`School created: ${school.name}`)

  // 4. Create Academic Year
  console.log('Creating academic year...')
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2081-2082',
      startDate: new Date('2025-04-14'),
      endDate: new Date('2026-04-13'),
      isActive: true,
      schoolId: school.id,
    },
  })

  // 5. Create Classes
  console.log('Creating classes...')
  const classNames = ['Class 8', 'Class 9', 'Class 10']
  const classes = []
  for (const name of classNames) {
    const c = await prisma.class.create({
      data: {
        name,
        academicYearId: academicYear.id,
        schoolId: school.id,
      },
    })
    classes.push(c)
  }

  // 6. Create Sections for each Class
  console.log('Creating sections...')
  const sections = []
  for (const c of classes) {
    const secA = await prisma.section.create({
      data: {
        name: 'A',
        classId: c.id,
      },
    })
    const secB = await prisma.section.create({
      data: {
        name: 'B',
        classId: c.id,
      },
    })
    sections.push(secA, secB)
  }

  // 7. Create Teachers
  console.log('Creating teachers...')
  const teacherData = [
    { name: 'Ram Bahadur Thapa', email: 'ram.teacher@apex.edu.np', employeeId: 'EMP001', qualification: 'M.Sc. Physics' },
    { name: 'Sita Devi Sharma', email: 'sita.teacher@apex.edu.np', employeeId: 'EMP002', qualification: 'M.A. Mathematics' },
    { name: 'Hari Prasad Joshi', email: 'hari.teacher@apex.edu.np', employeeId: 'EMP003', qualification: 'M.A. English Literature' },
    { name: 'Gita Shrestha', email: 'gita.teacher@apex.edu.np', employeeId: 'EMP004', qualification: 'M.Ed. Nepali' },
  ]

  const teachers = []
  for (const t of teacherData) {
    const userUuid = crypto.randomUUID()
    const user = await prisma.user.create({
      data: {
        id: userUuid,
        email: t.email,
        name: t.name,
        role: Role.TEACHER,
        phone: '+977-9841' + Math.floor(100000 + Math.random() * 900000),
        schoolId: school.id,
      },
    })

    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        schoolId: school.id,
        employeeId: t.employeeId,
        qualification: t.qualification,
        joinDate: new Date('2022-04-14'),
      },
    })
    teachers.push({ ...teacher, user })
  }

  // 8. Create Subjects for each Class and assign Teachers
  console.log('Creating subjects...')
  const subjectList = [
    { name: 'Mathematics', code: 'MATH', teacherIndex: 1 },
    { name: 'Science', code: 'SCI', teacherIndex: 0 },
    { name: 'English', code: 'ENG', teacherIndex: 2 },
    { name: 'Nepali', code: 'NEP', teacherIndex: 3 },
  ]

  const subjects = []
  for (const c of classes) {
    for (const sub of subjectList) {
      const assignedTeacher = teachers[sub.teacherIndex]
      const s = await prisma.subject.create({
        data: {
          name: sub.name,
          code: `${sub.code}-${c.name.split(' ')[1]}`,
          classId: c.id,
          teacherId: assignedTeacher.id,
        },
      })
      subjects.push(s)
    }
  }

  // 9. Create Parents
  console.log('Creating parents...')
  const parentNames = [
    'Rajesh Hamal', 'Manoj Shrestha', 'Sunita Adhikari', 'Bina Tamang'
  ]
  const parents = []
  for (let i = 0; i < parentNames.length; i++) {
    const pName = parentNames[i]
    const userUuid = crypto.randomUUID()
    const user = await prisma.user.create({
      data: {
        id: userUuid,
        email: `parent${i + 1}@apex.edu.np`,
        name: pName,
        role: Role.PARENT,
        phone: '+977-9851' + Math.floor(100000 + Math.random() * 900000),
        schoolId: school.id,
      },
    })

    const parent = await prisma.parent.create({
      data: {
        userId: user.id,
        schoolId: school.id,
        occupation: i % 2 === 0 ? 'Business' : 'Government Service',
        address: 'Kathmandu',
      },
    })
    parents.push({ ...parent, user })
  }

  // 10. Create Students
  console.log('Creating students...')
  const firstNames = ['Aarav', 'Ananya', 'Bibek', 'Deepika', 'Ishwar', 'Jyoti', 'Kiran', 'Niranjan', 'Prerna', 'Rohan', 'Sandeep', 'Yashoda']
  const lastNames = ['Adhikari', 'Shrestha', 'Karki', 'Dahal', 'Subedi', 'Gautam', 'Tamang', 'Oli', 'Basnet', 'Poudel', 'Joshi', 'Bhattarai']

  const students = []
  let admissionCounter = 1000

  // We assign 2 students to each of our 6 sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    for (let j = 0; j < 2; j++) {
      const index = i * 2 + j
      const fName = firstNames[index % firstNames.length]
      const lName = lastNames[index % lastNames.length]
      const fullName = `${fName} ${lName}`
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${index}@apex.edu.np`
      const rollNumber = j + 1
      admissionCounter++

      const userUuid = crypto.randomUUID()
      const user = await prisma.user.create({
        data: {
          id: userUuid,
          email,
          name: fullName,
          role: Role.STUDENT,
          phone: '+977-9813' + Math.floor(100000 + Math.random() * 900000),
          schoolId: school.id,
        },
      })

      // Link to parent
      const parent = parents[index % parents.length]

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          admissionNumber: `ADM-${admissionCounter}`,
          rollNumber,
          dob: new Date(2010 + (index % 3), index % 12, (index * 7) % 28 + 1),
          gender: index % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          bloodGroup: ['A+', 'O+', 'B+', 'AB+'][index % 4],
          emergencyContact: parent.user.phone,
          parentId: parent.id,
          sectionId: section.id,
        },
      })
      students.push({ ...student, user, section })
    }
  }
  console.log(`Successfully generated ${students.length} student profiles across ${sections.length} sections.`)

  // 11. Create Notices
  console.log('Creating notices...')
  const noticeData = [
    {
      title: 'Welcome to Academic Session 2081-2082',
      content: 'We are thrilled to welcome all students, teachers, and parents to the new academic year. Regular classes start on Baisakh 2, 2081. Let us make this year filled with learning, development, and excellence.',
      targetAudience: [Role.STUDENT, Role.PARENT, Role.TEACHER],
    },
    {
      title: 'First Term Examination Schedule Notice',
      content: 'The First Term Examination for Classes 8, 9, and 10 will commence from Ashadh 15, 2081. Detailed subject-wise timetables have been published under the Exams section. All dues must be cleared before receiving the exam admit cards.',
      targetAudience: [Role.STUDENT, Role.PARENT],
    },
    {
      title: 'Staff Meeting: Academic Progress Review',
      content: 'All teachers are requested to attend a mandatory staff meeting in the main conference hall on Jestha 12 at 3:00 PM. We will review curriculum progress and plan upcoming co-curricular activities.',
      targetAudience: [Role.TEACHER],
    },
    {
      title: 'Parents Teachers Meeting (PTM)',
      content: 'Apex International Academy is hosting its first PTM of this term on Jestha 25 from 10:00 AM to 2:00 PM. Parents are requested to visit the respective class rooms to discuss their children\'s academic performance.',
      targetAudience: [Role.PARENT],
    },
  ]

  for (const n of noticeData) {
    await prisma.notice.create({
      data: {
        title: n.title,
        content: n.content,
        targetAudience: n.targetAudience,
        isPublished: true,
        schoolId: school.id,
      },
    })
  }

  // 12. Create Fee Categories
  console.log('Creating fee categories...')
  const feeCategoryData = [
    { name: 'Monthly Tuition Fee', description: 'Academic program monthly charge', amount: 4500.0 },
    { name: 'First Term Examination Fee', description: 'Examination fee including materials and evaluation', amount: 1500.0 },
    { name: 'Annual Registration Fee', description: 'Annual registration, library, and development fee', amount: 8000.0 },
  ]

  const feeCategories = []
  for (const fc of feeCategoryData) {
    const cat = await prisma.feeCategory.create({
      data: {
        name: fc.name,
        description: fc.description,
        amount: fc.amount,
        schoolId: school.id,
      },
    })
    feeCategories.push(cat)
  }

  // 13. Create Invoices and Payments for Students
  console.log('Creating invoices and payments...')
  // We will assign invoices to some students
  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    
    // Each student gets a Monthly Tuition Fee invoice
    const tInvoice = await prisma.feeInvoice.create({
      data: {
        dueDate: new Date('2025-05-30'),
        amount: feeCategories[0].amount,
        status: i % 3 === 0 ? PaymentStatus.PAID : i % 3 === 1 ? PaymentStatus.PARTIAL : PaymentStatus.PENDING,
        studentId: student.id,
        feeCategoryId: feeCategories[0].id,
      },
    })

    if (tInvoice.status === PaymentStatus.PAID) {
      await prisma.payment.create({
        data: {
          amountPaid: feeCategories[0].amount,
          paymentMethod: 'eSewa',
          transactionId: `TXN-ESEWA-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
          feeInvoiceId: tInvoice.id,
          paymentDate: new Date('2025-05-10'),
        },
      })
    } else if (tInvoice.status === PaymentStatus.PARTIAL) {
      await prisma.payment.create({
        data: {
          amountPaid: 2000.0,
          paymentMethod: 'CASH',
          feeInvoiceId: tInvoice.id,
          paymentDate: new Date('2025-05-12'),
        },
      })
    }

    // Every second student also gets an Annual Registration Fee invoice
    if (i % 2 === 0) {
      const rInvoice = await prisma.feeInvoice.create({
        data: {
          dueDate: new Date('2025-04-30'),
          amount: feeCategories[2].amount,
          status: i % 4 === 0 ? PaymentStatus.PAID : PaymentStatus.PENDING,
          studentId: student.id,
          feeCategoryId: feeCategories[2].id,
        },
      })

      if (rInvoice.status === PaymentStatus.PAID) {
        await prisma.payment.create({
          data: {
            amountPaid: feeCategories[2].amount,
            paymentMethod: 'Khalti',
            transactionId: `TXN-KHALTI-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            feeInvoiceId: rInvoice.id,
            paymentDate: new Date('2025-04-15'),
          },
        })
      }
    }
  }

  // 14. Create Attendance History (for the last 5 days)
  console.log('Creating attendance history...')
  const attendanceStatuses = [
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.PRESENT,
    AttendanceStatus.LATE,
    AttendanceStatus.PRESENT,
    AttendanceStatus.ABSENT,
  ]

  const today = new Date()
  for (let d = 0; d < 5; d++) {
    const currentDate = new Date()
    currentDate.setDate(today.getDate() - d)
    // Avoid Saturdays (day 6 in Nepal standard, or Sunday 0)
    if (currentDate.getDay() === 6) continue

    for (let sIndex = 0; sIndex < students.length; sIndex++) {
      const student = students[sIndex]
      
      // Determine daily overall status
      const seedVal = (sIndex + d * 3) % attendanceStatuses.length
      const status = attendanceStatuses[seedVal]
      const remark = status === AttendanceStatus.ABSENT ? 'Sick leave' : status === AttendanceStatus.LATE ? 'Late due to bus delay' : null

      // Create attendance entry
      await prisma.attendance.create({
        data: {
          date: new Date(currentDate.toDateString()), // normalize to midnight
          status,
          remark,
          studentId: student.id,
        },
      }).catch((e) => {
        // Prevent duplicate errors if run on identical times
      })
    }
  }

  // 15. Create Exams and Exam Results
  console.log('Creating exam schedules and marks...')
  // Find subjects
  const mathSubjects = subjects.filter(s => s.name === 'Mathematics')
  const sciSubjects = subjects.filter(s => s.name === 'Science')

  for (const c of classes) {
    const classMath = mathSubjects.find(s => s.classId === c.id)
    const classSci = sciSubjects.find(s => s.classId === c.id)

    if (classMath) {
      const mExam = await prisma.exam.create({
        data: {
          name: 'First Term Examination 2081',
          date: new Date('2025-06-20'),
          maxMarks: 100,
          passMarks: 40,
          subjectId: classMath.id,
        },
      })

      // Add result entries for students in this class
      const classStudents = students.filter(s => s.section.classId === c.id)
      for (const student of classStudents) {
        const marksObtained = Math.floor(45 + Math.random() * 50)
        let grade = 'A'
        if (marksObtained >= 90) grade = 'A+'
        else if (marksObtained >= 80) grade = 'A'
        else if (marksObtained >= 70) grade = 'B+'
        else if (marksObtained >= 60) grade = 'B'
        else if (marksObtained >= 50) grade = 'C+'
        else grade = 'C'

        await prisma.examResult.create({
          data: {
            marksObtained,
            grade,
            remarks: marksObtained >= 80 ? 'Excellent' : marksObtained >= 60 ? 'Good work' : 'Satisfactory',
            examId: mExam.id,
            studentId: student.id,
          },
        })
      }
    }

    if (classSci) {
      const sExam = await prisma.exam.create({
        data: {
          name: 'First Term Examination 2081',
          date: new Date('2025-06-22'),
          maxMarks: 100,
          passMarks: 40,
          subjectId: classSci.id,
        },
      })

      // Add result entries
      const classStudents = students.filter(s => s.section.classId === c.id)
      for (const student of classStudents) {
        const marksObtained = Math.floor(38 + Math.random() * 58)
        let grade = 'B'
        if (marksObtained >= 90) grade = 'A+'
        else if (marksObtained >= 80) grade = 'A'
        else if (marksObtained >= 70) grade = 'B+'
        else if (marksObtained >= 60) grade = 'B'
        else if (marksObtained >= 50) grade = 'C+'
        else grade = 'D'

        await prisma.examResult.create({
          data: {
            marksObtained,
            grade,
            remarks: marksObtained >= 40 ? 'Passed' : 'Needs Improvement',
            examId: sExam.id,
            studentId: student.id,
          },
        })
      }
    }
  }

  console.log('Database seeding successfully finished!')
}

main()
  .catch((e) => {
    console.error('Error seeding the database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
