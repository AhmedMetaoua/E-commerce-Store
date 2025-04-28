# E-commerce Store

A modern e-commerce platform built with Next.js, featuring a responsive design, secure authentication, and seamless payment integration.

## Features

- 🛍️ Product browsing and searching
- 🛒 Shopping cart functionality
- 💳 Secure payment processing with Stripe
- 👤 User authentication and authorization
- 📧 Password reset functionality
- ❤️ Wishlist management
- 🎨 Modern and responsive UI with Framer Motion animations

## Tech Stack

- **Frontend Framework:** Next.js 15.2.4
- **UI Library:** React 19.1.0
- **Styling:** Styled Components
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **Payment Processing:** Stripe
- **Email Service:** Nodemailer
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB database
- Stripe account for payment processing
- Email service credentials for password reset functionality

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AhmedMetaoua/E-commerce-Store
   cd e-commerce-store
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EMAIL_SERVER_HOST=your_email_host
   EMAIL_SERVER_PORT=your_email_port
   EMAIL_SERVER_USER=your_email_username
   EMAIL_SERVER_PASSWORD=your_email_password
   EMAIL_FROM=your_email_from_address
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
e-commerce-store/
├── components/     # Reusable UI components
├── lib/           # Utility functions and configurations
├── models/        # MongoDB models
├── pages/         # Next.js pages and API routes
├── public/        # Static assets
├── styles/        # Global styles and theme
└── middleware.js  # Next.js middleware
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email ahmedmtawahg@gmail.com or open an issue in the repository.

---

Developed with ❤️ by AhmedMetaoua
