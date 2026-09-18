// Curated free learning resources for common skills.
// Falls back to a generic search link for anything not explicitly listed.

const RESOURCES = {
  "Python": { url: "https://www.python.org/about/gettingstarted/", label: "Official Python Guide" },
  "JavaScript": { url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", label: "MDN JavaScript Guide" },
  "TypeScript": { url: "https://www.typescriptlang.org/docs/handbook/intro.html", label: "TypeScript Handbook" },
  "React": { url: "https://react.dev/learn", label: "Official React Docs" },
  "Vue": { url: "https://vuejs.org/guide/introduction.html", label: "Vue.js Guide" },
  "Angular": { url: "https://angular.dev/tutorials", label: "Angular Tutorials" },
  "Node.js": { url: "https://nodejs.org/en/learn", label: "Node.js Learn" },
  "SQL": { url: "https://www.w3schools.com/sql/", label: "W3Schools SQL Tutorial" },
  "MySQL": { url: "https://www.mysqltutorial.org/", label: "MySQL Tutorial" },
  "PostgreSQL": { url: "https://www.postgresqltutorial.com/", label: "PostgreSQL Tutorial" },
  "MongoDB": { url: "https://www.mongodb.com/docs/manual/tutorial/getting-started/", label: "MongoDB Getting Started" },
  "AWS": { url: "https://aws.amazon.com/getting-started/", label: "AWS Getting Started" },
  "Azure": { url: "https://learn.microsoft.com/en-us/training/azure/", label: "Microsoft Learn: Azure" },
  "Docker": { url: "https://docs.docker.com/get-started/", label: "Docker Get Started" },
  "Kubernetes": { url: "https://kubernetes.io/docs/tutorials/", label: "Kubernetes Tutorials" },
  "Git": { url: "https://git-scm.com/book/en/v2", label: "Pro Git Book (free)" },
  "Machine Learning": { url: "https://www.coursera.org/learn/machine-learning", label: "Andrew Ng's ML Course" },
  "Deep Learning": { url: "https://www.deeplearning.ai/", label: "DeepLearning.AI" },
  "TensorFlow": { url: "https://www.tensorflow.org/tutorials", label: "TensorFlow Tutorials" },
  "PyTorch": { url: "https://pytorch.org/tutorials/", label: "PyTorch Tutorials" },
  "Pandas": { url: "https://pandas.pydata.org/docs/getting_started/index.html", label: "Pandas Getting Started" },
  "NumPy": { url: "https://numpy.org/doc/stable/user/quickstart.html", label: "NumPy Quickstart" },
  "Excel": { url: "https://support.microsoft.com/en-us/excel", label: "Microsoft Excel Help" },
  "Tableau": { url: "https://www.tableau.com/learn/training", label: "Tableau Training" },
  "Power BI": { url: "https://learn.microsoft.com/en-us/power-bi/", label: "Microsoft Learn: Power BI" },
  "Figma": { url: "https://help.figma.com/hc/en-us/categories/360002042733", label: "Figma Learn" },
  "Java": { url: "https://dev.java/learn/", label: "Official Java Learning Path" },
  "C++": { url: "https://www.learncpp.com/", label: "LearnCpp.com" },
  "Go": { url: "https://go.dev/learn/", label: "Official Go Tour" },
  "Rust": { url: "https://doc.rust-lang.org/book/", label: "The Rust Book" },
  "Swift": { url: "https://developer.apple.com/swift/resources/", label: "Apple Swift Resources" },
  "Kotlin": { url: "https://kotlinlang.org/docs/getting-started.html", label: "Kotlin Getting Started" },
  "Flutter": { url: "https://docs.flutter.dev/get-started", label: "Flutter Get Started" },
  "Django": { url: "https://docs.djangoproject.com/en/stable/intro/tutorial01/", label: "Django Official Tutorial" },
  "Flask": { url: "https://flask.palletsprojects.com/en/latest/quickstart/", label: "Flask Quickstart" },
  "FastAPI": { url: "https://fastapi.tiangolo.com/tutorial/", label: "FastAPI Tutorial" },
  "Agile": { url: "https://www.atlassian.com/agile", label: "Atlassian: Agile 101" },
  "Scrum": { url: "https://www.scrum.org/resources/what-is-scrum", label: "Scrum.org Guide" },
  "REST API": { url: "https://restfulapi.net/", label: "RESTful API Tutorial" },
  "GraphQL": { url: "https://graphql.org/learn/", label: "Official GraphQL Docs" },
  "CI/CD": { url: "https://about.gitlab.com/topics/ci-cd/", label: "GitLab: What is CI/CD" },
  "Linux": { url: "https://linuxjourney.com/", label: "Linux Journey (free)" },
};

export function getSkillResource(skill) {
  if (RESOURCES[skill]) return RESOURCES[skill];
  // Fallback: a search link so every skill still has somewhere to go
  return {
    url: `https://www.google.com/search?q=free+${encodeURIComponent(skill)}+tutorial+for+beginners`,
    label: `Search resources for ${skill}`,
  };
}