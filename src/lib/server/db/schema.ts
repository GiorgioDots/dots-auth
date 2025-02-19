import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('users', {
	id: text('id').primaryKey(),
	age: integer('age'),
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
	redirectUri: text('redirect_uri').notNull(),
	// tokenExpirationSeconds: integer('token_expiration_seconds'),
	// refreshTokenExpirationSeconds: integer('refresh_token_expiration_seconds')
});

export const userApplications = sqliteTable('user_applications', {
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	applicationId: text('application_id')
		.notNull()
		.references(() => application.id)
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Application = typeof application.$inferSelect;

export type UserApplications = typeof userApplications.$inferSelect;
