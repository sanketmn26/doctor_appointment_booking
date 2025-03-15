import Doctor from "../models/DoctorSchema.js";
import Appointment from "../models/AppointmentSchema.js";

// Update user info
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update!" });
  }
};

// delete user
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: deletedDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete!" });
  }
};

// get single user info
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all users info
export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "Users found",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Not found!" });
  }
};

// get doctor profile
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;

    const appointments = await Appointment.find({ doctor: doctorId });

    res.status(200).json({
      success: true,
      message: "Doctor profile info found",
      data: { ...rest, appointments },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
