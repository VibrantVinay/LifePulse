const Joi = require("joi");

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const donorSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+91[6-9]\d{9}$/).required(), // Indian mobile format
  bloodGroup: Joi.string().valid(...bloodGroups).required(),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    address: Joi.string().allow("").optional()
  }).required(),
  isAvailable: Joi.boolean().default(true),
  lastDonationDate: Joi.date().iso().allow(null).default(null),
  kycVerification: Joi.object({
    isVerified: Joi.boolean().default(false),
    verificationReference: Joi.string().default("[ID Verification Pending]") 
  }).default()
});

const hospitalSchema = Joi.object({
  hospitalName: Joi.string().required(),
  registrationNumber: Joi.string().required(),
  contactPhone: Joi.string().required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().required()
  }).required()
});

module.exports = { donorSchema, hospitalSchema };
