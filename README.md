# ScholarSync
<p align="center">
   <img src="https://i.gifer.com/6M8G.gif" alt="ScholarSync Demo" width="400" height="200">
</p>

## Summary

Are you struggling to find relevant research opportunities that match your skills and interests? Do you spend hours searching through countless academic papers without finding the key insights you need? Are you looking for a streamlined way to manage your research projects and collaborate with faculty?

Introducing ScholarSync, an intelligent research collaboration platform designed specifically for students navigating the academic research landscape. Whether you're seeking a new project, actively collaborating with faculty, or exploring literature for your current work, ScholarSync helps students discover opportunities, find relevant papers, and stay on top of academic progress—all in one place. Experience seamless research management with ScholarSync, your comprehensive solution for academic research collaboration.

## MVP

- **Profile Creation:**
  - Students create detailed profiles with school, skills, interests, past coursework, and research goals.
  - Faculty project listings with required skills and project descriptions.
  - Automated web scraping of faculty websites to discover available projects.

- **Project Matching:**
  - AI-powered matching of students with suitable research projects based on profile descriptions and academic history.
  - Suggestions for nearby or remote opportunities from internal and partnered institutions.

- **Personalized Paper Discovery:**
  - Intelligent paper recommendations related to active project topics using keyword extraction and semantic search.
  - Advanced filtering by relevance, publication date, and citation count.

- **Paper Summarization & Notes:**
  - AI-powered summarization of research papers into digestible insights.
  - Automated highlighting of key findings, methodology, and conclusions.
  - Comprehensive annotation and note-taking system for review and discussion.

## Stretch Goals

- **Research Mentor Matching:**
  - AI-powered suggestions for faculty mentors or advanced students with relevant experience.
  - Compatibility scoring based on research interests and availability.

- **Auto-Citation Builder:**
  - Automatic generation of citations in APA, MLA, and Chicago formats.
  - Integration with discovered papers and user libraries.

- **Peer Community:**
  - Discussion forums and Q&A sections for methodological questions and paper interpretation.
  - Collaborative research groups and study circles.

- **Project Dashboard & Communication:**
  - Advanced task tracking, deadlines, and milestone management.
  - Integrated file sharing and real-time collaboration tools.
  - Team communication and progress updates.

- **Writing & Productivity Tools:**
  - Personal research journal with AI-assisted organization.
  - Kanban-style project management dashboard.
  - Progress tracking with customizable deadlines.

## Milestones

<details>
  <summary>Week 1-2: Planning and Setup</summary>

  - Define detailed requirements and finalize the MVP feature set.
  - Set up repositories, collaboration tools, and the tech stack.
  - Create initial wireframes and architecture diagrams.

  **Tasks:**

  - **Team Setup:**
    - Meet team, decide frontend/backend teams, set up development environment.
    - Familiarize with tech stack (Next.js, AWS services, React).

  - **Design & Architecture:**
    - Create low fidelity wireframes (Figma).
    - Design database schemas for user data and research projects.
    - Plan AWS service integration architecture.

  - **Research:**
    - Learn AWS services (Lambda, API Gateway, DynamoDB, S3).
    - Research academic paper APIs (Semantic Scholar, arXiv).
    - Study AI/ML integration with Amazon Bedrock.

</details>

<details>
  <summary>Week 3-4: Backend and AI Integration</summary>

  **Backend Development:**
  - Implement user registration and profile management system.
  - Set up AWS Cognito for authentication with UTD SSO integration.
  - Configure DynamoDB schemas and API Gateway endpoints.

  **AI Integration:**
  - Develop AI functionality for personalized paper recommendations.
  - Implement semantic search capabilities.
  - Set up Amazon Bedrock for text processing and summarization.

  **Frontend:**
  - Create user registration and login pages.
  - Develop profile creation and management interfaces.
  - Start building project discovery pages.

</details>

<details>
  <summary>Week 5-6: Project Management Module</summary>

  **AI Development:**
  - Develop AI to summarize research papers into digestible insights.
  - Implement keyword extraction and topic modeling.
  - Create project-student matching algorithms.

  **Frontend Integration:**
  - Connect frontend with backend authentication.
  - Implement project browsing and filtering interfaces.
  - Create paper discovery and search functionality.

  **Backend Enhancement:**
  - Set up S3 for file storage (PDFs, project files).
  - Implement web scraping for faculty project discovery.
  - Create recommendation engine APIs.

</details>

