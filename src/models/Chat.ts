import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

const chatSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
})

chatSchema.pre('save', function (next) {
  this.lastUpdated = new Date()
  next()
})

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)
export default Chat
