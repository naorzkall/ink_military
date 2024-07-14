# INK MILITARY

INK MILITARY is an innovative application designed to streamline and digitize the military recruitment and deferment processes, catering specifically to students and administrative personnel. The app leverages cutting-edge technology to provide a seamless and efficient user experience, ensuring that all interactions, from initial registration to deferment processing, are handled smoothly and securely.

## Features

- **User Registration and Authentication:** Secure sign-up and login functionalities.
- **Profile Management:** Users can update their personal and academic details.
- **Deferment Requests:** Easy submission and tracking of deferment requests.
- **Administrative Dashboard:** For managing and processing recruitments and deferments.
- **Email Notifications:** Automated notifications for important updates using Nodemailer.
- **Payment Integration:** Secure payment processing with Stripe.
- **Data Security:** Strong emphasis on user data security and privacy.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Email Service:** Nodemailer
- **Payment Gateway:** Stripe

## Installation

1. **Clone the Repository**
    ```bash
      git clone https://github.com/naorzkall/ink_military.git
      cd ink_military
    ```
3. **Install Dependencies**
   ```bash
      npm install
    ```
5. **Environment Variables**
Create a .env file in the root directory and add the following environment variables:
    ```bash
     MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
     DB_URL=mongodb://localhost:27017/<database>
     NODEJS_GMAIL_APP_USER=<your-gmail-username>
     NODEJS_GMAIL_APP_PASSWORD=<your-gmail-password>
     STRIPE_TEST_KEY=<your-stripe-test-key>
    ```
6. **Run the Application**
    ```bash
     npm start
    ```
## Acknowledgements
- **Node.js:https://nodejs.org/
- **Express.js:https://expressjs.com/
- **MongoDB:https://www.mongodb.com/
- **Mongoose:https://mongoosejs.com/
- **Stripe:https://stripe.com/en-ro

