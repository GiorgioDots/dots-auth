import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false)
});

export const session = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const application = sqliteTable('applications', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	clientId: text('client_id').notNull().unique(),
	clientSecret: text('client_secret').notNull(),
	tokenExpirationSeconds: integer('token_expiration_seconds').notNull(),
	refreshTokenExpirationSeconds: integer('refresh_token_expiration_seconds').notNull()
});

export const userApplications = sqliteTable('user_applications', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	applicationId: text('application_id')
		.notNull()
		.references(() => application.id)
});

export const userApplicationsCodes = sqliteTable('user_applications_codes', {
	id: text('id').primaryKey(),
	idUserApplication: text('user_application_id')
		.notNull()
		.references(() => userApplications.id),
	code: text('code').notNull(),
	codeChallenge: text('code_challenge').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const refreshToken = sqliteTable('refresh_tokens', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	refreshToken: text('refresh_token').notNull().unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	isInvalidated: integer('is_invalidated', { mode: 'boolean' }).notNull().default(false),
	idApplication: text('application_id')
		.notNull()
		.references(() => application.id)
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Application = typeof application.$inferSelect;

export type UserApplications = typeof userApplications.$inferSelect;

export type RefreshToken = typeof refreshToken.$inferSelect;
