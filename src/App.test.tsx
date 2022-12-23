import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome', () => {
  render(<App />);
  const welcome = screen.getByText(/Welcome to the Monzo Pub Thursday Integration/i);
  expect(welcome).toBeInTheDocument();
});
