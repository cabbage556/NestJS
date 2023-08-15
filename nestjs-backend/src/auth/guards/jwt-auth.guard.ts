import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy.enum';

// passport-jwt strategy - 'access' / 'refresh'
export const JwtAuthGuard = (strategy: JwtStrategy) => {
  return class JwtAuthGuard extends AuthGuard(strategy) {};
};
