export async function GET(){
  return Response.json({
    name:"LARDI INTELLIGENCE API",
    base:"https://lardi-ai.vercel.app",
    keys:"Your keys: LI-sk-1wUOHWuJXCWKCDHNBMBtjXSjnirI etc",
    endpoints:{
      generate:"POST /api/generate-key -> get LI-sk- key",
      chat:"POST /api/li with {apiKey,message}",
      docs:"GET /api/docs"
    },
    example:"curl -X POST https://lardi-ai.vercel.app/api/li -H 'Content-Type: application/json' -d '{\"apiKey\":\"LI-sk-1wUOHWuJXCWKCDHNBMBtjXSjnirI\",\"message\":\"Hello LI\"}'"
  });
}