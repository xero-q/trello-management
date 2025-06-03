# PlanFlow

## Steps for running the project

- Install dependencies

```sh
npm install
```

- Run development server

```sh
ng serve
```

## Testing

```sh
ng test
```

## Linting

```sh
ng lint
```

## Implemented functionalities

- List/Create boards
- View lists of cards
- Create/Edit cards
- See number of cards by list in a board
- Ask AI recommendation for the board (it suggests improvements for the workflow and prioritized cards)

## Implementation notes

- Used a service for managing application state, as it's very simple
- Used ngx-toastr for displaying notifications
- Used ngx-markdown for displaying markdown content
- Modals can be closed by pressing Escape
- Created component for displaying loading state
- Used `localStorage` for saving user data and Trello token
- Implemented unit and integration tests for components `FormCard` and `FormBoard`
