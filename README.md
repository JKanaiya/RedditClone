# RedditClone

RedditClone provides a front-end application to mimic some of the main functionality of the reddit.com website. 
This API:https://github.com/JKanaiya/RedditCloneAPI provides the functionality to facilitate this interaction.

## Features

- Displays the existing, and allows creation of:
  - Users
    - and lists the users that the  logged in user is following
    - and that are following the logged in user
  - Posts ( on specified subreddits )
    - Votes on said post
    - Comments
      - on said post
      - Comments
        - on said comment ( repeating )
        - Votes on said comment
  - Follow requests
    - to and from users
  - Subreddits
- Persistent Login/Signup.
- Login with a guest account.
- Change the user's profile image and user name.

## Usage

### Setup

1. Clone the repo
```bash
git clone https://github.com/JKanaiya/RedditClone.git
cd RedditClone
```
2. Install dependencies
```bash
pnpm i
```
3. Create and configure .env
```bash
echo "VITE_BACKEND_URL=<your_backend_url_here>
VITE_SUPABASE_URL=<your_supabase_project_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your_supabase_publishable_key>
VITE_GUEST_USER_PASSWORD=<the_password_for_the_guest_user>
" >> .env
```
4. Run the development server
```bash
npm run dev
```

License
-------

The project is licensed under the BSD license.
