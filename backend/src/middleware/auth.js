const { auth, db } = require("../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or malformed token." });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    // Attach role from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (userDoc.exists) {
      req.user.role = userDoc.data().role;
    } else {
      // Check if hospital
      const hospitalDoc = await db.collection("hospitals").doc(decodedToken.uid).get();
      if (hospitalDoc.exists) {
        req.user.role = "hospital";
        req.user.isVerified = hospitalDoc.data().isVerified;
      } else {
        req.user.role = "unregistered";
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid token.", details: error.message });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of [${allowedRoles.join(", ")}]` });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
