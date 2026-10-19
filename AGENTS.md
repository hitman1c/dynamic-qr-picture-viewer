# AGENT INSTRUCTIONS: Dynamic QR Code Picture Viewer   Continue  opencode -s ses_eafb1b48affeuxVZnTAFkk5gRm

## 1. Project Overview

Build a web application using React that generates a QR code in the browser. When someone scans the QR code using their phone, the phone opens a webpage displaying a picture referenced by the application at that time.

The application must be dynamic, responsive, simple to use, and easy to maintain.

The QR code should point to a public URL for the picture-viewing page, not directly to a local file on the developer's computer.

## 2. Technology Stack

Use the following technologies:

- React for the user interface.
- TypeScript for type safety.
- Vite as the development and build tool.
- CSS for styling and responsive design.
- A QR code library such as `qrcode.react` to generate QR codes.
- Browser APIs for file selection and image previews where appropriate.
- Local storage only if needed to remember the selected image or application preferences.

## 3. Main Application Features

### A. QR Code Generation

When the application starts, display a QR code on the browser page.

The QR code must contain the URL of a dedicated public picture-viewing page.

Requirements:

- Generate the QR code automatically when a valid destination URL is available.
- Display the QR code clearly.
- Provide a button to download the QR code as a PNG image.
- Provide a button to copy the destination URL.
- Show a helpful message if the QR code cannot be generated.
- Never generate a QR code containing a localhost address for real public use.

### B. Picture Selection

Allow the user to select or reference a picture that should be displayed when the QR code is scanned.

Support the following options where practical:

1. Upload a picture from the user's device.
2. Enter a publicly accessible image URL.
3. Preview the selected picture before publishing it.

Validate the image URL and supported image types.

If an uploaded image is selected, upload it to an appropriate public image storage service or backend. Do not assume that a local browser file path will work on another person's phone.

Display the selected image and its current publication status.

### C. Picture Viewing Page

Create a dedicated route such as `/view/:id`.

When someone scans the QR code:

- Open the public viewing URL in the phone's browser.
- Load the picture associated with that URL or picture identifier.
- Display the picture clearly.
- Preserve the original aspect ratio.
- Make the page responsive on mobile devices and desktop computers.
- Show a loading indicator while the picture is loading.
- Display a friendly error message if the picture cannot be found.
- Include a retry option when appropriate.

The picture-viewing page should be simple, with no unnecessary navigation or controls.

### D. Dynamic Picture Referencing

The application must support changing which picture is displayed without requiring the user to create a completely new QR code every time.

Use a stable public URL for the viewing page. The page should retrieve the current picture associated with its identifier from the application's data store.

For example:

- QR code destination: `https://your-domain.com/view/123`
- Current picture: `picture-one.jpg`
- Updated picture: `picture-two.jpg`

When the picture associated with identifier `123` changes, scanning the same QR code should display the new picture.

Do not encode the image file itself into the QR code.

Do not rely on temporary browser object URLs or local file paths for published pictures.

### E. Image Management

Provide a simple interface that allows the user to:

- Select a picture.
- Preview the picture.
- Publish or update the picture.
- See the QR code associated with the picture.
- Replace the current picture.
- Copy or download the QR code.
- Open the public picture-viewing page.

When a picture is replaced, update the stored reference for that picture identifier so the existing QR code continues to work.

## 4. Suggested Application Structure

Organize the project into reusable components.

Example structure:

```
dynamic-qr-picture-viewer/
├── public/
├── src/
│   ├── components/
│   │   ├── QRCodeDisplay.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ImagePreview.tsx
│   │   └── LoadingIndicator.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── PictureViewPage.tsx
│   ├── services/
│   │   ├── imageService.ts
│   │   └── pictureService.ts
│   ├── types/
│   │   └── picture.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── AGENTS.md
```

Adapt this structure when necessary, but keep the code organized and maintainable.

## 5. Backend and Image Storage

A production-ready application needs a way to store uploaded images and retrieve their current references.

Use a suitable backend and storage provider, such as Supabase Storage and a database, or another appropriate service.

The database should store information such as:

- Picture identifier.
- Current image URL or storage path.
- Creation timestamp.
- Last updated timestamp.

Use a secure upload process and appropriate access policies.

If using Supabase:

