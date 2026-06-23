# Antigravity Prompt — Next-Level Black & White RAG UI

You are a senior UI/UX Designer, Frontend Architect, and React/Next.js developer. Build a production-quality frontend UI for my RAG chatbot platform.

## Project Context
The backend RAG system is already working. The application allows users to:
- Sign up and log in using Clerk authentication.
- Create and manage RAG chatbots.
- Upload knowledge files such as PDF, TXT, MD, DOCX, CSV, and other text-based formats.
- Ask questions from uploaded knowledge.
- Embed chatbot into external websites.
- Download chat logs.
- Download the full knowledge base as one file.
- Limit number of chatbots per user account.
- Keep knowledge bases isolated between different clients.
- Optionally support web scraping in future.
- Optionally support admin dashboard in future.

## Design Direction
Create a sleek, modern, minimal, premium UI inspired by Obsidian-style note-taking tools and developer dashboards.
Use only a black and white theme.
The design should feel like a professional AI workspace, not a basic chatbot website.

## Tech Stack
Use:
- React or Next.js
- Tailwind CSS
- Framer Motion for animations
- Three.js / React Three Fiber for premium background animation
- Clerk for authentication UI
- Lucide React icons
- shadcn/ui style components if useful

## Global Design System

### Colors
Use only black, white, and grayscale.

- Main Background: #050505
- Secondary Background: #0A0A0A
- Card Background: #111111
- Elevated Card: #171717
- Border: #2A2A2A
- Soft Border: #1F1F1F
- Primary Text: #FFFFFF
- Secondary Text: #B5B5B5
- Muted Text: #737373
- Input Background: #0D0D0D
- Button Background: #FFFFFF
- Button Text: #000000
- Button Hover: #E5E5E5
- Dark Button Hover: #1C1C1C
- Error: #FFFFFF text with dark border, no red color

No purple, no neon, no gradients with colors. Only black, white, and subtle gray depth.

### Typography
Use modern developer-friendly typography:
- Headings: Inter, Space Grotesk, or Geist Sans
- Body: Inter or Geist Sans
- Code / technical text: Geist Mono or JetBrains Mono

Font weights:
- Hero heading: 700 or 800
- Section heading: 600 or 700
- Body text: 400 or 500
- Labels: 500

### Visual Style
- Dark matte background
- Thin borders
- Rounded corners: 14px to 24px
- Soft shadows using black opacity
- Glass-like cards using subtle transparency
- Monochrome icons
- Smooth hover effects
- Premium motion, not flashy
- Large whitespace
- Clean dashboard layout
- Inspired by tools like Obsidian, Raycast, Linear, Vercel, and modern AI dashboards

## Required Pages
Create all pages with consistent styling.

---

# 1. Landing Page / Hero Page

## Layout Component Tree

<AppLayout>
  <Navbar />
  <HeroSection />
  <FeatureGrid />
  <WorkflowSection />
  <EmbedSection />
  <SecuritySection />
  <PricingPreview />
  <CTASection />
  <Footer />
</AppLayout>

## Navbar
Left:
- Logo icon only or text logo: “RAGForge” / “Kortex AI” / “Knowledge RAG”

Center:
- Product
- Features
- Docs
- Pricing
- Security

Right:
- Login
- Get Started button

Navbar styling:
- Sticky top
- Background: rgba(5,5,5,0.75)
- Backdrop blur
- Border bottom: #1F1F1F
- Height: 72px

## Hero Section
Add premium Three.js background:
- Black 3D particle grid
- Floating monochrome nodes
- Subtle document cards moving slowly
- No colorful particles
- Animation should be calm and elegant

Hero headline:
“Turn Your Knowledge Base Into an Intelligent Chatbot”

Hero subtext:
“Upload documents, build isolated knowledge spaces, and deploy AI chatbots that answer with context from your own data.”

CTA buttons:
- Primary: “Start Building”
- Secondary: “View Demo”

Small trust line:
“Built for teams, SaaS products, documentation portals, and internal knowledge systems.”

Hero visual:
Create a large dashboard preview card showing:
- Query input
- Retrieved sources
- AI response card
- Knowledge files list

## Feature Grid
Cards:
1. “Upload Knowledge”
   Text: “Add PDFs, TXT, Markdown, DOCX, and structured files to power your chatbot.”
2. “Ask With Context”
   Text: “Get answers grounded in your uploaded knowledge base.”
3. “Embed Anywhere”
   Text: “Generate an embed snippet and place your chatbot on any website.”
4. “Client Isolation”
   Text: “Keep every user’s documents and vectors separated securely.”
5. “Chat Logs”
   Text: “Export conversations for review, support, and training.”
6. “Knowledge Export”
   Text: “Download the complete knowledge base as a single file.”

## Workflow Section
Show a horizontal or vertical flow:
Upload Files → Process & Chunk → Store Vectors → Ask Questions → Get Grounded Answers → Embed Chatbot

## Security Section
Title:
“Designed for clean separation between knowledge bases”

Text:
“Every workspace keeps its documents, embeddings, chat history, and chatbot configuration isolated from other clients.”

