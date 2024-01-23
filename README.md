# AMAX Movie Booking System

 <div align="justify"> The AMAX Movie Booking System is a web-based application that enables users to browse and book movie tickets for various theaters. The application provides a user-friendly interface to select movies, view showtimes, choose seats, and confirm bookings. Key features include user authentication, booking history, and payment method selection.
</div>

![Homepage](https://github.com/shivatejapecheti/AMAX-Movie-Booking-System/assets/126412107/ff0cde0b-d626-4ee7-91d8-84de52b8a29e)


### Technologies Used

## Frontend:
+ HTML
+ CSS
+ JavaScript
+ jQuery
+ Micromodal.js (for modal functionality)
  
## Backend:

+ Python
+ Tornado Web Framework
+ Oracle Database

## Features

User Authentication:

+ Users can log in to their accounts.
+ Logout functionality is available.
  
Navigation:

Users can navigate through different sections such as "Today," "Tomorrow," and "Booking History."

Movie Listing:

+ Movies are categorized by genres like Action, Comedy, and Drama.
+ Users can view available movies with their details.

Seat Selection:

+ Users can select seats for a specific showtime.
+ The seat selection is visualized with different seat states (available, selected, occupied).

Booking Confirmation:

+ Users can confirm their seat selection and choose a payment method.
+ Real-time updates on the selected seats count and total price.

Modal Interface:

+ Modal dialogs are used for various interactions, enhancing the user experience.
+ Micromodal.js is employed for modal functionality.

Booking History:

+ Users can view their booking history, showing past reservations.

## Database Initialization:
+ The Oracle Database is used for storing user information, booking details, and other relevant data. 

The database schema includes the following tables:

![schema design](https://github.com/shivatejapecheti/AMAX-Movie-Booking-System/assets/126412107/9dba258f-7b3c-40b0-90d6-4e8d79fbf488)

Database Connection:
The database is initialized using the oracledb module, and a connection is established with the following credentials:

+ Username: project
+ Password: project
+ DSN: localhost/xe

### Web Server:
The Tornado web framework handles HTTP requests and serves the web application. Various endpoints are defined for functionalities such as user authentication, booking, and user history.

### User Authentication:
User authentication is implemented using secure cookies. The user's session details are stored in a secure cookie upon successful login.

### Password Hashing:
User passwords are hashed using the MD5 hashing algorithm before storing them in the database, enhancing security.

## Running the Application:

1. Ensure that Oracle Database is installed and running.
2. Initialize the Oracle Database with the provided schema and credentials.
3. Install the required Python packages: pip install tornado oracledb
4. Run the Python script containing the Tornado application
5. Access the web server at http://localhost:8888.

## Future Enhancements
Mention any planned enhancements or features that could be added in the future.

