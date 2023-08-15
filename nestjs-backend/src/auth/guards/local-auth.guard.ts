import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// passport-local strategy
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