---

# 2. Login / Signup Page

Use Clerk authentication.

## Layout
<AuthLayout>
  <LeftBrandPanel />
  <ClerkAuthCard />
</AuthLayout>

Left panel:
- Big heading: “Your private AI knowledge workspace.”
- Subtext: “Sign in to manage your chatbots, upload files, and connect your knowledge to real conversations.”
- Minimal animated document graph in background.

Right panel:
- Clerk SignIn / SignUp component
- Dark styling wrapper
- Rounded card
- Thin border

Page background: #050505
Card background: #111111

---

# 3. Dashboard Page

## Layout Component Tree

<DashboardLayout>
  <Sidebar />
  <Topbar />
  <DashboardOverview />
</DashboardLayout>

## Sidebar Items
- Overview
- Chatbots
- Knowledge Base
- Chat Logs
- Embed
- Billing
- Settings
- Admin

Sidebar style:
- Width: 260px
- Background: #080808
- Border right: #1F1F1F
- Active item background: #171717
- Active item text: #FFFFFF
- Inactive text: #737373

## Topbar
- Search input placeholder: “Search chatbots, files, or logs…”
- Create Chatbot button
- User avatar

## Overview Cards
Cards:
- Total Chatbots
- Uploaded Files
- Total Conversations
- Storage Used

Use monochrome cards with subtle icons.

## Recent Activity
Show recent uploads and recent chats.

---

# 4. Chatbots Page

## Purpose
Allow users to view, create, edit, and delete chatbots.

## Components
<ChatbotListPage>
  <PageHeader />
  <UsageLimitBanner />
  <ChatbotGrid />
  <CreateChatbotModal />
</ChatbotListPage>

## Page Header
Title: “Chatbots”
Subtitle: “Create and manage AI assistants powered by your knowledge base.”
Button: “New Chatbot”

## Usage Limit Banner
Text:
“You are using 2 of 5 available chatbots.”

## Chatbot Card Fields
- Chatbot name
- Status: Active / Draft
- Knowledge files count
- Conversations count
- Last updated
- Buttons: Open, Embed, Settings

---

# 5. Knowledge Base Page

## Purpose
Allow file upload and knowledge management.

## Component Tree
<KnowledgeBasePage>
  <PageHeader />
  <UploadDropzone />
  <FileTypeSupport />
  <KnowledgeTable />
  <ExportKnowledgeCard />
</KnowledgeBasePage>

## Header Copy
Title: “Knowledge Base”
Subtitle: “Upload and manage the files your chatbot uses to answer questions.”

## Upload Dropzone
Text:
“Drop files here or click to upload”

Supported formats text:
“Supports PDF, TXT, Markdown, DOCX, CSV, JSON, and more.”

Upload states:
- Idle
- Uploading
- Processing
- Embedded successfully
- Failed with retry button

## Knowledge Table Columns
- File Name
- Type
- Size
- Status
- Uploaded At
- Actions

Actions:
- Preview
- Reprocess
- Download
- Delete

## Export Card
Title: “Export Knowledge”
Text: “Download your complete knowledge base as a single file.”
Button: “Download Knowledge”

---

# 6. RAG Chat Page

## Purpose
Main query interface.

## Component Tree
<RagChatPage>
  <ChatSidebar />
  <ChatWindow />
  <SourcePanel />
</RagChatPage>

## Chat Window
Header:
- Chatbot name
- Model status
- Knowledge base status

Message Layout:
- User message aligned right
- Assistant message aligned left
- Source citations below assistant answer
- Copy answer button
- Regenerate button

Input Area:
Placeholder:
“Ask anything from your knowledge base…”

Buttons:
- Send
- Attach file
- Clear chat

## Empty State
Title:
“Ask your knowledge base anything”

Text:
“Your chatbot will search uploaded documents and generate a grounded answer with relevant sources.”

Suggested prompts:
- “Summarize the uploaded document.”
- “What are the key points from this knowledge base?”
- “Find the section related to pricing.”
- “Explain this in simple words.”

## Loading State
Show:
- Typing indicator
- Skeleton answer card
- “Searching knowledge base…”
- “Retrieving relevant chunks…”
- “Generating answer…”

## Source Panel
Show retrieved sources:
- File name
- Chunk preview
- Similarity score
- Page number if available

---

# 7. Embed Guide Page

## Purpose
Guide user to embed chatbot on website.

## Component Tree
<EmbedPage>
  <PageHeader />
  <EmbedPreview />
  <CodeSnippetCard />
  <CustomizationPanel />
  <IntegrationSteps />
</EmbedPage>

## Copy
Title: “Embed Chatbot”
Subtitle: “Add your RAG chatbot to any website using a simple script.”

Code snippet example:
<script src="https://your-domain.com/embed.js" data-chatbot-id="CHATBOT_ID"></script>

Buttons:
- Copy Script
- Preview Widget
- Save Changes

Customization options:
- Widget position
- Welcome message
- Chatbot name
- Theme: Black / White
- Allowed domains

Steps:
1. Copy the embed script.
2. Paste it before the closing body tag.
3. Save your website.
4. Open your site and test the chatbot.

