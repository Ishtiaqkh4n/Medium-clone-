import crypto from "crypto";

const generateSecureOTP = () => {
  return crypto.randomInt(100000, 1000000);
};