<details>
  <summary>Week 7-8: Research Notes & Search Integration</summary>

  **Core Features:**
  - Implement notes and annotation system for research papers.
  - Integrate academic paper search APIs (Semantic Scholar, arXiv).
  - Add collaborative annotation functionality.

  **Frontend Polish:**
  - Complete paper summarization interface.
  - Implement note-taking and organization tools.
  - Create project dashboard layouts.

  **Testing:**
  - Conduct unit and integration tests for core components.
  - Test AI recommendation accuracy and performance.

</details>

<details>
  <summary>Week 9-10: Testing, Debugging & Presentation</summary>

  **Final Integration:**
  - Complete frontend-backend integration.
  - Implement remaining stretch goal features if time permits.
  - Polish UI/UX and fix any remaining bugs.

  **Preparation:**
  - Conduct comprehensive system testing.
  - Practice presentation and prepare demo scenarios.
  - Document final feature set and known limitations.

</details>

## Tech Stack

- **Frontend:**
  - Next.js 14 for the web application framework.
  - React for component-based UI development.
  - Modern CSS frameworks for responsive design.

- **Backend:**
  - AWS API Gateway for API management and routing.
  - AWS Lambda for serverless function processing.
  - Node.js runtime for backend logic.

- **Database & Storage:**
  - AWS DynamoDB for NoSQL data storage.
  - AWS S3 for file storage (PDFs, documents).

- **Authentication:**
  - AWS Cognito for user authentication and UTD SSO integration.

- **AI & Machine Learning:**
  - Amazon Bedrock for AI text summarization and NLP tasks.
  - Semantic Scholar API for academic paper discovery.
  - arXiv API for open-access research papers.

- **External APIs:**
  - Scholarly API for additional paper metadata.
  - CrossRef API for citation data.

### Resources

- **AWS Services:**
  - [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
  - [AWS Lambda Tutorial](https://docs.aws.amazon.com/lambda/)
  - [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
  - [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)

- **Frontend Development:**
  - [Next.js 14 Documentation](https://nextjs.org/docs)
  - [React Documentation](https://react.dev/)

- **Academic APIs:**
  - [Semantic Scholar API](https://www.semanticscholar.org/product/api)
  - [arXiv API Documentation](https://arxiv.org/help/api)

## Software to Install

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads) (version control)
- [Node.js](https://nodejs.org/) (JavaScript runtime)
- **AWS Account Setup:**
  - [Create AWS Account](https://aws.amazon.com/)
  - AWS CLI for local development
- **Development Tools:**
  - Next.js framework
  - AWS SDK for JavaScript
  - Testing frameworks (Jest, React Testing Library)

## Roadblocks and Possible Solutions

**Matching Algorithm Accuracy:**
- Challenge: Creating accurate student-project matching based on skills and interests.
- Solution: Start with rule-based matching using tags and keywords, evolve to ML-based models with user feedback.

**Web Scraping Complexity:**
- Challenge: Inconsistent faculty website formats and potential scraping restrictions.
- Solution: Use robust scraping libraries (BeautifulSoup, Selenium) with fallback to manual curation.

**Tech Stack Complexity:**
- Challenge: Managing multiple AWS services increases setup and maintenance complexity.
- Solution: Implement services incrementally, maintain comprehensive documentation, and use Infrastructure as Code.

**Paper Access and Licensing:**
- Challenge: Many academic papers are behind paywalls.
- Solution: Focus on open-access databases initially, allow user PDF uploads through institutional access.

## Competition

**Existing Solutions:**
- **UTD Faculty Profiles:** Lists research interests but lacks centralized search and matching.
- **Google Scholar/Semantic Scholar:** Paper discovery without personalization or collaboration features.
- **ResearchGate:** Professional networking but limited student-faculty project matching.

**Key Differentiators:**
- Personalized AI-powered recommendations using NLP.
- Built-in paper summarization and collaborative annotation.
- Intelligent faculty-student matchmaking based on skills and interests.
- Integrated research project tracking and communication tools.

## Other Resources

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Next.js Learning Resources](https://nextjs.org/learn)
- [Figma for Design](https://www.figma.com/signup)
- [Academic Paper APIs Comparison](https://blog.front-matter.io/posts/scholarly-api-comparison/)

## Developers 👥  
- Tony Vu  
- Joseph Botros  
- Neha Mundhada  
- Namrata Kulkarni  

## Project Team  
- **Project Manager** – Nadeeba Atiqui  
- **Industry Mentor** – Thilak Jayachandran  