---

# 8. Chat Logs Page

## Purpose
Allow viewing and downloading conversations.

## Components
<ChatLogsPage>
  <PageHeader />
  <FilterBar />
  <LogsTable />
  <DownloadLogsButton />
</ChatLogsPage>

## Header
Title: “Chat Logs”
Subtitle: “Review previous conversations and export logs for analysis.”

Filters:
- Chatbot
- Date range
- User
- Search query

Table columns:
- User Question
- Chatbot
- Date
- Status
- Actions

Actions:
- View conversation
- Download
- Delete

---

# 9. Settings Page

## Sections
- Profile Settings
- Workspace Settings
- Chatbot Limits
- API Keys
- Data Export
- Danger Zone

Copy:
Title: “Settings”
Subtitle: “Manage your workspace, usage limits, and data controls.”

Danger Zone:
- Delete chatbot
- Delete knowledge base
- Delete workspace

---

# 10. Admin Dashboard Page

This page is optional but should be designed.

## Admin Cards
- Total Users
- Total Chatbots
- Total Files Uploaded
- Total Queries
- Active Workspaces
- Failed Processing Jobs

## Admin Tables
- Users
- Workspaces
- File Processing Jobs
- Usage Limits

Admin page should look powerful but minimal.

---

# Essential UX Components

Implement these states across the UI:

## Loading States
- Skeleton cards
- Spinner-free loading where possible
- Typing dots for chatbot answer
- Processing progress for file upload

## Empty States
Examples:
- No chatbot created
- No files uploaded
- No chat logs yet
- No search results

## Error States
Use black and white styling only.
Examples:
- “File upload failed. Please retry.”
- “Knowledge base is still processing.”
- “Chatbot limit reached.”
- “No relevant source found.”

## Success States
Examples:
- “File processed successfully.”
- “Embed script copied.”
- “Knowledge exported successfully.”

## Microinteractions
- Buttons lift slightly on hover
- Cards brighten border on hover
- Inputs show white border on focus
- Sidebar active item glows subtly using gray shadow
- Page transitions fade and slide gently

---

# Component Naming
Use clean React components:

components/
  layout/
    Navbar.tsx
    Sidebar.tsx
    DashboardLayout.tsx
    AuthLayout.tsx
  landing/
    HeroSection.tsx
    FeatureGrid.tsx
    WorkflowSection.tsx
    SecuritySection.tsx
    CTASection.tsx
  dashboard/
    StatCard.tsx
    RecentActivity.tsx
  chatbots/
    ChatbotCard.tsx
    CreateChatbotModal.tsx
    UsageLimitBanner.tsx
  knowledge/
    UploadDropzone.tsx
    KnowledgeTable.tsx
    ExportKnowledgeCard.tsx
  rag/
    ChatWindow.tsx
    MessageBubble.tsx
    SourcePanel.tsx
    QueryInput.tsx
  embed/
    CodeSnippetCard.tsx
    EmbedPreview.tsx
    CustomizationPanel.tsx
  logs/
    LogsTable.tsx
    FilterBar.tsx
  common/
    Button.tsx
    Input.tsx
    Card.tsx
    EmptyState.tsx
    LoadingSkeleton.tsx
    ErrorState.tsx

---

# Routes
Use this route structure:

/
/login
/signup
/dashboard
/dashboard/chatbots
/dashboard/chatbots/[id]
/dashboard/knowledge
/dashboard/rag-chat
/dashboard/embed
/dashboard/logs
/dashboard/settings
/dashboard/admin

---

# Landing Page Copy

## Hero
Headline:
“Build AI Chatbots From Your Own Knowledge”

Subtext:
“Upload documents, connect knowledge sources, and launch a private RAG chatbot that gives grounded answers from your data.”

Buttons:
“Start Building”
“Watch Demo”

## Feature Section Heading
“Everything needed to launch a knowledge-powered chatbot”

## CTA Section
Title:
“Ready to turn your documents into conversations?”

Text:
“Create your first chatbot, upload your knowledge, and start asking questions in minutes.”

Button:
“Create Your Chatbot”

---

# Animation Requirements

Use Framer Motion for:
- Page fade in
- Hero text stagger animation
- Feature card reveal on scroll
- Dashboard card hover motion
- Modal open animation
- Chat message appear animation

Use Three.js / React Three Fiber for:
- Landing page background
- Animated knowledge graph
- Floating document cards
- Subtle moving lines between nodes

Keep animation lightweight and professional.

---

# Responsive Design

Desktop:
- Sidebar dashboard layout
- 3-column feature grids
- Split chat page with source panel

Tablet:
- Collapsible sidebar
- 2-column cards

Mobile:
- Bottom navigation or drawer sidebar
- Single-column cards
- Chat source panel becomes slide-up sheet

---

# Final Quality Requirement

The final UI should look like a premium SaaS product.
It should not look like a simple college project.
It must be clean, minimal, black-and-white, fast, responsive, and production-ready.
Generate reusable components, clean folder structure, and polished Tailwind classes.
