# Project conventions

- Store article bodies as HTML string modules registered in the content loader and metadata catalog so article rendering and discovery stay aligned.
- Keep the public Turnstile site key in Vite's build configuration with an environment override; it is public and must survive deployments without manual environment setup.
- Keep newsletter Turnstile response validation in the function-local pure helper so action and hostname restrictions can be regression tested without secrets or network access.
- Never allow localhost tokens on the shared production newsletter backend; local widget rendering alone is not end-to-end verification.