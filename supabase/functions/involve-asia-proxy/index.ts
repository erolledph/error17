const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const apiPath = url.pathname.replace('/functions/v1/involve-asia-proxy', '');
    const targetUrl = `https://api.involve.asia${apiPath}`;
    
    console.log('Proxying request to:', targetUrl);
    console.log('Request method:', req.method);

    // Get request body
    const requestBody = await req.json();
    console.log('Request body:', requestBody);

    // Get authorization header if present
    const authHeader = req.headers.get('authorization');
    
    // Convert JSON to form data for Involve Asia API
    const formData = new URLSearchParams();
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key] !== undefined && requestBody[key] !== null) {
        formData.append(key, requestBody[key]);
      }
    });

    console.log('Form data:', formData.toString());

    // Prepare headers for the API request
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; InvolveAsia-Proxy/1.0)',
    };

    // Add authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    console.log('Request headers:', headers);

    // Make the request to Involve Asia API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get response text
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      responseData = { error: 'Invalid JSON response', raw: responseText };
    }

    // Return the response
    return new Response(
      JSON.stringify(responseData),
      {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Proxy error:', error);
    
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: 'Proxy server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});