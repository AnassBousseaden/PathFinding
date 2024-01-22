import adapter from '@sveltejs/adapter-static';
<<<<<<< HEAD

/** @type {import('@sveltejs/kit').Config} */
const config = {
=======
/** @type {import('@sveltejs/kit').Config} */
const config = {

>>>>>>> main
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};

export default config;

