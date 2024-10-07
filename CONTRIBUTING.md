# Table of Contents 📃

- [Libraries and tools being used in the project](#libraries-and-tools-being-used-in-the-project)
- [Setting up the project](#setting-up-the-project-🛠️)
- [Project Structure and important information](#project-structure-and-important-information)
- [Style Guide](#style-guide)
- [Standard commit message](#standard-commit-message-📦)
- [Before making a PR](#before-making-a-pr)

## Libraries and tools being used in the project

- [ReactJS](https://react.dev/learn) as the main frontend library
- [Mantine UI](https://mantine.dev/getting-started/) for UI components
- [Redux](https://redux-toolkit.js.org/introduction/getting-started) for state management

Check the `package.json` file for more information about all the libraries being used.
This project is using Eslint and Prettier for linting and formatting the code.

## Setting up the project 🛠️

1. Fork the repository
2. Clone **your forked** repository
3. Change directory to the project folder(`cd path/to/project`)
4. Run `npm install` to install all the dependencies
5. Run `npm run dev` to start the development server.
   The development server will start at `http://localhost:5173/`

## Project Structure and important information

1. All the required assets(images, audio, videos) for the project are in the `src/assets` folder.
2. The routes for all the web pages are defined in the `src/App.jsx` file.
3. All the API routes are stored as constants in the `src/routes/api_routes.jsx` file.
4. Only the **global** components are in the `src/components` folder.
5. Only the **global** web pages are in the `src/pages` folder.
6. All the web pages related to a a **module** are in `src/modules/<module-name>` folder.
7. All the components related to a **module** are in the `src/modules/<module-name>/components` folder.
8. All the styles related to a **module** are in the `src/modules/<module-name>/styles` folder.
9. All the state management related code is in the `src/redux` folder. The `src/redux/userSlice.jsx` file contains user-related states. You can access the username and role of the user using the `useSelector` hook.

```jsx
import { useSelector } from 'react-redux';

const ExampleComponent = () => {
  const role = useSelector(state => state.user.role);
  const username = useSelector(state => state.user.username);
  return (
    <div>
      {username}
      {role}
    </div>
  );
}
```

## Style Guide

- All the folder names should be in kebab-case.
- All the file names should be in camelCase.
- All the constants should be in UPPERCASE.
- All the components should be in PascalCase.

**Note**: Please make sure to follow the project structure and naming conventions while adding new files or folders to the project.

## Standard commit message 📦

This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard. Please follow these steps to ensure your commit messages are standardized:

- Commit messages should have this format:
  `<type>[optional scope]: <description>`
- Type must be one of the following:
  - **build**: Changes that affect the build system or external dependencies
  - **ci**: Changes to our CI configuration files and scripts
  - **docs**: Documentation only changes
  - **feat**: A new feature
  - **fix**: A bug fix
  - **perf**: A code change that improves performance
  - **chore**: A code change that neither fixes a bug nor adds a feature
  - **refactor**: A code change that improves code quality or makes it easier to maintain
  - **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - **test**: Adding missing tests or correcting existing tests
- Scope should be specified: `ui` or `api` or `global`.
- Description should be concise and in present imperative tense as mentioned [here](https://git.kernel.org/pub/scm/git/git.git/tree/Documentation/SubmittingPatches?h=v2.36.1#n181).
- Example1: `feat[ui]: add dark-mode`
- Example2: `feat[ui,api]: add searching courses functionality`

## Before making a PR

[Guide for making a PR](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github)
