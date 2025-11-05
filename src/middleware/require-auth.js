import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { getUserByEmail } from '../controllers/user';

require('dotenv').config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await getUserByEmail(payload.sub);

    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    console.log(error);
    return done(error, false);
  }
});

passport.use(jwtLogin);

const requireAuth = passport.authenticate('jwt', { session: false });

export default requireAuth;
