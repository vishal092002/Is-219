import openai

# Set up your API key
openai.api_key = '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'

def chatbot_response(prompt):
    response = openai.Completion.create(engine="text-davinci-002", prompt=prompt, max_tokens=150)
    return response.choices[0].text.strip()

# Test your chatbot
user_input = input("You: ")
while user_input.lower() != "exit":
    response = chatbot_response(user_input)
    print("Bot:", response)
    user_input = input("You: ")
