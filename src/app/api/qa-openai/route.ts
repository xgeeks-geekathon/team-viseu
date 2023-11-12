import dotenv from "dotenv";
import { StreamingTextResponse, OpenAIStream } from "ai";
import OpenAI from "openai";

dotenv.config({ path: `.env.local` });

// const model = "gpt-4-1106-preview";
const model = "gpt-3.5-turbo-16k";

const data = `Below we define a list of tickets that are describing a development lifecycle of a marketplace application.
A single ticket is described by the following properties:
  "title": "Title of the jira ticket",
  "assignee": "The person assigned to the ticket",
  "duration": "How many hours the ticket has been in development, null if not yet started",
  "estimate": "How many hours we estimate the ticket will take",
  "time_spent_in_blocked": How many hours the ticket spent in blocked state,
  "status": "The current state of the ticket",
  "completed_at": "The date when the ticket has been completed in the format DD-MM-YYY",
  "sprint": "Name of the sprint associated with the ticket",
  "okr": "The Objective associated with this ticket"

Consider the following JSON structure:
[{
  "title": "Optimize Database Queries",
  "assignee": "Alice Brown",
  "duration": 40,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "15-09-2023",
  "sprint": "37/2023",
  "okr": "Improve system performance"
},
{
  "title": "Implement Wishlist Feature",
  "assignee": "James Martin",
  "duration": 32,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "21-09-2023",
  "sprint": "38/2023",
  "okr": "Improve user engagement"
},
{
  "title": "Fix Security Vulnerabilities",
  "assignee": "Michael Johnson",
  "duration": 32,
  "estimate": 32,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "21-09-2023",
  "sprint": "38/2023",
  "okr": "Enhance system security"
},
{
  "title": "Implement Admin Dashboard",
  "assignee": "Jane Smith",
  "duration": 40,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "22-09-2023",
  "sprint": "38/2023",
  "okr": "Improve admin functionality"
},
{
  "title": "Enhance Search Functionality",
  "assignee": "James Martin",
  "duration": 28,
  "estimate": 24,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "26-09-2023",
  "sprint": "39/2023",
  "okr": "Improve user engagement"
},
{
  "title": "Implement Mobile Responsiveness",
  "assignee": "Alice Brown",
  "duration": 40,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "26-09-2023",
  "sprint": "39/2023",
  "okr": "Improve mobile usage and retention"
},
{
  "title": "Refactor Codebase",
  "assignee": "Michael Johnson",
  "duration": 34,
  "estimate": 40,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "27-09-2023",
  "sprint": "39/2023",
  "okr": "Neutral"
},
{
  "title": "Implement Customer Reviews",
  "assignee": "Jane Smith",
  "duration": 32,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "28-09-2023",
  "sprint": "39/2023",
  "okr": "Encourage user feedback"
},
{
  "title": "Fix UI Bugs",
  "assignee": "James Martin",
  "duration": 16,
  "estimate": 16,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "29-09-2023",
  "sprint": "39/2023",
  "okr": "Neutral"
},
{
  "title": "Implement Social Media Integration",
  "assignee": "Alice Brown",
  "duration": 32,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "03-10-2023",
  "sprint": "40/2023",
  "okr": "Improve user engagement"
},
{
  "title": "Conduct Load Testing",
  "assignee": "Michael Johnson",
  "duration": 32,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "04-10-2023",
  "sprint": "40/2023",
  "okr": "Ensure scalability"
},
{
  "title": "Implement Subscription Service",
  "assignee": "Jane Smith",
  "duration": 88,
  "estimate": 72,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "04-10-2023",
  "sprint": "40/2023",
  "okr": "Launch product subscriptions"
},
{
  "title": "Enhance Product Recommendation Algorithm",
  "assignee": "James Martin",
  "duration": 24,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "06-10-2023",
  "sprint": "40/2023",
  "okr": "Enhance recommendation accuracy"
},
{
  "title": "Implement Multi-Language Support",
  "assignee": "Alice Brown",
  "duration": 32,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "09-10-2023",
  "sprint": "41/2023",
  "okr": "Internationalise platform"
},
{
  "title": "Fix Checkout Process Issues",
  "assignee": "Michael Johnson",
  "duration": 40,
  "estimate": 40,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "10-10-2023",
  "sprint": "41/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Enhance User Profile Page",
  "assignee": "Jane Smith",
  "duration": 16,
  "estimate": 16,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "13-10-2023",
  "sprint": "41/2023",
  "okr": "Enhance user experience"
},
{
  "title": "Implement Real-time Chat",
  "assignee": "James Martin",
  "duration": 32,
  "estimate": 32,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "13-10-2023",
  "sprint": "41/2023",
  "okr": "Enhance user experience"
},
{
  "title": "Implement AI-Powered Recommendations",
  "assignee": "Alice Brown",
  "duration": 40,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "16-10-2023",
  "sprint": "42/2023",
  "okr": "Enhance recommendation accuracy"
},
{
  "title": "Implement Image Recognition for Products",
  "assignee": "Michael Johnson",
  "duration": 24,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "18-10-2023",
  "sprint": "42/2023",
  "okr": "Enhance product management"
},
{
  "title": "Conduct Usability Testing",
  "assignee": "Jane Smith",
  "duration": 16,
  "estimate": 16,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "18-10-2023",
  "sprint": "42/2023",
  "okr": "Neutral"
},
{
  "title": "Implement Push Notifications",
  "assignee": "James Martin",
  "duration": 24,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "20-10-2023",
  "sprint": "42/2023",
  "okr": "Improve mobile experience"
},
{
  "title": "Optimize Mobile App Performance",
  "assignee": "Alice Brown",
  "duration": 25,
  "estimate": 32,
  "time_spent_in_blocked": 8,
  "status": "Blocked",
  "completed_at": "23-10-2023",
  "sprint": "43/2023",
  "okr": "Improve mobile experience"
},
{
  "title": "Enhance Product Page Layout",
  "assignee": "Michael Johnson",
  "duration": 16,
  "estimate": 16,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "24-10-2023",
  "sprint": "43/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Implement Advanced Search Filters",
  "assignee": "James Martin",
  "duration": 24,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "27-10-2023",
  "sprint": "43/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Enhance Customer Support System",
  "assignee": "Alice Brown",
  "duration": 40,
  "estimate": 40,
  "time_spent_in_blocked": 8,
  "status": "Done",
  "completed_at": "31-10-2023",
  "sprint": "44/2023",
  "okr": "Improve customer satisfaction"
},
{
  "title": "Implement Augmented Reality Product Preview",
  "assignee": "Michael Johnson",
  "duration": 32,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "01-11-2023",
  "sprint": "44/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Implement Gamification Elements",
  "assignee": "Jane Smith",
  "duration": 24,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "Done",
  "completed_at": "03-11-2023",
  "sprint": "44/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Optimize Checkout Page Load Time",
  "assignee": "James Martin",
  "duration": 30,
  "estimate": 40,
  "time_spent_in_blocked": 0,
  "status": "In Progress",
  "completed_at": "",
  "sprint": "45/2023",
  "okr": "Neutral"
},
{
  "title": "Implement Social Authentication",
  "assignee": "Alice Brown",
  "duration": 4,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "In Progress",
  "completed_at": "",
  "sprint": "45/2023",
  "okr": "Increase platform reach"
},
{
  "title": "Implement Dynamic Pricing",
  "assignee": "Michael Johnson",
  "duration": 10,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "In Progress",
  "completed_at": "",
  "sprint": "45/2023",
  "okr": "Increase sale margins"
},
{
  "title": "Enhance Seller Dashboard",
  "assignee": "",
  "duration": 0,
  "estimate": 24,
  "time_spent_in_blocked": 0,
  "status": "To Do",
  "completed_at": "",
  "sprint": "46/2023",
  "okr": "Improve seller experience"
},
{
  "title": "Implement Voice Search",
  "assignee": "",
  "duration": 0,
  "estimate": 32,
  "time_spent_in_blocked": 0,
  "status": "To Do",
  "completed_at": "",
  "sprint": "46/2023",
  "okr": "Increase conversion rate"
},
{
  "title": "Fix Issue With Dynamicc Pricing",
  "assignee": "",
  "duration": 0,
  "estimate": 16,
  "time_spent_in_blocked": 0,
  "status": "To Do",
  "completed_at": "",
  "sprint": "46/2023",
  "okr": "Neutral"
}]

Using the data above, and knowing that I am James Martin, we're on the 12th of November of 2023 and the current sprint is "45/2023".
For all questions regarding time and date intervals, use the "completed_at" field in the JSON structure.
Answer the following question in the most summarized way possible:\n`;

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    temperature: 0,
    messages: [{ role: "user", content: data + prompt }],
    model,
    stream: true,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
