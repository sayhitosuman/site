import type { Project, BlogPost, Publication, Note, BrainDump, Social } from "./data";

export const projects: Project[] = [
  {
    id: "vayu",
    title: "Vāyu — Wind Pattern Visualizer",
    description: "A real-time visualization tool that maps wind patterns across geographic regions.",
    longDescription: "Vāyu (Sanskrit for wind) started as a weekend experiment to understand why meteorological data is so difficult to make beautiful. It grew into a full WebGL rendering pipeline that ingests live NOAA data streams and renders fluid, real-time wind vector fields on a globe.\n\nThe hardest part wasn't the rendering. It was deciding how much information to show before the visualization becomes noise. I ended up stripping away almost everything except direction and speed.",
    status: "Active",
    sourceCode: "https://github.com/suman/vayu",
    liveUrl: "https://vayu.suman.dev",
    tech: ["WebGL", "Python", "D3.js", "NOAA API", "Vite"],
    year: "2024",
  },
  {
    id: "shruti",
    title: "Shruti — Acoustic Fingerprinting",
    description: "An acoustic analysis system that identifies regional musical instruments from raw audio.",
    longDescription: "Shruti (Sanskrit for 'that which is heard') is an attempt to preserve something: the sonic identity of instruments that don't appear in any major dataset. The training data was collected over six months — field recordings, archival tapes, a few very patient musicians.\n\nThe model uses MFCC feature vectors combined with spectral centroid analysis. Accuracy sits at 91% across 23 instrument classes.",
    status: "Stable",
    sourceCode: "https://github.com/suman/shruti",
    tech: ["TensorFlow", "Rust", "FFT", "Python", "Librosa"],
    year: "2023",
  },
  {
    id: "mitti",
    title: "Mitti — Soil Health Dashboard",
    description: "A dashboard for farmers aggregating soil sensor data with season-aware insights.",
    longDescription: "Mitti (Hindi for soil/earth) was built for a specific farmer cooperative in Rajasthan who were getting sensor data they couldn't read. The goal was radical simplicity — a dashboard a farmer with a feature phone could navigate.\n\nCurrently used by 40+ farms across three districts.",
    status: "In Use",
    sourceCode: "https://github.com/suman/mitti",
    liveUrl: "https://mitti.suman.dev",
    tech: ["React", "IoT", "PostgreSQL", "FastAPI", "MQTT"],
    year: "2024",
  },
];

export const publications: Publication[] = [
  {
    id: "distributed-sensor-networks",
    title: "Distributed Sensor Networks for Agricultural Monitoring in Semi-Arid Regions",
    description: "A study on deploying low-cost sensor networks for real-time soil monitoring.",
    abstract: "This paper presents a methodology for deploying distributed, low-cost sensor networks across geographically fragmented agricultural land in semi-arid climates. Our network of 340 sensor nodes achieved 94.2% uptime and correlated with a 12% improvement in water usage efficiency.",
    journal: "Journal of Agricultural Informatics",
    year: 2024,
    doi: "10.xxxx/jai.2024.0034",
    link: "#",
    authors: ["Suman", "A. Mehta", "R. Singh"],
  },
  {
    id: "acoustic-feature-extraction",
    title: "Acoustic Feature Extraction for Classification of Traditional String Instruments",
    description: "A novel approach to classifying traditional instruments using MFCC feature vectors.",
    abstract: "We present a novel classification pipeline for traditional South Asian string instruments using MFCC extraction and spectral centroid analysis. Our dataset comprises 8,400 recordings spanning 23 instrument classes. The model achieves 91.3% classification accuracy.",
    journal: "IEEE Signal Processing Letters",
    year: 2023,
    doi: "10.xxxx/ieeesp.2023.0178",
    link: "#",
    authors: ["Suman", "P. Krishnamurti"],
  },
  {
    id: "webgl-geospatial",
    title: "On the Efficiency of WebGL-Based Geospatial Visualizations",
    description: "Benchmarking WebGL rendering pipelines for large-scale meteorological data visualization.",
    abstract: "This study benchmarks five WebGL rendering strategies for real-time geospatial data visualization. Our results suggest that instanced mesh rendering outperforms particle-system approaches by 3.4× in sustained frame rate.",
    journal: "Computer Graphics Forum",
    year: 2023,
    doi: "10.xxxx/cgf.2023.0091",
    link: "#",
    authors: ["Suman"],
  },
];

