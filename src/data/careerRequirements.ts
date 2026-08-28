/**
 * Career Competency Requirements Data Layer
 * Target proficiency expected (0–100) for industry roles.
 */

export interface CareerRequirements {
  skills: Record<string, number>;
}

export const careerRequirements: Record<string, CareerRequirements> = {
  "Frontend Developer": {
    skills: {
      JavaScript: 90,
      React: 85,
      HTML: 85,
      CSS: 85,
      Git: 75,
      APIs: 70,
      Testing: 65
    }
  },
  "Backend Developer": {
    skills: {
      Python: 85,
      NodeJS: 80,
      SQL: 85,
      APIs: 85,
      Git: 75,
      DatabaseDesign: 80,
      SystemDesign: 70
    }
  },
  "Full Stack Developer": {
    skills: {
      JavaScript: 85,
      React: 80,
      NodeJS: 80,
      HTML: 80,
      CSS: 80,
      SQL: 75,
      Git: 80,
      APIs: 80
    }
  },
  "Data Scientist": {
    skills: {
      Python: 90,
      Statistics: 85,
      MachineLearning: 80,
      SQL: 80,
      DataVisualization: 75,
      Pandas: 85,
      Git: 70
    }
  },
  "AI/ML Engineer": {
    skills: {
      Python: 90,
      MachineLearning: 90,
      DeepLearning: 85,
      PyTorch: 80,
      DataStructures: 80,
      MathAndLinearAlgebra: 85,
      Git: 75
    }
  },
  "Data Analyst": {
    skills: {
      SQL: 90,
      Excel: 85,
      DataVisualization: 85,
      TableauPowerBI: 80,
      Python: 70,
      Statistics: 75,
      Communication: 80
    }
  },
  "Cybersecurity Analyst": {
    skills: {
      NetworkSecurity: 85,
      Linux: 80,
      Python: 75,
      Cryptography: 75,
      IncidentResponse: 80,
      Git: 70
    }
  },
  "Cloud Engineer": {
    skills: {
      CloudInfrastructure: 85,
      Linux: 80,
      Python: 75,
      DockerContainers: 80,
      Networking: 75,
      CI_CD: 75,
      Git: 75
    }
  },
  "UI/UX Designer": {
    skills: {
      Figma: 90,
      UserResearch: 85,
      Wireframing: 85,
      Prototyping: 85,
      HTML: 70,
      CSS: 75,
      DesignSystems: 80
    }
  },
  "Product Engineer": {
    skills: {
      JavaScript: 85,
      React: 80,
      SystemArchitecture: 80,
      ProductAnalytics: 75,
      APIs: 80,
      SQL: 75,
      Git: 80
    }
  }
};
