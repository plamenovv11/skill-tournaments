import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Auth guard - allows both authenticated and unauthenticated requests.
 * If a valid JWT is provided, req.user will be populated.
 * If no JWT is provided, the request proceeds without authentication.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Call the parent canActivate but don't throw on failure
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        // Don't throw an error if there's no user (no JWT provided)
        // Simply return null/undefined, and the controller can check for it
        return user || null;
    }
}
