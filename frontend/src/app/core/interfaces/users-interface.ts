/**
 * Represents a user account.
 *
 * @property id - (Optional) Unique identifier for the user.
 * @property email - The user's email address.
 * @property name - The user's display name.
 * @property password - The user's password (hashed or plain, depending on context).
 * @property createdAt - The date the user account was created.
 */

export interface User {
    id?: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
}

/**
 * Represents login credentials for authentication.
 *
 * @property email - The user's email address.
 * @property password - The user's password.
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Represents registration data for creating a new user.
 *
 * @property name - The user's display name.
 * @property email - The user's email address.
 * @property password - The user's chosen password.
 * @property confirmPassword - The password confirmation.
 * @property acceptPrivacyPolicy - Whether the user accepted the privacy policy.
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptPrivacyPolicy: boolean;
}