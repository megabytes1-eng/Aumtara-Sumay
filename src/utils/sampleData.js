// Initial sample dataset for Aumtara Samay Dual-Shift Institution

export const initialInstitution = {
  name: "Apex State & Central Academy",
  code: "ASCA-2026",
  academicYear: "2026-2027",
  board: "State Board & CBSE (Dual Board)",
  medium: "English Medium",
  term: "Term 1 (Autumn)",
  shiftMode: "Dual Shift (Morning & Afternoon)",
  address: "100 Knowledge Boulevard, Education City",
  principalName: "Dr. Sarah Jenkins",
  timetableStatus: "Generated & Active"
};

export const initialBellSchedule = {
  shifts: [
    {
      id: "SHIFT-MORNING",
      name: "Morning Shift (CBSE / ICSE)",
      startTime: "07:30",
      endTime: "12:30",
      periodsPerDay: 7,
      periodDurationMinutes: 40,
      lunchBreakAfterPeriod: 4,
      lunchBreakMinutes: 20
    },
    {
      id: "SHIFT-AFTERNOON",
      name: "Afternoon Shift (State Board English Medium)",
      startTime: "12:45",
      endTime: "05:45",
      periodsPerDay: 7,
      periodDurationMinutes: 40,
      lunchBreakAfterPeriod: 4,
      lunchBreakMinutes: 20
    }
  ],
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periodsPerDay: 7,
  saturdaySchedule: {
    enabled: true,
    periodsCount: 5, // 4 or 5 periods on Saturday
    periods: [
      { number: 1, name: "Saturday Period 1", startTime: "07:30 / 12:45", endTime: "08:10 / 01:25" },
      { number: 2, name: "Saturday Period 2", startTime: "08:10 / 01:25", endTime: "08:50 / 02:05" },
      { number: 3, name: "Saturday Period 3", startTime: "08:50 / 02:05", endTime: "09:30 / 02:45" },
      { number: 4, name: "Saturday Period 4", startTime: "09:30 / 02:45", endTime: "10:10 / 03:25" },
      { number: 5, name: "Saturday Period 5 (Half Day Final)", startTime: "10:10 / 03:25", endTime: "10:50 / 04:05" }
    ]
  },
  periods: [
    { number: 1, name: "Period 1", startTime: "07:30 / 12:45", endTime: "08:10 / 01:25" },
    { number: 2, name: "Period 2", startTime: "08:10 / 01:25", endTime: "08:50 / 02:05" },
    { number: 3, name: "Period 3", startTime: "08:50 / 02:05", endTime: "09:30 / 02:45" },
    { number: 4, name: "Period 4", startTime: "09:30 / 02:45", endTime: "10:10 / 03:25" },
    { number: 5, name: "Period 5 (Post Lunch)", startTime: "10:30 / 03:45", endTime: "11:10 / 04:25" },
    { number: 6, name: "Period 6", startTime: "11:10 / 04:25", endTime: "11:50 / 05:05" },
    { number: 7, name: "Period 7", startTime: "11:50 / 05:05", endTime: "12:30 / 05:45" }
  ]
};

