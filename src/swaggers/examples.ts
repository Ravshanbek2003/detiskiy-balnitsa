// ✅ SWAGGER RESPONSE EXAMPLES - BARCHA ENDPOINTS

export const SwaggerExamples = {
   // ============== AUTH RESPONSES ==============
   auth: {
      login_success: {
         success: true,
         message: 'Muvaffaqiyatli kirildi',
         data: {
            access_token:
               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjhmMWEyYzNkNGU1ZjZhN2I4YzlkMCIsInJvbGUiOiJBQ0NPVU5UQU5UIiwiaWF0IjoxNzEzMTEyNDAwLCJleHAiOjE3MTMyNTMyMDB9.xyz...',
            user: {
               _id: '64b8f1a2c3d4e5f6a7b8c9d0',
               fullname: 'Sardor Aliyev',
               phone: '+998901234567',
               login: 'sardor_01',
               role: 'ACCOUNTANT',
            },
         },
      },
      login_error: {
         success: false,
         error: {
            statusCode: 400,
            statusMsg: 'BAD_REQUEST',
            msg: "Login yoki parol noto'g'ri",
         },
      },
      signup_success: {
         success: true,
         message: 'Accountant muvaffaqiyatli yaratildi',
      },
      get_me: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9d0',
            fullname: 'Sardor Aliyev',
            phone: '+998901234567',
            login: 'sardor_01',
            role: 'ACCOUNTANT',
            status: 'active',
            created_at: '2026-04-01T09:30:00Z',
            updated_at: '2026-04-15T15:45:30Z',
         },
      },
   },

   // ============== USER RESPONSES ==============
   user: {
      create_success: {
         success: true,
         message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
      },
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9d1',
               fullname: 'Jasur Karimov',
               login: 'jasur_01',
               phone: '+998912345678',
               role: 'CASHIER',
               status: 'active',
               last_login: '2026-04-15T14:30:00Z',
               created_at: '2026-04-10T10:00:00Z',
            },
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9d2',
               fullname: 'Nora Hasanova',
               login: 'nora_02',
               phone: '+998913456789',
               role: 'CASHIER',
               status: 'active',
               last_login: '2026-04-15T13:15:00Z',
               created_at: '2026-04-08T11:20:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 2,
            total_pages: 1,
            next_page: null,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9d1',
            fullname: 'Jasur Karimov',
            login: 'jasur_01',
            phone: '+998912345678',
            role: 'CASHIER',
            status: 'active',
            created_at: '2026-04-10T10:00:00Z',
         },
      },
   },

   // ============== PATIENT RESPONSES ==============
   patient: {
      create_success: {
         success: true,
         message: "Bemor muvaffaqiyatli ro'yxatga olindi",
      },
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9e0',
               full_name: 'Ali Qurbonov',
               check_number: 'CHK-10293',
               department_id: '64b8f1a2c3d4e5f6a7b8c9f1',
               department_name: 'Kardiologiya',
               specialization_id: '64b8f1a2c3d4e5f6a7b8c9f2',
               specialization_name: 'EKO kardiologiya',
               doctor: '64b8f1a2c3d4e5f6a7b8c9f3',
               doctor_name: 'Dr. Qodirov',
               nurse: '64b8f1a2c3d4e5f6a7b8c9f4',
               nurse_name: 'Hamshira Guli',
               amount: 250000,
               payment_method: 'card',
               payment_status: 'paid',
               created_by: '64b8f1a2c3d4e5f6a7b8c9d1',
               created_at: '2026-04-15T09:30:00Z',
               updated_at: '2026-04-15T09:30:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 15,
            total_pages: 1,
            next_page: null,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9e0',
            full_name: 'Ali Qurbonov',
            check_number: 'CHK-10293',
            department_name: 'Kardiologiya',
            specialization_name: 'EKO kardiologiya',
            doctor_name: 'Dr. Qodirov',
            nurse_name: 'Hamshira Guli',
            amount: 250000,
            payment_method: 'card',
            payment_status: 'paid',
            created_at: '2026-04-15T09:30:00Z',
         },
      },
   },

   salary_log: {
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8cf10',
               worker_id: {
                  _id: '64b8f1a2c3d4e5f6a7b8c9f3',
                  fullname: 'Dr. Qodirov',
                  phone: '+998901111111',
                  worker_type: 'doctor',
                  department_id: '64b8f1a2c3d4e5f6a7b8c9f1',
                  specialization_id: '64b8f1a2c3d4e5f6a7b8c9f2',
                  status: 'active',
               },
               worker_type: 'doctor',
               salary_month: '2026-04',
               month_date: '2026-04-01T00:00:00Z',
               all_patient_count: 18,
               paid_patient_count: 14,
               amount: 3150000,
               created_at: '2026-04-01T00:10:00Z',
               updated_at: '2026-04-15T18:30:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 1,
            total_pages: 1,
            next_page: null,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8cf10',
            worker_id: {
               _id: '64b8f1a2c3d4e5f6a7b8c9f3',
               fullname: 'Dr. Qodirov',
               phone: '+998901111111',
               worker_type: 'doctor',
               department_id: '64b8f1a2c3d4e5f6a7b8c9f1',
               specialization_id: '64b8f1a2c3d4e5f6a7b8c9f2',
               status: 'active',
            },
            worker_type: 'doctor',
            salary_month: '2026-04',
            month_date: '2026-04-01T00:00:00Z',
            all_patient_count: 18,
            paid_patient_count: 14,
            amount: 3150000,
            created_at: '2026-04-01T00:10:00Z',
            updated_at: '2026-04-15T18:30:00Z',
         },
      },
   },

   // ============== WORKER RESPONSES ==============
   worker: {
      create_success: {
         success: true,
         message: 'Xodim muvaffaqiyatli yaratildi',
      },
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f3',
               fullname: 'Dr. Qodirov',
               phone: '+998901111111',
               image: 'https://s3.example.com/workers/dr_qodirov.jpg',
               department_id: {
                  _id: '64b8f1a2c3d4e5f6a7b8c9f1',
                  name: 'Kardiologiya',
               },
               specialization_id: {
                  _id: '64b8f1a2c3d4e5f6a7b8c9f2',
                  name: 'EKO kardiologiya',
               },
               worker_type: 'doctor',
               today_patients_count: 6,
               last_patient_at: '2026-04-15T15:20:00Z',
               status: 'active',
               notes: 'Experienced cardiologist',
               created_at: '2026-03-10T10:00:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 24,
            total_pages: 2,
            next_page: 2,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9f3',
            fullname: 'Dr. Qodirov',
            phone: '+998901111111',
            image: 'https://s3.example.com/workers/dr_qodirov.jpg',
            worker_type: 'doctor',
            today_patients_count: 6,
            last_patient_at: '2026-04-15T15:20:00Z',
            status: 'active',
         },
      },
   },

   // ============== DEPARTMENT RESPONSES ==============
   department: {
      create_success: {
         success: true,
         message: "Bo'lim muvaffaqiyatli yaratildi",
      },
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f1',
               name: 'Kardiologiya',
               share_percentages: {
                  doctor: 50,
                  nurse: 10000,
                  assistant_nurse: 5000,
               },
               description: "Yurak kasalliklari bo'limi",
               is_active: true,
               created_at: '2026-02-15T08:00:00Z',
               updated_at: '2026-04-15T10:30:00Z',
            },
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f5',
               name: 'Nevrologiya',
               share_percentages: {
                  doctor: 60,
                  nurse: 12000,
                  assistant_nurse: 6000,
               },
               description: "Asab kasalliklari bo'limi",
               is_active: true,
               created_at: '2026-02-20T09:15:00Z',
               updated_at: '2026-04-15T11:45:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 12,
            total_pages: 1,
            next_page: null,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9f1',
            name: 'Kardiologiya',
            share_percentages: {
               doctor: 50,
               nurse: 10000,
               assistant_nurse: 5000,
            },
            description: "Yurak kasalliklari bo'limi",
            is_active: true,
            created_at: '2026-02-15T08:00:00Z',
         },
      },
   },

   // ============== SPECIALIZATION RESPONSES ==============
   specialization: {
      create_success: {
         success: true,
         message: "Yo'nalish muvaffaqiyatli yaratildi",
      },
      get_all: {
         success: true,
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f2',
               service_code: 'CARD-ECO-001',
               name: 'EKO kardiologiya',
               department_id: {
                  _id: '64b8f1a2c3d4e5f6a7b8c9f1',
                  name: 'Kardiologiya',
               },
               price_local: 150000,
               price_foreign: 50,
               location: {
                  building: 'A',
                  floor: 2,
                  room: '203',
               },
               is_active: true,
               created_at: '2026-02-15T08:30:00Z',
            },
         ],
         pagination: {
            page: 1,
            limit: 20,
            total_items: 45,
            total_pages: 3,
            next_page: 2,
            prev_page: null,
         },
      },
      get_one: {
         success: true,
         data: {
            _id: '64b8f1a2c3d4e5f6a7b8c9f2',
            service_code: 'CARD-ECO-001',
            name: 'EKO kardiologiya',
            department_id: '64b8f1a2c3d4e5f6a7b8c9f1',
            department_name: 'Kardiologiya',
            price_local: 150000,
            price_foreign: 50,
            location: {
               building: 'A',
               floor: 2,
               room: '203',
            },
            is_active: true,
            created_at: '2026-02-15T08:30:00Z',
         },
      },
   },

   // ============== DASHBOARD RESPONSES ==============
   dashboard: {
      today_dashboard: {
         success: true,
         message: 'Bugungi kassa va umumiy hisobotlar muvaffaqiyatli olindi',
         data: {
            total_all_income: 2750000,
            total_patients_count: 11,
            cashiers_report: [
               {
                  cashier_id: '64b8f1a2c3d4e5f6a7b8c9d1',
                  cashier_name: 'Jasur Karimov',
                  cashier_login: 'jasur_01',
                  total_income: 1500000,
                  patients_count: 6,
               },
               {
                  cashier_id: '64b8f1a2c3d4e5f6a7b8c9d2',
                  cashier_name: 'Nora Hasanova',
                  cashier_login: 'nora_02',
                  total_income: 1250000,
                  patients_count: 5,
               },
            ],
            total_workers: {
               doctor: 5,
               nurse: 8,
               assistant_nurse: 3,
               total: 16,
            },
            total_departments: 12,
            total_specializations: 45,
         },
      },
      revenue_summary: {
         success: true,
         message: 'Hisobot olindi',
         data: {
            start_date: '2026-04-01T00:00:00Z',
            end_date: '2026-04-15T23:59:59Z',
            summary: {
               total_income: 8750000,
               total_patients: 35,
            },
            payment_methods: [
               {
                  method: 'cash',
                  total: 3500000,
                  count: 14,
               },
               {
                  method: 'card',
                  total: 5250000,
                  count: 21,
               },
               {
                  method: 'click',
                  total: 0,
                  count: 0,
               },
            ],
            daily_dynamics: [
               {
                  date: '2026-04-01',
                  total_income: 500000,
                  patients_count: 2,
               },
               {
                  date: '2026-04-02',
                  total_income: 750000,
                  patients_count: 3,
               },
               {
                  date: '2026-04-03',
                  total_income: 0,
                  patients_count: 0,
               },
            ],
         },
      },
      doctors_report: {
         success: true,
         message: "Shifokorlar bo'yicha hisobot olingan",
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f3',
               doctor_name: 'Dr. Qodirov',
               total_income: 2300000,
               patients_count: 9,
            },
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f6',
               doctor_name: 'Dr. Farangiz Karimova',
               total_income: 1800000,
               patients_count: 7,
            },
         ],
      },
      specializations_report: {
         success: true,
         message: "Yo'nalishlar bo'yicha hisobot olingan",
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f2',
               specialization_name: 'EKO kardiologiya',
               total_income: 1500000,
               patients_count: 6,
            },
         ],
      },
      workers_report: {
         success: true,
         message: "Hamshiralar bo'yicha hisobot olingan",
         data: [
            {
               _id: '64b8f1a2c3d4e5f6a7b8c9f4',
               nurse_name: 'Hamshira Guli',
               total_income: 1200000,
               patients_count: 5,
            },
         ],
      },
   },

   // ============== UPLOAD RESPONSES ==============
   upload: {
      file_success: {
         success: true,
         message: 'Fayl muvaffaqiyatli yuklandi',
         data: {
            file_path:
               'https://s3.example.com/image/550e8400-e29b-41d4-a716-446655440000.webp',
         },
      },
      video_success: {
         success: true,
         message: 'Video muvaffaqiyatli yuklandi',
         data: {
            file_path:
               'https://example.com/uploads/video/550e8400-e29b-41d4-a716-446655440000.mp4',
         },
      },
      error_file_too_large: {
         success: false,
         error: {
            statusCode: 400,
            statusMsg: 'BAD_REQUEST',
            msg: 'Fayl hajmi juda katta. Maksimal 50 MB',
         },
      },
   },

   // ============== ERROR RESPONSES ==============
   errors: {
      unauthorized: {
         success: false,
         error: {
            statusCode: 401,
            statusMsg: 'UNAUTHORIZED',
            msg: 'Tokeni kiritilishi shart',
         },
      },
      forbidden: {
         success: false,
         error: {
            statusCode: 403,
            statusMsg: 'FORBIDDEN',
            msg: 'Sizga bu amalga ruxsat berilmagan',
         },
      },
      not_found: {
         success: false,
         error: {
            statusCode: 404,
            statusMsg: 'NOT_FOUND',
            msg: 'Izlangan resurs topilmadi',
         },
      },
      validation_error: {
         success: false,
         error: {
            statusCode: 422,
            statusMsg: 'UNPROCESSABLE_ENTITY',
            msg: "Kiritilgan ma'lumotlar noto'g'ri",
         },
      },
      too_many_requests: {
         success: false,
         error: {
            statusCode: 429,
            statusMsg: 'TOO_MANY_REQUESTS',
            msg: "Juda ko'p so'rovlar yuborildi. 15 minutdan keyin qayta urinib ko'ring",
         },
      },
      server_error: {
         success: false,
         error: {
            statusCode: 500,
            statusMsg: 'INTERNAL_SERVER_ERROR',
            msg: 'Server xatosi yuz berdi',
         },
      },
   },
}
