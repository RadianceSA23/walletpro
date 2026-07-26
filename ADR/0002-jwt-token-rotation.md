# ADR 0002: Dual Token JWT Authentication with Refresh Token Rotation

## Context & Problem Statement
Stateful sessions using server memory/Redis require central session state. Stateless JWTs present revocation challenges if stolen before expiration.

## Decision Drivers
- High security: Minimize potential impact of leaked access tokens.
- Revocation capability: Ability to immediately block compromised refresh tokens.
- Stateless scalability: Access token validation occurs in memory via signature verification without database hits.

## Decision Outcome
Implement Dual Token JWT Architecture:
1. **Access Token**: Expiration 15 minutes. Signed with `JWT_SECRET`. Included in `Authorization: Bearer <token>` header.
2. **Refresh Token**: Expiration 7 days. Hashed with bcrypt and stored in MongoDB `refresh_tokens` collection with `expiresAt` TTL index.
3. On `/auth/refresh`, validate token hash, issue new access token + new refresh token, and mark old refresh token as revoked.

## Consequences
- **Positive**: High security, instant access token verification without DB call, token revocation control via DB refresh token record.
- **Negative**: Client must handle silent token refresh interceptors on `401 Unauthorized`.
