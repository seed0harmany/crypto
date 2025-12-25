import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  console.log('REGISTER HIT', req.body);

  if (!fullName || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    fullName,
    email,
    passwordHash
  });

  res.status(201).json({ message: 'Account created' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing credentials' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid)
    return res.status(401).json({ message: 'Invalid credentials' });

  user.lastLogin = new Date();
  await user.save();

  const token = signToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email
    }
  });
};
