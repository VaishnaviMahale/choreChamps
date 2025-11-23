import CalendarEvent from '../models/CalendarEvent.js';

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find()
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single calendar event
// @route   GET /api/calendar/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create calendar event
// @route   POST /api/calendar
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const { eventName, description, date } = req.body;

    const event = await CalendarEvent.create({
      eventName,
      description,
      date,
      createdBy: req.user._id
    });

    const populatedEvent = await CalendarEvent.findById(event._id)
      .populate('createdBy', 'name email');

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await CalendarEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

