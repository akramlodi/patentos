import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

  const systemContext = `You are a friendly and practical AI business advisor for Sharma Electronics,
a small electronics retail shop in Bangalore, India.
Key business facts:
- Monthly revenue: ₹2,84,500 (up 12.5% from last month)
- Pending payments: ₹38,200 across 5 invoices
- Low stock items: Samsung Charger (2 units), USB Hub (3 units), HDMI Cable (1 unit)
- Top customer: Kumar Traders (₹68,900 total spending)
- Best selling product: Samsung 25W Charger
- Total products: 10 | Total customers: 7 | Total invoices: 10
Keep responses concise (under 130 words), practical, and encouraging.
Use Indian business context. Format with short paragraphs, no markdown headers.`;

  const result = await model.generateContent(`${systemContext}\n\nUser question: ${message}`);
  return Response.json({ response: result.response.text() });
}
