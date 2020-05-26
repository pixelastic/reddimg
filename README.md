# Reddimg

## Configuration

### Create an ssh key pair

We need to create an SSH key with write access to the repository.

    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

When prompted, enter the name of the key (for example: `reddimg`)

### GitHub

#### SSH Key

We then need to tell GitHub the public key, so we can push commit from CircleCI.
For that, go to the GitHub repository settings to add a new deploy key (or
[follow this link][1])

Enter a descriptive name (`CircleCI Write key (to push commits from CircleCI)`),
and copy your **public** key into the textarea (the content of the `reddimg.pub`
file generated).

Don't forget to check the "Allow write access" checkbox.

#### Access token

We also need to create a personal access token, so we can create issues and pull
request on the repository from scripts running on CircleCI.

Go to your account settings, Developer Settings and Personal access tokens (or
[follow this link][3]).

Generate a new token and give it a descriptive name (for example `reddimg`) and
give it the `repo` permissions. The token hash will be displayed on the next
page, copy it and keep it safe.

You should also have it available locally as the `GITHUB_TOKEN` environment
variable.

### CircleCI

#### SSH Keys

Finally, we need to copy the private key to CircleCI.

Navigate to your project on CircleCI, Settings and SSH Keys (or [follow this
link][2]) and add the SSH key.

Set `github.com` as the hostname and copy your private key in the textarea.

#### Environment variables

The update script needs the Algolia and GitHub credentials to run.

You'll need to add the `ALGOLIA_APP_ID`, `ALGOLIA_API_KEY`, `ALGOLIA_INDEX_NAME` and
`GITHUB_TOKEN` environment variables to your CircleCI settings ([follow this link][4])

### Netlify

The Algolia search credentials needs to be set in the Netlify environment
variables so the website can be built correctly ([follow this link][5]).

The variables are `ALGOLIA_APP_ID`, `ALGOLIA_INDEX_NAME` and `ALGOLIA_SEARCH_API_KEY`.

[1]: https://github.com/pixelastic/reddimg/settings/keys/new
[2]: https://app.circleci.com/settings/project/github/pixelastic/reddimg/ssh
[3]: https://github.com/settings/tokens
[4]: https://app.circleci.com/settings/project/github/pixelastic/reddimg/environment-variables
[5]: https://app.netlify.com/sites/reddimg-pixelastic/settings/deploys#environment
