import unittest
from unittest.mock import patch, Mock
import chat 

class TestChatbotResponse(unittest.TestCase):

    @patch('chat.openai.Completion.create')
    def test_chatbot_response(self, mock_completion_create):
        # Set up the mock response from the OpenAI API
        mock_response = Mock()
        mock_response.choices[0].text.strip.return_value = "Bot: Mocked response"
        mock_completion_create.return_value = mock_response

        # Test the chatbot_response function
        prompt = "Hello, chatbot!"
        response = chat.chatbot_response(prompt)

        self.assertEqual(response, "Bot: Mocked response")
        mock_completion_create.assert_called_once_with(
            engine="text-davinci-002", prompt=prompt, max_tokens=150
        )

if __name__ == '__main__':
    unittest.main()