export const blogs: BlogPost[] = [
  {
    id: "stopped-optimizing",
    title: "Why I Stopped Optimizing and Started Shipping",
    excerpt: "There's a particular kind of paralysis that comes from reading too many best-practices articles. I spent three months rewriting a config file.",
    content: `There's a particular kind of paralysis that comes from reading too many best-practices articles. You start a project with genuine enthusiasm, and then slowly — article by article — you start to feel like everything you've written is wrong.\n\nI spent three months rewriting a configuration file.\n\n---\n\nWhat broke the cycle was a conversation with someone who'd been building software for twenty-five years. I showed him my configuration system and he looked at it for about ten seconds.\n\n"Does it work?" he asked.\n\n"Yes," I said.\n\n"Then ship it."\n\n---\n\nI'm not arguing for writing bad code. I'm arguing for distinguishing between necessary quality and performed quality. Ship the thing. Refine after people have told you it matters.`,
    date: "2024-11-15",
    readTime: "5 min",
  },
  {
    id: "village-internet-cafe",
    title: "The Village Internet Café That Taught Me Computing",
    excerpt: "In 2008, a dusty room with four CRT monitors and a 256kbps connection was my entire digital universe.",
    content: `In 2008, there was one internet café in our town. It had four computers, CRT monitors, and a 256kbps connection on a good day.\n\nI spent every Saturday afternoon there. I was thirteen.\n\n---\n\nI found HTML by accident. I was trying to understand why a website looked the way it did, and someone in a forum mentioned right-clicking and "View Source." I did. I read the source of the page for the rest of that afternoon.\n\nThe next Saturday I wrote my first HTML. It was a table describing the types of clouds I had been cataloguing since I was ten.\n\n---\n\nThat environment was all constraint, and constraint is its own kind of teacher.`,
    date: "2024-08-22",
    readTime: "7 min",
  },
  {
    id: "reading-code-like-literature",
    title: "Reading Code Like Literature",
    excerpt: "Good code has rhythm. It has pacing. The best repositories I've studied have the narrative structure of a well-constructed essay.",
    content: `Good code has rhythm. It has pacing. It has moments where it slows down and explains itself, and moments where it moves quickly because the reader is now trusted.\n\nI've been reading code the way I read books for about three years now. Not skimming for the function I need, but reading — linearly, with attention.\n\n---\n\nThe best codebases I've read have what literary critics would call a "voice" — a consistent set of choices that make any given file feel like it belongs.\n\n---\n\nWhen I'm writing now, I read each function out loud in my head, as if explaining it to someone who is smart but unfamiliar with this specific problem. If I stumble, that's a signal.`,
    date: "2024-05-10",
    readTime: "6 min",
  },
];

