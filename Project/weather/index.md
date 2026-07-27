# 🔑 What an API Key Is

- An API key is a unique identifier (like a password) used to authenticate requests made to an API (Application Programming Interface).
- It’s usually a long string of letters and numbers that you include when calling an API.

* 🎯 Main Uses of an API Key

- Authentication: Confirms that the request is coming from a valid user or application.
- Authorization: Determines what level of access you have (e.g., read-only vs. full access).
- Usage Tracking: Helps the API provider monitor how often and how much you’re using their service.
- Rate Limiting: Prevents abuse by limiting the number of requests you can make in a given time.
- Billing: If the API is paid, the key links usage to your account for billing purposes.
- Security: Protects the API from unauthorized access and ensures only trusted clients can interact with it.

* ⚙️ Example in Practice

Imagine you’re building a weather app:

- You sign up for a weather API service.
- They give you an API key.
- Every time your app requests weather data, it sends the key along.
- The API checks the key → if valid, it returns the weather info; if not, it rejects the request.
  import requests

api_key = "YOUR_API_KEY"
city = "Delhi"
url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}"

response = requests.get(url)
print(response.json())

Here, the api_key ensures the weather service knows who is asking and whether they’re allowed to.
