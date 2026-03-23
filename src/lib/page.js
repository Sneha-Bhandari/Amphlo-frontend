export const fetchData = async (data) => {
    try {
      const res = await fetch(`https://websitebackend.amphlo.com/${data}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text();
      const json = text ? JSON.parse(text) : {}; 
  
      return json;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; 
    }
  };
  

  export const postData = async (imageUrl, data) => {
  try {
    const res = await fetch(`https://websitebackend.amphlo.com/uploads/${imageUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Post error:", error);
    throw error;
  }
};
aman