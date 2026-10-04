const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseAdmin");
const { verifyToken } = require("../middleware/auth");
const { donorSchema, hospitalSchema } = require("../models/schemas");

// Register Donor Profile (Post OTP login)
router.post("/register/donor", verifyToken, async (req, res) => {
  const { error, value } = donorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const profileData = {
      ...value,
      uid: req.user.uid,
      role: "donor",
      createdAt: new Date().toISOString()
    };

    await db.collection("users").doc(req.user.uid).set(profileData);
    res.status(201).json({ message: "Donor profile created.", profile: profileData });
  } catch (err) {
    res.status(500).json({ error: "Database error." });
  }
});

// Register Hospital Profile
router.post("/register/hospital", verifyToken, async (req, res) => {
  const { error, value } = hospitalSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const hospitalData = {
      ...value,
      uid: req.user.uid,
      role: "hospital",
      isVerified: false, // Must be verified by admin later
      createdAt: new Date().toISOString()
    };

    await db.collection("hospitals").doc(req.user.uid).set(hospitalData);
    res.status(201).json({ message: "Hospital profile pending admin verification." });
  } catch (err) {
    res.status(500).json({ error: "Database error." });
  }
});

module.exports = router;