export const notes: Note[] = [
  {
    id: "myth-of-10x",
    title: "On the Myth of the 10x Developer",
    content: "The 10x developer isn't someone who writes 10x more code. They're someone who prevents 10x more bad decisions. Most of their value is invisible.",
    fullContent: `The 10x developer isn't someone who writes 10x more code. They're someone who prevents 10x more bad decisions.\n\nThis distinction matters enormously, and we get it wrong constantly. The mythology of the 10x developer is about output — lines written, tickets closed, features shipped. But most genuinely exceptional engineers I know are exceptional because of what they stop from happening.\n\n---\n\nI think about this when I see teams trying to measure engineering productivity. Every metric I've seen measures the visible thing. None of them measure the prevented disasters.`,
    date: "2024-12-01",
  },
  {
    id: "simplicity-practice",
    title: "Simplicity is a Practice, Not a State",
    content: "You don't arrive at simplicity. You practice it daily, like meditation. Every abstraction you add is a small debt against clarity.",
    fullContent: `You don't arrive at simplicity. You practice it daily, like meditation.\n\nThis took me a long time to understand. I used to think about simplicity as a quality of a finished thing. But simplicity isn't a state you achieve; it's a direction you keep moving in.\n\n---\n\nI've started treating code review as a simplicity audit. Not with the goal of rejecting complexity, but with the goal of making sure complexity is earning its place.`,
    date: "2024-10-18",
  },
  {
    id: "boring-technology",
    title: "Why I Prefer Boring Technology",
    content: "PostgreSQL, plain HTML, vanilla CSS. Not because I can't learn new things — but because reliable tools let me focus on the actual problem.",
    fullContent: `PostgreSQL, plain HTML, vanilla CSS. Not because I can't learn new things, but because reliable tools let me focus on the actual problem instead of the tooling.\n\nThere's a concept sometimes called "boring technology" — tools that are old enough to have had their surprises discovered and documented.\n\n---\n\nThe hidden cost of exciting technology is the uncertainty tax. Every time you hit a problem, you don't know if it's your problem or the tool's problem. I choose boring technology because it minimises the uncertainty tax.`,
    date: "2024-09-05",
  },
];

export const brainDumps: BrainDump[] = [
  { id: "git-commit-letter", title: "Git Letters", body: "Every git commit is a tiny letter to your future self. Be kind.", date: "2024-12-10", time: "11:42pm", category: "tech", likes: 12 },
  { id: "best-api", title: "API Design", body: "The best API is the one you don't need to read the docs for.", date: "2024-12-08", time: "3:17pm", category: "tech", likes: 8 },
  { id: "terminal-honest", title: "Honest Interfaces", body: "The terminal is the most honest interface ever made. No rounded corners to hide behind.", date: "2024-12-05", time: "9:05am", category: "rant", likes: 24 },
  { id: "perfection-delay", title: "Perfection Bias", body: "Perfection is just delay with better branding.", date: "2024-11-29", time: "2:33am", category: "good", likes: 31 },
  { id: "naming-things", title: "The Naming Problem", body: "Naming things is hard because naming is thinking. If you can't name it, you don't understand it yet.", date: "2024-11-21", time: "6:50pm", category: "idea", likes: 17 },
  { id: "silence-productive", title: "Productive Silence", body: "Silence is productive. Meetings are not.", date: "2024-11-15", time: "10:20am", category: "rant", likes: 45 },
  { id: "poetry-code", title: "Machine Poetry", body: "Code is just poetry for machines. Make it rhyme.", date: "2024-11-10", time: "4:30pm", category: "poem", likes: 19 },
  { id: "life-debugging", title: "Life Debugging", body: "Life is just debugging with higher stakes.", date: "2024-11-05", time: "7:15am", category: "life", likes: 28 },
];

export const socials: Social[] = [
  { id: "1", platform: "GitHub", url: "https://github.com/sayhitosuman", label: "github.com/sayhitosuman" },
  { id: "2", platform: "Twitter / X", url: "https://twitter.com/sayhitosuman", label: "twitter.com/sayhitosuman" },
  { id: "3", platform: "Email", url: "mailto:sayhitosuman@outlook.com", label: "sayhitosuman@outlook.com" },
  { id: "4", platform: "LinkedIn", url: "https://linkedin.com/in/sayhitosuman", label: "linkedin.com/in/sayhitosuman" },
  { id: "5", platform: "Instagram", url: "https://instagram.com/sayhitosuman", label: "instagram" },
  { id: "6", platform: "YouTube", url: "https://youtube.com/@sayhitosuman", label: "youtube" },
  { id: "7", platform: "LeetCode", url: "https://leetcode.com/sayhitosuman", label: "leetcode" },
  { id: "8", platform: "HackerRank", url: "https://hackerrank.com/sayhitosuman", label: "hackerrank" },
  { id: "9", platform: "Discord", url: "https://discord.com/users/sayhitosuman", label: "discord" },
  { id: "10", platform: "Slack", url: "#", label: "sayhitosuman" },
  { id: "11", platform: "Google", url: "https://www.google.com/search?q=sayhitosuman", label: "google" },
];
