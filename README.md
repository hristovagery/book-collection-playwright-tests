# Book Collection Management - Playwright Tests

End-to-end tests for the "Book Collection Management" web application using Playwright.

## Application Overview

"Book Collection Management" is a web application for managing books, offering different functionalities based on user login status. Key features include viewing the collection, searching for books, user registration and login, creating new books (for logged-in users), detailed book views (for logged-in users), and editing/deleting books (only by the owner). The navigation bar adapts accordingly. The application starts with 3 pre-loaded books.

## Running the Tests

Before executing the tests (located in `tests/e2e.test.js`), ensure that the backend server of the application and the frontend are running.

**Prerequisites:**

* [Node.js](https://nodejs.org/) (v16+)
* [npm](https://www.npmjs.com/)

**Installation and Startup:**

1.  Clone the repository:
    ```bash
    git clone [https://github.com/hristovagery/book-collection-playwright-tests.git](https://github.com/hristovagery/book-collection-playwright-tests.git)
    cd book-collection-playwright-tests
    ```

2.  Install backend dependencies:
    ```bash
    npm install
    ```

3.  Start the backend server:
    ```bash
    npm run server
    ```

4.  Start the frontend application:
    ```bash
    npm run start
    ```

5.  Install Playwright browsers for testing:
    ```bash
    npx playwright install
    ```

**Running Tests:**

```bash
npx playwright test
