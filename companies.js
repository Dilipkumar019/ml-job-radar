// lib/companies.js
// Top 100 Tech Companies with their careers page URLs and job API endpoints

export const COMPANIES = [
  // Big Tech
  { name: "Google", slug: "google", careersUrl: "https://careers.google.com/jobs/results/?category=DATA_ANALYTICS&category=MACHINE_LEARNING&jex=ENTRY_LEVEL,MID", logo: "🔵", useApi: "google" },
  { name: "Meta", slug: "meta", careersUrl: "https://www.metacareers.com/jobs?teams[0]=Artificial%20Intelligence&teams[1]=Data%20Infrastructure&teams[2]=Machine%20Learning", logo: "🔷", useApi: "meta" },
  { name: "Microsoft", slug: "microsoft", careersUrl: "https://jobs.careers.microsoft.com/global/en/search?q=machine+learning+data+scientist&exp=Experienced professionals", logo: "🟦", useApi: "microsoft" },
  { name: "Amazon", slug: "amazon", careersUrl: "https://www.amazon.jobs/en/search?base_query=machine+learning+data+scientist&job_type=Full-Time", logo: "🟠", useApi: "amazon" },
  { name: "Apple", slug: "apple", careersUrl: "https://jobs.apple.com/en-us/search#text=machine+learning", logo: "⚫", useApi: "apple" },

  // AI-First Companies
  { name: "OpenAI", slug: "openai", careersUrl: "https://openai.com/careers", logo: "🤖", useApi: "greenhouse" },
  { name: "Anthropic", slug: "anthropic", careersUrl: "https://www.anthropic.com/careers", logo: "🧠", useApi: "greenhouse" },
  { name: "DeepMind", slug: "deepmind", careersUrl: "https://deepmind.google/about/careers/", logo: "💡", useApi: "google" },
  { name: "Cohere", slug: "cohere", careersUrl: "https://cohere.com/careers", logo: "🔮", useApi: "greenhouse" },
  { name: "Mistral AI", slug: "mistral", careersUrl: "https://mistral.ai/careers/", logo: "💨", useApi: "lever" },
  { name: "Stability AI", slug: "stability", careersUrl: "https://stability.ai/careers", logo: "🌊", useApi: "greenhouse" },
  { name: "Hugging Face", slug: "huggingface", careersUrl: "https://apply.workable.com/huggingface/", logo: "🤗", useApi: "workable" },
  { name: "Scale AI", slug: "scale", careersUrl: "https://scale.com/careers", logo: "📈", useApi: "greenhouse" },
  { name: "Inflection AI", slug: "inflection", careersUrl: "https://inflection.ai/careers", logo: "🌀", useApi: "lever" },
  { name: "xAI", slug: "xai", careersUrl: "https://x.ai/careers", logo: "❌", useApi: "greenhouse" },

  // Cloud & Infrastructure
  { name: "Nvidia", slug: "nvidia", careersUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=machine+learning", logo: "🟩", useApi: "workday" },
  { name: "Databricks", slug: "databricks", careersUrl: "https://www.databricks.com/company/careers/open-positions?department=Engineering", logo: "🧱", useApi: "greenhouse" },
  { name: "Snowflake", slug: "snowflake", careersUrl: "https://careers.snowflake.com/us/en/search-results?keywords=machine+learning", logo: "❄️", useApi: "workday" },
  { name: "Palantir", slug: "palantir", careersUrl: "https://www.palantir.com/careers/", logo: "🔭", useApi: "lever" },
  { name: "Cloudera", slug: "cloudera", careersUrl: "https://cloudera.wd5.myworkdayjobs.com/cloudera_careers", logo: "☁️", useApi: "workday" },

  // Consumer Tech
  { name: "Netflix", slug: "netflix", careersUrl: "https://jobs.netflix.com/search?q=machine+learning", logo: "🔴", useApi: "greenhouse" },
  { name: "Spotify", slug: "spotify", careersUrl: "https://www.lifeatspotify.com/jobs?c=engineering&l=remote&q=machine+learning", logo: "🟢", useApi: "greenhouse" },
  { name: "Uber", slug: "uber", careersUrl: "https://www.uber.com/us/en/careers/list/?query=machine+learning", logo: "⬛", useApi: "greenhouse" },
  { name: "Airbnb", slug: "airbnb", careersUrl: "https://careers.airbnb.com/positions/?department=Engineering%20%26%20Technology", logo: "🔶", useApi: "greenhouse" },
  { name: "Lyft", slug: "lyft", careersUrl: "https://www.lyft.com/careers/data", logo: "🩷", useApi: "greenhouse" },
  { name: "DoorDash", slug: "doordash", careersUrl: "https://careers.doordash.com/jobs?search=machine+learning", logo: "🔴", useApi: "greenhouse" },
  { name: "Instacart", slug: "instacart", careersUrl: "https://instacart.careers/current-openings/", logo: "🟢", useApi: "greenhouse" },

  // Fintech
  { name: "Stripe", slug: "stripe", careersUrl: "https://stripe.com/jobs/search?query=machine+learning", logo: "🟣", useApi: "greenhouse" },
  { name: "Square / Block", slug: "block", careersUrl: "https://block.xyz/careers", logo: "⬛", useApi: "greenhouse" },
  { name: "Plaid", slug: "plaid", careersUrl: "https://plaid.com/careers/openings/", logo: "🔷", useApi: "lever" },
  { name: "Robinhood", slug: "robinhood", careersUrl: "https://careers.robinhood.com/openings", logo: "🟢", useApi: "greenhouse" },
  { name: "Coinbase", slug: "coinbase", careersUrl: "https://www.coinbase.com/careers/positions?department=Engineering", logo: "🔵", useApi: "greenhouse" },
  { name: "Chime", slug: "chime", careersUrl: "https://careers.chime.com/", logo: "🟩", useApi: "greenhouse" },

  // Enterprise Software
  { name: "Salesforce", slug: "salesforce", careersUrl: "https://salesforce.wd12.myworkdayjobs.com/External_Career_Site?q=machine+learning", logo: "☁️", useApi: "workday" },
  { name: "Workday", slug: "workday", careersUrl: "https://workday.wd5.myworkdayjobs.com/Workday?q=machine+learning", logo: "🔵", useApi: "workday" },
  { name: "ServiceNow", slug: "servicenow", careersUrl: "https://jobs.smartrecruiters.com/ServiceNow?keyword=machine+learning", logo: "🟢", useApi: "smartrecruiters" },
  { name: "Twilio", slug: "twilio", careersUrl: "https://www.twilio.com/en-us/company/jobs", logo: "🔴", useApi: "greenhouse" },
  { name: "HubSpot", slug: "hubspot", careersUrl: "https://www.hubspot.com/careers/jobs?hubs_content=www.hubspot.com%2Fcareers&hubs_content-cta=Browse+all+jobs", logo: "🟠", useApi: "greenhouse" },

  // Social & Communication
  { name: "LinkedIn", slug: "linkedin", careersUrl: "https://careers.linkedin.com/", logo: "🔵", useApi: "greenhouse" },
  { name: "Twitter / X", slug: "twitter", careersUrl: "https://careers.x.com/en", logo: "⬛", useApi: "greenhouse" },
  { name: "Snap", slug: "snap", careersUrl: "https://careers.snap.com/jobs?roles=Engineering&query=machine+learning", logo: "🟡", useApi: "greenhouse" },
  { name: "Discord", slug: "discord", careersUrl: "https://discord.com/careers", logo: "🟣", useApi: "greenhouse" },
  { name: "Reddit", slug: "reddit", careersUrl: "https://www.reddit.com/r/jobs/", logo: "🟠", useApi: "greenhouse" },
  { name: "Pinterest", slug: "pinterest", careersUrl: "https://www.pinterestcareers.com/job-search-results/?keyword=machine+learning", logo: "🔴", useApi: "greenhouse" },

  // Healthcare & Biotech
  { name: "Tempus AI", slug: "tempus", careersUrl: "https://www.tempus.com/careers/", logo: "🏥", useApi: "greenhouse" },
  { name: "Flatiron Health", slug: "flatiron", careersUrl: "https://flatiron.com/careers/open-positions/", logo: "🟢", useApi: "lever" },
  { name: "Recursion", slug: "recursion", careersUrl: "https://www.recursion.com/careers", logo: "🧬", useApi: "greenhouse" },
  { name: "Moderna", slug: "moderna", careersUrl: "https://careers.modernatx.com/jobs?keywords=data+scientist", logo: "💉", useApi: "workday" },

  // Autonomous & Robotics
  { name: "Waymo", slug: "waymo", careersUrl: "https://waymo.com/careers/", logo: "🚗", useApi: "greenhouse" },
  { name: "Tesla", slug: "tesla", careersUrl: "https://www.tesla.com/careers/search/?query=machine+learning&department=4", logo: "⚡", useApi: "custom" },
  { name: "Boston Dynamics", slug: "bostondynamics", careersUrl: "https://bostondynamics.com/careers/", logo: "🤖", useApi: "greenhouse" },
  { name: "Cruise", slug: "cruise", careersUrl: "https://getcruise.com/careers/jobs/", logo: "🚕", useApi: "greenhouse" },
  { name: "Figure AI", slug: "figure", careersUrl: "https://www.figure.ai/careers", logo: "🦾", useApi: "greenhouse" },

  // Search & Data
  { name: "Elastic", slug: "elastic", careersUrl: "https://jobs.elastic.co/?q=machine+learning", logo: "🔍", useApi: "greenhouse" },
  { name: "Splunk", slug: "splunk", careersUrl: "https://www.splunk.com/en_us/careers/search-jobs.html?keyword=machine+learning", logo: "🟠", useApi: "greenhouse" },
  { name: "MongoDB", slug: "mongodb", careersUrl: "https://www.mongodb.com/careers/jobs?department=Engineering&q=machine+learning", logo: "🟢", useApi: "greenhouse" },
  { name: "Confluent", slug: "confluent", careersUrl: "https://www.confluent.io/careers/open-positions/", logo: "🔵", useApi: "greenhouse" },

  // Gaming
  { name: "Riot Games", slug: "riot", careersUrl: "https://www.riotgames.com/en/work-with-us/jobs#search=machine+learning", logo: "⚔️", useApi: "greenhouse" },
  { name: "Epic Games", slug: "epic", careersUrl: "https://www.epicgames.com/site/en-US/careers/jobs?q=machine+learning", logo: "🎮", useApi: "greenhouse" },
  { name: "Unity", slug: "unity", careersUrl: "https://careers.unity.com/positions?query=machine+learning", logo: "⬛", useApi: "greenhouse" },

  // Enterprise AI
  { name: "C3.ai", slug: "c3ai", careersUrl: "https://c3.ai/careers/", logo: "🔷", useApi: "greenhouse" },
  { name: "DataRobot", slug: "datarobot", careersUrl: "https://www.datarobot.com/careers/", logo: "🤖", useApi: "greenhouse" },
  { name: "H2O.ai", slug: "h2oai", careersUrl: "https://h2o.ai/careers/", logo: "💧", useApi: "greenhouse" },
  { name: "Weights & Biases", slug: "wandb", careersUrl: "https://wandb.ai/careers", logo: "📊", useApi: "greenhouse" },
  { name: "LangChain", slug: "langchain", careersUrl: "https://www.langchain.com/careers", logo: "🔗", useApi: "greenhouse" },
  { name: "Pinecone", slug: "pinecone", careersUrl: "https://www.pinecone.io/careers/", logo: "🌲", useApi: "greenhouse" },
  { name: "Weaviate", slug: "weaviate", careersUrl: "https://weaviate.io/company/careers", logo: "🔮", useApi: "greenhouse" },

  // Semiconductor
  { name: "AMD", slug: "amd", careersUrl: "https://careers.amd.com/careers-home/jobs?keywords=machine+learning", logo: "🔴", useApi: "workday" },
  { name: "Intel", slug: "intel", careersUrl: "https://jobs.intel.com/en/search-jobs/machine+learning/", logo: "🔵", useApi: "custom" },
  { name: "Qualcomm", slug: "qualcomm", careersUrl: "https://careers.qualcomm.com/careers?keywords=machine+learning", logo: "🔵", useApi: "workday" },

  // Dev Tools & Infra
  { name: "GitHub", slug: "github", careersUrl: "https://github.com/about/careers", logo: "⬛", useApi: "greenhouse" },
  { name: "GitLab", slug: "gitlab", careersUrl: "https://about.gitlab.com/jobs/all-jobs/", logo: "🟠", useApi: "greenhouse" },
  { name: "Vercel", slug: "vercel", careersUrl: "https://vercel.com/careers", logo: "⬛", useApi: "greenhouse" },
  { name: "HashiCorp", slug: "hashicorp", careersUrl: "https://www.hashicorp.com/careers", logo: "🟣", useApi: "greenhouse" },
  { name: "Datadog", slug: "datadog", careersUrl: "https://careers.datadoghq.com/all-jobs/?search=machine+learning", logo: "🐕", useApi: "greenhouse" },

  // Others
  { name: "Adobe", slug: "adobe", careersUrl: "https://www.adobe.com/careers.html", logo: "🔴", useApi: "workday" },
  { name: "Zoom", slug: "zoom", careersUrl: "https://careers.zoom.us/jobs?search=machine+learning", logo: "🔵", useApi: "greenhouse" },
  { name: "Shopify", slug: "shopify", careersUrl: "https://www.shopify.com/careers/search?keywords=machine+learning", logo: "🟢", useApi: "greenhouse" },
  { name: "Canva", slug: "canva", careersUrl: "https://www.canva.com/careers/", logo: "🎨", useApi: "greenhouse" },
  { name: "Figma", slug: "figma", careersUrl: "https://www.figma.com/careers/", logo: "🟣", useApi: "greenhouse" },
  { name: "Notion", slug: "notion", careersUrl: "https://www.notion.so/careers", logo: "⬜", useApi: "greenhouse" },
  { name: "Airtable", slug: "airtable", careersUrl: "https://airtable.com/careers", logo: "🔵", useApi: "greenhouse" },
  { name: "Asana", slug: "asana", careersUrl: "https://asana.com/jobs", logo: "🩷", useApi: "greenhouse" },
  { name: "Dropbox", slug: "dropbox", careersUrl: "https://jobs.dropbox.com/all-jobs?gh_src=aonhf1", logo: "🔵", useApi: "greenhouse" },
  { name: "Twitch", slug: "twitch", careersUrl: "https://www.twitch.tv/jobs/en/", logo: "🟣", useApi: "greenhouse" },
  { name: "Roblox", slug: "roblox", careersUrl: "https://careers.roblox.com/jobs?query=machine+learning", logo: "🟥", useApi: "greenhouse" },
  { name: "ByteDance", slug: "bytedance", careersUrl: "https://jobs.bytedance.com/en/position?keywords=machine+learning", logo: "🎵", useApi: "custom" },
  { name: "Samsung", slug: "samsung", careersUrl: "https://www.samsung.com/us/careers/", logo: "🔵", useApi: "custom" },
  { name: "IBM", slug: "ibm", careersUrl: "https://www.ibm.com/careers/search?field_keyword_08[0]=Artificial%20Intelligence", logo: "🔵", useApi: "custom" },
  { name: "Oracle", slug: "oracle", careersUrl: "https://careers.oracle.com/jobs/#en/sites/jobsearch/jobs?keyword=machine+learning", logo: "🔴", useApi: "taleo" },
  { name: "SAP", slug: "sap", careersUrl: "https://jobs.sap.com/search/?q=machine+learning", logo: "🔵", useApi: "custom" },
  { name: "Cisco", slug: "cisco", careersUrl: "https://jobs.cisco.com/jobs/SearchJobs/machine+learning", logo: "🔵", useApi: "custom" },
];

export const JOB_KEYWORDS = [
  "machine learning", "ML engineer", "data scientist", "AI engineer",
  "deep learning", "NLP engineer", "computer vision", "MLOps",
  "data engineer", "AI researcher", "applied scientist", "research scientist",
  "LLM engineer", "generative AI", "reinforcement learning"
];

export const EXPERIENCE_FILTERS = [
  "0-2 years", "0-3 years", "entry level", "junior", "associate",
  "new grad", "early career", "1-3 years", "2-3 years"
];
