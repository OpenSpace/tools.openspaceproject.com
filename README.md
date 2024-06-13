# Getting Started
First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy
When finishing development and wanting to deploy, you'll need to run `npm run build` and _also commit_ the `out` folder. The server that is serving the webpage does not have sufficiently modern NodeJS to compile the page itself, so we need to feed it the compiled version.
