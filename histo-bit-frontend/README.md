# Histo Bit - Medical Records Management System

A decentralized medical records management system built with Next.js and blockchain technology.

## Features

- **Blockchain Security**: Uses blockchain technology to ensure data immutability and security
- **Permission Control**: Granular control over who can access medical records
- **Complete Audit Trail**: Full transparency and accountability for all data access
- **KYC Integration**: Self Protocol integration for identity verification
- **Modern UI**: Beautiful, responsive interface with dark/light theme support

## Pages

- **Landing Page** (`/`): Main entry point with wallet connection and feature overview
- **Dashboard** (`/dashboard`): User dashboard with statistics and quick actions
- **Activities** (`/activities`): Medical activities and records management
- **Permissions** (`/permissions`): Manage access permissions for different entities
- **KYC** (`/kyc`): Identity verification using Self Protocol

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd histo-bit-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SELF_APP_NAME="Histo Bit"
NEXT_PUBLIC_SELF_SCOPE="histo-bit"
NEXT_PUBLIC_SELF_ENDPOINT="your-self-endpoint"
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header with wallet connection
│   └── KYCComponent.tsx # Self Protocol KYC integration
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management hook
├── dashboard/          # Dashboard page
├── activities/         # Activities page
├── permissions/        # Permissions page
├── kyc/               # KYC page
├── globals.css        # Global styles and theme variables
├── layout.tsx         # Root layout
└── page.tsx           # Landing page
```

## Key Components

### Header Component

- Wallet connection modal
- Theme toggle functionality
- Navigation links
- User profile display

### KYC Component

- Self Protocol QR code integration
- Identity verification workflow
- Multiple user type support (Patient, Doctor, Insurance, Auditor)

### Theme System

- Dark/light theme support
- CSS custom properties for consistent theming
- Smooth transitions and animations

## Wallet Integration

The application supports multiple wallet types:

- MetaMask
- Core Wallet
- WalletConnect
- Demo Mode (for testing)

## Self Protocol Integration

The KYC system integrates with Self Protocol for identity verification:

- QR code generation for mobile app scanning
- Universal link support
- Verification status tracking

## Styling

The application uses:

- Tailwind CSS for utility-first styling
- CSS custom properties for theme management
- Responsive design with mobile-first approach
- Custom animations and transitions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- React best practices and hooks

## Deployment

The application can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
