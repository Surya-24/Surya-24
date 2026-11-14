// Everything the profile says lives here. Edit this file, then run:
//   node scripts/build.mjs
// Use &amp; for "&" in any text.

export const links = {
  linkedin: "https://www.linkedin.com/in/mada-sai-surya",
  email: "mailto:saisuryamada@gmail.com",
  emailText: "saisuryamada@gmail.com",
  kaggle: "https://www.kaggle.com/competitions/google-tunix-hackathon/writeups/new-writeup-1767560834117",
};

export const header = {
  kicker: "AI ENGINEER · M.SC. AI @ THWS · GERMANY",
  status: "OPEN TO AI / ML ROLES",
  first: "Sai",
  middle: "Surya",
  last: "Mada",
  lede:
    "I build LLM systems that answer from real sources, keep personal data out of the prompt, and get tested before anyone relies on them.",
  stats: [
    { big: "&lt;1 min", small: "to prepare a customer quote, down from 20–30 minutes, with an LLM + live-ERP assistant" },
    { big: "4,096", small: "humanoid robots trained in parallel to walk, with PPO in NVIDIA Isaac" },
    { big: "0.904 F1", small: "finding birds in thermal drone imagery with <span style=\"white-space:nowrap\">Faster R-CNN</span>" },
  ],
};

export const sections = {
  now: { num: "01", title: "Right now", note: "WHERE I WORK" },
  work: { num: "02", title: "Selected work", note: "2025 – 2026, NEWEST FIRST" },
  how: { num: "03", title: "How I build LLM systems", note: "THE PATTERN BEHIND MOST OF IT" },
  kit: { num: "04", title: "Toolkit", note: "WHAT I REACH FOR" },
};

export const roles = [
  {
    dates: "OCT 2026 – TODAY",
    now: true,
    title: "AI Engineer",
    org: "AIOLIA, an EU-funded research project at THWS",
    big: "25 → 5",
    bigNote: "retrieved passages reranked down to the sources each answer cites",
    points: [
      "Self-hosted chatbot that teaches AI ethics and the EU AI Act, on LangGraph and FastAPI, with a game-style Node.js front end.",
      "Hybrid search (dense + BM25), with Presidio and NeMo Guardrails masking personal data and screening prompt injection.",
    ],
    stack: "LANGGRAPH · FASTAPI · VLLM · QDRANT · DOCKER",
  },
  {
    dates: "NOV 2025 – TODAY",
    now: true,
    title: "AI Developer",
    org: "Bearings Research Lab &amp; QPT Messtechnik GmbH",
    big: "30 → 1 min",
    bigNote: "to turn a plain-language request into a branded PDF quote with live ERP prices",
    points: [
      "Customer chatbot plus an internal quoting route; business actions exposed as MCP tools.",
      "Versioned prompts with regression checks, LLM-as-a-Judge evaluation, Docker + Jenkins CI on self-hosted GPUs.",
    ],
    stack: "FASTAPI · LANGGRAPH · MCP · REACT · JENKINS",
  },
  {
    dates: "MAR – SEP 2026",
    title: "Robotics &amp; RL Research Assistant",
    org: "Humanoid Robotics Lab, THWS",
    big: "4,096",
    bigNote: "simulated robots trained in parallel on every step",
    points: [
      "Taught the Booster T1 humanoid to balance and walk with PPO in NVIDIA Isaac, then exported the policy as a network.",
      "Wrote Java modules for GREBTL, the “brain” software of a Neura Robotics humanoid.",
    ],
    stack: "PYTHON · NVIDIA ISAAC · PPO · JAVA",
  },
  {
    dates: "NOV 2023 – NOV 2024",
    title: "Machine Learning Engineer",
    org: "HCLTech, Noida, India",
    big: "FAISS + API",
    bigNote: "natural-language search over the team’s benchmark reports",
    points: [
      "Automated processor and cloud-instance benchmarking with Python and Bash.",
      "Analysed results in PostgreSQL and Pandas to guide platform and cost decisions.",
    ],
    stack: "PYTHON · SQL · PANDAS · FASTAPI · FAISS",
  },
];

