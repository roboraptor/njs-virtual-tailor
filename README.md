## 📏 Virtual Tailor: Size Recommendation Engine

An intelligent web application built with Next.js and React that helps customers find their perfect fit. By entering detailed body measurements, users receive precise size recommendations based on product-specific data, with a visual scale showing exactly where they land within a size range.
## 🚀 Features

    Dynamic Measurement Form: Only asks for measurements relevant to the selected product (e.g., neck for shirts, inseam for trousers).

    Visual Fit Indicator: A slider/scale visualization that shows the user's position within a specific size (S, M, L, XL).

    Made-to-Measure (M2M) Fallback: When a user's measurements fall outside standard ranges, the app automatically suggests a "Made-to-Measure" consultation.

    CSV-Driven Logic: Product size charts are managed via simple CSV files for easy updates without touching the code.

    Data Portability: Users can download their entered measurements as a JSON file for future use or professional tailoring.

    Developer Mode: A dedicated "Dev Switch" to instantly populate the form with test data for rapid UI/UX testing.

## 🛠️ Tech Stack

    Framework: Next.js 14+ (App Router)

    Frontend: React

    Styling: Bootstrap 5 (via react-bootstrap)

    Data Parsing: PapaParse (for CSV processing)

    Icons: Lucide React

## 📊 Data Structure

The application consumes data from a CSV file located in the /public/data directory.
CSV Schema Example
Fragment kódu

product_id,category,size,chest_min,chest_max,waist_min,waist_max,sleeve_min,sleeve_max
shirt-slim-01,Shirt,M,95,100,85,90,64,66
shirt-slim-01,Shirt,L,101,106,91,96,66,68

    Min/Max ranges: Used to calculate the position of the "arrow" on the visual scale.

    M2M Logic: If user_value > max or user_value < min for all available sizes, the M2M trigger is activated.

## 🔧 Installation & Setup

    Clone the repository:
    Bash

    git clone https://github.com/your-username/virtual-tailor.git
    cd virtual-tailor

    Install dependencies:
    Bash

    npm install

    Run the development server:
    Bash

    npm run dev

    Access the app: Open http://localhost:3000 in your browser.

## 🧪 Development Workflow
The "Dev Switch"

To speed up testing, the app includes a debug toggle. When enabled:

    The application bypasses manual input.

    It loads a predefined test-measurements.json.

    You can instantly see how the visual scale reacts to "perfect", "edge-case", and "out-of-bounds" measurements.

Exporting Data

Users can click the "Export My Profile" button, which generates a tailor-measurements.json. This ensures users don't have to measure themselves twice if they return to the shop later.
## 🗺️ Roadmap

    [ ] Integrate PDF export for M2M requests.

    [ ] Add 3D visual representation of body shapes.

    [ ] Connect to a PostgreSQL/Supabase backend for persistent user profiles.

    [ ] A/B testing for the recommendation algorithm (Loose fit vs. Slim fit preference).