import User from "../models/UserSchema.js";
import Appointment from "../models/AppointmentSchema.js";
import Doctor from "../models/DoctorSchema.js";

// Update user info
export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update!" });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete!" });
  }
};

// get single user info
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "No user found!" });
  }
};

// get all users info
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found!" });
  }
};

// get user profile

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile info found",
      data: { ...rest },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//  get user appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.userId });

    const doctorIds = appointments.map((data) => data.doctor.id);
    
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res
      .status(200)
      .json({ success: true, message: "Appointments found", data: doctors });
  } catch (error) {
    res.status(500).json({success:false, message:"Something went wrong"})
  }
};