export const initialSubjects = [
  // Morning CBSE Subjects
  { id: "SUB-101", code: "MATH", name: "Mathematics (CBSE)", category: "Core", weeklyPeriods: 6, maxDailyPeriods: 2, isLab: false, roomType: "Classroom", color: "#3b82f6", shift: "Morning Shift" },
  { id: "SUB-102", code: "PHY", name: "Physics (CBSE)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 2, isLab: false, roomType: "Classroom", color: "#8b5cf6", shift: "Morning Shift" },
  { id: "SUB-103", code: "PHY-LAB", name: "Physics Practical Lab", category: "Lab", weeklyPeriods: 2, maxDailyPeriods: 2, isLab: true, roomType: "Physics Lab", color: "#6366f1", shift: "Morning Shift" },
  { id: "SUB-104", code: "CHEM", name: "Chemistry (CBSE)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 2, isLab: false, roomType: "Classroom", color: "#ec4899", shift: "Morning Shift" },
  { id: "SUB-105", code: "ENG-CBSE", name: "English Literature (CBSE)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 1, isLab: false, roomType: "Classroom", color: "#10b981", shift: "Morning Shift" },
  { id: "SUB-106", code: "CS", name: "Computer Science", category: "Elective", weeklyPeriods: 4, maxDailyPeriods: 2, isLab: true, roomType: "Computer Lab", color: "#06b6d4", shift: "Both Shifts" },

  // Afternoon State Board English Medium Subjects
  { id: "SUB-201", code: "ST-MATH", name: "Mathematics (State Board)", category: "Core", weeklyPeriods: 6, maxDailyPeriods: 2, isLab: false, roomType: "Classroom", color: "#f59e0b", shift: "Afternoon Shift" },
  { id: "SUB-202", code: "ST-SCI", name: "General Science (State Board)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 2, isLab: false, roomType: "Classroom", color: "#10b981", shift: "Afternoon Shift" },
  { id: "SUB-203", code: "ST-ENG", name: "English Medium Lit (State Board)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 1, isLab: false, roomType: "Classroom", color: "#06b6d4", shift: "Afternoon Shift" },
  { id: "SUB-204", code: "ST-SOC", name: "Social Science (State Board)", category: "Core", weeklyPeriods: 5, maxDailyPeriods: 1, isLab: false, roomType: "Classroom", color: "#a855f7", shift: "Afternoon Shift" },
  { id: "SUB-205", code: "ST-REG", name: "Regional Language (State)", category: "Core", weeklyPeriods: 4, maxDailyPeriods: 1, isLab: false, roomType: "Classroom", color: "#ef4444", shift: "Afternoon Shift" },
  { id: "SUB-206", code: "ST-PE", name: "Physical Education (State)", category: "Activity", weeklyPeriods: 3, maxDailyPeriods: 1, isLab: false, roomType: "Sports Ground", color: "#14b8a6", shift: "Afternoon Shift" }
];

export const initialRooms = [
  { id: "RM-101", name: "Room 101 (Shared)", building: "Main Block", floor: "1st Floor", type: "Classroom", capacity: 40, features: ["Smart Board", "Projector"], shift: "Shared (Both Shifts)" },
  { id: "RM-102", name: "Room 102 (Shared)", building: "Main Block", floor: "1st Floor", type: "Classroom", capacity: 40, features: ["Smart Board", "Projector"], shift: "Shared (Both Shifts)" },
  { id: "RM-103", name: "Room 103 (Shared)", building: "Main Block", floor: "1st Floor", type: "Classroom", capacity: 40, features: ["Smart Board", "Projector"], shift: "Shared (Both Shifts)" },
  { id: "RM-104", name: "Room 104 (Shared)", building: "Main Block", floor: "1st Floor", type: "Classroom", capacity: 40, features: ["Smart Board", "Projector"], shift: "Shared (Both Shifts)" },
  { id: "RM-LAB-PHY", name: "Advanced Physics Lab", building: "Science Block", floor: "1st Floor", type: "Physics Lab", capacity: 35, features: ["Optical Benches", "Circuit Rig"], shift: "Shared (Both Shifts)" },
  { id: "RM-LAB-CS", name: "Turing Computer Lab", building: "Tech Wing", floor: "2nd Floor", type: "Computer Lab", capacity: 40, features: ["40 Workstations", "Gigabit LAN"], shift: "Shared (Both Shifts)" },
  { id: "RM-GYM", name: "Sports Complex", building: "Sports Wing", floor: "Ground Floor", type: "Sports Ground", capacity: 100, features: ["Ground", "Equipment"], shift: "Shared (Both Shifts)" }
];

export const initialTeachers = [
  // Morning Shift Faculty
  { id: "TCH-01", name: "Prof. Robert Langdon", email: "robert.l@apex.edu", phone: "+1 555-0101", subjects: ["SUB-101"], maxDaily: 5, maxWeekly: 24, offDay: "Saturday", shift: "Morning Shift" },
  { id: "TCH-02", name: "Dr. Eleanor Vance", email: "eleanor.v@apex.edu", phone: "+1 555-0102", subjects: ["SUB-102", "SUB-103"], maxDaily: 5, maxWeekly: 22, offDay: "None", shift: "Morning Shift" },
  { id: "TCH-03", name: "Dr. Alan Turing", email: "alan.t@apex.edu", phone: "+1 555-0103", subjects: ["SUB-106"], maxDaily: 5, maxWeekly: 24, offDay: "Wednesday", shift: "Both Shifts" },
  { id: "TCH-04", name: "Prof. Marie Curie", email: "marie.c@apex.edu", phone: "+1 555-0104", subjects: ["SUB-104"], maxDaily: 5, maxWeekly: 22, offDay: "None", shift: "Morning Shift" },
  { id: "TCH-05", name: "Ms. Jane Austen", email: "jane.a@apex.edu", phone: "+1 555-0105", subjects: ["SUB-105"], maxDaily: 5, maxWeekly: 25, offDay: "Friday", shift: "Morning Shift" },

  // Afternoon State Board Faculty
  { id: "TCH-201", name: "Prof. Ramanujan Sharma", email: "ramanujan.s@state.edu", phone: "+1 555-0201", subjects: ["SUB-201"], maxDaily: 5, maxWeekly: 24, offDay: "Monday", shift: "Afternoon Shift" },
  { id: "TCH-202", name: "Dr. Vikram Sarabhai", email: "vikram.s@state.edu", phone: "+1 555-0202", subjects: ["SUB-202"], maxDaily: 5, maxWeekly: 22, offDay: "None", shift: "Afternoon Shift" },
  { id: "TCH-203", name: "Ms. Arundhati Roy", email: "arundhati.r@state.edu", phone: "+1 555-0203", subjects: ["SUB-203"], maxDaily: 5, maxWeekly: 24, offDay: "Thursday", shift: "Afternoon Shift" },
  { id: "TCH-204", name: "Mr. B.R. Ambedkar", email: "br.a@state.edu", phone: "+1 555-0204", subjects: ["SUB-204"], maxDaily: 5, maxWeekly: 24, offDay: "Wednesday", shift: "Afternoon Shift" },
  { id: "TCH-205", name: "Mr. Rabindranath Tagore", email: "rabindra.t@state.edu", phone: "+1 555-0205", subjects: ["SUB-205"], maxDaily: 4, maxWeekly: 20, offDay: "Friday", shift: "Afternoon Shift" },
  { id: "TCH-206", name: "Coach Dhyan Chand", email: "dhyan.c@state.edu", phone: "+1 555-0206", subjects: ["SUB-206"], maxDaily: 4, maxWeekly: 18, offDay: "Tuesday", shift: "Afternoon Shift" }
];

export const initialClasses = [
  // Morning Shift CBSE Classes
  { id: "CLS-9A", name: "Grade 9A (CBSE Morning)", grade: "9", section: "A", board: "CBSE", shift: "Morning Shift", classTeacherId: "TCH-01", roomPrefId: "RM-101", capacity: 38, subjects: ["SUB-101", "SUB-102", "SUB-104", "SUB-105", "SUB-106"] },
  { id: "CLS-10A", name: "Grade 10A (CBSE Morning)", grade: "10", section: "A", board: "CBSE", shift: "Morning Shift", classTeacherId: "TCH-02", roomPrefId: "RM-102", capacity: 40, subjects: ["SUB-101", "SUB-102", "SUB-103", "SUB-104", "SUB-105", "SUB-106"] },

  // Afternoon Shift State Board English Medium Classes
  { id: "CLS-ST-8A", name: "Grade 8 (State Eng Med - Afternoon)", grade: "8", section: "A", board: "State Board", shift: "Afternoon Shift", classTeacherId: "TCH-201", roomPrefId: "RM-101", capacity: 45, subjects: ["SUB-201", "SUB-202", "SUB-203", "SUB-204", "SUB-205", "SUB-206"] },
  { id: "CLS-ST-9A", name: "Grade 9 (State Eng Med - Afternoon)", grade: "9", section: "A", board: "State Board", shift: "Afternoon Shift", classTeacherId: "TCH-202", roomPrefId: "RM-102", capacity: 45, subjects: ["SUB-201", "SUB-202", "SUB-203", "SUB-204", "SUB-205", "SUB-206"] },
  { id: "CLS-ST-10A", name: "Grade 10 (State Eng Med - Afternoon)", grade: "10", section: "A", board: "State Board", shift: "Afternoon Shift", classTeacherId: "TCH-203", roomPrefId: "RM-103", capacity: 48, subjects: ["SUB-201", "SUB-202", "SUB-203", "SUB-204", "SUB-205", "SUB-206"] }
];

export const initialConstraints = {
  maxTeacherContinuousPeriods: 3,
  noFirstPeriodForPartTime: true,
  labMustBeDoublePeriod: true,
  spreadCoreSubjectsUniformly: true,
  avoidTeacherOffDayAssignments: true,
  maxDailyClassPeriods: 7,
  allowOvertimeWithWarning: true
};
