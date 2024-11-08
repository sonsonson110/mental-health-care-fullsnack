import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="not-found-container">
      <h1 class="not-found-title">404 - Page Not Found</h1>
      <p class="not-found-message">
        The page you are looking for does not exist or has been moved.
      </p>
      <a href="/" class="not-found-link">Go back to the homepage</a>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }

      .not-found-title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }

      .not-found-message {
        font-size: 1.5rem;
        margin-bottom: 2rem;
      }

      .not-found-link {
        font-size: 1.2rem;
        color: #007bff;
        text-decoration: none;
      }

      .not-found-link:hover {
        text-decoration: underline;
      }
    `
  ]
})
export class NotFoundComponent {}
