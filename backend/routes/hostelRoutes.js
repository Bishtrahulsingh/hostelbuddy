import express from 'express';
import asyncHandler from 'express-async-handler';
import Hostel from '../models/hostelModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/hostels
// @desc    Get all hostels with filters
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // Build query based on filters
  const query = {};

  // Filter by price range
  if (req.query.minPrice && req.query.maxPrice) {
    query.price = { 
      $gte: Number(req.query.minPrice), 
      $lte: Number(req.query.maxPrice) 
    };
  } else if (req.query.minPrice) {
    query.price = { $gte: Number(req.query.minPrice) };
  } else if (req.query.maxPrice) {
    query.price = { $lte: Number(req.query.maxPrice) };
  }

  // Filter by type
  if (req.query.type) {
    query.type = req.query.type;
  }

  // Filter by gender
  if (req.query.gender) {
    query.gender = req.query.gender;
  }

  // Filter by city
  if (req.query.city) {
    query['address.city'] = { $regex: req.query.city, $options: 'i' };
  }

  // Filter by amenities
  if (req.query.amenities) {
    const amenitiesList = req.query.amenities.split(',');
    query.amenities = { $all: amenitiesList };
  }

  // Filter by vacancies
  if (req.query.vacancies) {
    query.vacancies = { $gte: Number(req.query.vacancies) };
  }

  // Search by keyword (name or description)
  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { description: { $regex: req.query.keyword, $options: 'i' } },
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

  const count = await Hostel.countDocuments(query);
  const hostels = await Hostel.find(query)
    .populate('owner', 'id name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    hostels,
    page,
    pages: Math.ceil(count / pageSize),
    totalCount: count,
  });
}));

// @route   GET /api/hostels/:id
// @desc    Get hostel by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id).populate('owner', 'id name email');

  if (hostel) {
    res.json(hostel);
  } else {
    res.status(404);
    throw new Error('Hostel not found');
  }
}));

// @route   POST /api/hostels
// @desc    Create a hostel
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    name,
    description,
    address,
    location,
    price,
    images,
    type,
    gender,
    amenities,
    rules,
    vacancies,
    contactPhone,
    contactEmail,
  } = req.body;

  const hostel = new Hostel({
    owner: req.user._id,
    name,
    description,
    address,
    location,
    price,
    images,
    type,
    gender,
    amenities,
    rules,
    vacancies,
    contactPhone,
    contactEmail,
  });

  const createdHostel = await hostel.save();
  res.status(201).json(createdHostel);
}));

// @route   PUT /api/hostels/:id
// @desc    Update a hostel
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);

  if (hostel) {
    // Check if user is the owner
    if (hostel.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to update this hostel');
    }

    // Update fields
    hostel.name = req.body.name || hostel.name;
    hostel.description = req.body.description || hostel.description;
    hostel.address = req.body.address || hostel.address;
    hostel.location = req.body.location || hostel.location;
    hostel.price = req.body.price || hostel.price;
    hostel.images = req.body.images || hostel.images;
    hostel.type = req.body.type || hostel.type;
    hostel.gender = req.body.gender || hostel.gender;
    hostel.amenities = req.body.amenities || hostel.amenities;
    hostel.rules = req.body.rules || hostel.rules;
    hostel.vacancies = req.body.vacancies || hostel.vacancies;
    hostel.contactPhone = req.body.contactPhone || hostel.contactPhone;
    hostel.contactEmail = req.body.contactEmail || hostel.contactEmail;

    const updatedHostel = await hostel.save();
    res.json(updatedHostel);
  } else {
    res.status(404);
    throw new Error('Hostel not found');
  }
}));

// @route   DELETE /api/hostels/:id
// @desc    Delete a hostel
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);

  if (hostel) {
    // Check if user is the owner
    if (hostel.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to delete this hostel');
    }

    await hostel.deleteOne();
    res.json({ message: 'Hostel removed' });
  } else {
    res.status(404);
    throw new Error('Hostel not found');
  }
}));

// @route   POST /api/hostels/:id/reviews
// @desc    Create a new review
// @access  Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const hostel = await Hostel.findById(req.params.id);

  if (hostel) {
    // Check if user already reviewed
    const alreadyReviewed = hostel.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Hostel already reviewed');
    }

    // Create review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    hostel.reviews.push(review);
    hostel.numReviews = hostel.reviews.length;
    
    // Calculate average rating
    hostel.rating =
      hostel.reviews.reduce((acc, item) => item.rating + acc, 0) /
      hostel.reviews.length;

    await hostel.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Hostel not found');
  }
}));

export default router;