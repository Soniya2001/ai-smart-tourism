# Oor Payana – AI Smart Tourism & Heritage Intelligence Platform
Reimagining Cultural Tourism with Artificial Intelligence

An AI-powered tourism platform that helps travelers plan smarter trips, explore heritage sites through multimodal AI, engage in gamified learning experiences, and empowers heritage authorities with intelligent analytics for conservation and decision-making.

---

## Overview

Oor Payana is an AI-powered Smart Tourism & Heritage Intelligence Platform designed to transform the way people explore cultural heritage using Generative AI.

The platform combines intelligent travel planning, multimodal heritage exploration, gamified learning, archaeology awareness, and AI-powered decision support into a single ecosystem. It serves both tourists and heritage authorities through dedicated portals, enabling immersive visitor experiences while supporting heritage preservation and sustainable tourism.

---

## Vision

Our vision is to make heritage tourism:

- **Intelligent**
- **Interactive**
- **Educational**
- **Accessible**
- **Sustainable**

while empowering authorities with AI-driven insights for conservation and tourism management.

---

## Platform Architecture

```
Landing Page
      │
      ▼
Choose Portal
      │
 ┌────┴─────┐
 │          │
 ▼          ▼
Public    Authority
Portal     Portal
 │          │
 └────┬─────┘
      ▼
Shared AI Intelligence Layer
      │
      ▼
Google Gemini AI
      │
      ▼
Data Storage & External APIs
```

---

## Key Features

### Public Tourist Portal

- **Smart Travel Planner**
  - AI-powered itinerary generation
  - Travel date planning
  - Hotel recommendations
  - Budget optimization
  - Interactive maps
  - AI packing assistant
  - Weather insights
  - Export itinerary
- **Multimodal Heritage Explorer**
  - AI monument recognition
  - Historical overview
  - Architectural insights
  - Folklore stories
  - Voice narration
  - Community support
  - Photos & gallery
  - Talk to Historical Personalities
  - AI-powered quizzes
- **Heritage Quiz & Puzzle**
  - Monument-based puzzles
  - Learn historical facts
  - Interactive quizzes
  - XP rewards
  - Digital badges
- **Heritage Wallet**
  - Achievement tracking
  - Badge collection
  - XP points
  - Learning progress
- **Archaeology Corner**
  - Ancient civilizations
  - Archaeological discoveries
  - Marine archaeology
  - Excavation records
  - Scripts and inscriptions
  - Citizen discovery reports
- **Public Feedback**
  - Rate heritage sites
  - Upload images
  - Share reviews
  - Report issues
- **Donate for Tourism**
  - Support heritage conservation
  - Contribute to restoration initiatives

---

### Heritage Authority Portal

- **Decision Dashboard**
  - Visitor analytics
  - Revenue insights
  - Crowd prediction
  - AI recommendations
  - AI Tourist Sentiment Distribution & Consolidated Feedback

---

## Artificial Intelligence Features

Powered by Google Gemini AI

- AI Travel Planner
- Vision-based Monument Recognition
- Heritage Question Answering
- Historical Story Generation
- Conversational Historical Personalities
- AI Recommendations
- Voice Narration
- Smart Quiz Generation
- Natural Language Search

---

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS v4
- Motion
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js

### Artificial Intelligence
- Google Gemini API
- Gemini Vision

### Browser APIs
- Web Speech API

### Data Storage
- Browser localStorage

### External APIs
- Google Maps API
- Wikimedia Commons API
- Weather API

### Deployment
- Google Cloud Run
- Docker

---

## Project Structure

```
src/
├── assets/
├── components/
├── hooks/
├── pages/
├── services/
├── styles/
├── utils/

server/
├── Express API
├── Gemini Integration

public/
```

---

## Application Workflow

```
Landing Page
      │
      ▼
Choose Portal
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Public   Authority
Portal    Portal
 │         │
 └────┬────┘
      ▼
Google Gemini AI
      ▼
AI Recommendations
      ▼
User Interaction
      ▼
Data Storage
      ▼
Reports & Analytics
```

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/Soniya2001/ai-smart-tourism.git
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:
```env
GEMINI_API_KEY=YOUR_API_KEY
```

### Start the Backend
```bash
npm run server
```

### Start the Frontend
```bash
npm run dev
```

---

## Deployment

The application is designed to be deployed on:
- Google Cloud Run
- Docker
- Node.js Server

---

## Future Enhancements
- Firestore integration
- Real-time crowd monitoring
- Augmented Reality heritage experience
- AI multilingual translation
- Hotel booking integration
- Smart ticket booking
- Digital Heritage Passport
- Predictive conservation analytics

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Submit a Pull Request.

---

## Author

**Soniya B**  
GitHub: [https://github.com/Soniya2001](https://github.com/Soniya2001)

---

## Acknowledgements
- Google Gemini
- Google Cloud
- React
- Tailwind CSS
- Wikimedia Commons
- Open Source Community

---

## License

This project is licensed under the MIT License.
