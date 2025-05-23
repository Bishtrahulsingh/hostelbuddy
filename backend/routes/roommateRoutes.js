import express from 'express';
import asyncHandler from 'express-async-handler';
import Roommate from '../models/roommateModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/roommates
// @desc    Get all roommates with filters
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // Build query based on filters
  const query = { isActive: true };

  // Filter by age range
  if (req.query.minAge && req.query.maxAge) {
    query.age = { 
      $gte: Number(req.query.minAge), 
      $lte: Number(req.query.maxAge) 
    };
  } else if (req.query.minAge) {
    query.age = { $gte: Number(req.query.minAge) };
  } else if (req.query.maxAge) {
    query.age = { $lte: Number(req.query.maxAge) };
  }

  // Filter by gender
  if (req.query.gender) {
    query.gender = req.query.gender;
  }

  // Filter by occupation
  if (req.query.occupation) {
    query.occupation = req.query.occupation;
  }

  // Filter by budget
  if (req.query.minBudget && req.query.maxBudget) {
    query['budget.min'] = { $lte: Number(req.query.maxBudget) };
    query['budget.max'] = { $gte: Number(req.query.minBudget) };
  } else if (req.query.minBudget) {
    query['budget.max'] = { $gte: Number(req.query.minBudget) };
  } else if (req.query.maxBudget) {
    query['budget.min'] = { $lte: Number(req.query.maxBudget) };
  }

  // Filter by city
  if (req.query.city) {
    query['preferredLocation.city'] = { $regex: req.query.city, $options: 'i' };
  }

  // Filter by areas
  if (req.query.areas) {
    const areasList = req.query.areas.split(',');
    query['preferredLocation.areas'] = { $in: areasList };
  }

  // Filter by move-in date
  if (req.query.moveInDate) {
    const date = new Date(req.query.moveInDate);
    query.moveInDate = { $lte: date };
  }

  // Filter by stay duration
  if (req.query.stayDuration) {
    query.stayDuration = req.query.stayDuration;
  }

  // Filter by lifestyle preferences
  if (req.query.smoking === 'true' || req.query.smoking === 'false') {
    query['lifestyle.smoking'] = req.query.smoking === 'true';
  }
  if (req.query.drinking === 'true' || req.query.drinking === 'false') {
    query['lifestyle.drinking'] = req.query.drinking === 'true';
  }
  if (req.query.pets === 'true' || req.query.pets === 'false') {
    query['lifestyle.pets'] = req.query.pets === 'true';
  }
  if (req.query.earlyRiser === 'true' || req.query.earlyRiser === 'false') {
    query['lifestyle.earlyRiser'] = req.query.earlyRiser === 'true';
  }
  if (req.query.nightOwl === 'true' || req.query.nightOwl === 'false') {
    query['lifestyle.nightOwl'] = req.query.nightOwl === 'true';
  }

  // Search by keyword (name or bio)
  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { bio: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // Geospatial search if coordinates provided
  if (req.query.lat && req.query.lng && req.query.maxDistance) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(req.query.lng), Number(req.query.lat)],
        },
        $maxDistance: Number(req.query.maxDistance) * 1000, // convert km to meters
      },
    };
  }

  const count = await Roommate.countDocuments(query);
  const roommates = await Roommate.find(query)
    .populate('user', 'id name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    roommates,
    page,
    pages: Math.ceil(count / pageSize),
    totalCount: count,
  });
}));

// @route   GET /api/roommates/:id
// @desc    Get roommate by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const roommate = await Roommate.findById(req.params.id).populate('user', 'id name email');

  if (roommate) {
    res.json(roommate);
  } else {
    res.status(404);
    throw new Error('Roommate not found');
  }
}));

// @route   POST /api/roommates
// @desc    Create a roommate profile
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  // Check if user already has a roommate profile
  const existingRoommate = await Roommate.findOne({ user: req.user._id });

  if (existingRoommate) {
    res.status(400);
    throw new Error('You already have a roommate profile');
  }

  const {
    name,
    age,
    gender,
    occupation,
    budget,
    location,
    preferredLocation,
    moveInDate,
    stayDuration,
    lifestyle,
    bio,
    profileImage,
    contactPreference,
    phone,
  } = req.body;

  const roommate = new Roommate({
    user: req.user._id,
    name,
    age,
    gender,
    occupation,
    budget,
    location,
    preferredLocation,
    moveInDate,
    stayDuration,
    lifestyle,
    bio,
    profileImage,
    contactPreference,
    phone,
    isActive: true,
  });

  const createdRoommate = await roommate.save();
  res.status(201).json(createdRoommate);
}));

// @route   PUT /api/roommates/:id
// @desc    Update a roommate profile
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const roommate = await Roommate.findById(req.params.id);

  if (roommate) {
    // Check if user is the owner
    if (roommate.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to update this profile');
    }

    // Update fields
    roommate.name = req.body.name || roommate.name;
    roommate.age = req.body.age || roommate.age;
    roommate.gender = req.body.gender || roommate.gender;
    roommate.occupation = req.body.occupation || roommate.occupation;
    roommate.budget = req.body.budget || roommate.budget;
    roommate.location = req.body.location || roommate.location;
    roommate.preferredLocation = req.body.preferredLocation || roommate.preferredLocation;
    roommate.moveInDate = req.body.moveInDate || roommate.moveInDate;
    roommate.stayDuration = req.body.stayDuration || roommate.stayDuration;
    roommate.lifestyle = req.body.lifestyle || roommate.lifestyle;
    roommate.bio = req.body.bio || roommate.bio;
    roommate.profileImage = req.body.profileImage || roommate.profileImage;
    roommate.contactPreference = req.body.contactPreference || roommate.contactPreference;
    roommate.phone = req.body.phone || roommate.phone;
    roommate.isActive = req.body.isActive !== undefined ? req.body.isActive : roommate.isActive;

    const updatedRoommate = await roommate.save();
    res.json(updatedRoommate);
  } else {
    res.status(404);
    throw new Error('Roommate profile not found');
  }
}));

// @route   DELETE /api/roommates/:id
// @desc    Delete a roommate profile
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const roommate = await Roommate.findById(req.params.id);

  if (roommate) {
    // Check if user is the owner
    if (roommate.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this profile');
    }

    await roommate.deleteOne();
    res.json({ message: 'Roommate profile removed' });
  } else {
    res.status(404);
    throw new Error('Roommate profile not found');
  }
}));

export default router;