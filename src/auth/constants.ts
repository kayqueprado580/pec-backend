export const jwtConstants = {
	// secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
	secret: process.env.JWT_SECRET || 'default_secret'
};