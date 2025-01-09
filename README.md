# FairForms

> FairForms - Because Typeform's pricing made me cry... and when someone special needed an afforadble form builder, I said 'Hey, I could build that for you' 💜 So here we are... 😂

A self-hosted form builder that doesn't cost a kidney per month. Create beautiful, conversational forms without breaking the bank.

## 🌟 Features

- ✨ Drag-and-drop form builder
- 📱 Responsive design
- 🎨 Multiple form elements:
  - Contact Info
  - Email
  - Phone Number
  - Address
  - Website
  - Multiple Choice
  - Dropdown
  - Picture Choice
  - Long/Short Text
  - Number
  - Date
  - File Upload
  - Welcome/End Screens
- 🔒 Form publishing controls
- 🔗 Shareable form links
- 📊 Response collection
- 👥 Collaborator support
- 🎯 Custom URLs

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Auth**: Clerk
- **Drag & Drop**: @hello-pangea/dnd
- **Deployment**: Vercel

## 📁 Project Structure

### Pages Structure

```
src/app/
├── /                     # Landing page
│   └── page.tsx         # Public homepage with auth checks
├── (auth)/              # Auth-related pages
│   ├── sign-in/        # Clerk sign-in integration
│   └── sign-up/        # Clerk sign-up integration
├── (dashboard)/         # Protected dashboard routes
│   └── dashboard/
│       ├── page.tsx    # Forms dashboard
│       │   # Lists all forms
│       │   # Quick actions
│       │   # Form stats
│       └── forms/
│           ├── new/    # New form creation
│           │   └── page.tsx    # Form builder for new forms
│           └── [formId]/      # Existing form editor
│               └── page.tsx   # Form builder with saved data
└── forms/              # Public form routes
    └── [formId]/      # Public form view
        ├── page.tsx   # Form display and submission
        ├── loading.tsx # Loading state
        └── error.tsx  # Error handling
```

### API Routes Structure and Documentation

```typescript
src/app/api/
└── forms/
    ├── route.ts                  # Form collection endpoints
    │   ├── GET: List forms
    │   │   - Query params:
    │   │     - page: Pagination
    │   │     - limit: Items per page
    │   │     - search: Search forms
    │   │   - Returns: Paginated form list
    │   └── POST: Create form
    │       - Body: Initial form data
    │       - Returns: Created form
    │
    ├── [formId]/
    │   ├── route.ts             # Individual form operations
    │   │   ├── GET: Fetch form
    │   │   │   - Returns: Complete form data
    │   │   ├── PATCH: Update form
    │   │   │   - Body: Partial form updates
    │   │   │   - Returns: Updated form
    │   │   └── DELETE: Remove form
    │   │       - Returns: Success status
    │   │
    │   ├── publish/
    │   │   └── route.ts         # Publishing endpoints
    │   │       └── PATCH: Toggle publish
    │   │           - Returns: Updated publish status
    │   │
    │   └── submit/
    │       └── route.ts         # Form submission
    │           └── POST: Submit response
    │               - Body: Form responses
    │               - Validates: Required fields
    │               - Returns: Submission confirmation
```

### Component Structure and Responsibilities

#### Form Builder Components

```typescript
src/components/form-builder/
├── FormBuilder.tsx       # Main container
│   # Manages drag-drop state
│   # Handles element CRUD
│   # Controls form settings
│
├── ElementToolbar.tsx    # Element palette
│   # Lists available elements
│   # Provides drag sources
│   # Groups elements by type
│
├── Canvas.tsx           # Form layout
│   # Drop target for elements
│   # Handles element ordering
│   # Preview rendering
│
└── Properties.tsx       # Element settings
    # Dynamic property forms
    # Validation rules
    # Element-specific options
```

#### Form Elements

```typescript
src/components/forms/elements/
├── base/                # Common functionality
│   ├── BaseInput.tsx    # Input foundations
│   └── BaseChoice.tsx   # Choice foundations
│
├── inputs/             # Basic inputs
│   ├── TextInput.tsx   # Short text
│   ├── TextArea.tsx    # Long text
│   ├── EmailInput.tsx  # Email
│   └── PhoneInput.tsx  # Phone
│
├── choices/            # Selection elements
│   ├── MultipleChoice.tsx  # Radio/Checkbox
│   ├── Dropdown.tsx       # Select
│   └── PictureChoice.tsx  # Image selection
│
└── special/            # Special elements
    ├── Welcome.tsx     # Welcome screen
    ├── Statement.tsx   # Info display
    └── EndScreen.tsx   # Completion screen
```

### Pages

```
src/app/
├── /                     # Landing page
├── (auth)/               # Auth-related pages
├── (dashboard)/
│   └── dashboard/
│       ├── page.tsx     # Forms dashboard
│       └── forms/
│           ├── new/     # New form creation
│           └── [formId] # Form builder/editor
└── forms/
    └── [formId]         # Public form view
```

### API Routes

```
src/app/api/
└── forms/
    ├── route.ts                  # GET: List forms, POST: Create form
    ├── [formId]/
    │   ├── route.ts             # GET, PATCH, DELETE form
    │   ├── publish/
    │   │   └── route.ts         # PATCH: Toggle form publish state
    │   └── submit/
    │       └── route.ts         # POST: Submit form response
```

### Key Components

#### Form Builder Components

- `FormBuilder`: Main form builder interface
- `ElementToolbar`: Left sidebar with available form elements
- `Canvas`: Main drag-and-drop area for form elements
- `Properties`: Right sidebar for element properties

#### Form Elements

- `TextInput`: Short text responses
- `TextArea`: Long text responses
- `EmailInput`: Email collection
- `PhoneInput`: Phone number with country code
- `AddressInput`: Multi-field address collection
- `MultipleChoiceInput`: Radio/checkbox options
- `DropdownInput`: Select from options
- `PictureChoice`: Image-based choices
- `DateInput`: Date/time picker
- `FileUpload`: File attachment
- `Statement`: Static text display

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (We use Neon)
- Clerk account for auth
- Vercel account (optional, for deployment)

### Environment Variables

```bash
# Create a .env file with:
DATABASE_URL="your_neon_postgres_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
CLERK_SECRET_KEY="your_clerk_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

```bash
# Clone the repo
git clone https://github.com/souravinsights/myforms.git

# Install dependencies
yarn

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## 🌐 API Endpoints

### Forms

- `GET /api/forms` - List all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get form by ID
- `PATCH /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `PATCH /api/forms/:id/publish` - Toggle form publish state
- `POST /api/forms/:id/submit` - Submit form response

## 🔐 Authentication

- Uses Clerk for authentication
- Protected routes for form creation/management
- Public access for form viewing/submission
- Collaborator management on forms

## 🚧 Future Enhancements

- [ ] Form analytics
- [ ] Response exports
- [ ] Custom themes
- [ ] Conditional logic
- [ ] Payment integration
- [ ] Webhook support
- [ ] API keys for programmatic access
- [ ] Custom domains

## 📝 License

MIT

## 🙏 Credits

Built with [shadcn/ui](https://ui.shadcn.com/) components and inspired by Typeform's UX (but not their pricing 😅)
