# Security Policy

## Reporting a vulnerability

Please do not disclose exploitable vulnerabilities, credentials, or private user data in public issues.

For a sensitive report, contact the repository maintainer privately through the contact options on the [maintainer's GitHub profile](https://github.com/0053ishav). Include the affected area, impact, reproduction steps, and any relevant logs with secrets removed.

## Security expectations

- The backend must authorize every privileged operation; frontend checks are not sufficient.
- Never commit passwords, admin tokens, API keys, or production data.
- Treat all frontend configuration and bundled code as public.
- Rotate exposed credentials immediately. Removing a secret from the current branch does not erase it from previous Git history.
