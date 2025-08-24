import { useState, useEffect } from 'react';
import { 
  Box, VStack, HStack, Text, Button, 
  Select, Textarea, useToast, Badge 
} from '@chakra-ui/react';

const AgentTester = () => {
  const [selectedAgent, setSelectedAgent] = useState('openai');
  const [testInput, setTestInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const agents = [
    { value: 'openai', label: 'OpenAI GPT-4', color: 'blue' },
    { value: 'huggingface', label: 'HuggingFace', color: 'purple' },
    { value: 'gemini', label: 'Google Gemini', color: 'teal' },
    { value: 'ollama', label: 'Ollama Local', color: 'orange' },
    { value: 'stability', label: 'Stability AI', color: 'pink' }
  ];

  const testAgent = async () => {
    if (!testInput.trim()) {
      toast({
        title: "Please enter test input",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/agent/${selectedAgent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testInput,
          context: 'Test from Agent Tester'
        }),
      });

      const data = await response.json();
      setResponse(data);
      
      toast({
        title: "Agent tested successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error testing agent",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.700" borderRadius="lg" p={4} minW="400px">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" color="blue.200">Agent Tester</Text>
        
        <Select 
          value={selectedAgent} 
          onChange={(e) => setSelectedAgent(e.target.value)}
          bg="gray.600"
          color="white"
        >
          {agents.map(agent => (
            <option key={agent.value} value={agent.value}>
              {agent.label}
            </option>
          ))}
        </Select>
        
        <Textarea
          placeholder="Enter test input..."
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          bg="gray.600"
          color="white"
          rows={3}
        />
        
        <Button 
          colorScheme="blue" 
          onClick={testAgent} 
          isLoading={loading}
          loadingText="Testing..."
        >
          Test Agent
        </Button>
        
        {response && (
          <Box bg="gray.600" p={3} borderRadius="md">
            <VStack spacing={2} align="start">
              <HStack>
                <Text fontWeight="bold" color="white">Response:</Text>
                <Badge 
                  colorScheme={response.status === 'success' ? 'green' : response.status === 'error' ? 'red' : 'yellow'}
                  variant="solid"
                >
                  {response.status}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.200">
                {response.response || response.error || 'No response'}
              </Text>
              {response.personality && (
                <Badge colorScheme="purple" variant="outline">
                  {response.personality.replace('_', ' ')}
                </Badge>
              )}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AgentTester;
