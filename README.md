# AI Dashboard & Intelligent Feedback System 🎓✨

A premium, full-stack web application designed to empower educators by automating the analysis of student assignments using advanced AI. The system acts as a "Copilot," providing class-wide insights, detecting misconception patterns, and generating highly detailed, personalized feedback for every student.

## 🚀 Key Features

*   **Advanced AI Analysis (Groq integration)**: Uses large language models (`llama-3.3-70b-versatile`) to instantly process assignments, detect conceptual misunderstandings, and suggest detailed mini-lessons.
*   **Rich File Support**: Upload assignments in bulk via `.pdf`, `.csv`, `.json`, or `.txt`. Features built-in PDF text extraction.
*   **Unified Student Accounts**: A single student email can belong to multiple teachers. Students access a centralized, password-protected portal to review their feedback.
*   **Automated Email Dispatch**: Integrated SMTP client automatically emails students when a teacher approves their feedback.
*   **Multi-Language Translation**: Teachers can instantly translate AI-generated feedback into English, Hindi, Spanish, French, German, Arabic, Chinese, Japanese, or Portuguese.
*   **Smart Dashboard & Metrics**: Real-time charts and analytics visualizing class performance and AI confidence scores.
*   **Premium UI/UX**: Built with Next.js 14, Tailwind CSS, Lucide React, and Framer Motion for a stunning, glassmorphism aesthetic with seamless dark/light mode toggle.

## 🧠 Tech Stack

*   **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion, Recharts
*   **Backend**: Next.js API Routes, NextAuth.js
*   **Database**: MongoDB (Mongoose)
*   **AI Engine**: Groq Cloud API
*   **Email**: Nodemailer (SMTP Integration)
*   **File Parsing**: `pdf-parse`, `papaparse`

## 📦 Setup Instructions

1.  **Clone the repository and install dependencies:**
    ```bash
    git clone <repo_url>
    cd ai-dashboard
    npm install
    ```

2.  **Environment Variables (`.env.local`):**
    Configure your keys at the root of the project:
    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/ai-assignment-analytics
    
    # NextAuth
    NEXTAUTH_SECRET=your_super_secret_key_here
    NEXTAUTH_URL=http://localhost:3000
    
    # AI Integration
    GROQ_API_KEY=your_groq_api_key_here
    
    # Email SMTP (For sending feedback)
    EMAIL_SMTP_HOST=smtp.gmail.com
    EMAIL_SMTP_PORT=587
    EMAIL_SMTP_USER=your_email@gmail.com
    EMAIL_SMTP_PASS=your_app_password
    ```

3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

4.  **Open the App:**
    *   **Teacher Dashboard**: Navigate to [http://localhost:3000](http://localhost:3000)
    *   **Student Portal**: Navigate to [http://localhost:3000/student](http://localhost:3000/student)

## 🛡️ Architecture & Data Privacy

*   **Teacher Autonomy**: The system is designed requiring human-in-the-loop. Teachers review, edit, and approve all AI-generated feedback before it reaches the student.
*   **Secure Student Portal**: Implements a custom two-step password authentication flow using bcrypt hashing for student privacy.
*   **MongoDB Schemas**: Structured highly relational mapping between `User` (Teachers), `Student` (Unified roster across teachers), `Assignment` (Batches), and `Feedback` (Specific interactions).

## 📝 License

MIT
