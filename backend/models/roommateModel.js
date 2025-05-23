import mongoose from 'mongoose';

const roommateSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    occupation: {
      type: String,
      required: true,
      enum: ['student', 'working', 'other'],
    },
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    preferredLocation: {
      city: { type: String, required: true },
      areas: [{ type: String }],
    },
    moveInDate: {
      type: Date,
      required: true,
    },
    stayDuration: {
      type: String,
      required: true,
      enum: ['less than 3 months', '3-6 months', '6-12 months', 'more than 12 months'],
    },
    lifestyle: {
      smoking: { type: Boolean, default: false },
      drinking: { type: Boolean, default: false },
      pets: { type: Boolean, default: false },
      cooking: { type: Boolean, default: false },
      earlyRiser: { type: Boolean, default: false },
      nightOwl: { type: Boolean, default: false },
    },
    bio: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    contactPreference: {
      type: String,
      required: true,
      enum: ['email', 'phone', 'both'],
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for geospatial queries
roommateSchema.index({ location: '2dsphere' });

const Roommate = mongoose.model('Roommate', roommateSchema);

export default Roommate;