export const projects = [
  {
    year: "2026",
    title: "Agentic Analytics Platform",
    url: "https://github.com/Surya-24/Automated-Analytics",
    desc: "Ask a question in plain English and a LangGraph router hands it to a SQL or an ETL agent. Generated SQL must pass an AST check and an LLM judge, failing queries repair themselves, and ETL code runs in a Docker sandbox.",
    big: "Self-healing SQL",
    stack: "LANGGRAPH · POSTGRESQL · SQLGLOT · DOCKER",
  },
  {
    year: "2026",
    tag: "HACKATHON",
    title: "MAUS-Assistent",
    url: "https://github.com/Surya-24/Werkstaaten-main",
    desc: "Care-workshop staff chat about a participant and get valid assessment scores grounded in earlier notes, plus an integration plan as a PDF. Names and birthdates are pseudonymised before anything reaches the model.",
    big: "Chat → form → PDF",
    stack: "PYTHON · STREAMLIT · RAG · GEMINI",
  },
  {
    year: "2026",
    title: "Medical Image Benchmark",
    url: "https://github.com/Surya-24/DL-Repo",
    desc: "Rebuilt a broken, inherited codebase into one config-driven PyTorch pipeline. It benchmarks AlexNet, VGG16, ResNet18 and my own SlimResNet, then tests transfer learning when data is scarce.",
    big: "4 models × 5 datasets",
    stack: "PYTORCH · SCIKIT-LEARN",
  },
  {
    year: "2026",
    tag: "KAGGLE",
    title: "Gemma 3, tuned with GRPO",
    url: "https://www.kaggle.com/competitions/google-tunix-hackathon/writeups/new-writeup-1767560834117",
    desc: "Fine-tuned Gemma 3 2B-IT with LoRA and GRPO for Google’s Tunix hackathon, using a seven-part reward function I designed and a KL penalty against a frozen reference model.",
    big: "2,000 steps on a TPU",
    stack: "JAX · TUNIX · LORA · GRPO",
  },
  {
    year: "2025",
    tag: "TEAM",
    title: "MigrantNav",
    url: "https://github.com/Surya-24/NLP",
    desc: "Legal-aid assistant for EU asylum law that never leaves the laptop. A Neo4j knowledge graph answers multi-hop questions, vector search covers the rest, and replies come back in the asker’s own language.",
    big: "100% local",
    stack: "NEO4J · OLLAMA · QWEN 2.5 · LANGCHAIN",
  },
  {
    year: "2025",
    title: "Explainable Pneumonia Detection",
    url: "https://github.com/Surya-24/Explainable-AI-for-Pneumonia-Detection-using-Chest-X-Ray-Images",
    desc: "DenseNet-121 on imbalanced chest X-rays. Grad-CAM and LIME show what the model looked at, including on the scans it got wrong, so a doctor can see why it decided.",
    big: "89.4% accuracy",
    stack: "PYTORCH · CAPTUM · LIME",
  },
  {
    year: "2025",
    tag: "TEAM",
    title: "Waterfowl from the Air",
    url: "https://github.com/Surya-24/Waterfowl-Detection-----Object-Detection-on-Thermal-UAV-Imagery",
    desc: "A Faster R-CNN detector that counts individual birds in thermal drone footage for wildlife surveys, with augmentation tuned for thermal images and a close look at every miss.",
    big: "F1 0.904 · mAP 0.90",
    stack: "PYTORCH · FASTER R-CNN · RESNET-50",
  },
  {
    year: "2025",
    tag: "TEAM",
    title: "SKYBRIEF",
    url: "https://github.com/riyazbiju/WEATHER-AND-PILOTS",
    desc: "A scheduled Prefect pipeline over 231 weather sources that validates and quarantines bad readings, then compares a sparse Gaussian process with a Neural ODE to estimate conditions where no sensor exists.",
    big: "231 data sources",
    stack: "PREFECT · PANDAS · SVGP · NEURAL ODE",
  },
];

export const pipeline = [
  { name: "Guard", text: "Mask personal data and screen for prompt injection before the model sees anything." },
  { name: "Route", text: "A stateful LangGraph agent decides whether to look something up or take an action." },
  { name: "Retrieve or act", text: "Dense + BM25 search, reranked 25 → 5, or MCP tools for SQL, ERP and PDFs." },
  { name: "Generate", text: "An open-weight model, self-hosted on vLLM or Ollama, so data stays in-house." },
  { name: "Check", text: "Answers must be grounded and cite sources; LLM-as-a-Judge and regression tests run offline." },
];

export const toolkit = [
  {
    groups: [
      { label: "LANGUAGE MODELS &amp; AGENTS", items: ["LangGraph", "LangChain", "MCP", "vLLM", "Ollama", "Hugging Face", "LoRA / GRPO", "NeMo Guardrails", "Presidio", "LLM-as-a-Judge"] },
      { label: "RETRIEVAL &amp; DATA", items: ["Qdrant", "Neo4j", "FAISS", "ChromaDB", "PostgreSQL", "Docling", "Prefect", "Pandas"] },
    ],
  },
  {
    groups: [
      { label: "MACHINE LEARNING", items: ["PyTorch", "scikit-learn", "OpenCV", "NVIDIA Isaac", "Whisper", "Grad-CAM / LIME", "Gaussian processes"] },
      { label: "SHIPPING IT", items: ["Python", "Java", "SQL", "FastAPI", "Streamlit", "React", "Node.js", "Docker", "Jenkins", "GitHub Actions", "pytest", "Linux"] },
    ],
  },
];

export const education = [
  { what: "M.Sc. Artificial Intelligence", where: "THWS, Würzburg-Schweinfurt", when: "2025 – NOW" },
  { what: "Bachelor’s in Artificial Intelligence", where: "VIT Bhopal, India", when: "2019 – 2024" },
  { what: "Google Data Analytics Certificate", where: "Coursera", when: "" },
];
export const spoken = "English (fluent) · German (B1)";
