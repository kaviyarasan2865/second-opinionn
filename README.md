    # Second Opinion - Medical Consultation Platform

Second Opinion is a modern web application built with Next.js that enables patients to seek second medical opinions from healthcare professionals. The platform facilitates secure communication between patients and doctors, allowing for better healthcare decisions.

try it out [here]( it out [here](https://second-opinionn.vercel.app))
## :building_construction: Architecture

![Screenshot](./public/WhatsApp%20Image%202025-04-30%20at%2017.40.45_c8f90142.jpg)

The application follows a modern web architecture with the following key components:

- **Frontend**: Next.js 15.3.0 with React 19
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: **AgentForce Agent** for intelligent assistance

## :rocket: Features

- Secure user authentication and authorization
- Patient-doctor communication platform
- Medical consultation management
- Real-time updates and notifications
- Responsive and modern UI
- Type-safe development with TypeScript
- **:robot_face: AgentForce AI Agent Integration**
  - Intelligent patient-doctor matching
  - Automated consultation scheduling
  - Smart medical record analysis
  - AI-powered follow-up recommendations

## :arrows_counterclockwise: Project Flow

### User Journey

1. **Registration & Authentication**
   - Users (patients and doctors) register with their credentials
   - Email verification process
   - Secure login with NextAuth.js
   - **AgentForce agent** assists in profile completion

2. **Patient Flow**
   - Create and manage medical profiles
   - Upload medical records and reports
   - **AgentForce agent** analyzes medical records
   - Search for available doctors
   - **AgentForce agent** suggests relevant doctors based on medical history
   - Request second opinions
   - Schedule consultations
   - Track consultation status
   - Receive and review medical opinions
   - **AgentForce agent** provides follow-up recommendations

3. **Doctor Flow**
   - Complete professional profile
   - Set availability and consultation preferences
   - **AgentForce agent** optimizes schedule management
   - Review patient requests
   - Access patient medical records
   - **AgentForce agent** assists in medical record analysis
   - Provide second opinions
   - Schedule and conduct consultations
   - Update consultation status
   - **AgentForce agent** generates consultation summaries

4. **Consultation Process**
   - Initial request submission
   - **AgentForce agent** pre-screens requests
   - Doctor acceptance/rejection
   - Scheduling and confirmation
   - Consultation session
   - Opinion submission
   - Follow-up communication
   - **AgentForce agent** manages follow-up care

### System Flow

1. **Data Flow**
   - User data → MongoDB database
   - Medical records → Secure storage
   - Real-time updates → WebSocket connections
   - Authentication → NextAuth.js session management
   - **AgentForce agent** → AI processing pipeline

2. **Security Flow**
   - Request validation → API middleware
   - Authentication check → Protected routes
   - Data encryption → Secure transmission
   - Session management → Secure cookies
   - **AgentForce agent** → Secure AI processing

3. **Integration Flow**
   - Frontend ↔ Backend API communication
   - Database ↔ Application server
   - External services ↔ API endpoints
   - Real-time updates ↔ WebSocket server
   - **AgentForce agent** ↔ AI service integration

## :hammer_and_wrench: Tech Stack

- **Framework**: Next.js 15.3.0
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **UI Components**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Security**: bcryptjs for password hashing
- **AI Integration**: **AgentForce Agent**

## :clipboard: Prerequisites

Before running the project, ensure you have:

- Node.js (Latest LTS version recommended)
- MongoDB instance (local or cloud)
- Git

## :rocket: Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd second-opinionn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
MONGODB_URI=your_mongodb_uri
NEXTAUTH_URL=URL_ADDRESS:3000
password=your_password
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_SF_API_HOST=https://api.salesforce.com
NEXT_PUBLIC_SF_ORG_DOMAIN=https://orgfarm-84304637e8-dev-ed.develop.my.salesforce.com
NEXT_PUBLIC_SF_CLIENT_ID=your_client_id
NEXT_PUBLIC_SF_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SF_AGENT_ID=your_agent_id
MONGODB_URI=
SLACK_WEBHOOK_URL=your_slack_webhook_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## :file_folder: Project Structure

```
src/
├── app/          # Next.js app router pages and API routes
├── components/   # Reusable React components
├── lib/         # Utility functions and configurations
├── models/      # MongoDB models
├── providers/   # Context providers
├── schemas/     # Data validation schemas
└── types/       # TypeScript type definitions
```

## :lock: Security

- Authentication handled by NextAuth.js
- Password hashing using bcryptjs
- Protected API routes
- Secure session management

## :test_tube: Development

- **Linting**: `npm run lint`
- **Type Checking**: Built-in TypeScript checking
- **Formatting**: ESLint configuration included

## :memo: License

[Add your license information here]

## :busts_in_silhouette: Contributing

[Add contribution guidelines here]

## :telephone_receiver: Support

[Add support information here]