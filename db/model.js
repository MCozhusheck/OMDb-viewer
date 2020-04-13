const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const movieSchema = mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userRating: {
    type: Number,
    required: false,
    min: 1,
    max: 10,
    validate: {
        validator: Number.isInteger
    }
  },
  isFavourite: {
    type: Boolean,
    required: false,
    default: false
  }
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: 'Invalid Email address' });
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 5
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  movies: [movieSchema]
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    console.log('incorrect password')
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
