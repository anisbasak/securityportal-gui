# Securityportal GUI

Front end client for the Security Portal

## Setup

1. Install XCode CLI tools

    ```bash
    xcode-select --install
    ```

1. Install Homebrew

    ```bash
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```

1. Verify Homebrew installation is good (and make fixes if not)

    ```bash
    brew doctor
    ```

1. Install necessary packages

    ```bash
    brew install node
    ```

1. Clone repository

    ```bash
    cd ~/code
    git clone https://github.ncsu.edu/SAT/securityportal-gui.git
    cd securityportal-gui
    ```

1. Set up Username and Email

    ```bash
    git config --list
    git config user.name "<Name>"
    git config user.email "<email>"
    ```

1. Globally install angular command line tools

    ```bash
    npm i --global @angular/cli
    ```

1. Install the packages

    ```bash
    npm i
    ```

    > In addition to the packages being installed, two `postinstall` scripts will run. The first
    > copies the current git SHA to a project root level file named `revision.json`. The second
    > writes a root level file named `proxy.conf.json`. Modifiy this git-ignored file when you
    > wish to proxy self calls to a different server.

1. Verify global version of `@angular/cli` is not ahead of the local version:

    ```bash
    ng -v
    ```

## Development server

```bash
npm run start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any
of the source files.

## Build

The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
npm run build:dev
npm run build:dev:remote
npm run build:prod
```

Build environments differ primarily in how they handle OAuth redirects and build
optimatizations.

## Deployment

To deploy to a remote server, use the aliased ansible commands:

```bash
npm run deploy:clients:development   # (alteratively dev01 or dev02)
npm run deploy:clients:staging
npm run deploy:clients:production
```

These will build the application using the appropriate environment and deploy
the distribution to the server

## Linting

```bash
npm run lint
```

## Unit testing

```bash
npm run test
```

## Updating packages

```bash
npm run upgrade-interactive
```

When upgrading `@angular/cli` take care to monitor your global version,
and consider running `ng update`. Make a point to alert all other developers
in the PR.
