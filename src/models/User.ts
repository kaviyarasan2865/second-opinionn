import mongoose from 'mongoose'


const timeSlotSchema = new mongoose.Schema({
  start: {
    type: String, 
    required: true
  },
  end: {
    type: String, 
    required: true
  }
}, { _id: false });


const doctorAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  slots: {
    type: [timeSlotSchema],
    default: []
  }
}, { _id: false });

//Final schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor']
  },
  // Doctor-only fields
  speciality: {
    type: String
  },
  experience: {
    type: Number
  },
  availability: {
    type: [doctorAvailabilitySchema],
    default: []
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
