export interface Message {
    id: string
    content: string
    sender: "doctor" | "patient"
    timestamp: Date
    status?: "sent" | "delivered" | "read"
    isTyping?: boolean
  }
  
  export interface AgentForceSession {
    sessionId: string;
    externalSessionKey: string;
    accessToken: string;
  }
  
  export interface MedicalAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName?: string;
    userInitial?: string;
  }
  
  export interface Report {
    id: number
    title: string
    date: string
    status: string
    icon?: string
  }
  
  export interface Medication {
    id: number
    name: string
    dosage: string
    frequency: string
    refillDate: string
    progress: number
    color?: string
  }
  
  export interface Appointment {
    _id: string
    doctorId: string
    date: string
    time: string
    status: "pending" | "accepted" | "rejected"
    doctorName?: string
  }