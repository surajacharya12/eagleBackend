const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Project = require("./module/project");
const Event = require("./module/event");
const Resource = require("./module/resource");
const Testimonial = require("./module/testimonial");
const GetInvolved = require("./module/getInvolved");

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for seeding");

        // Clear existing data
        await Project.deleteMany({});
        await Event.deleteMany({});
        await Resource.deleteMany({});
        await Testimonial.deleteMany({});
        await GetInvolved.deleteMany({});
        console.log("Cleared existing data");

        // Seed Projects
        const projects = [
            {
                name: "AI Assistant SDK",
                tagline: "Build intelligent conversational AI applications",
                description: "Developer-friendly SDK for creating AI-powered chatbots and virtual assistants with natural language understanding.",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
                category: "incubating",
                version: "v0.9.2 Beta",
                maturity: "85%",
                contributors: 45,
                stars: 1200,
                features: ["Pre-trained NLP models", "Multi-language support", "Context management"],
                techStack: ["Python", "TensorFlow", "FastAPI"],
                status: "Beta Testing",
                roadmap: "Stable release Q2 2025",
                license: "Commercial"
            },
            {
                name: "DevOps Automation Hub",
                tagline: "Streamline your CI/CD pipeline",
                description: "All-in-one platform for automating deployments, testing, and infrastructure management across multiple environments.",
                image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
                category: "incubating",
                version: "v0.7.5 Beta",
                maturity: "70%",
                contributors: 32,
                stars: 890,
                features: ["Pipeline orchestration", "Environment management", "Automated testing"],
                techStack: ["Go", "Docker", "Kubernetes"],
                status: "Active Development",
                roadmap: "Stable release Q3 2025",
                license: "Commercial"
            },
            {
                name: "Quantum Simulator",
                tagline: "Explore quantum computing algorithms",
                description: "A browser-based simulator for quantum circuits and algorithms, perfect for educational purposes.",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
                category: "sandbox",
                version: "v0.1.0 Alpha",
                maturity: "20%",
                contributors: 5,
                stars: 120,
                features: ["Visual circuit builder", "State vector visualization", "Noise simulation"],
                techStack: ["TypeScript", "WebAssembly", "React"],
                status: "Experimental",
                roadmap: "Core features Q4 2025",
                license: "MIT"
            },
            {
                name: "Enterprise ERP",
                tagline: "Complete business management solution",
                description: "Scalable ERP system for large enterprises handling finance, HR, and supply chain.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                category: "graduated",
                version: "v2.4.0",
                maturity: "100%",
                contributors: 150,
                stars: 3500,
                features: ["Financial reporting", "HR management", "Inventory tracking"],
                techStack: ["Java", "Spring Boot", "Angular"],
                status: "Stable",
                roadmap: "AI integration Q3 2025",
                license: "Enterprise"
            },
            {
                name: "Legacy CRM",
                tagline: "Old reliable customer management",
                description: "The previous generation CRM system, now in maintenance mode.",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
                category: "archived",
                version: "v1.0.0",
                maturity: "100%",
                contributors: 10,
                stars: 50,
                features: ["Contact management", "Email integration"],
                techStack: ["PHP", "MySQL"],
                status: "Deprecated",
                roadmap: "End of life 2026",
                license: "Proprietary"
            }
        ];
        await Project.insertMany(projects);
        console.log("Seeded Projects");

        // Seed Events
        const events = [
            {
                title: "Global Tech Summit 2025",
                description: "Join industry leaders for a 3-day conference on the future of technology.",
                date: new Date("2025-06-15T09:00:00"),
                location: "San Francisco, CA",
                attendees: 5000,
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                category: "Conference",
                featured: true,
                type: "upcoming",
                registrationLink: "https://example.com/register"
            },
            {
                title: "AI Workshop Series",
                description: "Hands-on workshop building LLM applications.",
                date: new Date("2025-04-20T10:00:00"),
                location: "Online",
                attendees: 200,
                image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800",
                category: "Workshop",
                featured: false,
                type: "upcoming",
                registrationLink: "https://example.com/workshop"
            },
            {
                title: "Web3 Hackathon",
                description: "48-hour hackathon building decentralized apps.",
                date: new Date("2024-11-10T09:00:00"),
                location: "London, UK",
                attendees: 300,
                image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800",
                category: "Hackathon",
                featured: true,
                type: "past",
                registrationLink: "https://example.com/hackathon"
            }
        ];
        await Event.insertMany(events);
        console.log("Seeded Events");

        // Seed Resources
        const resources = [
            {
                title: "Getting Started with React",
                description: "A comprehensive guide for beginners.",
                type: "tutorial",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                link: "https://react.dev",
                tags: ["react", "frontend", "javascript"],
                featured: true
            },
            {
                title: "API Documentation Template",
                description: "Standard template for REST API docs.",
                type: "template",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
                link: "https://example.com/template",
                tags: ["api", "docs"],
                featured: false
            }
        ];
        await Resource.insertMany(resources);
        console.log("Seeded Resources");

        // Seed Testimonials
        const testimonials = [
            {
                name: "Sarah Johnson",
                role: "CTO",
                company: "TechStart Inc",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                content: "This platform has transformed how we manage our development lifecycle. Incredible tools!",
                rating: 5,
                featured: true
            },
            {
                name: "Michael Chen",
                role: "Lead Developer",
                company: "InnovateCo",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                content: "The best developer experience I've had in years. Highly recommended.",
                rating: 5,
                featured: true
            }
        ];
        await Testimonial.insertMany(testimonials);
        console.log("Seeded Testimonials");

        // Seed Get Involved
        const options = [
            {
                title: "Open Source Contributor",
                description: "Contribute code to our core repositories.",
                type: "contribute",
                icon: "💻",
                link: "https://github.com/org",
                benefits: ["Recognition", "Swag", "Learning"],
                requirements: ["Git", "JavaScript"],
                featured: true
            },
            {
                title: "Community Mentor",
                description: "Help new developers find their way.",
                type: "volunteer",
                icon: "🤝",
                link: "https://discord.gg/example",
                benefits: ["Networking", "Leadership"],
                requirements: ["Empathy", "Experience"],
                featured: false
            }
        ];
        await GetInvolved.insertMany(options);
        console.log("Seeded Get Involved Options");

        console.log("Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
