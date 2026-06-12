// User object returned by the API
// (register, login and /me all return this same shape)
export type User = {
	id: number;
	name: string;
	email: string;
};

// Response shape of POST /api/auth/login
// Only login returns a JWT token
export type LoginResponse = {
	user: User;
	token: string;
};

// Response shape of POST /api/auth/register and GET /api/auth/me
export type UserResponse = {
	user: User;
	token: string;
};

export type CategoriesResponse = {
	categories: ICategories[];
};

export type ICategories = {
	id: number;
	name: string;
	color: string;
	count?: number;
};
