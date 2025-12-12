# Feature: User Authentication

**Feature ID**: authentication  
**Priority**: P0 (Prerequisite)  
**Phase**: Phase II  
**Created**: 2025-12-07

## Overview

Implement user authentication using Better Auth with JWT tokens for stateless API authentication.

## User Stories

- **US-W1**: User Registration - Create account with email/password
- **US-W2**: User Login - Authenticate and receive JWT token

## Technical Stack

- **Frontend**: Better Auth client, Next.js middleware
- **Backend**: JWT verification middleware (PyJWT)
- **Database**: PostgreSQL users table (Better Auth managed)
- **Token**: JWT with 7-day expiry, HS256 algorithm

## Authentication Flow

1. User submits credentials → Better Auth validates
2. Better Auth issues JWT token with user ID, email, expiry
3. Frontend stores token in HTTP-only cookie
4. All API requests include `Authorization: Bearer <token>`
5. Backend middleware verifies token signature
6. Backend extracts user_id from token for authorization

## Security

- Passwords hashed with bcrypt (cost 12)
- JWT signed with BETTER_AUTH_SECRET (shared between frontend/backend)
- Tokens expire after 7 days
- No token refresh (user must re-authenticate)

**Status**: ✅ Specification Complete
