# Capstone Money Manager App

## Overview

This is a web-based Money Manager App developed as a capstone project using HTML, CSS, and JavaScript. The application allows users to manage their financial transactions in Indian Rupees (₹ INR), including income and expenses, with features for viewing, editing, and deleting entries. Data is persisted using the browser's localStorage, ensuring information is retained across page refreshes.

## Features

- **Transaction Management**: Add, view, edit, and delete income and expense transactions with detailed information including date, amount, category, sub-category, and description.
- **Categories and Sub-Categories**:
  - **Income**: Salary, Allowances, Bonus, Petty Cash, Other Income
  - **Expense**: Rent, Food, Shopping, Entertainment, Transport, Utilities, Other Expense
- **Financial Summary**: Displays total income, total expenses, and net balance (balance turns red if negative).
- **Filtering and Sorting**: 
  - Filter by category, sub-category, and date range.
  - Sort by date (newest/oldest) or amount (highest/lowest).
- **Form Validation**: Ensures valid inputs (amount > 0, date not in future, required fields).
- **Responsive Design**: User-friendly interface that adapts to different screen sizes.
- **Data Persistence**: All transactions are saved in localStorage, preventing data loss on refresh.
- **Object-Oriented Programming**: Code structured using JavaScript classes for maintainability.

## Technologies Used

- **HTML**: For structuring the application layout and modal forms.
- **CSS**: For responsive and attractive styling with color-coded amounts and summary cards.
- **JavaScript**: For functionality, including DOM manipulation, event handling, OOP implementation, and localStorage management.

## Installation and Usage

1. Clone or download the project files to your local machine.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, etc.).
3. Start managing your finances:
   - Click "➕ Add New Transaction" to add income or expenses.
   - View your financial summary in the dashboard.
   - Use filters and sorting to organize transactions.
   - Edit or delete transactions using the action buttons.

No additional dependencies or installations are required, as the app runs entirely in the browser.

## Project Structure

- `index.html`: Main HTML file containing the application structure, dashboard, filters, transaction table, and modal form.
- `style.css`: CSS file for styling, responsiveness, and visual design.
- `script.js`: JavaScript file containing the `MoneyManagerApp` class with all app logic, including CRUD operations, validation, filtering, and localStorage handling.
- `ProjectReport.md`: Detailed project report including implementation details, challenges, and learnings.
- `README.md`: This file.

## Challenges Faced

During development, several challenges were encountered:
- Managing data synchronization between the user interface and localStorage, especially during CRUD operations to ensure real-time updates without page refresh.
- Implementing comprehensive form validation for various conditions (empty inputs, invalid dates, future dates, negative amounts).
- Designing a responsive layout that works across different screen sizes.
- Understanding and applying Object-Oriented Programming concepts in JavaScript, particularly class-based architecture.

## Key Learnings

This project provided valuable insights into web development:
- Enhanced proficiency in JavaScript, particularly with ES6 classes, objects, localStorage API, and DOM manipulation.
- Improved skills in form validation, event handling, and dynamic UI updates.
- Gained experience in creating responsive and user-friendly interfaces with HTML and CSS.
- Developed problem-solving skills and confidence in building real-world web applications.
- Learned effective time management while balancing multiple assignments.

## Project Report

For a detailed account of the implementation, challenges, and learnings, refer to [ProjectReport.md](ProjectReport.md).

## License

This project is for educational purposes. Feel free to use and modify as needed.