- Store uploaded images in a dedicated storage bucket.
- Store picture metadata in a database table.
- Use the stable picture identifier in the QR code.
- Retrieve the latest image reference when the viewing page loads.
- Use public image URLs only when the picture is intended to be public.
- Otherwise, implement suitable access controls and signed URLs.

Do not expose secret API keys or service-role credentials in frontend code.

If backend credentials are not available, build a clearly identified local demonstration mode. Explain that local mode cannot provide reliable cross-device image sharing or persistent dynamic updates after deployment.

## 6. User Interface Design

Create a modern, clean interface.

The home page should include:

- Application title: Dynamic QR Picture Viewer.
- A short explanation of how it works.
- Image upload or image URL input.
- An image preview.
- A publish or update button.
- A QR code display area.
- Download QR and Copy URL buttons.
- A link to open the public viewing page.
- Clear success, loading, and error messages.

Design requirements:

- Responsive on mobile, tablet, and desktop.
- Accessible buttons and form labels.
- Good contrast and readable text.
- Consistent spacing.
- No unnecessary animations.
- No fake functionality or placeholder buttons that appear operational but do nothing.

## 7. Security and Reliability

- Validate uploaded image types and file sizes.
- Handle invalid URLs and failed uploads.
- Prevent unauthorized users from replacing pictures they do not own.
- Do not expose private images unintentionally.
- Never store sensitive credentials in frontend source files.
- Handle missing or deleted images gracefully.
- Avoid generating broken QR codes when data is unavailable.
- Do not assume that a QR code works publicly until the application has been deployed to an accessible HTTPS domain.

## 8. Development Instructions

First inspect the existing project files before making changes.

Then:

1. Check whether React and Vite are already configured.
2. Install only the required dependencies.
3. Implement the application in small, logical components.
4. Build the home page and QR code generation.
5. Implement image upload or image URL referencing.
6. Implement the picture-viewing route.
7. Connect persistent image storage and metadata when backend credentials are available.
8. Implement dynamic picture replacement.
9. Add loading and error states.
10. Test the application on desktop and mobile layouts.
11. Run linting and the production build.
12. Fix any errors introduced by the implementation.
13. Update the README with installation, configuration, development, and deployment instructions.

Do not overwrite existing working code without understanding it first.

## 9. Required Tests

Verify the following scenarios:

- The application loads successfully.
- A QR code is generated for a valid public URL.
- The QR code can be downloaded.
- A valid image can be selected and previewed.
- Invalid image URLs are handled properly.
- A published picture can be opened from another device.
- Replacing a picture updates the existing viewing page.
- The existing QR code still points to the same picture identifier after replacement.
- Missing pictures produce a helpful error message.
- The production build completes successfully.

## 10. Acceptance Criteria

The project is complete when:

1. The React application runs successfully.
2. The browser displays a QR code for a published picture.
3. Scanning the QR code opens a public picture-viewing page.
4. The page displays the correct picture.
5. The owner can replace the picture without generating a new QR code.
6. The updated picture is displayed when the same QR code is scanned again.
7. The application works across different devices after deployment.
8. The project includes clear documentation and no known build errors.

## 11. Final Instructions to the Coding Agent

Work directly in the existing project directory.

Implement the complete working application rather than providing only a plan or sample code.

Make sensible technical decisions when details are missing. Ask for clarification only when a decision genuinely blocks progress.

After implementation, summarize:

- Files created or modified.
- Dependencies installed.
- Features implemented.
- Environment variables required.
- Commands to run the application.
- Steps to deploy it publicly.
- Tests performed and any remaining limitations.

Do not claim that image uploads, database integration, or public QR scanning work unless they have actually been implemented and tested.

## How to start the project

Open PowerShell or the VS Code terminal and run:

```
npm create vite@latest dynamic-qr-picture-viewer -- --template react-ts
cd dynamic-qr-picture-viewer
npm install
npm install qrcode.react react-router-dom
```

Create the `AGENTS.md` file in the project root, paste the instructions above, and open the folder in VS Code. Then ask your coding agent to read `AGENTS.md` and implement the project.

Important: To make the same QR code show a different picture whenever you replace it, you need persistent image storage and a database or backend. React alone cannot reliably share a picture selected from your computer with someone scanning the code on another phone. DO THIS THIS QR CODE MUST SHOW FREE WIFI SCAN WHEN SCAN SHOW THAT PIC 
